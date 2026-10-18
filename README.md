# Προσωπικός Δικηγόρος · Personal Lawyer (prototype)

Bilingual (Greek default / English) chat prototype for guidance on **Greek law**. Express backend + single-page vanilla HTML/CSS/JS frontend. No build step.

> Informational prototype only — **not** a substitute for a licensed lawyer.

## Features
- **EL / EN toggle** (top bar, default Greek) covering all UI text, category cards, intake questions and source-link labels. Choice is remembered.
- Landing with 10 category cards → guided intake (quick-answer chips + free text, category-specific) → free chat with the intake used as context.
- Streaming answers (SSE) from any OpenAI-compatible `/chat/completions` API (default xAI / Grok).
- The lawyer **replies in the language the user writes in** (Greek or English). In English, Greek law is cited with Greek names/articles plus an English explanation (e.g. "article 914 ΑΚ (Civil Code — tort liability)").
- Structured answers: 1) brief assessment, 2) applicable law with articles, 3) similar case law (only what the model is confident exists — never invented), 4) steps, 5) deadlines/limitation periods, 6) when to see a lawyer, plus clarifying questions.
- **Case-law search helper** under every answer: HUDOC, EUR-Lex, CURIA, Areios Pagos (areiospagos.gr), Council of State (ste.gr), ΕΤ/ΦΕΚ (et.gr), ΑΑΔΕ (aade.gr), built from keywords in your question (falls back to the category topic).
- Client-side history (localStorage): case list drawer, **New case** button, copy-answer button, stop button, retry on error.
- **Demo mode** when `LLM_API_KEY` is empty: banner + canned Greek/English answer so the UI can be tested for free.
- Light protection of your key: in-memory per-IP rate limit (`RATE_LIMIT_PER_MIN`, default 20).

## Run locally
Requires Node 18+ (20 recommended).

```bash
cd greek-lawyer
npm install
npm start                 # demo mode, http://localhost:3000
```

With a real model:

```bash
LLM_API_KEY=xai-... npm start
# or: cp .env.example .env, fill it in, and use `npm run dev` (Node >= 20.6, auto-reload)
```

Quick API check (demo mode):

```bash
curl -s localhost:3000/api/config
curl -s -X POST localhost:3000/api/chat -H 'Content-Type: application/json' \
  -d '{"lang":"el","messages":[{"role":"user","content":"Ο ιδιοκτήτης δεν μου επιστρέφει την εγγύηση"}],"stream":false}'
# streaming (SSE) = omit "stream":false
```

## Environment variables
| Var | Default | Notes |
|---|---|---|
| `LLM_API_KEY` | _(empty)_ | Empty ⇒ **demo mode**. |
| `LLM_BASE_URL` | `https://api.x.ai/v1` | Any OpenAI-compatible base URL (OpenAI, OpenRouter, local vLLM/Ollama `…/v1`). |
| `LLM_MODEL` | `grok-4` | Any model id your provider offers. |
| `PORT` | `3000` | Render sets this automatically. |
| `RATE_LIMIT_PER_MIN` | `20` | Chat requests per IP per minute. |

## API
`POST /api/chat` body:
```json
{ "lang": "el|en", "category": "Αστικό (Αστικό / Civil)",
  "intake": [{"q": "…", "a": "…"}],
  "messages": [{"role": "user|assistant", "content": "…"}],
  "stream": true }
```
`stream:true` (default) → `text/event-stream` with `data: {"t":"chunk"}` … `data: [DONE]` (a first `{"demo":true}` event in demo mode). `stream:false` → `{"demo":bool,"content":"…"}`.
Also: `GET /api/config` (`{demo, model}`), `GET /healthz`.

## Deploy later (Render free web service)
Not deployed yet. When ready: push this folder to a GitHub repo → Render → *New → Blueprint* (uses `render.yaml`) → set `LLM_API_KEY` in the dashboard. Free instances sleep after inactivity (first request is slow). Without the key the deployed app stays in demo mode. Add a spend limit on your LLM key — the rate limiter is only per-instance and in-memory.

## Structure
```
server.js          Express app: static files, /api/chat (SSE proxy / demo), /api/config, /healthz
lib/prompt.js      Greek system prompt (bilingual reply rule) + per-request context builder
lib/demo.js        Canned demo answers (EL/EN) + language detection
public/index.html  SPA shell
public/style.css   Dark/gold theme, responsive
public/data.js     All bilingual content: UI strings, categories, intake questions, source labels
public/app.js      Views, intake flow, streaming client, markdown renderer, source links, history
render.yaml        Render blueprint (free plan)
```

## Notes / limitations
- Case-law links to areiospagos.gr, ste.gr, et.gr and aade.gr use a Google `site:` query (those sites have no stable public deep-link search URL). HUDOC / EUR-Lex / CURIA use their own search URLs (best-effort parameters).
- LLMs can be wrong about law. The prompt forbids inventing case numbers, but always verify citations in the official sources.
- Conversations are sent to the configured LLM provider; they are stored on the user's device only (no server database).
- Not yet implemented: auth, server-side persistence, document upload, export to PDF.
