"use client";

import { useEffect } from "react";
import { migrateLocalDataIfNeeded } from "@/lib/auth/migrate-local-data";

export function LocalDataMigrator() {
  useEffect(() => {
    migrateLocalDataIfNeeded().catch(() => undefined);
  }, []);
  return null;
}
