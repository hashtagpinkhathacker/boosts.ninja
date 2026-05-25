# boosts.ninja Free-Stack Setup Guide

This guide walks you through launching `boosts.ninja` on a zero-monthly-cost stack:

- Domain registrar: Namecheap
- DNS (Domain Name System, the system that tells the internet where your domain should send traffic): Cloudflare
- Hosting: Cloudflare Pages
- SSL/TLS (the encryption layer that makes `https://` secure): Cloudflare
- CDN (Content Delivery Network, a global network of servers that makes your site load faster): Cloudflare
- Email forwarding: Cloudflare Email Routing
- Analytics: Cloudflare Web Analytics
- SEO verification: Google Search Console

The recommended stack is free beyond your domain renewal. No credit card is required for the free services in this guide.

## 00 - Cost Overview

| Service | Provider | Cost |
|---|---|---:|
| Domain renewal | Namecheap | ~$30-35/year |
| DNS management | Cloudflare Free plan | $0 |
| Hosting | Cloudflare Pages Free plan | $0 |
| SSL/HTTPS | Cloudflare | $0 |
| CDN | Cloudflare | $0 |
| Email forwarding | Cloudflare Email Routing | $0 |
| Analytics | Cloudflare Web Analytics | $0 |
| SEO tools | Google Search Console | $0 |

- [ ] Confirm your cost expectation: the only recurring cost in this setup is the yearly `boosts.ninja` renewal at Namecheap, which is usually about `$30-35/year`. Everything else in this guide is free, and the free services do not require a credit card.
- [ ] Know the practical Cloudflare Pages Free plan limits before you start: `500 builds/month`, `100 custom domains per Pages project`, and free unlimited static asset requests. This matters because it tells you the free tier is enough for a normal landing page or static site launch.

## 01 - DNS Setup

Log in to: `Cloudflare` first, then `Namecheap`.

⚠️ Do not change nameservers at Namecheap until Cloudflare has finished adding the site and shown you the two exact nameservers assigned to your account.

### Current live status for `boosts.ninja`

- [x] The domain is already delegated to Cloudflare nameservers as of `May 24, 2026`.
- [x] Current `NS` records resolve to:
  - `celeste.ns.cloudflare.com`
  - `patrick.ns.cloudflare.com`
- [x] This means the Namecheap nameserver cutover portion of Phase 1 has already been completed successfully.
- [x] The Cloudflare zone exists and opens successfully at `Cloudflare Dashboard → boosts.ninja → DNS → Records`.
- [x] The current active DNS records visible in Cloudflare are:
  - `A` → `boosts.ninja` → `76.76.21.21` → `DNS only`
  - `CNAME` → `www` → `cname.vercel-dns-0.com` → `DNS only`
  - `TXT` → `_vercel` → `vc-domain-verify=boosts.ninja,...` → `DNS only`
  - `NS` → `celeste.ns.cloudflare.com`
  - `NS` → `patrick.ns.cloudflare.com`
- [x] This confirms Cloudflare is the active DNS source of truth and the zone records are present.
- [x] It also confirms the site is currently wired for `Vercel`, not yet `Cloudflare Pages`, which is fine for Phase 1 and will be changed later only if you decide to move hosting in Phase 2.

