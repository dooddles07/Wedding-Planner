import type { Task, TaskCategory } from "@/types";

export const TASK_CATEGORY_LABEL: Record<TaskCategory, string> = {
  planning: "Planning",
  venue: "Venue",
  vendors: "Suppliers",
  attire: "What you’re wearing",
  beauty: "Hair and make-up",
  guests: "Guests",
  invitations: "Paper",
  ceremony: "Ceremony",
  reception: "Reception",
  photography: "Photography",
  transport: "Transport",
  honeymoon: "Honeymoon",
  legal: "Legal",
  "final-week": "Final week",
  "wedding-day": "The day",
};

/**
 * The standard checklist.
 *
 * `monthsBefore` places each task on the timeline; 0 is the day itself. The
 * order and the timings are the ones a planner actually works to — book the
 * four things that run out first, then everything else follows.
 */
const TEMPLATE: Omit<Task, "id" | "done" | "dueDate" | "custom">[] = [
  /* 18–12 months */
  { title: "Agree a rough budget, even a wrong one", category: "planning", monthsBefore: 18, priority: "high", note: "Everything downstream depends on it. Revise it in month three." },
  { title: "Draft the guest list", category: "guests", monthsBefore: 18, priority: "high", note: "Before the venue. It decides which venues are even possible." },
  { title: "Decide roughly when — season, not date", category: "planning", monthsBefore: 18, priority: "high", note: null },
  { title: "Shortlist five venues, see three", category: "venue", monthsBefore: 17, priority: "high", note: "More than three and they blur into one another." },
  { title: "Book the venue", category: "venue", monthsBefore: 15, priority: "high", note: null },
  { title: "Book the photographer", category: "photography", monthsBefore: 14, priority: "high", note: "One of the four things that genuinely runs out." },
  { title: "Book the caterer, or confirm the in-house one", category: "vendors", monthsBefore: 14, priority: "high", note: null },
  { title: "Book the band or DJ", category: "vendors", monthsBefore: 13, priority: "normal", note: null },
  { title: "Send save-the-dates", category: "invitations", monthsBefore: 12, priority: "normal", note: "Only if the date is genuinely fixed." },
  { title: "Start looking for what you’ll wear", category: "attire", monthsBefore: 12, priority: "normal", note: "Made-to-measure needs twelve months. Off the rail needs three." },

  /* 12–9 months */
  { title: "Book the florist", category: "vendors", monthsBefore: 11, priority: "normal", note: "Book the grower, not the flower — a specific stem twelve months out is a guess." },
  { title: "Give notice at the register office", category: "legal", monthsBefore: 10, priority: "high", note: "In England and Wales you must give notice at least 29 days before, and it lasts 12 months." },
  { title: "Sort accommodation blocks for guests", category: "guests", monthsBefore: 10, priority: "normal", note: null },
  { title: "Book hair and make-up, with a trial", category: "beauty", monthsBefore: 9, priority: "normal", note: null },
  { title: "Agree the design direction", category: "planning", monthsBefore: 9, priority: "normal", note: null },
  { title: "Book the videographer if you want one", category: "photography", monthsBefore: 9, priority: "low", note: null },

  /* 9–6 months */
  { title: "Order the stationery", category: "invitations", monthsBefore: 8, priority: "normal", note: "Letterpress needs eight weeks. Digital needs a fortnight." },
  { title: "Book transport for you and for guests", category: "transport", monthsBefore: 7, priority: "normal", note: "Ask whether a mechanic travels with a vintage car. Ask us why." },
  { title: "Book the cake", category: "vendors", monthsBefore: 7, priority: "low", note: null },
  { title: "Book the honeymoon", category: "honeymoon", monthsBefore: 7, priority: "low", note: null },
  { title: "Plan the ceremony — readings, music, order", category: "ceremony", monthsBefore: 6, priority: "normal", note: null },
  { title: "First fitting", category: "attire", monthsBefore: 6, priority: "normal", note: null },
  { title: "Book any furniture, linen and glass hire", category: "reception", monthsBefore: 6, priority: "normal", note: null },

  /* 6–3 months */
  { title: "Send the invitations", category: "invitations", monthsBefore: 5, priority: "high", note: "Twelve weeks out for a UK wedding, sixteen if people are flying." },
  { title: "Build the wedding website", category: "guests", monthsBefore: 5, priority: "normal", note: "Travel, accommodation, dress code — everything that would make the envelope heavy." },
  { title: "Menu tasting", category: "vendors", monthsBefore: 4, priority: "normal", note: null },
  { title: "Buy the rings", category: "attire", monthsBefore: 4, priority: "normal", note: "Four months if they’re being made." },
  { title: "Confirm the lighting plan", category: "reception", monthsBefore: 4, priority: "low", note: "The single most under-budgeted line in most weddings." },
  { title: "Chase the guests who haven’t replied", category: "guests", monthsBefore: 3, priority: "high", note: "They exist. There are always eleven of them." },
  { title: "Second fitting", category: "attire", monthsBefore: 3, priority: "normal", note: null },

  /* 3 months–1 month */
  { title: "Draft the running order", category: "planning", monthsBefore: 2, priority: "high", note: null },
  { title: "Final numbers to the caterer", category: "vendors", monthsBefore: 1, priority: "high", note: null },
  { title: "Seating plan", category: "guests", monthsBefore: 1, priority: "high", note: "Do it in one sitting, with wine. Three drafts is the average." },
  { title: "Final payments to suppliers", category: "vendors", monthsBefore: 1, priority: "high", note: null },
  { title: "Confirm timings with every supplier", category: "planning", monthsBefore: 1, priority: "high", note: null },
  { title: "Write the speeches", category: "reception", monthsBefore: 1, priority: "normal", note: "Four minutes. Nobody has ever wanted a longer one." },

  /* Final week */
  { title: "Final dress or suit fitting", category: "final-week", monthsBefore: 0.25, priority: "high", note: null },
  { title: "Pack the kit box", category: "final-week", monthsBefore: 0.25, priority: "high", note: "Pins, thread, plasters, painkillers, a lighter, spare vows, phone chargers." },
  { title: "Brief whoever is holding the rings", category: "final-week", monthsBefore: 0.25, priority: "normal", note: null },
  { title: "Print the running order for suppliers", category: "final-week", monthsBefore: 0.25, priority: "high", note: null },
  { title: "Check the weather and make the call", category: "final-week", monthsBefore: 0.25, priority: "high", note: "The plan was made in month two. Now you just pick one." },

  /* The day */
  { title: "Eat breakfast", category: "wedding-day", monthsBefore: 0, priority: "high", note: "Everyone forgets. Everyone regrets it by two." },
  { title: "Hand the rings and the paperwork to someone else", category: "wedding-day", monthsBefore: 0, priority: "high", note: null },
  { title: "Put your phone in a drawer", category: "wedding-day", monthsBefore: 0, priority: "normal", note: null },
];

export function seedTasks(): Task[] {
  return TEMPLATE.map((task, index) => ({
    ...task,
    id: `seed-${index}`,
    done: false,
    dueDate: null,
    custom: false,
  }));
}

/** The bands the timeline is drawn in. */
export const TIMELINE_BANDS = [
  { months: 18, label: "18 months out", note: "Budget, guest list, venue" },
  { months: 12, label: "12 months out", note: "The four bookings that run out" },
  { months: 9, label: "9 months out", note: "Legal notice, flowers, beauty" },
  { months: 6, label: "6 months out", note: "Paper, transport, ceremony" },
  { months: 3, label: "3 months out", note: "Invitations, tasting, chasing" },
  { months: 1, label: "1 month out", note: "Numbers, seating, payments" },
  { months: 0.25, label: "The final week", note: "Confirm, pack, decide" },
  { months: 0, label: "The day", note: "Nothing left to do" },
];
