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
  - `CNAME` -> `boosts.ninja` -> `boosts-ninja.pages.dev` -> `Proxied`
  - `CNAME` -> `www` -> `boosts.ninja` -> `Proxied`

  - `NS` → `celeste.ns.cloudflare.com`
  - `NS` → `patrick.ns.cloudflare.com`
- [x] This confirms Cloudflare is the active DNS source of truth and the zone records are present.
- [x] It also confirms the site is now wired for `Cloudflare Pages`, not `Vercel`, which matches the recommended hosting path in Phase 2.

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

### Current live status for Option A

- [x] A Cloudflare Pages project named `boosts-ninja` already exists.
- [x] The Pages project is connected to the GitHub repo `hashtagpinkhathacker/boosts.ninja`.
- [x] The live Pages build settings used for the successful deploy were:
  - Framework preset: `None`
  - Build command: blank
  - Build output directory: `landing`
- [x] The Pages deployment completed successfully.
- [x] The preview site is live at [https://boosts-ninja.pages.dev](https://boosts-ninja.pages.dev).
- [x] The preview URL currently serves the correct landing page with the title `Boost Index — Medium Boost Intelligence`.
- [x] The landing site has already been copied into `C:\Users\D\OneDrive\Documents\boosts.ninja\landing`.
- [x] The report PDF has already been copied into `C:\Users\D\OneDrive\Documents\boosts.ninja\landing\assets\report.pdf`.
- [x] The repo has already been committed and pushed to GitHub on branch `main`.
- [x] The custom domain cutover is complete.
- [x] As of `May 25, 2026`, `https://boosts.ninja` serves the landing page correctly from Cloudflare Pages.
- [x] As of `May 25, 2026`, `https://www.boosts.ninja` resolves and redirects to `https://boosts.ninja/`.
- [x] Public checks now show both the preview deployment and the production hostname wiring are healthy.

Common operational note:

- [x] If the Cloudflare dashboard visually fails to load the Pages project screen in the in-app browser, do not assume the deployment failed. Verify `https://boosts-ninja.pages.dev` directly first. In this setup, that check correctly proved the deployment was healthy even before the custom-domain and redirect work was fully cleaned up.

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

After you click `Activate domain`, verify from PowerShell:

```powershell
nslookup boosts.ninja
nslookup www.boosts.ninja
```

What should change:

- [ ] `www.boosts.ninja` should stop resolving to `cname.vercel-dns-0.com`.
- [ ] The old Vercel wiring should no longer be the active public route for `boosts.ninja`.

If the output still points to Vercel after activation:

- [ ] Return to `Cloudflare Dashboard -> boosts.ninja -> DNS -> Records` and confirm the old Vercel `A`, `CNAME`, and `_vercel` verification records were removed or replaced by the Pages setup flow.

Expected result:

- Your site loads at both the `*.pages.dev` URL and then at `https://boosts.ninja`.

Common failure modes:

- The `*.pages.dev` site works, but `boosts.ninja` does not. Fix: check `Cloudflare -> DNS -> Records` and make sure the Pages domain records were created automatically.
- Cloudflare says the custom domain is not active. Fix: confirm the nameservers are already pointing to Cloudflare and that the domain was added to the same Cloudflare account as the Pages project.
- Your PDF link downloads a `404` page. Fix: confirm the file exists at `landing/assets/report.pdf`, not beside the landing folder or under a different filename.
- `boosts.ninja` still serves Vercel even though `boosts-ninja.pages.dev` works. Fix: the custom-domain step was not completed yet, or the old Vercel DNS records are still active in `Cloudflare Dashboard -> boosts.ninja -> DNS -> Records`.

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

### Current live status for Phase 3

- [x] `https://boosts-ninja.pages.dev` is healthy and serves the correct landing page over HTTPS.
- [x] `http://boosts.ninja` now redirects to `https://boosts.ninja/` with a `301` response from `cloudflare`.
- [x] `https://boosts.ninja` now serves the landing page correctly from Cloudflare Pages.
- [x] `https://www.boosts.ninja` now resolves and redirects to `https://boosts.ninja/`.
- [x] `HTTP Strict Transport Security (HSTS)` has been enabled after the HTTPS hostname and redirect path were working correctly.

- [x] Open `Cloudflare Dashboard -> boosts.ninja -> SSL/TLS -> Overview` and set the encryption mode to `Full (strict)`. This means Cloudflare will only use HTTPS to reach the origin and will validate the certificate. It is the safest normal setting when your host supports HTTPS correctly.
- [x] Open `Cloudflare Dashboard -> boosts.ninja -> SSL/TLS -> Edge Certificates` and enable `Always Use HTTPS`. This forces any old `http://` visit to redirect to `https://`, which protects users and avoids duplicate SEO URLs.
- [x] In the same `Edge Certificates` area, enable `Automatic HTTPS Rewrites`. This helps fix mixed-content problems by rewriting old `http://` asset links to `https://` when secure versions exist.
- [x] In `Cloudflare Dashboard -> boosts.ninja -> SSL/TLS -> Edge Certificates`, enable `HTTP Strict Transport Security (HSTS)` only after the site is working correctly on HTTPS everywhere. HSTS tells browsers to always use HTTPS for your domain, even if a user types `http://` manually.

⚠️ HSTS warning:

- HSTS is powerful, but it is hard to undo quickly because browsers cache it. If you enable it too early and your HTTPS setup is broken, users can get locked out until the cache expires.

### Set the www redirect

- [x] Go to `Cloudflare Dashboard -> boosts.ninja -> Rules -> Redirect Rules -> Create rule`.
- [x] Name the rule something clear like `www to apex`.
- [x] Set the condition to `If incoming requests match... -> Hostname -> equals -> www.boosts.ninja`.
- [x] Set the action to `Dynamic Redirect`.
- [x] Set the destination URL to:

```text
https://boosts.ninja${uri.path}
```

- [x] Set the status code to `301 - Permanent Redirect`. A `301` tells browsers and search engines the move is permanent, so they update bookmarks and indexing. A `302` is temporary and should only be used when you expect the destination to change later.
- [x] The live Cloudflare rule is deployed as `Redirect from WWW to root [Template]`, which is functionally equivalent for this setup and now sends `https://www.boosts.ninja` to `https://boosts.ninja/`.

Common failure modes:

- You get `ERR_TOO_MANY_REDIRECTS`. Fix: set Cloudflare SSL/TLS mode to `Full (strict)` and remove any duplicate redirect rules at the host level if the host is also forcing HTTPS in a conflicting way.
- The padlock icon does not appear. Fix: open the browser developer console and look for mixed-content warnings, then enable `Automatic HTTPS Rewrites` or update the hard-coded asset URLs to `https://`.

## 04 - Deploy Your Code

Primary recommendation: deploy the existing static landing page from:

`C:\Users\D\medium-sql-data_scraper\boost_predictor\landing`

The printable source report that already exists today is:

`C:\Users\D\medium-sql-data_scraper\boost_predictor\report_boosted_articles.html`

The downloadable PDF currently used by the landing page is the updated watermarked version at:

`C:\Users\D\medium-sql-data_scraper\boost_predictor\boosts.ninja\landing\assets\report.pdf`

The site repo you are preparing in this workspace is currently:

`C:\Users\D\OneDrive\Documents\boosts.ninja`

That repo is already live on GitHub and connected to Cloudflare Pages, so Phase 4 is mostly about verifying the deployed code, confirming the static assets are present, and tightening the launch configuration.

### Current live status for Phase 4

- [x] The repo already contains the deployed `landing` site.
- [x] `landing/assets/report.pdf` already exists in the path the site expects and currently matches the updated watermarked PDF.
- [x] The GitHub remote is already connected at `https://github.com/hashtagpinkhathacker/boosts.ninja.git`.
- [x] Branch `main` already contains the initial landing-site commit `beb0b26` with the message `feat: add landing site`.
- [x] Cloudflare Pages is already serving the repo at `https://boosts-ninja.pages.dev` and the production host at `https://boosts.ninja`.
- [x] `landing/config.js` now defaults to a safe direct-download mode when no form endpoint or paid-product URLs are configured.
- [ ] Add real `FORM_ENDPOINT`, Gumroad URLs, and `AUDIT_EMAIL` later when you are ready to turn on lead capture and paid offers.

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

- [ ] Copy the report PDF into the exact path the landing page expects. Use the current watermarked PDF as the source file:

```powershell
Copy-Item -Path "C:\Users\D\medium-sql-data_scraper\boost_predictor\boosts.ninja\landing\assets\report.pdf" -Destination ".\landing\assets\report.pdf" -Force
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

What happened: this copies the current watermarked PDF into the exact published path the landing page links to.

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

## 05 — Email Forwarding — FREE

This phase sets up free inbound email forwarding for your domain through Cloudflare. It matters because it lets you use addresses like `hello@boosts.ninja` without paying for a full mailbox, while still keeping the website stack on the free tier.

Log in to: `Cloudflare`, and keep access to the destination inbox you want Cloudflare to forward mail into.

Important concept before you start:

- `MX` records (mail exchange records) tell the internet which mail servers should receive inbound email for your domain.
- `SPF` records (Sender Policy Framework) are DNS `TXT` records that say which servers are allowed to send or route mail for your domain.
- `DKIM` records (DomainKeys Identified Mail) are DNS `TXT` records containing cryptographic keys that help receiving inboxes trust the email path.
- Cloudflare Email Routing is forwarding only. It forwards incoming mail to another inbox, but it does not give you a normal SMTP mailbox for sending outbound mail as `hello@boosts.ninja`.

⚠️ Order warning:

- If you already use another mail provider on `boosts.ninja`, stop and audit the existing `MX` records first. Cloudflare Email Routing cannot be enabled cleanly if another active inbound mail service is still using the same domain.

### Recommended setup: `hello@boosts.ninja`

1. [ ] Decide the real destination inbox first, for example `yourname@gmail.com` or `yourname@outlook.com`. This is the inbox where Cloudflare will forward messages sent to `hello@boosts.ninja`.
   Verify it worked: sign in to that inbox now and confirm you can receive mail there, because Cloudflare will immediately send a verification message to it.

2. [ ] In `Cloudflare`, open **Cloudflare Dashboard → boosts.ninja → Email → Email Routing**. If this is the first time, Cloudflare may open a setup wizard instead of the normal rules screen. This is the control panel where forwarding rules and email DNS records are managed.
   Verify it worked: you should see either an onboarding button like `Enable Email Routing` or a page containing `Routing rules`, `Destination addresses`, and `Settings`.

3. [ ] Start the setup flow and let Cloudflare review the DNS records it plans to add. Cloudflare will add the `MX`, `SPF`, and `DKIM` records required for forwarding to work. This matters because forwarding cannot function until those DNS records exist.
   Verify it worked: the wizard should show that Cloudflare is preparing email-related DNS records for `boosts.ninja`.

4. [ ] Create the forwarding rule for your public inbox. In **Cloudflare Dashboard → boosts.ninja → Email → Email Routing → Routing rules → Create address**, enter:
   - Custom address: `hello`
   - Destination address: your real inbox, for example `yourname@gmail.com`
   What happened: this creates the rule that maps `hello@boosts.ninja` to your real inbox.
   Verify it worked: the rule should appear in the routing rules list with the destination address shown.

5. [ ] Open the destination inbox and click the verification link Cloudflare sends you. Cloudflare will not activate forwarding until the destination inbox is proven to belong to you.
   Verify it worked: when you return to **Cloudflare Dashboard → boosts.ninja → Email → Email Routing**, the destination address should show `Verified`.

6. [ ] Finish onboarding by allowing Cloudflare to add the required email DNS records. In the wizard, this usually appears as **Add records and finish** or **Add records and enable**. This step writes the live DNS records that make forwarding work globally.
   Verify it worked: Cloudflare should stop showing the incomplete-onboarding prompt and instead show Email Routing as enabled.

7. [ ] Confirm the new `MX` records exist from PowerShell:

```powershell
nslookup -type=MX boosts.ninja 1.1.1.1
```

   Expected output should show Cloudflare-managed `MX` records for the domain, for example targets under a Cloudflare-controlled mail-routing hostname.

```text
Server:  one.one.one.one
Address:  1.1.1.1

boosts.ninja    MX preference = <number>, mail exchanger = <cloudflare-mail-hostname>
boosts.ninja    MX preference = <number>, mail exchanger = <cloudflare-mail-hostname>
```

   If it looks wrong:
   - If you still see old mail-provider `MX` records, the onboarding step did not finish or another email provider is still active.
   - If the command returns no `MX` records, wait `5-30 minutes` for propagation and check **Cloudflare Dashboard → boosts.ninja → DNS → Records**.

8. [ ] Confirm the root `SPF` record exists:

```powershell
nslookup -type=TXT boosts.ninja 1.1.1.1
```

   Expected output should include a TXT value allowing Cloudflare's mail-routing service, typically a string that includes `_spf.mx.cloudflare.net`.

```text
Server:  one.one.one.one
Address:  1.1.1.1

boosts.ninja    text =

        "v=spf1 include:_spf.mx.cloudflare.net ~all"
```

   What happened: this SPF record tells receiving servers that Cloudflare's routing system is authorized in this email path.
   If it looks wrong: if the TXT record is missing, reopen **Cloudflare Dashboard → boosts.ninja → Email → Email Routing** and look for a DNS repair or `Add records` prompt.

9. [ ] Confirm the `DKIM` record exists. Cloudflare creates this automatically, but the selector name can vary by account and product version, so use the exact selector shown in **Cloudflare Dashboard → boosts.ninja → DNS → Records**.
   Verify it from PowerShell with the selector Cloudflare shows, for example:

```powershell
nslookup -type=TXT cf2024-1._domainkey.boosts.ninja 1.1.1.1
```

   Expected output should show a long TXT value beginning with something like `v=DKIM1;`.
   What happened: this publishes the DKIM public key that helps receiving mail systems trust the forwarded path.

10. [ ] Send a real end-to-end test to `hello@boosts.ninja` from a different email account than the destination inbox. This matters because some providers suppress what they think is a duplicate self-sent message.
    Verify it worked: the test message should arrive in the destination inbox after a short delay. If it does not, check **Cloudflare Dashboard → boosts.ninja → Email → Email Routing** for rule status and DNS warnings.

11. [ ] Decide how replies should work. Because Cloudflare Email Routing is forwarding only, replying directly from the destination inbox will usually send from the destination inbox's address, not from `hello@boosts.ninja`.
    Verify it worked: send yourself a reply test and look at the actual `From:` address that the recipient sees.

⚠️ Common pitfalls:

- Cloudflare Email Routing does not replace a full mailbox provider. It forwards inbound mail only.
- If another email service is already using your `MX` records and you do not remove or replace those records, Email Routing will not enable correctly.
- If you link the same custom address to multiple destinations, Cloudflare processes only the most recent rule for that custom address.
- If the destination inbox verification email expires, delete and recreate the destination address entry, then verify again.

## 06 — Analytics — FREE

This phase adds traffic visibility and search visibility without adding monthly cost. It matters because you need to know whether people can find the site, how they use it, and whether Google is indexing it correctly.

### Current live status for Phase 6

- [x] Cloudflare Web Analytics is already active on the live site. The Cloudflare Insights beacon is being injected in production for `https://boosts.ninja`.
- [x] The site now includes `robots.txt` at `/robots.txt`.
- [x] The site now includes `sitemap.xml` at `/sitemap.xml`.
- [ ] Google Search Console verification still requires a signed-in Google session, so the DNS ownership-verification click path must be finished manually in your Google account.

### Cloudflare Web Analytics

Primary recommendation for this Pages project: use Cloudflare's one-click Pages integration first, because it is simpler and less error-prone than manually pasting the beacon.

1. [ ] Log in to `Cloudflare` and open **Cloudflare Dashboard → Workers & Pages → boosts-ninja → Metrics → Enable under Web Analytics**. You should see a Web Analytics panel with an enable button. This turns on Cloudflare's privacy-first analytics for the Pages project and automatically injects the beacon on the next deployment.
   Verify it worked: after the next deployment, load the site a few times and return to **Cloudflare Dashboard → Analytics & Logs → Web Analytics**. You should start seeing a site card for `boosts.ninja`, though the charts can take a few minutes to populate.

2. [ ] If the one-click Pages integration is unavailable or does not work, use the manual setup path instead: **Cloudflare Dashboard → Analytics & Logs → Web Analytics → Add a site**. Enter `boosts.ninja`, finish the hostname setup, and copy the JavaScript beacon Cloudflare gives you. This creates a dedicated Web Analytics site entry and lets you install the tracking snippet yourself.
   Verify it worked: after saving the hostname, Cloudflare should show a management screen for `boosts.ninja` and a snippet containing a `data-cf-beacon` token.

3. [ ] If you need manual installation, add this snippet to the `<head>` or just before the closing `</body>` tag on every HTML page:

```html
<script defer src="https://static.cloudflareinsights.com/beacon.min.js"
  data-cf-beacon='{"token": "YOUR_TOKEN"}'></script>
```

   What happened: this snippet sends privacy-first pageview and performance data to Cloudflare Web Analytics. Cloudflare states that Web Analytics does not collect or use your visitors' personal data, so it does not require a cookie banner for analytics alone.
   Verify it worked: deploy the updated files, visit the site, then open **Cloudflare Dashboard → Analytics & Logs → Web Analytics → boosts.ninja**. The first pageviews usually appear within a few minutes.

⚠️ Common pitfall:

- If the site is already proxied through Cloudflare Pages, auto-injection may be enough. Do not paste a second manual snippet unless you actually need it, or you may double-count visits.
- If your HTML is not valid or your origin sends `Cache-Control: public, no-transform`, Cloudflare may not be able to auto-inject the beacon. In that case, use the manual snippet installation.

### Google Search Console

Google Search Console is free and gives you search-performance data, indexing status, crawl errors, and mobile-usability reports. It matters because it tells you whether Google can actually discover and trust `boosts.ninja`.

1. [ ] Log in to `Google` and open **Google Search Console → Add property**. Enter `boosts.ninja` as a `Domain property` and choose `DNS verification`. A domain property covers the root domain plus subdomains such as `www.boosts.ninja`.
   Verify it worked: Google will show you a TXT verification value that starts with `google-site-verification=`.

2. [ ] Log in to `Cloudflare` and open **Cloudflare Dashboard → boosts.ninja → DNS → Records → Add record**. Add a `TXT` record for the root domain using the exact verification value Google gave you. A `TXT` record is a DNS record used to publish text values such as ownership verification strings.
   Verify it worked from PowerShell:

```powershell
nslookup -type=TXT boosts.ninja 1.1.1.1
```

   Expected output:

```text
Server:  one.one.one.one
Address:  1.1.1.1

boosts.ninja    text =

        "google-site-verification=YOUR_TOKEN"
```

   If it looks wrong: if the TXT record does not appear yet, wait `5-30 minutes` and try again. Global DNS propagation can take longer even when Cloudflare saved the record immediately.

3. [ ] Return to **Google Search Console → Verify** and wait for Google to confirm ownership. This tells Google that you control the domain and unlocks Search Console reports for the property.
   Verify it worked: Google should show a success message and open the new property dashboard.

4. [ ] Submit your sitemap in **Google Search Console → Indexing → Sitemaps** using:

```text
https://boosts.ninja/sitemap.xml
```

   What happened: a sitemap is a machine-readable list of URLs you want search engines to crawl. Submitting it helps Google discover pages faster and report crawl issues more clearly.
   Verify it worked: Search Console should show the sitemap as `Success` or `Pending`. If it shows an error, open `https://boosts.ninja/sitemap.xml` in a browser and confirm the file exists and returns `200 OK`.

⚠️ Common pitfall:

- DNS verification can take from a few minutes to a few hours. Do not delete the TXT record after verification, because Google may re-check ownership later.
- If `https://boosts.ninja/sitemap.xml` does not exist yet, Search Console cannot accept it. Create the sitemap before marking this step complete.

## 07 — Launch Checklist — FREE

This phase is the go-live gate. It matters because a site can look correct in one browser tab while still failing on HTTPS, mobile layout, search-engine crawling, or security headers.

1. [ ] Confirm `https://boosts.ninja` loads with a padlock icon. This verifies that SSL/TLS is active and the certificate is trusted by the browser.
   Verify it worked: open the homepage in a browser and confirm the padlock appears in the address bar. If it does not, re-check **Cloudflare Dashboard → boosts.ninja → SSL/TLS → Overview** and **Edge Certificates**.

2. [ ] Confirm `http://boosts.ninja` redirects to HTTPS automatically.
   Verify it from PowerShell:

```powershell
curl.exe -I http://boosts.ninja
```

   Expected output should include:

```text
HTTP/1.1 301 Moved Permanently
location: https://boosts.ninja/
```

   If it looks wrong: if you get `200 OK` over plain HTTP, re-check **Cloudflare Dashboard → boosts.ninja → SSL/TLS → Edge Certificates → Always Use HTTPS**.

3. [ ] Confirm `https://www.boosts.ninja` redirects to the non-`www` version, or intentionally the other way around if you choose `www` as canonical.
   Verify it from PowerShell:

```powershell
curl.exe -I https://www.boosts.ninja
```

   Expected output should include a `301` redirect to `https://boosts.ninja/`.
   If it looks wrong: re-check **Cloudflare Dashboard → boosts.ninja → Rules → Redirect Rules** and confirm the redirect rule is active.

4. [ ] Confirm the mobile layout is responsive and usable. This means text stays readable, buttons are tappable, and no key content overflows off-screen.
   Verify it worked: open the site in a mobile browser or use device emulation in browser developer tools. Test the navigation, pricing cards, lead form, and direct PDF button.

5. [ ] Run [PageSpeed Insights](https://pagespeed.web.dev/) against `https://boosts.ninja` and confirm the performance score is `90+` on mobile. This matters because Core Web Vitals and page speed affect user experience and can affect search visibility.
   Verify it worked: the report should show the performance score along with any image, CSS, or script issues to fix.

6. [ ] Run [Security Headers](https://securityheaders.com/) against `https://boosts.ninja` and confirm there are no red warnings. This checks whether the site is missing important browser-side security headers.
   Verify it worked: the report should not show obvious missing-header failures in red. If it does, review Cloudflare response headers and consider adding a security-header rule later.

7. [ ] Send a real test email to `hello@boosts.ninja` after Phase 05 is configured. This confirms Email Routing, `MX` records, SPF, and DKIM are all functioning together.
   Verify it worked: the message should arrive at the configured destination inbox, and the inbox should show the sender-verification flow has already been completed.

8. [ ] Confirm the analytics script is firing. This proves your launch metrics will exist from day one instead of starting after traffic already arrives.
   Verify it worked: visit the site a few times, then check **Cloudflare Dashboard → Analytics & Logs → Web Analytics → boosts.ninja** for pageviews and performance data.

9. [ ] Confirm `robots.txt` exists at `https://boosts.ninja/robots.txt`. A `robots.txt` file tells search-engine crawlers which paths they are allowed to crawl.
   Verify it from PowerShell:

```powershell
curl.exe -I https://boosts.ninja/robots.txt
```

   Expected output should include `HTTP/1.1 200 OK`.
   If it looks wrong: add a real `robots.txt` file to the published site before launch.

10. [ ] Confirm `sitemap.xml` exists at `https://boosts.ninja/sitemap.xml`.
    Verify it from PowerShell:

```powershell
curl.exe -I https://boosts.ninja/sitemap.xml
```

    Expected output should include `HTTP/1.1 200 OK`.
    If it looks wrong: generate the sitemap file and deploy it before submitting the URL in Search Console.

11. [ ] Confirm a favicon is set. A favicon is the small icon browsers show in tabs, bookmarks, and mobile homescreen shortcuts.
    Verify it worked: open the site in a browser tab and confirm the tab icon is not the generic blank icon.

12. [ ] Confirm Open Graph meta tags are present for social sharing previews. Open Graph tags control the title, description, and preview image shown when someone shares your page on platforms like X, Slack, Discord, and Facebook.
    Verify it from PowerShell:

```powershell
curl.exe https://boosts.ninja | Select-String -Pattern 'property="og:|name="twitter:|rel="icon"'
```

    Expected output should show at least one favicon line and multiple social-sharing meta tags.
    If it looks wrong: add `og:title`, `og:description`, `og:image`, and `twitter:card` tags to the `<head>` before launch.

⚠️ Common pitfall:

- Do not mark the launch checklist complete just because the homepage loads on your own machine. The important checks are redirects, search files, mobile layout, analytics, and share-preview metadata.

## 08 — Ongoing Maintenance — FREE

This phase keeps the site fast, renewed, monitored, and secure after launch. It matters because static sites are low-maintenance, but they are not zero-maintenance.

### Cloudflare performance tweaks

1. [ ] Log in to `Cloudflare` and open **Cloudflare Dashboard → boosts.ninja → Speed → Optimization**. Enable `Auto Minify` for `JavaScript`, `CSS`, and `HTML`. Minification removes unnecessary whitespace and comments so browsers download smaller files faster.
   Verify it worked: save the setting, then inspect the optimization page again and confirm all three toggles remain enabled.

2. [ ] In the same screen, enable `Brotli` compression. Brotli compresses text assets such as HTML, CSS, and JavaScript before they travel across the network, which improves load time.
   Verify it worked: revisit the setting after save and confirm the toggle remains enabled.

3. [ ] Open **Cloudflare Dashboard → boosts.ninja → Caching → Configuration** and set `Browser Cache TTL` to `1 month`. Browser Cache TTL tells visitors' browsers how long they may reuse static files before asking the server for them again.
   Verify it worked: the selected TTL should remain visible after save.

4. [ ] Open **Cloudflare Dashboard → boosts.ninja → Rules → Cache Rules** and create a rule that caches static assets aggressively. Use asset-like paths such as `/assets/*`, `*.css`, `*.js`, and other immutable static files. This keeps repeat visits fast without risking stale HTML.
   Verify it worked: the rule should appear in the Cache Rules list and be enabled.

⚠️ Common pitfall:

- Do not use `Cache everything` on HTML pages or form endpoints unless you fully understand the consequences. It is safe for static assets, but unsafe caching rules can cause stale pages or broken form behavior.

### Domain renewal

5. [ ] Log in to `Namecheap` and open **Namecheap Dashboard → Domain List → Manage boosts.ninja → Domain**. Confirm `Auto-Renew` is enabled. This prevents the domain from expiring just because one renewal email was missed.
   Verify it worked: the domain management page should explicitly show auto-renew as enabled.

6. [ ] Note the expected renewal cost and timing: `.ninja` domains commonly renew around `$30–35/year`, but always confirm the exact current price in your Namecheap account before the renewal date.
   Verify it worked: the renewal section in Namecheap should show the next billing date and price.

7. [ ] Create a calendar reminder for `60 days before expiry`. This gives you time to fix payment problems or registrar-email issues before the domain is at risk.
   Verify it worked: confirm the event exists in your calendar with at least one alert.

8. [ ] Keep the email address on the Namecheap account current. Registrar warnings and renewal failures are only useful if they go to an inbox you actually read.
   Verify it worked: review the account profile and confirm the notification email is active and accessible.

### Security monitoring

9. [ ] Open **Cloudflare Dashboard → boosts.ninja → Security → Events** periodically and review unusual spikes, blocked requests, and suspicious bot traffic. This helps you notice scraping, brute force attempts, or misconfigured rules early.
   Verify it worked: you should be able to see recent event data and filter by event type or date.

10. [ ] If you ever see a suspicious traffic spike or active abuse event, enable `Under Attack Mode` at **Cloudflare Dashboard → boosts.ninja → Security → Settings**. This adds an interstitial challenge to filter malicious traffic before it reaches the site.
    Verify it worked: the security settings page should show the mode as enabled. Turn it off after the incident ends so normal visitors are not inconvenienced longer than necessary.

11. [ ] Run dependency-security checks regularly if the repo grows beyond static HTML/CSS/JS. For Node-based projects, use:

```powershell
npm audit
npm outdated
```

    Expected output:

```text
found 0 vulnerabilities
```

    or a list of outdated packages and advisories if action is needed.
    If it looks wrong: if this specific static repo has no `package.json`, that is normal. Run these commands only in subprojects that actually use npm packages.

### Free growth tools

12. [ ] Consider a free uptime monitor such as [Better Stack Uptime](https://betterstack.com/better-uptime). Their public pricing page currently advertises a free tier with `10 monitors and heartbeats` plus `1 status page`, which is enough for a simple launch.
    Verify it worked: after setup, the monitor dashboard should show `https://boosts.ninja` being checked successfully at the configured interval.

13. [ ] Consider [Web3Forms](https://web3forms.com/) if you want a simple hosted contact-form backend. Their docs currently advertise `250 free submissions per month`, which is a low-friction fit for a lightweight marketing site.
    Verify it worked: submit a test form and confirm the message reaches the configured inbox or webhook target.

14. [ ] Consider [Decap CMS](https://decapcms.org/) if you want Git-based content editing later without adding a paid CMS. This is useful when the site grows beyond a single static landing page and you want non-technical edits through a UI.
    Verify it worked: after setup, you should be able to create or edit content and see those changes committed back into Git.

## Sources checked for current Cloudflare details

- [Cloudflare Pages limits](https://developers.cloudflare.com/pages/platform/limits/)
- [Cloudflare Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Cloudflare Pages pricing for static assets](https://developers.cloudflare.com/pages/functions/pricing/)
- [Cloudflare SSL/TLS encryption modes](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/)
- [Cloudflare Automatic HTTPS Rewrites](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/automatic-https-rewrites/)
- [Cloudflare SSL/TLS additional options](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/)
- [Cloudflare Email Routing overview](https://developers.cloudflare.com/email-routing/)
- [Cloudflare Email Routing get started](https://developers.cloudflare.com/email-routing/get-started/)
- [Cloudflare Email Routing enablement](https://developers.cloudflare.com/email-routing/get-started/enable-email-routing/)
- [Cloudflare Email Routing rules and addresses](https://developers.cloudflare.com/email-routing/setup/email-routing-addresses/)
- [Cloudflare Email Routing DNS records](https://developers.cloudflare.com/email-routing/setup/email-routing-dns-records/)
- [Cloudflare Email Routing testing](https://developers.cloudflare.com/email-routing/get-started/test-email-routing/)
- [Cloudflare Web Analytics overview](https://developers.cloudflare.com/web-analytics/about/)
- [Cloudflare Web Analytics get started](https://developers.cloudflare.com/web-analytics/get-started/)
- [Cloudflare Pages Web Analytics](https://developers.cloudflare.com/pages/how-to/web-analytics/)
- [Google Search Console site verification](https://support.google.com/webmasters/answer/9008080?hl=en)
- [Google Search Console overview](https://support.google.com/webmasters/answer/9128668?hl=en)
- [Better Stack Uptime pricing](https://betterstack.com/uptime/pricing)

## Complete Stack Summary

> **boosts.ninja Stack At A Glance**
>
> | Layer | Provider | Cost |
> |---|---|---:|
> | Domain renewal | Namecheap | ~$30-35/year |
> | DNS | Cloudflare Free plan | $0 |
> | Hosting | Cloudflare Pages | $0 |
> | SSL/HTTPS | Cloudflare | $0 |
> | CDN | Cloudflare | $0 |
> | Email forwarding | Cloudflare Email Routing | $0 |
> | Analytics | Cloudflare Web Analytics | $0 |
> | Search/SEO monitoring | Google Search Console | $0 |
> | Optional uptime monitoring | Better Stack free tier | $0 |
> | Optional forms backend | Web3Forms free tier | $0 |
>
> **Total recurring cost:** about **$30-35/year** for the domain only. Everything else in the recommended stack is free, and none of the free services above require a credit card to get started.

