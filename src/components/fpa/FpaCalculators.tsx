"use client";

/**
 * Interactive mini models for the FP&A project page.
 * All default inputs are illustrative (my own), not taken from the CFI course model.
 */

import { useMemo, useState } from "react";

const YEAR = 2025; // illustrative calendar year (non-leap)
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS_IN_MONTH = MONTHS.map((_, m) => new Date(YEAR, m + 1, 0).getDate());
const DAYS_IN_YEAR = DAYS_IN_MONTH.reduce((a, b) => a + b, 0);
const WORKDAYS = MONTHS.map((_, m) => {
  let n = 0;
  for (let d = 1; d <= DAYS_IN_MONTH[m]; d++) {
    const wd = new Date(YEAR, m, d).getDay();
    if (wd !== 0 && wd !== 6) n++;
  }
  return n;
});

const k = (v: number) => `$${(v / 1000).toLocaleString("en-US", { maximumFractionDigits: 1, minimumFractionDigits: 1 })}K`;
const kRound = (v: number) => `$${Math.round(v / 1000).toLocaleString("en-US")}K`;

/* ------------------------------------------------------------------ */
/* Revenue and receivables                                             */
/* ------------------------------------------------------------------ */

type Terms = "monthly" | "completion";
type Contract = { id: number; client: string; value: number; start: number; months: number; terms: Terms };

const defaultContracts: Contract[] = [
  { id: 1, client: "Client A", value: 1200000, start: 0, months: 6, terms: "monthly" },
  { id: 2, client: "Client B", value: 900000, start: 2, months: 3, terms: "completion" },
  { id: 3, client: "Client C", value: 2400000, start: 4, months: 12, terms: "monthly" },
  { id: 4, client: "Client D", value: 600000, start: 8, months: 3, terms: "completion" },
];

