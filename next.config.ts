import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Old addresses from before Enterprise Valuation was merged into Project 01 (M&A Valuation).
  async redirects() {
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
  },
};

export default nextConfig;
