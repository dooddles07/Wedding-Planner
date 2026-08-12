"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav } from "@/content/brand";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import type { GroundName } from "@/components/editorial/Layout";
import { Wordmark } from "./Wordmark";
import { MobileMenu } from "./MobileMenu";
import { useGroundUnderHeader } from "./useGroundUnderHeader";

/** Type colour per ground, so the header reads over any band of the page. */
const ON_GROUND: Record<GroundName, { text: string; solid: string; rule: string }> = {
  ink: { text: "text-paper", solid: "bg-ink", rule: "border-paper/12" },
  paper: { text: "text-ink", solid: "bg-paper", rule: "border-ink/10" },
  linen: { text: "text-ink", solid: "bg-linen", rule: "border-ink/10" },
  forest: { text: "text-champagne", solid: "bg-forest", rule: "border-champagne/15" },
  champagne: { text: "text-ink", solid: "bg-champagne", rule: "border-ink/12" },
};

export function Header({ initialGround = "paper" }: { initialGround?: GroundName }) {
  const { ground, atTop } = useGroundUnderHeader(initialGround);
  const pathname = usePathname();

  // The menu remembers which route it was opened on, so a navigation — including
  // browser back — closes it without an effect reaching in to reset state.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === pathname;
  const setOpen = (next: boolean) => setOpenedAt(next ? pathname : null);

  const skin = ON_GROUND[ground] ?? ON_GROUND.paper;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,color] duration-500",
          skin.text,
          atTop ? "border-transparent bg-transparent" : cn(skin.solid, skin.rule),
        )}
      >
        <div className="mx-auto flex h-19 w-full max-w-[100rem] items-center justify-between gap-8 px-6 sm:px-8 lg:px-12">
          <Wordmark size="md" />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {nav.primary.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className="group/nav relative inline-block py-2 font-mono text-[0.6875rem] tracking-[0.16em] uppercase transition-opacity hover:opacity-100"
                      style={{ opacity: active ? 1 : 0.72 }}
                    >
                      {item.label}
                      <span
                        aria-hidden
                        className={cn(
                          "absolute -bottom-0.5 left-0 h-px w-full origin-right bg-ember transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
                          active
                            ? "scale-x-100"
                            : "scale-x-0 group-hover/nav:origin-left group-hover/nav:scale-x-100",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={nav.cta.href}
              onClick={() => track({ name: "cta_click", label: nav.cta.label, location: "header" })}
              className="hidden min-h-11 items-center bg-ember px-5 font-mono text-[0.6875rem] tracking-[0.16em] text-ink uppercase transition-colors duration-300 hover:bg-ink hover:text-champagne sm:inline-flex"
            >
              {nav.cta.label}
            </Link>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="-mr-2 inline-flex h-11 w-11 items-center justify-center lg:hidden"
            >
              <span className="sr-only">Open menu</span>
              <span aria-hidden className="flex h-3 w-6 flex-col justify-between">
                <span className="h-px w-full bg-current" />
                <span className="h-px w-full bg-current" />
                <span className="h-px w-2/3 bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
