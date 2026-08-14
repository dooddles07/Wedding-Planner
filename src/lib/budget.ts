import type { BudgetCategory, BudgetItem, BudgetPlan, WeddingStyleId } from "@/types";

/**
 * How a wedding budget actually splits.
 *
 * The base shares are a working starting point, not a claim about national
 * averages — the UI says so. What matters more than the starting numbers is
 * that they respond to the four things that genuinely move them: how many
 * people are eating, where it is, what style it is, and how much planning
 * help is being bought.
 */

export const BUDGET_BASE: { category: BudgetCategory; label: string; share: number }[] = [
  { category: "venue", label: "Venue hire", share: 0.19 },
  { category: "catering", label: "Food and drink", share: 0.23 },
  { category: "photography", label: "Photography", share: 0.08 },
  { category: "videography", label: "Film", share: 0.04 },
  { category: "florals", label: "Flowers", share: 0.07 },
  { category: "decor", label: "Furniture, linen and light", share: 0.05 },
  { category: "attire", label: "What you’re wearing", share: 0.07 },
  { category: "entertainment", label: "Music", share: 0.07 },
  { category: "stationery", label: "Paper", share: 0.02 },
  { category: "transport", label: "Getting people there", share: 0.02 },
  { category: "planner", label: "Planning", share: 0.08 },
  { category: "misc", label: "Everything else", share: 0.03 },
  { category: "contingency", label: "Just in case", share: 0.05 },
];

export const BUDGET_NOTES: Partial<Record<BudgetCategory, string>> = {
  catering: "The one number that moves most with guest count. Assume drinks are half of it.",
  venue: "Ask what’s included. Chairs, tables and cleaning are often not.",
  contingency: "Not optional. Something always comes up in the last three weeks.",
  planner: "Full planning is usually 10–15% of total spend.",
  photography: "The only thing you keep. Most couples move money here, not away from it.",
};

export type PlanningLevel = BudgetPlan["planningLevel"];

const PLANNER_SHARE: Record<PlanningLevel, number> = {
  full: 0.12,
  partial: 0.07,
  "day-of": 0.03,
  none: 0,
};

/** Rough regional multipliers on the venue and catering lines only. */
const LOCATION_WEIGHT: Record<string, { venue: number; catering: number }> = {
  London: { venue: 1.45, catering: 1.3 },
  "South East": { venue: 1.2, catering: 1.12 },
  "East of England": { venue: 1, catering: 1 },
  "South West": { venue: 1.05, catering: 1 },
  Midlands: { venue: 0.85, catering: 0.92 },
  North: { venue: 0.8, catering: 0.88 },
  Scotland: { venue: 0.9, catering: 0.95 },
  Wales: { venue: 0.82, catering: 0.9 },
  Abroad: { venue: 1.1, catering: 1.05 },
};

export const BUDGET_LOCATIONS = Object.keys(LOCATION_WEIGHT);

/** Styles that reliably push money in one direction. */
const STYLE_SHIFT: Partial<Record<WeddingStyleId, Partial<Record<BudgetCategory, number>>>> = {
  "black-tie": { entertainment: 1.5, attire: 1.3, florals: 1.1, catering: 1.1 },
  minimal: { florals: 0.5, decor: 0.6, stationery: 0.7 },
  garden: { florals: 1.4, decor: 1.2 },
  romantic: { florals: 1.45, decor: 1.25 },
  destination: { transport: 3, venue: 1.2, photography: 1.15 },
  intimate: { catering: 1.35, venue: 0.7, entertainment: 0.6 },
  modern: { decor: 1.2, florals: 0.8 },
  coastal: { decor: 1.15, transport: 1.4 },
  classic: {},
  cultural: { catering: 1.2, decor: 1.2, entertainment: 1.2 },
};

export function buildBudget({
  total,
  guestCount,
  location,
  styleId,
  planningLevel,
}: {
  total: number;
  guestCount: number;
  location: string;
  styleId: WeddingStyleId | null;
  planningLevel: PlanningLevel;
}): BudgetItem[] {
  const region = LOCATION_WEIGHT[location] ?? LOCATION_WEIGHT["East of England"];
  const styleShift = styleId ? (STYLE_SHIFT[styleId] ?? {}) : {};

  // Catering scales with heads against a 100-guest reference. A wedding for
  // 40 spends proportionally more per head and less in total.
  const headScale = Math.sqrt(Math.max(guestCount, 10) / 100);

  const weighted = BUDGET_BASE.map((line) => {
    let share = line.share;

    if (line.category === "planner") share = PLANNER_SHARE[planningLevel];
    if (line.category === "venue") share *= region.venue;
    if (line.category === "catering") share *= region.catering * (0.7 + 0.3 * headScale * 2);

    const shift = styleShift[line.category];
    if (shift) share *= shift;

    // Attire and film barely move with guest count; the rest do a little.
    if (["attire", "videography", "photography", "stationery"].includes(line.category)) {
      share *= 1;
    } else {
      share *= 0.85 + 0.15 * headScale;
    }

    return { ...line, share };
  });

  // Renormalise so the shares always sum to exactly 1.
  const sum = weighted.reduce((acc, line) => acc + line.share, 0) || 1;

  return weighted.map((line) => {
    const share = line.share / sum;
    return {
      category: line.category,
      label: line.label,
      share,
      allocated: Math.round((total * share) / 10) * 10,
      spent: 0,
      note: BUDGET_NOTES[line.category],
    };
  });
}

export function budgetTotals(items: BudgetItem[]) {
  const allocated = items.reduce((acc, item) => acc + item.allocated, 0);
  const spent = items.reduce((acc, item) => acc + item.spent, 0);
  return { allocated, spent, remaining: allocated - spent };
}

/** Per-head, on the lines that genuinely scale with a person turning up. */
export function perHead(items: BudgetItem[], guestCount: number) {
  const scaling: BudgetCategory[] = ["catering", "stationery", "transport"];
  const total = items
    .filter((item) => scaling.includes(item.category))
    .reduce((acc, item) => acc + item.allocated, 0);
  return Math.round(total / Math.max(guestCount, 1));
}

/**
 * Swatches for the allocation chart.
 *
 * Deliberately no ember. Orange is the interaction colour on this site — CTA,
 * active, saved, progress — and a 28% orange wedge in a donut would make the
 * catering line look like a button. The ramp runs forest → olive → champagne
 * → earth instead, which keeps the chart in the brand and lets the one orange
 * thing on the page still mean something.
 */
export const BUDGET_COLOURS: Record<BudgetCategory, string> = {
  venue: "#2C5745",
  catering: "#3D7059",
  photography: "#5E7A52",
  videography: "#7E8C5A",
  florals: "#9A9A63",
  decor: "#B5A971",
  attire: "#C9BA80",
  entertainment: "#D9CF85",
  stationery: "#C4B79A",
  transport: "#A38F73",
  planner: "#7E6B52",
  misc: "#5C513A",
  contingency: "#2E2910",
};
