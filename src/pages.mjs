import { layout, esc, rootFor, catName, catIcon, SITE, ad, newsletterForm, hp, consentBox } from './layout.mjs';

const wrap = (inner) => `<div class="container">${inner}<div style="height:48px"></div></div>`;
const head = (eyebrow, title, sub) => `<header class="page-head"><span class="eyebrow">${eyebrow}</span><h1>${title}</h1>${sub ? `<p class="muted" style="font-size:1.1rem;max-width:760px">${sub}</p>` : ''}</header>`;
const countryField = `<div class="field"><label>Country</label><input type="text" name="country" placeholder="e.g. United States" autocomplete="country-name"></div>`;

export function staticPages({ write, lists, categories, products, slugify }) {
  const P = (pth, title, desc, body, opts = {}) => write(pth, layout({ path: pth, title, desc, body, ...opts }), opts.priority || 0.6);

  /* ---------------- GET MATCHED (primary lead generation) ---------------- */
  {
    const pth = 'get-matched/', R = rootFor(pth);
    P(pth, 'Get Matched — Free Personal Recommendations', 'Answer 5 quick questions and get a free, personalised shortlist of the best products or services for your needs and budget.', wrap(`
  ${head('Free matching service', 'Get your personal SuperBest shortlist', 'Skip hours of research. Tell us what you need and we\'ll send the best-fit options for your budget, free and with no obligation.')}
  <div class="layout" style="grid-template-columns:minmax(0,1.3fr) minmax(0,1fr)">
    <div class="lead-box">
      <form class="sb-form" data-multistep data-subject="GET MATCHED lead" data-ok="🎉 You're matched! Your personalised shortlist will arrive by email shortly.">
        ${hp}<input type="hidden" name="form" value="get-matched">
        <div class="steps"><span></span><span></span><span></span><span></span></div>
        <div class="step">
          <h3>1. What are you looking for?</h3>
          <div class="option-grid">
            ${categories.map((c, i) => `<label><input type="radio" name="topic" value="${c.slug}" ${i === 0 ? 'required' : ''}> ${c.icon} ${esc(c.name)}</label>`).join('')}
            <label><input type="radio" name="topic" value="services"> 🛠️ A service / pro</label>
            <label><input type="radio" name="topic" value="business"> 🏢 Business software</label>
            <label><input type="radio" name="topic" value="other"> ✨ Something else</label>
          </div>
          <div class="field" style="margin-top:14px"><label>Specifically (optional)</label><input type="text" name="product" placeholder="e.g. noise-cancelling headphones for flights"></div>
          <button type="button" class="btn btn-primary" data-next>Next →</button>
        </div>
        <div class="step">
          <h3>2. Budget & timing</h3>
          <div class="row">
            <div class="field"><label>Budget</label><select name="budget" required><option value="">Select…</option><option>Under $100</option><option>$100–$300</option><option>$300–$800</option><option>$800–$2,000</option><option>$2,000+</option><option>Not sure yet</option></select></div>
            <div class="field"><label>When do you plan to buy?</label><select name="timeline" required><option value="">Select…</option><option>Today / this week</option><option>This month</option><option>1–3 months</option><option>Just researching</option></select></div>
          </div>
          <button type="button" class="btn btn-ghost" data-prev>← Back</button> <button type="button" class="btn btn-primary" data-next>Next →</button>
        </div>
        <div class="step">
          <h3>3. What matters most?</h3>
          <div class="option-grid">
            ${['Best value', 'Top quality', 'Easy to use', 'Durability', 'Eco-friendly', 'Brand reputation', 'Fast delivery', 'Warranty'].map((x) => `<label><input type="checkbox" name="priorities" value="${x}"> ${x}</label>`).join('')}
          </div>
          <div class="field" style="margin-top:14px"><label>Anything else we should know?</label><textarea name="details" placeholder="Must-have features, deal-breakers, who it's for…"></textarea></div>
          <button type="button" class="btn btn-ghost" data-prev>← Back</button> <button type="button" class="btn btn-primary" data-next>Next →</button>
        </div>
        <div class="step">
          <h3>4. Where should we send your shortlist?</h3>
          <div class="row">
            <div class="field"><label>First name</label><input type="text" name="name" required autocomplete="given-name"></div>
            <div class="field"><label>Email</label><input type="email" name="email" required autocomplete="email"></div>
          </div>
          <div class="row">
            <div class="field"><label>Phone (optional, for faster help)</label><input type="tel" name="phone" autocomplete="tel"></div>
            ${countryField}
          </div>
          <div class="field"><label class="check"><input type="checkbox" name="partner_offers" value="yes"> Also send me relevant offers from vetted partners (optional).</label></div>
          <div class="field">${consentBox(R)}</div>
          <button type="button" class="btn btn-ghost" data-prev>← Back</button> <button type="submit" class="btn btn-primary">Get my free shortlist 🚀</button>
        </div>
      </form>
      <div class="trust-row"><span>🔒 Secure & private</span><span>✓ 100% free</span><span>✓ No spam, ever</span><span>✓ Unsubscribe anytime</span></div>
    </div>
    <aside>
      <div class="card"><h3>How it works</h3><ol><li><b>Tell us your needs</b> in under 60 seconds.</li><li><b>We compare the options</b> against our research and scoring data.</li><li><b>You get a shortlist</b> of the best fits, with reasons, by email.</li></ol></div>
      <div class="card" style="margin-top:16px"><h3>Why people use it</h3><ul><li>Saves hours of reading reviews</li><li>Budget-aware recommendations</li><li>Honest pros and cons, no pressure</li><li>Works for products and services</li></ul></div>
      <div class="card" style="margin-top:16px"><h3>Are you a brand or service provider?</h3><p class="small muted">Get qualified buyers matched to you.</p><a class="btn btn-ghost btn-sm" href="${R}advertise/#listing">Become a partner →</a></div>
    </aside>
  </div>`), { priority: 0.9, noModal: true });
  }

  /* ---------------- COMPARE ---------------- */
  {
    const pth = 'compare/', R = rootFor(pth);
    P(pth, 'Compare Products Side by Side', 'Compare up to four SuperBest-ranked products side by side: scores, specs, pros and cons.', wrap(`
  ${head('Interactive tool', 'Compare products side by side', 'Pick up to four products from any SuperBest guide and see scores, specs, pros and cons in one table.')}
  <div id="compare-app" class="card"><div class="grid g4">${[1, 2, 3, 4].map((n) => `<div><label>Product ${n}</label><select aria-label="Product ${n}"></select></div>`).join('')}</div></div>
  <div id="compare-out" style="margin-top:20px"><p class="muted">Loading products…</p></div>
  ${ad('inline', R)}
  <div class="band"><h3 style="color:#fff">Still torn between two?</h3><p>Our free matching service picks the right one for your needs.</p><a class="btn btn-accent" href="${R}get-matched/">Get matched free →</a></div>`), { priority: 0.8 });
  }

  /* ---------------- FINDER QUIZ ---------------- */
  {
    const pth = 'finder/', R = rootFor(pth);
    P(pth, 'SuperBest Finder Quiz', 'Answer two questions and instantly see your best-matched products from every SuperBest guide.', wrap(`
  ${head('30-second quiz', 'Find your SuperBest match', 'Two questions. Instant, personalised picks.')}
  <form id="finder" class="card">
    <h3>1. What are you shopping for?</h3>
    <div class="option-grid">${categories.map((c, i) => `<label><input type="radio" name="cat" value="${c.slug}" ${i === 0 ? 'checked' : ''}> ${c.icon} ${esc(c.name)}</label>`).join('')}</div>
    <h3 style="margin-top:20px">2. What matters most?</h3>
    <div class="option-grid">
      <label><input type="radio" name="pri" value="value" checked> 💰 Best value</label>
      <label><input type="radio" name="pri" value="premium"> 💎 Best overall</label>
      <label><input type="radio" name="pri" value="easy"> 😌 Ease & comfort</label>
      <label><input type="radio" name="pri" value="pro"> ⚡ Pro performance</label>
    </div>
    <button class="btn btn-primary" style="margin-top:18px" type="submit">Show my matches →</button>
  </form>
  <div id="finder-out" style="margin-top:24px"></div>
  ${ad('inline', R)}`), { priority: 0.8 });
  }

  /* ---------------- AWARDS ---------------- */
  {
    const pth = 'awards/', R = rootFor(pth);
    const deadline = `${SITE.year}-12-15T23:59:59`;
    P(pth, `SuperBest Awards ${SITE.year} — Vote for People's Choice`, `Vote in the SuperBest Awards ${SITE.year} People's Choice and nominate products, brands and creators.`, wrap(`
  ${head('🏆 Annual awards', `SuperBest Awards ${SITE.year}`, 'Two tracks: Editors\' Choice, based on our research scores, and People\'s Choice, decided by your votes. Nominations and voting are open now.')}
  <div class="card" style="display:flex;flex-wrap:wrap;gap:20px;align-items:center;justify-content:space-between"><div><h3 style="margin:0">Voting closes in</h3><p class="small muted" style="margin:0">Winners announced in January.</p></div>
  <div class="countdown" data-countdown="${deadline}"><div><b>0</b>days</div><div><b>0</b>hrs</div><div><b>0</b>min</div><div><b>0</b>sec</div></div></div>
  <h2 style="margin-top:32px">How it works</h2>
  <div class="grid g3"><div class="card"><h3>① Nominate</h3><p class="muted small">Suggest products, brands or creators who deserve recognition.</p></div><div class="card"><h3>② Vote</h3><p class="muted small">One vote per category per person. Verified by email.</p></div><div class="card"><h3>③ Winners</h3><p class="muted small">Winners receive the SuperBest Award badge.</p></div></div>
  <h2 style="margin-top:32px">Cast your People's Choice vote</h2>
  <form class="sb-form card" data-subject="Awards vote" data-ok="🗳️ Vote recorded! Thanks for helping pick the SuperBest.">
    ${hp}<input type="hidden" name="form" value="awards-vote">
    <div class="grid g2">${lists.map((l) => `<div class="field"><label>${esc(l.short)}</label><select name="vote_${l.slug}"><option value="">— Skip —</option>${l.picks.map((p) => `<option>${esc(p.name)}</option>`).join('')}</select></div>`).join('')}</div>
    <div class="row"><div class="field"><label>Name</label><input name="name" required></div><div class="field"><label>Email (to verify your vote)</label><input type="email" name="email" required></div></div>
    <div class="field">${consentBox(R)}</div>
    <button class="btn btn-primary" type="submit">Submit my votes</button>
  </form>
  <h2 style="margin-top:32px">Nominate a product, brand or creator</h2>
  <form class="sb-form card" data-subject="Awards nomination" data-ok="Nomination received. Thank you!">
    ${hp}<input type="hidden" name="form" value="awards-nomination">
    <div class="row"><div class="field"><label>Category</label><select name="category" required>${categories.map((c) => `<option>${esc(c.name)}</option>`).join('')}<option>Best Creator / Reviewer</option><option>Best New Brand</option></select></div><div class="field"><label>Nominee</label><input name="nominee" required placeholder="Product, brand or creator"></div></div>
    <div class="field"><label>Why do they deserve it?</label><textarea name="reason" required></textarea></div>
    <div class="row"><div class="field"><label>Your name</label><input name="name" required></div><div class="field"><label>Email</label><input type="email" name="email" required></div></div>
    <div class="field"><label class="check"><input type="checkbox" name="is_brand" value="yes"> I represent this brand (interested in awards sponsorship or badge licensing)</label></div>
    <div class="field">${consentBox(R)}</div>
    <button class="btn btn-primary" type="submit">Submit nomination</button>
  </form>
  <div class="band" style="margin-top:32px"><h3 style="color:#fff">Brands: sponsor a category or license the winner badge</h3><p>Put your brand in front of engaged voters and buyers.</p><a class="btn btn-accent" href="${R}advertise/">Awards partnerships →</a></div>`), { priority: 0.8 });
  }

  /* ---------------- CONTESTS ---------------- */
  {
    const pth = 'contests/', R = rootFor(pth);
    P(pth, 'Contests & Giveaways', 'Enter free SuperBest giveaways and creator contests. Official rules included.', wrap(`
  ${head('🎁 Win free stuff', 'Contests & giveaways', 'Free to enter. Monthly reader giveaways plus creator and reviewer contests with cash prizes. Funded by readers\' support and sponsors.')}
  <div class="grid g2">
    <div class="card"><span class="badge">Open now</span><h2 style="margin-top:10px">Monthly Reader Giveaway</h2><p>Win a <b>$100 gift card</b> to spend on any SuperBest Pick. One winner drawn at random each month.</p>
      <div class="countdown" data-countdown="${SITE.year}-12-31T23:59:59"><div><b>0</b>days</div><div><b>0</b>hrs</div><div><b>0</b>min</div><div><b>0</b>sec</div></div>
      <p class="small muted" style="margin-top:10px">Bonus entries: subscribe to the newsletter, subscribe on YouTube, or refer a friend.</p></div>
    <div class="card"><span class="badge alt">Creators</span><h2 style="margin-top:10px">Best Review Video Contest</h2><p>Make an honest 60–180 second review of any product in our guides. Prizes: <b>$500</b> 1st · <b>$250</b> 2nd · <b>$100</b> 3rd, plus a paid freelance offer for top creators.</p><p class="small muted">Judged on honesty, clarity, creativity and usefulness.</p></div>
  </div>
  <h2 style="margin-top:32px">Enter now</h2>
  <form class="sb-form card" data-subject="Contest entry" data-ok="✅ You're entered! Good luck. Winners are notified by email.">
    ${hp}<input type="hidden" name="form" value="contest-entry">
    <div class="row"><div class="field"><label>Contest</label><select name="contest" required><option>Monthly Reader Giveaway</option><option>Best Review Video Contest</option></select></div><div class="field"><label>Full name</label><input name="name" required></div></div>
    <div class="row"><div class="field"><label>Email</label><input type="email" name="email" required></div>${countryField}</div>
    <div class="field"><label>Video link (creator contest only)</label><input type="url" name="video_url" placeholder="https://youtube.com/…"></div>
    <div class="field"><label>Referred by (friend's email, optional; earns them a bonus entry)</label><input type="email" name="referrer"></div>
    <div class="field"><label class="check"><input type="checkbox" name="newsletter" value="yes"> Bonus entry: subscribe me to the SuperBest newsletter</label></div>
    <div class="field"><label class="check"><input type="checkbox" name="age" value="18+" required> I am 18 or older (or the age of majority where I live) and agree to the Official Rules below.</label></div>
    <div class="field">${consentBox(R)}</div>
    <button class="btn btn-primary" type="submit">Enter free</button>
  </form>
  <div class="card" style="margin-top:24px"><h3>🎯 Sponsor a contest</h3><p class="muted small">Brands can fund prizes and reach thousands of engaged entrants. <a href="${R}advertise/">Talk to us →</a> · Readers can fund prizes too: <a href="${R}support/">Support SuperBest</a>.</p></div>
  <section class="prose" id="rules" style="margin-top:32px">
    <h2>Official rules (summary)</h2>
    <p><b>No purchase necessary.</b> A purchase does not improve your chances of winning. Void where prohibited or restricted by law.</p>
    <ul>
      <li><b>Eligibility:</b> Open to individuals 18+ (or the age of majority in their place of residence) where such contests are legal. Employees of SuperBest.com and their immediate families are not eligible.</li>
      <li><b>Entry period:</b> Each monthly giveaway runs from the first to the last day of the calendar month (11:59 pm ET).</li>
      <li><b>How to enter:</b> Submit the entry form above. Limit one entry per person per contest, plus listed bonus entries. Automated or duplicate entries are disqualified.</li>
      <li><b>Winner selection:</b> Reader giveaways are drawn at random. Creator contests are judged by the SuperBest editorial team on the published criteria. Where required by law, winners must correctly answer a skill-testing question.</li>
      <li><b>Notification:</b> Winners are notified by email and must respond within 14 days, or an alternate winner will be selected.</li>
      <li><b>Prizes:</b> Prizes are as described, are non-transferable, and no cash substitution is allowed except at the sponsor's discretion. Winners are responsible for any applicable taxes.</li>
      <li><b>Privacy:</b> Entry data is used to administer the contest and as described in our <a href="${R}privacy/">Privacy Policy</a>.</li>
      <li><b>Platform disclaimer:</b> This promotion is not sponsored, endorsed or administered by, or associated with, YouTube, Google, Meta or any other platform.</li>
      <li><b>Sponsor:</b> SuperBest.com. Questions: <a href="${R}contact/">contact us</a>.</li>
    </ul>
  </section>`), { priority: 0.7 });
  }

  /* ---------------- VIDEOS ---------------- */
  {
    const pth = 'videos/', R = rootFor(pth);
    P(pth, 'Video Reviews', 'Watch video reviews and comparisons for every SuperBest guide.', wrap(`
  ${head('▶ Watch', 'Video reviews & comparisons', 'See products in action before you buy. Every guide has a video hub.')}
  <p><a class="btn btn-primary" data-yt-channel href="#">▶ Subscribe to SuperBest on YouTube</a> <a class="btn btn-ghost" href="${R}contests/">Creators: enter the video contest</a></p>
  ${ad('top', R)}
  <div class="grid g3">${lists.map((l) => `<div><div data-yt-slot="${l.slug}"><a class="video-card" href="https://www.youtube.com/results?search_query=${encodeURIComponent(l.short + ' review')}" target="_blank" rel="noopener"><div><div class="play">▶</div><b>${esc(l.short)}</b><br><span class="small">Video reviews</span></div></a></div><p class="small" style="margin-top:8px"><a href="${R}best/${l.slug}/">Read the ${esc(l.title)} guide →</a></p></div>`).join('')}</div>
  <div class="band" style="margin-top:32px"><h3 style="color:#fff">Are you a video creator?</h3><p>We hire freelance reviewers and editors, and feature great creators.</p><a class="btn btn-accent" href="${R}careers/">Join our talent network →</a></div>`), { priority: 0.7 });
  }

  /* ---------------- ADVERTISE / PARTNER ---------------- */
  {
    const pth = 'advertise/', R = rootFor(pth);
    const pk = [
      ['Sponsored Spotlight', 'Clearly labelled "Partner" feature placed next to (never inside) editorial rankings on a relevant guide.', 'From $299/mo'],
      ['Category Sponsorship', 'Own a whole category: banner, "Presented by" credit and newsletter mentions.', 'From $799/mo'],
      ['Newsletter Sponsorship', 'Top placement in the weekly SuperBest shortlist email.', 'From $149/issue'],
      ['Awards Partnership', 'Sponsor an award category or license the SuperBest Award winner badge.', 'Custom'],
      ['Contest & Giveaway Sponsor', 'Fund prizes and reach engaged entrants with bonus-entry actions.', 'From $500'],
      ['Qualified Lead Partner', 'Receive opt-in, matched buyer leads from our free matching service.', 'Pay-per-lead'],
    ];
    P(pth, 'Advertise, Sponsor & Partner', 'Advertise on SuperBest.com: sponsorships, newsletter placements, awards partnerships, giveaways and qualified lead programs.', wrap(`
  ${head('For brands & agencies', 'Advertise, sponsor & partner with SuperBest', 'Reach readers at the moment they decide what to buy. Every paid placement is clearly labelled, and editorial rankings are never for sale.')}
  <div class="card" style="border:2px solid var(--accent)"><b>Interested in acquiring this website or the SuperBest.com domain name, or in a strategic partnership?</b> <a href="${SITE.inquiry}" target="_blank" rel="noopener">Contact here →</a></div>
  <h2 style="margin-top:32px">Packages</h2>
  <div class="grid g3">${pk.map(([t, d, p]) => `<div class="card"><h3>${t}</h3><p class="muted small">${d}</p><b>${p}</b></div>`).join('')}</div>
  <h2 style="margin-top:32px" id="listing">Request a media kit or proposal</h2>
  <form class="sb-form card" data-subject="ADVERTISING / PARTNERSHIP inquiry" data-ok="Thanks! Our partnerships team will reply within 1–2 business days.">
    ${hp}<input type="hidden" name="form" value="advertise">
    <div class="row"><div class="field"><label>Name</label><input name="name" required></div><div class="field"><label>Work email</label><input type="email" name="email" required></div></div>
    <div class="row"><div class="field"><label>Company / brand</label><input name="company" required></div><div class="field"><label>Website</label><input type="url" name="website" placeholder="https://"></div></div>
    <div class="row"><div class="field"><label>Interested in</label><select name="interest" required><option value="">Select…</option>${pk.map(([t]) => `<option>${t}</option>`).join('')}<option>Domain / website acquisition</option><option>Strategic partnership</option><option>Other</option></select></div>
    <div class="field"><label>Monthly budget</label><select name="budget"><option>Under $500</option><option>$500–$2,000</option><option>$2,000–$10,000</option><option>$10,000+</option></select></div></div>
    <div class="field"><label>Goals & details</label><textarea name="details"></textarea></div>
    <div class="field">${consentBox(R)}</div>
    <button class="btn btn-primary" type="submit">Request proposal</button>
  </form>
  <div class="card" style="margin-top:24px"><h3>Our advertising principles</h3><ul><li>Paid placements are labelled "Partner" or "Sponsored".</li><li>Sponsors never influence scores, rankings or awards.</li><li>We follow FTC endorsement guidelines and Google publisher policies.</li></ul></div>`), { priority: 0.7 });
  }

  /* ---------------- SUPPORT / DONATE ---------------- */
  {
    const pth = 'support/', R = rootFor(pth);
    const tiers = [
      ['Supporter', '$5', 'one-time', ['Our heartfelt thanks', 'Name on the Supporters Wall (optional)'], 'paypal'],
      ['Champion', '$10', '/month', ['Everything in Supporter', 'Early access to new guides', 'Vote on what we cover next'], 'patreon'],
      ['Patron', '$50', '/month', ['Everything in Champion', 'Quarterly behind-the-scenes report', 'Priority matching requests'], 'patreon'],
      ['Founding Sponsor', '$500', 'one-time', ['Logo or name on our Sponsors page', 'Sponsor a contest prize', 'Thank-you in the newsletter'], 'stripe'],
    ];
    P(pth, 'Support SuperBest — Donate', 'Support independent, reader-first recommendations. Donations fund operations, marketing, new talent, contests and prizes.', wrap(`
  ${head('💜 Reader-supported', 'Support independent recommendations', 'SuperBest is free for everyone. Your support keeps it independent and funds research, hiring, community contests and prizes.')}
  <div class="grid g2" style="align-items:start">
    <div class="card">
      <h3>Give once</h3>
      <div class="amounts" data-target="pledge-amount">${[5, 10, 25, 50, 100, 250].map((a, i) => `<button type="button" data-amt="${a}" class="${i === 2 ? 'on' : ''}">$${a}</button>`).join('')}</div>
      <p class="small muted">Choose a secure payment method:</p>
      <div class="buy-row">
        <a class="btn btn-primary" href="#pledge" data-pay="paypal">PayPal</a>
        <a class="btn btn-primary" href="#pledge" data-pay="stripe">Card (Stripe)</a>
        <a class="btn btn-accent" href="#pledge" data-pay="buymeacoffee">Buy Me a Coffee</a>
        <a class="btn btn-ghost" href="#pledge" data-pay="kofi">Ko-fi</a>
        <a class="btn btn-ghost" href="#pledge" data-pay="patreon">Patreon (monthly)</a>
      </div>
      <p class="small muted" style="margin-top:12px">Payments are processed by the provider you choose. SuperBest never sees your card details.</p>
    </div>
    <div class="card">
      <h3>Where your support goes</h3>
      <div class="alloc">${[['Ongoing operations (hosting, tools, research)', 35], ['Promotion & marketing', 20], ['Hiring talent (writers, video, dev)', 25], ['Contests & prizes', 20]].map(([t, v]) => `<div class="bar" style="grid-template-columns:1fr 120px 40px"><span>${t}</span><i><b style="width:${v}%"></b></i><span>${v}%</span></div>`).join('')}</div>
      <p class="small muted" style="margin-top:12px">Target allocation. We publish an annual summary of how support was used.</p>
    </div>
  </div>
  <h2 style="margin-top:32px">Membership tiers</h2>
  <div class="tiers">${tiers.map(([n, p, per, perks, pay], i) => `<div class="tier${i === 1 ? ' featured' : ''}">${i === 1 ? '<span class="badge" style="align-self:flex-start">Most popular</span>' : ''}<h3 style="margin-top:8px">${n}</h3><div class="price">${p}<span class="small muted"> ${per}</span></div><ul>${perks.map((x) => `<li>${x}</li>`).join('')}</ul><a class="btn ${i === 1 ? 'btn-primary' : 'btn-ghost'} btn-block" href="#pledge" data-pay="${pay}">Choose ${n}</a></div>`).join('')}</div>
  <h2 style="margin-top:32px">Pledge, sponsor or support another way</h2>
  <p class="muted">Prefer bank transfer, a corporate sponsorship, or supporting a specific contest or hire? Send a pledge and we'll reply with secure payment details.</p>
  <form class="sb-form card" id="pledge" data-subject="DONATION / SUPPORT pledge" data-ok="💜 Thank you! We'll reply with secure payment details shortly.">
    ${hp}<input type="hidden" name="form" value="donation-pledge">
    <div class="row"><div class="field"><label>Name</label><input name="name" required></div><div class="field"><label>Email</label><input type="email" name="email" required></div></div>
    <div class="row"><div class="field"><label>Amount (USD)</label><input id="pledge-amount" type="number" name="amount" min="1" value="25" required></div>
    <div class="field"><label>Support type</label><select name="purpose"><option>General support / operations</option><option>Promotions & marketing</option><option>Hiring talent</option><option>Contests & prizes</option><option>Corporate sponsorship</option></select></div></div>
    <div class="row"><div class="field"><label>Preferred method</label><select name="method"><option>PayPal</option><option>Card (Stripe)</option><option>Buy Me a Coffee</option><option>Ko-fi</option><option>Patreon (monthly)</option><option>Bank transfer</option><option>Other</option></select></div>
    <div class="field"><label>Frequency</label><select name="frequency"><option>One-time</option><option>Monthly</option><option>Yearly</option></select></div></div>
    <div class="field"><label class="check"><input type="checkbox" name="wall" value="yes"> List my name on the Supporters Wall</label></div>
    <div class="field"><label>Message (optional)</label><textarea name="message"></textarea></div>
    <div class="field">${consentBox(R)}</div>
    <button class="btn btn-primary" type="submit">Send my pledge</button>
  </form>
  <p class="small muted" style="margin-top:14px">Note: SuperBest.com is not a registered charity. Contributions are not tax-deductible unless stated otherwise in writing.</p>`), { priority: 0.7 });
  }

  /* ---------------- CAREERS / TALENT ---------------- */
  {
    const pth = 'careers/', R = rootFor(pth);
    const roles = [
      ['Product Researcher & Writer', 'Freelance · Remote', 'Research products and write clear, honest best-of guides.'],
      ['Video Creator / Editor', 'Freelance · Remote', 'Produce short-form and long-form review videos for YouTube.'],
      ['SEO & Content Strategist', 'Part-time · Remote', 'Plan topics, optimise pages and grow organic traffic.'],
      ['Partnerships & Ad Sales', 'Commission · Remote', 'Build sponsor, affiliate and awards partnerships.'],
      ['Community & Contest Manager', 'Part-time · Remote', 'Run awards, giveaways and our reader community.'],
      ['Front-end Developer', 'Contract · Remote', 'Build interactive tools, comparisons and site features.'],
    ];
    P(pth, 'Careers & Talent Network', 'Join the SuperBest talent network: writers, video creators, SEO, partnerships, community and developers.', wrap(`
  ${head('🚀 We\'re hiring', 'Careers & talent network', 'Help millions of people buy smarter. Remote-first, flexible work for talented researchers, creators and builders.')}
  <div class="grid g3">${roles.map(([t, m, d]) => `<div class="card"><span class="badge alt">${m}</span><h3 style="margin-top:10px">${t}</h3><p class="muted small">${d}</p><a href="#apply" class="btn btn-ghost btn-sm">Apply</a></div>`).join('')}</div>
  <h2 style="margin-top:32px" id="apply">Apply / join the talent network</h2>
  <form class="sb-form card" data-subject="CAREERS application" data-ok="Application received. We review every submission and reply to shortlisted candidates.">
    ${hp}<input type="hidden" name="form" value="careers">
    <div class="row"><div class="field"><label>Full name</label><input name="name" required></div><div class="field"><label>Email</label><input type="email" name="email" required></div></div>
    <div class="row"><div class="field"><label>Role</label><select name="role" required>${roles.map(([t]) => `<option>${t}</option>`).join('')}<option>Other / open application</option></select></div>${countryField}</div>
    <div class="row"><div class="field"><label>Portfolio / LinkedIn / YouTube</label><input type="url" name="portfolio" required placeholder="https://"></div><div class="field"><label>Resume link (Google Drive, Dropbox…)</label><input type="url" name="resume" placeholder="https://"></div></div>
    <div class="row"><div class="field"><label>Availability</label><select name="availability"><option>Freelance / per project</option><option>Part-time</option><option>Full-time</option></select></div><div class="field"><label>Expected rate (USD)</label><input name="rate" placeholder="e.g. $40/hr or $300/article"></div></div>
    <div class="field"><label>Why SuperBest? (short)</label><textarea name="message" required></textarea></div>
    <div class="field">${consentBox(R)}</div>
    <button class="btn btn-primary" type="submit">Submit application</button>
  </form>`), { priority: 0.6 });
  }

  /* ---------------- DEALS ---------------- */
  {
    const pth = 'deals/', R = rootFor(pth);
    P(pth, 'Deals & Price Alerts', 'Check today\'s prices on SuperBest Picks and sign up for price-drop alerts.', wrap(`
  ${head('💸 Save more', 'Deals & price alerts', 'Check live prices on our top-rated picks and get alerts when prices drop.')}
  <div class="card"><h3>🔔 Get price-drop alerts</h3>
  <form class="sb-form" data-subject="Price alert signup" data-ok="Alert set! We'll email you when prices drop.">${hp}<input type="hidden" name="form" value="price-alert">
    <div class="row"><div class="field"><select name="product" required><option value="">Choose a product…</option>${products.map((p) => `<option>${esc(p.name)}</option>`).join('')}</select></div><div class="field"><input type="email" name="email" placeholder="Your email" required></div></div>
    <div class="field">${consentBox(R)}</div><button class="btn btn-primary" type="submit">Set alert</button></form></div>
  ${ad('inline', R)}
  <div class="table-wrap"><table data-sortable><thead><tr><th>Product</th><th>Award</th><th>Score</th><th>Guide</th><th>Price</th></tr></thead><tbody>
  ${lists.flatMap((l) => l.picks.map((p) => `<tr><td>${esc(p.name)}</td><td><span class="badge">${esc(p.badge)}</span></td><td>${p.score}</td><td><a href="${R}best/${l.slug}/">${esc(l.short)}</a></td><td>${p.url ? `<a href="${p.url}" target="_blank" rel="sponsored nofollow noopener" data-aff="official" data-q="${esc(p.name)}">See plans →</a>` : `<a href="#" target="_blank" rel="sponsored nofollow noopener" data-aff="amazon" data-q="${esc(p.name)}">Check price →</a>`}</td></tr>`)).join('')}
  </tbody></table></div>`), { priority: 0.7 });
  }

  /* ---------------- SUBMIT / SUGGEST ---------------- */
  {
    const pth = 'submit/', R = rootFor(pth);
    P(pth, 'Suggest a Product or Write a Review', 'Suggest products for SuperBest to rank, share your owner experience, or report an update.', wrap(`
  ${head('🗣️ Community', 'Suggest a product or share your review', 'Help us keep SuperBest accurate. Owner experiences and suggestions feed directly into our rankings.')}
  <form class="sb-form card" data-subject="Reader submission" data-ok="Thanks! Our editors review every submission.">
    ${hp}<input type="hidden" name="form" value="submit">
    <div class="row"><div class="field"><label>Type</label><select name="type"><option>Suggest a product to rank</option><option>Suggest a new guide</option><option>Share my owner review</option><option>Report outdated info</option></select></div><div class="field"><label>Product / topic</label><input name="product" required></div></div>
    <div class="row"><div class="field"><label>Your rating (if reviewing)</label><select name="rating"><option value="">—</option><option>5 ★★★★★</option><option>4 ★★★★</option><option>3 ★★★</option><option>2 ★★</option><option>1 ★</option></select></div><div class="field"><label>Owned for</label><select name="owned"><option value="">—</option><option>&lt; 1 month</option><option>1–6 months</option><option>6–12 months</option><option>1+ years</option></select></div></div>
    <div class="field"><label>Details</label><textarea name="details" required></textarea></div>
    <div class="row"><div class="field"><label>Name</label><input name="name" required></div><div class="field"><label>Email</label><input type="email" name="email" required></div></div>
    <div class="field">${consentBox(R)}</div>
    <button class="btn btn-primary" type="submit">Submit</button>
  </form>`), { priority: 0.5 });
  }

  /* ---------------- CHECKLIST (lead magnet delivery) ---------------- */
  {
    const pth = 'checklist/', R = rootFor(pth);
    const qs = ['What problem am I actually solving?', 'What is my all-in budget (including accessories, subscriptions, shipping)?', 'Which three features are must-haves, and which are nice-to-haves?', 'How long do I expect to use it?', 'What does the warranty cover, and for how long?', 'What is the return window and who pays return shipping?', 'Are there ongoing costs (subscriptions, refills, parts)?', 'What do long-term owners complain about?', 'Is a newer model coming soon?', 'Is the price at a typical low? (Check price history.)', 'Is there a cheaper option that covers 90% of my needs?', 'Would I still buy it at full price?'];
    P(pth, "The SuperBest Buyer's Checklist", 'The 12 questions to ask before any big purchase. Free, printable checklist.', wrap(`
  ${head('✅ Free download', "The SuperBest Buyer's Checklist", 'Print it or save it. Run through these 12 questions before any purchase over $100.')}
  <div class="card prose"><ol>${qs.map((q) => `<li style="padding:6px 0"><label class="check"><input type="checkbox"> ${q}</label></li>`).join('')}</ol>
  <button class="btn btn-primary" onclick="window.print()">🖨️ Print / save as PDF</button></div>
  <div class="band" style="margin-top:24px"><h3 style="color:#fff">Want us to do the research for you?</h3><p>Get a free, personalised shortlist.</p><a class="btn btn-accent" href="${R}get-matched/">Get matched free →</a></div>`), { priority: 0.5 });
  }

  /* ---------------- HOW WE RANK ---------------- */
  {
    const pth = 'how-we-test/', R = rootFor(pth);
    P(pth, 'How We Research & Rank', 'How SuperBest researches, scores and ranks products. Our methodology, scoring weights and editorial independence.', wrap(`
  ${head('Methodology', 'How we research & rank', 'Transparency is the product. Here\'s exactly how a product earns a SuperBest Pick.')}
  <div class="prose">
  <h2>1. Research</h2><p>For every guide we review manufacturer specifications, independent lab and expert testing from established publications, verified owner reviews across multiple retailers, long-term reliability and warranty data, and reader submissions.</p>
  <h2>2. Score</h2><p>Each product receives a <b>SuperBest Score</b> out of 10: a weighted editorial rating across 4–5 criteria that matter most in that category. The weights are published on every guide.</p>
  <h2>3. Award</h2><p>Award badges (SuperBest Pick, Best Value, Premium Pick and others) show who each product suits best. They are not just a ranking.</p>
  <h2>4. Update</h2><p>Guides are reviewed on a regular cycle and whenever major new models launch. Every guide shows its last-updated date.</p>
  <h2>What we don't do</h2><ul><li>We don't accept payment for rankings, scores or awards.</li><li>We don't let sponsors review or edit editorial content.</li><li>We don't present research-based scores as hands-on lab results. Where we do hands-on testing, we say so.</li></ul>
  <h2>Community signals</h2><p>People's Choice votes and owner reviews are shown alongside editorial picks and kept separate from them.</p>
  <h2>Corrections</h2><p>Spot something wrong? <a href="${R}submit/">Report outdated info</a> and we'll review it.</p>
  </div>`), { priority: 0.6 });
  }

  /* ---------------- ABOUT ---------------- */
  {
    const pth = 'about/', R = rootFor(pth);
    P(pth, 'About SuperBest', 'SuperBest.com helps people find the super best products and services through transparent research, comparisons and free personal recommendations.', wrap(`
  ${head('About', 'We find the super best, so you don\'t have to', 'SuperBest.com is an independent, reader-supported recommendation platform.')}
  <div class="grid g2"><div class="prose"><h2>Our mission</h2><p>Buying decisions are noisy. Thousands of reviews, sponsored lists and conflicting advice. SuperBest cuts through it with clear, research-driven rankings, honest pros and cons, and a free matching service for people who want a personal answer.</p>
  <h2>How we make money</h2><p>We earn through clearly labelled advertising (including Google AdSense), affiliate commissions when readers buy through our links, labelled sponsorships, qualified partner referrals (only with your consent), and reader support. None of these influence our rankings.</p></div>
  <div class="card"><h3>Get involved</h3><ul><li><a href="${R}get-matched/">Get a free recommendation</a></li><li><a href="${R}awards/">Vote in the SuperBest Awards</a></li><li><a href="${R}contests/">Enter a giveaway</a></li><li><a href="${R}careers/">Join our talent network</a></li><li><a href="${R}support/">Support SuperBest</a></li><li><a href="${R}advertise/">Advertise or partner</a></li></ul></div></div>`), { priority: 0.5 });
  }

  /* ---------------- CONTACT ---------------- */
  {
    const pth = 'contact/', R = rootFor(pth);
    P(pth, 'Contact SuperBest', 'Contact SuperBest.com for questions, corrections, partnerships and press.', wrap(`
  ${head('Contact', 'Get in touch', 'We read every message. For website, domain, sponsorship, advertising or partnership interest, you can also use our <a href="' + SITE.inquiry + '" target="_blank" rel="noopener">dedicated inquiry page</a>.')}
  <div class="grid g2" style="align-items:start">
  <form class="sb-form card" data-subject="CONTACT form" data-ok="Message sent! We'll reply within 1–2 business days.">
    ${hp}<input type="hidden" name="form" value="contact">
    <div class="row"><div class="field"><label>Name</label><input name="name" required></div><div class="field"><label>Email</label><input type="email" name="email" required></div></div>
    <div class="field"><label>Topic</label><select name="topic"><option>General question</option><option>Correction / update</option><option>Advertising / sponsorship</option><option>Website / domain acquisition</option><option>Partnership</option><option>Press</option><option>Donations & support</option><option>Contest / awards</option><option>Privacy request</option></select></div>
    <div class="field"><label>Message</label><textarea name="message" required></textarea></div>
    <div class="field">${consentBox(R)}</div>
    <button class="btn btn-primary" type="submit">Send message</button>
  </form>
  <div class="card"><h3>Other ways to reach us</h3><p><a href="#" data-email-link data-subject="SuperBest.com inquiry">✉️ Email the SuperBest team</a></p><p><a href="${SITE.inquiry}" target="_blank" rel="noopener">🤝 Website / domain / sponsorship / advertising / partnership inquiries</a></p><p><a href="${R}advertise/">📈 Advertising packages</a></p><p><a href="${R}careers/">🚀 Careers & talent</a></p></div>
  </div>`), { priority: 0.5, noModal: true });
  }

  /* ---------------- DISCLOSURE & TRADEMARK ---------------- */
  {
    const pth = 'disclosure/', R = rootFor(pth);
    P(pth, 'Disclosures, Trademark & Copyright', 'Affiliate disclosure, advertising disclosure, and trademark and copyright notice for SuperBest.com.', wrap(`
  ${head('Legal', 'Disclosures, trademark & copyright', '')}
  <div class="prose">
  <h2>Affiliate disclosure</h2><p>SuperBest.com participates in affiliate programs, which may include the Amazon Services LLC Associates Program and programs run by other retailers and brands. When you click a link and make a purchase, we may earn a commission at no additional cost to you. As an Amazon Associate, SuperBest.com earns from qualifying purchases. Commissions never influence our scores, rankings or awards.</p>
  <h2>Advertising disclosure</h2><p>SuperBest.com displays advertising, which may include Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this and other websites. You can opt out of personalised advertising at <a href="https://adssettings.google.com" target="_blank" rel="noopener">Google Ads Settings</a>. Sponsored content is always labelled "Sponsored" or "Partner".</p>
  <h2>Editorial scores</h2><p>SuperBest Scores are editorial opinions based on the research methods described in <a href="${R}how-we-test/">How we rank</a>. Product specifications and availability change. Confirm details with the retailer before you buy.</p>
  <h2>Trademark notice</h2><p>"SuperBest.com" refers to this website only. SuperBest.com is an <b>independent website</b> and is <b>not affiliated with, endorsed by, sponsored by or connected to</b> any company, store, supermarket, brand, product or organisation that uses the words "Super Best", "Superbest", "Super-Best" or any similar name or mark, anywhere in the world. Any similarity in name is coincidental and descriptive ("super" + "best").</p>
  <p>All third-party product names, company names, brands, logos and trademarks mentioned on this site are the property of their respective owners. They are used for identification and descriptive (nominative) purposes only and do not imply endorsement. SuperBest.com does not display third-party logos or product photos without permission.</p>
  <h2>Copyright notice</h2><p>All original content on this website, including text, rankings, scoring methodology, design, graphics and code, is © ${SITE.year} SuperBest.com, all rights reserved, unless otherwise noted. You may quote brief excerpts with attribution and a link. Reproducing whole guides without written permission is prohibited.</p>
  <h2>Copyright complaints (DMCA)</h2><p>If you believe content on this site infringes your copyright or trademark, please <a href="${R}contact/">contact us</a> with: the work concerned, the URL of the material, your contact details, a good-faith statement, and a statement of accuracy under penalty of perjury. We respond promptly to valid notices.</p>
  <h2>Website & domain inquiries</h2><p>For interest in this website, the domain name, sponsorship, advertising or partnership, <a href="${SITE.inquiry}" target="_blank" rel="noopener">contact here</a>.</p>
  </div>`), { priority: 0.4 });
  }

  /* ---------------- PRIVACY ---------------- */
  {
    const pth = 'privacy/', R = rootFor(pth);
    P(pth, 'Privacy Policy', 'How SuperBest.com collects, uses and protects your information.', wrap(`
  ${head('Legal', 'Privacy policy', `Last updated: September 2026`)}
  <div class="prose">
  <h2>Information we collect</h2><p><b>Information you provide:</b> name, email and any details you submit through our forms (matching requests, newsletter, contests, awards, donations, careers, contact). <b>Automatic information:</b> device, browser and usage data collected through cookies and similar technologies, if you consent.</p>
  <h2>How we use it</h2><ul><li>To answer your requests and send personalised recommendations</li><li>To run newsletters, contests and awards</li><li>With your explicit opt-in only: to share matching requests with vetted partners who can help you</li><li>To measure and improve the site, and to show ads (with consent where required)</li></ul>
  <h2>Form processing</h2><p>Form submissions are transmitted securely via a third-party form-delivery service (FormSubmit) to our team's inbox. Payment information is handled entirely by payment providers (such as PayPal, Stripe, Buy Me a Coffee, Ko-fi or Patreon) under their own privacy policies.</p>
  <h2>Cookies & advertising</h2><p>We use Google AdSense and may use Google Analytics. Google and its partners may use cookies to serve ads based on your visits to this and other sites. Learn more at <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">How Google uses information</a>. You can change your consent anytime by clearing this site's cookies.</p>
  <h2>Your rights</h2><p>Depending on where you live (for example under GDPR, UK GDPR, CCPA/CPRA, PIPEDA or Quebec Law 25), you may have rights to access, correct, delete or port your data and to object to or restrict processing. <a href="${R}contact/">Contact us</a> to make a request.</p>
  <h2>Retention & security</h2><p>We keep personal data only as long as needed for the purposes above and protect it with reasonable safeguards.</p>
  <h2>Children</h2><p>SuperBest is not directed to children under 16 and we do not knowingly collect their data.</p>
  <h2>Contact</h2><p>Privacy questions: <a href="${R}contact/">contact form</a>.</p>
  </div>`), { priority: 0.3 });
  }

  /* ---------------- TERMS ---------------- */
  {
    const pth = 'terms/', R = rootFor(pth);
    P(pth, 'Terms of Use', 'Terms governing use of SuperBest.com.', wrap(`
  ${head('Legal', 'Terms of use', 'Last updated: September 2026')}
  <div class="prose">
  <p>By using SuperBest.com you agree to these terms.</p>
  <h2>Information only</h2><p>Content is provided for general information. It is not professional, financial, legal or medical advice. Prices, specifications and availability change. Verify with the seller before purchasing.</p>
  <h2>Third-party links</h2><p>We link to third-party websites and are not responsible for their content, products or policies. Purchases are between you and the seller.</p>
  <h2>User submissions</h2><p>By submitting reviews, nominations, videos or other content, you grant SuperBest.com a non-exclusive, royalty-free licence to use, edit and display it. You confirm it is your own and lawful.</p>
  <h2>Contests & donations</h2><p>Contests are governed by their <a href="${R}contests/#rules">Official Rules</a>. Donations are voluntary, generally non-refundable, and not tax-deductible unless stated.</p>
  <h2>Intellectual property</h2><p>See our <a href="${R}disclosure/">trademark and copyright notice</a>.</p>
  <h2>Disclaimer & limitation of liability</h2><p>The site is provided "as is" without warranties. To the fullest extent permitted by law, SuperBest.com is not liable for indirect or consequential damages arising from use of the site.</p>
  <h2>Changes</h2><p>We may update these terms. Continued use means you accept the updated terms.</p>
  </div>`), { priority: 0.3 });
  }

  /* ---------------- 404 ---------------- */
  write('404.html', layout({ path: '', title: 'Page not found', desc: 'Page not found.', body: wrap(`<div class="center" style="padding:60px 0"><h1>404: Not the super best page</h1><p class="muted">That page moved or never existed.</p><p><a class="btn btn-primary" href="./">Go home</a> <a class="btn btn-ghost" href="best/">Browse all lists</a></p></div>`) })
    .replace('<meta charset="utf-8">', `<meta charset="utf-8">\n<script>(function(){var p=location.pathname,b=p.indexOf('/superbest-com/')===0?'/superbest-com/':'/';document.write('<base href="'+b+'">');})();</script>`));
}
