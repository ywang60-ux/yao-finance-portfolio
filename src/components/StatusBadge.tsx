import type { ProjectStatus } from "@/data/projects";

const styles: Record<ProjectStatus, string> = {
  "In Progress": "border-brass/50 bg-brass/10 text-[#7a5f37]",
  Planned: "border-stone-600/25 bg-sand-50 text-stone-600",
  Completed: "border-navy-700/30 bg-navy-700/10 text-navy-800",
};

const dots: Record<ProjectStatus, string> = {
  "In Progress": "bg-brass animate-pulse",
  Planned: "bg-sand-400",
  Completed: "bg-navy-700",
};

export default function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.68rem] font-semibold tracking-[0.16em] uppercase ${styles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dots[status]}`} aria-hidden />
      {status}
    </span>
  );
}
