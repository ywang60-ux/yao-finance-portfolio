/**
 * Project 02: FP&A Budgeting and Forecasting Model.
 *
 * Built while completing CFI's FP&A Modeling course (Corporate Finance
 * Institute). The CFI model, PDF, and its figures are copyrighted and are NOT
 * reproduced here. Everything below describes the logic in my own words; the
 * interactive calculators use illustrative inputs defined in
 * src/components/fpa/FpaCalculators.tsx.
 */

const tex = String.raw;

export type AnalysisStatus = "Completed" | "In Progress";

export const fpaModeling = {
  title: "FP&A Budgeting and Forecasting Model",
  tagline:
    "A monthly, driver-based budget and forecast for a professional services firm, from headcount and contractor costs through capex, debt, and the three statements.",
  attribution:
    "Built while completing CFI's FP&A Modeling course (Corporate Finance Institute). The model logic is described here in my own words. Figures in the interactive models are illustrative inputs, not taken from the course model.",

  overview: [
    "The model covers 24 months: one year of actuals and one year of forecast, with a switch on each month to load actual or forecast data. Every line is driven by a small set of inputs, so a change in a hire date, a day rate, or a capex plan flows straight through to profit and cash.",
    "Revenue is recognized evenly over each client contract and collected either monthly in arrears or at completion, which drives receivables. Personnel, contractor, and overhead costs build up to gross profit and EBITDA; capex, the credit line, and taxes complete the income statement, cash flow statement, and budget-versus-forecast dashboards.",
  ],
  flow: ["Revenue & receivables", "Headcount", "Contractors", "Capex & depreciation", "Debt & cash", "Tax", "Income statement & cash flow", "Dashboards"],

  analyses: [
    {
      id: "revenue",
      part: "",
      title: "Revenue and Receivables Analysis",
      status: "Completed" as AnalysisStatus,
      question: "When is client revenue earned, and when does it actually arrive as cash?",
      steps: [
        "List each client contract with its total value and duration, and mark the months in which work is performed.",
        "Recognize revenue evenly across the contract: each active month earns the contract value divided by its length.",
        "Apply each client's payment terms: some pay monthly in arrears for the previous month's work, others pay the full amount one month after the work is completed.",
        "Roll receivables forward each month (beginning + revenue − collections = ending). The change in receivables is the gap between profit and cash.",
      ],
      formulas: [
        { label: "Monthly revenue recognized", latex: tex`\text{Revenue}_{c,m} = \frac{\text{Contract value}_c}{\text{Months}_c} \times \mathbf{1}[\,m \text{ is active}\,]` },
        {
          label: "Collections by payment terms",
          latex: tex`\text{Monthly in arrears: } \text{Cash}_{c,m} = \text{Revenue}_{c,m-1} \qquad \text{At completion: } \text{Cash}_{c,m} = \text{Contract value}_c \text{ in the month after the last active month}`,
        },
        {
          label: "Accounts receivable roll-forward",
          latex: tex`\text{AR}_m = \text{AR}_{m-1} + \text{Revenue}_m - \text{Cash}_m \qquad \text{Cash from AR}_m = \text{AR}_{m-1} - \text{AR}_m`,
        },
      ],
    },
    {
      id: "headcount",
      part: "Pt. 3",
      title: "Headcount Analysis",
      status: "Completed" as AnalysisStatus,
      question: "What does each role cost per month, and when does that cost turn into cash?",
      steps: [
        "Schedule each employee by the days they work in the month, so a mid-month hire is charged only for the days on payroll.",
        "Prorate annual salary by scheduled days over the days in the year to get monthly base salary.",
        "Add benefits as a load rate on base salary, and accrue bonus each month as a percentage of base salary.",
        "Pay base salary and benefits in the same month, but pay the year's bonus in December. Until then the accrued bonus sits in an employee payable, which is why expense and cash diverge.",
        "Flag a scheduling issue if anyone is scheduled for more days than the month has.",
      ],
      formulas: [
        { label: "Monthly base salary", latex: tex`\text{Base}_{r,m} = \text{Salary}_r \times \frac{\text{Days scheduled}_{r,m}}{\text{Days in year}}` },
        { label: "Benefits and bonus accrual", latex: tex`\text{Benefits}_{r,m} = \text{Base}_{r,m} \times \text{Load}_r \qquad \text{Bonus}_{r,m} = \text{Base}_{r,m} \times \text{Bonus \%}_r` },
        {
          label: "Employee payable",
          latex: tex`\text{Payable}_m = \text{Payable}_{m-1} + \text{Bonus accrued}_m - \text{Bonus paid}_m`,
          note: "Bonus is paid in December, so the payable builds through the year and clears at year end.",
        },
      ],
    },
    {
      id: "contractors",
      part: "Pt. 4",
      title: "Contractor Analysis",
      status: "Completed" as AnalysisStatus,
      question: "How much flexible capacity is the firm buying, and how does paying in arrears affect cash?",
      steps: [
        "Schedule each contractor by working days in the month, capped by the number of business days.",
        "Multiply scheduled days by each contractor's day rate to get the month's expense.",
        "Pay contractors in the following month for work completed, so each month's expense becomes a payable and is settled one month later.",
        "Flag a scheduling issue if a contractor is booked for more days than there are workdays.",
      ],
      formulas: [
        { label: "Contractor expense", latex: tex`\text{Expense}_{c,m} = \text{Days}_{c,m} \times \text{Day rate}_c, \qquad \text{Days}_{c,m} \le \text{Workdays}_m` },
        { label: "Cash paid one month in arrears", latex: tex`\text{Cash}_m = \text{Expense}_{m-1}` },
        { label: "Contractor payable", latex: tex`\text{Payable}_m = \text{Payable}_{m-1} + \text{Expense}_m - \text{Cash}_m` },
      ],
    },
    {
      id: "debt-capex",
      part: "Pt. 5",
      title: "Debt and Capex Analysis",
      status: "In Progress" as AnalysisStatus,
      question: "Can the firm fund its capital spending from operating cash, and when does it need the credit line?",
      steps: [
        "Tie office capex to headcount: each new employee triggers a fixed capex amount, and planned software spend is added on top.",
        "Roll forward each asset class (beginning balance + capex − depreciation = ending balance) and sum depreciation for the income statement.",
        "Combine beginning cash with cash from operations and investing to find the cash available before financing.",
        "Draw on the revolving credit line when available cash would go negative, and repay it first when cash turns positive.",
        "Charge interest on the credit line, earn interest on positive cash, and flag any month where the balance exceeds the line's limit.",
      ],
      formulas: [
        { label: "Office capex and PP&E roll-forward", latex: tex`\text{Capex}_m = \text{New hires}_m \times \text{Capex per hire} \qquad \text{PP\&E}_m = \text{PP\&E}_{m-1} + \text{Capex}_m - \text{Dep}_m` },
        { label: "Cash available before financing", latex: tex`\text{Available}_m = \text{Cash}_{m-1} + \text{CFO}_m + \text{CFI}_m` },
        {
          label: "Revolver draw / (repayment)",
          latex: tex`\Delta \text{Revolver}_m = \max\left(-\text{Available}_m,\ -\text{Revolver}_{m-1}\right)`,
          note: "Positive when cash is short (draw), negative when there is cash to repay; never repays more than is outstanding. A check flags any month the balance exceeds the limit.",
        },
      ],
    },
    {
      id: "aggregation",
      part: "",
      title: "Financial Statement Aggregation",
      status: "In Progress" as AnalysisStatus,
      question: "How do 24 monthly columns roll up into quarterly and annual statements without distorting the numbers?",
      steps: [
        "Tag every monthly column with its quarter and year, and pull each line into the summary with conditional sums on those tags, so quarterly and annual views update automatically when the monthly model changes.",
        "Sum flow items (revenue, costs, cash flows, capex, and roll-forward additions and reductions) across the months in each period.",
        "Never sum balances: a period's beginning balance is its first month's beginning balance, and its ending balance is its last month's ending balance.",
        "Recalculate ratios such as gross, EBITDA, and net margin from the aggregated totals instead of averaging the monthly ratios.",
        "Convert annual interest rates to the period length, and carry checks forward: track the highest monthly credit-line balance in each period, because a quarter-end balance can hide a breach that happened mid-quarter.",
      ],
      formulas: [
        { label: "Flow items: sum over the period", latex: tex`\text{Flow}_{Q} = \sum_{m \in Q} \text{Flow}_m` },
        {
          label: "Balances: take the endpoints",
          latex: tex`\text{Beginning}_{Q} = \text{Beginning}_{\,\text{first } m \in Q} \qquad \text{Ending}_{Q} = \text{Ending}_{\,\text{last } m \in Q}`,
        },
        {
          label: "Margins: recompute, don't average",
          latex: tex`\text{EBITDA margin}_{Q} = \frac{\sum_{m \in Q} \text{EBITDA}_m}{\sum_{m \in Q} \text{Revenue}_m} \;\neq\; \frac{1}{3}\sum_{m \in Q} \text{EBITDA margin}_m`,
        },
        {
          label: "Limit check: peak within the period",
          latex: tex`\text{Peak revolver}_{Q} = \max_{m \in Q} \text{Revolver}_m \le \text{Limit}`,
        },
      ],
    },
    {
      id: "dashboards",
      part: "",
      title: "Dashboard Visualization",
      status: "In Progress" as AnalysisStatus,
      question: "How can management see, at a glance, whether the year is tracking ahead of budget and last year?",
      steps: [
        "Keep a separate graphing-data block for each chart that only references the model, so chart sources stay apart from the calculations.",
        "Split each metric into an actuals series and a forecast series using the month's actual/forecast flag. Months outside a series return #N/A, so each line simply stops: actuals are drawn solid and the forecast dotted, meeting at the transition month.",
        "Show every metric three ways (by month, by quarter, and by year) so both seasonality and the full-year picture are visible.",
        "Plot the current year against the prior year's actuals and the budget, and derive dependent budget lines from their drivers (for example, budgeted net income = budgeted revenue × budgeted margin).",
        "On the cash chart, show any credit-line balance as negative cash and draw the line's limit, so a breach stands out immediately.",
      ],
      formulas: [
        {
          label: "Actual and forecast series",
          latex: tex`\text{Actual}_m = \begin{cases} \text{Value}_m & \text{if month } m \text{ is actual} \\ \#\text{N/A} & \text{otherwise} \end{cases} \qquad \text{Forecast}_m = \begin{cases} \text{Value}_m & \text{if month } m \text{ is forecast} \\ \#\text{N/A} & \text{otherwise} \end{cases}`,
        },
        {
          label: "Variance to budget",
          latex: tex`\text{Variance}_t = \text{Forecast}_t - \text{Budget}_t \qquad \text{Variance \%}_t = \frac{\text{Forecast}_t - \text{Budget}_t}{\text{Budget}_t}`,
        },
        {
          label: "Net cash position against the credit-line limit",
          latex: tex`\text{Net cash}_m = \text{Cash}_m - \text{Revolver}_m \;\ge\; -\text{Limit}`,
        },
      ],
    },
  ],

  skills: [
    "Driver-based monthly forecasting",
    "Accrual versus cash timing (payables and receivables)",
    "Headcount and capacity planning",
    "Capex planning and depreciation schedules",
    "Revolving credit line mechanics",
    "Model integrity checks",
  ],
};
