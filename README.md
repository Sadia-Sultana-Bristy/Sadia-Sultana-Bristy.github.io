# Sadia Sultana Bristy: portfolio website

Personal portfolio for a Software QA Engineer. It's a plain static site (HTML, CSS and a little JavaScript) with **no build step and no dependencies**. Open `index.html` in a browser and it works.

```
sadia-portfolio/
├── index.html               ← all page content lives here
├── 404.html                 ← "page not found" page
├── assets/
│   ├── css/styles.css       ← design tokens (colors, fonts, spacing) + all styles
│   ├── css/fonts.css        ← self-hosted font declarations
│   ├── js/main.js           ← theme toggle, mobile menu, hero animation, contact form
│   ├── fonts/               ← Bricolage Grotesque + IBM Plex (OFL licensed)
│   ├── img/                 ← favicon, app icons, social preview image (og-image.png)
│   └── resume/Sadia-Sultana-Bristy-CV.pdf
├── robots.txt · sitemap.xml · site.webmanifest
├── .nojekyll                ← tells GitHub Pages to serve files as-is
```

## Preview locally

Double-click `index.html`, or run a small server so that paths behave exactly as they will in production:

```bash
cd sadia-portfolio
python3 -m http.server 8000      # then open http://localhost:8000
```

## Edit content

Everything visible is in **`index.html`**, split into sections with banner comments such as `<!-- ===== EXPERIENCE ===== -->`. Find the section, change the text, then save and refresh.

| To change… | Look for |
|---|---|
| Headline and intro | `HERO` section: `hero__title`, `hero__lead` |
| Impact numbers | `IMPACT` section: each `<dt>` is the number, `<dd>` the description |
| A job or client | `EXPERIENCE` section: copy a `<div class="client">` block to add a client, or an `<li class="timeline__item">` to add a job (newest first) |
| Case studies | `CASE STUDIES` section: each `<article class="case">` has Problem / What I did / Result |
| Skills | `SKILLS` section: add a skill as `<li>Name</li>` inside a `chips` list |
| Certifications | `EDUCATION & LEARNING` section: there's a comment showing the exact line to add |
| Testimonials | `TESTIMONIALS` section: **these are placeholders.** Replace them with real LinkedIn recommendations, or delete the whole `<section>` |
| FAQ | `FAQ` section: each question is a `<details>` block |
| Email / LinkedIn | Search and replace `sadiasultanabristy202@gmail.com` and `linkedin.com/in/sadia-sultana-bristy` (they appear in `index.html` and in `assets/js/main.js` for the contact form) |
| Search and social preview text | The `<head>` at the top of `index.html`: `<title>`, `description`, `og:*` and `twitter:*` tags, plus the JSON-LD block |

**Your website address.** The site is set up for `https://sadia-sultana-bristy.github.io/`. If you move it to another host or a custom domain, search and replace that address in `index.html`, `robots.txt` and `sitemap.xml`. It's used for search engines and link previews.

**Phone number.** The phone number from the CV is deliberately left off the public site to avoid spam calls. It's still on the downloadable CV.

## Replace the CV

Overwrite `assets/resume/Sadia-Sultana-Bristy-CV.pdf` with the new PDF, keeping the same file name. Every "Download CV" button points to that file.

## Change colors

All colors are CSS variables at the top of `assets/css/styles.css`:

```css
:root {                       /* light theme */
  --pass:  #136F4E;           /* main accent: buttons, links, numbers */
  --paper: #F2F4F6;           /* page background */
  --ink:   #18212C;           /* text */
  ...
}
[data-theme="dark"] { ... }   /* dark theme versions of the same variables */
```

