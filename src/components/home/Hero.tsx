"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { getPhoto, photoUrl, tonePlaceholder } from "@/content/media";
import { nav, voice } from "@/content/brand";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/editorial/Reveal";
import { track } from "@/lib/analytics";

/**
 * 05:40. First light.
 *
 * The page opens before anyone is awake and works its way to the last dance,
 * with the ground changing as the light does. This is the darkest it gets.
 *
 * Motion: the photograph settles back a fraction as you leave, and the type
 * lifts away slightly faster. Two values, both scroll-linked, both off under
 * prefers-reduced-motion.
 */
export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const photo = getPhoto("first-light");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <div
      ref={ref}
      data-ground="ink"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink text-paper"
    >
      <motion.div
        className="absolute inset-0"
        style={reduced ? undefined : { scale: imageScale, y: imageY }}
      >
        <Image
          src={photoUrl(photo, { width: 2560, quality: 76 })}
          alt={photo.alt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          placeholder="blur"
          blurDataURL={tonePlaceholder(photo.tone)}
          className="object-cover"
        />
      </motion.div>

      {/* Graded down hard, in three passes. It is 05:40 — this has to read as
          dark, and a single wash leaves the photograph competing with the
          headline. A flat ink layer sets the key, a vertical gradient anchors
          the type at the bottom, and a warm pass pulls the whole frame back
          toward the palette. */}
      <div aria-hidden className="absolute inset-0 bg-ink/45" />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/35 to-ink"
      />
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-multiply"
        style={{ backgroundColor: "rgba(74, 67, 34, 0.35)" }}
      />

      <motion.div
        className="relative mx-auto w-full max-w-[100rem] px-6 pb-16 sm:px-8 lg:px-12 lg:pb-24"
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <div className="lg:grid lg:grid-cols-[7.5rem_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[9.5rem_minmax(0,1fr)]">
          {/* The running order begins here. Everything below follows it — and
              the scroll cue lives in the rail rather than floating in a corner,
              where it would sit on top of the buttons. */}
          <div className="mb-8 flex items-baseline gap-4 border-t border-paper/25 pt-4 lg:mb-0 lg:flex-col lg:items-start lg:gap-3 lg:self-end">
            <time className="eyebrow tabular-nums" dateTime="05:40">
              05:40
            </time>
            <p className="font-mono text-[0.6875rem] tracking-wide opacity-70">
              first light
            </p>
            <ScrollCue />
          </div>

          <div>
            <Reveal
              as="h1"
              className="font-display text-[clamp(2.5rem,7.2vw,6.5rem)] leading-[0.98] font-light -tracking-[0.015em]"
              lineClassName="pb-[0.08em]"
              stagger={0.09}
              delay={0.15}
            >
              {"Nobody is awake yet.\nBy tonight they’ll all be dancing."}
            </Reveal>

            <div className="mt-9 flex flex-col gap-9 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
              <motion.p
                className="max-w-[46ch] font-sans text-base leading-[1.6] text-paper/70 sm:text-lg"
                initial={reduced ? undefined : { opacity: 0, y: 14 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {voice.positioning}
              </motion.p>

              <motion.div
                className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center"
                initial={reduced ? undefined : { opacity: 0, y: 14 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ delay: 0.88, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <ButtonLink
                  href={nav.cta.href}
                  variant="primary"
                  size="lg"
                  onClick={() =>
                    track({ name: "cta_click", label: nav.cta.label, location: "hero" })
                  }
                >
                  {nav.cta.label}
                </ButtonLink>
                <ButtonLink href="/weddings" variant="onDark" size="lg" arrow={false}>
                  Explore real weddings
                </ButtonLink>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * A hairline with something travelling down it — the only looping motion on
 * the site. It sits at the foot of the running-order rail, so it reads as the
 * day continuing rather than as a generic "scroll" badge.
 */
function ScrollCue() {
  const reduced = useReducedMotion();

  return (
    <span
      aria-hidden
      className="relative mt-4 hidden h-14 w-px overflow-hidden bg-paper/20 lg:block"
    >
      {reduced ? null : (
        <motion.span
          className="absolute inset-x-0 block h-5 bg-paper/70"
          animate={{ y: ["-100%", "280%"] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </span>
  );
}
