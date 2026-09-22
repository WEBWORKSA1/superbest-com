import { categories } from './data/categories.mjs';
import { lists } from './data/lists.mjs';

export const SITE = {
  name: 'SuperBest.com',
  url: 'https://superbest.com',
  tagline: 'The super best of everything — researched, ranked, simplified.',
  inquiry: 'https://web.works/contact',
  year: 2026,
};

export const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const rootFor = (path) => { const d = path.split('/').filter(Boolean).length; return d ? '../'.repeat(d) : './'; };
export const catName = (slug) => (categories.find((c) => c.slug === slug) || {}).name || slug;
export const catIcon = (slug) => (categories.find((c) => c.slug === slug) || {}).icon || '⭐';

export const hp = `<div class="hp" aria-hidden="true"><label>Leave empty<input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label></div>`;
export const consentBox = (R) => `<label class="check"><input type="checkbox" name="consent" value="yes" required> I agree to the <a href="${R}privacy/">Privacy Policy</a> and to be contacted about my request.</label>`;

export function ad(slot, R) {
  return `<div class="ad" data-slot="${slot}"><div><span class="ad-label">Advertisement</span>Ad space available · <a href="${R}advertise/">Advertise on SuperBest</a></div></div>`;
}

export function newsletterForm(R, source = 'newsletter', compact = false) {
  return `<form class="sb-form" data-subject="Newsletter signup (${source})" data-ok="You're in! Watch your inbox for the next SuperBest picks.">
    ${hp}<input type="hidden" name="form" value="newsletter-${source}">
    <div class="${compact ? 'footer-news' : 'row'}">
      <input type="email" name="email" placeholder="Your email" required aria-label="Email">
      ${compact ? '' : `<select name="interest" aria-label="Interest"><option>All SuperBest picks</option>${categories.map((c) => `<option>${esc(c.name)}</option>`).join('')}<option>Deals & price drops</option></select>`}
      <button class="btn btn-primary${compact ? ' btn-sm' : ''}" type="submit">Subscribe</button>
    </div>
    <label class="check" style="margin-top:8px"><input type="checkbox" name="consent" value="yes" required> Send me SuperBest emails. Unsubscribe anytime. <a href="${R}privacy/">Privacy</a></label>
  </form>`;
}

const guides = (slug) => { const n = lists.filter((l) => l.category === slug).length; return `${n} best-of guide${n === 1 ? '' : 's'}`; };

export function megaHTML(R) {
  return categories.map((c) => `<a href="${R}category/${c.slug}/"><span>${c.icon}</span><span><b>${esc(c.name)}</b><small>${guides(c.slug)}</small></span></a>`).join('')
    + `<a href="${R}best/"><span>🗂️</span><span><b>All best lists A–Z</b><small>Every SuperBest guide</small></span></a>`;
}

function header(R) {
  return `
<div class="inquiry-bar">Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership — <a href="${SITE.inquiry}" target="_blank" rel="noopener">Contact us →</a></div>
<header class="site-header">
  <div class="container nav">
    <a class="logo" href="${R}" aria-label="SuperBest home"><span class="logo-mark">★</span><span>Super<b>Best</b></span></a>
    <ul class="menu" id="menu">
      <li><button aria-haspopup="true">Best Lists ▾</button><div class="mega" id="mega"><a href="${R}best/"><span>🗂️</span><span><b>All best lists A–Z</b></span></a></div></li>
      <li><a href="${R}compare/">Compare</a></li>
      <li><a href="${R}finder/">Finder Quiz</a></li>
      <li><a href="${R}awards/">Awards</a></li>
      <li><a href="${R}contests/">Contests</a></li>
      <li><a href="${R}videos/">Videos</a></li>
      <li><a href="${R}support/">Support Us</a></li>
    </ul>
    <div class="nav-right">
      <div class="search-wrap"><input type="search" placeholder="Search best picks…" data-search aria-label="Search"><div class="search-results"></div></div>
      <button class="icon-btn" data-theme-toggle aria-label="Toggle dark mode"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg></button>
      <a class="btn btn-primary btn-sm" href="${R}get-matched/">Get Matched</a>
      <button class="icon-btn burger" aria-label="Menu" aria-controls="menu" aria-expanded="false">☰</button>
    </div>
  </div>
</header>`;
}

function footer(R) {
  return `
<footer class="site-footer">
  <div class="container">
    <div id="chrome-footer"></div>
    <p class="small"><a href="${R}about/">About</a> · <a href="${R}how-we-test/">How we rank</a> · <a href="${R}advertise/">Advertise</a> · <a href="${R}contact/">Contact</a> · <a href="${R}disclosure/">Disclosures & trademarks</a> · <a href="${R}privacy/">Privacy</a> · <a href="${R}terms/">Terms</a></p>
    <div class="legal">
      <p><b>Affiliate disclosure:</b> SuperBest.com may earn a commission when you buy through links on this site, at no extra cost to you. This never affects our rankings. <a href="${R}disclosure/">Learn more</a>.</p>
      <p><b>Trademark & copyright notice:</b> SuperBest.com is an independent website and is not affiliated with, endorsed by, or connected to any company, store, brand or product that uses the words "Super Best", "Superbest" or similar names. All product names, logos and brands mentioned are the property of their respective owners and are used for identification purposes only. Site content, design and code © <span data-year>2026</span> SuperBest.com. All rights reserved.</p>
      <p>Interested in this website, the domain name, sponsorship, advertising or partnership? <a href="${SITE.inquiry}" target="_blank" rel="noopener">Contact here</a>.</p>
    </div>
  </div>
</footer>
<div id="chrome-extra"></div>`;
}