export function RevenueModel() {
  const [contracts, setContracts] = useState<Contract[]>(defaultContracts);
  const [nextId, setNextId] = useState(10);

  const out = useMemo(() => {
    const revenue = Array(12).fill(0);
    const cash = Array(12).fill(0);
    for (const c of contracts) {
      const months = Math.max(1, c.months);
      const perMonth = c.value / months;
      const last = c.start + months - 1;
      for (let m = c.start; m <= Math.min(last, 11); m++) revenue[m] += perMonth;
      if (c.terms === "monthly") {
        // Paid in arrears for the previous month's work.
        for (let m = c.start + 1; m <= Math.min(last + 1, 11); m++) cash[m] += perMonth;
      } else if (last + 1 <= 11) {
        // Paid in full the month after the work is complete.
        cash[last + 1] += c.value;
      }
    }
    const ar: number[] = [];
    let bal = 0;
    for (let m = 0; m < 12; m++) {
      bal += revenue[m] - cash[m];
      ar.push(bal);
    }
    const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
    return { revenue, cash, ar, total: sum(revenue), collected: sum(cash), peakAr: Math.max(0, ...ar) };
  }, [contracts]);

  const update = (id: number, patch: Partial<Contract>) => setContracts((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <ModelFrame
      inputs={
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="text-[0.65rem] tracking-[0.14em] text-brass uppercase">
                <th className="pb-2 font-medium">Client</th>
                <th className="pb-2 font-medium">Contract value ($)</th>
                <th className="pb-2 font-medium">Start</th>
                <th className="pb-2 font-medium">Months</th>
                <th className="pb-2 font-medium">Payment terms</th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody>
              {contracts.map((c) => (
                <tr key={c.id}>
                  <td className="py-1 pr-2">
                    <TextInput value={c.client} onChange={(v) => update(c.id, { client: v })} label="Client name" />
                  </td>
                  <td className="py-1 pr-2">
                    <NumInput value={c.value} step={50000} min={0} onChange={(v) => update(c.id, { value: v })} label={`${c.client} contract value`} />
                  </td>
                  <td className="py-1 pr-2">
                    <select
                      aria-label={`${c.client} start month`}
                      value={c.start}
                      onChange={(e) => update(c.id, { start: Number(e.target.value) })}
                      className="h-9 w-full border border-sand-200 bg-ivory px-2 text-sm text-navy-900 focus:border-navy-700 focus:outline-none"
                    >
                      {MONTHS.map((mo, i) => (
                        <option key={mo} value={i}>
                          {mo}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-1 pr-2">
                    <NumInput value={c.months} step={1} min={1} max={24} onChange={(v) => update(c.id, { months: Math.round(v) })} label={`${c.client} contract length in months`} />
                  </td>
                  <td className="py-1 pr-2">
                    <select
                      aria-label={`${c.client} payment terms`}
                      value={c.terms}
                      onChange={(e) => update(c.id, { terms: e.target.value as Terms })}
                      className="h-9 w-full border border-sand-200 bg-ivory px-2 text-sm text-navy-900 focus:border-navy-700 focus:outline-none"
                    >
                      <option value="monthly">Monthly in arrears</option>
                      <option value="completion">At completion</option>
                    </select>
                  </td>
                  <td className="py-1 text-right">
                    <button
                      type="button"
                      onClick={() => setContracts((rs) => rs.filter((x) => x.id !== c.id))}
                      disabled={contracts.length <= 1}
                      className="px-2 text-xs text-stone-600 hover:text-navy-900 disabled:opacity-30"
                      aria-label={`Remove ${c.client}`}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 flex gap-4">
            <button
              type="button"
              disabled={contracts.length >= 8}
              onClick={() => {
                setContracts((rs) => [...rs, { id: nextId, client: "New client", value: 500000, start: 0, months: 4, terms: "monthly" }]);
                setNextId((n) => n + 1);
              }}
              className="text-sm text-navy-800 underline-offset-4 hover:underline disabled:text-sand-400"
            >
              + Add contract
            </button>
            <button type="button" onClick={() => setContracts(defaultContracts)} className="text-sm text-stone-600 underline-offset-4 hover:underline">
              Reset inputs
            </button>
          </div>
        </div>
      }
      kpis={[
        { label: "Revenue recognized", value: kRound(out.total) },
        { label: "Cash collected", value: kRound(out.collected) },
        { label: "Year-end receivables", value: kRound(out.ar[11]) },
        { label: "Peak receivables", value: kRound(out.peakAr) },
      ]}
      chartTitle="Monthly revenue recognized vs. cash collected"
      chart={<GroupedBars a={out.revenue} b={out.cash} aLabel="Revenue (recognized)" bLabel="Cash collected" />}
      table={
        <SimpleTable
          rows={[
            ["Revenue", ...out.revenue.map(k)],
            ["Cash collected", ...out.cash.map(k)],
            ["Receivables (end)", ...out.ar.map(k)],
          ]}
        />
      }
      note="Revenue is spread evenly over each contract. Monthly clients pay the following month; at-completion clients pay in full the month after work ends. Opening receivables are assumed to be zero, and contracts running past December leave a receivable at year end."
    />
  );
}

/* ------------------------------------------------------------------ */
/* Headcount                                                           */
/* ------------------------------------------------------------------ */

type Role = { id: number; role: string; salary: number; benefits: number; bonus: number; start: number };

const defaultRoles: Role[] = [
  { id: 1, role: "Director", salary: 180000, benefits: 25, bonus: 20, start: 0 },
  { id: 2, role: "Manager", salary: 120000, benefits: 25, bonus: 15, start: 0 },
  { id: 3, role: "Senior Analyst", salary: 95000, benefits: 20, bonus: 12, start: 0 },
  { id: 4, role: "Analyst (new hire)", salary: 85000, benefits: 20, bonus: 10, start: 6 },
];

export function HeadcountModel() {
  const [roles, setRoles] = useState<Role[]>(defaultRoles);
  const [nextId, setNextId] = useState(10);

  const out = useMemo(() => {
    const expense = Array(12).fill(0);
    const cash = Array(12).fill(0);
    const payable = Array(12).fill(0);
    const headcount = Array(12).fill(0);
    let accruedYear = 0;
    let bal = 0;
    for (let m = 0; m < 12; m++) {
      let bonusAccrued = 0;
      for (const r of roles) {
        if (m < r.start) continue;
        headcount[m]++;
        const base = (r.salary * DAYS_IN_MONTH[m]) / DAYS_IN_YEAR;
        const ben = base * (r.benefits / 100);
        const bon = base * (r.bonus / 100);
        expense[m] += base + ben + bon;
        cash[m] += base + ben;
        bonusAccrued += bon;
      }
      accruedYear += bonusAccrued;
      bal += bonusAccrued;
      if (m === 11) {
        cash[m] += accruedYear; // bonus paid in December
        bal -= accruedYear;
      }
      payable[m] = bal;
    }
    const total = expense.reduce((a, b) => a + b, 0);
    return { expense, cash, payable, headcount, total, peakPayable: Math.max(...payable) };
  }, [roles]);

  const update = (id: number, patch: Partial<Role>) => setRoles((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <ModelFrame
      inputs={
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead>
              <tr className="text-[0.65rem] tracking-[0.14em] text-brass uppercase">
                <th className="pb-2 font-medium">Role</th>
                <th className="pb-2 font-medium">Annual salary ($)</th>
                <th className="pb-2 font-medium">Benefits load %</th>
                <th className="pb-2 font-medium">Bonus %</th>
                <th className="pb-2 font-medium">Start month</th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r.id}>
                  <td className="py-1 pr-2">
                    <TextInput value={r.role} onChange={(v) => update(r.id, { role: v })} label="Role name" />
                  </td>
                  <td className="py-1 pr-2">
                    <NumInput value={r.salary} step={5000} min={0} onChange={(v) => update(r.id, { salary: v })} label={`${r.role} annual salary`} />
                  </td>
                  <td className="py-1 pr-2">
                    <NumInput value={r.benefits} step={1} min={0} max={100} onChange={(v) => update(r.id, { benefits: v })} label={`${r.role} benefits load`} />
                  </td>
                  <td className="py-1 pr-2">
                    <NumInput value={r.bonus} step={1} min={0} max={100} onChange={(v) => update(r.id, { bonus: v })} label={`${r.role} bonus percent`} />
                  </td>
                  <td className="py-1 pr-2">
                    <select
                      aria-label={`${r.role} start month`}
                      value={r.start}
                      onChange={(e) => update(r.id, { start: Number(e.target.value) })}
                      className="h-9 w-full border border-sand-200 bg-ivory px-2 text-sm text-navy-900 focus:border-navy-700 focus:outline-none"
                    >
                      {MONTHS.map((mo, i) => (
                        <option key={mo} value={i}>
                          {mo}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-1 text-right">
                    <button
                      type="button"
                      onClick={() => setRoles((rs) => rs.filter((x) => x.id !== r.id))}
                      disabled={roles.length <= 1}
                      className="px-2 text-xs text-stone-600 hover:text-navy-900 disabled:opacity-30"
                      aria-label={`Remove ${r.role}`}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 flex gap-4">
            <button
              type="button"
              disabled={roles.length >= 8}
              onClick={() => {
                setRoles((rs) => [...rs, { id: nextId, role: "New role", salary: 90000, benefits: 20, bonus: 10, start: 0 }]);
                setNextId((n) => n + 1);
              }}
              className="text-sm text-navy-800 underline-offset-4 hover:underline disabled:text-sand-400"
            >
              + Add role
            </button>
            <button type="button" onClick={() => setRoles(defaultRoles)} className="text-sm text-stone-600 underline-offset-4 hover:underline">
              Reset inputs
            </button>
          </div>
        </div>
      }
      kpis={[
        { label: "Annual personnel cost", value: kRound(out.total) },
        { label: "Year-end headcount", value: String(out.headcount[11]) },
        { label: "Peak bonus payable", value: kRound(out.peakPayable) },
        { label: "December cash out", value: kRound(out.cash[11]) },
      ]}
      chartTitle="Monthly personnel expense vs. cash paid"
      chart={<GroupedBars a={out.expense} b={out.cash} aLabel="Expense (accrued)" bLabel="Cash paid" />}
      table={
        <SimpleTable
          rows={[
            ["Headcount", ...out.headcount.map(String)],
            ["Expense", ...out.expense.map(k)],
            ["Cash paid", ...out.cash.map(k)],
            ["Bonus payable (end)", ...out.payable.map(k)],
          ]}
        />
      }
      note="Base salary and benefits are paid in the month; the year's bonus is paid in December, so the bonus payable builds and then clears."
    />
  );
}

/* ------------------------------------------------------------------ */
/* Contractors                                                         */
/* ------------------------------------------------------------------ */

type Contractor = { id: number; role: string; rate: number; days: number; from: number; to: number };

const defaultContractors: Contractor[] = [
  { id: 1, role: "Strategy consultant", rate: 900, days: 8, from: 0, to: 11 },
  { id: 2, role: "Business analyst", rate: 450, days: 20, from: 2, to: 8 },
  { id: 3, role: "Marketing specialist", rate: 700, days: 10, from: 5, to: 11 },
];

export function ContractorModel() {
  const [cs, setCs] = useState<Contractor[]>(defaultContractors);
  const [nextId, setNextId] = useState(10);

  const out = useMemo(() => {
    const expense = Array(12).fill(0);
    const issues: string[] = [];
    for (let m = 0; m < 12; m++) {
      for (const c of cs) {
        if (m < c.from || m > c.to) continue;
        if (c.days > WORKDAYS[m]) issues.push(`${c.role} in ${MONTHS[m]}`);
        expense[m] += Math.min(c.days, WORKDAYS[m]) * c.rate;
      }
    }
    // Paid one month in arrears; opening payable assumed zero.
    const cash = expense.map((_, m) => (m === 0 ? 0 : expense[m - 1]));
    const payable = expense; // each month's expense is outstanding at month end
    const total = expense.reduce((a, b) => a + b, 0);
    return { expense, cash, payable, total, paid: cash.reduce((a, b) => a + b, 0), issues };
  }, [cs]);

  const update = (id: number, patch: Partial<Contractor>) => setCs((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <ModelFrame
      inputs={
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead>
              <tr className="text-[0.65rem] tracking-[0.14em] text-brass uppercase">
                <th className="pb-2 font-medium">Contractor</th>
                <th className="pb-2 font-medium">Day rate ($)</th>
                <th className="pb-2 font-medium">Days / month</th>
                <th className="pb-2 font-medium">From</th>
                <th className="pb-2 font-medium">To</th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody>
              {cs.map((c) => (
                <tr key={c.id}>
                  <td className="py-1 pr-2">
                    <TextInput value={c.role} onChange={(v) => update(c.id, { role: v })} label="Contractor name" />
                  </td>
                  <td className="py-1 pr-2">
                    <NumInput value={c.rate} step={25} min={0} onChange={(v) => update(c.id, { rate: v })} label={`${c.role} day rate`} />
                  </td>
                  <td className="py-1 pr-2">
                    <NumInput value={c.days} step={1} min={0} max={31} onChange={(v) => update(c.id, { days: v })} label={`${c.role} days per month`} />
                  </td>
                  {(["from", "to"] as const).map((f) => (
                    <td key={f} className="py-1 pr-2">
                      <select
                        aria-label={`${c.role} ${f} month`}
                        value={c[f]}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          update(c.id, f === "from" ? { from: v, to: Math.max(v, c.to) } : { to: v, from: Math.min(v, c.from) });
                        }}
                        className="h-9 w-full border border-sand-200 bg-ivory px-2 text-sm text-navy-900 focus:border-navy-700 focus:outline-none"
                      >
                        {MONTHS.map((mo, i) => (
                          <option key={mo} value={i}>
                            {mo}
                          </option>
                        ))}
                      </select>
                    </td>
                  ))}
                  <td className="py-1 text-right">
                    <button
                      type="button"
                      onClick={() => setCs((rs) => rs.filter((x) => x.id !== c.id))}
                      disabled={cs.length <= 1}
                      className="px-2 text-xs text-stone-600 hover:text-navy-900 disabled:opacity-30"
                      aria-label={`Remove ${c.role}`}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 flex gap-4">
            <button
              type="button"
              disabled={cs.length >= 8}
              onClick={() => {
                setCs((rs) => [...rs, { id: nextId, role: "New contractor", rate: 500, days: 10, from: 0, to: 11 }]);
                setNextId((n) => n + 1);
              }}
              className="text-sm text-navy-800 underline-offset-4 hover:underline disabled:text-sand-400"
            >
              + Add contractor
            </button>
            <button type="button" onClick={() => setCs(defaultContractors)} className="text-sm text-stone-600 underline-offset-4 hover:underline">
              Reset inputs
            </button>
          </div>
          {out.issues.length > 0 && (
            <p role="status" className="mt-3 border-l-2 border-chart-down bg-sand-50 px-3 py-2 text-xs text-stone-600">
              <span className="font-semibold text-navy-900">Scheduling issue: </span>
              more days booked than workdays for {out.issues.slice(0, 3).join(", ")}
              {out.issues.length > 3 ? ` and ${out.issues.length - 3} more` : ""}. Days are capped at the month&apos;s workdays.
            </p>
          )}
        </div>
      }
      kpis={[
        { label: "Annual contractor cost", value: kRound(out.total) },
        { label: "Cash paid in year", value: kRound(out.paid) },
        { label: "Year-end payable", value: kRound(out.payable[11]) },
        { label: "Scheduling issues", value: String(out.issues.length) },
      ]}
      chartTitle="Monthly contractor expense vs. cash paid"
      chart={<GroupedBars a={out.expense} b={out.cash} aLabel="Expense (accrued)" bLabel="Cash paid (next month)" />}
      table={
        <SimpleTable
          rows={[
            ["Workdays", ...WORKDAYS.map(String)],
            ["Expense", ...out.expense.map(k)],
            ["Cash paid", ...out.cash.map(k)],
            ["Payable (end)", ...out.payable.map(k)],
          ]}
        />
      }
      note={`Workdays are ${YEAR} business days (Mon–Fri). Contractors are paid one month in arrears, so December's work is still owed at year end.`}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Shared pieces                                                       */
/* ------------------------------------------------------------------ */

function ModelFrame({
  inputs,
  kpis,
  chartTitle,
  chart,
  table,
  note,
}: {
  inputs: React.ReactNode;
  kpis: { label: string; value: string }[];
  chartTitle: string;
  chart: React.ReactNode;
  table: React.ReactNode;
  note: string;
}) {
  return (
    <div className="border border-sand-200 bg-white">
      <div className="border-b border-sand-200 bg-sand-50 px-5 py-3">
        <p className="text-xs tracking-[0.2em] text-brass uppercase">Interactive model · illustrative inputs</p>
      </div>
      <div className="space-y-6 p-5 sm:p-6">
        {inputs}
        <dl className="grid grid-cols-2 gap-px overflow-hidden border border-sand-200 bg-sand-200 md:grid-cols-4">
          {kpis.map((x) => (
            <div key={x.label} className="bg-ivory p-4">
              <dt className="text-[0.65rem] tracking-[0.16em] text-brass uppercase">{x.label}</dt>
              <dd className="mt-1 font-serif text-2xl text-navy-900 tabular-nums">{x.value}</dd>
            </div>
          ))}
        </dl>
        <div>
          <p className="mb-3 font-serif text-xl text-navy-900">{chartTitle}</p>
          {chart}
          <details className="mt-4 text-sm">
            <summary className="cursor-pointer text-navy-800 underline-offset-4 hover:underline">Show monthly table</summary>
            <div className="mt-3">{table}</div>
          </details>
          <p className="mt-3 text-xs leading-relaxed text-stone-600">{note}</p>
        </div>
      </div>
    </div>
  );
}

function NumInput({
  value,
  onChange,
  step,
  min,
  max,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  step: number;
  min?: number;
  max?: number;
  label: string;
}) {
  return (
    <input
      type="number"
      inputMode="decimal"
      aria-label={label}
      value={Number.isFinite(value) ? value : ""}
      step={step}
      min={min}
      max={max}
      onChange={(e) => {
        let v = e.target.value === "" ? 0 : Number(e.target.value);
        if (!Number.isFinite(v)) v = 0;
        if (min !== undefined) v = Math.max(min, v);
        if (max !== undefined) v = Math.min(max, v);
        onChange(v);
      }}
      className="h-9 w-full border border-sand-200 bg-ivory px-2 text-sm text-navy-900 tabular-nums focus:border-navy-700 focus:outline-none"
    />
  );
}

function TextInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <input
      type="text"
      aria-label={label}
      value={value}
      maxLength={32}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 w-full min-w-[9rem] border border-sand-200 bg-ivory px-2 text-sm text-navy-900 focus:border-navy-700 focus:outline-none"
    />
  );
}

/** Two series per month on one axis, with hover tooltips. */
function GroupedBars({ a, b, aLabel, bLabel }: { a: number[]; b: number[]; aLabel: string; bLabel: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...a, ...b);
  const nice = niceMax(max);
  const ticks = [0, 0.5, 1].map((f) => f * nice);
  const H = 200;

  return (
    <div>
      <div className="relative flex gap-2">
        {/* y axis */}
        <div className="relative w-12 shrink-0 text-right text-[0.65rem] text-stone-600" style={{ height: H }} aria-hidden>
          {ticks.map((t) => (
            <span key={t} className="absolute right-0 -translate-y-1/2 tabular-nums" style={{ top: H - (t / nice) * H }}>
              {kRound(t)}
            </span>
          ))}
        </div>
        <div className="relative min-w-0 flex-1">
          {ticks.map((t) => (
            <div key={t} className="absolute inset-x-0 border-t border-sand-100" style={{ top: H - (t / nice) * H }} aria-hidden />
          ))}
          <div className="relative grid grid-cols-12 items-end gap-1 sm:gap-2" style={{ height: H }}>
            {a.map((va, i) => {
              const vb = b[i];
              return (
                <button
                  type="button"
                  key={i}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  aria-label={`${MONTHS[i]}: ${aLabel} ${k(va)}, ${bLabel} ${k(vb)}`}
                  className={`relative flex h-full items-end justify-center gap-[2px] ${hover === i ? "bg-sand-50" : ""}`}
                >
                  <span className="w-1/2 max-w-3.5 rounded-t-[3px] bg-chart-up" style={{ height: `${(va / nice) * 100}%` }} />
                  <span className="w-1/2 max-w-3.5 rounded-t-[3px] bg-chart-down" style={{ height: `${(vb / nice) * 100}%` }} />
                  {hover === i && (
                    <span
                      className={`pointer-events-none absolute bottom-full z-10 mb-2 rounded-sm bg-navy-950 px-2.5 py-1.5 text-left text-[0.7rem] leading-relaxed whitespace-nowrap text-ivory shadow ${
                        i > 8 ? "right-0" : i < 3 ? "left-0" : "left-1/2 -translate-x-1/2"
                      }`}
                    >
                      <span className="block font-semibold">{MONTHS[i]}</span>
                      <span className="block tabular-nums">
                        {aLabel}: {k(va)}
                      </span>
                      <span className="block tabular-nums">
                        {bLabel}: {k(vb)}
                      </span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-1 grid grid-cols-12 gap-1 text-center text-[0.65rem] text-stone-600 sm:gap-2" aria-hidden>
            {MONTHS.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-[0.7rem] text-stone-600">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[2px] bg-chart-up" aria-hidden /> {aLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[2px] bg-chart-down" aria-hidden /> {bLabel}
        </span>
      </div>
    </div>
  );
}

function SimpleTable({ rows }: { rows: string[][] }) {
  return (
    <div className="overflow-x-auto border border-sand-200">
      <table className="w-full min-w-[820px] text-right text-xs tabular-nums">
        <thead>
          <tr className="border-b border-sand-200 bg-sand-50 text-[0.65rem] tracking-[0.12em] text-brass uppercase">
            <th className="px-2 py-2 text-left font-medium" />
            {MONTHS.map((m) => (
              <th key={m} scope="col" className="px-2 py-2 font-medium">
                {m}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-b border-sand-100 last:border-b-0">
              <th scope="row" className="px-2 py-1.5 text-left font-normal whitespace-nowrap text-navy-900">
                {r[0]}
              </th>
              {r.slice(1).map((c, i) => (
                <td key={i} className="px-2 py-1.5 text-stone-600">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function niceMax(v: number) {
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  for (const s of [1, 2, 2.5, 5, 10]) if (s * p >= v) return s * p;
  return 10 * p;
}
