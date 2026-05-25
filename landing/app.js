(function () {
  const cfg = window.BOOST_INDEX_CONFIG || {};

  function $(id) {
    return document.getElementById(id);
  }

  function applyLinks() {
    const playbook = cfg.GUMROAD_PLAYBOOK || '#';
    const pro = cfg.GUMROAD_PRO || cfg.GUMROAD_PRO_FOUNDING || '#';
    const audit = cfg.AUDIT_EMAIL
      ? 'mailto:' + cfg.AUDIT_EMAIL + '?subject=Boost%20Audit%20Request'
      : 'mailto:hello@example.com?subject=Boost%20Audit%20Request';

    ['linkPlaybook', 'linkPlaybookFooter'].forEach(function (id) {
      const el = $(id);
      if (el) el.href = playbook;
    });
    ['linkPro', 'linkProFooter'].forEach(function (id) {
      const el = $(id);
      if (el) el.href = pro;
    });
    const auditEl = $('linkAudit');
    if (auditEl) auditEl.href = audit;

    const pdf = $('directPdf');
    if (pdf && cfg.PDF_PATH) pdf.href = cfg.PDF_PATH;
  }

  function showConfigBanner() {
    if (!cfg.SHOW_CONFIG_BANNER || cfg.FORM_ENDPOINT) return;
    const banner = $('configBanner');
    if (banner) banner.hidden = false;
  }

  function openPdf() {
    const path = cfg.PDF_PATH || '../Boosted_Articles_Monetary_Report.pdf';
    window.open(path, '_blank', 'noopener');
  }

  function handleLeadSubmit(e) {
    e.preventDefault();
    const email = $('email').value.trim();
    const success = $('formSuccess');
    const endpoint = (cfg.FORM_ENDPOINT || '').trim();

    if (!endpoint) {
      if (success) {
        success.textContent = 'Opening your PDF… (configure FORM_ENDPOINT in config.js to capture emails).';
        success.classList.add('visible');
      }
      openPdf();
      return;
    }

    const form = $('leadForm');
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending…';
    }

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: email,
        source: 'boost-index-landing',
        product: 'free-benchmark-pdf',
      }),
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Form submit failed');
        if (success) {
          success.textContent = 'Check your inbox — and your PDF is opening now.';
          success.classList.add('visible');
        }
        openPdf();
        form.reset();
      })
      .catch(function () {
        if (success) {
          success.textContent = 'Something went wrong. Use direct PDF download below.';
          success.classList.add('visible');
        }
      })
      .finally(function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Send my PDF';
        }
      });
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyLinks();
    showConfigBanner();
    const form = $('leadForm');
    if (form) form.addEventListener('submit', handleLeadSubmit);
  });
})();