export function chromeFooter(R) {
  return `<div class="footer-grid">
      <div>
        <a class="logo" href="${R}" style="color:#fff"><span class="logo-mark">★</span><span>Super<b>Best</b></span></a>
        <p style="margin-top:12px">${esc(SITE.tagline)} Independent, reader-supported recommendations.</p>
        <p class="small">Get the weekly SuperBest shortlist:</p>
        ${newsletterForm(R, 'footer', true)}
      </div>
      <div><h4>Best Lists</h4><ul>${categories.map((c) => `<li><a href="${R}category/${c.slug}/">${esc(c.name)}</a></li>`).join('')}</ul></div>
      <div><h4>Tools</h4><ul><li><a href="${R}compare/">Compare products</a></li><li><a href="${R}finder/">Finder quiz</a></li><li><a href="${R}get-matched/">Get matched (free)</a></li><li><a href="${R}deals/">Deals & price alerts</a></li><li><a href="${R}checklist/">Buyer's checklist</a></li><li><a href="${R}videos/">Video reviews</a></li></ul></div>
      <div><h4>Community</h4><ul><li><a href="${R}awards/">SuperBest Awards</a></li><li><a href="${R}contests/">Contests & giveaways</a></li><li><a href="${R}submit/">Suggest a product</a></li><li><a href="${R}support/">Support / Donate</a></li><li><a href="${R}careers/">Careers & talent</a></li></ul></div>
      <div><h4>Company</h4><ul><li><a href="${R}about/">About</a></li><li><a href="${R}how-we-test/">How we rank</a></li><li><a href="${R}advertise/">Advertise & partner</a></li><li><a href="${R}contact/">Contact</a></li><li><a href="${R}disclosure/">Disclosures & trademarks</a></li><li><a href="${R}privacy/">Privacy</a> · <a href="${R}terms/">Terms</a></li></ul></div>
    </div>`;
}

export function chromeExtra(R) {
  return `
<div class="mobile-cta"><a class="btn btn-ghost" href="${R}best/">Best Lists</a><a class="btn btn-primary" href="${R}get-matched/">Get Matched Free</a></div>
<div class="consent" role="dialog" aria-label="Cookie consent">
  <p style="margin-bottom:10px">We use cookies for analytics and ads that keep SuperBest free. See our <a href="${R}privacy/">Privacy Policy</a>.</p>
  <button class="btn btn-primary btn-sm" data-consent="all">Accept all</button> <button class="btn btn-ghost btn-sm" data-consent="essential">Essential only</button>
</div>
<div class="modal" id="lead-modal" role="dialog" aria-modal="true" aria-labelledby="lm-title">
  <div class="modal-box">
    <button class="modal-close" data-close aria-label="Close">×</button>
    <span class="eyebrow">Free download</span>
    <h2 id="lm-title">The SuperBest Buyer's Checklist</h2>
    <p class="muted">The 12 questions to ask before any big purchase, plus weekly top picks. Free forever.</p>
    <form class="sb-form" data-subject="Lead magnet: Buyer's Checklist" data-success="checklist/" data-ok="Unlocked! Opening your checklist…">
      ${hp}<input type="hidden" name="form" value="lead-magnet">
      <div class="field"><input type="text" name="name" placeholder="First name" required aria-label="First name"></div>
      <div class="field"><input type="email" name="email" placeholder="Email address" required aria-label="Email"></div>
      <div class="field">${consentBox(R)}</div>
      <button class="btn btn-primary btn-block" type="submit">Send me the checklist</button>
    </form>
  </div>
</div>`;
}

export const minify = (html) => html.replace(/\n\s+/g, '\n');

function shell(v) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${v.title}</title>
<meta name="description" content="${v.desc}">
<link rel="canonical" href="${v.url}">
<meta property="og:type" content="${v.type}">
<meta property="og:title" content="${v.title}">
<meta property="og:description" content="${v.desc}">
<meta property="og:url" content="${v.url}">
<meta property="og:site_name" content="SuperBest.com">
<meta property="og:image" content="${SITE.url}/assets/img/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#5b3df5">
<link rel="icon" href="${v.root}assets/img/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="${v.root}manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${v.root}assets/css/style.css">
<script>try{var t=localStorage.getItem('sb-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}</script>
</head>
<body data-root="${v.root}"${v.bodyattr}>
<a class="skip" href="#main">Skip to content</a>
${header(v.root)}
<main id="main">
${v.content}
</main>
${footer(v.root)}
<script src="${v.root}assets/js/config.js"></script>
<script src="${v.root}assets/js/chrome.js" defer></script>
<script src="${v.root}assets/js/app.js" defer></script>
</body>
</html>`;
}

// Jekyll layout (GitHub Pages renders it server-side). Keys are prefixed sb_ to avoid Jekyll/plugin clashes.
const KEYS = ['root', 'title', 'desc', 'url', 'type', 'bodyattr'];
export const TEMPLATE = minify(shell(Object.assign({ content: '{{ content }}' }, ...KEYS.map((k) => ({ [k]: `{{ page.sb_${k} }}` })))));
export const render = (fm, content) => KEYS.reduce((h, k) => h.split(`{{ page.sb_${k} }}`).join(fm['sb_' + k]), TEMPLATE).split('{{ content }}').join(content);

export function layout({ path = '', title, desc, body, schema = [], noModal = false, type = 'website' }) {
  const R = rootFor(path);
  const fullTitle = path === '' ? title : `${title} | SuperBest.com`;
  const fm = { layout: 'sb', sb_root: R, sb_title: esc(fullTitle), sb_desc: esc(desc), sb_url: SITE.url + '/' + path, sb_type: type, sb_bodyattr: noModal ? ' data-no-modal' : '' };
  const content = minify(schema.map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n') + '\n' + body).trim();
  const html = render(fm, content);
  return Object.assign(new String(html), { fm, content, html });
}
