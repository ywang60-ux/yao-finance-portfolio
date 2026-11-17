import type { ProjectSection } from "@/data/projects";
import Reveal from "./Reveal";

type Props = { index: number; title: string; section: ProjectSection; id: string };

export default function ProjectSectionBlock({ index, title, section, id }: Props) {
  const pending = section.state === "pending";
  return (
    <Reveal as="section" className={index === 1 ? "pb-12" : "border-t border-sand-200 py-12"}>
      <div id={id} className="grid scroll-mt-28 gap-6 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="font-serif text-lg text-brass">0{index}</p>
          <h2 className="mt-1 font-serif text-3xl text-navy-900">{title}</h2>
        </div>
        <div className="md:col-span-8">
          {pending ? (
            <div className="flex items-start gap-4 border border-dashed border-sand-400/70 bg-sand-50 p-6">
              <span
                className="mt-0.5 shrink-0 rounded-full border border-stone-600/25 px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-[0.16em] text-stone-600 uppercase"
              >
                Pending
              </span>
              <p className="text-sm leading-relaxed text-stone-600">{section.note}</p>
            </div>
          ) : (
            <div className="space-y-4 text-base leading-relaxed text-stone-600">
              {section.label && (
                <p className="text-xs font-medium tracking-[0.2em] text-brass uppercase">
                  {section.label}
                </p>
              )}
              {section.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {section.bullets && (
                <ul className="space-y-3 pt-2">
                  {section.bullets.map((b) => (
                    <li key={b} className="flex gap-3">
                      <span className="mt-2.5 h-px w-4 shrink-0 bg-brass" aria-hidden />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
}
