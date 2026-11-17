import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MethodPageView from "@/components/valuation/MethodPageView";
import { frameworks } from "@/data/valuation";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return frameworks.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const m = frameworks.find((f) => f.slug === slug);
  return m ? { title: `${m.title} (${m.short})`, description: m.tagline } : {};
}

export default async function FrameworkPage({ params }: Params) {
  const { slug } = await params;
  const method = frameworks.find((f) => f.slug === slug);
  if (!method) notFound();
  return <MethodPageView method={method} groupLabel="Frameworks" siblings={frameworks} />;
}
