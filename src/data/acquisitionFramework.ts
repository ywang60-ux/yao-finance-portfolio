/**
 * Acquisition Framework (M&A Valuation, section 1).
 * Text as written by Yao; layout only.
 */

export const acquisitionFramework = {
  title: "Acquisition Framework",
  tagline:
    "How the structure of an acquisition determines what is acquired, which liabilities come along, and how the deal is taxed and valued.",
  intro:
    "An acquisition is the process through which an acquiring company obtains control of another business or its assets. The transaction structure determines what is acquired, which liabilities are assumed, and how the transaction is treated for tax and valuation purposes.",

  methods: [
    {
      title: "Asset Purchase",
      points: [
        "The buyer acquires selected assets and may assume specified liabilities.",
        "The target's legal entity may continue to exist.",
        "May provide an opportunity for a tax basis step-up, subject to the transaction structure and applicable tax rules.",
      ],
    },
    {
      title: "Stock Purchase",
      points: [
        "The buyer acquires the target company's shares.",
        "The target generally remains a separate legal entity.",
        "Its existing assets, liabilities, and contractual relationships generally remain within the target.",
        "Typically does not provide an automatic step-up in the tax basis of the target's assets.",
      ],
    },
  ],

  structures: {
    direct: "The acquiring company purchases the target's assets or shares directly.",
    subsidiary: "The buyer establishes a separate subsidiary to execute the acquisition.",
    triangular: [
      { title: "Forward Triangular Merger", text: "The target merges into the acquisition subsidiary.", survivor: "sub" as const },
      { title: "Reverse Triangular Merger", text: "The acquisition subsidiary merges into the target, and the target survives.", survivor: "target" as const },
    ],
    note: "The use of an acquisition subsidiary does not, by itself, eliminate tax liabilities. Tax treatment depends on the transaction structure and applicable requirements.",
  },

  tax: {
    rows: [
      ["Taxable Asset Purchase", "Potential tax basis step-up for acquired assets"],
      ["Taxable Stock Purchase", "Shareholders generally recognize taxable gains; target's asset basis usually remains unchanged"],
      ["Tax-Free Reorganization (§368)", "Potential tax deferral if statutory requirements are satisfied"],
      ["Stock Purchase with §338 Election", "Certain qualifying stock acquisitions may be treated as asset acquisitions for tax purposes"],
    ],
    note: "Tax-free generally means tax-deferred, not permanently tax-exempt.",
  },

  valuation: [
    { title: "Tax Shield", text: "Additional depreciation or amortization deductions may reduce future taxes." },
    { title: "Goodwill", text: "The purchase price allocation determines the amount of goodwill recognized." },
    { title: "Liabilities", text: "Debt, contingent liabilities, and other obligations affect the economics of the deal." },
    { title: "NOLs", text: "The availability and use of net operating losses may be subject to limitations." },
    { title: "After-Tax Cash Flow", text: "Tax consequences should be reflected in projected free cash flows and deal valuation." },
  ],

  takeaway:
    "The acquisition structure is not merely a legal decision. It directly affects tax consequences, assumed liabilities, future cash flows, and ultimately the value of the transaction.",
};
