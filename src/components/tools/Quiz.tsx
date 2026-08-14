"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { QuizAnswers, QuizQuestion } from "@/types";
import { quizQuestions } from "@/content/quiz";
import { buildResult } from "@/lib/quiz";
import { venueBySlug } from "@/content/venues";
import { serviceBySlug } from "@/content/services";
import { inspirationBySlug } from "@/content/inspiration";
import { Container } from "@/components/editorial/Layout";
import { Photo } from "@/components/editorial/Photo";
import { InspirationTile } from "@/components/cards/InspirationTile";
import { VenueCard } from "@/components/cards/VenueCard";
import { LeadForm } from "@/components/forms/LeadForm";
import { ButtonLink } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { cn, formatCurrency } from "@/lib/utils";

/**
 * The quiz — the primary lead mechanism.
 *
 * One question a screen, answers recorded as you go, and no submit button on
 * single-choice questions: choosing advances. It removes a whole click per
 * question, which across ten questions is the difference between finishing and
 * not.
 *
 * The homepage teaser can pre-answer the first question via ?when=, in which
 * case the quiz opens on question two with the first already recorded.
 */
export function Quiz() {
  const params = useSearchParams();
  const reduced = useReducedMotion();

  const seeded = params.get("when");
  const [answers, setAnswers] = useState<QuizAnswers>(
    seeded ? { when: seeded } : {},
  );
  const [step, setStep] = useState(seeded ? 1 : 0);
  const [started, setStarted] = useState(Boolean(seeded));
  const [showResult, setShowResult] = useState(false);

  const question = quizQuestions[step];
  const progress = (step / quizQuestions.length) * 100;

  const result = useMemo(
    () => (showResult ? buildResult(answers) : null),
    [showResult, answers],
  );

  function record(id: string, value: string | string[]) {
    if (!started) {
      setStarted(true);
      track({ name: "quiz_started" });
    }
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  // Takes the answers explicitly rather than reading the `answers` state
  // closed over at render time — `choose()` schedules this via setTimeout
  // right after recording a selection, so the closure would still see the
  // pre-selection answers and the final question's pick would be missing
  // from the result. See audit P1-5.
  function advance(currentAnswers: QuizAnswers) {
    track({ name: "quiz_step", step: step + 1, questionId: question.id });
    if (step + 1 >= quizQuestions.length) {
      const built = buildResult(currentAnswers);
      track({ name: "quiz_completed", primaryStyle: built.primaryStyle.id });
      setShowResult(true);
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      return;
    }
    setStep((current) => current + 1);
  }

  function choose(id: string, value: string, multiple: boolean) {
    if (!multiple) {
      const next = { ...answers, [id]: value };
      record(id, value);
      // Let the selection register visually before moving on.
      setTimeout(() => advance(next), reduced ? 0 : 220);
      return;
    }

    const current = (answers[id] as string[] | undefined) ?? [];
    record(
      id,
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  }

  if (showResult && result) {
    return <Result result={result} answers={answers} />;
  }

  const answered = answers[question.id];
  const hasAnswer = Array.isArray(answered) ? answered.length > 0 : answered != null;

  return (
    <Container className="pt-32 pb-24 lg:pt-40 lg:pb-32">
      {/* --- Progress ---------------------------------------------------- */}
      <div className="mx-auto max-w-3xl">
        <div className="flex items-baseline justify-between gap-6">
          <p className="eyebrow text-ink-50">{question.marker}</p>
          <p className="font-mono text-[0.6875rem] tracking-wide text-ink-50 tabular-nums">
            {step + 1} / {quizQuestions.length}
          </p>
        </div>
        <div className="mt-3 h-px w-full bg-ink/15">
          <motion.div
            className="h-full bg-ember"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: reduced ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {/* --- Question ------------------------------------------------------ */}
      <div className="mx-auto mt-14 max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -14 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <fieldset>
              <legend className="max-w-[20ch] font-display text-[clamp(1.75rem,4.4vw,3.25rem)] leading-[1.06] font-light">
                {question.question}
              </legend>
              {question.note ? (
                <p className="mt-5 max-w-[52ch] font-sans text-base leading-[1.7] text-ink-70">
                  {question.note}
                </p>
              ) : null}

              <div className="mt-10">
                {question.kind === "image-choice" ? (
                  <ImageChoices
                    question={question}
                    selected={(answers[question.id] as string[]) ?? []}
                    onChoose={(value) => choose(question.id, value, true)}
                  />
                ) : (
                  <TextChoices
                    question={question}
                    selected={answers[question.id]}
                    onChoose={(value) =>
                      choose(question.id, value, Boolean(question.multiple))
                    }
                  />
                )}
              </div>
            </fieldset>
          </motion.div>
        </AnimatePresence>

        {/* --- Controls ---------------------------------------------------- */}
        <div className="mt-12 flex items-center justify-between gap-6 border-t border-ink/12 pt-6">
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            disabled={step === 0}
            className="min-h-11 font-mono text-[0.6875rem] tracking-[0.14em] text-ink-50 uppercase transition-colors hover:text-ink disabled:opacity-30"
          >
            Back
          </button>

          {question.multiple || question.optional ? (
            <button
              type="button"
              onClick={() => advance(answers)}
              className="inline-flex min-h-11 items-center gap-3 bg-ember px-6 font-mono text-[0.6875rem] tracking-[0.14em] text-ink uppercase transition-colors hover:bg-ink hover:text-champagne"
            >
              {hasAnswer ? "Next" : "Skip"}
              <svg aria-hidden viewBox="0 0 20 10" width="18" height="9" fill="none">
                <path d="M0 5h18M14 1l4 4-4 4" stroke="currentColor" strokeWidth="1.25" />
              </svg>
            </button>
          ) : (
            <p className="font-mono text-[0.625rem] tracking-wide text-ink-50">
              Choose one to continue
            </p>
          )}
        </div>
      </div>
    </Container>
  );
}

/* -------------------------------------------------------------------------
   Answer types
   ------------------------------------------------------------------------- */

function TextChoices({
  question,
  selected,
  onChoose,
}: {
  question: QuizQuestion;
  selected: QuizAnswers[string];
  onChoose: (value: string) => void;
}) {
  const chosen = Array.isArray(selected) ? selected : selected != null ? [String(selected)] : [];

  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {question.options?.map((option) => {
        const on = chosen.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChoose(option.value)}
            aria-pressed={on}
            className={cn(
              "group/opt flex min-h-16 flex-col justify-center border p-5 text-left transition-colors duration-200",
              on
                ? "border-ember bg-ember-wash"
                : "border-ink/20 hover:border-ink/50 hover:bg-linen/60",
            )}
          >
            <span className="font-sans text-[1.0625rem] leading-snug">{option.label}</span>
            {option.hint ? (
              <span className="mt-1.5 font-mono text-[0.625rem] leading-relaxed tracking-wide text-ink-50">
                {option.hint}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function ImageChoices({
  question,
  selected,
  onChoose,
}: {
  question: QuizQuestion;
  selected: string[];
  onChoose: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
      {question.options?.map((option) => {
        const on = selected.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChoose(option.value)}
            aria-pressed={on}
            className="group/img relative text-left"
          >
            <div
              className={cn(
                "relative overflow-hidden transition-all duration-300",
                on ? "ring-2 ring-ember ring-offset-2 ring-offset-paper" : "",
              )}
            >
              {option.imageId ? (
                <Photo
                  photoKey={option.imageId}
                  ratio="portrait"
                  sizes="(min-width: 640px) 22vw, 45vw"
                  imageClassName={cn(
                    "transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    "group-hover/img:scale-[1.05]",
                  )}
                  overlay={on ? 0 : 18}
                />
              ) : null}
              {on ? (
                <span
                  aria-hidden
                  className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center bg-ember"
                >
                  <svg viewBox="0 0 12 10" width="11" height="9" fill="none">
                    <path d="M1 5l3.5 3.5L11 1" stroke="#2E2910" strokeWidth="1.6" />
                  </svg>
                </span>
              ) : null}
            </div>
            <span
              className={cn(
                "mt-3 block font-sans text-sm transition-colors",
                on ? "text-ink" : "text-ink-70",
              )}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------
   The result
   ------------------------------------------------------------------------- */

function Result({
  result,
  answers,
}: {
  result: ReturnType<typeof buildResult>;
  answers: QuizAnswers;
}) {
  const service = serviceBySlug[result.recommendedServiceSlug];
  const venues = result.recommendedVenueSlugs.map((slug) => venueBySlug[slug]).filter(Boolean);
  const images = result.recommendedInspirationSlugs
    .map((slug) => inspirationBySlug[slug])
    .filter(Boolean);

  return (
    <>
      <div className="bg-ink text-paper" data-ground="ink">
        <Container className="pt-32 pb-20 lg:pt-40 lg:pb-28">
          <div className="lg:grid lg:grid-cols-[7.5rem_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[9.5rem_minmax(0,1fr)]">
            <p className="eyebrow mb-6 border-t border-paper/25 pt-4 text-paper/60 lg:mb-0">
              Your direction
            </p>

            <div>
              <h1 className="max-w-[16ch] font-display text-[clamp(2.25rem,5.6vw,4.5rem)] leading-[1.02] font-light">
                {result.headline}
              </h1>

              <ul className="mt-8 flex flex-wrap gap-2.5">
                {result.direction.map((word) => (
                  <li
                    key={word}
                    className="border border-paper/25 px-4 py-2 font-mono text-[0.6875rem] tracking-[0.14em] uppercase"
                  >
                    {word}
                  </li>
                ))}
              </ul>

              <p className="mt-8 max-w-[56ch] font-sans text-lg leading-[1.65] text-paper/75">
                {result.summary}
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* --- What we’d do first ------------------------------------------- */}
      <Container className="py-20 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <h2 className="eyebrow mb-7 text-ink-50">What we&rsquo;d do first</h2>
            <ol className="border-t border-ink/12">
              {result.nextSteps.map((step, index) => (
                <li key={step} className="flex gap-5 border-b border-ink/12 py-5">
                  <span className="font-mono text-[0.6875rem] tabular-nums text-ember">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-sans text-[1.0625rem] leading-[1.6]">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {service ? (
            <div>
              <h2 className="eyebrow mb-7 text-ink-50">The package that fits</h2>
              <Link href={`/services/${service.slug}`} className="group block">
                <Photo
                  photoKey={service.imageId}
                  ratio="wide"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  imageClassName="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
                <h3 className="mt-5 font-display text-2xl leading-tight font-light">
                  {service.name}
                </h3>
                <p className="mt-3 max-w-[44ch] font-sans text-[0.9375rem] leading-[1.7] text-ink-70">
                  {service.standfirst}
                </p>
                <p className="mt-4 font-mono text-[0.6875rem] tracking-wide text-ink-50">
                  from {formatCurrency(service.feeFrom)}
                </p>
              </Link>
            </div>
          ) : null}
        </div>
      </Container>

      {/* --- Venues --------------------------------------------------------- */}
      {venues.length ? (
        <Container className="pb-20 lg:pb-28">
          <h2 className="eyebrow mb-8 text-ink-50">Places that would suit it</h2>
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {venues.map((venue) => (
              <VenueCard key={venue.slug} venue={venue} />
            ))}
          </div>
        </Container>
      ) : null}

      {/* --- Inspiration ---------------------------------------------------- */}
      {images.length ? (
        <Container className="pb-20 lg:pb-28">
          <h2 className="eyebrow mb-8 text-ink-50">Start a collection</h2>
          <div className="columns-2 gap-4 lg:columns-3 lg:gap-6 [&>*]:mb-4 lg:[&>*]:mb-6">
            {images.map((item) => (
              <InspirationTile
                key={item.slug}
                item={item}
                className="break-inside-avoid"
                sizes="(min-width: 1024px) 30vw, 46vw"
              />
            ))}
          </div>
        </Container>
      ) : null}

      {/* --- Capture --------------------------------------------------------- */}
      <div className="bg-forest text-champagne" data-ground="forest">
        <Container className="py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-24">
            <div>
              <h2 className="max-w-[18ch] font-display text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.08] font-light">
                Let&rsquo;s build this properly.
              </h2>
              <p className="mt-5 max-w-[44ch] font-sans text-base leading-[1.7] text-champagne/85">
                We&rsquo;ll send this back to you as a written direction — the
                styles, the shape, the venues and what we&rsquo;d do in the first
                month. No obligation, and no follow-up unless you ask.
              </p>
              <div className="mt-8">
                <ButtonLink href="/planning" variant="onDark">
                  Or use the planning tools
                </ButtonLink>
              </div>
            </div>

            <div className="bg-paper p-7 text-ink lg:p-10">
              <LeadForm
                source="quiz"
                context={{
                  answers,
                  direction: result.direction,
                  primaryStyle: result.primaryStyle.id,
                  service: result.recommendedServiceSlug,
                }}
                submitLabel="Send me this direction"
                compact
              />
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
