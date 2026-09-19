import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

async function checkUsernameAvailability(username: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .ilike("username", username.trim())
    .maybeSingle();

  if (error) {
    console.log(error);
    return {
      error: "Unable to check username availability. Please try again.",
    };
  }

  if (data) {
    return { error: "That username is already taken." };
  }

  return { error: null };
}

async function signUpNewUser(
  email: string,
  password: string,
  username?: string,
  setUser?: (user: User | null) => void,
) {
  if (username) {
    const usernameCheck = await checkUsernameAvailability(username);
    if (usernameCheck.error) {
      return usernameCheck;
    }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getAuthRedirectUrl(),
      data: {
        username: username?.trim(),
        display_name: username?.trim(),
      },
    },
  });

  if (error) {
    console.error(error.message);
    if (/already registered|already exists/i.test(error.message)) {
      return {
        error: "An account with this email already exists. Please log in.",
      };
    }
    return { error: error.message };
  }

  if (!data.user) {
    return { error: "Account creation failed. Please try again." };
  }

  // Supabase hides existing-account errors when email confirmation is enabled.
  if (data.user.identities?.length === 0) {
    return {
      error: "An account with this email already exists. Please log in.",
    };
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    email,
    username: username?.trim(),
    tier: "free",
    created_at: new Date(),
  });

  if (profileError) {
    console.error(profileError.message);
    return {
      error: "Account created, but profile setup failed. Please try again.",
    };
  }

  setUser?.(data.user);
  console.log("Signed up:", data);
  return { error: null };
}

async function signInWithEmail(
  email: string,
  password: string,
  setUser?: (user: User | null) => void,
) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error.message);
    return { error: error.message };
  }

  setUser?.(data.user);
  console.log("Logged in:", data);
  return { error: null };
}

async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getAuthRedirectUrl(),
    },
  });

  return error ? { error: error.message } : { error: null };
}

function verifyEmail(email: string) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return "Invalid email format.";
  }

  return "";
}

function passwordError(pw: string) {
  if (pw.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  if (!/[!%#?]/.test(pw)) {
    return "Password must include at least one special character (!, %, #, or ?).";
  }
  if (!/[A-Z]/.test(pw) || !/[a-z]/.test(pw)) {
    return "Password must include at least one uppercase and one lowercase letter.";
  }
  return "";
}

export default function LoginSignup({
  setUser,
}: {
  setUser: (user: User | null) => void;
}) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const emailValidationMessage = verifyEmail(email);
  const passwordValidationMessage = passwordError(password);
  const usernameValidationMessage =
    !isLogin && username.trim().normalize().length < 4
      ? "Username must be at least 4 characters long, and only contain A-Z, a-z, 0-9, or _."
      : "";

  const isFormValid =
    !emailValidationMessage &&
    !passwordValidationMessage &&
    (!isLogin ? !usernameValidationMessage : true);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!event.currentTarget.checkValidity() || !isFormValid) return;
    setErrorMessage("");
    const normalizedEmail = email.trim();

    if (isLogin) {
      const result = await signInWithEmail(normalizedEmail, password, setUser);
      if (result.error) {
        setErrorMessage(result.error);
        return;
      }
      navigate("/");
      return;
    }

    const result = await signUpNewUser(
      normalizedEmail,
      password,
      username,
      setUser,
    );
    if (result.error) {
      setErrorMessage(result.error);
      return;
    }
    navigate("/verify-email");
  };

  const handleGoogleAuth = async () => {
    setErrorMessage("");
    const result = await signInWithGoogle();
    if (result.error) {
      setErrorMessage(result.error);
    }
  };

  return (
    <form
      className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] gap-4"
      onSubmit={handleSubmit}
    >
      {isLogin ? (
        <h1 className="text-4xl font-bold">Login</h1>
      ) : (
        <h1 className="text-4xl font-bold">Sign Up</h1>
      )}
      {!isLogin && (
        <>
          <input
            required
            className={`border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 ${usernameValidationMessage ? "border-red-500" : ""}`}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {username.length > 0 && usernameValidationMessage && (
            <p className="text-red-500 text-sm">{usernameValidationMessage}</p>
          )}
        </>
      )}
      <input
        required
        type="email"
        className={`border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 ${emailValidationMessage ? "border-red-500" : ""}`}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {email.length > 0 && emailValidationMessage && (
        <p className="text-red-500 text-sm">{emailValidationMessage}</p>
      )}
      <input
        required
        className={`border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 ${passwordValidationMessage ? "border-red-500" : ""}`}
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {password.length > 0 && passwordValidationMessage && (
        <p className="text-red-500 text-sm">{passwordValidationMessage}</p>
      )}

      <Button
        type="submit"
        className="bg-blue-500 px-4 py-2 text-white rounded hover:bg-blue-600"
      >
        {isLogin ? "Login" : "Sign Up"}
      </Button>
      {errorMessage && (
        <p
          className="text-red-500 text-lg bg-slate-200 px-4 py-2 rounded-lg"
          role="alert"
        >
          {errorMessage}
        </p>
      )}
      <button
        type="button"
        className="text-lg text-blue-500 hover:underline cursor-pointer"
        onClick={() => setIsLogin((prev) => !prev)}
      >
        {isLogin
          ? "Don't have an account? Sign up"
          : "Already have an account? Log in"}
      </button>
      <Button
        type="button"
        className="bg-white px-4 py-2 mt-8 text-gray-800 border border-gray-300 hover:bg-gray-100"
        onClick={handleGoogleAuth}
      >
        <FontAwesomeIcon icon={faGoogle} className="mr-2" />
        Sign up / Log in with Google
      </Button>
    </form>
  );
}
