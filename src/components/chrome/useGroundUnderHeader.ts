"use client";

import { useEffect, useState } from "react";
import type { GroundName } from "@/components/editorial/Layout";

const HEADER = 76;

/**
 * Which band of the page is currently under the header.
 *
 * The homepage moves through the light of a single day, so the navigation has
 * to move with it — paper type over the pre-dawn hero, ink type over the
 * morning. A single IntersectionObserver watches a one-pixel strip just below
 * the header and reports whichever [data-ground] section is crossing it.
 *
 * The set of intersecting sections is tracked rather than the last event,
 * because IntersectionObserver only reports what *changed*. Without that, a
 * page whose top has no [data-ground] section keeps whatever ground it last
 * saw — scroll to the footer and back and the navigation renders paper-on-paper,
 * which is to say invisible.
 */
export function useGroundUnderHeader(fallback: GroundName = "paper") {
  const [ground, setGround] = useState<GroundName>(fallback);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const crossing = new Set<Element>();

    const resolve = () => {
      if (crossing.size === 0) {
        setGround(fallback);
        return;
      }
      // Sections can overlap by a pixel mid-transition; the lowest one on the
      // page is the one actually arriving.
      const lowest = [...crossing].reduce((deepest, element) =>
        element.getBoundingClientRect().top >
        deepest.getBoundingClientRect().top
          ? element
          : deepest,
      );
      const name = lowest.getAttribute("data-ground");
      if (name) setGround(name as GroundName);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) crossing.add(entry.target);
          else crossing.delete(entry.target);
        }
        resolve();
      },
      {
        rootMargin: `-${HEADER}px 0px -${Math.max(
          0,
          window.innerHeight - HEADER - 1,
        )}px 0px`,
      },
    );

    // Sections that arrive after mount — the quiz result, a filtered list —
    // have to be picked up too, or the header keeps reporting the ground of
    // markup that is no longer on the page.
    const observed = new WeakSet<Element>();
    const sync = () => {
      document.querySelectorAll("[data-ground]").forEach((section) => {
        if (observed.has(section)) return;
        observed.add(section);
        observer.observe(section);
      });
    };

    sync();

    const mutations = new MutationObserver(() => {
      // Drop anything that has left the document, then pick up new arrivals.
      crossing.forEach((element) => {
        if (!element.isConnected) crossing.delete(element);
      });
      sync();
      resolve();
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      mutations.disconnect();
      observer.disconnect();
    };
  }, [fallback]);

  return { ground, atTop };
}
