import { useState } from "react";
import { Button } from "../components";
import { supabase } from "../../supabase/supabase";

async function signUpNewUser(
  email: string,
  password: string,
  username?: string,
  setLoggedIn?: (loggedIn: boolean) => void,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "/",
      data: {
        username,
        display_name: username,
      },
    },
  });

  if (error) {
    console.error(error.message);
    return;
  }

  setLoggedIn?.(true);
  console.log("Signed up:", data);
}

async function signInWithEmail(
  email: string,
  password: string,
  setLoggedIn?: (loggedIn: boolean) => void,
) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error.message);
    return;
  }

  setLoggedIn?.(true);
  console.log("Logged in:", data);
}

function verifyEmail(email: string) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
  setLoggedIn,
}: {
  setLoggedIn: (loggedIn: boolean) => void;
}) {
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailValidationMessage = verifyEmail(email);
  const passwordValidationMessage = passwordError(password);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3rem)] bg-gray-100 gap-4">
      {isLogin ? (
        <h1 className="text-4xl font-bold">Login</h1>
      ) : (
        <h1 className="text-4xl font-bold">Sign Up</h1>
      )}
      {!isLogin && (
        <input
          className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      )}
      <input
        className={`border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 ${emailValidationMessage ? "border-red-500" : ""}`}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {emailValidationMessage && (
        <p className="text-red-500 text-sm">{emailValidationMessage}</p>
      )}
      <input
        className={`border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 ${passwordValidationMessage ? "border-red-500" : ""}`}
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {passwordValidationMessage && (
        <p className="text-red-500 text-sm">{passwordValidationMessage}</p>
      )}
      <Button
        onClick={() => {
          if (isLogin) {
            signInWithEmail(email, password, setLoggedIn);
            return;
          }

          signUpNewUser(email, password, username, setLoggedIn);
        }}
      >
        {isLogin ? "Login" : "Sign Up"}
      </Button>
      <p
        className="text-sm text-blue-600 underline cursor-pointer"
        onClick={() => setIsLogin((prev) => !prev)}
      >
        {isLogin
          ? "Don't have an account? Sign up"
          : "Already have an account? Log in"}
      </p>
    </div>
  );
}
