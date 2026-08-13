"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

/** Fires page_view on every route change. Mount once in the site layout. */
export function PageViewTracker() {
  const pathname = usePathname();
  useEffect(() => {
    track({ name: "page_view", path: pathname });
  }, [pathname]);
  return null;
}
