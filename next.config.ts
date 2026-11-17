import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Old addresses from before Enterprise Valuation was merged into Project 01 (M&A Valuation).
  async redirects() {
    return [
      {
        source: "/projects/ma-valuation-airthread",
        destination: "/projects/ma-valuation/case-study/airthread",
        permanent: false,
      },
      {
        source: "/enterprise-valuation/case-studies/airthread",
        destination: "/projects/ma-valuation/case-study/airthread",
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
