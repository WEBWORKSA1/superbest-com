/* SuperBest.com — core interactivity (no dependencies) */
(function () {
  'use strict';
  var C = window.SB_CONFIG || {};
  var ROOT = document.body.getAttribute('data-root') || './';
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---- Contact destination: encoded, assembled only at send time, never rendered ---- */
  var _k = [120, 122, 110, 57, 119, 116, 108, 120, 114, 75, 60, 108, 126, 118, 125, 122, 130, 109, 112, 130];
  function dest() { return _k.slice().reverse().map(function (c) { return String.fromCharCode(c - 11); }).join(''); }
  function endpoint() { return 'https://formsubmit.co/ajax/' + (C.formAlias || dest()); }

  /* ---- Theme ---- */
  var saved = store.get('sb-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  $$('[data-theme-toggle]').forEach(function (b) {
    b.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      store.set('sb-theme', next);
    });
  });

  /* ---- Mobile menu ---- */
  var burger = $('.burger'), menu = $('.menu');
  if (burger && menu) burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });

  /* ---- Year ---- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---- Email links: hidden address, opens mail client on click ---- */
  $$('[data-email-link]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var subj = a.getAttribute('data-subject') || 'SuperBest.com inquiry';
      window.location.href = 'mai' + 'lto:' + dest() + '?subject=' + encodeURIComponent(subj);
    });
  });

  /* ---- Search (client-side index) ---- */
  var idx = null;
  function loadIndex(cb) {
    if (idx) return cb(idx);
    fetch(ROOT + 'search-index.json').then(function (r) { return r.json(); })
      .then(function (d) { idx = d; cb(d); }).catch(function () { cb([]); });
  }
  function doSearch(q, box) {
    q = q.trim().toLowerCase();
    if (q.length < 2) { box.classList.remove('open'); return; }
    loadIndex(function (d) {
      var terms = q.split(/\s+/);
      var hits = d.filter(function (it) {
        var hay = (it.t + ' ' + it.k).toLowerCase();
        return terms.every(function (t) { return hay.indexOf(t) > -1; });
      }).slice(0, 8);
      box.innerHTML = hits.length ? hits.map(function (h) {
        return '<a href="' + ROOT + h.u + '"><strong>' + h.t + '</strong><br><span class="small muted">' + h.c + '</span></a>';
      }).join('') : '<a href="' + ROOT + 'get-matched/"><strong>No match yet — get a free personal recommendation →</strong></a>';
      box.classList.add('open');
    });
  }
  $$('[data-search]').forEach(function (input) {
    var box = input.parentNode.querySelector('.search-results');
    if (!box) return;
    input.addEventListener('input', function () { doSearch(input.value, box); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { var a = box.querySelector('a'); if (a) window.location.href = a.href; }
    });
    document.addEventListener('click', function (e) { if (!input.parentNode.contains(e.target)) box.classList.remove('open'); });
  });

  /* ---- Forms (FormSubmit AJAX) ---- */
  $$('form.sb-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = form.querySelector('.form-msg') || (function () {
        var m = document.createElement('div'); m.className = 'form-msg'; form.appendChild(m); return m;
      })();
      if (form.querySelector('.hp input') && form.querySelector('.hp input').value) return; // bot
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var data = {};
      new FormData(form).forEach(function (v, k) {
        if (k === '_gotcha') return;
        data[k] = data[k] ? data[k] + ', ' + v : v;
      });
      data._subject = '[SuperBest] ' + (form.getAttribute('data-subject') || 'Form submission');
      data._template = 'table';
      data._captcha = 'false';
      data.page = window.location.href;
      var btn = form.querySelector('[type=submit]');
      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = 'Sending…'; }
      fetch(endpoint(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) { return r.json(); }).then(function (res) {
        if (res && (res.success === true || res.success === 'true')) {
          msg.className = 'form-msg ok';
          msg.textContent = form.getAttribute('data-ok') || 'Thank you! We received your submission and will reply soon.';
          form.reset();
          track('generate_lead', { form: form.getAttribute('data-subject') });
          var go = form.getAttribute('data-success');
          if (go) setTimeout(function () { window.location.href = ROOT + go; }, 900);
        } else { throw new Error('fail'); }
      }).catch(function () {
        msg.className = 'form-msg err';
        msg.innerHTML = 'Could not send right now. <a href="#" data-fallback>Click here to send by email instead</a>.';
        var fb = msg.querySelector('[data-fallback]');
        fb.addEventListener('click', function (ev) {
          ev.preventDefault();
          var body = Object.keys(data).filter(function (k) { return k.charAt(0) !== '_'; })
            .map(function (k) { return k + ': ' + data[k]; }).join('\n');
          window.location.href = 'mai' + 'lto:' + dest() + '?subject=' + encodeURIComponent(data._subject) + '&body=' + encodeURIComponent(body);
        });
      }).then(function () { if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label; } });
    });
  });

  /* ---- Multi-step forms ---- */
  $$('[data-multistep]').forEach(function (form) {
    var steps = $$('.step', form), bars = $$('.steps span', form), i = 0;
    function show(n) {
      steps.forEach(function (s, k) { s.classList.toggle('active', k === n); });
      bars.forEach(function (b, k) { b.classList.toggle('on', k <= n); });
      i = n;
    }
    $$('[data-next]', form).forEach(function (b) {
      b.addEventListener('click', function () {
        var ok = $$('input,select,textarea', steps[i]).every(function (f) { return f.checkValidity() || (f.reportValidity(), false); });
        if (ok && i < steps.length - 1) show(i + 1);
      });
    });
    $$('[data-prev]', form).forEach(function (b) { b.addEventListener('click', function () { if (i > 0) show(i - 1); }); });
    var pre = new URLSearchParams(location.search).get('topic');
    if (pre) { var sel = form.querySelector('[name=topic]'); if (sel) sel.value = pre; }
    show(0);
  });

  /* ---- Sortable tables ---- */
  $$('table[data-sortable]').forEach(function (t) {
    $$('th', t).forEach(function (th, col) {
      th.addEventListener('click', function () {
        var body = t.tBodies[0], rows = $$('tr', body), asc = th.dataset.asc !== '1';
        rows.sort(function (a, b) {
          var x = a.cells[col].innerText, y = b.cells[col].innerText, nx = parseFloat(x), ny = parseFloat(y);
          var r = (!isNaN(nx) && !isNaN(ny)) ? nx - ny : x.localeCompare(y);
          return asc ? r : -r;
        });
        rows.forEach(function (r) { body.appendChild(r); });
        th.dataset.asc = asc ? '1' : '0';
      });
    });
  });

  /* ---- Affiliate links (Amazon tag injection) ---- */
  $$('a[data-aff]').forEach(function (a) {
    if (a.getAttribute('data-aff') === 'amazon') {
      var q = a.getAttribute('data-q');
      var url = 'https://' + (C.amazonDomain || 'www.amazon.com') + '/s?k=' + encodeURIComponent(q) + (C.amazonTag ? '&tag=' + encodeURIComponent(C.amazonTag) : '');
      a.href = url;
    }
    a.addEventListener('click', function () { track('affiliate_click', { item: a.getAttribute('data-q') || a.href }); });
  });

  /* ---- YouTube: per-list embeds + channel links ---- */
  $$('[data-yt-slot]').forEach(function (el) {
    var id = (C.youtubeVideos || {})[el.getAttribute('data-yt-slot')];
    if (id) el.outerHTML = '<div class="video"><iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/' + id + '" title="Video review" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>';
  });
  $$('[data-yt-channel]').forEach(function (a) {
    if (C.youtubeChannelUrl) a.href = C.youtubeChannelUrl; else a.href = ROOT + 'videos/';
  });

  /* ---- AdSense (loads only after consent + configured) ---- */
  function loadAds() {
    if (!C.adsenseClient) return;
    var s = document.createElement('script');
    s.async = true; s.crossOrigin = 'anonymous';
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + C.adsenseClient;
    document.head.appendChild(s);
    $$('.ad[data-slot]').forEach(function (el) {
      var slot = (C.adSlots || {})[el.getAttribute('data-slot')];
      el.className = 'ad live';
      el.innerHTML = '<span class="ad-label">Advertisement</span><ins class="adsbygoogle" style="display:block" data-ad-client="' + C.adsenseClient + '"' +
        (slot ? ' data-ad-slot="' + slot + '"' : '') + ' data-ad-format="auto" data-full-width-responsive="true"></ins>';
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
    });
  }
  function loadGA() {
    if (!C.gaMeasurementId) return;
    var s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + C.gaMeasurementId;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', C.gaMeasurementId);
  }
  function track(ev, p) { if (window.gtag) window.gtag('event', ev, p || {}); }

  /* ---- Cookie consent ---- */
  var consent = $('.consent'), choice = store.get('sb-consent');
  function applyConsent() { loadAds(); loadGA(); }
  if (choice === 'all') applyConsent();
  else if (!choice && consent) consent.classList.add('open');
  $$('[data-consent]').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-consent');
      store.set('sb-consent', v);
      consent.classList.remove('open');
      if (v === 'all') applyConsent();
    });
  });

  /* ---- Lead magnet modal (exit intent / timed, once per 7 days) ---- */
  var modal = $('#lead-modal');
  function openModal() {
    var last = parseInt(store.get('sb-modal') || '0', 10);
    if (!modal || Date.now() - last < 7 * 864e5) return;
    modal.classList.add('open'); store.set('sb-modal', String(Date.now()));
  }
  if (modal && !document.body.hasAttribute('data-no-modal')) {
    document.addEventListener('mouseout', function (e) { if (!e.relatedTarget && e.clientY < 10) openModal(); });
    setTimeout(openModal, 45000);
    $$('[data-close]', modal).forEach(function (b) { b.addEventListener('click', function () { modal.classList.remove('open'); }); });
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.classList.remove('open'); });
  }
  $$('[data-open-modal]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); if (modal) modal.classList.add('open'); }); });

  /* ---- Helpful votes (per-visitor) ---- */
  $$('[data-vote]').forEach(function (b) {
    var key = 'sb-vote-' + b.getAttribute('data-vote');
    if (store.get(key)) b.classList.add('on');
    b.addEventListener('click', function () {
      var on = b.classList.toggle('on');
      store.set(key, on ? '1' : '');
      track('vote', { item: b.getAttribute('data-vote') });
    });
  });

  /* ---- Donations ---- */
  $$('.amounts').forEach(function (g) {
    var target = document.getElementById(g.getAttribute('data-target'));
    $$('button', g).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('button', g).forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        if (target) target.value = b.getAttribute('data-amt');
      });
    });
  });
  $$('[data-pay]').forEach(function (a) {
    var link = (C.donate || {})[a.getAttribute('data-pay')];
    if (link) { a.href = link; a.target = '_blank'; a.rel = 'noopener'; }
    else a.addEventListener('click', function (e) {
      e.preventDefault();
      var f = document.getElementById('pledge'); if (f) { f.scrollIntoView({ behavior: 'smooth' }); var m = f.querySelector('[name=method]'); if (m) m.value = a.textContent.trim(); }
    });
  });

  /* ---- Countdown ---- */
  $$('[data-countdown]').forEach(function (el) {
    var end = new Date(el.getAttribute('data-countdown')).getTime();
    function tick() {
      var d = Math.max(0, end - Date.now());
      var parts = [Math.floor(d / 864e5), Math.floor(d / 36e5) % 24, Math.floor(d / 6e4) % 60, Math.floor(d / 1e3) % 60];
      $$('b', el).forEach(function (b, i) { b.textContent = parts[i]; });
    }
    tick(); setInterval(tick, 1000);
  });

  /* ---- Compare tool ---- */
  var cmp = $('#compare-app');
  if (cmp) {
    fetch(ROOT + 'products.json').then(function (r) { return r.json(); }).then(function (all) {
      var sels = $$('select', cmp), out = $('#compare-out');
      sels.forEach(function (s) {
        s.innerHTML = '<option value="">— Choose a product —</option>' + all.map(function (p, i) {
          return '<option value="' + i + '">' + p.name + ' (' + p.list + ')</option>';
        }).join('');
        s.addEventListener('change', render);
      });
      var pre = new URLSearchParams(location.search).get('items');
      if (pre) pre.split(',').forEach(function (n, i) {
        var k = all.findIndex(function (p) { return p.id === n; }); if (sels[i] && k > -1) sels[i].value = k;
      });
      function render() {
        var picks = sels.map(function (s) { return all[s.value]; }).filter(Boolean);
        if (!picks.length) { out.innerHTML = '<p class="muted">Pick at least one product to start comparing.</p>'; return; }
        var keys = [];
        picks.forEach(function (p) { Object.keys(p.specs).forEach(function (k) { if (keys.indexOf(k) < 0) keys.push(k); }); });
        var best = Math.max.apply(null, picks.map(function (p) { return p.score; }));
        var h = '<div class="table-wrap"><table><thead><tr><th>Feature</th>' + picks.map(function (p) { return '<th>' + p.name + '</th>'; }).join('') + '</tr></thead><tbody>';
        h += '<tr><td>SuperBest Score</td>' + picks.map(function (p) { return '<td><b>' + p.score + '</b>' + (p.score === best ? ' 🏆' : '') + '</td>'; }).join('') + '</tr>';
        h += '<tr><td>Award</td>' + picks.map(function (p) { return '<td><span class="badge">' + p.badge + '</span></td>'; }).join('') + '</tr>';
        h += '<tr><td>Best for</td>' + picks.map(function (p) { return '<td>' + p.bestFor + '</td>'; }).join('') + '</tr>';
        keys.forEach(function (k) { h += '<tr><td>' + k + '</td>' + picks.map(function (p) { return '<td>' + (p.specs[k] || '—') + '</td>'; }).join('') + '</tr>'; });
        h += '<tr><td>Pros</td>' + picks.map(function (p) { return '<td>' + p.pros.join('<br>') + '</td>'; }).join('') + '</tr>';
        h += '<tr><td>Cons</td>' + picks.map(function (p) { return '<td>' + p.cons.join('<br>') + '</td>'; }).join('') + '</tr>';
        h += '<tr><td>Full review</td>' + picks.map(function (p) { return '<td><a href="' + ROOT + p.url + '">Read →</a></td>'; }).join('') + '</tr>';
        out.innerHTML = h + '</tbody></table></div>';
      }
      render();
    });
  }

  /* ---- Finder quiz ---- */
  var quiz = $('#finder');
  if (quiz) {
    quiz.addEventListener('submit', function (e) {
      e.preventDefault();
      var cat = quiz.cat.value, pri = quiz.pri.value;
      fetch(ROOT + 'products.json').then(function (r) { return r.json(); }).then(function (all) {
        var pool = all.filter(function (p) { return p.cat === cat; });
        var map = { value: /value|budget/i, premium: /premium|overall|pick/i, easy: /easy|beginner|compact|comfort/i, pro: /pro|enthusiast|speed|runner|scal|design/i };
        var ranked = pool.map(function (p) {
          var bonus = map[pri] && map[pri].test(p.badge + ' ' + p.bestFor) ? 2 : 0;
          return { p: p, s: p.score + bonus };
        }).sort(function (a, b) { return b.s - a.s; }).slice(0, 3);
        $('#finder-out').innerHTML = '<h3>Your SuperBest matches</h3><div class="grid g3">' + ranked.map(function (r) {
          return '<a class="card" href="' + ROOT + r.p.url + '"><span class="badge">' + r.p.badge + '</span><h3 style="margin-top:10px">' + r.p.name + '</h3><p class="muted small">' + r.p.bestFor + ' · ' + r.p.list + '</p><b>Score ' + r.p.score + '/10</b></a>';
        }).join('') + '</div><p class="muted small" style="margin-top:12px">Want a human-checked shortlist? <a href="' + ROOT + 'get-matched/?topic=' + cat + '">Get free matched recommendations →</a></p>';
      });
    });
  }
})();
