import Link from "next/link";
import Container from "@/components/Container";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center pt-24">
      <Container>
        <p className="text-xs tracking-[0.25em] text-brass uppercase">404</p>
        <h1 className="mt-4 font-serif text-5xl text-navy-900">Page not found</h1>
        <p className="mt-4 text-stone-600">The page you are looking for does not exist.</p>
        <Link
          href="/"
          className="mt-10 inline-flex bg-navy-900 px-7 py-3.5 text-sm font-medium text-ivory hover:bg-navy-700"
        >
          Back to home
        </Link>
      </Container>
    </section>
  );
}
