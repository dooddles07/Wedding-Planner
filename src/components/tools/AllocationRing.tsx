import type { BudgetItem } from "@/types";
import { BUDGET_COLOURS } from "@/lib/budget";
import { formatCurrency } from "@/lib/utils";

/**
 * The allocation ring.
 *
 * Hand-drawn in SVG rather than pulled from a charting library. This is one
 * donut with no axes, no tooltips and no legend — Recharts was 100KB of
 * JavaScript to draw thirteen arcs, which is not a trade worth making on a
 * page couples open on a phone.
 *
 * Each segment is a circle with a dash pattern: the dash equals its share of
 * the circumference, and the offset walks it round. Rotating -90° starts the
 * ring at twelve o'clock.
 */
export function AllocationRing({
  items,
  total,
  label,
}: {
  items: BudgetItem[];
  /** Sum of allocations, passed in so the ring never recomputes it. */
  total: number;
  label: string;
}) {
  const RADIUS = 42;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  // Offsets are worked out before the JSX rather than accumulated inside it,
  // so rendering stays pure — the arc positions are data, not a side effect.
  const segments = items
    .filter((item) => item.allocated > 0)
    .reduce<{ item: BudgetItem; dash: number; offset: number }[]>(
      (acc, item) => {
        const walked = acc.reduce(
          (sum, previous) => sum + previous.item.allocated,
          0,
        );
        const share = total > 0 ? item.allocated / total : 0;
        return [
          ...acc,
          {
            item,
            dash: share * CIRCUMFERENCE,
            offset: total > 0 ? -(walked / total) * CIRCUMFERENCE : 0,
          },
        ];
      },
      [],
    );

  return (
    <figure className="m-0">
      <svg
        viewBox="0 0 100 100"
        className="w-full"
        role="img"
        aria-label={`${label}. ${segments
          .map(({ item }) => `${item.label}, ${formatCurrency(item.allocated)}`)
          .join(". ")}`}
      >
        {/* The track, so a part-allocated budget still reads as a ring. */}
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke="var(--color-linen)"
          strokeWidth="15"
        />

        {segments.map(({ item, dash, offset }) => (
          <circle
            key={item.category}
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke={BUDGET_COLOURS[item.category]}
            strokeWidth="15"
            strokeDasharray={`${dash} ${CIRCUMFERENCE}`}
            strokeDashoffset={offset}
            transform="rotate(-90 50 50)"
            className="transition-[stroke-dasharray,stroke-dashoffset] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          />
        ))}
      </svg>
    </figure>
  );
}
