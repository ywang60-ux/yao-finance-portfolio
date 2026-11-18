import type { Metadata } from "next";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import TopicList from "@/components/TopicList";
import Formula from "@/components/valuation/Formula";
import ValuationShell, { Block } from "@/components/valuation/ValuationShell";
import { getProject } from "@/data/projects";
import {
  caseStudies,
  equityBridgeLatex,
  frameworks,
  methodHref,
  terminalValueMethods,
  valuationBase,
} from "@/data/valuation";

const project = getProject("ma-valuation")!;

export const metadata: Metadata = {
  title: "M&A Valuation",
  description: project.summary,
};

export default function MAValuationPage() {
  return (
    <ValuationShell
      crumbs={[{ label: "Projects", href: "/#projects" }, { label: "M&A Valuation" }]}
      eyebrow={`Project ${project.number} · ${project.category}`}
      title={project.title}
      tagline={project.summary}
      headerExtra={
        <>
          <div className="mt-8">
            <span className="inline-block rounded-full bg-ivory">
              <StatusBadge status={project.status} />
            </span>
          </div>
          <div className="mt-8">
            <p className="mb-3 text-xs tracking-[0.2em] text-sand-400 uppercase">Topics</p>
            <TopicList topics={project.topics} tone="dark" />
          </div>
        </>
      }
    >
      <Block title="1. Acquisition Framework" id="acquisition-framework">
        <p className="mb-6 max-w-3xl text-stone-600">
          How the deal is structured (assets or stock, direct or through a subsidiary) and why that choice changes taxes,
          liabilities, and value.
        </p>
        <MethodCard
          href={`${valuationBase}/acquisition-framework`}
          kicker="Deal Structure"
          title="Acquisition Framework"
          text="Acquisition methods, deal structures, tax treatment (§368, §338), and valuation implications."
        />
      </Block>

      <Block title="2. Valuation Methods" id="frameworks">
        <p className="mb-6 max-w-3xl text-stone-600">
          Three consistent ways to value a business. Each treats the benefit of debt financing differently.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {frameworks.map((m) => (
            <MethodCard key={m.slug} href={methodHref(m)} kicker={m.short} title={m.title} text={m.tagline} />
          ))}
        </div>
      </Block>

      <Block title="3. Terminal Value" id="terminal-value">
        <p className="mb-6 max-w-3xl text-stone-600">
          Ways to value cash flows beyond the explicit forecast period, which often make up most of enterprise value.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {terminalValueMethods.map((m) => (
            <MethodCard key={m.slug} href={methodHref(m)} kicker="Terminal Value" title={m.title} text={m.tagline} />
          ))}
        </div>
      </Block>

      <Block title="4. Case Studies" id="case-studies">
        <div className="grid gap-4">
          {caseStudies.map((c) => (
            <Link
              key={c.slug}
              href={c.href}
              className="group flex flex-col gap-4 border border-sand-200 bg-white p-8 transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-20px_rgba(11,26,51,0.35)] sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-xs tracking-[0.2em] text-brass uppercase">{c.kicker}</p>
                <p className="mt-2 font-serif text-3xl text-navy-900">{c.short}</p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-600">{c.summary}</p>
              </div>
              <div className="flex items-center gap-6">
                <StatusBadge status={c.status} />
                <span className="text-xl text-navy-900 transition-transform group-hover:translate-x-1" aria-hidden>
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Block>

      <Block title="From Enterprise Value to Equity Value">
        <Formula latex={equityBridgeLatex} note="WACC and APV produce enterprise value; Flow to Equity produces equity value directly." />
      </Block>
    </ValuationShell>
  );
}

function MethodCard({ href, kicker, title, text }: { href: string; kicker: string; title: string; text: string }) {
  return (
    <Link
      href={href}
      className="group relative flex h-full flex-col border border-sand-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-20px_rgba(11,26,51,0.35)]"
    >
      <span
        className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-navy-800 transition-transform duration-500 group-hover:scale-x-100"
        aria-hidden
      />
      <p className="text-xs tracking-[0.2em] text-brass uppercase">{kicker}</p>
      <p className="mt-3 font-serif text-2xl leading-snug text-navy-900">{title}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-600">{text}</p>
      <span className="mt-6 text-sm font-medium text-navy-800">
        Read more <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}
