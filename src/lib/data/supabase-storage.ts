import type { StateStorage } from "zustand/middleware";
import { createClient } from "@/lib/supabase/client";

export const supabaseStorage: StateStorage = {
  async getItem(key) {
    const supabase = createClient();
    const { data } = await supabase
      .from("user_state")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    return data?.value ?? null;
  },

  async setItem(key, value) {
    const supabase = createClient();
    await supabase
      .from("user_state")
      .upsert({ key, value, updated_at: new Date().toISOString() });
  },

  async removeItem(key) {
    const supabase = createClient();
    await supabase.from("user_state").delete().eq("key", key);
  },
};
