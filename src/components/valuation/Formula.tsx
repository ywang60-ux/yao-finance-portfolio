import katex from "katex";
import "katex/dist/katex.min.css";

type Props = { label?: string; latex: string; note?: string };

/** Renders a LaTeX formula on the server with KaTeX (no client JavaScript). */
export default function Formula({ label, latex, note }: Props) {
  const html = katex.renderToString(latex, {
    displayMode: true,
    throwOnError: false,
    output: "html",
  });
  return (
    <figure className="min-w-0 border border-sand-200 bg-white">
      {label && (
        <figcaption className="border-b border-sand-100 px-5 py-3 text-xs font-medium tracking-[0.18em] text-brass uppercase">
          {label}
        </figcaption>
      )}
      <div
        className="overflow-x-auto px-5 py-4 text-navy-900 [&_.katex-display]:my-2"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {note && <p className="border-t border-sand-100 px-5 py-3 text-xs leading-relaxed text-stone-600">{note}</p>}
    </figure>
  );
}
