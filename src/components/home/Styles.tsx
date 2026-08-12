"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { weddingStyles } from "@/content/styles";
import { Chapter, Ground } from "@/components/editorial/Layout";
import { Photo } from "@/components/editorial/Photo";
import { FadeIn, Reveal } from "@/components/editorial/Reveal";
import { TextLink } from "@/components/ui/Button";

/**
 * 10:00. Getting ready.
 *
 * Ten directions, one large photograph. Moving down the list changes the
 * plate — hover on a pointer, focus on a keyboard, so it works either way.
 * The plate is aria-hidden because everything in it is already in the link
 * text; a screen reader shouldn’t hear the image change ten times.
 *
 * On small screens the same content becomes a snap-scrolling row of tall
 * photographs, which is how you’d actually want to browse this on a phone.
 */
export function Styles() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const current = weddingStyles[active];

  return (
    <Ground name="paper" className="border-t border-ink/10 py-24 lg:py-36">
      <Chapter time="10:00" note="doors open, nobody dressed yet">
        <div className="max-w-[52rem]">
          <Reveal
            as="h2"
            className="font-display text-[clamp(2rem,4.6vw,3.75rem)] leading-[1.03] font-light"
            stagger={0.08}
          >
            {"Ten ways this tends to go.\nNone of them is a package."}
          </Reveal>
          <FadeIn delay={0.15}>
            <p className="mt-7 max-w-[52ch] font-sans text-[1.0625rem] leading-[1.7] text-ink-70">
              Most weddings sit between two of these. Knowing which two is the
              single most useful thing you can work out early — it decides the
              venue, and the venue decides almost everything else.
            </p>
          </FadeIn>
        </div>

        {/* Desktop: list and plate */}
        <div className="mt-16 hidden gap-16 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] xl:grid-cols-[minmax(0,1fr)_minmax(0,32rem)]">
          <ul
            className="border-t border-ink/12"
            onMouseLeave={() => setActive(0)}
          >
            {weddingStyles.map((style, index) => {
              const on = index === active;
              return (
                <li key={style.id} className="border-b border-ink/12">
                  <Link
                    href={`/inspiration?style=${style.id}`}
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    className="group flex items-baseline gap-6 py-5"
                  >
                    <span
                      className="w-8 shrink-0 font-mono text-[0.625rem] tracking-[0.16em] tabular-nums transition-opacity"
                      style={{ opacity: on ? 0.9 : 0.3 }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="font-display text-[clamp(1.75rem,2.6vw,2.5rem)] leading-none font-light transition-[transform,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        transform: on ? "translateX(0.5rem)" : "none",
                        color: on ? "var(--color-ink)" : "var(--color-ink-50)",
                      }}
                    >
                      {style.name}
                    </span>
                    <span
                      className="ml-auto max-w-[24ch] text-right font-mono text-[0.6875rem] leading-relaxed tracking-wide transition-opacity duration-500"
                      style={{ opacity: on ? 0.7 : 0 }}
                    >
                      {style.tagline}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div aria-hidden className="relative">
            <div className="sticky top-32">
              <div className="relative aspect-[3/4] overflow-hidden bg-linen">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={current.id}
                    className="absolute inset-0"
                    initial={reduced ? { opacity: 0 } : { clipPath: "inset(100% 0 0 0)" }}
                    animate={reduced ? { opacity: 1 } : { clipPath: "inset(0% 0 0 0)" }}
                    exit={reduced ? { opacity: 0 } : { opacity: 1 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Photo
                      photoKey={current.imageId}
                      ratio="fill"
                      sizes="(min-width: 1280px) 32rem, 26rem"
                      className="h-full"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="mt-5 flex items-start gap-4">
                <div className="flex shrink-0 gap-1.5 pt-1.5">
                  {current.palette.map((hex) => (
                    <span
                      key={hex}
                      className="h-3 w-3 rounded-full ring-1 ring-ink/10"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
                <p className="font-sans text-sm leading-[1.65] text-ink-70">
                  {current.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Small screens: a row you can push along with your thumb */}
        <div className="-mx-6 mt-12 lg:hidden">
          <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {weddingStyles.map((style) => (
              <li key={style.id} className="w-[72vw] max-w-[20rem] shrink-0 snap-start">
                <Link href={`/inspiration?style=${style.id}`} className="block">
                  <Photo
                    photoKey={style.imageId}
                    ratio="portrait"
                    sizes="72vw"
                    overlay={12}
                  />
                  <h3 className="mt-4 font-display text-2xl leading-none font-light">
                    {style.name}
                  </h3>
                  <p className="mt-2 font-mono text-[0.6875rem] leading-relaxed tracking-wide text-ink-50">
                    {style.tagline}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 lg:mt-14">
          <TextLink href="/planning/quiz" arrow>
            Not sure which two are yours? Take the ten-question version
          </TextLink>
        </div>
      </Chapter>
    </Ground>
  );
}
