"use client";

import { useEffect } from "react";
import { track as vaTrack } from "@vercel/analytics";
import { setAnalyticsSink } from "@/lib/analytics";

export function AnalyticsSinkWirer() {
  useEffect(() => {
    setAnalyticsSink((event) => {
      const { name, ...props } = event;
      vaTrack(name, props as Record<string, string | number | boolean>);
    });
  }, []);
  return null;
}
