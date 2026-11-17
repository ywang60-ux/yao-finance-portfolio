type Props = { children: React.ReactNode; label?: string };

/** A clearly marked slot for content that has not been added yet. */
export default function PendingPanel({ children, label = "Pending" }: Props) {
  return (
    <div className="flex items-start gap-4 border border-dashed border-sand-400/70 bg-sand-50 p-6">
      <span className="mt-0.5 shrink-0 rounded-full border border-stone-600/25 px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-[0.16em] text-stone-600 uppercase">
        {label}
      </span>
      <div className="text-sm leading-relaxed text-stone-600">{children}</div>
    </div>
  );
}
