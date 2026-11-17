import Container from "@/components/Container";
import Breadcrumbs from "./Breadcrumbs";
import ValuationNav from "./ValuationNav";

type Props = {
  crumbs: { label: string; href?: string }[];
  eyebrow: string;
  title: string;
  tagline?: string;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
};

/** Shared page frame for the M&A Valuation project: navy header + sidebar + content. */
export default function ValuationShell({ crumbs, eyebrow, title, tagline, headerExtra, children }: Props) {
  return (
    <>
      <header className="bg-navy-900 pt-32 pb-16 text-ivory sm:pt-40 sm:pb-20">
        <Container>
          <Breadcrumbs items={crumbs} />
          <p className="mt-10 text-xs font-medium tracking-[0.25em] text-brass-light uppercase">{eyebrow}</p>
          <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[1.08] font-medium sm:text-6xl">{title}</h1>
          {tagline && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-sand-200">{tagline}</p>}
          {headerExtra}
        </Container>
      </header>
      <div className="py-16 sm:py-20">
        <Container className="grid gap-14 lg:grid-cols-12">
          <aside className="order-last lg:order-first lg:col-span-3">
            <div className="border-t border-sand-200 pt-10 lg:sticky lg:top-28 lg:border-t-0 lg:pt-0">
              <ValuationNav />
            </div>
          </aside>
          <div className="min-w-0 lg:col-span-9">{children}</div>
        </Container>
      </div>
    </>
  );
}

/** A titled content block used inside valuation pages. */
export function Block({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-sand-200 py-10 first:border-t-0 first:pt-0">
      <h2 className="font-serif text-3xl text-navy-900">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}
