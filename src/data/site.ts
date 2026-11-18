/**
 * Site-wide content and settings.
 * Edit this file to change your name, intro text, interests, and contact links.
 */

export const site = {
  name: "YAO",
  fullTitle: "Yao | Financial Project Portfolio",
  description:
    "Financial project portfolio of Yao, MS in Financial Analytics candidate at Santa Clara University. FP&A, strategic finance, financial modeling, and financial analytics.",
  intro:
    "Hi, welcome to my financial project portfolio. I am Yao, an MS in Financial Analytics candidate at Santa Clara University.",
  philosophy: "Discipline in Finance, Endurance in Life.",
  program: "MS in Financial Analytics",
  school: "Santa Clara University",
};

export const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Contact", href: "/#contact" },
];

export const interests = [
  {
    title: "FP&A",
    description:
      "Forecasting, budgeting, and performance reporting that connect operating plans to financial outcomes.",
  },
  {
    title: "Strategic Finance",
    description:
      "Using financial analysis to support capital allocation, growth decisions, and long-term planning.",
  },
  {
    title: "Financial Modeling",
    description:
      "Building structured, transparent models for valuation, forecasting, and scenario analysis.",
  },
  {
    title: "Financial Analytics",
    description:
      "Applying data tools such as SQL, Python, and BI dashboards to turn financial data into insight.",
  },
];

/**
 * Contact links. Fill in the values you want to show.
 * Any entry with an empty `href` is hidden on the site.
 * Examples:
 *   email:    "mailto:you@example.com"
 *   linkedin: "https://www.linkedin.com/in/your-profile"
 *   github:   "https://github.com/your-username"
 */
export const contactLinks: { label: string; value: string; href: string }[] = [
  { label: "Email", value: "", href: "" },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/yao-wang-fa-scu",
    href: "https://www.linkedin.com/in/yao-wang-fa-scu",
  },
  { label: "GitHub", value: "", href: "" },
];
