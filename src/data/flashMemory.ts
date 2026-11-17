/**
 * Flash Memory, Inc. case study (capital budgeting and financing).
 *
 * All figures come from the class Excel model ("Flash Class 2026-2.xlsx",
 * Corporate Finance, Santa Clara University), rounded for display.
 * Case facts are summarized from the HBS brief case "Flash Memory, Inc." (4230).
 * Do not paste case text or exhibits here: the case is copyrighted.
 */

const tex = String.raw;

export const flashMemory = {
  title: "Flash Memory, Inc.",
  tagline:
    "Should a cash-constrained memory maker launch a new product line, and how should it pay for growth when the bank line is already maxed out?",
  status: "Completed" as const,
  attribution:
    "Figures on this page come from the class model developed in Corporate Finance at Santa Clara University, based on the Harvard Business School brief case Flash Memory, Inc. (2010). The summary and commentary are my own.",

  /* 01 Business Problem ---------------------------------------------- */
  context: [
    "Flash Memory is a small, founder-owned maker of solid-state drives and memory modules in a fast-growing but fiercely competitive market. Short product life cycles and thin margins mean growth constantly ties up more cash in receivables and inventory.",
    "In 2010 the CFO has to set the company's three-year investing and financing plan while weighing a promising new product line.",
  ],
  constraints: [
    {
      title: "Working capital outgrowing sales",
      text: "Current assets grew faster than sales from 2007 to 2009 (about 12% versus 8% a year), so growth consumed more cash than it generated.",
    },
    {
      title: "Bank line at its limit",
      text: "The bank lends up to 70% of receivables, and Flash's notes payable had already reached that cap.",
    },
    {
      title: "Costlier fallback debt",
      text: "The bank's factoring group would lend up to 90% of receivables, but at prime + 6% instead of prime + 4% and with closer monitoring.",
    },
    {
      title: "Board leverage target",
      text: "The board considers an 18% debt-to-capital ratio appropriate, well below where the company was operating.",
    },
    {
      title: "Internal funds fall short",
      text: "Low margins mean retained earnings alone cannot fund planned growth without slowing it down.",
    },
  ],
  questions: [
    "Does the new product line create value for shareholders?",
    "Should growth and the project be financed with more debt (factoring) or with a private sale of new equity?",
  ],

  /* 02 Methodology --------------------------------------------------- */
  methods: [
    {
      title: "Three-statement forecast (2010–2012)",
      text: "Forecast income statement and balance sheet from percent-of-sales and days-based drivers, with notes payable as the balancing item. Interest is charged on the beginning-of-year balance, and the rate steps up from 7.25% to 9.25% whenever notes exceed 70% of receivables.",
    },
    {
      title: "Cost of capital from comparable companies",
      text: "Estimate each competitor's cost of equity with CAPM, unlever it to an asset return, average the three, then relever to Flash's 18% target debt ratio to get its WACC.",
    },
    {
      title: "Project NPV and IRR",
      text: "Discount the new product line's incremental free cash flows (2010–2015) at the WACC. The $400K already spent on development is treated as sunk; the one-time $300K launch campaign is included; there is no terminal value because the product is obsolete after 2015.",
    },
    {
      title: "Financing scenario comparison",
      text: "Combine the base business and the project into three scenarios (no investment, invest with debt, invest with equity) and compare credit capacity, leverage, EPS, ROE, and interest coverage.",
    },
  ],
  formulas: [
    {
      label: "Cost of equity (CAPM)",
      latex: tex`r_E = r_f + \beta\,(\text{MRP}) \qquad r_f = 3.70\%,\ \text{MRP} = 6\%`,
    },
    {
      label: "Unlever comparables to an asset return",
      latex: tex`r_A = r_E\left(1-\frac{D}{V}\right) + r_D\,\frac{D}{V}`,
    },
    {
      label: "Relever to Flash's target structure",
      latex: tex`r_E^{Flash} = \frac{\bar r_A - \frac{D}{V}\, r_D}{1-\frac{D}{V}}, \qquad \frac{D}{V} = 18\%`,
    },
    {
      label: "WACC",
      latex: tex`r_{WACC} = \frac{D}{V}\, r_D\,(1-\tau) + \frac{E}{V}\, r_E \qquad r_D = 9.25\%,\ \tau = 40\%`,
    },
    {
      label: "Project free cash flow",
      latex: tex`FCF_t = EBIT_t(1-\tau) + \text{Depreciation}_t - \Delta NWC_t - CapEx_t`,
      note: "Net working capital is 26.15% of the product line's sales; equipment of $2.2M is depreciated straight-line over five years.",
    },
  ],

  /* 03 Analysis ------------------------------------------------------- */
  /** Cost of capital build ($ figures not needed; rates only). */
  costOfCapital: {
    head: ["Company", "Beta", "Rating", "Cost of equity", "Cost of debt", "Debt / value", "Asset return"],
    rows: [
      ["Micron Technology", "1.25", "BBB", "11.20%", "6.24%", "25.8%", "9.92%"],
      ["SanDisk", "1.36", "A", "11.86%", "4.72%", "9.6%", "11.17%"],
      ["STEC", "1.00", "AA", "9.70%", "4.40%", "0.0%", "9.70%"],
      ["Average asset return", "", "", "", "", "", "10.26%"],
      ["Flash (relevered)", "", "", "10.49%", "9.25%", "18.0% target", "WACC 9.60%"],
    ],
    highlightRow: 4,
  },

  /** New product line, $ thousands. */
  projectCashFlows: {
    head: ["$ thousands", "2010", "2011", "2012", "2013", "2014", "2015"],
    rows: [
      ["Sales", "–", "21,600", "28,000", "28,000", "11,000", "5,000"],
      ["EBIT", "–", "2,430", "3,539", "3,539", "1,390", "632"],
      ["After-tax EBIT", "–", "1,458", "2,124", "2,124", "834", "379"],
      ["+ Depreciation", "–", "440", "440", "440", "440", "440"],
      ["− Change in NWC / initial NWC", "(5,648)", "(1,674)", "0", "4,446", "1,569", "1,308"],
      ["− Capital expenditure", "(2,200)", "–", "–", "–", "–", "–"],
      ["Free cash flow", "(7,848)", "225", "2,564", "7,009", "2,843", "2,127"],
    ],
    highlightRow: 6,
  },

  projectValue: [
    { label: "PV of future cash flows", value: "$10.41M" },
    { label: "PV of initial investment", value: "$7.44M" },
    { label: "NPV", value: "$2.97M" },
    { label: "IRR", value: "21.9%" },
  ],
  projectValueNote:
    "Discounted at the 9.60% WACC. Cash flows are timed from May 2010, so each year is discounted with a 7/12-year offset.",

  /** Financing scenarios, from the three forecast sheets. */
  scenarios: {
    head: ["Scenario", "Notes / AR 2010", "Notes / AR 2011", "Debt / capital 2011", "EPS 2011", "ROE 2011", "Interest coverage 2011"],
    rows: [
      ["No new investment", "72.5%", "71.5%", "38.5%", "$2.66", "14.7%", "6.0×"],
      ["Invest, finance with debt", "112.3%", "88.8%", "47.1%", "$3.34", "17.8%", "5.1×"],
      ["Invest, sell 300K shares (~$6.9M net)", "77.3%", "64.2%", "34.1%", "$3.10", "15.9%", "9.4×"],
    ],
  },
  scenariosNote:
    "Bank limit: 70% of receivables (factoring limit 90%). Board target debt-to-capital: 18%. Equity issue assumes 300,000 shares at $25, about $23 per share net of fees.",

  /* 04 Findings ------------------------------------------------------- */
  findings: [
    "The new product line creates value: at a 9.60% WACC its NPV is about $2.97 million, and its 21.9% IRR is well above the cost of capital.",
    "Even without the project, Flash breaches the bank's 70%-of-receivables limit in 2010 and 2011, so standing still does not solve the financing problem.",
    "Funding the project with debt gives the highest EPS and ROE, but pushes notes to about 112% of receivables in 2010, beyond even the factoring group's 90% limit, and lifts debt to roughly 47–49% of capital.",
    "Selling 300,000 new shares dilutes EPS relative to the debt plan, but EPS is still higher than with no investment. Notes are about 77% of receivables in 2010 (within the 90% factoring limit) and fall back under the bank's 70% limit by 2011, which also brings the interest rate back down to 7.25%. Interest coverage in 2011 is 9.4× versus 5.1× under the debt plan.",
  ],

  /* 05 Business Implications ----------------------------------------- */
  implications: [
    "Accept the project and fund it with the private equity placement: of the options modeled, it is the only one that captures the project's value while keeping borrowing within the factoring group's 90% limit, and it returns notes to under the bank's 70% limit by 2011.",
    "Leverage remains above the board's 18% target even with the equity issue, so working-capital discipline (collections and inventory turns) matters as much as the financing choice.",
    "For a fast-growing, thin-margin company, growth itself is a financing problem: profitable investments can be blocked by liquidity, not by value.",
  ],
};
