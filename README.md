# SuperBest.com

**The super best of everything, researched, ranked and simplified.** A static, fully monetisable best-of recommendation site built for free hosting on GitHub Pages.

- 🏆 13 best-of guides · 65 ranked products · 7 category hubs · 13 auto vs-pages
- 🎯 Lead gen: 4-step **Get Matched** funnel, hero and sidebar quick-match forms, exit-intent lead magnet, newsletter, price alerts
- 💰 Monetisation: AdSense (consent-gated), Amazon/official affiliate links, YouTube embeds, sponsorships, pay-per-lead, donations/memberships
- 🗳️ Community: awards voting and nominations, contests and giveaways (with official rules), careers/talent, reader submissions
- 🔍 Tools: 4-way compare, finder quiz, instant search, sortable tables, dark mode
- ⚖️ Legal: privacy, terms, affiliate/advertising disclosure, trademark and copyright notice, DMCA

## Edit & rebuild
```bash
# 1) Edit content: src/data/lists.mjs, src/data/categories.mjs
# 2) Edit monetisation switches: assets/js/config.js (no rebuild needed)
node src/build.mjs     # regenerates static HTML + dist-jekyll/ (Jekyll sources), sitemap.xml, products.json, search-index.json
```
Add a new guide by appending an object to `lists.mjs`. Its page, vs-page, hub card, search entry, compare entries and sitemap entry are generated automatically.

**Deployment:** the live site is served by GitHub Pages from the `gh-pages` branch (Settings → Pages → Deploy from branch → `gh-pages` / root). That branch holds the Jekyll sources from `dist-jekyll/` plus the static assets (`assets/`, `favicon.svg`, `manifest.webmanifest`, `robots.txt`, `ads.txt`, `sitemap.xml`, `products.json`, `search-index.json`, `404.html`). Pages then renders every page through `_layouts/sb.html`, so there's no manual build step on GitHub. After editing data or templates, run `node src/build.mjs` and copy the contents of `dist-jekyll/` and the changed assets to `gh-pages`. Source code lives on `main`.

## Go-live checklist
1. **Forms:** submit any form once. FormSubmit emails an activation link to the site inbox. Click **Activate**. (Optional: paste the private alias FormSubmit gives you into `formAlias` in `config.js`.)
2. **Custom domain:** at your registrar set A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` and `www` CNAME → `webworksa1.github.io`. Then in repo **Settings → Pages → Custom domain** enter `superbest.com` and tick **Enforce HTTPS**.
3. **AdSense:** apply, then set `adsenseClient` and `adSlots` in `config.js` and update `ads.txt`.
4. **Affiliate:** set `amazonTag`. Replace official links with your affiliate links in `lists.mjs`.
5. **YouTube:** set `youtubeChannelUrl` and map guide slugs to video IDs in `youtubeVideos`.
6. **Donations:** paste your PayPal / Stripe / BMC / Ko-fi / Patreon links into `donate`.
7. **Search Console:** submit `https://superbest.com/sitemap.xml`.
8. **Social image:** run `python3 src/og.py` (needs Pillow) and commit `assets/img/og.png`.
9. **Content:** product lineups change fast. Review picks and specs before launch and on a regular cycle.

## Docs
- `docs/IDEA-AND-STRATEGY.md`: why this idea, revenue model, projections
- `docs/RESEARCH-35-SITES.md`: competitive research and feature mapping
- `docs/PHASE-PROMPTS.md`: phase-wise build prompts

## Trademark & copyright
SuperBest.com is an independent website and is not affiliated with any company, store or brand using "Super Best", "Superbest" or similar names. Product names and trademarks belong to their owners and are used for identification only. Original content and code © SuperBest.com.

Website / domain / sponsorship / advertising / partnership inquiries: https://web.works/contact
