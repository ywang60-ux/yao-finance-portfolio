"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/data/site";
import Container from "./Container";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // Only the homepage hero is light enough for a transparent bar.
  const pathname = usePathname();
  const solid = scrolled || open || pathname !== "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? "border-b border-sand-100 bg-ivory/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <Container className="flex h-18 items-center justify-between">
        <Link
          href="/"
          className="font-serif text-2xl font-semibold tracking-[0.3em] text-navy-900"
          onClick={() => setOpen(false)}
        >
          {site.name}
        </Link>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Main">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative text-sm tracking-wide text-stone-600 transition-colors hover:text-navy-900 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-navy-900 after:transition-all after:duration-300 hover:after:w-full"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="relative block h-3 w-6">
            <span
              className={`absolute left-0 h-px w-6 bg-navy-900 transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`}
            />
            <span
              className={`absolute left-0 h-px w-6 bg-navy-900 transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`}
            />
          </span>
        </button>
      </Container>

      {open && (
        <nav className="border-t border-sand-100 md:hidden" aria-label="Mobile">
          <Container className="flex flex-col py-4">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 font-serif text-2xl text-navy-900"
              >
                {l.label}
              </Link>
            ))}
          </Container>
        </nav>
      )}
    </header>
  );
}
