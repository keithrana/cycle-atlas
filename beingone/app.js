(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  /* made-up sample people; nothing here is a real person */
  const PEOPLE = [
    { n: 'Mia', a: 28, c: 'Sydney', l: ['beach', 'coffee', 'travel'], t: 'a' },
    { n: 'Arjun', a: 31, c: 'Melbourne', l: ['footy', 'cooking', 'music'], t: 'b' },
    { n: 'Hannah', a: 27, c: 'Brisbane', l: ['beach', 'hiking', 'pets'], t: 'c' },
    { n: 'Wei', a: 30, c: 'Perth', l: ['coffee', 'travel', 'hiking'], t: 'd' },
    { n: 'Sana', a: 29, c: 'Adelaide', l: ['cooking', 'music', 'pets'], t: 'a' },
    { n: 'Tom', a: 33, c: 'Hobart', l: ['hiking', 'footy', 'coffee'], t: 'b' },
    { n: 'Priya', a: 26, c: 'Sydney', l: ['music', 'cooking', 'beach'], t: 'c' },
    { n: 'Jack', a: 35, c: 'Melbourne', l: ['footy', 'beach', 'pets'], t: 'd' },
    { n: 'Elena', a: 32, c: 'Brisbane', l: ['travel', 'coffee', 'music'], t: 'a' },
    { n: 'Dev', a: 34, c: 'Perth', l: ['footy', 'cooking', 'hiking'], t: 'b' },
    { n: 'Grace', a: 30, c: 'Canberra', l: ['hiking', 'coffee', 'pets'], t: 'c' },
    { n: 'Sam', a: 28, c: 'Darwin', l: ['beach', 'footy', 'travel'], t: 'd' },
    { n: 'Lena', a: 38, c: 'Sydney', l: ['travel', 'music', 'pets'], t: 'a' },
    { n: 'Omar', a: 29, c: 'Melbourne', l: ['coffee', 'cooking', 'hiking'], t: 'c' }
  ];

  /* ---------- one reveal, once ---------- */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -10% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- match finder ---------- */
  const st = { city: 'Anywhere', from: 25, to: 40, likes: new Set(), sent: new Set() };
  const selCity = $('#f-city'), from = $('#f-from'), to = $('#f-to');
  const oFrom = $('#o-from'), oTo = $('#o-to'), results = $('#results');
  const status = $('#finder-status'), mapCity = $('#map-city');
  const pins = $$('.pin');

  function scoreOf(p) {
    const mid = (st.from + st.to) / 2, half = Math.max((st.to - st.from) / 2, 1);
    const ageFit = Math.max(0, 1 - Math.abs(p.a - mid) / (half + 4));
    const shared = p.l.filter((x) => st.likes.has(x)).length;
    const likeFit = st.likes.size ? Math.min(1, shared / Math.min(st.likes.size, 3)) : 0.5;
    const cityFit = st.city === 'Anywhere' ? 0.7 : 1;
    return Math.round(55 + 45 * (0.5 * likeFit + 0.3 * ageFit + 0.2 * cityFit));
  }

  function tile(r, i) {
    const p = r.p, sent = st.sent.has(p.n);
    const tags = p.l.map((x) => '<li' + (st.likes.has(x) ? ' class="is-shared"' : '') + '>' + cap(x) + '</li>').join('');
    return '<article class="person" style="--i:' + i + '">' +
      '<div class="person__who"><span class="avatar" style="--tone:var(--tone-' + p.t + ')" aria-hidden="true">' + p.n.charAt(0) + '</span>' +
      '<div><h3>' + p.n + ', ' + p.a + '</h3><p class="label">' + p.c + '</p></div></div>' +
      '<div><div class="score"><b>' + r.score + '</b><span class="label" title="Counts shared interests, city and age">match</span></div>' +
      '<div class="bar" role="img" aria-label="Match score ' + r.score + ' out of 100"><i style="--s:' + r.score + '"></i></div></div>' +
      '<ul class="tags">' + tags + '</ul>' +
      '<button class="btn btn--sm" type="button" data-interest="' + p.n + '" aria-pressed="' + sent + '">' + (sent ? 'Interest sent' : 'Send interest') + '</button>' +
      '</article>';
  }

  function renderFinder() {
    const pool = PEOPLE
      .filter((p) => (st.city === 'Anywhere' || p.c === st.city) && p.a >= st.from && p.a <= st.to)
      .map((p) => ({ p, score: scoreOf(p) }))
      .sort((x, y) => y.score - x.score || x.p.n.localeCompare(y.p.n));
    const top = pool.slice(0, 4);
    results.innerHTML = top.length
      ? top.map(tile).join('')
      : '<p class="results__empty">No one fits yet. Widen the ages or try another city.</p>';
    const where = st.city === 'Anywhere' ? 'all of Australia' : st.city;
    status.textContent = top.length ? top.length + ' of ' + pool.length + ' shown.' : '';
    mapCity.textContent = st.city === 'Anywhere' ? 'All of Australia' : st.city;
    selCity.value = st.city;
    pins.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.city === st.city)));
  }

  pins.forEach((b) => b.addEventListener('click', () => {
    st.city = st.city === b.dataset.city ? 'Anywhere' : b.dataset.city;
    renderFinder();
  }));
  selCity.addEventListener('change', () => { st.city = selCity.value; renderFinder(); });
  from.addEventListener('input', () => {
    st.from = +from.value;
    if (st.from > st.to) { st.to = st.from; to.value = st.to; }
    oFrom.textContent = st.from; oTo.textContent = st.to; renderFinder();
  });
  to.addEventListener('input', () => {
    st.to = +to.value;
    if (st.to < st.from) { st.from = st.to; from.value = st.from; }
    oFrom.textContent = st.from; oTo.textContent = st.to; renderFinder();
  });
  $$('#f-likes input').forEach((c) => c.addEventListener('change', () => {
    c.checked ? st.likes.add(c.value) : st.likes.delete(c.value);
    renderFinder();
  }));
  results.addEventListener('click', (e) => {
    const b = e.target.closest('[data-interest]');
    if (!b) return;
    const name = b.dataset.interest;
    st.sent.has(name) ? st.sent.delete(name) : st.sent.add(name);
    const on = st.sent.has(name);
    b.setAttribute('aria-pressed', String(on));
    b.textContent = on ? 'Interest sent' : 'Send interest';
  });
  renderFinder();

  /* ---------- the four checks ---------- */
  const rows = $$('[data-check]'), vStatus = $('#v-status'), vText = $('#v-status-text');
  const timers = new Map();
  function updateChecks() {
    const n = rows.filter((r) => r.classList.contains('is-done')).length;
    vStatus.dataset.state = n === rows.length ? 'done' : 'idle';
    vText.textContent = n === rows.length ? 'Verified' : n ? n + ' of 4 passed' : 'Not verified yet';
  }
  function runCheck(row) {
    if (row.classList.contains('is-done') || timers.has(row)) return;
    const btn = $('[data-run]', row);
    btn.setAttribute('aria-busy', 'true'); btn.disabled = true; btn.textContent = 'Checking…';
    timers.set(row, setTimeout(() => {
      timers.delete(row);
      row.classList.add('is-done');
      btn.hidden = true; btn.removeAttribute('aria-busy');
      $('.passed', row).hidden = false;
      updateChecks();
    }, 800));
  }
  rows.forEach((r) => $('[data-run]', r).addEventListener('click', () => runCheck(r)));
  $('#v-all').addEventListener('click', () => rows.forEach((r, i) => setTimeout(() => runCheck(r), i * 250)));
  $('#v-reset').addEventListener('click', () => {
    timers.forEach((t) => clearTimeout(t)); timers.clear();
    rows.forEach((r) => {
      r.classList.remove('is-done');
      const btn = $('[data-run]', r);
      btn.hidden = false; btn.disabled = false; btn.removeAttribute('aria-busy'); btn.textContent = 'Run check';
      $('.passed', r).hidden = true;
    });
    updateChecks();
  });

  /* ---------- photo privacy ---------- */
  const photo = $('#photo'), photoState = $('#photo-state');
  const rank = { stranger: 0, verified: 1, accepted: 2 };
  function renderPhoto() {
    const setting = $('input[name="setting"]:checked').value;
    const viewer = $('input[name="viewer"]:checked').value;
    const can = setting === 'everyone' ||
      (setting === 'verified' && rank[viewer] >= 1) ||
      (setting === 'accepted' && rank[viewer] >= 2);
    photo.classList.toggle('is-hidden', !can);
    photoState.textContent = can ? 'Visible to this visitor' : 'Hidden from this visitor';
  }
  $$('input[name="setting"], input[name="viewer"]').forEach((r) => r.addEventListener('change', renderPhoto));
  renderPhoto();

  /* ---------- interest, accept, chat ---------- */
  const chat = $('#chat'), log = $('#chat-log'), tResult = $('#t-result');
  const accept = $('#t-accept'), decline = $('#t-decline'), tReset = $('#t-reset');
  const chatForm = $('#chat-form'), chatInput = $('#chat-input');
  function addLine(text, cls) {
    const li = document.createElement('li');
    if (cls) li.className = cls;
    li.textContent = text;
    log.appendChild(li);
    log.scrollTop = log.scrollHeight;
  }
  function decide(yes) {
    accept.hidden = true; decline.hidden = true; tReset.hidden = false;
    tResult.textContent = yes ? 'You both said yes. Say hello.' : 'You said no thanks. Nothing opens.';
    if (yes) {
      chat.classList.remove('is-locked');
      addLine('You and Priya both said yes.', 'note');
      chatInput.focus();
    }
  }
  accept.addEventListener('click', () => decide(true));
  decline.addEventListener('click', () => decide(false));
  tReset.addEventListener('click', () => {
    accept.hidden = false; decline.hidden = false; tReset.hidden = true;
    tResult.textContent = ''; log.textContent = '';
    chat.classList.add('is-locked'); chatInput.value = '';
  });
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = chatInput.value.trim();
    if (!v) { chatInput.focus(); return; }
    addLine(v, 'me'); chatInput.value = ''; chatInput.focus();
  });

  /* ---------- family view and safety tools ---------- */
  const famStatus = $('#fam-status');
  function renderFam() {
    const on = $$('#fam input:checked').map((c) => c.value);
    famStatus.textContent = !on.length ? 'Just you for now.'
      : (on.length === 1 ? on[0] : on.slice(0, -1).join(', ') + ' and ' + on[on.length - 1]) +
        (on.length === 1 ? ' is' : ' are') + ' looking with you.';
  }
  $$('#fam input').forEach((c) => c.addEventListener('change', renderFam));

  const safe = $('#safe-status'), sBlock = $('#s-block'), sHide = $('#s-hide'), sReport = $('#s-report');
  let blocked = false;
  sBlock.addEventListener('click', () => {
    blocked = !blocked;
    $('span', sBlock).textContent = blocked ? 'Unblock' : 'Block';
    sBlock.setAttribute('aria-pressed', String(blocked));
    safe.textContent = blocked ? 'Jack is blocked. He cannot message you.' : 'Jack is unblocked.';
  });
  sReport.addEventListener('click', () => { safe.textContent = 'Demo only: nothing was sent to our team.'; });
  sHide.addEventListener('click', () => {
    const on = sHide.getAttribute('aria-pressed') !== 'true';
    sHide.setAttribute('aria-pressed', String(on));
    $('span', sHide).textContent = on ? 'Show my profile' : 'Hide my profile';
    safe.textContent = on ? 'Your profile is hidden from search.' : 'Your profile shows in search.';
  });

  /* ---------- join card: tabs and forms that post nowhere yet ---------- */
  const tabs = $$('[role="tab"]', $('#join-card'));
  const panels = { join: $('#panel-join'), login: $('#panel-login') };
  function openTab(name, focus) {
    tabs.forEach((t) => {
      const on = t.id === 'tab-' + name;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    Object.keys(panels).forEach((k) => { panels[k].hidden = k !== name; });
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => openTab(t.id.replace('tab-', '')));
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      openTab(next.id.replace('tab-', ''), true);
    });
  });
  $$('[data-open-tab]').forEach((a) => a.addEventListener('click', () => openTab(a.dataset.openTab)));
  openTab('join');

  $$('form[data-endpoint]').forEach((form) => {
    const help = $('.form-help', form);
    form.addEventListener('input', (e) => { e.target.removeAttribute && e.target.removeAttribute('aria-invalid'); });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      help.classList.remove('is-error');
      const bad = $$('input', form).filter((i) => !i.checkValidity());
      $$('input', form).forEach((i) => i.toggleAttribute('aria-invalid', bad.includes(i)));
      if (bad.length) {
        help.classList.add('is-error');
        help.textContent = bad[0].type === 'email'
          ? 'That email looks incomplete. Write it as name@example.com.'
          : 'Please fill in the highlighted field.';
        bad[0].focus();
        return;
      }
      if (!form.dataset.endpoint) { help.textContent = 'Nothing was sent: this form is not connected yet.'; return; }
    });
  });
})();
