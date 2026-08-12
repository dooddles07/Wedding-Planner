import type { QuizQuestion } from "@/types";

/**
 * Ten questions, one at a time.
 *
 * Each answer carries weights toward the ten wedding styles. The result page
 * reads the top weights and builds a direction from them — see
 * lib/quiz.ts for the scoring.
 *
 * The markers are running-order times rather than "Question 3 of 10", which
 * is the same structural device the rest of the site uses. Progress is still
 * shown as a bar, because people do want to know how much is left.
 */
export const quizQuestions: QuizQuestion[] = [
  {
    id: "when",
    marker: "the date",
    question: "When are you thinking?",
    note: "A rough season is fine. Most people move the date at least once.",
    kind: "choice",
    options: [
      { value: "within-12", label: "Within a year", hint: "Tight, but plenty do it" },
      { value: "12-18", label: "12 to 18 months", hint: "The comfortable window" },
      { value: "18-plus", label: "Further out than that", hint: "Good — the best places go early" },
      { value: "undecided", label: "No idea yet", hint: "Then let’s start with everything else" },
    ],
  },
  {
    id: "where",
    marker: "the place",
    question: "And roughly where?",
    kind: "choice",
    options: [
      {
        value: "home-county",
        label: "Somewhere near home",
        weights: { classic: 2, garden: 1 },
      },
      {
        value: "countryside",
        label: "Out in the country",
        weights: { garden: 3, romantic: 1 },
      },
      { value: "coast", label: "On the coast", weights: { coastal: 4 } },
      { value: "city", label: "In a city", weights: { modern: 3, minimal: 2 } },
      { value: "abroad", label: "Abroad", weights: { destination: 4 } },
      { value: "open", label: "Completely open", weights: {} },
    ],
  },
  {
    id: "guests",
    marker: "the number",
    question: "How many people?",
    note: "The single number that changes the most about a wedding.",
    kind: "choice",
    options: [
      { value: "under-30", label: "Under 30", weights: { intimate: 4, minimal: 1 } },
      { value: "30-70", label: "30 to 70", weights: { intimate: 2, garden: 1 } },
      { value: "70-120", label: "70 to 120", weights: { classic: 2, garden: 1 } },
      { value: "120-200", label: "120 to 200", weights: { classic: 3, "black-tie": 1 } },
      { value: "200-plus", label: "More than 200", weights: { cultural: 2, "black-tie": 2 } },
    ],
  },
  {
    id: "style",
    marker: "the look",
    question: "Which of these rooms would you rather walk into?",
    note: "Go on instinct. There’s no wrong one and you can change your mind at the end.",
    kind: "image-choice",
    multiple: true,
    options: [
      { value: "modern", label: "Modern", imageId: "style-modern", weights: { modern: 4 } },
      { value: "romantic", label: "Romantic", imageId: "style-romantic", weights: { romantic: 4 } },
      { value: "garden", label: "Garden", imageId: "style-garden", weights: { garden: 4 } },
      { value: "coastal", label: "Coastal", imageId: "style-coastal", weights: { coastal: 4 } },
      { value: "classic", label: "Classic", imageId: "style-classic", weights: { classic: 4 } },
      { value: "intimate", label: "Intimate", imageId: "style-intimate", weights: { intimate: 4 } },
      { value: "black-tie", label: "Black tie", imageId: "style-black-tie", weights: { "black-tie": 4 } },
      { value: "minimal", label: "Minimal", imageId: "style-minimal", weights: { minimal: 4 } },
    ],
  },
  {
    id: "priority",
    marker: "what matters",
    question: "If the budget got tight, what would you protect?",
    note: "Pick two. This is the question that actually decides how we’d spend your money.",
    kind: "choice",
    multiple: true,
    options: [
      { value: "food", label: "The food and wine", weights: { intimate: 2, garden: 1 } },
      { value: "photography", label: "The photographs", weights: { romantic: 1, classic: 1 } },
      { value: "music", label: "The band", weights: { modern: 1, "black-tie": 2 } },
      { value: "flowers", label: "The flowers and the room", weights: { romantic: 2, garden: 2 } },
      { value: "guests", label: "Everyone being comfortable", weights: { classic: 2, intimate: 1 } },
      { value: "venue", label: "The place itself", weights: { destination: 2, classic: 1 } },
    ],
  },
  {
    id: "involvement",
    marker: "your part",
    question: "How much of this do you want to do yourself?",
    kind: "choice",
    options: [
      {
        value: "all-of-it",
        label: "Most of it — I’m enjoying it",
        hint: "You’ll want day management, and maybe design",
      },
      {
        value: "the-fun-parts",
        label: "The interesting bits, not the admin",
        hint: "Partial planning territory",
      },
      {
        value: "decisions-only",
        label: "Decisions only. Someone else does the rest",
        hint: "Full planning",
      },
      {
        value: "as-little-as-possible",
        label: "As little as humanly possible",
        hint: "Full planning, and we’ll narrow every choice to three",
      },
    ],
  },
  {
    id: "help",
    marker: "the help",
    question: "What’s already sorted?",
    kind: "choice",
    multiple: true,
    optional: true,
    options: [
      { value: "nothing", label: "Nothing at all" },
      { value: "venue", label: "The venue" },
      { value: "date", label: "The date" },
      { value: "photographer", label: "The photographer" },
      { value: "caterer", label: "The caterer" },
      { value: "dress-suit", label: "What we’re wearing" },
    ],
  },
  {
    id: "budget",
    marker: "the money",
    question: "Roughly what are you working with?",
    note: "Everything in, including rings and the honeymoon if that’s how you’re counting. Nobody sees this but us.",
    kind: "choice",
    options: [
      { value: "under-20k", label: "Under £20,000", weights: { intimate: 3, minimal: 2 } },
      { value: "20-40k", label: "£20,000 to £40,000", weights: { garden: 1, intimate: 1 } },
      { value: "40-75k", label: "£40,000 to £75,000", weights: { classic: 2, romantic: 1 } },
      { value: "75-150k", label: "£75,000 to £150,000", weights: { "black-tie": 2, destination: 2 } },
      { value: "150k-plus", label: "Over £150,000", weights: { "black-tie": 3, destination: 3 } },
      { value: "unsure", label: "Genuinely don’t know yet", weights: {} },
    ],
  },
  {
    id: "atmosphere",
    marker: "the feeling",
    question: "At eleven at night, what’s happening?",
    note: "Be honest.",
    kind: "choice",
    options: [
      {
        value: "dancing",
        label: "The floor is full and the band has gone over",
        weights: { modern: 2, "black-tie": 2 },
      },
      {
        value: "table",
        label: "Most people are still at the table",
        weights: { intimate: 3, garden: 1 },
      },
      {
        value: "outside",
        label: "Everyone’s drifted outside",
        weights: { coastal: 2, garden: 2, destination: 1 },
      },
      {
        value: "quiet",
        label: "It’s winding down and that’s fine",
        weights: { minimal: 2, intimate: 2 },
      },
    ],
  },
  {
    id: "stage",
    marker: "right now",
    question: "Where are you actually up to?",
    kind: "choice",
    options: [
      { value: "just-engaged", label: "Just engaged, still telling people" },
      { value: "looking", label: "Looking at venues" },
      { value: "booked", label: "Venue booked, everything else open" },
      { value: "mid", label: "Halfway and losing track" },
      { value: "close", label: "Close, and something’s gone wrong" },
    ],
  },
];

export const quizIntro = {
  eyebrow: "Ten questions",
  heading: "Let’s find your wedding.",
  body: "It takes about three minutes. At the end you get a direction — two styles, a rough shape, the venues that suit it and what we’d suggest doing first. No account needed, and nothing is sent anywhere unless you ask us to.",
};
