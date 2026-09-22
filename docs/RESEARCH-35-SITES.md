# Competitive research: 35 world-class best-of / review / community sites

Fetched September 2026 (homepage plus selected inner pages). 31 sites came from the target list, and 4 are substitutes for sites that blocked automated fetching.

## Visited
RTINGS · Consumer Reports · Tom's Guide · TechRadar · Which? · Reviewed · Forbes Vetted · Engadget · Tom's Hardware · G2 · Capterra · Trustpilot · Tripadvisor · Product Hunt · OutdoorGearLab · BestReviews · NerdWallet · Bankrate · Popular Science · Gear Patrol · U.S. News · Ranker · Slant · Versus · SmartCustomer (ex-Sitejabber) · Patreon · Ko-fi · Buy Me a Coffee · GoFundMe · Gleam · Upwork · Nomads.com · CHOICE (AU) · Webby Awards · Goodreads Choice Awards

Blocked for automated fetching (not counted): Wirecutter, CNET, PCMag, Good Housekeeping, The Strategist, BestProducts, Serious Eats, The Verge, ZDNet, BHG, Travel + Leisure, Yelp, Digital Trends.

## Key patterns observed → implemented on SuperBest
| Pattern (source examples) | SuperBest implementation |
|---|---|
| Verdict-first best-of template, quick picks, comparison table, FAQ (RTINGS, GearLab, Wirecutter-style) | `/best/<slug>/` template |
| Published methodology and scoring weights (RTINGS, GearLab, Tom's Hardware) | `/how-we-test/` + weights on every guide |
| Award badges (Which? Best Buy, GearLab Editors' Choice, Tripadvisor Travelers' Choice) | Badge per pick (SuperBest Pick, Best Value…) |
| Affiliate disclosure near the top (Reviewed, Engadget) | Disclosure strip on every guide + `/disclosure/` |
| Head-to-head "face-offs" (Tom's Guide, Versus) | Auto-generated `/vs/` pages |
| Compare checkboxes / tools (G2, Capterra, CHOICE) | `/compare/` 4-way tool |
| Quiz / finder (Bankrate CardMatch, NerdWallet, CHOICE) | `/finder/` quiz |
| "Get matched" advisor lead gen (G2, Capterra) | `/get-matched/` 4-step form + sidebar forms on every guide |
| Topic newsletters with consent (Tom's Guide, Which?) | Newsletter with interest picker, consent checkbox |
| Lead magnet (Capterra ebook) | Exit-intent modal → Buyer's Checklist |
| Community voting, live counts (Ranker, Product Hunt, Goodreads Choice) | `/awards/` People's Choice vote + nominations + countdown |
| Giveaways with bonus entries, referrals, rules (Gleam) | `/contests/` with official rules, referral field |
| Tiers + preset amounts + goal allocation (Patreon, BMC, Ko-fi, GoFundMe) | `/support/` tiers, amount chips, allocation bars, pledge form |
| Hire / talent entry (Upwork) | `/careers/` roles + application |
| Media kit / advertise / claim listing (G2, Trustpilot) | `/advertise/` packages + proposal form |
| Sticky TOC, mobile buy bar, dark mode (Tom's Hardware, GearLab) | Sticky sidebar TOC, mobile CTA bar, theme toggle |
| Schema, breadcrumbs, dates (all top SEO players) | JSON-LD ItemList, FAQPage, Breadcrumb, Article; "Updated" dates |

## Top 40 must-have features (full list)
See the build prompt, Phase 1–5, in `PHASE-PROMPTS.md`. Every item there was drawn from the observations above.
