import { useState } from "react";
import { Button } from "../components";
import { supabase } from "../../supabase/supabase";
import type { User } from "@supabase/supabase-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

function getAuthRedirectUrl() {
  const configuredUrl =
    import.meta.env.VITE_APP_URL ||
    import.meta.env.VITE_SITE_URL ||
    window.location.origin;
  return `${configuredUrl.replace(/\/$/, "")}/`;
}

// Email/password sign-in and sign-up flows are intentionally disabled.
// async function checkUsernameAvailability(username: string) {
//   const { data, error } = await supabase
//     .from("profiles")
//     .select("id")
//     .ilike("username", username.trim())
//     .maybeSingle();
//
//   if (error) {
//     console.log(error);
//     return {
//       error: "Unable to check username availability. Please try again.",
//     };
//   }
//
//   if (data) {
//     return { error: "That username is already taken." };
//   }
//
//   return { error: null };
// }
//
// async function signUpNewUser(
//   email: string,
//   password: string,
//   username?: string,
//   setUser?: (user: User | null) => void,
// ) {
//   if (username) {
//     const usernameCheck = await checkUsernameAvailability(username);
//     if (usernameCheck.error) {
//       return usernameCheck;
//     }
//   }
//
//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password,
//     options: {
//       emailRedirectTo: getAuthRedirectUrl(),
//       data: {
//         username: username?.trim(),
//         display_name: username?.trim(),
//       },
//     },
//   });
//
//   if (error) {
//     console.error(error.message);
//     if (/already registered|already exists/i.test(error.message)) {
//       return {
//         error: "An account with this email already exists. Please log in.",
//       };
//     }
//     return { error: error.message };
//   }
//
//   if (!data.user) {
//     return { error: "Account creation failed. Please try again." };
//   }
//
//   if (data.user.identities?.length === 0) {
//     return {
//       error: "An account with this email already exists. Please log in.",
//     };
//   }
//
//   const profileError = await ensureProfile(data.user);
//
//   if (profileError) {
//     console.error(profileError.message);
//     return {
//       error: "Account created, but profile setup failed. Please try again.",
//     };
//   }
//
//   setUser?.(data.user);
//   console.log("Signed up:", data);
//   return { error: null };
// }
//
// async function signInWithEmail(
//   email: string,
//   password: string,
//   setUser?: (user: User | null) => void,
// ) {
//   const { data, error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   });
//
//   if (error) {
//     console.error(error.message);
//     return { error: error.message };
//   }
//
//   const profileError = await ensureProfile(data.user);
//   if (profileError) {
//     return { error: "Unable to set up your profile. Please try again." };
//   }
//
//   setUser?.(data.user);
//   console.log("Logged in:", data);
//   return { error: null };
// }
//
// function verifyEmail(email: string) {
//   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
//     return "Invalid email format.";
//   }
//
//   return "";
// }
//
// function passwordError(pw: string) {
//   if (pw.length < 8) {
//     return "Password must be at least 8 characters long.";
//   }
//   if (!/[!%#?]/.test(pw)) {
//     return "Password must include at least one special character (!, %, #, or ?).";
//   }
//   if (!/[A-Z]/.test(pw) || !/[a-z]/.test(pw)) {
//     return "Password must include at least one uppercase and one lowercase letter.";
//   }
//   return "";
// }

async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getAuthRedirectUrl(),
    },
  });

  return error ? { error: error.message } : { error: null };
}

export default function LoginSignup({
  setUser,
}: {
  setUser: (user: User | null) => void;
}) {
  const [errorMessage, setErrorMessage] = useState("");

  const handleGoogleAuth = async () => {
    setErrorMessage("");
    const result = await signInWithGoogle();
    if (result.error) {
      setErrorMessage(result.error);
      return;
    }
    setUser(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] gap-4 px-4 text-center">
      <h1 className="text-4xl font-bold">Continue with Google</h1>
      <p className="max-w-md text-gray-500">
        Google sign-in is the only authentication method enabled on this site at the moment - more to come.
      </p>

      {errorMessage && (
        <p
          className="text-red-500 text-lg bg-slate-200 px-4 py-2 rounded-lg"
          role="alert"
        >
          {errorMessage}
        </p>
      )}

      <Button
        type="button"
        className="bg-white px-4 py-2 mt-4 text-gray-800 border border-gray-300 hover:bg-gray-100"
        onClick={handleGoogleAuth}
      >
        <FontAwesomeIcon icon={faGoogle} className="mr-2" />
        Sign in with Google
      </Button>
    </div>
  );
}
