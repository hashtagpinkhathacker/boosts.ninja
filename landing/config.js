/**
 * Landing page configuration.
 *
 * Safe public defaults:
 * - Leave FORM_ENDPOINT empty to open the PDF directly without email capture.
 * - Leave paid product URLs empty until those offers are live.
 * - Leave AUDIT_EMAIL empty until you are ready to accept audit requests.
 */
window.BOOST_INDEX_CONFIG = {
  FORM_ENDPOINT: '',

  GUMROAD_PLAYBOOK: '',
  GUMROAD_PRO: '',
  GUMROAD_PRO_FOUNDING: '',

  AUDIT_EMAIL: '',

  // Static-host friendly path for Cloudflare Pages / Netlify / GitHub Pages.
  PDF_PATH: 'assets/report.pdf',

  SHOW_CONFIG_BANNER: false,
};
