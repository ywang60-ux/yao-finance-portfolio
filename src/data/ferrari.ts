/**
 * Ferrari 2015 IPO case study (IPO valuation).
 *
 * Figures come from the class Excel model ("Ferrari Class 2026.xlsx",
 * Corporate Finance, Santa Clara University), rounded for display.
 * Case facts are summarized from the Darden case "Ferrari: The 2015 Initial
 * Public Offering" (UV7259). Do not paste case text or exhibits here.
 *
 * Values marked "derived" are simple calculations from the model's own outputs
 * (terminal value share, implied growth), not separate assumptions.
 */

const tex = String.raw;

export const ferrari = {
  title: "Ferrari: The 2015 IPO",
  tagline:
    "Pricing a luxury icon with no pure-play peers: is Ferrari a carmaker or a luxury brand, and what should the IPO shares sell for?",
  status: "Completed" as const,
  attribution:
    "Figures on this page come from the class model developed in Corporate Finance at Santa Clara University, based on the Darden case Ferrari: The 2015 Initial Public Offering. The summary and commentary are my own.",

  /* 01 Business Problem ---------------------------------------------- */
  context: [
    "In October 2015, Fiat Chrysler (FCA) is preparing to sell 10% of Ferrari in a New York IPO, with a plan to spin off the rest to FCA shareholders. The initial price range is $48–52 per share, and the road show suggests the book is heavily oversubscribed.",
    "The evening before trading begins, FCA and its lead bank must set the offer price: too low leaves money on the table for FCA, too high risks a weak debut and a poor first impression with investors.",
  ],
  constraints: [
    {
      title: "No pure-play comparables",
      text: "Ferrari makes cars but earns luxury-brand margins. Auto peers and luxury-goods peers trade at very different multiples, and the choice drives the answer.",
    },
    {
      title: "Volume versus exclusivity",
      text: "Management plans to grow shipments toward 9,000 cars by 2019, while much of the brand's value rests on keeping supply below demand.",
    },
    {
      title: "Debt pushed onto Ferrari",
      text: "About €2.3 billion of debt sits with Ferrari after the separation, so enterprise value must be bridged to a smaller equity value.",
    },
    {
      title: "Pricing trade-off",
      text: "Strong demand argues for pricing at or above the range; the risk of an overpriced debut argues for restraint.",
    },
  ],
  questions: [
    "What is Ferrari's equity worth per share on fundamentals?",
    "How should that value inform the offer price relative to the $48–52 range?",
  ],

  /* 02 Methodology --------------------------------------------------- */
  methods: [
    {
      title: "Operating forecast (2015–2019)",
      text: "Use the case's base-case forecast: car shipments and revenue per car, engine and brand revenue, segment margins, and working capital and fixed asset turnover, to derive free cash flow.",
    },
    {
      title: "Comparable company multiples",
      text: "Compute EV/EBITDA for auto manufacturers and luxury brands, then value Ferrari on the luxury-brand average applied to 2015 EBITDA.",
    },
    {
      title: "DCF with two terminal values",
      text: "Discount free cash flow at a 5.0% euro cost of capital with a 38% Italian tax rate. Estimate terminal value both with the exit multiple and with a growing perpetuity at 3%.",
    },
    {
      title: "Enterprise value to price per share",
      text: "Bridge enterprise value to equity value, divide by 189 million post-offering shares, and convert to dollars at 1.1375 USD/EUR to compare with the IPO range.",
    },
  ],
  formulas: [
    {
      label: "Free cash flow",
      latex: tex`FCF_t = EBIT_t(1-\tau) + D\&A_t - CapEx_t - \Delta NWC_t \qquad \tau = 38\%`,
      note: "2015 includes only the two months remaining after the October IPO, so 2015 FCF is scaled by 2/12 and each year is discounted with a 2/12-year offset.",
    },
    {
      label: "Terminal value: exit multiple",
      latex: tex`TV_{2019} = \frac{EV}{EBITDA}_{\text{luxury peers}} \times EBITDA_{2019}`,
    },
    {
      label: "Terminal value: growing perpetuity",
      latex: tex`TV_{2019} = \frac{FCF_{2019}(1+g)}{r-g} \qquad r = 5.0\%,\ g = 3.0\%`,
    },
    {
      label: "Price per share",
      latex: tex`P_{\$} = \frac{EV - \text{Debt}}{189\text{M shares}} \times 1.1375\ \tfrac{\$}{€}`,
      note: "The DCF bridge also adds investments and deferred tax assets and subtracts other liabilities (June 2015 balance sheet).",
    },
  ],

  /* 03 Analysis ------------------------------------------------------- */
  multiples: {
    head: ["Peer group", "Companies", "Average EV / EBITDA"],
    rows: [
      ["Luxury brands", "Burberry, Hermès, Prada, Tiffany", "14.1×"],
      ["Auto manufacturers", "BMW, Daimler, Volkswagen", "8.5×"],
    ],
    highlightRow: 0,
  },
  multiplesNote:
    "The model values Ferrari on the luxury-brand average. 2015E EBITDA is €763M (EBIT €447M + D&A €317M).",

  /** Free cash flow forecast, € millions. */
  cashFlows: {
    head: ["€ millions", "2015 (Nov–Dec)", "2016", "2017", "2018", "2019"],
    rows: [
      ["Revenue", "3,027", "3,292", "3,556", "3,844", "4,126"],
      ["EBIT", "447", "508", "567", "624", "669"],
      ["After-tax EBIT", "277", "315", "351", "387", "415"],
      ["+ D&A", "317", "339", "345", "353", "369"],
      ["− CapEx", "(398)", "(404)", "(364)", "(376)", "(416)"],
      ["− Increase in NWC", "(88)", "(54)", "(49)", "(131)", "(128)"],
      ["Free cash flow", "18", "195", "284", "233", "240"],
    ],
    highlightRow: 6,
  },
  cashFlowsNote: "Full-year 2015 cash flow is €107M; only the two post-IPO months (€18M) are counted.",

  valuation: {
    head: ["Method", "Enterprise value", "Equity value", "€ / share", "$ / share"],
    rows: [
      ["EV/EBITDA multiple (14.1× 2015E)", "€10.77B", "€8.51B", "€45.00", "$51.19"],
      ["DCF, exit multiple terminal value", "€12.76B", "€10.49B", "€55.53", "$63.16"],
      ["DCF, growing perpetuity (g = 3%)", "€10.88B", "€8.62B", "€45.59", "$51.86"],
      ["IPO price range", "", "", "", "$48–52"],
    ],
    highlightRow: 3,
  },

  keyFigures: [
    { label: "Value range", value: "$51–63" },
    { label: "IPO range", value: "$48–52" },
    { label: "Terminal value share of DCF", value: "~93%" },
    { label: "Growth implied by 14.1× exit", value: "~3.3%" },
  ],
  keyFiguresNote:
    "The last two figures are derived from the model's outputs: present value of terminal value divided by total DCF value, and the perpetual growth rate that makes the exit-multiple terminal value consistent with 2019 FCF at a 5% discount rate.",

  /* 04 Findings ------------------------------------------------------- */
  findings: [
    "Two of the three methods (the luxury multiple and the DCF with 3% perpetual growth) land at about $51–52 per share, the top of the $48–52 range.",
    "The DCF with an exit multiple gives about $63, roughly 21% above the top of the range, because it assumes Ferrari still trades at a luxury-brand multiple in 2019.",
    "With a 5% cost of capital, terminal value makes up about 93% of DCF value, so the result rests almost entirely on long-run assumptions rather than the five-year forecast.",
    "The gap between the two DCF answers comes from a small difference in assumptions: the 14.1× exit multiple implies about 3.3% perpetual growth versus the 3.0% assumed, a 0.3-point change that moves the price by about $11.",
    "The peer choice matters even more: auto manufacturers average about 8.5× EBITDA versus 14.1× for luxury brands. Valuing Ferrari as a luxury brand is what supports a price near the top of the range.",
  ],

  /* 05 Business Implications ----------------------------------------- */
  implications: [
    "Fundamentals support pricing at the top of the range. Going well above it depends on investors accepting a luxury multiple that holds up over the long run.",
    "Because terminal value dominates, FCA's pricing decision is really a judgment about whether Ferrari can grow volume without diluting the exclusivity behind its luxury valuation.",
    "With heavy oversubscription, pricing at the top of the range captures most of the value supported by the base case, while leaving some upside for first-day investors.",
  ],
};
