// SuperBest.com static site generator. Run: node src/build.mjs
// Outputs static HTML to the repo root (local preview) and Jekyll sources to dist-jekyll/ (deployed on the gh-pages branch).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { categories } from './data/categories.mjs';
import { lists } from './data/lists.mjs';
import { layout, TEMPLATE, esc, rootFor, catName, catIcon, SITE, ad, newsletterForm, hp, consentBox, megaHTML, chromeFooter, chromeExtra } from './layout.mjs';
import { staticPages } from './pages.mjs';

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = [];
const slugify = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const fmtDate = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

const JEK = path.join(OUT, 'dist-jekyll');
fs.rmSync(JEK, { recursive: true, force: true });
function write(p, page, priority = 0.6) {
  const rel = p.endsWith('.html') ? p : path.join(p, 'index.html');
  const html = typeof page === 'string' ? page : page.html;
  const src = typeof page === 'string' ? page
    : '---\n' + Object.entries(page.fm).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join('\n') + '\n---\n' + page.content;
  for (const [dir, data] of [[OUT, html], [JEK, src]]) {
    fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), data);
  }
  if (!p.endsWith('404.html')) pages.push({ p, priority });
}

// ---------- Product flattening (for compare, finder, search) ----------
const products = [];
lists.forEach((l) => l.picks.forEach((p) => products.push({
  id: slugify(p.name), name: p.name, badge: p.badge, score: p.score, bestFor: p.bestFor, specs: p.specs,
  pros: p.pros, cons: p.cons, list: l.short, cat: l.category, url: `best/${l.slug}/#${slugify(p.name)}`,
})));

function buyButtons(p, R) {
  const official = p.url
    ? `<a class="btn btn-primary" href="${p.url}" target="_blank" rel="sponsored nofollow noopener" data-aff="official" data-q="${esc(p.name)}">Visit ${esc(p.name.split(' ')[0])} →</a>`
    : `<a class="btn btn-primary" href="#" target="_blank" rel="sponsored nofollow noopener" data-aff="amazon" data-q="${esc(p.name)}">Check price →</a>`;
  return `${official}<a class="btn btn-ghost" href="${R}compare/?items=${slugify(p.name)}">Compare</a><button class="vote-btn" data-vote="${slugify(p.name)}" title="Mark as helpful">👍 Helpful</button>`;
}

function leadSidebar(R, l) {
  return `<div class="lead-box">
    <span class="eyebrow">Free · 60 seconds</span>
    <h3>Still not sure which ${esc(l.short.toLowerCase())} fits you?</h3>
    <p class="small muted">Tell us your budget and needs. Get a personalised shortlist by email.</p>
    <form class="sb-form" data-subject="Quick match: ${esc(l.short)}" data-ok="Got it! Your personalised shortlist is on its way.">
      ${hp}<input type="hidden" name="topic" value="${esc(l.short)}"><input type="hidden" name="form" value="sidebar-match">
      <div class="field"><input type="email" name="email" placeholder="Your email" required aria-label="Email"></div>
      <div class="field"><select name="budget" aria-label="Budget" required><option value="">Budget…</option><option>Under $100</option><option>$100–$300</option><option>$300–$800</option><option>$800+</option><option>Flexible</option></select></div>
      <div class="field"><label class="check"><input type="checkbox" name="consent" value="yes" required> I agree to be contacted. <a href="${R}privacy/">Privacy</a></label></div>
      <button class="btn btn-primary btn-block" type="submit">Get my free shortlist</button>
    </form>
  </div>`;
}

function videoBlock(l, R) {
  const q = encodeURIComponent(`${l.short} review ${new Date().getFullYear()}`);
  return `<div data-yt-slot="${l.slug}"><a class="video-card" href="https://www.youtube.com/results?search_query=${q}" target="_blank" rel="noopener"><div><div class="play">▶</div><b>Watch ${esc(l.short)} video reviews</b><br><span class="small">Hands-on videos on YouTube</span></div></a></div>`;
}

