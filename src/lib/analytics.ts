/**
 * A typed event surface with no analytics behind it yet.
 *
 * Nothing leaves the browser. Point `sink` at Plausible, Fathom, PostHog or a
 * first-party endpoint and every call site starts reporting without edits.
 * Names are fixed here so they can’t drift across components.
 */

export type AnalyticsEvent =
  | { name: "page_view"; path: string }
  | { name: "cta_click"; label: string; location: string }
  | { name: "quiz_started" }
  | { name: "quiz_step"; step: number; questionId: string }
  | { name: "quiz_completed"; primaryStyle: string }
  | { name: "lead_form_started"; source: string }
  | { name: "lead_form_completed"; source: string }
  | { name: "venue_viewed"; slug: string }
  | { name: "vendor_viewed"; slug: string }
  | { name: "wedding_story_viewed"; slug: string }
  | { name: "inspiration_saved"; slug: string }
  | { name: "inspiration_unsaved"; slug: string }
  | { name: "budget_planner_used"; total: number; guests: number }
  | { name: "checklist_started" }
  | { name: "checklist_task_completed"; taskId: string }
  | { name: "timeline_saved" }
  | { name: "account_created" }
  | { name: "consultation_requested"; source: string }
  | { name: "guide_downloaded" }
  | { name: "newsletter_signup"; location: string }
  | { name: "search_performed"; scope: string; query: string }
  | { name: "filter_applied"; scope: string; facet: string; value: string }
  | { name: "wedding_site_published"; slug: string };

type Sink = (event: AnalyticsEvent) => void;

/** Swap this for a real client. Keep it synchronous and non-blocking. */
let sink: Sink = () => undefined;

export function setAnalyticsSink(next: Sink) {
  sink = next;
}

export function track(event: AnalyticsEvent) {
  try {
    sink(event);
  } catch {
    // Analytics must never break a page.
  }
}
