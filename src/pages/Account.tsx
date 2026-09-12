import { Button } from "../components";
import { supabase } from "../../supabase/supabase";
import type { User } from "@supabase/supabase-js";
import { Link } from "react-router-dom";

type AccountProps = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export default function Account({ user, setUser }: AccountProps) {
  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error.message);
      return;
    }

    setUser(null);
  }

  const displayName =
    user?.user_metadata?.display_name ??
    user?.user_metadata?.username ??
    user?.email ??
    "User";

  return (
    <div className="justify-center items-center flex-col flex gap-4">
      <h1 className="text-xl font-ultra md:text-3xl">Account Page</h1>
      <p>User: {displayName}</p>
      <Button onClick={handleSignOut}><Link to="/login">Sign Out</Link></Button>
    </div>
  );
}
