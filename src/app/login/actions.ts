"use server";

import { signIn } from "@/lib/auth";

/** Only ever a same-site relative path — never `//host`, `\host`, or an absolute URL. */
function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\")
    ? next
    : "/dashboard";
}

export async function signInWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const next = safeNext(formData.get("next"));
  await signIn("resend", { email, redirectTo: next });
}

export async function signInWithGoogle(formData: FormData) {
  const next = safeNext(formData.get("next"));
  await signIn("google", { redirectTo: next });
}
