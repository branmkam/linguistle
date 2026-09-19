import { UsernameEditor } from "../components/UsernameEditor";
import { supabase } from "../../supabase/supabase";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function NewGoogleAccount() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
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
