type Props = { topics: string[]; tone?: "light" | "dark" };

export default function TopicList({ topics, tone = "light" }: Props) {
  return (
    <ul className="flex flex-wrap gap-2">
      {topics.map((t) => (
        <li
          key={t}
          className={`rounded-sm border px-2.5 py-1 text-xs ${
            tone === "dark"
              ? "border-white/15 text-sand-100"
              : "border-sand-200 bg-white text-stone-600"
          }`}
        >
          {t}
        </li>
      ))}
    </ul>
  );
}
