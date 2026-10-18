'use strict';

const path = require('path');
const express = require('express');
const { buildSystemPrompt } = require('./lib/prompt');
const { demoAnswer } = require('./lib/demo');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const LLM_API_KEY = (process.env.LLM_API_KEY || '').trim();
const LLM_BASE_URL = (process.env.LLM_BASE_URL || 'https://api.x.ai/v1').replace(/\/+$/, '');
const LLM_MODEL = process.env.LLM_MODEL || 'grok-4';
const RATE_LIMIT = parseInt(process.env.RATE_LIMIT_PER_MIN, 10) || 20;
const DEMO = !LLM_API_KEY;

const MAX_MESSAGES = 30;
const MAX_CHARS = 6000;

const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(express.json({ limit: '200kb' }));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'same-origin');
  next();
});

app.use(express.static(path.join(__dirname, 'public'), { maxAge: '5m' }));

app.get('/healthz', (req, res) => res.json({ ok: true }));
app.get('/api/config', (req, res) => res.json({ demo: DEMO, model: DEMO ? null : LLM_MODEL }));

// --- tiny in-memory rate limiter (per IP, per minute) ---
const hits = new Map();
setInterval(() => hits.clear(), 60 * 1000).unref();
function rateLimit(req, res, next) {
  const ip = req.ip || 'x';
  const n = (hits.get(ip) || 0) + 1;
  hits.set(ip, n);
  if (n > RATE_LIMIT) {
    return res.status(429).json({ error: 'rate_limited', message: 'Too many requests / Πολλά αιτήματα. Δοκιμάστε σε λίγο.' });
  }
  next();
}

function sanitizeMessages(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
}

function sse(res, obj) { res.write(`data: ${JSON.stringify(obj)}\n\n`); }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

app.post('/api/chat', rateLimit, async (req, res) => {
  const body = req.body || {};
  const messages = sanitizeMessages(body.messages);
  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'bad_request', message: 'messages must end with a user message' });
  }
  const lang = body.lang === 'en' ? 'en' : 'el';
  const category = typeof body.category === 'string' ? body.category.slice(0, 200) : '';
  const intake = Array.isArray(body.intake)
    ? body.intake.slice(0, 12).map((x) => ({ q: String((x && x.q) || '').slice(0, 300), a: String((x && x.a) || '').slice(0, 600) }))
    : [];
  const wantStream = body.stream !== false;
  const lastUser = messages[messages.length - 1].content;

  // ---------- DEMO MODE ----------
  if (DEMO) {
    const text = demoAnswer(lastUser, lang);
    if (!wantStream) return res.json({ demo: true, content: text });
    res.set({ 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
    res.flushHeaders();
    let closed = false;
    res.on('close', () => { closed = true; });
    sse(res, { demo: true });
    const chunk = 14;
    for (let i = 0; i < text.length && !closed; i += chunk) {
      sse(res, { t: text.slice(i, i + chunk) });
      await sleep(12);
    }
    if (!closed) { res.write('data: [DONE]\n\n'); res.end(); }
    return;
  }

  // ---------- LIVE MODE (OpenAI-compatible) ----------
  const payload = {
    model: LLM_MODEL,
    stream: wantStream,
    temperature: 0.3,
    messages: [{ role: 'system', content: buildSystemPrompt({ category, intake, lang }) }, ...messages]
  };

  const ac = new AbortController();
  res.on('close', () => { if (!res.writableEnded) ac.abort(); });
  const timeout = setTimeout(() => ac.abort(), 170 * 1000);

  try {
    const upstream = await fetch(`${LLM_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${LLM_API_KEY}` },
      body: JSON.stringify(payload),
      signal: ac.signal
    });

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => '');
      console.error('LLM upstream error', upstream.status, errText.slice(0, 500));
      const status = upstream.status === 401 || upstream.status === 403 ? 502 : upstream.status === 429 ? 429 : 502;
      return res.status(status).json({ error: 'llm_error', status: upstream.status, message: 'LLM provider error (' + upstream.status + ')' });
    }

    if (!wantStream) {
      const data = await upstream.json();
      const content = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      return res.json({ demo: false, content: content || '' });
    }

    res.set({ 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
    res.flushHeaders();

    const decoder = new TextDecoder();
    let buf = '';
    for await (const part of upstream.body) {
      buf += decoder.decode(part, { stream: true });
      let idx;
      while ((idx = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, idx).trim();
        buf = buf.slice(idx + 1);
        if (!line.startsWith('data:')) continue;
        const data = line.slice(5).trim();
        if (data === '[DONE]') continue;
        try {
          const j = JSON.parse(data);
          const delta = j.choices && j.choices[0] && j.choices[0].delta && j.choices[0].delta.content;
          if (delta) sse(res, { t: delta });
        } catch (_) { /* ignore keep-alives / partial */ }
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    if (err && err.name === 'AbortError') {
      if (!res.headersSent) return res.status(504).json({ error: 'timeout', message: 'LLM request timed out / aborted' });
      return res.end();
    }
    console.error('chat error', err && err.message);
    if (!res.headersSent) return res.status(502).json({ error: 'llm_error', message: 'Could not reach the LLM provider' });
    sse(res, { error: 'stream_failed' });
    res.end();
  } finally {
    clearTimeout(timeout);
  }
});

app.use((req, res) => res.status(404).json({ error: 'not_found' }));

app.listen(PORT, () => {
  console.log(`Greek Lawyer listening on :${PORT} — ${DEMO ? 'DEMO MODE (no LLM_API_KEY)' : `LLM ${LLM_BASE_URL} model=${LLM_MODEL}`}`);
});
