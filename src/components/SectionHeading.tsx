type Props = {
  eyebrow: string;
  title: string;
  intro?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "light",
  align = "left",
}: Props) {
  const dark = tone === "dark";
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p
        className={`mb-4 flex items-center gap-3 text-xs font-medium tracking-[0.25em] uppercase ${
          dark ? "text-brass-light" : "text-brass"
        } ${align === "center" ? "justify-center" : ""}`}
      >
        <span className={`h-px w-8 ${dark ? "bg-brass-light" : "bg-brass"}`} aria-hidden />
        {eyebrow}
      </p>
      <h2
        className={`font-serif text-4xl leading-tight font-medium sm:text-5xl ${
          dark ? "text-ivory" : "text-navy-900"
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p className={`mt-5 text-base leading-relaxed ${dark ? "text-sand-200" : "text-stone-600"}`}>
          {intro}
        </p>
      )}
    </div>
  );
}
