"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooth scroll, but only for people who want it.
 *
 * Lenis is what makes the homepage read as one continuous day rather than a
 * series of jumps. It is disabled outright under prefers-reduced-motion and
 * on coarse pointers, where native momentum scrolling is already better than
 * anything we’d synthesise.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");

    let lenis: Lenis | null = null;
    let frame = 0;

    const start = () => {
      if (lenis || reduced.matches || coarse.matches) return;
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        wheelMultiplier: 0.9,
        touchMultiplier: 1.4,
      });
      const raf = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      lenis?.destroy();
      lenis = null;
    };

    const sync = () => {
      stop();
      start();
    };

    start();
    reduced.addEventListener("change", sync);
    coarse.addEventListener("change", sync);

    return () => {
      reduced.removeEventListener("change", sync);
      coarse.removeEventListener("change", sync);
      stop();
    };
  }, []);

  return null;
}
