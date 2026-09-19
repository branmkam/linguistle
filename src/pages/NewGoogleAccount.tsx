import { UsernameEditor } from "../components/UsernameEditor";
import { supabase } from "../../supabase/supabase";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ensureProfile } from "../utils/profile";

export default function NewGoogleAccount() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        return;
      }

      const profileError = await ensureProfile(data.user);
      if (profileError) {
        console.error(profileError.message);
        return;
      }

      setUser(data.user);
    }

    loadUser();
  }, []);

  return (
    <div>
      <p>
        Before you continue, please choose a username to represent your account.
      </p>
      {user && <UsernameEditor user={user} setUser={setUser} />}
      <p>
        <Link to="/">Proceed to homepage</Link>
      </p>
    </div>
  );
}
