import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "Elmhurst Barn" -> "elmhurst-barn" */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** 48000 -> "£48,000". Whole pounds only; nobody budgets a wedding in pence. */
export function formatCurrency(value: number, currency = "GBP") {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

/** 12500 -> "12,500" */
export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-GB").format(value);
}

/** Clamp with sane behaviour when min > max. */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

/**
 * Only ever hand back a URL a browser can safely navigate to.
 *
 * Used wherever an owner-supplied link (e.g. a registry URL) ends up in an
 * `href` — blocks `javascript:`/`data:`/etc. schemes from user input.
 */
export function safeExternalUrl(url: string | null | undefined) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? url
      : null;
  } catch {
    return null;
  }
}

/** Whole days from today until the given date. Negative once it has passed. */
export function daysUntil(date: Date | string) {
  let target: Date;
  if (typeof date === "string") {
    const [y, m, d] = date.split("-").map(Number);
    target = new Date(y, m - 1, d);
  } else {
    target = date;
  }
  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const msPerDay = 86_400_000;
  return Math.round((startOfDay(target) - startOfDay(new Date())) / msPerDay);
}
