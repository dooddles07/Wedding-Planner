"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { testimonials } from "@/content/testimonials";
import { demoNotice } from "@/content/brand";
import { Chapter, Ground } from "@/components/editorial/Layout";
import { Photo } from "@/components/editorial/Photo";
import { cn } from "@/lib/utils";

/**
 * 21:40. Speeches.
 *
 * One quote at a time, large, with the couple’s photograph — not three cards
 * in a row, which is where testimonials go to be ignored. You move between
 * them with the names, which doubles as the list of who’s speaking.
 *
 * These are sample quotes and the section says so, rather than passing
 * invented copy off as real.
 */
export function Voices() {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const current = testimonials[index];

  return (
    <Ground name="paper" className="border-t border-ink/10 py-24 lg:py-36">
      <Chapter time="21:40" note="four minutes each, we asked">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-20">
          <div className="flex min-h-[22rem] flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={current.id}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="max-w-[24ch] font-display text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.12] font-light">
                  <span aria-hidden className="text-ember">
                    “
                  </span>
                  {current.quote}
                </p>
                <footer className="mt-8">
                  <p className="font-sans text-base">{current.couple}</p>
                  <p className="mt-1.5 font-mono text-[0.6875rem] tracking-wide text-ink-50">
                    {current.location} · {current.weddingType}
                  </p>
                </footer>
              </motion.blockquote>
            </AnimatePresence>

            <div className="mt-12">
              {/* Not "also speaking" — the list includes whoever is on screen,
                  marked with the underline. */}
              <p className="eyebrow mb-4 text-ink-50">Who&rsquo;s speaking</p>
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {testimonials.map((item, i) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-current={i === index ? "true" : undefined}
                      className={cn(
                        "min-h-11 font-sans text-sm transition-colors duration-300",
                        i === index
                          ? "text-ink underline decoration-ember decoration-1 underline-offset-[6px]"
                          : "text-ink-50 hover:text-ink",
                      )}
                    >
                      {item.couple}
                    </button>
                  </li>
                ))}
              </ul>
              {demoNotice ? (
                <p className="mt-6 font-mono text-[0.625rem] leading-relaxed tracking-wide text-ink-50">
                  Sample quotes. Written to show the shape of a real one.
                </p>
              ) : null}
            </div>
          </div>

          <div aria-hidden className="order-first lg:order-none">
            <div className="relative aspect-[3/4] overflow-hidden bg-linen">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={current.id}
                  className="absolute inset-0"
                  initial={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
                  animate={reduced ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
                  exit={{ opacity: 1 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Photo
                    photoKey={current.imageId}
                    ratio="fill"
                    sizes="(min-width: 1024px) 22rem, 100vw"
                    className="h-full"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Chapter>
    </Ground>
  );
}
