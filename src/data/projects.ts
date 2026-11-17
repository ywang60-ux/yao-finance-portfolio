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
  sections: Record<SectionKey, ProjectSection>;
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
    slug: "ma-valuation-airthread",
    number: "01",
    category: "M&A Valuation",
    title: "AirThread Connections Acquisition",
    subtitle: "Valuation case study",
    status: "In Progress",
    summary:
      "A valuation of AirThread Connections as an acquisition target, built around discounted cash flow analysis, comparable companies, and a cost of capital that reflects the target's capital structure.",
    topics: [
      "DCF valuation",
      "Comparable company analysis",
      "WACC",
      "Capital structure",
      "Enterprise value",
    ],
    sections: {
      businessProblem: {
        state: "written",
        label: "Case context",
        paragraphs: [
          "The AirThread Connections case asks what a potential acquirer should be willing to pay for AirThread, a regional wireless provider. The acquirer needs a defensible estimate of the target's value before deciding whether, and at what price, to move forward.",
          "The central questions are how much the business is worth on a standalone basis, how its capital structure affects the appropriate discount rate, and how an intrinsic valuation compares with how the market values similar companies.",
        ],
      },
      methodology: {
        state: "written",
        label: "Planned approach",
        paragraphs: [
          "The analysis is structured around the standard tools of acquisition valuation:",
        ],
        bullets: [
          "Discounted cash flow (DCF): project free cash flows over the forecast horizon and estimate a terminal value.",
          "Weighted average cost of capital (WACC): estimate the cost of equity and cost of debt, and reflect the target capital structure.",
          "Capital structure: consider how leverage affects beta and the discount rate.",
          "Comparable company analysis: benchmark the target against trading multiples of similar companies.",
          "Enterprise value: reconcile the DCF and multiples-based views into a value range.",
        ],
      },
      analysis: {
        state: "pending",
        note: "This analysis is in progress. Model outputs will be added here once the work is complete and checked.",
      },
      findings: {
        state: "pending",
        note: "No findings yet. Results will be published only after the valuation is finished.",
      },
      implications: {
        state: "pending",
        note: "Business implications will be written once the findings are final.",
      },
    },
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
