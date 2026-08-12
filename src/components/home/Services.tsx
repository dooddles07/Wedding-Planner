"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { services } from "@/content/services";
import { Chapter, Ground } from "@/components/editorial/Layout";
import { Photo } from "@/components/editorial/Photo";
import { FadeIn, Reveal } from "@/components/editorial/Reveal";
import { formatCurrency } from "@/lib/utils";

/**
 * 19:15. The long table.
 *
 * Six services as a list, not six cards — cards would make this the same
 * shape as every other section and there are already enough grids on the
 * internet. The row markers are how far out the work usually starts, which is
 * genuinely the most useful thing to know about each one.
 *
 * On a pointer, hovering a row brings up the photograph and it trails the
 * cursor. On touch, where that can’t work, a thumbnail sits in the row.
 */
export function Services() {
  const [active, setActive] = useState<number | null>(null);
  const reduced = useReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 220, damping: 30, mass: 0.4 });
  const y = useSpring(pointerY, { stiffness: 220, damping: 30, mass: 0.4 });

  function onPointerMove(event: React.PointerEvent) {
    if (event.pointerType !== "mouse") return;
    pointerX.set(event.clientX + 28);
    pointerY.set(event.clientY - 150);
  }

  return (
    <Ground name="paper" className="py-24 lg:py-36">
      <Chapter time="19:15" note="two hundred plates, one service">
        <div className="max-w-[46rem]">
          <Reveal
            as="h2"
            className="font-display text-[clamp(2rem,4.6vw,3.75rem)] leading-[1.03] font-light"
            stagger={0.08}
          >
            {"Six ways in.\nMost people need the second one."}
          </Reveal>
          <FadeIn delay={0.12}>
            <p className="mt-7 max-w-[52ch] font-sans text-[1.0625rem] leading-[1.7] text-ink-70">
              The marker on the left is how far out the work usually starts.
              It’s a guide, not a rule — we’ve picked up a wedding six days
              before now, and it was fine.
            </p>
          </FadeIn>
        </div>

        <div
          className="mt-14 border-t border-ink/12"
          onPointerMove={onPointerMove}
          onPointerLeave={() => setActive(null)}
        >
          {services.map((service, index) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setActive(index);
              }}
              onFocus={() => setActive(index)}
              onBlur={() => setActive(null)}
              className="group grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-5 gap-y-2 border-b border-ink/12 py-7 sm:grid-cols-[8.5rem_minmax(0,1fr)_auto] sm:gap-x-8 lg:py-9"
            >
              <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-ink-50 uppercase">
                {service.index}
              </span>

              <div className="col-span-2 sm:col-span-1">
                <div className="flex items-baseline gap-4">
                  <h3 className="font-display text-[clamp(1.5rem,3vw,2.375rem)] leading-none font-light transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5">
                    {service.name}
                  </h3>
                  {/* Touch gets the thumbnail the pointer version gets on hover */}
                  <span className="w-14 shrink-0 sm:hidden">
                    <Photo photoKey={service.imageId} ratio="square" sizes="56px" />
                  </span>
                </div>
                <p className="mt-2.5 max-w-[44ch] font-sans text-[0.9375rem] leading-relaxed text-ink-70">
                  {service.promise}
                </p>
              </div>

              <span className="col-start-2 font-mono text-[0.6875rem] tracking-wide text-ink-50 sm:col-start-3 sm:text-right">
                from {formatCurrency(service.feeFrom)}
              </span>
            </Link>
          ))}
        </div>
      </Chapter>

      {/* The trailing plate. Fixed, above everything, ignores the pointer. */}
      {reduced ? null : (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed top-0 left-0 z-40 hidden w-64 lg:block"
          style={{ x, y }}
        >
          <AnimatePresence>
            {active !== null ? (
              <motion.div
                key={services[active].slug}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <Photo
                  photoKey={services[active].imageId}
                  ratio="portrait"
                  sizes="256px"
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      )}
    </Ground>
  );
}
