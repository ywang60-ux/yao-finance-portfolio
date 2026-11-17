import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MethodPageView from "@/components/valuation/MethodPageView";
import { terminalValueMethods } from "@/data/valuation";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return terminalValueMethods.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const m = terminalValueMethods.find((f) => f.slug === slug);
  return m ? { title: m.title, description: m.tagline } : {};
}

export default async function TerminalValuePage({ params }: Params) {
  const { slug } = await params;
  const method = terminalValueMethods.find((f) => f.slug === slug);
  if (!method) notFound();
  return <MethodPageView method={method} groupLabel="Terminal Value" siblings={terminalValueMethods} />;
}
