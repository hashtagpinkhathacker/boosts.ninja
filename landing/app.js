(function () {
  const cfg = window.BOOST_INDEX_CONFIG || {};

  function $(id) {
    return document.getElementById(id);
  }

  function normalizeUrl(value) {
    return (value || '').trim();
  }

  function disableLink(el, fallbackText) {
    if (!el) return;
    el.removeAttribute('href');
    el.removeAttribute('target');
    el.removeAttribute('rel');
    el.setAttribute('aria-disabled', 'true');
    el.setAttribute('tabindex', '-1');
    el.classList.add('is-disabled');
    if (fallbackText) el.textContent = fallbackText;
  }

  function enableLink(el, href) {
    if (!el || !href) return;
    el.href = href;
    el.removeAttribute('aria-disabled');
    el.removeAttribute('tabindex');
    el.classList.remove('is-disabled');
  }

  function applyLinkGroup(ids, href, fallbackText) {
    ids.forEach(function (id) {
      const el = $(id);
      if (!el) return;
      if (href) {
        enableLink(el, href);
      } else {
        disableLink(el, fallbackText);
      }
    });
  }

  function applyLinks() {
    const playbook = normalizeUrl(cfg.GUMROAD_PLAYBOOK);
    const pro = normalizeUrl(cfg.GUMROAD_PRO || cfg.GUMROAD_PRO_FOUNDING);
    const auditEmail = normalizeUrl(cfg.AUDIT_EMAIL);
    const audit = auditEmail
      ? 'mailto:' + auditEmail + '?subject=Boost%20Audit%20Request'
      : '';

    applyLinkGroup(['linkPlaybook'], playbook, 'Coming soon');
    applyLinkGroup(['linkPlaybookFooter'], playbook, null);
    applyLinkGroup(['linkPro'], pro, 'Coming soon');
    applyLinkGroup(['linkProFooter'], pro, null);
    applyLinkGroup(['linkAudit'], audit, 'Contact coming soon');

    const pdf = $('directPdf');
    if (pdf && cfg.PDF_PATH) pdf.href = cfg.PDF_PATH;
  }

  function showConfigBanner() {
    if (!cfg.SHOW_CONFIG_BANNER || cfg.FORM_ENDPOINT) return;
    const banner = $('configBanner');
    if (banner) banner.hidden = false;
  }

  function openPdf() {
    const path = cfg.PDF_PATH || 'assets/report.pdf';
    window.open(path, '_blank', 'noopener');
  }

  function handleLeadSubmit(e) {
    e.preventDefault();
    const email = $('email').value.trim();
    const success = $('formSuccess');
    const endpoint = normalizeUrl(cfg.FORM_ENDPOINT);

    if (!endpoint) {
      if (success) {
        success.textContent = 'Opening your PDF now.';
        success.classList.add('visible');
      }
      openPdf();
      return;
    }

    const form = $('leadForm');
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending...';
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
          success.textContent = 'Check your inbox and your PDF is opening now.';
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
