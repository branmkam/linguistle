import type { User } from "@supabase/supabase-js";
import { supabase } from "../../supabase/supabase";

export async function ensureProfile(user: User) {
  const fallbackUsername = `user_${user.id.replaceAll("-", "").slice(0, 8)}`;
  const username =
    user.user_metadata?.username ??
    user.user_metadata?.user_name ??
    user.user_metadata?.preferred_username ??
    user.user_metadata?.display_name ??
    fallbackUsername;

  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        email: user.email ?? null,
        username,
        tier: "free",
        created_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

  return error;
}