import type { QuizAnswers, QuizResult, WeddingStyleId } from "@/types";
import { quizQuestions } from "@/content/quiz";
import { styleById, weddingStyles } from "@/content/styles";
import { venues } from "@/content/venues";
import { inspiration } from "@/content/inspiration";

/**
 * Scoring.
 *
 * Every answer carries weights toward the ten styles. Two styles win, and the
 * pair of them is the result — because almost every real wedding sits between
 * two, and saying "you are a Garden wedding" would be both less true and less
 * useful.
 */
export function scoreQuiz(answers: QuizAnswers) {
  const scores = Object.fromEntries(
    weddingStyles.map((style) => [style.id, 0]),
  ) as Record<WeddingStyleId, number>;

  for (const question of quizQuestions) {
    const answer = answers[question.id];
    if (answer == null) continue;

    const chosen = Array.isArray(answer) ? answer : [String(answer)];
    for (const value of chosen) {
      const option = question.options?.find((item) => item.value === value);
      if (!option?.weights) continue;
      for (const [id, weight] of Object.entries(option.weights)) {
        scores[id as WeddingStyleId] += weight ?? 0;
      }
    }
  }

  return scores;
}

/** Which planning package the answers point at. */
function recommendService(answers: QuizAnswers): string {
  const involvement = answers.involvement as string | undefined;
  const where = answers.where as string | undefined;
  const guests = answers.guests as string | undefined;

  if (where === "abroad") return "destination-weddings";
  if (involvement === "as-little-as-possible" || involvement === "decisions-only") {
    return "full-planning";
  }
  if (involvement === "all-of-it") return "wedding-day-management";
  if (guests === "200-plus" || guests === "120-200") return "full-planning";
  return "partial-planning";
}

/** The shape of the day, in words, drawn from what they actually answered. */
function describeDirection(
  answers: QuizAnswers,
  primary: WeddingStyleId,
  secondary: WeddingStyleId,
): string[] {
  const words = new Set<string>();

  words.add(styleById[primary].name);
  words.add(styleById[secondary].name);

  const guests = answers.guests as string | undefined;
  if (guests === "under-30") words.add("Very small");
  else if (guests === "30-70") words.add("Intimate");
  else if (guests === "200-plus") words.add("Large");

  const atmosphere = answers.atmosphere as string | undefined;
  if (atmosphere === "dancing") words.add("Late");
  else if (atmosphere === "table") words.add("Table-led");
  else if (atmosphere === "outside") words.add("Outdoors");
  else if (atmosphere === "quiet") words.add("Unhurried");

  const priorities = answers.priority;
  if (Array.isArray(priorities)) {
    if (priorities.includes("food")) words.add("Food-first");
    if (priorities.includes("guests")) words.add("Guest-focused");
    if (priorities.includes("music")) words.add("Music-led");
  }

  return [...words].slice(0, 5);
}

function nextSteps(answers: QuizAnswers, serviceSlug: string): string[] {
  const stage = answers.stage as string | undefined;
  const when = answers.when as string | undefined;

  const steps: string[] = [];

  if (stage === "just-engaged" || stage === "looking") {
    steps.push("Settle the guest list before the venue. It decides everything else.");
  }
  if (when === "within-12") {
    steps.push("Book venue, caterer and photographer in the next six weeks — those three run out first.");
  } else {
    steps.push("Shortlist five venues and see three. Any more and they blur together.");
  }
  if (answers.budget === "unsure") {
    steps.push("Put a real number on the budget, even a rough one. Everything downstream depends on it.");
  }

  steps.push(
    serviceSlug === "wedding-day-management"
      ? "Keep planning it yourselves, and put someone else in charge of the day."
      : "Talk to us before you sign anything. Contract review is the cheapest hour you’ll spend.",
  );

  return steps.slice(0, 4);
}

export function buildResult(answers: QuizAnswers): QuizResult {
  const scores = scoreQuiz(answers);

  const ranked = [...weddingStyles].sort((a, b) => {
    const diff = scores[b.id] - scores[a.id];
    // Stable order for ties, so the same answers always give the same result.
    return diff !== 0 ? diff : weddingStyles.indexOf(a) - weddingStyles.indexOf(b);
  });

  const [primary, secondary, third] = ranked;
  const serviceSlug = recommendService(answers);

  const recommendedVenues = venues
    .filter((venue) => venue.styleIds.includes(primary.id) || venue.styleIds.includes(secondary.id))
    .slice(0, 3);

  const recommendedInspiration = inspiration
    .filter((item) => item.styleIds.includes(primary.id) || item.styleIds.includes(secondary.id))
    .slice(0, 6);

  return {
    direction: describeDirection(answers, primary.id, secondary.id),
    headline: `${primary.name} with a bit of ${secondary.name.toLowerCase()}`,
    summary: `${primary.description} Underneath it there is something of the ${secondary.name.toLowerCase()} wedding too — ${secondary.tagline.replace(
      /\.$/,
      "",
    ).toLowerCase()} — and that pairing usually means the venue matters more than the styling.`,
    primaryStyle: primary,
    supportingStyles: [secondary, third],
    recommendedServiceSlug: serviceSlug,
    recommendedVenueSlugs: recommendedVenues.map((venue) => venue.slug),
    recommendedInspirationSlugs: recommendedInspiration.map((item) => item.slug),
    nextSteps: nextSteps(answers, serviceSlug),
  };
}

/** Answered enough to produce something meaningful. */
export function isComplete(answers: QuizAnswers) {
  const required = quizQuestions.filter((question) => !question.optional);
  return required.every((question) => {
    const answer = answers[question.id];
    if (answer == null) return false;
    return Array.isArray(answer) ? answer.length > 0 : answer !== "";
  });
}
