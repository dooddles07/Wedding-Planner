"use client";

import { motion, useReducedMotion } from "motion/react";
import type { SaveableKind } from "@/types";
import { useSaves } from "@/lib/store/saves";
import { cn } from "@/lib/utils";

const LABEL: Record<SaveableKind, string> = {
  inspiration: "this image",
  venue: "this venue",
  vendor: "this supplier",
  wedding: "this wedding",
};

/**
 * Keep something.
 *
 * Not a heart — a bookmark mark, because "saved to your list" is what actually
 * happens and a heart implies a feeling about the thing rather than an
 * intention to come back to it. Filled and ember when saved, hairline when not.
 */
export function SaveButton({
  kind,
  slug,
  className,
  onDark = false,
  size = "md",
}: {
  kind: SaveableKind;
  slug: string;
  className?: string;
  onDark?: boolean;
  size?: "sm" | "md";
}) {
  const hydrated = useSaves((state) => state.hydrated);
  const saved = useSaves((state) =>
    state.items.some((item) => item.kind === kind && item.slug === slug),
  );
  const toggle = useSaves((state) => state.toggle);
  const reduced = useReducedMotion();

  const on = hydrated && saved;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(kind, slug);
      }}
      aria-pressed={on}
      className={cn(
        "inline-flex items-center justify-center transition-colors duration-300",
        size === "sm" ? "h-9 w-9" : "h-11 w-11",
        on
          ? "text-ember"
          : onDark
            ? "text-paper/70 hover:text-paper"
            : "text-ink-50 hover:text-ink",
        className,
      )}
    >
      <span className="sr-only">
        {on ? `Remove ${LABEL[kind]} from saved` : `Save ${LABEL[kind]}`}
      </span>
      <motion.svg
        aria-hidden
        viewBox="0 0 16 20"
        width={size === "sm" ? 14 : 16}
        height={size === "sm" ? 17 : 20}
        animate={reduced || !on ? undefined : { scale: [1, 1.22, 1] }}
        transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
      >
        <path
          d="M1 1h14v18l-7-5.4L1 19V1Z"
          fill={on ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </motion.svg>
    </button>
  );
}
