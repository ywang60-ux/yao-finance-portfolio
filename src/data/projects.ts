/**
 * Project content.
 *
 * Every project has the same five sections. Each section is either:
 *  - "written":  text you have actually completed (shown normally), or
 *  - "pending":  not done yet (shown as a clearly marked placeholder).
 *
 * Only switch a section to "written" once the work behind it is real.
 * Planned scope text describes what the project WILL do, never results.
 */

export type ProjectStatus = "In Progress" | "Planned" | "Completed";

export type SectionKey =
  | "businessProblem"
  | "methodology"
  | "analysis"
  | "findings"
  | "implications";

export type ProjectSection =
  | { state: "written"; label?: string; paragraphs: string[]; bullets?: string[] }
  | { state: "pending"; note: string };

export type Project = {
  slug: string;
  number: string;
  category: string;
  title: string;
  subtitle?: string;
  status: ProjectStatus;
  summary: string;
  topics: string[];
  tools?: string[];
  /** Five-section detail page. Omit for projects that have their own pages. */
  sections?: Record<SectionKey, ProjectSection>;
};

export const sectionOrder: { key: SectionKey; title: string }[] = [
  { key: "businessProblem", title: "Business Problem" },
  { key: "methodology", title: "Methodology" },
  { key: "analysis", title: "Analysis" },
  { key: "findings", title: "Findings" },
  { key: "implications", title: "Business Implications" },
];

export const projects: Project[] = [
  {
    // Project 01 is a full section with its own pages in src/app/projects/ma-valuation/.
    // Its content lives in src/data/valuation.ts, so it has no `sections` here.
    slug: "ma-valuation",
    number: "01",
    category: "M&A Valuation",
    title: "Enterprise Valuation: Frameworks and Case Studies",
    status: "Completed",
    summary:
      "Core enterprise valuation frameworks (APV, WACC, Flow to Equity) and terminal value methods, applied in case studies: Flash Memory's investment and financing decision and Ferrari's 2015 IPO.",
    topics: [
      "APV",
      "WACC",
      "Flow to Equity",
      "Terminal value",
      "DCF valuation",
      "Comparable company analysis",
      "Capital structure",
      "Enterprise value",
      "NPV / IRR",
      "Financing decisions",
      "IPO valuation",
    ],
  },
  {
    // Project 02 has its own page with interactive models in
    // src/app/projects/fpa-modeling/. Content: src/data/fpaModeling.ts.
    slug: "fpa-modeling",
    number: "02",
    category: "FP&A Modeling",
    title: "FP&A Budgeting and Forecasting Model",
    status: "In Progress",
    summary:
      "A monthly, driver-based budget and forecast for a professional services firm, covering revenue and receivables, headcount, contractor, capex, and debt analysis, financial statement aggregation, and budget-versus-forecast dashboards, with interactive models of the revenue, cost, and cash logic.",
    topics: ["Revenue & receivables", "Headcount planning", "Contractor analysis", "Capex & depreciation", "Revolving credit line", "Statement aggregation", "Budget vs. forecast dashboards"],
    tools: ["Excel"],
  },
  {
    // Project 03 has its own page with an interactive dashboard in
    // src/app/projects/financial-data-analytics/. Content: src/data/promotionAnalysis.ts.
    slug: "financial-data-analytics",
    number: "03",
    category: "Financial Data Analytics",
    title: "Multinational Promotion Analysis",
    status: "Completed",
    summary:
      "A Power BI promotion analysis of 3.4 million retail sales records across three continents, rebuilt here as an interactive dashboard that visitors can filter by region, product, and year.",
    topics: ["Power BI", "DAX", "Star schema data model", "Interactive dashboards", "Promotion analysis"],
    tools: ["Power BI", "DAX", "Python"],
  },
  {
    slug: "strategic-finance",
    number: "04",
    category: "Strategic Finance",
    title: "Unit Economics and Investment Evaluation",
    status: "Planned",
    summary:
      "A planned strategic finance project examining unit economics, profitability, and investment evaluation to support strategic decisions.",
    topics: [
      "Unit economics",
      "Profitability analysis",
      "Investment evaluation",
      "Strategic insights",
    ],
    sections: {
      businessProblem: {
        state: "written",
        label: "Planned scope",
        paragraphs: [
          "Strategic decisions depend on understanding what drives profitability at the level of a single customer, product, or unit, and whether a proposed investment creates value. This project will focus on those questions.",
        ],
      },
      methodology: {
        state: "written",
        label: "Planned approach",
        paragraphs: ["The intended scope includes:"],
        bullets: [
          "Unit economics analysis.",
          "Profitability analysis.",
          "Investment evaluation.",
          "Translating the analysis into strategic insights.",
        ],
      },
      analysis: { state: "pending", note: "Not started. This project is planned." },
      findings: { state: "pending", note: "Not started. This project is planned." },
      implications: { state: "pending", note: "Not started. This project is planned." },
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
