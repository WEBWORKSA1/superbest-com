# SuperBest.com: Phase-wise Build Prompts

Copy each phase into an AI builder (Claude, etc.) in order. Each phase is self-contained and assumes the previous phase is done.

**Global rules (paste at the top of every phase):**
> Domain: SuperBest.com. Concept: "The super best of everything": research-driven best-of lists, comparisons, a free matching service, awards, contests and video reviews. Static HTML/CSS/vanilla JS only, hostable free on GitHub Pages, with **relative links everywhere** so it works on a subpath and a custom domain. Mobile-first, WCAG AA, Lighthouse 90+.
> On **every page**, the top bar reads: "Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership", linked to https://web.works/contact.
> All forms go to a single destination email that must **never appear in HTML or visible text**. Store it encoded in JS, assemble it only at send time, and post via FormSubmit AJAX. Email links use a JS click handler, never a raw mailto in markup.
> No third-party logos or product photos. Product names are for identification only. Add the trademark and copyright disclaimer: SuperBest.com is independent and not affiliated with any company named "Super Best", "Superbest" or similar.

---

## Phase 1: Foundation, design system & architecture
Build the static generator (`node src/build.mjs`) with data files (`src/data/categories.mjs`, `src/data/lists.mjs`), a shared layout (header, mega-menu, footer, consent banner, lead modal), and a design system in `assets/css/style.css`: tokens, light/dark mode, cards, badges, score chips, tables, forms, bands, tiers, modal, mobile CTA bar. Create `assets/js/config.js` as the single monetisation config (AdSense client and slots, Amazon tag, YouTube channel and video map, donation links, GA ID, FormSubmit alias). Output clean URLs as `/folder/index.html`. Add `robots.txt`, `sitemap.xml` (auto), `ads.txt`, `manifest.webmanifest`, favicon, OG image, `.nojekyll` and a `404.html` with dynamic base.

## Phase 2: Core content engine (SEO money pages)
For each list in data, generate `/best/<slug>/`: breadcrumbs; H1 with year; intro; meta (author, updated date, count, methodology link); affiliate disclosure strip; verdict box; quick-pick grid; sortable comparison table; video block; ranked pick cards (badge, rank, score, summary, spec chips, pros/cons, Check price / Compare / Helpful); a mid-article lead band; scoring weights; FAQ accordion; a vs link; newsletter; related guides; and a sticky sidebar (TOC, lead form, ad). Add JSON-LD: BreadcrumbList, ItemList, FAQPage and Article. Auto-generate `/vs/<a>-vs-<b>/` for the top two picks, `/category/<slug>/` hubs, a `/best/` A–Z index, and the home page (hero search, hero lead form, stats, categories, latest guides, winners, matching band, videos, awards/contests/support cards, trust section, newsletter, advertiser CTA).

## Phase 3: Lead generation & interactivity
Build `/get-matched/`, a 4-step form (topic, budget & timeline, priorities, contact plus optional partner opt-in and consent) with a progress bar, `?topic=` prefill and trust row. Add sidebar and hero quick-match forms, an exit-intent/45-second lead-magnet modal (once per 7 days) that redirects to `/checklist/`, newsletter forms with interest and consent, price-alert signup on `/deals/`, a `/compare/` 4-way tool fed by `products.json` (with `?items=` prefill), a `/finder/` quiz, client-side search from `search-index.json` (header and hero), sortable tables and helpful votes. Every form includes a honeypot, a consent checkbox, a success message, an optional redirect and a mailto fallback on network failure.

## Phase 4: Monetisation, community & support
- **AdSense:** consent-gated loader and 4 labelled slots. Until an ID is set, each slot shows "Ad space available → Advertise".
- **Affiliate:** Amazon search links with the tag injected from config; official-site links use `rel="sponsored nofollow"`; click tracking.
- **YouTube:** replace the per-guide video card with a nocookie embed when a video ID is mapped; channel CTAs.
- **`/advertise/`:** 6 packages, a domain/website acquisition callout, a proposal form and ad principles.
- **`/support/`:** amount chips, 5 payment buttons (fall back to the pledge form if no link is set), fund allocation (operations, marketing, hiring, contests & prizes), 4 tiers and a pledge form.
- **`/awards/`:** countdown, People's Choice vote per category, nominations, sponsor CTA.
- **`/contests/`:** monthly giveaway and creator contest, entry form with referral and bonus entries, age gate, official rules.
- **`/careers/`:** 6 roles and an application form.
- **`/submit/`:** suggestions, owner reviews and corrections.

## Phase 5: Trust, legal, launch & growth
Pages: `/how-we-test/`, `/about/`, `/contact/` (form plus hidden-email link), `/disclosure/` (affiliate, advertising, trademark, copyright, DMCA), `/privacy/` (GDPR/CCPA/Quebec Law 25, AdSense cookies, FormSubmit) and `/terms/`.

Launch: push to GitHub and enable Pages. Point superbest.com DNS at GitHub Pages (A records 185.199.108–111.153; `www` CNAME to `<user>.github.io`), add a `CNAME` file and enforce HTTPS. Submit the sitemap to Google Search Console, apply for AdSense and fill `ads.txt`, then activate FormSubmit with the first test submission.

Growth: add 2–4 guides a week (high-value first: software, hosting, VPN, finance-adjacent), one video per guide, and a monthly newsletter and giveaway. Later: user accounts, real vote tallies (serverless), a "Best of [City]" local directory, a price-history API and an AI "Ask SuperBest" assistant.
