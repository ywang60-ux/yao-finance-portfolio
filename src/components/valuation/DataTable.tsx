type Props = {
  head: string[];
  rows: React.ReactNode[][];
  /** Index of a row to emphasize (e.g. the subject company or a total). */
  highlightRow?: number;
  caption?: string;
  /** Left-align every column (for text tables rather than numeric ones). */
  alignLeft?: boolean;
};

/** Simple financial table: first column is the row label, the rest are right-aligned numbers. */
export default function DataTable({ head, rows, highlightRow, caption, alignLeft }: Props) {
  return (
    <div className="overflow-x-auto border border-sand-200 bg-white">
      <table className="w-full min-w-[480px] text-left text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b border-sand-200 bg-sand-50">
            {head.map((h, j) => (
              <th
                key={h}
                scope="col"
                className={`px-5 py-3 text-xs font-medium tracking-[0.14em] text-brass uppercase ${j > 0 && !alignLeft ? "text-right" : ""}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              className={`border-b border-sand-100 last:border-b-0 ${i === highlightRow ? "bg-navy-900/[0.04] font-medium" : ""}`}
            >
              {r.map((c, j) => (
                <td
                  key={j}
                  className={`px-5 py-3.5 ${j === 0 ? "min-w-[11rem] text-navy-900" : alignLeft ? "text-stone-600" : "text-right text-stone-600 tabular-nums"}`}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