// ---------- List pages ----------
function listPage(l) {
  const pth = `best/${l.slug}/`, R = rootFor(pth);
  const picks = [...l.picks];
  const toc = picks.map((p) => `<a href="#${slugify(p.name)}">${esc(p.bestFor)}: ${esc(p.name)}</a>`).join('');
  const quick = picks.map((p) => `<a href="#${slugify(p.name)}"><span class="badge">${esc(p.badge)}</span><div style="margin-top:8px;font-weight:700">${esc(p.name)}</div><div class="small muted">${esc(p.bestFor)} · ${p.score}/10</div></a>`).join('');
  const table = `<div class="table-wrap"><table data-sortable><thead><tr><th>Product</th><th>Score</th><th>Best for</th>${Object.keys(picks[0].specs).map((k) => `<th>${esc(k)}</th>`).join('')}</tr></thead><tbody>${picks.map((p) => `<tr><td><a href="#${slugify(p.name)}">${esc(p.name)}</a></td><td><b>${p.score}</b></td><td>${esc(p.bestFor)}</td>${Object.values(p.specs).map((v) => `<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const cards = picks.map((p, i) => {
    return `<article class="pick" id="${slugify(p.name)}">
      <div class="pick-head"><div><span class="badge">${esc(p.badge)}</span> <span class="badge alt">#${i + 1}</span><h3 style="margin-top:10px;font-size:1.5rem">${esc(p.name)}</h3><p class="muted" style="margin:0">${esc(p.bestFor)}</p></div><div class="score" title="SuperBest Score">${p.score}</div></div>
      <div class="pick-img" aria-hidden="true">${catIcon(l.category)}</div>
      <p>${esc(p.summary)}</p>
      <div class="spec-row">${Object.entries(p.specs).map(([k, v]) => `<span><b>${esc(k)}:</b> ${esc(v)}</span>`).join('')}</div>
      <div class="pros-cons"><div><h4>Pros</h4><ul class="pros">${p.pros.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div><div><h4>Cons</h4><ul class="cons">${p.cons.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div></div>
      <div class="buy-row">${buyButtons(p, R)}</div>
    </article>${i === 1 ? ad('inline', R) : ''}${i === 2 ? `<div class="band" style="margin:24px 0"><h3 style="color:#fff">Want an expert shortlist for your exact needs?</h3><p>Free, no obligation. Answer 5 quick questions and get matched in minutes.</p><a class="btn btn-accent" href="${R}get-matched/?topic=${l.category}">Get matched free →</a></div>` : ''}`;
  }).join('');
  const faq = l.faq.map(([q, a]) => `<details class="faq"><summary>${esc(q)}</summary><p style="margin-top:10px">${esc(a)}</p></details>`).join('');
  const related = lists.filter((x) => x.slug !== l.slug && (x.category === l.category)).concat(lists.filter((x) => x.category !== l.category)).slice(0, 3);
  const vs = `vs/${slugify(picks[0].name)}-vs-${slugify(picks[1].name)}/`;
  const schema = [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url + '/' },
      { '@type': 'ListItem', position: 2, name: catName(l.category), item: `${SITE.url}/category/${l.category}/` },
      { '@type': 'ListItem', position: 3, name: l.title, item: `${SITE.url}/${pth}` }] },
    { '@context': 'https://schema.org', '@type': 'ItemList', name: l.title, itemListElement: picks.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: `${SITE.url}/${pth}#${slugify(p.name)}` })) },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: l.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    { '@context': 'https://schema.org', '@type': 'Article', headline: `${l.title} (${SITE.year})`, dateModified: l.updated, author: { '@type': 'Organization', name: 'SuperBest Editorial Team' }, publisher: { '@type': 'Organization', name: 'SuperBest.com' } },
  ];
  const body = `
<div class="container">
  <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="${R}">Home</a> › <a href="${R}category/${l.category}/">${esc(catName(l.category))}</a> › ${esc(l.title)}</nav>
  <header class="page-head">
    <span class="eyebrow">${catIcon(l.category)} ${esc(catName(l.category))}</span>
    <h1>${esc(l.title)} (${SITE.year})</h1>
    <p class="lead muted" style="font-size:1.1rem;max-width:760px">${esc(l.intro)}</p>
    <div class="meta"><span>✍️ SuperBest Editorial Team</span><span>🔄 Updated ${fmtDate(l.updated)}</span><span>📊 ${picks.length} picks compared</span><span><a href="${R}how-we-test/">How we rank →</a></span></div>
    <div class="disclosure">💡 <b>Reader-supported:</b> we may earn a commission from links on this page, at no cost to you. Rankings are editorial and never for sale. <a href="${R}disclosure/">Disclosure</a></div>
  </header>
  ${ad('top', R)}
  <div class="layout">
    <div>
      <div class="verdict"><b>The short answer:</b> ${esc(l.verdict)}</div>
      <h2>Quick picks</h2>
      <div class="quick-picks">${quick}</div>
      <h2>Comparison table</h2>
      <p class="small muted">Tap a column heading to sort.</p>
      ${table}
      <h2 style="margin-top:32px">Watch before you buy</h2>
      ${videoBlock(l, R)}
      <h2 style="margin-top:32px">The ${picks.length} best ${esc(l.short.toLowerCase())}, reviewed</h2>
      ${cards}
      <h2>How we ranked ${esc(l.short.toLowerCase())}</h2>
      <p>Each product gets a SuperBest Score out of 10. It is a weighted editorial rating built from manufacturer specs, independent expert testing published by trusted outlets, verified owner feedback and long-term reliability reports. <a href="${R}how-we-test/">Full methodology</a>.</p>
      <div class="bars">${l.criteria.map(([c, w]) => `<div class="bar"><span>${esc(c)}</span><i><b style="width:${w * 2.5}%"></b></i><span>${w}%</span></div>`).join('')}</div>
      <h2 style="margin-top:32px">Frequently asked questions</h2>
      ${faq}
      <p style="margin-top:20px"><a class="btn btn-ghost" href="${R}${vs}">${esc(picks[0].name)} vs ${esc(picks[1].name)} →</a></p>
      ${ad('footer', R)}
      <div class="card" style="margin-top:24px"><h3>Get the weekly SuperBest shortlist</h3><p class="muted small">New picks, price drops and buying guides. One email a week.</p>${newsletterForm(R, l.slug)}</div>
      <h2 style="margin-top:32px">Related guides</h2>
      <div class="grid g3">${related.map((x) => `<a class="card" href="${R}best/${x.slug}/"><div class="icon">${catIcon(x.category)}</div><h3>${esc(x.title)}</h3><p class="small muted">${esc(x.picks[0].name)} and ${x.picks.length - 1} more</p></a>`).join('')}</div>
    </div>
    <aside class="sidebar"><div class="sticky">
      <div class="card toc"><h4>On this page</h4>${toc}<a href="#main">↑ Back to top</a></div>
      ${leadSidebar(R, l)}
      ${ad('sidebar', R)}
    </div></aside>
  </div>
</div>`;
  write(pth, layout({ path: pth, title: `${l.title} (${SITE.year})`, desc: `${l.intro.slice(0, 150)}`, body, schema, type: 'article' }), 0.9);
  // VS page
  vsPage(l, picks[0], picks[1], vs);
}

function vsPage(l, a, b, pth) {
  const R = rootFor(pth);
  const keys = Object.keys(a.specs);
  const winner = a.score >= b.score ? a : b;
  const body = `<div class="container">
  <nav class="breadcrumbs"><a href="${R}">Home</a> › <a href="${R}best/${l.slug}/">${esc(l.title)}</a> › ${esc(a.name)} vs ${esc(b.name)}</nav>
  <header class="page-head"><span class="eyebrow">Head-to-head</span><h1>${esc(a.name)} vs ${esc(b.name)}</h1><p class="muted">Two of the top ${esc(l.short.toLowerCase())} compared side by side. Which one should you buy?</p>
  <div class="disclosure">💡 We may earn a commission from links on this page. <a href="${R}disclosure/">Disclosure</a></div></header>
  <div class="grid g2">${[a, b].map((p) => `<div class="card"><div class="pick-head"><div><span class="badge">${esc(p.badge)}</span><h2 style="margin-top:10px">${esc(p.name)}</h2><p class="muted">${esc(p.bestFor)}</p></div><div class="score">${p.score}</div></div><p>${esc(p.summary)}</p><div class="buy-row">${buyButtons(p, R)}</div></div>`).join('')}</div>
  ${ad('inline', R)}
  <h2>Spec comparison</h2>
  <div class="table-wrap"><table><thead><tr><th>Feature</th><th>${esc(a.name)}</th><th>${esc(b.name)}</th></tr></thead><tbody>
  <tr><td>SuperBest Score</td><td><b>${a.score}</b></td><td><b>${b.score}</b></td></tr>
  ${keys.map((k) => `<tr><td>${esc(k)}</td><td>${esc(a.specs[k])}</td><td>${esc(b.specs[k] || '—')}</td></tr>`).join('')}
  <tr><td>Strengths</td><td>${a.pros.map(esc).join('<br>')}</td><td>${b.pros.map(esc).join('<br>')}</td></tr>
  <tr><td>Weaknesses</td><td>${a.cons.map(esc).join('<br>')}</td><td>${b.cons.map(esc).join('<br>')}</td></tr>
  </tbody></table></div>
  <div class="verdict"><b>Verdict:</b> ${esc(winner.name)} edges it overall (${winner.score}/10). Choose ${esc(a.name)} if you want ${esc(a.bestFor.toLowerCase())}; choose ${esc(b.name)} if you want ${esc(b.bestFor.toLowerCase())}.</div>
  <p><a class="btn btn-primary" href="${R}best/${l.slug}/">See all ${l.picks.length} ${esc(l.short.toLowerCase())} →</a> <a class="btn btn-ghost" href="${R}compare/">Build your own comparison</a></p>
  <div style="height:40px"></div></div>`;
  write(pth, layout({ path: pth, title: `${a.name} vs ${b.name}`, desc: `${a.name} vs ${b.name}: specs, pros, cons and our verdict on which to buy.`, body }), 0.7);
}

// ---------- Category hubs ----------
function categoryPage(c) {
  const pth = `category/${c.slug}/`, R = rootFor(pth);
  const ls = lists.filter((l) => l.category === c.slug);
  const body = `<div class="container">
  <nav class="breadcrumbs"><a href="${R}">Home</a> › <a href="${R}best/">Best lists</a> › ${esc(c.name)}</nav>
  <header class="page-head"><span class="eyebrow">${c.icon} Category</span><h1>Best ${esc(c.name)}</h1><p class="muted" style="font-size:1.1rem;max-width:720px">${esc(c.blurb)}</p></header>
  <div class="grid g3">${ls.map((l) => `<a class="card" href="${R}best/${l.slug}/"><div class="icon">${c.icon}</div><h3>${esc(l.title)}</h3><p class="small muted">${esc(l.intro.slice(0, 110))}…</p><p class="small"><span class="badge">Top pick</span> ${esc(l.picks[0].name)}</p></a>`).join('')}
  <a class="card" href="${R}submit/"><div class="icon">➕</div><h3>Suggest a guide</h3><p class="small muted">Tell us what ${esc(c.name.toLowerCase())} we should rank next.</p></a></div>
  ${ad('inline', R)}
  <div class="band"><h2 style="color:#fff">Get a personalised ${esc(c.name)} shortlist</h2><p>Free matching. Tell us your needs and budget, and we'll email you the top options.</p><a class="btn btn-accent" href="${R}get-matched/?topic=${c.slug}">Get matched free →</a></div>
  <div style="height:40px"></div></div>`;
  write(pth, layout({ path: pth, title: `Best ${c.name}`, desc: `${c.blurb}`, body }), 0.8);
}

// ---------- All lists hub ----------
function allLists() {
  const pth = 'best/', R = rootFor(pth);
  const sorted = [...lists].sort((a, b) => a.title.localeCompare(b.title));
  const body = `<div class="container"><header class="page-head"><span class="eyebrow">A–Z index</span><h1>All SuperBest Lists</h1><p class="muted">Every best-of guide on SuperBest, researched and updated regularly.</p></header>
  ${categories.map((c) => { const ls = lists.filter((l) => l.category === c.slug); return ls.length ? `<h2 style="margin-top:28px">${c.icon} ${esc(c.name)}</h2><div class="grid g3">${ls.map((l) => `<a class="card" href="${R}best/${l.slug}/"><h3>${esc(l.title)}</h3><p class="small muted">Top pick: ${esc(l.picks[0].name)} · Updated ${fmtDate(l.updated)}</p></a>`).join('')}</div>` : ''; }).join('')}
  <h2 style="margin-top:36px">A–Z</h2><div class="card"><ul style="columns:2;margin:0">${sorted.map((l) => `<li><a href="${R}best/${l.slug}/">${esc(l.title)}</a></li>`).join('')}</ul></div>
  <div style="height:40px"></div></div>`;
  write(pth, layout({ path: pth, title: 'All Best Lists A–Z', desc: 'Browse every SuperBest best-of guide by category or A–Z.', body }), 0.8);
}

// ---------- Home ----------
function home() {
  const R = './';
  const featured = [...lists].sort((a, b) => b.updated.localeCompare(a.updated)).slice(0, 6);
  const topPicks = lists.slice(0, 8).map((l) => ({ l, p: l.picks[0] }));
  const schema = [
    { '@context': 'https://schema.org', '@type': 'Organization', name: 'SuperBest.com', url: SITE.url, logo: SITE.url + '/assets/img/favicon.svg' },
    { '@context': 'https://schema.org', '@type': 'WebSite', name: 'SuperBest.com', url: SITE.url },
  ];
  const body = `
<section class="hero"><div class="container hero-grid">
  <div>
    <span class="eyebrow">Researched · Ranked · Simplified</span>
    <h1>Find the <span style="background:linear-gradient(90deg,var(--brand),#ff6ac1);-webkit-background-clip:text;background-clip:text;color:transparent">super best</span> of everything.</h1>
    <p class="lead">Honest, research-driven best-of lists, head-to-head comparisons and free personal recommendations, so you buy right the first time.</p>
    <div class="hero-search search-wrap" style="position:relative"><input type="search" placeholder="What are you shopping for? e.g. headphones, VPN, tent" data-search aria-label="Search SuperBest" style="width:100%;padding-left:36px"><div class="search-results" style="left:0;right:auto;width:100%"></div></div>
    <div class="chips">${lists.slice(0, 7).map((l) => `<a class="chip" href="${R}best/${l.slug}/">${esc(l.short)}</a>`).join('')}</div>
  </div>
  <div class="hero-card">
    <span class="eyebrow">Free · 60 seconds</span>
    <h3>Get your personal SuperBest shortlist</h3>
    <p class="small muted">Tell us what you need. We'll email the best-fit options for your budget.</p>
    <form class="sb-form" data-subject="Homepage hero match" data-ok="Done! Check your inbox for your shortlist soon.">
      ${hp}<input type="hidden" name="form" value="hero-match">
      <div class="field"><select name="topic" required aria-label="Category"><option value="">I'm looking for…</option>${categories.map((c) => `<option>${esc(c.name)}</option>`).join('')}<option>A service / professional</option><option>Something else</option></select></div>
      <div class="field"><input type="email" name="email" placeholder="Your email" required aria-label="Email"></div>
      <div class="field"><label class="check"><input type="checkbox" name="consent" value="yes" required> I agree to be contacted. <a href="${R}privacy/">Privacy</a></label></div>
      <button class="btn btn-primary btn-block" type="submit">Get my free shortlist →</button>
    </form>
    <div class="trust-row"><span>✓ 100% free</span><span>✓ No spam</span><span>✓ Unsubscribe anytime</span></div>
  </div>
</div></section>

<section class="block" style="padding-top:24px"><div class="container">
  <div class="stats">
    <div class="stat"><b>${lists.length}+</b>Best-of guides</div>
    <div class="stat"><b>${products.length}+</b>Products ranked</div>
    <div class="stat"><b>${categories.length}</b>Categories</div>
    <div class="stat"><b>0</b>Paid rankings</div>
  </div>
</div></section>

<section class="block"><div class="container">
  <div class="section-head"><div><span class="eyebrow">Browse</span><h2>Shop by category</h2></div><a href="${R}best/">All lists A–Z →</a></div>
  <div class="grid g4">${categories.map((c) => `<a class="card" href="${R}category/${c.slug}/"><div class="icon">${c.icon}</div><h3>${esc(c.name)}</h3><p class="small muted">${esc(c.blurb.slice(0, 80))}…</p></a>`).join('')}
  <a class="card" href="${R}finder/"><div class="icon">🧭</div><h3>Not sure?</h3><p class="small muted">Take the 30-second finder quiz.</p></a></div>
</div></section>

<div class="container">${ad('top', R)}</div>

<section class="block"><div class="container">
  <div class="section-head"><div><span class="eyebrow">Fresh</span><h2>Latest best-of guides</h2></div></div>
  <div class="grid g3">${featured.map((l) => `<a class="card" href="${R}best/${l.slug}/"><span class="badge alt">${esc(catName(l.category))}</span><h3 style="margin-top:10px">${esc(l.title)}</h3><p class="small muted">${esc(l.verdict.slice(0, 120))}…</p><p class="small">🔄 ${fmtDate(l.updated)}</p></a>`).join('')}</div>
</div></section>

<section class="block"><div class="container">
  <div class="section-head"><div><span class="eyebrow">Winners</span><h2>SuperBest Picks right now</h2></div><a href="${R}compare/">Compare any products →</a></div>
  <div class="grid g4">${topPicks.map(({ l, p }) => `<a class="card" href="${R}best/${l.slug}/#${slugify(p.name)}"><span class="badge">${esc(p.badge)}</span><h3 style="margin-top:10px">${esc(p.name)}</h3><p class="small muted">${esc(l.short)}</p><div class="score" style="width:44px;height:44px;font-size:1rem">${p.score}</div></a>`).join('')}</div>
</div></section>

<section class="block"><div class="container">
  <div class="band"><div class="grid g2" style="align-items:center">
    <div><span class="eyebrow" style="background:rgba(255,255,255,.15);color:#fff">Free matching service</span><h2 style="color:#fff">Skip the research. Get matched.</h2><p>Answer 5 quick questions about what you need, your budget and timeline. We send a personalised shortlist of top-rated options. Free, fast and no obligation.</p>
    <a class="btn btn-accent" href="${R}get-matched/">Start free matching →</a> <a class="btn btn-ghost" href="${R}finder/">Try the quiz</a></div>
    <div class="grid" style="gap:12px"><div class="card" style="background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.15);color:#fff">① Tell us your needs</div><div class="card" style="background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.15);color:#fff">② We match you with the best options</div><div class="card" style="background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.15);color:#fff">③ Buy with confidence</div></div>
  </div></div>
</div></section>

<section class="block"><div class="container">
  <div class="section-head"><div><span class="eyebrow">Watch</span><h2>Video reviews</h2></div><a href="${R}videos/">All videos →</a></div>
  <div class="grid g3">${lists.slice(0, 3).map((l) => videoBlock(l, R)).join('')}</div>
  <p class="center" style="margin-top:18px"><a class="btn btn-ghost" data-yt-channel href="${R}videos/">▶ Subscribe to SuperBest on YouTube</a></p>
</div></section>

<section class="block"><div class="container grid g3">
  <a class="card" href="${R}awards/"><div class="icon">🏆</div><h3>SuperBest Awards ${SITE.year}</h3><p class="muted small">Vote for People's Choice winners in every category.</p><span class="btn btn-primary btn-sm">Vote now</span></a>
  <a class="card" href="${R}contests/"><div class="icon">🎁</div><h3>Contests & giveaways</h3><p class="muted small">Enter free monthly giveaways and creator contests.</p><span class="btn btn-primary btn-sm">Enter free</span></a>
  <a class="card" href="${R}support/"><div class="icon">💜</div><h3>Support independent reviews</h3><p class="muted small">Help fund research, contests and new talent.</p><span class="btn btn-accent btn-sm">Support us</span></a>
</div></section>

<section class="block"><div class="container grid g2" style="align-items:center">
  <div><span class="eyebrow">Why trust us</span><h2>Independent. Transparent. Reader-first.</h2>
  <p class="muted">Rankings are never for sale. We publish our scoring weights on every guide, label every sponsored placement, and update picks as products change.</p>
  <ul><li>Published methodology and scoring weights</li><li>Clear affiliate and sponsorship labels</li><li>Regular updates with dates on every guide</li><li>Community voting alongside editorial picks</li></ul>
  <a href="${R}how-we-test/">Read our methodology →</a></div>
  <div class="card"><h3>Get the weekly SuperBest shortlist</h3><p class="muted small">The best new picks and price drops, every week.</p>${newsletterForm(R, 'home')}</div>
</div></section>

<section class="block"><div class="container"><div class="card" style="display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between">
  <div><h3 style="margin:0">Brands & agencies: reach buyers at the moment of decision</h3><p class="muted small" style="margin:0">Sponsorships, newsletter placements, awards partnerships and more.</p></div>
  <div><a class="btn btn-primary" href="${R}advertise/">Advertise with us</a> <a class="btn btn-ghost" href="${SITE.inquiry}" target="_blank" rel="noopener">Acquire / partner</a></div>
</div></div></section>`;
  write('', layout({ path: '', title: 'SuperBest.com — The Super Best of Everything, Researched & Ranked', desc: 'Research-driven best-of lists, comparisons, video reviews and free personal recommendations across tech, home, kitchen, fitness, travel, software and outdoors.', body, schema }), 1.0);
}

// ---------- Build ----------
home();
allLists();
categories.forEach(categoryPage);
lists.forEach(listPage);
staticPages({ write, lists, categories, products, slugify });

// Shared chrome (mega menu, footer grid, consent, modal) injected at runtime to keep pages light
const T = (html) => JSON.stringify(html.replace(/\s*\n\s*/g, '\n'));
fs.writeFileSync(path.join(OUT, 'assets/js/chrome.js'), `/* Generated by src/build.mjs — do not edit */
(function () {
  var R = document.body.getAttribute('data-root') || './';
  function put(id, html, replace) { var el = document.getElementById(id); if (!el) return; html = html.split('{R}').join(R); if (replace) el.outerHTML = html; else el.innerHTML = html; }
  put('mega', ${T(megaHTML('{R}'))});
  put('chrome-footer', ${T(chromeFooter('{R}'))}, true);
  put('chrome-extra', ${T(chromeExtra('{R}'))}, true);
})();
`);

// Data files
fs.writeFileSync(path.join(OUT, 'products.json'), JSON.stringify(products));
const search = [
  ...lists.map((l) => ({ t: l.title, u: `best/${l.slug}/`, c: catName(l.category), k: l.picks.map((p) => p.name).join(' ') + ' ' + l.short })),
  ...products.map((p) => ({ t: p.name, u: p.url, c: `${p.badge} · ${p.list}`, k: p.bestFor + ' ' + p.list })),
  ...categories.map((c) => ({ t: 'Best ' + c.name, u: `category/${c.slug}/`, c: 'Category', k: c.blurb })),
  ...[['Get matched (free)', 'get-matched/', 'recommendation shortlist help'], ['Compare products', 'compare/', 'compare vs'], ['Finder quiz', 'finder/', 'quiz'], ['SuperBest Awards', 'awards/', 'vote nominate'], ['Contests & giveaways', 'contests/', 'win prize giveaway'], ['Support / Donate', 'support/', 'donate donation sponsor'], ['Advertise', 'advertise/', 'sponsor partner media kit'], ['Careers', 'careers/', 'jobs hiring writer'], ['Videos', 'videos/', 'youtube']].map(([t, u, k]) => ({ t, u, c: 'Page', k })),
];
fs.writeFileSync(path.join(OUT, 'search-index.json'), JSON.stringify(search));
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(({ p, priority }) => `  <url><loc>${SITE.url}/${p}</loc><lastmod>${today}</lastmod><priority>${priority.toFixed(1)}</priority></url>`).join('\n')}\n</urlset>\n`);
fs.mkdirSync(path.join(JEK, '_layouts'), { recursive: true });
fs.writeFileSync(path.join(JEK, '_layouts/sb.html'), TEMPLATE);
fs.writeFileSync(path.join(JEK, '_config.yml'), 'exclude: [src, docs, README.md, dist-jekyll]\n');
console.log(`Built ${pages.length} pages, ${products.length} products.`);
