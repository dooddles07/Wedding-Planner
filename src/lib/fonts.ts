import { DM_Mono, Fraunces, Instrument_Sans } from "next/font/google";

/**
 * Three roles, three faces.
 *
 * Fraunces carries the personality — its SOFT and WONK axes give headlines a
 * hand-cut quality that suits coastal, organic materials. Instrument Sans is
 * the humanist workhorse. DM Mono is the running order: times, labels, data
 * and the planner’s marginalia.
 *
 * All self-hosted by next/font, so no external request and no layout shift.
 */

export const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

export const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-sans",
});

export const dmMono = DM_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-mono",
  weight: ["300", "400", "500"],
});

export const fontVariables = [
  fraunces.variable,
  instrumentSans.variable,
  dmMono.variable,
].join(" ");
