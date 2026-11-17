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
    projects/ma-valuation/     M&A Valuation project (overview, frameworks, terminal value, AirThread case study)
    not-found.tsx              404 page
    globals.css                Brand colors, fonts, animation styles
  components/                  Reusable UI pieces (Navbar, Footer, ProjectCard, StatusBadge, ...)
  data/
    site.ts                    Name, intro, philosophy, interests, contact links
    projects.ts                All project content and statuses
    valuation.ts               M&A Valuation content, formulas, and AirThread case study data
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
| Frameworks | `/projects/ma-valuation/frameworks/apv`, `/wacc`, `/fte` |
| Terminal Value | `/projects/ma-valuation/terminal-value/growing-perpetuity`, `/liquidation-value`, `/multiples` |
| Case Study | `/projects/ma-valuation/case-study/airthread` |

The project card text (title, summary, topics) is in `src/data/projects.ts`. All other content lives in
`src/data/valuation.ts`. Formulas are written in LaTeX and rendered with KaTeX. Components are in
`src/components/valuation/`. Old addresses (`/enterprise-valuation/...`, `/projects/ma-valuation-airthread`)
redirect to the new ones (see `next.config.ts`).

### Filling in the AirThread case study

Edit the `airthread` object at the bottom of `src/data/valuation.ts`. Every value starts as `null`
and shows as **Pending** on the site:

- **Excel model:** copy your file to `public/models/` (e.g. `public/models/airthread-valuation.xlsx`) and set
  `excelModel.href` to `"/models/airthread-valuation.xlsx"`. A download button appears automatically.
- **assumptions:** set `value` and `source` for each row (e.g. `value: "X.X%"`).
- **outputs / terminalValues:** set the values as formatted text (e.g. `"$X.X billion"`).
- **acquisitionAnalysis / findings / implications:** add paragraphs as strings.

Only enter figures that come from your own model.

## Deployment

The site is not deployed. When you are ready, it can be hosted on any Next.js host (for example Vercel) by connecting this repository.
