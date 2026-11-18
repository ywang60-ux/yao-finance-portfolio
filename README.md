# YAO: Financial Project Portfolio

A financial project portfolio website for Yao, an MS in Financial Analytics candidate at Santa Clara University.

Built with **Next.js 15 (App Router)**, **TypeScript**, and **Tailwind CSS 4**.

## Requirements

- Node.js 20 or newer (this Mac has Node 22 installed in `~/.local/node`)

If `node` or `npm` says "command not found", open a new terminal window, or run:

```bash
export PATH="$HOME/.local/node/bin:$PATH"
```

## Run the site locally

```bash
npm install      # first time only
npm run dev      # start the dev server
```

Then open **http://localhost:3000** in your browser. Changes you save appear automatically.
Press `Ctrl + C` in the terminal to stop the server.

To test the optimized production build:

```bash
npm run build
npm run start    # serves at http://localhost:3000
```

## Project structure

```
src/
  app/
    layout.tsx                 Fonts, navigation, footer, page metadata
    page.tsx                   Homepage: hero, philosophy, interests, projects, about, contact
    projects/[slug]/page.tsx   Project detail page (one per project)
    projects/ma-valuation/     M&A Valuation project (overview, frameworks, terminal value, case studies)
    not-found.tsx              404 page
    globals.css                Brand colors, fonts, animation styles
  components/                  Reusable UI pieces (Navbar, Footer, ProjectCard, StatusBadge, ...)
  data/
    site.ts                    Name, intro, philosophy, interests, contact links
    projects.ts                All project content and statuses
    valuation.ts               M&A Valuation content, formulas, and case study list
```

## Editing content

All text lives in `src/data/`, so you rarely need to touch the components.

**Contact links:** open `src/data/site.ts` and fill in `contactLinks`. Entries with an empty `href` stay hidden; until at least one is filled in, the Contact section shows "Contact details will be added soon."

**Project status:** in `src/data/projects.ts`, set `status` to `"Planned"`, `"In Progress"`, or `"Completed"`. The badge, card style, and notice on the detail page update automatically.

**Project sections:** every project has five sections: Business Problem, Methodology, Analysis, Findings, and Business Implications. Each section is one of:

- `{ state: "pending", note: "..." }`: shown as a clearly marked **Pending** placeholder
- `{ state: "written", label?: "...", paragraphs: ["..."], bullets?: ["..."] }`: shown as normal content

Switch a section to `"written"` only once the work behind it is finished. The site is meant to show real work only, with no placeholder numbers or invented results.

**Adding a project:** copy an existing entry in the `projects` array, give it a new unique `slug`, and its page is created at `/projects/<slug>`.

## M&A Valuation (Project 01)

Project 01 has its own set of pages instead of the standard five-section project page:

| Page | Address |
|---|---|
| Project overview | `/projects/ma-valuation` |
| Valuation Methods | `/projects/ma-valuation/frameworks/apv`, `/wacc`, `/fte` |
| Terminal Value | `/projects/ma-valuation/terminal-value/growing-perpetuity`, `/liquidation-value`, `/multiples` |
| Case Studies | `/projects/ma-valuation/case-study/flash-memory`, `/ferrari-ipo` |

The project card text (title, summary, topics) is in `src/data/projects.ts`. All other content lives in
`src/data/valuation.ts`. Formulas are written in LaTeX and rendered with KaTeX. Components are in
`src/components/valuation/`. Old addresses (`/enterprise-valuation/...` and the removed AirThread pages)
redirect to the new ones (see `next.config.ts`).

### Flash Memory and Ferrari case studies

Content is in `src/data/flashMemory.ts` and `src/data/ferrari.ts`. Their figures come from the class Excel models,
and each page credits that model. Shared page pieces are in `src/components/valuation/CaseParts.tsx`. Keep the case summary in your own words: the HBS case text and exhibits are copyrighted and should not be
posted. The same applies to the instructor's Excel files, so don't offer them for download.

Case studies are listed in `caseStudies` in `src/data/valuation.ts`; add an entry there plus a page folder under
`src/app/projects/ma-valuation/case-study/` to add another.

## Financial Data Analytics (Project 03)

`/projects/financial-data-analytics` shows the Multinational Promotion Analysis (a group Power BI project from the
UW Data Analytics Certificate Program, built on Microsoft's public Contoso sample data) as an interactive dashboard.

- Page text: `src/data/promotionAnalysis.ts`
- Dashboard component: `src/components/dashboard/PromotionDashboard.tsx` (filters, KPIs, charts, drill-through)
- Data: `public/data/promotion-dashboard.json`, about 55,000 pre-aggregated rows. The browser recomputes the DAX
  measures (net profit, average daily units, return rate, promotion vs. No Discount) from these sums.

To regenerate the data from the `.pbix` file:

```bash
python3 -m venv .venv && .venv/bin/pip install pbixray
.venv/bin/python scripts/aggregate_promotion_pbix.py "path/to/report.pbix" public/data/promotion-dashboard.json
```

## Deployment

This repository is the single source of truth. It deploys to two places:

| Target | URL | How |
|---|---|---|
| Vercel | your Vercel project URL | Vercel's default `next build` (with redirects) |
| GitHub Pages | https://ywang60-ux.github.io | `.github/workflows/deploy-github-pages.yml` |

### GitHub Pages (static export)

Setting `GITHUB_PAGES=true` switches `next.config.ts` to a static HTML export in `out/`
(`output: "export"`, `trailingSlash: true`). Without that variable the build is unchanged,
so Vercel is not affected. The old-URL redirects only exist on Vercel, because static
export cannot run redirects.

On every push to `main` (or a manual run from the Actions tab), the workflow builds the
export, adds `.nojekyll` (so GitHub Pages keeps the `_next/` folder), and pushes `out/` to
the `main` branch of `ywang60-ux/ywang60-ux.github.io`. That repository only holds build
output; never edit it by hand, because each deploy replaces its contents.

It needs one repository secret, `PAGES_DEPLOY_TOKEN`: a fine-grained personal access
token with **Contents: Read and write** on `ywang60-ux/ywang60-ux.github.io` only.

To preview the static export locally:

```bash
GITHUB_PAGES=true npm run build
npx serve out
```
