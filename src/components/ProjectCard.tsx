import Link from "next/link";
import type { Project } from "@/data/projects";
import StatusBadge from "./StatusBadge";
import TopicList from "./TopicList";

export default function ProjectCard({ project }: { project: Project }) {
  const planned = project.status === "Planned";
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`group relative flex h-full flex-col border bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(11,26,51,0.35)] sm:p-10 ${
        planned ? "border-dashed border-sand-200" : "border-sand-200"
      }`}
    >
      <span
        className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-navy-800 transition-transform duration-500 group-hover:scale-x-100"
        aria-hidden
      />
      <div className="flex items-start justify-between gap-4">
        <span className="font-serif text-5xl leading-none text-sand-200">{project.number}</span>
        <StatusBadge status={project.status} />
      </div>
      <p className="mt-8 text-xs font-medium tracking-[0.2em] text-brass uppercase">
        {project.category}
      </p>
      <h3 className="mt-2 font-serif text-3xl leading-snug text-navy-900">{project.title}</h3>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-stone-600">{project.summary}</p>
      <div className="mt-6">
        <TopicList topics={project.topics} />
      </div>
      <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-navy-800">
        {planned ? "View planned scope" : "View project"}
        <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
          →
        </span>
      </span>
    </Link>
  );
}
