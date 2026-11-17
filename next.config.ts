import type { NextConfig } from "next";

/**
 * Two build targets from the same source:
 *
 * - Default (Vercel): a normal Next.js build with redirects. Nothing here changes
 *   unless GITHUB_PAGES is set, so the Vercel deployment behaves exactly as before.
 * - GitHub Pages: `GITHUB_PAGES=true next build` writes a fully static site to out/
 *   (see .github/workflows/deploy-github-pages.yml). Static export cannot run
 *   redirects, and those old addresses never existed on github.io, so they are
 *   left out of that build.
 */
const isGitHubPages = process.env.GITHUB_PAGES === "true";

// Old addresses from before Enterprise Valuation was merged into Project 01 (M&A Valuation).
async function redirects() {
  return [
    // The AirThread case study was removed; send its old addresses to the project page.
    { source: "/projects/ma-valuation/case-study/airthread", destination: "/projects/ma-valuation", permanent: false },
    {
      source: "/projects/ma-valuation-airthread",
      destination: "/projects/ma-valuation",
      permanent: false,
    },
    {
      source: "/enterprise-valuation/case-studies/airthread",
      destination: "/projects/ma-valuation",
      permanent: false,
    },
    { source: "/enterprise-valuation", destination: "/projects/ma-valuation", permanent: false },
    {
      source: "/enterprise-valuation/:path*",
      destination: "/projects/ma-valuation/:path*",
      permanent: false,
    },
  ];
}

const nextConfig: NextConfig = isGitHubPages
  ? {
      // Static HTML export for https://ywang60-ux.github.io (served from the domain root).
      output: "export",
      // Emit each page as folder/index.html, which GitHub Pages serves reliably.
      trailingSlash: true,
    }
  : {
      redirects,
    };

export default nextConfig;
