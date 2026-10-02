import { supabase } from "./supabase";

// Delete the current user's account through the delete-user edge function.
export async function deleteUserAccount() {
  // Call the delete-user edge function to delete the user account (supabase\functions\delete-user\index.ts)
  const { error } = await supabase.functions.invoke("delete-user");
  if (error) throw error;
}