Change a value in **both** blocks to keep light and dark mode consistent. Keep text colors dark enough to read; [WebAIM's contrast checker](https://webaim.org/resources/contrastchecker/) will tell you (aim for 4.5:1 or higher). Fonts are set in `--font-display`, `--font-body` and `--font-mono` in the same place.

## Replace images

- **Social preview** (`assets/img/og-image.png`, 1200×630): replace it with any 1200×630 PNG or JPG of the same name.
- **Favicon**: `assets/img/favicon.svg` (an editable SVG), plus PNG versions `favicon-32.png`, `apple-touch-icon.png` (180×180), `icon-192.png` and `icon-512.png`. [realfavicongenerator.net](https://realfavicongenerator.net) can generate all of them from one image.
- **Adding a photo** (optional): put e.g. `assets/img/sadia.webp` (≈800px wide, WebP, under 150 KB) and add `<img src="assets/img/sadia.webp" alt="Sadia Sultana Bristy" width="400" height="400" loading="lazy">` where you want it, for example at the top of the About section.

## Deploy on GitHub Pages

The site is set up for **https://sadia-sultana-bristy.github.io/**.

1. Sign in as **Sadia-Sultana-Bristy** on GitHub and create a **public** repository named exactly `Sadia-Sultana-Bristy.github.io`. Don't add a README.
2. On the empty repo page, click **uploading an existing file**. Unzip `sadia-portfolio.zip` and drag in everything it contains, so `index.html` sits at the top level of the repo. Click **Commit changes**.
3. Go to **Settings → Pages**. Under *Build and deployment*, set Source to **Deploy from a branch**, Branch to **main**, and folder to **/ (root)**, then click **Save**.
4. After 1–2 minutes the site is live at **https://sadia-sultana-bristy.github.io/**. The *Actions* tab shows progress.
5. To update the site later, open a file on github.com, click the pencil icon, edit it and commit. It redeploys automatically.

### Custom domain (optional)
Buy a domain (e.g. `sadiabristy.com`) and add it under **Settings → Pages → Custom domain**. GitHub provides free HTTPS. Then update the URL in `index.html`, `robots.txt` and `sitemap.xml`.

### After going live
- Submit the site in [Google Search Console](https://search.google.com/search-console) and add `sitemap.xml`.
- Test the link preview with the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/).
- Add the URL to the LinkedIn profile's *Contact info* and *Featured* sections, and to the CV header.

## What's built in

- **Responsive** from 320px phones to wide desktops. The mobile menu closes with Esc.
- **Light and dark mode.** It follows the visitor's system setting, and the toggle remembers their choice.
- **Accessible.** Uses semantic landmarks, a skip link, visible keyboard focus, labelled controls and WCAG AA contrast (checked with axe-core, with zero violations in both themes). Animations are switched off for visitors who prefer reduced motion.
- **Fast.** No frameworks and no external requests. About 200 KB of self-hosted fonts load with `font-display: swap`, and the main font files are preloaded.
- **SEO.** Includes title and description, a canonical URL, Open Graph and Twitter cards, schema.org `Person` structured data, a sitemap, robots.txt and a web manifest.
- **Contact form.** Opens the visitor's email app with the message pre-filled, so no server or third-party form service is needed. To receive messages without the email app step, point the form at a free form service such as Formspree, and remove the `mailto` logic in `main.js`.
- **No custom cursor.** It was left out on purpose: it hurts usability and accessibility on a content-focused site.

## Design notes

- **Concept:** a QA engineer's portfolio that opens with a test run. The hero terminal types out a Playwright command and the insurance workflows Sadia tests pass one by one. It's the single orchestrated animation on the page; everything else stays quiet.
- **Palette:** cool slate paper (`#F2F4F6`) with deep slate ink (`#18212C`). The accent is a "test passed" green (`#136F4E`), with defect amber (`#9A5A0B`) used sparingly.
- **Type:** *Bricolage Grotesque* for headings, *IBM Plex Sans* for reading, and *IBM Plex Mono* only where real code appears.
- **Layout:** left-aligned, with a two-column grid on desktop and one column on mobile. Numbered markers appear only in "How I test a release", because that content is a real sequence.
