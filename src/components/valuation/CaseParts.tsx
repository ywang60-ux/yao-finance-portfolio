/** Building blocks shared by the completed case study pages. */

import Formula from "./Formula";

/** The five-section structure every project and case study uses. */
export const caseSections = [
  { id: "business-problem", title: "Business Problem" },
  { id: "methodology", title: "Methodology" },
  { id: "analysis", title: "Analysis" },
  { id: "findings", title: "Findings" },
  { id: "implications", title: "Business Implications" },
];

export function SourceNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-12 border-l-2 border-brass bg-sand-50 px-6 py-5 text-sm leading-relaxed text-stone-600">
      <span className="font-semibold text-navy-900">Source. </span>
      {children}
    </p>
  );
}

export function OnThisPage() {
  return (
    <nav aria-label="On this page" className="mb-12">
      <p className="text-xs tracking-[0.2em] text-brass uppercase">On this page</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {caseSections.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="inline-block border border-sand-200 bg-white px-3 py-1.5 text-xs text-stone-600 transition-colors hover:border-navy-900/40 hover:text-navy-900"
            >
              0{i + 1} {s.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Sub({ title, children, first }: { title: string; children: React.ReactNode; first?: boolean }) {
  return (
    <div className={first ? "" : "mt-10"}>
      <h3 className="mb-4 font-serif text-2xl text-navy-900">{title}</h3>
      {children}
    </div>
  );
}

export function Paragraphs({ items }: { items: string[] }) {
  return (
    <div className="max-w-3xl space-y-4 leading-relaxed text-stone-600">
      {items.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

export function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="max-w-3xl space-y-4 leading-relaxed text-stone-600">
      {items.map((b) => (
        <li key={b} className="flex gap-3">
          <span className="mt-3 h-px w-4 shrink-0 bg-brass" aria-hidden />
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}

/** Grid of titled cards (e.g. constraints, key issues). An odd last card spans the full row. */
export function CardGrid({ items }: { items: { title: string; text: string }[] }) {
  return (
    <div className="grid gap-px overflow-hidden border border-sand-200 bg-sand-200 sm:grid-cols-2">
      {items.map((c) => (
        <div key={c.title} className="bg-ivory p-5 sm:[&:last-child:nth-child(odd)]:col-span-2">
          <p className="font-serif text-lg text-navy-900">{c.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-stone-600">{c.text}</p>
        </div>
      ))}
    </div>
  );
}

export function Questions({ items }: { items: string[] }) {
  return (
    <ol className="space-y-3">
      {items.map((q, i) => (
        <li key={q} className="flex gap-4 leading-relaxed text-stone-600">
          <span className="font-serif text-xl leading-none text-brass">{i + 1}</span>
          <span>{q}</span>
        </li>
      ))}
    </ol>
  );
}

export function MethodSteps({ items }: { items: { title: string; text: string }[] }) {
  return (
    <ol className="grid gap-4 md:grid-cols-2">
      {items.map((m, i) => (
        <li key={m.title} className="border border-sand-200 bg-white p-6">
          <p className="text-xs tracking-[0.2em] text-brass uppercase">Step {i + 1}</p>
          <p className="mt-2 font-serif text-xl text-navy-900">{m.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">{m.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function FormulaList({ items }: { items: { label: string; latex: string; note?: string }[] }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {items.map((x) => (
        <Formula key={x.label} label={x.label} latex={x.latex} note={x.note} />
      ))}
    </div>
  );
}

/** Row of headline numbers; the item named by `accent` is shown on navy. */
export function KeyFigures({ items, accent }: { items: { label: string; value: string }[]; accent?: string }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden border border-sand-200 bg-sand-200 md:grid-cols-4">
      {items.map((k) => {
        const on = k.label === accent;
        return (
          <div key={k.label} className={`p-5 ${on ? "bg-navy-900" : "bg-ivory"}`}>
            <dt className={`text-xs tracking-[0.16em] uppercase ${on ? "text-brass-light" : "text-brass"}`}>{k.label}</dt>
            <dd className={`mt-2 font-serif text-3xl tabular-nums ${on ? "text-ivory" : "text-navy-900"}`}>{k.value}</dd>
          </div>
        );
      })}
    </dl>
  );
}

export function Note({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-xs leading-relaxed text-stone-600">{children}</p>;
}
