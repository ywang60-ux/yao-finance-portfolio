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
    title: "Enterprise Valuation and the AirThread Acquisition",
    status: "In Progress",
    summary:
      "Core enterprise valuation frameworks (APV, WACC, Flow to Equity) and terminal value methods, applied to valuing AirThread Connections as an acquisition target.",
    topics: [
      "APV",
      "WACC",
      "Flow to Equity",
      "Terminal value",
      "DCF valuation",
      "Comparable company analysis",
      "Capital structure",
      "Enterprise value",
    ],
  },
  {
    slug: "fpa-modeling",
    number: "02",
    category: "FP&A Modeling",
    title: "FP&A Forecasting and Variance Model",
    status: "Planned",
    summary:
      "A planned FP&A model covering revenue and expense forecasting, budget versus actual comparison, variance analysis, and scenario planning.",
    topics: [
      "Financial forecasting",
      "Revenue and expense modeling",
      "Budget vs. actual",
      "Variance analysis",
      "Scenario planning",
    ],
    sections: {
      businessProblem: {
        state: "written",
        label: "Planned scope",
        paragraphs: [
          "Finance teams need forecasts that are realistic, easy to update, and useful for explaining why actual results differ from plan. This project will focus on building that kind of planning model.",
        ],
      },
      methodology: {
        state: "written",
        label: "Planned approach",
        paragraphs: ["The intended scope includes:"],
        bullets: [
          "Revenue and expense forecasting driven by clear assumptions.",
          "A budget versus actual comparison.",
          "Variance analysis that separates the main drivers of differences.",
          "Scenario planning to test alternative assumptions.",
        ],
      },
      analysis: { state: "pending", note: "Not started. This project is planned." },
      findings: { state: "pending", note: "Not started. This project is planned." },
      implications: { state: "pending", note: "Not started. This project is planned." },
    },
  },
  {
    slug: "financial-data-analytics",
    number: "03",
    category: "Financial Data Analytics",
    title: "Financial Data and Dashboards",
    status: "Planned",
    summary:
      "A planned analytics project using SQL, Python, and Power BI to prepare financial data and present it through clear dashboards.",
    topics: ["SQL", "Python", "Power BI", "Financial dashboards"],
    tools: ["SQL", "Python", "Power BI"],
    sections: {
      businessProblem: {
        state: "written",
        label: "Planned scope",
        paragraphs: [
          "Financial data is often spread across sources and hard to read quickly. This project will focus on turning raw financial data into reliable, decision-ready reporting.",
        ],
      },
      methodology: {
        state: "written",
        label: "Planned approach",
        paragraphs: ["The intended scope includes:"],
        bullets: [
          "SQL for querying and structuring financial data.",
          "Python for cleaning, transformation, and analysis.",
          "Power BI for interactive financial dashboards.",
        ],
      },
      analysis: { state: "pending", note: "Not started. This project is planned." },
      findings: { state: "pending", note: "Not started. This project is planned." },
      implications: { state: "pending", note: "Not started. This project is planned." },
    },
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
