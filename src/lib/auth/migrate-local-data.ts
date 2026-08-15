import { getSession } from "next-auth/react";

const LOCAL_KEYS = ["planning", "wedding-site", "saves", "leads", "inquiries"];
const PREFIX = "marram:";

export async function migrateLocalDataIfNeeded() {
  const session = await getSession();
  if (!session?.user) return;

  const migrationKey = `marram:migrated-${session.user.id}`;
  if (localStorage.getItem(migrationKey)) return;

  for (const key of LOCAL_KEYS) {
    const value = localStorage.getItem(PREFIX + key);
    if (!value) continue;

    const getRes = await fetch(`/api/user-state?key=${key}`);
    if (!getRes.ok) return;
    const existing = await getRes.json();
    if (existing.value) continue;

    const putRes = await fetch("/api/user-state", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    if (!putRes.ok) return;
  }

  localStorage.setItem(migrationKey, "1");
}
