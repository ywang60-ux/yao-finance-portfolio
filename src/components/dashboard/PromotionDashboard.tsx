"use client";

import { useEffect, useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/* Data shape (public/data/promotion-dashboard.json)                   */
/* ------------------------------------------------------------------ */

type Row = [
  year: number, // index into years
  workday: 0 | 1,
  geo: number, // index into geo
  product: number, // index into products
  promotion: number, // index into promotions (0 = No Discount)
  salesQty: number,
  returnQty: number,
  salesAmount: number,
  returnAmount: number,
  cost: number,
];

type Data = {
  years: number[];
  dayCounts: Record<string, { workday: number; weekend: number }>;
  geo: [continent: string, country: string, state: string][];
  products: [category: string, subcategory: string][];
  promotions: { name: string; discount: number }[];
  rows: Row[];
};

type Totals = { sq: number; rq: number; sa: number; ra: number; co: number };

const ALL = "__all";
const empty = (): Totals => ({ sq: 0, rq: 0, sa: 0, ra: 0, co: 0 });

/* ------------------------------------------------------------------ */
/* Formatting                                                          */
/* ------------------------------------------------------------------ */

function compact(v: number, money = false) {
  const p = money ? "$" : "";
  const a = Math.abs(v);
  const s = v < 0 ? "−" : "";
  if (a >= 1e9) return `${s}${p}${(a / 1e9).toFixed(2)}B`;
  if (a >= 1e6) return `${s}${p}${(a / 1e6).toFixed(1)}M`;
  if (a >= 1e3) return `${s}${p}${(a / 1e3).toFixed(1)}K`;
  return `${s}${p}${a.toFixed(0)}`;
}
const units = (v: number) => (Number.isFinite(v) ? Math.round(v).toLocaleString("en-US") : "–");
const signedUnits = (v: number) => (Number.isFinite(v) ? `${v > 0 ? "+" : v < 0 ? "−" : ""}${units(Math.abs(v))}` : "–");
const pct = (v: number) => (Number.isFinite(v) ? `${(v * 100).toFixed(2)}%` : "–");

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function PromotionDashboard() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState(false);

  const [year, setYear] = useState(ALL);
  const [dayType, setDayType] = useState(ALL); // "1" workday, "0" weekend
  const [continent, setContinent] = useState(ALL);
  const [country, setCountry] = useState(ALL);
  const [state, setState] = useState(ALL);
  const [category, setCategory] = useState(ALL);
  const [subcategory, setSubcategory] = useState(ALL);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    fetch("/data/promotion-dashboard.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setError(true));
  }, []);

  /* Filter option lists (cascading) */
  const options = useMemo(() => {
    if (!data) return null;
    const uniq = (xs: string[]) => [...new Set(xs)].sort();
    const g = data.geo;
    const continents = uniq(g.map((x) => x[0]));
    const countries = uniq(g.filter((x) => continent === ALL || x[0] === continent).map((x) => x[1]));
    const states = uniq(
      g.filter((x) => (continent === ALL || x[0] === continent) && (country === ALL || x[1] === country)).map((x) => x[2]),
    );
    const categories = uniq(data.products.map((x) => x[0]));
    const subcategories = uniq(data.products.filter((x) => category === ALL || x[0] === category).map((x) => x[1]));
    return { continents, countries, states, categories, subcategories };
  }, [data, continent, country, category]);

  /* Aggregate by promotion and by (promotion, category) under current filters */
  const result = useMemo(() => {
    if (!data) return null;
    const geoOk = data.geo.map(
      (x) =>
        (continent === ALL || x[0] === continent) &&
        (country === ALL || x[1] === country) &&
        (state === ALL || x[2] === state),
    );
    const prodOk = data.products.map((x) => (category === ALL || x[0] === category) && (subcategory === ALL || x[1] === subcategory));
    const yearIdx = year === ALL ? -1 : data.years.indexOf(Number(year));
    const wd = dayType === ALL ? -1 : Number(dayType);

    const byPromo = data.promotions.map(empty);
    const categories = [...new Set(data.products.map((p) => p[0]))].sort();
    const catIndex = new Map(categories.map((c, i) => [c, i]));
    const byPromoCat = data.promotions.map(() => categories.map(empty));

    for (const r of data.rows) {
      if (yearIdx >= 0 && r[0] !== yearIdx) continue;
      if (wd >= 0 && r[1] !== wd) continue;
      if (!geoOk[r[2]] || !prodOk[r[3]]) continue;
      const t = byPromo[r[4]];
      const c = byPromoCat[r[4]][catIndex.get(data.products[r[3]][0])!];
      for (const x of [t, c]) {
        x.sq += r[5];
        x.rq += r[6];
        x.sa += r[7];
        x.ra += r[8];
        x.co += r[9];
      }
    }

    // DISTINCTCOUNT('Dim Date'[Date]) under the year and day-type filters
    let days = 0;
    for (const y of data.years) {
      if (year !== ALL && y !== Number(year)) continue;
      const dc = data.dayCounts[String(y)];
      days += wd === 1 ? dc.workday : wd === 0 ? dc.weekend : dc.workday + dc.weekend;
    }

    const total = byPromo.reduce((a, t) => ({ sq: a.sq + t.sq, rq: a.rq + t.rq, sa: a.sa + t.sa, ra: a.ra + t.ra, co: a.co + t.co }), empty());
    const perDay = (t: Totals) => (days ? t.sq / days : NaN);
    const base = perDay(byPromo[0]);

    const promos = data.promotions.map((p, i) => {
      const t = byPromo[i];
      const avg = perDay(t);
      return {
        i,
        name: p.name,
        discount: p.discount,
        t,
        avg,
        vsBase: i === 0 ? 0 : avg - base,
        returnRate: t.sq ? t.rq / t.sq : NaN,
        netProfit: t.sa - t.ra - t.co,
        hasData: t.sq > 0,
      };
    });

    const detail = (pi: number) =>
      categories.map((c, ci) => {
        const t = byPromoCat[pi][ci];
        const b = byPromoCat[0][ci];
        const avg = perDay(t);
        const baseAvg = perDay(b);
        return {
          category: c,
          avg,
          baseAvg,
          diff: avg - baseAvg,
          returnRate: t.sq ? t.rq / t.sq : NaN,
          netProfit: t.sa - t.ra - t.co,
          hasData: t.sq > 0,
        };
      });

    return { total, days, base, promos, detail };
  }, [data, year, dayType, continent, country, state, category, subcategory]);

  /* Default drill-through: the promotion with the highest net profit */
  const ranked = result ? result.promos.filter((p) => p.i !== 0 && p.hasData).sort((a, b) => b.netProfit - a.netProfit) : [];
  const activePromo = selected !== null && result?.promos[selected]?.hasData ? selected : (ranked[0]?.i ?? null);

  const activeFilters = [year, dayType, continent, country, state, category, subcategory].filter((f) => f !== ALL).length;
  const reset = () => {
    setYear(ALL);
    setDayType(ALL);
    setContinent(ALL);
    setCountry(ALL);
    setState(ALL);
    setCategory(ALL);
    setSubcategory(ALL);
  };

  if (error) {
    return <p className="border border-sand-200 bg-white p-6 text-sm text-stone-600">The dashboard data could not be loaded.</p>;
  }
  if (!data || !options || !result) {
    return (
      <div className="animate-pulse space-y-4" aria-busy="true" aria-label="Loading dashboard">
        <div className="h-14 bg-sand-100" />
        <div className="grid grid-cols-2 gap-px sm:grid-cols-4 lg:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-20 bg-sand-100" />
          ))}
        </div>
        <div className="h-80 bg-sand-100" />
      </div>
    );
  }

  const r = result;
  const kpis = [
    { label: "Sales quantity", value: compact(r.total.sq) },
    { label: "Return quantity", value: compact(r.total.rq) },
    { label: "Net quantity", value: compact(r.total.sq - r.total.rq) },
    { label: "Sales amount", value: compact(r.total.sa, true) },
    { label: "Return amount", value: compact(r.total.ra, true) },
    { label: "Cost of goods", value: compact(r.total.co, true) },
    { label: "Net profit", value: compact(r.total.sa - r.total.ra - r.total.co, true), accent: true },
  ];
  const promoRows = r.promos.filter((p) => p.hasData);
  const active = activePromo !== null ? r.promos[activePromo] : null;

  return (
    <div className="space-y-8">
      {/* Filters: one row above the charts */}
      <div className="border border-sand-200 bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-end gap-3">
          <Select label="Year" value={year} onChange={setYear} options={data.years.map((y) => [String(y), String(y)])} allLabel="All years" />
          <Select
            label="Day type"
            value={dayType}
            onChange={setDayType}
            options={[
              ["1", "Workdays"],
              ["0", "Weekends"],
            ]}
            allLabel="All days"
          />
          <Select
            label="Continent"
            value={continent}
            onChange={(v) => {
              setContinent(v);
              setCountry(ALL);
              setState(ALL);
            }}
            options={options.continents.map((x) => [x, x])}
            allLabel="All continents"
          />
          <Select
            label="Country"
            value={country}
            onChange={(v) => {
              setCountry(v);
              setState(ALL);
            }}
            options={options.countries.map((x) => [x, x])}
            allLabel="All countries"
          />
          <Select label="State / province" value={state} onChange={setState} options={options.states.map((x) => [x, x])} allLabel="All states" />
          <Select
            label="Product category"
            value={category}
            onChange={(v) => {
              setCategory(v);
              setSubcategory(ALL);
            }}
            options={options.categories.map((x) => [x, x])}
            allLabel="All categories"
          />
          <Select
            label="Subcategory"
            value={subcategory}
            onChange={setSubcategory}
            options={options.subcategories.map((x) => [x, x])}
            allLabel="All subcategories"
          />
          <button
            type="button"
            onClick={reset}
            disabled={activeFilters === 0}
            className="h-10 px-3 text-sm text-navy-800 underline-offset-4 hover:underline disabled:cursor-default disabled:text-sand-400 disabled:no-underline"
          >
            Reset{activeFilters ? ` (${activeFilters})` : ""}
          </button>
        </div>
      </div>

      {/* KPI tiles */}
      <dl className="grid grid-cols-2 gap-px overflow-hidden border border-sand-200 bg-sand-200 sm:grid-cols-4 lg:grid-cols-7">
        {kpis.map((k) => (
          <div key={k.label} className={`p-4 ${k.accent ? "bg-navy-900" : "bg-white"}`}>
            <dt className={`text-[0.65rem] tracking-[0.16em] uppercase ${k.accent ? "text-brass-light" : "text-brass"}`}>{k.label}</dt>
            <dd className={`mt-1 font-serif text-2xl tabular-nums ${k.accent ? "text-ivory" : "text-navy-900"}`}>{k.value}</dd>
          </div>
        ))}
      </dl>
      <p className="-mt-5 text-xs text-stone-600">
        {r.days.toLocaleString("en-US")} days in the selected period. Totals include all promotions and the No Discount baseline.
      </p>

      {r.total.sq === 0 ? (
        <p className="border border-dashed border-sand-400 bg-sand-50 p-6 text-sm text-stone-600">No sales match these filters.</p>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Lift versus No Discount"
              subtitle={`Average daily units: each promotion minus the No Discount baseline (${units(r.base)} units/day). Click a bar for detail.`}
            >
              <DivergingBars
                rows={promoRows.filter((p) => p.i !== 0)}
                selected={activePromo}
                onSelect={setSelected}
              />
            </ChartCard>
            <ChartCard
              title="Volume versus return rate"
              subtitle="Average daily units (x) against return rate (y), one point per promotion. Click a point for detail."
            >
              <Scatter rows={promoRows} selected={activePromo} onSelect={setSelected} />
            </ChartCard>
          </div>

          {/* Table view (also the accessible version of both charts) */}
          <ChartCard title="Promotion summary" subtitle="Click a row to open its product breakdown below.">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-sand-200 text-xs tracking-[0.12em] text-brass uppercase">
                    {["Promotion", "Discount", "Units / day", "vs No Discount", "Return rate", "Sales", "Net profit"].map((h, j) => (
                      <th key={h} scope="col" className={`px-3 py-2.5 font-medium ${j > 0 ? "text-right" : ""}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...promoRows]
                    .sort((a, b) => (a.i === 0 ? -1 : b.i === 0 ? 1 : b.netProfit - a.netProfit))
                    .map((p) => {
                      const isSel = p.i === activePromo;
                      const isBase = p.i === 0;
                      return (
                        <tr
                          key={p.i}
                          onClick={() => !isBase && setSelected(p.i)}
                          className={`border-b border-sand-100 last:border-b-0 ${isBase ? "bg-sand-50" : "cursor-pointer hover:bg-sand-50"} ${isSel ? "bg-navy-900/[0.05]" : ""}`}
                          aria-selected={isSel}
                        >
                          <td className="px-3 py-2.5 text-navy-900">
                            {!isBase ? (
                              <button type="button" className="text-left hover:underline" onClick={() => setSelected(p.i)}>
                                {p.name}
                              </button>
                            ) : (
                              <span>{p.name} (baseline)</span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-right tabular-nums text-stone-600">{(p.discount * 100).toFixed(0)}%</td>
                          <td className="px-3 py-2.5 text-right tabular-nums text-stone-600">{units(p.avg)}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums text-stone-600">{isBase ? "–" : signedUnits(p.vsBase)}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums text-stone-600">{pct(p.returnRate)}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums text-stone-600">{compact(p.t.sa, true)}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums text-stone-600">{compact(p.netProfit, true)}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </ChartCard>

          {/* Drill-through */}
          {active && (
            <ChartCard
              title={`Product breakdown: ${active.name}`}
              subtitle={`${(active.discount * 100).toFixed(0)}% discount. Average daily units by product category, compared with No Discount under the same filters.`}
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-sand-200 text-xs tracking-[0.12em] text-brass uppercase">
                      {["Category", "Units / day", "No Discount", "Difference", "Return rate", "Net profit"].map((h, j) => (
                        <th key={h} scope="col" className={`px-3 py-2.5 font-medium ${j > 0 ? "text-right" : ""}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {r
                      .detail(active.i)
                      .filter((d) => d.hasData)
                      .sort((a, b) => b.netProfit - a.netProfit)
                      .map((d) => (
                        <tr key={d.category} className="border-b border-sand-100 last:border-b-0">
                          <td className="px-3 py-2.5 text-navy-900">{d.category}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums text-stone-600">{units(d.avg)}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums text-stone-600">{units(d.baseAvg)}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums">
                            <span className={d.diff >= 0 ? "font-medium text-navy-900" : "text-stone-600"}>{signedUnits(d.diff)}</span>
                            {d.diff >= 0 && (
                              <span className="ml-2 rounded-sm border border-navy-700/30 px-1.5 py-0.5 text-[0.6rem] tracking-wider text-navy-800 uppercase">
                                Lift
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-right tabular-nums text-stone-600">{pct(d.returnRate)}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums text-stone-600">{compact(d.netProfit, true)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </ChartCard>
          )}
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function Select({
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
  allLabel: string;
}) {
  return (
    <label className="flex min-w-[9.5rem] flex-1 flex-col gap-1 sm:flex-none">
      <span className="text-[0.65rem] tracking-[0.16em] text-brass uppercase">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-10 w-full border bg-ivory px-2 text-sm text-navy-900 focus:border-navy-700 focus:outline-none ${value !== ALL ? "border-navy-700" : "border-sand-200"}`}
      >
        <option value={ALL}>{allLabel}</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="min-w-0 border border-sand-200 bg-white p-5 sm:p-6">
      <h3 className="font-serif text-2xl text-navy-900">{title}</h3>
      {subtitle && <p className="mt-1 text-xs leading-relaxed text-stone-600">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

type PromoPoint = { i: number; name: string; avg: number; vsBase: number; returnRate: number; netProfit: number };

/** Horizontal diverging bars around zero (the No Discount baseline). */
function DivergingBars({ rows, selected, onSelect }: { rows: PromoPoint[]; selected: number | null; onSelect: (i: number) => void }) {
  const [hover, setHover] = useState<number | null>(null);
  const sorted = [...rows].sort((a, b) => b.vsBase - a.vsBase);
  const max = Math.max(1, ...sorted.map((r) => Math.abs(r.vsBase)));
  const hasPos = sorted.some((r) => r.vsBase > 0);
  const hasNeg = sorted.some((r) => r.vsBase < 0);
  // Zero position: centered only when both signs are present
  const zero = hasPos && hasNeg ? 50 : hasPos ? 0 : 100;
  const scale = hasPos && hasNeg ? 50 : 100;

  return (
    <div>
      <div className="mb-2 flex justify-between text-[0.65rem] tracking-[0.12em] text-stone-600 uppercase">
        <span>{hasNeg ? "◀ Below baseline" : ""}</span>
        <span>{hasPos ? "Above baseline ▶" : ""}</span>
      </div>
      <ul className="space-y-1.5">
        {sorted.map((r) => {
          const w = (Math.abs(r.vsBase) / max) * scale;
          const left = r.vsBase >= 0 ? zero : zero - w;
          const isSel = r.i === selected;
          const isHover = r.i === hover;
          return (
            <li key={r.i}>
              <button
                type="button"
                onClick={() => onSelect(r.i)}
                onMouseEnter={() => setHover(r.i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(r.i)}
                onBlur={() => setHover(null)}
                className="group grid w-full grid-cols-[minmax(0,10.5rem)_1fr] items-center gap-3 text-left"
                aria-label={`${r.name}: ${signedUnits(r.vsBase)} units per day versus No Discount`}
              >
                <span className={`text-xs leading-tight ${isSel ? "font-semibold text-navy-900" : "text-stone-600"}`}>{r.name}</span>
                <span className="relative block h-6">
                  <span className="absolute inset-y-0 w-px bg-stone-600/40" style={{ left: `${zero}%` }} aria-hidden />
                  <span
                    className={`absolute top-1 bottom-1 rounded-[3px] transition-colors ${
                      r.vsBase >= 0 ? "bg-chart-up" : "bg-chart-down"
                    } ${isSel ? "ring-2 ring-navy-900 ring-offset-1" : ""} ${isHover && !isSel ? "opacity-80" : ""}`}
                    style={{ left: `${left}%`, width: `${Math.max(w, 0.6)}%` }}
                  />
                  {(isHover || isSel) && (
                    <span
                      className="pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 rounded-sm bg-navy-950 px-2 py-1 text-[0.7rem] whitespace-nowrap text-ivory tabular-nums shadow"
                      style={r.vsBase >= 0 ? { left: `min(${left + w}% + 6px, 100% - 7rem)` } : { left: `max(${left}% - 7.5rem, 0px)` }}
                    >
                      {signedUnits(r.vsBase)} / day
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 flex flex-wrap gap-4 text-[0.7rem] text-stone-600">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[2px] bg-chart-up" aria-hidden /> Sells more per day than No Discount
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[2px] bg-chart-down" aria-hidden /> Sells less per day than No Discount
        </span>
      </div>
    </div>
  );
}

/** Scatter of average daily units (x) vs return rate (y). */
function Scatter({ rows, selected, onSelect }: { rows: PromoPoint[]; selected: number | null; onSelect: (i: number) => void }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 560,
    H = 320,
    m = { t: 12, r: 16, b: 40, l: 52 };
  const xs = rows.map((r) => r.avg).filter(Number.isFinite);
  const ys = rows.map((r) => r.returnRate).filter(Number.isFinite);
  const xMax = niceMax(Math.max(1, ...xs));
  const yMin = Math.max(0, Math.min(...ys) * 0.9);
  const yMaxRaw = Math.max(...ys) * 1.08 || 0.01;
  const x = (v: number) => m.l + (v / xMax) * (W - m.l - m.r);
  const y = (v: number) => H - m.b - ((v - yMin) / (yMaxRaw - yMin || 1)) * (H - m.t - m.b);
  const xTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * xMax);
  const yTicks = [0, 0.5, 1].map((f) => yMin + f * (yMaxRaw - yMin));
  const tip = rows.find((r) => r.i === (hover ?? selected));

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Average daily units versus return rate by promotion">
        {/* grid */}
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={m.l} x2={W - m.r} y1={y(t)} y2={y(t)} stroke="var(--color-sand-100)" />
            <text x={m.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--color-stone-600)">
              {(t * 100).toFixed(1)}%
            </text>
          </g>
        ))}
        {xTicks.map((t) => (
          <text key={t} x={x(t)} y={H - m.b + 18} textAnchor="middle" fontSize="11" fill="var(--color-stone-600)">
            {compact(t)}
          </text>
        ))}
        <line x1={m.l} x2={W - m.r} y1={H - m.b} y2={H - m.b} stroke="var(--color-sand-200)" />
        <text x={(W + m.l) / 2} y={H - 6} textAnchor="middle" fontSize="11" fill="var(--color-stone-600)">
          Average daily units
        </text>
        {/* points */}
        {rows.map((r) => {
          if (!Number.isFinite(r.avg) || !Number.isFinite(r.returnRate)) return null;
          const isBase = r.i === 0;
          const isSel = r.i === selected;
          const cx = x(r.avg),
            cy = y(r.returnRate);
          return (
            <g
              key={r.i}
              onMouseEnter={() => setHover(r.i)}
              onMouseLeave={() => setHover(null)}
              onClick={() => !isBase && onSelect(r.i)}
              style={{ cursor: isBase ? "default" : "pointer" }}
            >
              <circle cx={cx} cy={cy} r={14} fill="transparent" />
              <circle
                cx={cx}
                cy={cy}
                r={isSel ? 7 : 5.5}
                fill={isBase ? "#fff" : isSel ? "var(--color-navy-900)" : "var(--color-sand-400)"}
                stroke={isBase ? "var(--color-navy-900)" : "#fff"}
                strokeWidth={2}
              />
              {(isBase || isSel) && (
                <text
                  x={cx > W * 0.7 ? cx - 10 : cx + 10}
                  y={cy - 9}
                  textAnchor={cx > W * 0.7 ? "end" : "start"}
                  fontSize="11"
                  fill="var(--color-navy-900)"
                >
                  {isBase ? "No Discount" : r.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {tip && hover !== null && (
        <div
          className="pointer-events-none absolute z-10 rounded-sm bg-navy-950 px-3 py-2 text-[0.7rem] leading-relaxed text-ivory shadow"
          style={{
            left: `${Math.min(84, (x(tip.avg) / W) * 100)}%`,
            top: `${(y(tip.returnRate) / H) * 100}%`,
            transform: "translate(-50%, calc(-100% - 12px))",
          }}
        >
          <p className="font-semibold">{tip.name}</p>
          <p className="tabular-nums">{units(tip.avg)} units / day</p>
          <p className="tabular-nums">{pct(tip.returnRate)} returned</p>
        </div>
      )}
      <div className="mt-2 flex flex-wrap gap-4 text-[0.7rem] text-stone-600">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-navy-900 bg-white" aria-hidden /> No Discount baseline
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-sand-400" aria-hidden /> Promotion
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-navy-900" aria-hidden /> Selected
        </span>
      </div>
    </div>
  );
}

function niceMax(v: number) {
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  for (const s of [1, 2, 2.5, 5, 10]) if (s * p >= v) return s * p;
  return 10 * p;
}
