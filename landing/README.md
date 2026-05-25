# Boost Index — static landing page (free hosting)

Live stats on the page can be refreshed from `boosted_articles.db` — see [`../scripts/README.md`](../scripts/README.md) (includes a **Cursor SDK** one-command agent flow).

## Preview locally

```powershell
cd boost_predictor/landing
python -m http.server 8080
```

Open http://127.0.0.1:8080/

Serve from `boost_predictor/` (parent) so the PDF path resolves:

```powershell
cd boost_predictor
python -m http.server 8080
```

Open http://127.0.0.1:8080/landing/

## Configure before launch

Edit `config.js`:

| Key | Purpose |
|-----|---------|
| `FORM_ENDPOINT` | Formspree / Getform URL for email capture |
| `GUMROAD_PLAYBOOK` | $39 product link |
| `GUMROAD_PRO` | $149/yr product link |
| `AUDIT_EMAIL` | Mailto for $299 audits |
| `PDF_PATH` | Path to free PDF (default: `assets/report.pdf`) |

## Refresh stats from the database

```powershell
cd boost_predictor/scripts
npm install
npm run refresh-landing:local
```

With `CURSOR_API_KEY` set, `npm run refresh-landing` runs a local Cursor agent to export, sync, and verify deploy paths.

## Deploy (free options)

- **Netlify:** connect repo — `netlify.toml` publishes `landing/` (copy PDF to `landing/assets/report.pdf` first)
- **GitHub Pages:** set source to `/landing` on `main`
- **Cloudflare Pages:** build command empty, output `landing`

## Files

- `index.html` — main landing
- `thank-you.html` — post-signup (optional redirect target for Formspree)
- `styles.css` — layout
- `config.js` — URLs and form endpoint
- `app.js` — form handler + link wiring
