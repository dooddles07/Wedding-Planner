"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { migrateLocalDataIfNeeded } from "@/lib/auth/migrate-local-data";

export function LocalDataMigrator() {
  useEffect(() => {
    migrateLocalDataIfNeeded().catch(() => undefined);
  }, []);

  useEffect(() => {
    function onSaveError() {
      toast.error("Your latest changes could not be saved. Check your connection and try again.");
    }
    window.addEventListener("marram:save-error", onSaveError);
    return () => window.removeEventListener("marram:save-error", onSaveError);
  }, []);

  return null;
}
