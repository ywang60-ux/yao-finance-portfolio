/**
 * M&A Valuation content (Project 01): valuation frameworks, terminal value
 * methods, and the list of case studies.
 *
 * Formulas are written in LaTeX (rendered with KaTeX) and are standard
 * textbook definitions. They contain no company data or assumptions.
 */

const tex = String.raw;

export type FormulaBlock = {
  label: string;
  latex: string;
  note?: string;
};

export type Term = { symbol: string; meaning: string };

export type MethodPage = {
  slug: string;
  group: "frameworks" | "terminal-value";
  short: string;
  title: string;
  tagline: string;
  overview: string[];
  formulas: FormulaBlock[];
  terms: Term[];
  whenToUse: string[];
  considerations: string[];
};

export const valuationBase = "/projects/ma-valuation";

/* ------------------------------------------------------------------ */
/* Valuation frameworks                                                */
/* ------------------------------------------------------------------ */

export const frameworks: MethodPage[] = [
  {
    slug: "apv",
    group: "frameworks",
    short: "APV",
    title: "Adjusted Present Value",
    tagline: "Value the business as if unlevered, then add the value of financing separately.",
    overview: [
      "APV splits firm value into two parts: the value of the operations as if financed entirely with equity, and the value created (or lost) by the financing decision, chiefly the interest tax shield.",
      "Because the financing effect is valued on its own, APV handles capital structures that change over time, such as leveraged buyouts or acquisitions with a defined debt paydown schedule.",
    ],
    formulas: [
      {
        label: "Levered firm value",
        latex: tex`V_L = V_U + PV(\text{Interest Tax Shields}) - PV(\text{Financial Distress Costs})`,
      },
      {
        label: "Unlevered value",
        latex: tex`V_U = \sum_{t=1}^{N} \frac{FCF_t}{(1+r_U)^t} + \frac{TV_N}{(1+r_U)^N}`,
      },
      {
        label: "Interest tax shield",
        latex: tex`ITS_t = \tau_c \times r_D \times D_{t-1}`,
        note: "Discounted at r_D when the debt schedule is fixed, or at r_U when debt is set as a constant proportion of value.",
      },
      {
        label: "Unlevered cost of capital (constant leverage)",
        latex: tex`r_U = \frac{E}{D+E}\, r_E + \frac{D}{D+E}\, r_D`,
      },
    ],
    terms: [
      { symbol: "V_L, V_U", meaning: "Value of the levered and unlevered firm" },
      { symbol: "FCF_t", meaning: "Unlevered free cash flow in year t" },
      { symbol: "r_U", meaning: "Unlevered cost of capital (cost of assets)" },
      { symbol: "r_D, D", meaning: "Cost of debt and amount of debt" },
      { symbol: "τ_c", meaning: "Corporate tax rate" },
      { symbol: "TV_N", meaning: "Unlevered terminal value at the end of year N" },
    ],
    whenToUse: [
      "Debt levels follow a known schedule rather than a constant ratio",
      "Leveraged buyouts and acquisitions with planned deleveraging",
      "When financing side effects (subsidies, issuance costs) should be shown separately",
    ],
    considerations: [
      "The discount rate for tax shields depends on the assumed debt policy",
      "Distress costs are real but difficult to estimate precisely",
      "Gives the same answer as WACC when assumptions are consistent",
    ],
  },
  {
    slug: "wacc",
    group: "frameworks",
    short: "WACC",
    title: "Weighted Average Cost of Capital",
    tagline: "Discount unlevered free cash flows at a blended, after-tax cost of capital.",
    overview: [
      "The WACC method captures the benefit of debt financing inside the discount rate: the after-tax cost of debt lowers the blended rate applied to the firm's unlevered free cash flows.",
      "It is the most widely used enterprise valuation approach and works best when the company maintains a stable target capital structure.",
    ],
    formulas: [
      {
        label: "Weighted average cost of capital",
        latex: tex`r_{WACC} = \frac{E}{D+E}\, r_E + \frac{D}{D+E}\, r_D\,(1-\tau_c)`,
      },
      {
        label: "Enterprise value",
        latex: tex`V_L = \sum_{t=1}^{N} \frac{FCF_t}{(1+r_{WACC})^t} + \frac{TV_N}{(1+r_{WACC})^N}`,
      },
      {
        label: "Cost of equity (CAPM)",
        latex: tex`r_E = r_f + \beta_E\,\big(E[R_m] - r_f\big)`,
      },
      {
        label: "Relevering beta (constant debt, Hamada)",
        latex: tex`\beta_L = \beta_U \left[1 + (1-\tau_c)\frac{D}{E}\right]`,
      },
    ],
    terms: [
      { symbol: "E, D", meaning: "Market values of equity and debt" },
      { symbol: "r_E, r_D", meaning: "Cost of equity and pre-tax cost of debt" },
      { symbol: "τ_c", meaning: "Corporate tax rate" },
      { symbol: "r_f", meaning: "Risk-free rate" },
      { symbol: "E[R_m] − r_f", meaning: "Market risk premium" },
      { symbol: "β_L, β_U", meaning: "Levered (equity) and unlevered (asset) beta" },
    ],
    whenToUse: [
      "The company targets a stable debt-to-value ratio",
      "Standard DCF valuation of operating companies",
      "Comparing a valuation against market-based benchmarks",
    ],
    considerations: [
      "Weights should reflect target market values, not book values",
      "A changing capital structure requires recomputing WACC each period",
      "Small changes in WACC or terminal growth move value significantly",
    ],
  },
  {
    slug: "fte",
    group: "frameworks",
    short: "FTE",
    title: "Flow to Equity",
    tagline: "Value equity directly by discounting the cash flows available to shareholders.",
    overview: [
      "Flow to Equity values the equity directly. Cash flows are measured after interest payments and net borrowing, so they represent what is actually available to shareholders, and they are discounted at the cost of equity.",
      "It is common for financial institutions, where debt is part of operations, and as a cross-check on WACC and APV results.",
    ],
    formulas: [
      {
        label: "Unlevered free cash flow",
        latex: tex`FCF = EBIT\,(1-\tau_c) + D\&A - CapEx - \Delta NWC`,
      },
      {
        label: "Free cash flow to equity",
        latex: tex`FCFE_t = FCF_t - (1-\tau_c)\times \text{Interest}_t + \Delta \text{Net Borrowing}_t`,
      },
      {
        label: "Equity value",
        latex: tex`E = \sum_{t=1}^{N} \frac{FCFE_t}{(1+r_E)^t} + \frac{TV^{E}_N}{(1+r_E)^N}`,
      },
      {
        label: "Cost of equity (constant leverage)",
        latex: tex`r_E = r_U + \frac{D}{E}\,(r_U - r_D)`,
      },
    ],
    terms: [
      { symbol: "FCFE_t", meaning: "Free cash flow to equity in year t" },
      { symbol: "ΔNet Borrowing", meaning: "New debt issued less debt repaid" },
      { symbol: "r_E", meaning: "Cost of equity, which changes as leverage changes" },
      { symbol: "TV^E_N", meaning: "Terminal value of equity at the end of year N" },
    ],
    whenToUse: [
      "Banks and other financial institutions",
      "When the analysis centers on returns to shareholders",
      "As a consistency check against WACC and APV",
    ],
    considerations: [
      "Requires an explicit forecast of interest and net borrowing",
      "The cost of equity must be updated if leverage changes",
      "Produces equity value directly, with no net debt bridge needed",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Terminal value methods                                              */
/* ------------------------------------------------------------------ */

export const terminalValueMethods: MethodPage[] = [
  {
    slug: "growing-perpetuity",
    group: "terminal-value",
    short: "Growing Perpetuity",
    title: "Growing Perpetuity Method",
    tagline: "Assume cash flows grow at a constant rate forever after the forecast period.",
    overview: [
      "The growing perpetuity (Gordon growth) method values all cash flows beyond the explicit forecast as a perpetuity growing at a constant rate.",
      "The discount rate must match the cash flow: WACC for unlevered FCF, r_U for APV, and the cost of equity for FCFE.",
    ],
    formulas: [
      {
        label: "Terminal value at year N",
        latex: tex`TV_N = \frac{FCF_{N+1}}{r - g} = \frac{FCF_N\,(1+g)}{r - g}, \qquad g < r`,
      },
      {
        label: "Present value of terminal value",
        latex: tex`PV(TV) = \frac{TV_N}{(1+r)^N}`,
      },
    ],
    terms: [
      { symbol: "FCF_{N+1}", meaning: "Cash flow in the first year after the forecast" },
      { symbol: "r", meaning: "Discount rate consistent with the cash flow definition" },
      { symbol: "g", meaning: "Long-run constant growth rate" },
    ],
    whenToUse: [
      "The business is expected to continue operating indefinitely",
      "Cash flows have reached a steady state by the end of the forecast",
    ],
    considerations: [
      "Long-run growth should not exceed long-run economy growth",
      "Value is very sensitive to the spread between r and g",
      "Terminal value often makes up most of total enterprise value",
    ],
  },
  {
    slug: "liquidation-value",
    group: "terminal-value",
    short: "Liquidation Value",
    title: "Liquidation Value Method",
    tagline: "Value the business at what its assets would realize if sold at the end of the forecast.",
    overview: [
      "The liquidation approach assumes operations stop at the end of the forecast and the assets are sold. Terminal value is the expected net proceeds from those sales.",
      "It provides a conservative floor and fits businesses with a finite life or assets with an active secondary market.",
    ],
    formulas: [
      {
        label: "Terminal value",
        latex: tex`TV_N = \sum_{i} \big(\text{Recovery Rate}_i \times \text{Book Value}_{i,N}\big) - \text{Liquidation Costs}`,
      },
      {
        label: "Present value of terminal value",
        latex: tex`PV(TV) = \frac{TV_N}{(1+r)^N}`,
      },
    ],
    terms: [
      { symbol: "Recovery Rate_i", meaning: "Share of book value realized for asset class i" },
      { symbol: "Book Value_{i,N}", meaning: "Carrying value of asset class i at year N" },
      { symbol: "Liquidation Costs", meaning: "Selling, legal, and wind-down costs" },
    ],
    whenToUse: [
      "Finite-life businesses or projects",
      "Distressed situations or downside scenarios",
      "A conservative floor to compare against going-concern methods",
    ],
    considerations: [
      "Usually understates value for a healthy going concern",
      "Recovery rates vary widely by asset type and market conditions",
      "Taxes on asset sales can reduce net proceeds",
    ],
  },
  {
    slug: "multiples",
    group: "terminal-value",
    short: "Multiples",
    title: "Multiples Method",
    tagline: "Apply a market valuation multiple to a final-year financial metric.",
    overview: [
      "The multiples (exit multiple) method estimates terminal value by applying a valuation multiple, typically EV/EBITDA, to the company's financial metric in the final forecast year.",
      "It ties the terminal value to how the market currently values comparable companies, and is often used alongside the growing perpetuity method.",
    ],
    formulas: [
      {
        label: "Terminal value",
        latex: tex`TV_N = \text{Multiple} \times \text{Metric}_N \qquad \text{e.g. } TV_N = \frac{EV}{EBITDA} \times EBITDA_N`,
      },
      {
        label: "Implied perpetual growth (cross-check)",
        latex: tex`g = \frac{TV_N \times r - FCF_N}{TV_N + FCF_N}`,
        note: "Backs out the growth rate implied by the exit multiple, to check it is reasonable.",
      },
    ],
    terms: [
      { symbol: "Multiple", meaning: "Valuation multiple drawn from comparable companies" },
      { symbol: "Metric_N", meaning: "Financial metric in the final forecast year (e.g. EBITDA)" },
      { symbol: "g", meaning: "Perpetual growth rate implied by the multiple" },
    ],
    whenToUse: [
      "Good comparable companies or transactions exist",
      "A market-based view complements the intrinsic DCF",
    ],
    considerations: [
      "Imports current market conditions into a long-term estimate",
      "Multiples should reflect the company's expected steady-state profile",
      "Check the implied growth rate for consistency",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Section navigation                                                  */
/* ------------------------------------------------------------------ */

export const caseStudies: {
  slug: string;
  short: string;
  kicker: string;
  summary: string;
  status: "In Progress" | "Completed";
  href: string;
}[] = [
  {
    slug: "flash-memory",
    short: "Flash Memory: Investment and Financing",
    kicker: "Capital Budgeting · Financing",
    summary:
      "NPV of a new product line, a comparable-company WACC, and debt versus equity financing under a binding credit limit.",
    status: "Completed",
    href: `${valuationBase}/case-study/flash-memory`,
  },
  {
    slug: "ferrari-ipo",
    short: "Ferrari: The 2015 IPO",
    kicker: "IPO Valuation",
    summary:
      "Pricing Ferrari's IPO with luxury versus auto multiples and a DCF tested under exit-multiple and perpetuity terminal values.",
    status: "Completed",
    href: `${valuationBase}/case-study/ferrari-ipo`,
  },
];

export const valuationNav = [
  {
    label: "Acquisition Framework",
    items: [{ label: "Structure, Tax & Valuation", href: `${valuationBase}/acquisition-framework` }],
  },
  {
    label: "Valuation Frameworks",
    items: frameworks.map((m) => ({
      label: `${m.title} (${m.short})`,
      href: `${valuationBase}/frameworks/${m.slug}`,
    })),
  },
  {
    label: "Terminal Value",
    items: terminalValueMethods.map((m) => ({
      label: m.title,
      href: `${valuationBase}/terminal-value/${m.slug}`,
    })),
  },
  {
    label: "Case Studies",
    items: caseStudies.map((c) => ({ label: c.short, href: c.href })),
  },
];

export function methodHref(m: MethodPage) {
  return `${valuationBase}/${m.group}/${m.slug}`;
}

/** Enterprise value to equity value bridge (shown on the overview page). */
export const equityBridgeLatex = tex`\text{Equity Value} = \text{Enterprise Value} - \text{Debt} + \text{Cash} - \text{Preferred Stock} - \text{Noncontrolling Interest}`;
