# elianetapia.com — Portfolio

A hand-built static site (HTML + CSS + a little JavaScript). No build step, no framework, no dependencies. Open `index.html` in a browser and it works.

```
elianetapia-portfolio/
├── index.html                      # Home (hero, about, selected work, contact)
├── estimator.html                  # The Estimator
├── multi-location-commerce.html    # Multi-Location Commerce Platform
├── mortgage-loan.html              # Mortgage Loan Management Platform
├── youth-sports.html               # Youth Sports Audio App
├── css/styles.css                  # All styles (design tokens at the top)
├── js/main.js                      # EN/ES language toggle
├── images/                         # Your exported screens (see images/README.md)
└── README.md
```

## 1. Preview it locally
Just double-click `index.html`. Or, for a cleaner local server:
```bash
cd elianetapia-portfolio
python3 -m http.server 8000
# open http://localhost:8000
```

## 2. Add your images
See **`images/README.md`** — it lists the exact file names each page expects and which Figma frame goes where. Missing images hide themselves, so you can launch first and add screens later.

## 3. Put it on GitHub (your personal account)
This folder is already a git repository with a first commit. To publish it under **your own** account:

1. On GitHub (logged in as **you**, not Ravn), create a new **empty** repo — e.g. `elianetapia-portfolio`. Don't add a README/license (this repo already has one).
2. Back here in the folder, connect it and push:
```bash
git remote add origin https://github.com/<your-username>/elianetapia-portfolio.git
git branch -M main
git push -u origin main
```
That's it — the repo is 100% yours.

## 4. Deploy for free + connect elianetapia.com
Any of these host static sites free **with a custom domain**. Easiest first:

**Option A — Netlify drag & drop (no git needed)**
1. Go to app.netlify.com → **Add new site → Deploy manually**.
2. Drag this whole folder onto the page. It's live in seconds on a `*.netlify.app` URL.
3. **Domain settings → Add a domain → `elianetapia.com`** and follow the DNS steps.

**Option B — Netlify / Vercel from GitHub (auto-deploys on every push)**
1. Netlify or Vercel → **Import from Git** → pick your repo.
2. No build command, no output dir (it's already static) → Deploy.
3. Add `elianetapia.com` in the domain settings.

**Option C — GitHub Pages**
1. Repo → **Settings → Pages** → Source: `main` / root → Save.
2. Add `elianetapia.com` under **Custom domain**.

**The only thing that costs money** is registering `elianetapia.com` (~US$10–15/yr at Namecheap, Cloudflare, Porkbun, etc.). Hosting + HTTPS on the options above is free.

## The EN / ES toggle
The toggle in the top-right is wired up: any text with a `data-es="..."` attribute switches when ES is selected, and the choice is remembered across pages. Default is English. Most visible copy (nav, headings, hero, project summaries, impact) is already translated; if you want the few remaining detail paragraphs fully in Spanish too, that's a quick add.

## Editing
- **Colors / fonts / spacing:** the top of `css/styles.css` (`:root`) — change once, updates everywhere.
- **Text:** edit it directly in the `.html` files. To keep the Spanish version in sync, update both the visible text and its `data-es="..."`.
