import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import ProjectSectionBlock from "@/components/ProjectSectionBlock";
import StatusBadge from "@/components/StatusBadge";
import TopicList from "@/components/TopicList";
import { getProject, projects, sectionOrder } from "@/data/projects";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: `${project.category}: ${project.title}`, description: project.summary };
}

const statusNotes = {
  "In Progress":
    "This project is in progress. Sections marked Pending have not been completed yet, and no results are shown until the work is finished.",
  Planned:
    "This project is planned and has not started. The page shows the intended scope only. There is no analysis or findings yet.",
  Completed: "",
} as const;

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const idx = projects.findIndex((p) => p.slug === slug);
  const next = projects[(idx + 1) % projects.length];
  const note = statusNotes[project.status];

  return (
    <>
      <header className="bg-navy-900 pt-36 pb-20 text-ivory sm:pt-44 sm:pb-24">
        <Container>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm text-sand-200 transition-colors hover:text-ivory"
          >
            <span aria-hidden>←</span> All projects
          </Link>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <span className="text-xs font-medium tracking-[0.25em] text-brass-light uppercase">
              Project {project.number} · {project.category}
            </span>
            <span className="rounded-full bg-ivory">
              <StatusBadge status={project.status} />
            </span>
          </div>
          <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[1.08] font-medium sm:text-6xl">
            {project.title}
          </h1>
          {project.subtitle && (
            <p className="mt-4 font-serif text-2xl text-brass-light italic">{project.subtitle}</p>
          )}
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-sand-200">{project.summary}</p>
          <div className="mt-10">
            <p className="mb-3 text-xs tracking-[0.2em] text-sand-400 uppercase">Topics</p>
            <TopicList topics={project.topics} tone="dark" />
          </div>
        </Container>
      </header>

      <div className="py-20 sm:py-24">
        <Container className="grid gap-16 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <p className="text-xs tracking-[0.2em] text-brass uppercase">Contents</p>
              <ol className="mt-4 space-y-3 border-l border-sand-200">
                {sectionOrder.map((s) => {
                  const pending = project.sections[s.key].state === "pending";
                  return (
                    <li key={s.key}>
                      <a
                        href={`#${s.key}`}
                        className="-ml-px flex items-center justify-between gap-2 border-l border-transparent pl-4 text-sm text-stone-600 transition-colors hover:border-navy-900 hover:text-navy-900"
                      >
                        {s.title}
                        {pending && (
                          <span className="text-[0.6rem] tracking-[0.15em] text-sand-400 uppercase">
                            Pending
                          </span>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ol>
              {project.tools && (
                <div className="mt-10">
                  <p className="text-xs tracking-[0.2em] text-brass uppercase">Tools</p>
                  <p className="mt-3 text-sm text-stone-600">{project.tools.join(", ")}</p>
                </div>
              )}
            </div>
          </aside>

          <div className="lg:col-span-9">
            {note && (
              <div className="mb-14 border-l-2 border-brass bg-sand-50 px-6 py-5 text-sm leading-relaxed text-stone-600">
                <span className="font-semibold text-navy-900">Status: {project.status}. </span>
                {note}
              </div>
            )}
            {sectionOrder.map((s, i) => (
              <ProjectSectionBlock
                key={s.key}
                id={s.key}
                index={i + 1}
                title={s.title}
                section={project.sections[s.key]}
              />
            ))}
          </div>
        </Container>
      </div>

      <nav className="border-t border-sand-200 bg-sand-50" aria-label="Next project">
        <Container className="py-14">
          <Link href={`/projects/${next.slug}`} className="group flex items-center justify-between gap-6">
            <div>
              <p className="text-xs tracking-[0.2em] text-brass uppercase">Next project</p>
              <p className="mt-2 font-serif text-3xl text-navy-900">
                {next.category}: {next.title}
              </p>
            </div>
            <span
              className="text-2xl text-navy-900 transition-transform duration-300 group-hover:translate-x-2"
              aria-hidden
            >
              →
            </span>
          </Link>
        </Container>
      </nav>
    </>
  );
}
