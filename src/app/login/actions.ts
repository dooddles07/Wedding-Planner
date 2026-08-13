"use server";

import { signIn } from "@/lib/auth";

export async function signInWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const next = (formData.get("next") as string) || "/dashboard";
  await signIn("resend", { email, redirectTo: next });
}

export async function signInWithGoogle(formData: FormData) {
  const next = (formData.get("next") as string) || "/dashboard";
  await signIn("google", { redirectTo: next });
}
