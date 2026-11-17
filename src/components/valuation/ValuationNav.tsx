"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { valuationBase, valuationNav } from "@/data/valuation";

/** Sidebar listing every page in the M&A Valuation project. */
export default function ValuationNav() {
  const pathname = usePathname();
  const linkClass = (active: boolean) =>
    `-ml-px block border-l py-1 pl-4 text-sm transition-colors ${
      active
        ? "border-navy-900 font-medium text-navy-900"
        : "border-transparent text-stone-600 hover:border-sand-400 hover:text-navy-900"
    }`;

  return (
    <nav aria-label="M&A Valuation" className="space-y-8">
      <Link
        href={valuationBase}
        className={`block font-serif text-xl ${pathname === valuationBase ? "text-navy-900" : "text-stone-600 hover:text-navy-900"}`}
      >
        M&amp;A Valuation
      </Link>
      {valuationNav.map((group, gi) => (
        <div key={group.label}>
          <p className="text-xs tracking-[0.2em] text-brass uppercase">
            {gi + 1}. {group.label}
          </p>
          <ul className="mt-3 space-y-1 border-l border-sand-200">
            {group.items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass(pathname === item.href)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
