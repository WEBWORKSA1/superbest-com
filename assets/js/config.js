/* =========================================================
   SuperBest.com — SITE CONFIG (edit this file only)
   Every monetisation switch lives here. Empty string = off.
   ========================================================= */
window.SB_CONFIG = {
  siteName: 'SuperBest.com',
  siteUrl: 'https://superbest.com',

  // Top banner (required on every page)
  inquiryUrl: 'https://web.works/contact',

  // --- Google AdSense ---------------------------------------
  // After approval, paste your publisher ID (ca-pub-XXXXXXXXXXXXXXXX) and slot IDs.
  // Also update /ads.txt with the same pub ID.
  adsenseClient: '',
  adSlots: { top: '', inline: '', sidebar: '', footer: '' },

  // --- Affiliate --------------------------------------------
  amazonTag: '',            // e.g. 'superbest-20'
  amazonDomain: 'www.amazon.com',

  // --- YouTube ----------------------------------------------
  youtubeChannelUrl: '',    // e.g. 'https://www.youtube.com/@superbest'
  // Optional: map list slug -> YouTube video ID to embed a specific review video
  youtubeVideos: {},

  // --- Donations / Support ------------------------------------
  // Paste any payment link you own. Empty links fall back to the pledge form (sent by email).
  donate: {
    paypal: '',             // PayPal Donate / PayPal.me link
    stripe: '',             // Stripe Payment Link
    buymeacoffee: '',
    kofi: '',
    patreon: '',
  },

  // --- Analytics (optional) ---------------------------------
  gaMeasurementId: '',      // e.g. 'G-XXXXXXXXXX'

  // --- Forms ---------------------------------------------
  // Forms post via FormSubmit (free). The destination address is encoded inside app.js
  // and never printed on the site. Optional: after activating FormSubmit, replace with your
  // private FormSubmit alias string to hide the address even from the source code.
  formAlias: '',
};