- [ ] Create a free Cloudflare account at [dash.cloudflare.com](https://dash.cloudflare.com/). This creates the control panel where Cloudflare will manage your DNS, SSL, CDN, analytics, and email routing.
- [ ] In Cloudflare, go to `Dashboard → Add a domain` and enter `boosts.ninja`. You should see a field asking for your domain name and a button to continue. This starts Cloudflare's setup wizard for your domain.
- [ ] Select the `Free` plan when Cloudflare asks you to choose a plan. The Free plan is enough for DNS, SSL, CDN, Pages hosting, Email Routing, and Web Analytics.
- [ ] Let Cloudflare scan and import any existing DNS records. A DNS record is a rule like `A`, `CNAME`, `MX`, or `TXT` that tells the internet where web and email traffic should go. Importing matters because it reduces the chance of accidentally losing an existing website or email route during the move.
- [ ] Review the imported DNS records before continuing. At minimum, make sure any records you still need are present. If you see old records you do not recognize, do not delete them yet; moving too fast here can break email or a previous site.
- [ ] Record the two Cloudflare nameservers shown on the final setup screen. A nameserver, shown as an `NS` record, is the server that becomes the source of truth for your domain's DNS. They will look like `alice.ns.cloudflare.com` and `bob.ns.cloudflare.com`, but your actual names will be different.

### Switch the domain to Cloudflare

Log in to: `Namecheap`.

- [ ] In Namecheap, go to `Dashboard → Domain List → Manage boosts.ninja → Domain tab → Nameservers`. You should see a dropdown or selector for the current nameserver mode. This is where you tell the whole internet to trust Cloudflare instead of Namecheap for DNS.
- [ ] Change the nameserver mode to `Custom DNS`. This tells Namecheap you want to use external nameservers instead of Namecheap's default DNS system.
- [ ] Enter the two Cloudflare nameservers exactly as Cloudflare showed them, one per field, then click `Save` or the green checkmark. This is the handoff that makes Cloudflare authoritative for your domain.

⚠️ Once this change is saved and propagation completes, Namecheap's DNS records panel is ignored. From that point on, you must manage all DNS records in `Cloudflare`, not Namecheap.

### Verify nameserver propagation

- [ ] Wait for DNS propagation. Propagation means internet providers around the world are updating their cached record of which nameservers control `boosts.ninja`. This usually takes `5 minutes to 24 hours`.
- [ ] Check [dnschecker.org](https://dnschecker.org/) and search for `boosts.ninja` with record type `NS`. You want to see the two Cloudflare nameservers appearing across many regions. This matters because it confirms the world is starting to trust Cloudflare for your domain.
- [ ] Verify from PowerShell with:

```powershell
nslookup -type=NS boosts.ninja
```

Expected output:

```text
Server:  your-dns-resolver
Address:  <resolver-ip>

Non-authoritative answer:
boosts.ninja    nameserver = celeste.ns.cloudflare.com
boosts.ninja    nameserver = patrick.ns.cloudflare.com
```

If the output looks wrong:

- If you still see Namecheap nameservers, wait longer and run the command again in `15-30 minutes`.
- If you see `NXDOMAIN`, double-check the domain spelling and confirm the nameserver change was saved in Namecheap.
- If you see only one nameserver, go back to `Namecheap → Domain List → Manage boosts.ninja → Nameservers` and confirm both Cloudflare nameservers were entered exactly.

Common failure mode:

- Cloudflare says `Pending Nameserver Update` for hours. Fix: confirm you changed nameservers in `Namecheap`, not just DNS records, then wait. DNS record edits are not the same thing as nameserver changes.
- If `nslookup -type=NS boosts.ninja` already returns `celeste.ns.cloudflare.com` and `patrick.ns.cloudflare.com`, the cutover is complete and you should not change nameservers again. Move to checking DNS records inside Cloudflare instead.

### Phase 1 completion status

- [x] Cloudflare account exists and the `boosts.ninja` zone is active.
- [x] Namecheap nameserver cutover is complete.
- [x] Global `NS` lookup resolves to Cloudflare.
- [x] Cloudflare DNS records are present and readable in the dashboard.
- [x] Phase 1 is complete.

## 02 - Hosting

Primary recommendation: `Cloudflare Pages`.

Why this is the best fit here:

- It is free for static sites.
- It gives you automatic SSL.
- It connects directly to GitHub for easy future updates.
- It uses Cloudflare's global edge network automatically.
- It matches the existing static landing page already found in `C:\Users\D\medium-sql-data_scraper\boost_predictor\landing`.

Cloudflare Pages Free plan details verified at the time of writing:

- `500 builds/month`
- `100 custom domains per Pages project`
- `Unlimited static asset requests`

### Option A — Cloudflare Pages (Recommended)

Log in to: `Cloudflare`, and if you choose Git deployment, also `GitHub`.

- [ ] Open `Cloudflare Dashboard → Workers & Pages → Create application → Pages`. You should see choices to connect a Git provider or deploy directly. This is where Cloudflare creates the site that will serve your files.
- [ ] Choose one deployment method:
  - `Connect to Git` if you want automatic deploys every time you push to GitHub.
  - `Direct Upload` if you want to drag-and-drop a static site once without Git integration.
  Git-based deploys are better long term because they make updates repeatable and safer.
- [ ] If using Git, connect your GitHub account and select the repo that will hold your `boosts.ninja` site. You should see a repo picker after authorization. This matters because Cloudflare will watch that repo and redeploy automatically after future pushes.
- [ ] Configure the build settings for the existing static landing site:
  - Framework preset: `None` or `Static site`
  - Build command: leave blank
  - Build output directory: `landing`
  - Root directory: leave blank unless Cloudflare asks for it explicitly
  These settings matter because your actual deployable files live inside the `landing` folder.
- [ ] Deploy the project and wait for Cloudflare to assign a temporary `*.pages.dev` address. This temporary URL is your safe test URL before you attach the real domain.
- [ ] Visit the `*.pages.dev` URL and confirm the page loads before you connect `boosts.ninja`. This matters because it separates code problems from DNS problems.
- [ ] Before the production launch, edit `landing/config.js` so it contains your real form endpoint and product links. The file currently expects values like `FORM_ENDPOINT`, `GUMROAD_PLAYBOOK`, `GUMROAD_PRO`, and `AUDIT_EMAIL`. If you skip this, the page may still load, but signup and purchase buttons will not be wired correctly.
- [ ] Copy your PDF into `landing/assets/report.pdf`. The landing page expects that exact path for the downloadable report, so the file must exist there before launch.
- [ ] Connect the custom domain in `Cloudflare Dashboard → Workers & Pages → <your Pages project> → Custom domains → Set up a domain`. Enter `boosts.ninja` first, and optionally `www.boosts.ninja` after that. This step tells Pages which real domain should point at your site.
- [ ] Click `Activate domain` if Cloudflare shows that button. Cloudflare will automatically create the DNS records when the domain is already managed in the same Cloudflare account.

Expected result:

- Your site loads at both the `*.pages.dev` URL and then at `https://boosts.ninja`.

Common failure modes:

- The `*.pages.dev` site works, but `boosts.ninja` does not. Fix: check `Cloudflare -> DNS -> Records` and make sure the Pages domain records were created automatically.
- Cloudflare says the custom domain is not active. Fix: confirm the nameservers are already pointing to Cloudflare and that the domain was added to the same Cloudflare account as the Pages project.
- Your PDF link downloads a `404` page. Fix: confirm the file exists at `landing/assets/report.pdf`, not beside the landing folder or under a different filename.

### Option B — Vercel (Alternative)

Log in to: `Vercel`, `Cloudflare`, and `GitHub`.

- [ ] In Vercel, go to `Dashboard → Add New... → Project`, import your GitHub repo, and deploy. This creates a hosted version of your site on Vercel first.
- [ ] In Vercel, go to `Dashboard → <your project> → Settings → Domains → Add` and enter `boosts.ninja`, then add `www.boosts.ninja` if you want it.
- [ ] Add the DNS records Vercel requests inside `Cloudflare Dashboard → boosts.ninja → DNS → Records → Add record`:
  - `A` record, Name: `@`, Value: `76.76.21.21`
  - `CNAME` record, Name: `www`, Target: `cname.vercel-dns.com`
  An `A` record maps a domain to an IPv4 address. A `CNAME` record maps one hostname to another hostname.

⚠️ Critical order rule for Vercel:

- [ ] Set both records to `DNS only` in Cloudflare, shown as a grey cloud. Do not leave them proxied with the orange cloud. This matters because if Cloudflare and Vercel both try to terminate SSL at the same time, you can get certificate or handshake errors.

Common failure mode:

- Vercel says the domain is invalid or pending forever. Fix: switch the Cloudflare proxy from orange cloud to grey cloud, then wait a few minutes and recheck in Vercel.

### Option C — Netlify (Alternative)

Log in to: `Netlify`, `Cloudflare`, and `GitHub`.

- [ ] In Netlify, go to `Dashboard → Add new site → Import an existing project` and connect your GitHub repo. This creates the site in Netlify.
- [ ] Set the publish directory to `landing` and leave the build command blank for the current static landing page. This matches the folder structure you already have.
- [ ] In Netlify, add `boosts.ninja` under `Site configuration → Domain management → Add a domain`.
- [ ] Add any DNS records Netlify asks for inside `Cloudflare → DNS → Records`.

Common failure mode:

- Netlify deploy succeeds, but the site is missing styles or the PDF file. Fix: confirm the published folder is `landing` and that `landing/assets/report.pdf` exists before the deploy runs.

## 03 - SSL / HTTPS

Log in to: `Cloudflare`.

If you use Cloudflare Pages, SSL is provisioned automatically for the Pages domain and your custom domain. You still want to confirm the zone-level SSL settings below so all traffic is handled correctly.

- [ ] Open `Cloudflare Dashboard → boosts.ninja → SSL/TLS → Overview` and set the encryption mode to `Full (strict)`. This means Cloudflare will only use HTTPS to reach the origin and will validate the certificate. It is the safest normal setting when your host supports HTTPS correctly.
- [ ] Open `Cloudflare Dashboard → boosts.ninja → SSL/TLS → Edge Certificates` and enable `Always Use HTTPS`. This forces any old `http://` visit to redirect to `https://`, which protects users and avoids duplicate SEO URLs.
- [ ] In the same `Edge Certificates` area, enable `Automatic HTTPS Rewrites`. This helps fix mixed-content problems by rewriting old `http://` asset links to `https://` when secure versions exist.
- [ ] In `Cloudflare Dashboard → boosts.ninja → SSL/TLS → Edge Certificates`, enable `HTTP Strict Transport Security (HSTS)` only after the site is working correctly on HTTPS everywhere. HSTS tells browsers to always use HTTPS for your domain, even if a user types `http://` manually.

⚠️ HSTS warning:

- HSTS is powerful, but it is hard to undo quickly because browsers cache it. If you enable it too early and your HTTPS setup is broken, users can get locked out until the cache expires.

### Set the www redirect

- [ ] Go to `Cloudflare Dashboard → boosts.ninja → Rules → Redirect Rules → Create rule`.
- [ ] Name the rule something clear like `www to apex`.
- [ ] Set the condition to `If incoming requests match... -> Hostname -> equals -> www.boosts.ninja`.
- [ ] Set the action to `Dynamic Redirect`.
- [ ] Set the destination URL to:

```text
https://boosts.ninja${uri.path}
```

- [ ] Set the status code to `301 - Permanent Redirect`. A `301` tells browsers and search engines the move is permanent, so they update bookmarks and indexing. A `302` is temporary and should only be used when you expect the destination to change later.

Common failure modes:

- You get `ERR_TOO_MANY_REDIRECTS`. Fix: set Cloudflare SSL/TLS mode to `Full (strict)` and remove any duplicate redirect rules at the host level if the host is also forcing HTTPS in a conflicting way.
- The padlock icon does not appear. Fix: open the browser developer console and look for mixed-content warnings, then enable `Automatic HTTPS Rewrites` or update the hard-coded asset URLs to `https://`.

## 04 - Deploy Your Code

Primary recommendation: deploy the existing static landing page from:

`C:\Users\D\medium-sql-data_scraper\boost_predictor\landing`

The printable source report that already exists today is:

`C:\Users\D\medium-sql-data_scraper\boost_predictor\report_boosted_articles.html`

The site repo you are preparing in this workspace is currently:

`C:\Users\D\OneDrive\Documents\boosts.ninja`

That repo is a fresh Git repository with no commits yet, so the clean path is to copy the landing site into this repo, commit it, push it to GitHub, and connect that repo to Cloudflare Pages.

### Option 1 — Existing static landing (Recommended)

Log in to: `GitHub` for the remote repo, and use `PowerShell` locally.

- [ ] Create a GitHub repository first at `GitHub → Top-right + icon → New repository`. Suggested repo name: `boosts.ninja`. You should see the new repo page with a remote URL like `https://github.com/YOUR-USERNAME/boosts.ninja.git`. This matters because your local repo needs a destination before Cloudflare can connect to GitHub cleanly.
- [ ] In PowerShell, move into your site repo:

```powershell
cd C:\Users\D\OneDrive\Documents\boosts.ninja
```

Expected output:

```text
```

PowerShell usually prints no success output for `cd`. If it looks wrong, run:

```powershell
Get-Location
```

Expected output:

```text
Path
----
C:\Users\D\OneDrive\Documents\boosts.ninja
```

- [ ] Create the `landing` folder in the repo if it does not exist:

```powershell
New-Item -ItemType Directory -Path .\landing -Force
```

Expected output:

```text

    Directory: C:\Users\D\OneDrive\Documents\boosts.ninja

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----         <date>                            landing
```

If it looks wrong:

- If you get an access error, confirm you are working inside `C:\Users\D\OneDrive\Documents\boosts.ninja`.
- If the command says the folder already exists, that is fine because `-Force` allows reuse.

- [ ] Copy the existing landing page files into the repo:

```powershell
Copy-Item -Path "C:\Users\D\medium-sql-data_scraper\boost_predictor\landing\*" -Destination ".\landing\" -Recurse -Force
```

Expected output:

```text
```

PowerShell prints no success output here. Verify with:

```powershell
Get-ChildItem .\landing
```

Expected output:

```text

    Directory: C:\Users\D\OneDrive\Documents\boosts.ninja\landing

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----         <date>                            assets
-a----         <date>                         ... app.js
-a----         <date>                         ... config.js
-a----         <date>                         ... index.html
-a----         <date>                         ... README.md
-a----         <date>                         ... styles.css
-a----         <date>                         ... thank-you.html
```

- [ ] Copy the report PDF into the exact path the landing page expects:

```powershell
Copy-Item -Path "C:\Users\D\medium-sql-data_scraper\boost_predictor\Boosted_Articles_Monetary_Report.pdf" -Destination ".\landing\assets\report.pdf" -Force
```

Expected output:

```text
```

Verify with:

```powershell
Get-ChildItem .\landing\assets
```

Expected output:

```text

    Directory: C:\Users\D\OneDrive\Documents\boosts.ninja\landing\assets

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----         <date>                         ... report.pdf
```

- [ ] Edit `landing\config.js` before the first real launch. Replace the placeholder form endpoint, Gumroad links, and audit email with your real values. This matters because the page can look finished while its forms and purchase buttons are still pointing at placeholders.
- [ ] Preview the landing page locally from the repo root:

```powershell
python -m http.server 8080
```

Expected output:

```text
Serving HTTP on :: port 8080 (http://[::]:8080/) ...
```

Then open:

- `http://127.0.0.1:8080/landing/`

If it looks wrong:

- If `python` is not recognized, install Python from [python.org](https://www.python.org/) and make sure `Add python.exe to PATH` is checked during install.
- If the page loads without styles, confirm you opened `/landing/` and not just `/`.
- If the PDF link fails, confirm `landing/assets/report.pdf` exists.

### Option 2 — New plain HTML/CSS/JS site

Log in to: `GitHub` later, use `PowerShell` locally now.

- [ ] Create a new plain static site:

```powershell
mkdir boosts-ninja
cd .\boosts-ninja
New-Item -ItemType File -Path .\index.html
```

Expected output:

```text

    Directory: C:\path\to\parent

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----         <date>                            boosts-ninja

    Directory: C:\path\to\parent\boosts-ninja

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----         <date>                              0 index.html
```

If it looks wrong:

- If `mkdir` says the folder exists, either reuse it or pick a new folder name.
- If `index.html` is created somewhere unexpected, run `Get-Location` and confirm your current folder.

### Option 3 — New Astro site

Log in to: none yet, use `PowerShell`.

- [ ] Create a new Astro project:

```powershell
npm create astro@latest boosts-ninja
```

Expected output:

```text
> npx
> create-astro boosts-ninja
```

Then the interactive installer will ask a few questions about template and package manager.

If it looks wrong:

- If `npm` is not recognized, install Node.js LTS from [nodejs.org](https://nodejs.org/).
- If PowerShell blocks script execution, reopen PowerShell and try again from a normal user shell, not a locked-down enterprise shell.

For Cloudflare Pages later:

- Build command: `npm run build`
- Output directory: `dist`

### Option 4 — New Next.js site

Log in to: none yet, use `PowerShell`.

- [ ] Create a new Next.js project:

```powershell
npx create-next-app@latest boosts-ninja
```

Expected output:

```text
Need to install the following packages:
create-next-app@latest
Ok to proceed? (y)
```

Then the interactive installer will ask about TypeScript, ESLint, and other defaults.

If it looks wrong:

- If `npx` is not recognized, install Node.js LTS from [nodejs.org](https://nodejs.org/).
- If you plan to export a fully static Next.js site for Cloudflare Pages, make sure your app is configured for static export. Otherwise you may need Cloudflare Workers support instead of simple static hosting.

For Cloudflare Pages later:

- Build command: `npm run build`
- Output directory: `out`

### Push the site to GitHub

Log in to: `GitHub`, use `PowerShell` locally.

Use these commands from `C:\Users\D\OneDrive\Documents\boosts.ninja` after the files are in place.

- [ ] Check the current Git status:

```powershell
git status --short --branch
```

Expected output for this repo before the first commit:

```text
## No commits yet on master
?? landing/
```

- [ ] Add all files:

```powershell
git add .
```

Expected output:

```text
```

- [ ] Create the first commit:

```powershell
git commit -m "feat: initial site"
```

Expected output:

```text
[master (root-commit) <short-hash>] feat: initial site
 <n> files changed, <n> insertions(+)
 create mode 100644 README.md
```

If it looks wrong:

- If Git says `Please tell me who you are`, set your identity first:

```powershell
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

- [ ] Rename the branch to `main`:

```powershell
git branch -M main
```

Expected output:

```text
```

- [ ] Add the GitHub remote, replacing `YOUR-USERNAME` with your real GitHub username:

```powershell
git remote add origin https://github.com/YOUR-USERNAME/boosts.ninja.git
```

Expected output:

```text
```

If it looks wrong:

- If Git says `remote origin already exists`, inspect it with:

```powershell
git remote -v
```

Then fix it with:

```powershell
git remote set-url origin https://github.com/YOUR-USERNAME/boosts.ninja.git
```

- [ ] Push the branch to GitHub:

```powershell
git push -u origin main
```

Expected output:

```text
Enumerating objects: ...
Counting objects: ...
Writing objects: ...
To https://github.com/YOUR-USERNAME/boosts.ninja.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```

If it looks wrong:

- If Git prompts for authentication and fails, create or reuse a GitHub Personal Access Token and use it as the password when Git asks. GitHub no longer accepts normal account passwords for Git over HTTPS.
- If the repo is private and Cloudflare cannot see it later, make sure Cloudflare's GitHub app was allowed to access that repo during setup.
- If you get `repository not found`, confirm the repo exists under the exact GitHub account and that the URL matches letter-for-letter.

### Connect GitHub to Cloudflare Pages

Log in to: `Cloudflare`.

- [ ] Return to `Cloudflare Dashboard → Workers & Pages → Create application → Pages → Connect to Git`.
- [ ] Select the GitHub repo you just pushed.
- [ ] Set build command to blank and output directory to `landing`.
- [ ] Deploy and verify the `*.pages.dev` URL first.
- [ ] Only after that succeeds, attach `boosts.ninja` as the custom domain.

Common failure mode:

- Cloudflare builds the repo but publishes a blank site. Fix: check that the build output directory is exactly `landing`, not blank and not `landing/` plus an extra nested path.

## 05 - Email Forwarding

- [ ] Reserved for the next phase. This will cover Cloudflare Email Routing, `MX` records (mail exchange records that tell email where to go), `SPF` records (sender policy rules that say which servers may send mail for your domain), and `DKIM` records (cryptographic signatures that help receiving inboxes trust your email).

## 06 - Analytics

- [ ] Reserved for the next phase. This will cover Cloudflare Web Analytics and what to verify after the tracking snippet is live.

## 07 - SEO

- [ ] Reserved for the next phase. This will cover Google Search Console verification, sitemap submission, and indexing checks.

## 08 - Maintenance

- [ ] Reserved for the next phase. This will cover ongoing updates, backups, and safe release habits.

## Sources checked for current Cloudflare details

- [Cloudflare Pages limits](https://developers.cloudflare.com/pages/platform/limits/)
- [Cloudflare Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Cloudflare Pages pricing for static assets](https://developers.cloudflare.com/pages/functions/pricing/)
- [Cloudflare SSL/TLS encryption modes](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/)
- [Cloudflare Automatic HTTPS Rewrites](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/automatic-https-rewrites/)
- [Cloudflare SSL/TLS additional options](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/)
- [Cloudflare Email Routing overview](https://developers.cloudflare.com/email-routing/)
