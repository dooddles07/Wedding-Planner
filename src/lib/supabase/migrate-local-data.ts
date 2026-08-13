import { createClient } from "@/lib/supabase/client";

const LOCAL_KEYS = ["planning", "wedding-site", "saves", "leads", "inquiries"];
const PREFIX = "marram:";

export async function migrateLocalDataIfNeeded() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const migrationKey = `marram:migrated-${user.id}`;
  if (localStorage.getItem(migrationKey)) return;

  const rows: { key: string; value: string }[] = [];
  for (const key of LOCAL_KEYS) {
    const value = localStorage.getItem(PREFIX + key);
    if (value) rows.push({ key, value });
  }

  if (rows.length > 0) {
    const { data: existing } = await supabase
      .from("user_state")
      .select("key")
      .in(
        "key",
        rows.map((r) => r.key),
      );

    const existingKeys = new Set((existing ?? []).map((r) => r.key));
    const toInsert = rows.filter((r) => !existingKeys.has(r.key));

    if (toInsert.length > 0) {
      await supabase.from("user_state").insert(toInsert);
    }
  }

  localStorage.setItem(migrationKey, "1");
}
