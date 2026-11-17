import Link from "next/link";
import type { MethodPage } from "@/data/valuation";
import { methodHref, valuationBase } from "@/data/valuation";
import Formula from "./Formula";
import ValuationShell, { Block } from "./ValuationShell";

type Props = {
  method: MethodPage;
  groupLabel: string;
  siblings: MethodPage[];
};

/** Shared layout for a single framework or terminal value method page. */
export default function MethodPageView({ method, groupLabel, siblings }: Props) {
  const idx = siblings.findIndex((s) => s.slug === method.slug);
  const next = siblings[(idx + 1) % siblings.length];

  return (
    <ValuationShell
      crumbs={[
        { label: "Projects", href: "/#projects" },
        { label: "M&A Valuation", href: valuationBase },
        { label: groupLabel },
        { label: method.short },
      ]}
      eyebrow={groupLabel}
      title={method.title}
      tagline={method.tagline}
    >
      <Block title="Overview">
        <div className="max-w-3xl space-y-4 text-base leading-relaxed text-stone-600">
          {method.overview.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Block>

      <Block title="Formulas">
        <div className="grid grid-cols-1 gap-4">
          {method.formulas.map((f) => (
            <Formula key={f.label} label={f.label} latex={f.latex} note={f.note} />
          ))}
        </div>
      </Block>

      <Block title="Key Terms">
        <dl className="grid gap-px overflow-hidden border border-sand-200 bg-sand-200 sm:grid-cols-2">
          {method.terms.map((t) => (
            <div key={t.symbol} className="bg-ivory p-5">
              <dt className="font-serif text-lg text-navy-900">{t.symbol}</dt>
              <dd className="mt-1 text-sm text-stone-600">{t.meaning}</dd>
            </div>
          ))}
        </dl>
      </Block>

      <Block title="Application">
        <div className="grid gap-6 md:grid-cols-2">
          <List title="When to use" items={method.whenToUse} />
          <List title="Key considerations" items={method.considerations} />
        </div>
      </Block>

      {next && next.slug !== method.slug && (
        <Link
          href={methodHref(next)}
          className="group mt-6 flex items-center justify-between gap-6 border border-sand-200 bg-sand-50 p-6 transition-colors hover:border-navy-900/30"
        >
          <div>
            <p className="text-xs tracking-[0.2em] text-brass uppercase">Next in {groupLabel}</p>
            <p className="mt-1 font-serif text-2xl text-navy-900">{next.title}</p>
          </div>
          <span className="text-xl text-navy-900 transition-transform group-hover:translate-x-1" aria-hidden>
            →
          </span>
        </Link>
      )}
    </ValuationShell>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border border-sand-200 bg-white p-6">
      <p className="text-xs font-medium tracking-[0.18em] text-brass uppercase">{title}</p>
      <ul className="mt-4 space-y-3 text-sm leading-relaxed text-stone-600">
        {items.map((it) => (
          <li key={it} className="flex gap-3">
            <span className="mt-2.5 h-px w-3 shrink-0 bg-brass" aria-hidden />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
