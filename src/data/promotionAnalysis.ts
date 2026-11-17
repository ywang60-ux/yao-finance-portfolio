/**
 * Project 03: Multinational Promotion Analysis (Power BI).
 *
 * Group project from the UW Data Analytics Certificate Program. Built on
 * Microsoft's public Contoso retail sample data. The interactive dashboard reads
 * public/data/promotion-dashboard.json, produced by
 * scripts/aggregate_promotion_pbix.py from the original .pbix file.
 *
 * Findings below were computed from that data using the group's DAX measure
 * definitions (all filters cleared unless stated).
 */

const tex = String.raw;

export const promotionAnalysis = {
  title: "Multinational Promotion Analysis",
  tagline:
    "Which retail promotions actually lift sales, and does the answer change by region, product, or year?",
  attribution:
    "Group project, UW Data Analytics Certificate Program. Originally built in Power BI on Microsoft's public Contoso retail sample data. The dashboard below is a web rebuild of that report, using the same data model and DAX measure logic.",

  /* 01 Business Problem ---------------------------------------------- */
  context: [
    "A multinational electronics retailer runs seasonal promotions (spring, summer, back-to-school, and holiday) across North America, Europe, and Asia, with discounts from 5% to 20%. Management wants to know which promotions earn their discount.",
    "The question is not only whether promotions sell more, but where: a promotion that underperforms overall may still work in a specific region or product category.",
  ],
  questions: [
    "How does each promotion compare with full-price (No Discount) sales on average daily units sold?",
    "How do returns, cost of goods, and net profit differ across promotions?",
    "Do the results change by continent, country, product category, year, or workday versus weekend?",
  ],

  /* 02 Methodology --------------------------------------------------- */
  methods: [
    {
      title: "Star schema data model",
      text: "A Fact Sales table of about 3.4 million transactions joined to Date, Geography, Product, Promotion, Store, and Channel dimensions, with hierarchies for continent → country → state and category → subcategory.",
    },
    {
      title: "DAX measures",
      text: "Base measures for quantities, amounts, cost, and net profit, plus ratio measures for average daily units and return rate, and a comparison of each promotion against the No Discount baseline.",
    },
    {
      title: "Interactive report",
      text: "A summary page with KPI cards, slicers, and promotion comparisons, and a drill-through page that breaks a selected promotion out by product category.",
    },
    {
      title: "Web rebuild",
      text: "For this site, the model was aggregated with Python into a compact dataset, and the same measures are recalculated in the browser whenever a filter changes.",
    },
  ],
  formulas: [
    {
      label: "Net profit",
      latex: tex`\text{Net Profit} = \text{Sales Amount} - (\text{Return Amount} + \text{Cost of Goods})`,
    },
    {
      label: "Average daily units sold",
      latex: tex`\text{Avg Sales Qty per Day} = \frac{\sum \text{Sales Quantity}}{\#\ \text{days in the selected period}}`,
    },
    {
      label: "Return rate",
      latex: tex`\text{Return Rate} = \frac{\sum \text{Return Quantity}}{\sum \text{Sales Quantity}}`,
    },
    {
      label: "Promotion versus baseline",
      latex: tex`\Delta = \text{Avg Sales Qty per Day}_{\text{promotion}} - \text{Avg Sales Qty per Day}_{\text{No Discount}}`,
      note: "The baseline is recalculated under the same filters (region, product, year, day type), so each promotion is compared like for like.",
    },
  ],
  metricNote:
    "Note on the metric: average daily units divides by every day in the selected period, not only the days a promotion was running. It therefore compares total volume over the period, which favors the year-round No Discount baseline over promotions that run 60–120 days a year.",

  /* 04 Findings ------------------------------------------------------- */
  findings: [
    "Across all regions, none of the nine promotions reaches the No Discount baseline of about 15,800 units per day. North America Back-to-School comes closest at about 7,500.",
    "Filtering to Europe changes the picture: European Holiday and European Spring both sell more per day than full-price sales in that region.",
    "North American promotions generate the most net profit among promotions (about $0.8–1.1 billion each over 2007–2009), reflecting the region's larger sales base.",
    "Return rates stay low everywhere, between about 0.7% and 1.2% of units sold (0.93% overall), so returns are not what separates good promotions from weak ones.",
  ],

  /* 05 Business Implications ----------------------------------------- */
  implications: [
    "Evaluate promotions region by region rather than globally; a promotion that looks weak in aggregate can still outperform locally.",
    "Measure promotions over the days they actually run (or against a matched period) before cutting them, since a full-period average understates short campaigns.",
    "Focus promotion budgets on combinations of region, season, and category where the drill-down shows a lift over the baseline.",
  ],
};
