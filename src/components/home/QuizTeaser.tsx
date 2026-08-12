"use client";

import { useRouter } from "next/navigation";
import { quizQuestions } from "@/content/quiz";
import { Chapter, Ground } from "@/components/editorial/Layout";
import { FadeIn, Reveal } from "@/components/editorial/Reveal";
import { track } from "@/lib/analytics";

/**
 * 11:40. A quiet section between two loud ones.
 *
 * The first question of the quiz, answerable here. Answering it starts the
 * real thing with that answer already recorded, which removes the only real
 * friction in a ten-question form: the decision to begin one.
 */
export function QuizTeaser() {
  const router = useRouter();
  const first = quizQuestions[0];

  function begin(value: string) {
    track({ name: "quiz_started" });
    router.push(`/planning/quiz?when=${encodeURIComponent(value)}`);
  }

  return (
    <Ground name="linen" className="py-20 lg:py-28">
      <Chapter time="11:40" note="the first real question">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-20">
          <div>
            <Reveal
              as="h2"
              className="font-display text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.08] font-light"
              stagger={0.08}
            >
              {"Let’s find your wedding."}
            </Reveal>
            <FadeIn delay={0.1}>
              <p className="mt-5 max-w-[44ch] font-sans text-base leading-[1.7] text-ink-70">
                Ten questions, about three minutes. You’ll get two styles, a
                shape for the day, and the three things we’d do first.
              </p>
            </FadeIn>
          </div>

          <FadeIn delay={0.15}>
            <fieldset>
              <legend className="eyebrow mb-5 text-ink-50">
                {first.question}
              </legend>
              <div className="flex flex-wrap gap-2.5">
                {first.options?.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => begin(option.value)}
                    className="group/chip min-h-11 border border-ink/20 px-5 py-3 text-left font-sans text-sm transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper"
                  >
                    {option.label}
                    {option.hint ? (
                      <span className="mt-0.5 block font-mono text-[0.625rem] tracking-wide text-ink-50 transition-colors group-hover/chip:text-paper/60">
                        {option.hint}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </fieldset>
          </FadeIn>
        </div>
      </Chapter>
    </Ground>
  );
}
