/**
 * Landing page configuration — edit before deploy.
 *
 * FORM_ENDPOINT:
 *   Formspree: https://formspree.io/f/YOUR_FORM_ID
 *   Getform:   https://getform.io/f/YOUR_ID
 *   Beehiiv:   use their embed instead of this form
 *
 * Leave empty to use local-only mode (PDF opens directly, no email POST).
 */
window.BOOST_INDEX_CONFIG = {
  FORM_ENDPOINT: '',

  GUMROAD_PLAYBOOK: 'https://gumroad.com/l/YOUR-PLAYBOOK',
  GUMROAD_PRO: 'https://gumroad.com/l/YOUR-PRO',
  GUMROAD_PRO_FOUNDING: 'https://gumroad.com/l/YOUR-PRO-FOUNDING',

  AUDIT_EMAIL: 'hello@yourdomain.com',

  // Netlify/GitHub Pages: copy PDF to landing/assets/report.pdf
  PDF_PATH: 'assets/report.pdf',

  SHOW_CONFIG_BANNER: true,
};
