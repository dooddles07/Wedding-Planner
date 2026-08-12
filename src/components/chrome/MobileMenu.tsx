"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { brand, nav } from "@/content/brand";
import { Photo } from "@/components/editorial/Photo";
import { Wordmark } from "./Wordmark";

/**
 * The full-screen menu.
 *
 * Large type, one photograph, and the studio’s address at the bottom so the
 * menu still says something rather than just listing routes. Focus is trapped
 * while it’s open, Escape closes it, and the page behind it can’t scroll.
 */
export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    restoreTo.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    // Move focus in, then keep it in.
    const focusables = () =>
      Array.from(
        panel.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    focusables()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      restoreTo.current?.focus();
    };
  }, [open, onClose]);

  const links = [...nav.primary, { label: "Services", href: "/services" }];

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={panel}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] flex flex-col bg-ink text-paper lg:hidden"
          initial={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
          animate={reduced ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
          exit={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex h-19 shrink-0 items-center justify-between px-6 sm:px-8">
            <Wordmark size="md" />
            <button
              type="button"
              onClick={onClose}
              className="-mr-2 inline-flex h-11 w-11 items-center justify-center"
            >
              <span className="sr-only">Close menu</span>
              <svg aria-hidden viewBox="0 0 20 20" width="18" height="18" fill="none">
                <path d="M2 2l16 16M18 2L2 18" stroke="currentColor" strokeWidth="1.25" />
              </svg>
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col justify-between overflow-y-auto px-6 pb-10 sm:px-8">
            <nav aria-label="Menu" className="pt-6">
              <ul>
                {links.map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={reduced ? undefined : { opacity: 0, y: 14 }}
                    animate={reduced ? undefined : { opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.18 + index * 0.045,
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="border-b border-paper/10"
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex items-baseline justify-between py-4 font-display text-[2rem] leading-tight sm:text-[2.5rem]"
                    >
                      {item.label}
                      <span className="font-mono text-[0.625rem] tracking-[0.16em] opacity-60">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="pt-10">
              <Photo
                photoKey="couple-doorway"
                ratio="cinema"
                sizes="100vw"
                className="mb-8"
                overlay={18}
              />

              <Link
                href={nav.cta.href}
                onClick={onClose}
                className="flex min-h-14 w-full items-center justify-between bg-ember px-6 font-mono text-xs tracking-[0.16em] text-ink uppercase"
              >
                {nav.cta.label}
                <svg aria-hidden viewBox="0 0 20 10" width="20" height="10" fill="none">
                  <path d="M0 5h18M14 1l4 4-4 4" stroke="currentColor" strokeWidth="1.25" />
                </svg>
              </Link>

              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[0.6875rem] tracking-wide opacity-70">
                <a href={`mailto:${brand.email}`}>{brand.email}</a>
                <span>{brand.base}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
