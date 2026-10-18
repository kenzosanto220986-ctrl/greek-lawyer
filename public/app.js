/* Προσωπικός Δικηγόρος / Personal Lawyer — vanilla SPA (EL/EN) */
(function () {
  'use strict';
  const { UI, CATEGORIES, SOURCES, STOPWORDS } = window.GL_DATA;
  const KEY = 'glawyer.v1';
  const $ = (id) => document.getElementById(id);

  // ---------- state ----------
  let S = load();
  let streaming = null; // { ac, el, text }
  let demoMode = false;

  function load() {
    try {
      const j = JSON.parse(localStorage.getItem(KEY) || '{}');
      return { lang: j.lang === 'en' ? 'en' : 'el', cases: Array.isArray(j.cases) ? j.cases : [], currentId: j.currentId || null };
    } catch (_) { return { lang: 'el', cases: [], currentId: null }; }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (_) { /* quota */ } }
  const lang = () => S.lang;
  const t = (k) => (UI[k] ? UI[k][lang()] : k);
  const tr = (o) => (o ? o[lang()] : '');
  const cur = () => S.cases.find((c) => c.id === S.currentId) || null;
  const catOf = (c) => CATEGORIES.find((x) => x.id === c.cat);
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  // ---------- markdown (safe, minimal) ----------
  function inline(s) {
    s = esc(s);
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, '$1<em>$2</em>');
    s = s.replace(/(^|[^\w])_([^_\n]+)_(?!\w)/g, '$1<em>$2</em>');
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    return s;
  }
  function md(src) {
    const lines = String(src).replace(/\r/g, '').split('\n');
    let out = '', list = null, para = [], quote = [];
    const flushPara = () => { if (para.length) { out += '<p>' + inline(para.join(' ')) + '</p>'; para = []; } };
    const flushList = () => { if (list) { out += `</${list}>`; list = null; } };
    const flushQuote = () => { if (quote.length) { out += '<blockquote>' + quote.map((q) => '<p>' + inline(q) + '</p>').join('') + '</blockquote>'; quote = []; } };
    for (const raw of lines) {
      const line = raw.trimEnd();
      let m;
      if (!line.trim()) { flushPara(); flushList(); flushQuote(); continue; }
      if ((m = line.match(/^>\s?(.*)$/))) { flushPara(); flushList(); quote.push(m[1]); continue; }
      flushQuote();
      if ((m = line.match(/^(#{1,4})\s+(.*)$/))) { flushPara(); flushList(); const lv = Math.min(4, Math.max(2, m[1].length)); out += `<h${lv}>${inline(m[2])}</h${lv}>`; continue; }
      if ((m = line.match(/^\s*[-*•]\s+(.*)$/))) { flushPara(); if (list !== 'ul') { flushList(); out += '<ul>'; list = 'ul'; } out += '<li>' + inline(m[1]) + '</li>'; continue; }
      if ((m = line.match(/^\s*\d+[.)]\s+(.*)$/))) { flushPara(); if (list !== 'ol') { flushList(); out += '<ol>'; list = 'ol'; } out += '<li>' + inline(m[1]) + '</li>'; continue; }
      flushList(); para.push(line.trim());
    }
    flushPara(); flushList(); flushQuote();
    return out;
  }

  // ---------- source links ----------
  const strip = (w) => w.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const STOP = new Set([...STOPWORDS].map(strip));
  function keywords(text, n) {
    const words = (text || '').toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, ' ').split(/\s+/)
      .filter((w) => w.length >= 4 && !/^\d+$/.test(w) && !STOP.has(strip(w)));
    const seen = new Set(); const uniq = [];
    words.forEach((w, i) => { const k = strip(w); if (!seen.has(k)) { seen.add(k); uniq.push({ w, i }); } });
    return uniq.sort((a, b) => b.w.length - a.w.length).slice(0, n).sort((a, b) => a.i - b.i).map((x) => x.w);
  }
  const isGreek = (w) => /[\u0370-\u03ff\u1f00-\u1fff]/.test(w);
  function buildSources(text, cat) {
    const kws = keywords(text, 6);
    const el = kws.filter(isGreek).slice(0, 4);
    const en = kws.filter((w) => !isGreek(w)).slice(0, 4);
    const elQ = (el.length ? el : (cat ? cat.topicEl.split(' ') : ['ελληνικό', 'δίκαιο'])).join(' ');
    const enQ = (en.length ? en : (cat ? cat.topicEn.split(' ') : ['Greek', 'law'])).join(' ');
    const useEl = el.length > 0;
    const g = (site, q) => 'https://www.google.com/search?q=' + encodeURIComponent('site:' + site + ' ' + q);
    const urls = {
      hudoc: 'https://hudoc.echr.coe.int/eng#' + JSON.stringify({ fulltext: [encodeURIComponent(enQ)] }).replace(/"/g, '%22'),
      eurlex: 'https://eur-lex.europa.eu/search.html?scope=EURLEX&type=quick&lang=' + (useEl ? 'el' : 'en') + '&text=' + encodeURIComponent(useEl ? elQ : enQ),
      curia: 'https://curia.europa.eu/juris/liste.jsf?language=' + (useEl ? 'el' : 'en') + '&text=' + encodeURIComponent(useEl ? elQ : enQ),
      ap: g('areiospagos.gr', elQ),
      ste: g('ste.gr', elQ),
      fek: g('et.gr', elQ),
      aade: g('aade.gr', elQ)
    };
    const terms = [...new Set([...(el.length ? el : []), ...(en.length ? en : []), ...(!el.length && !en.length ? [elQ, enQ] : [])])];
    return { links: SOURCES.map((s) => ({ ...s, url: urls[s.id] })), terms: terms.length ? terms : [elQ, enQ] };
  }
  function sourcesHtml(text, cat) {
    const { links, terms } = buildSources(text, cat);
    return '<div class="sources"><h4>' + esc(t('sourcesTitle')) + '</h4>' +
      '<div class="terms"><span>' + esc(t('sourcesTerms')) + ':</span>' + terms.map((x) => '<span class="tag">' + esc(x) + '</span>').join('') + '</div>' +
      '<div class="src-grid">' + links.map((l) => '<a class="src" href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer"><b>' + esc(tr(l.name)) + ' ↗</b><span>' + esc(tr(l.desc)) + '</span></a>').join('') + '</div>' +
      '<p class="src-note">' + esc(t('sourcesNote')) + '</p></div>';
  }

  // ---------- static text / language ----------
  function applyLang() {
    document.documentElement.lang = lang();
    $('appName').textContent = t('appName');
    $('tagline').textContent = t('tagline');
    $('heroTitle').innerHTML = t('heroTitle');
    $('heroSub').textContent = t('heroSub');
    $('chooseArea').textContent = t('chooseArea');
    $('privacy').textContent = t('privacy');
    $('newBtn').textContent = '+ ' + t('newCase');
    $('historyBtn').textContent = t('history');
    $('historyTitle').textContent = t('historyTitle');
    $('drawerClose').textContent = t('close');
    $('clearAll').textContent = t('clearAll');
    $('footNote').textContent = t('footer');
    $('skipBtn').textContent = t('skip');
    $('sendBtn').setAttribute('aria-label', t('send'));
    $('demoBanner').textContent = t('demoBanner');
    $('demoBanner').hidden = !demoMode;
    document.title = t('appName') + ' · ' + (lang() === 'el' ? 'Personal Lawyer' : 'Προσωπικός Δικηγόρος');
    document.querySelectorAll('.lang-btn').forEach((b) => b.classList.toggle('active', b.dataset.lang === lang()));
    $('cards').innerHTML = CATEGORIES.map((c) =>
      '<button type="button" class="card" data-cat="' + c.id + '"><span class="ic"><svg viewBox="0 0 24 24"><path d="' + c.icon + '"/></svg></span><h3>' + esc(tr(c.name)) + '</h3><p>' + esc(tr(c.blurb)) + '</p></button>').join('');
  }

  // ---------- views ----------
  function show(view) { $('home').hidden = view !== 'home'; $('convo').hidden = view !== 'convo'; }

  function render() {
    const c = cur();
    if (!c || !catOf(c)) { show('home'); window.scrollTo(0, 0); return; }
    show('convo');
    renderContext(c);
    if (c.stage === 'intake') renderIntake(c); else renderChat(c);
    renderDock(c);
  }

  function renderContext(c) {
    const cat = catOf(c);
    const bar = $('progress');
    if (c.stage === 'intake') {
      bar.hidden = false;
      const total = cat.questions.length + 1;
      $('progressBar').style.width = Math.round((c.step / total) * 100) + '%';
    } else bar.hidden = true;
    let html = '<span class="tag cat">' + esc(tr(cat.name)) + '</span>';
    if (c.stage === 'chat') {
      const ans = c.answers.filter((a) => a.a);
      if (ans.length) html += '<span class="context-label">' + esc(t('context')) + '</span>' + ans.map((a) => '<span class="tag" title="' + esc(a.q) + '">' + esc(a.a) + '</span>').join('');
    }
    $('context').innerHTML = html;
  }

  function msgHtml(role, inner, cls) {
    return '<div class="msg ' + role + (cls ? ' ' + cls : '') + '"><div class="who">' + esc(role === 'user' ? t('you') : t('lawyer')) + '</div>' + inner + '</div>';
  }

  function renderIntake(c) {
    const cat = catOf(c);
    const total = cat.questions.length + 1;
    let html = msgHtml('assistant', '<div class="bubble">' + esc(t('introBubble')) + '</div>', 'q');
    for (let i = 0; i <= c.step; i++) {
      const isDesc = i === cat.questions.length;
      const qText = isDesc ? t('descQuestion') : tr(cat.questions[i].q);
      html += msgHtml('assistant', '<div class="stepno">' + esc(t('stepOf').replace('{n}', i + 1).replace('{total}', total)) + '</div><div class="bubble">' + esc(qText) + '</div>', 'q');
      if (i < c.step) {
        const a = c.answers[i];
        html += msgHtml('user', '<div class="bubble">' + esc(a && a.a ? a.a : t('skipped')) + '</div>');
      }
    }
    $('messages').innerHTML = html;
    scrollBottom(true);
  }

  function renderChat(c) {
    const cat = catOf(c);
    let html = '';
    c.messages.forEach((m, i) => {
      if (m.role === 'user') html += msgHtml('user', '<div class="bubble">' + esc(m.content) + '</div>');
      else if (m.error) html += '<div class="msg assistant error"><div class="bubble">' + esc(m.content) + ' <button type="button" class="btn small" data-retry="1">' + esc(t('retry')) + '</button></div></div>';
      else {
        let prevUser = '';
        for (let j = i - 1; j >= 0; j--) if (c.messages[j].role === 'user') { prevUser = c.messages[j].content; break; }
        html += '<div class="msg assistant" data-i="' + i + '"><div class="who">' + esc(t('lawyer')) + '</div><div class="bubble md">' + md(m.content) + '</div>' +
          '<div class="actions"><button type="button" class="btn small" data-copy="' + i + '">' + esc(t('copy')) + '</button></div>' +
          sourcesHtml(prevUser, cat) + '</div>';
      }
    });
    if (streaming) html += '<div class="msg assistant" id="streamMsg"><div class="who">' + esc(t('lawyer')) + '</div><div class="bubble md" id="streamBubble"><span class="typing"><i></i><i></i><i></i></span></div></div>';
    $('messages').innerHTML = html;
    if (streaming) streaming.el = $('streamBubble');
    scrollBottom(!streaming);
  }

  function renderDock(c) {
    const chips = $('chips'); const input = $('input'); const skip = $('skipBtn');
    chips.innerHTML = '';
    skip.hidden = true;
    if (c.stage === 'intake') {
      const cat = catOf(c);
      const isDesc = c.step === cat.questions.length;
      if (!isDesc) {
        chips.innerHTML = cat.questions[c.step].chips.map((ch, i) => '<button type="button" class="chip" data-chip="' + i + '">' + esc(tr(ch)) + '</button>').join('');
        skip.hidden = false;
        input.placeholder = t('freeTextPh');
      } else input.placeholder = t('descPh');
    } else input.placeholder = t('chatPh');
    setBusy(!!streaming);
    autosize();
  }

  function setBusy(b) {
    const send = $('sendBtn');
    send.classList.toggle('stop', b);
    send.setAttribute('aria-label', b ? t('stop') : t('send'));
  }

  function scrollBottom(force) {
    const nearBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 160;
    if (force || nearBottom) window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
  }
  function autosize() { const i = $('input'); i.style.height = 'auto'; i.style.height = Math.min(i.scrollHeight, 180) + 'px'; }

  // ---------- case lifecycle ----------
  function startCase(catId) {
    const c = { id: uid(), created: Date.now(), updated: Date.now(), cat: catId, stage: 'intake', step: 0, answers: [], messages: [], title: '' };
    S.cases.unshift(c); S.currentId = c.id; save(); render();
    $('input').focus({ preventScroll: true });
  }
  function goHome() { abortStream(); S.currentId = null; save(); render(); }

  function answerIntake(text, skipped) {
    const c = cur(); if (!c || c.stage !== 'intake') return;
    const cat = catOf(c);
    const isDesc = c.step === cat.questions.length;
    text = (text || '').trim();
    if (isDesc) {
      if (!text) return;
      c.stage = 'chat';
      c.messages = [{ role: 'user', content: text }];
      c.title = text.slice(0, 70);
      c.updated = Date.now(); save();
      render(); sendChat();
      return;
    }
    if (!skipped && !text) return;
    c.answers[c.step] = { q: tr(cat.questions[c.step].q), a: skipped ? null : text };
    c.step += 1; c.updated = Date.now(); save();
    render();
  }

  // ---------- chat transport ----------
  function abortStream() { if (streaming) { try { streaming.ac.abort(); } catch (_) {} } }

  async function sendChat() {
    const c = cur(); if (!c || streaming) return;
    const cat = catOf(c);
    const ac = new AbortController();
    streaming = { ac, el: null, text: '' };
    setBusy(true);
    renderChat(c);
    let raf = 0;
    const paint = () => { raf = 0; if (streaming && streaming.el) { streaming.el.innerHTML = md(streaming.text); scrollBottom(false); } };
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ac.signal,
        body: JSON.stringify({
          lang: lang(),
          category: tr(cat.name) + ' (' + cat.name.el + ' / ' + cat.name.en + ')',
          intake: c.answers.filter((a) => a && a.a),
          messages: c.messages.filter((m) => !m.error).map((m) => ({ role: m.role, content: m.content })),
          stream: true
        })
      });
      if (!res.ok) { const e = new Error('http'); e.status = res.status; throw e; }
      const reader = res.body.getReader(); const dec = new TextDecoder(); let buf = ''; let done = false;
      while (!done) {
        const r = await reader.read();
        if (r.done) break;
        buf += dec.decode(r.value, { stream: true });
        let idx;
        while ((idx = buf.indexOf('\n\n')) >= 0) {
          const block = buf.slice(0, idx); buf = buf.slice(idx + 2);
          const line = block.split('\n').find((l) => l.startsWith('data:'));
          if (!line) continue;
          const data = line.slice(5).trim();
          if (data === '[DONE]') { done = true; break; }
          try {
            const j = JSON.parse(data);
            if (j.demo) demoMode = true;
            if (j.error) throw new Error(j.error);
            if (j.t) { streaming.text += j.t; if (!raf) raf = requestAnimationFrame(paint); }
          } catch (err) { if (err.message === 'stream_failed') throw err; }
        }
      }
      const text = streaming.text.trim();
      if (!text) throw new Error('empty');
      c.messages.push({ role: 'assistant', content: text });
    } catch (err) {
      const partial = streaming && streaming.text.trim();
      if (err && err.name === 'AbortError') { if (partial) c.messages.push({ role: 'assistant', content: partial }); }
      else {
        if (partial) c.messages.push({ role: 'assistant', content: partial });
        c.messages.push({ role: 'assistant', error: true, content: err && err.status === 429 ? t('errRate') : t('errGeneric') });
      }
    } finally {
      if (raf) cancelAnimationFrame(raf);
      streaming = null; c.updated = Date.now(); save();
      if (cur() && cur().id === c.id) { renderChat(c); renderDock(c); }
      $('demoBanner').hidden = !demoMode;
    }
  }

  function submitInput() {
    const c = cur(); if (!c) return;
    if (streaming) { abortStream(); return; }
    const v = $('input').value.trim(); if (!v) return;
    $('input').value = ''; autosize();
    if (c.stage === 'intake') return answerIntake(v, false);
    c.messages = c.messages.filter((m) => !m.error);
    c.messages.push({ role: 'user', content: v }); c.updated = Date.now(); save();
    render(); sendChat();
  }

  // ---------- history drawer ----------
  function openHistory() { renderHistory(); $('drawer').hidden = false; }
  function closeHistory() { $('drawer').hidden = true; }
  function renderHistory() {
    const list = S.cases.filter((c) => catOf(c));
    $('clearAll').hidden = !list.length;
    $('historyList').innerHTML = list.length ? list.map((c) => {
      const d = new Date(c.updated).toLocaleString(lang() === 'el' ? 'el-GR' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' });
      return '<div class="hist' + (c.id === S.currentId ? ' active' : '') + '"><button type="button" class="hist-main" data-open="' + c.id + '"><b>' + esc(c.title || t('untitled')) + '</b><small>' + esc(tr(catOf(c).name)) + ' · ' + esc(d) + '</small></button><button type="button" class="hist-del" data-del="' + c.id + '" aria-label="' + esc(t('delete')) + '">✕</button></div>';
    }).join('') : '<p class="empty">' + esc(t('historyEmpty')) + '</p>';
  }

  // ---------- events ----------
  document.addEventListener('click', (e) => {
    const el = e.target.closest('button,a'); if (!el) return;
    if (el.dataset.cat) return startCase(el.dataset.cat);
    if (el.dataset.chip !== undefined) { const c = cur(); const q = catOf(c).questions[c.step]; return answerIntake(tr(q.chips[+el.dataset.chip]), false); }
    if (el.dataset.copy !== undefined) {
      const c = cur(); const m = c.messages[+el.dataset.copy];
      const done = () => { el.textContent = t('copied'); setTimeout(() => { el.textContent = t('copy'); }, 1400); };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(m.content).then(done, done);
      else { const ta = document.createElement('textarea'); ta.value = m.content; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (_) {} ta.remove(); done(); }
      return;
    }
    if (el.dataset.retry) { const c = cur(); c.messages = c.messages.filter((m) => !m.error); save(); return sendChat(); }
    if (el.dataset.open) { abortStream(); S.currentId = el.dataset.open; save(); closeHistory(); return render(); }
    if (el.dataset.del) { if (confirm(t('deleteConfirm'))) { S.cases = S.cases.filter((c) => c.id !== el.dataset.del); if (S.currentId === el.dataset.del) { abortStream(); S.currentId = null; } save(); renderHistory(); render(); } return; }
    if (el.dataset.lang) { if (S.lang !== el.dataset.lang) { S.lang = el.dataset.lang; save(); applyLang(); render(); if (!$('drawer').hidden) renderHistory(); } return; }
  });
  $('newBtn').addEventListener('click', () => { goHome(); });
  $('brand').addEventListener('click', goHome);
  $('historyBtn').addEventListener('click', openHistory);
  $('drawerClose').addEventListener('click', closeHistory);
  $('drawerBackdrop').addEventListener('click', closeHistory);
  $('clearAll').addEventListener('click', () => { if (confirm(t('clearAllConfirm'))) { abortStream(); S.cases = []; S.currentId = null; save(); closeHistory(); render(); } });
  $('skipBtn').addEventListener('click', () => answerIntake('', true));
  $('composer').addEventListener('submit', (e) => { e.preventDefault(); submitInput(); });
  $('input').addEventListener('input', autosize);
  $('input').addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); submitInput(); } });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeHistory(); });

  // ---------- init ----------
  (function init() {
    // an interrupted stream (page closed mid-answer) leaves a trailing user message: keep it, user can resend via retry
    S.cases.forEach((c) => { if (c.stage === 'chat' && c.messages.length && c.messages[c.messages.length - 1].role === 'user') c.messages.push({ role: 'assistant', error: true, content: UI.errGeneric[S.lang] }); });
    applyLang(); render();
    fetch('/api/config').then((r) => r.json()).then((cfg) => { demoMode = !!cfg.demo; $('demoBanner').hidden = !demoMode; }).catch(() => {});
  })();
})();
