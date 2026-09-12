import { useEffect, useState } from "react";
import { Button } from "../components";
import { supabase } from "../../supabase/supabase";

type AccountProps = {
  setLoggedIn: (loggedIn: boolean) => void;
};

export default function Account({ setLoggedIn }: AccountProps) {
  const [user, setUser] = useState<{
    email?: string;
    user_metadata?: {
      username?: string;
      display_name?: string;
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error(error.message);
      }

      setUser(user);
      setLoggedIn(Boolean(user));
      setLoading(false);
    }

    fetchUser();
  }, [setLoggedIn]);

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error.message);
      return;
    }

    setLoggedIn(false);
  }

  const displayName =
    user?.user_metadata?.display_name ??
    user?.user_metadata?.username ??
    user?.email ??
    "User";

  return (
    <div className="justify-center items-center flex-col flex gap-4">
      <h1 className="text-xl font-ultra md:text-3xl">Account Page</h1>
      <p>User: {loading ? "Loading..." : displayName}</p>
      <Button onClick={handleSignOut}>Sign Out</Button>
    </div>
  );
}
