import "./App.css";
import Homepage from "./pages/Homepage";
import Archive from "./pages/Archive";
import Game from "./game/Game";
import LoginSignup from "./pages/LoginSignup";
import { getCurrentDay } from "./utils/utils";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabase";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon,
  faSun,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { GameStats } from "./components/GameStats";
import Account from "./pages/Account";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import type { User } from "@supabase/supabase-js";
import About from "./pages/About";

// archived game definition
function ArchivedGame({ darkMode }: { darkMode: boolean }) {
  const { day } = useParams();
  const parsedDay = Number(day ?? 0);

  if (parsedDay > getCurrentDay()) {
    return <div className="p-6">Game not available for future days.</div>;
  }

  if (parsedDay < getCurrentDay() - 10) {
    return (
      <div className="p-6">Game not available for days older than 10 days.</div>
    );
  }

  return (
    <Game
      darkMode={darkMode}
      day={Number.isFinite(parsedDay) ? parsedDay : 0}
    />
  );
}

function DailyGame({
  mode,
  darkMode,
}: {
  mode: "normal" | "hard";
  darkMode: boolean;
}) {
  return <Game darkMode={darkMode} day={getCurrentDay()} mode={mode} />;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
      }
    }

    fetchUser();
  }, []);

  const isLoggedIn = Boolean(user);

  return (
    <BrowserRouter>
      <div
        className={`w-full justify-start items-center flex flex-col min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}
      >
        <div className="font-homenaje text-center mx-auto max-w-300">
          {/* header */}
          <div className="fixed top-0 left-0 w-full z-50 text-2xl h-12 flex justify-between px-4 gap-4 items-center text-white  bg-gray-800">
            <Link to="/" className="font-ultra hover:text-red-200">
              Linguistle
            </Link>
            <div className="flex gap-4 text-base md:text-lg items-center">
              <span
                title="Toggle Dark Mode"
                className="hover:text-red-200 cursor-pointer transition-all duration-200"
              >
                <FontAwesomeIcon
                  icon={darkMode ? faSun : faMoon}
                  onClick={() => setDarkMode(!darkMode)}
                />{" "}
              </span>
              <Link
                title="Help"
                to="/help"
                className="hover:text-red-200 transition-all duration-200"
              >
                <FontAwesomeIcon icon={faQuestionCircle} />
              </Link>
              <Link
                to="/about"
                className="hover:text-red-200 transition-all duration-200"
              >
                About
              </Link>
              <Link
                to="/archive"
                className="hover:text-red-200 transition-all duration-200"
              >
                Archive
              </Link>
              <Link
                to={isLoggedIn ? "/account" : "/login"}
                className="hover:text-red-200"
              >
                {isLoggedIn ? "Account" : "Log In"}
              </Link>
            </div>
          </div>

          {/* main content */}

          <div className="pt-16 pb-8">
            <Routes>
              <Route path="/" element={<Homepage user={user} />} />
              <Route
                path="/daily/normal"
                element={<DailyGame mode="normal" darkMode={darkMode} />}
              />
              <Route
                path="/daily/hard"
                element={<DailyGame mode="hard" darkMode={darkMode} />}
              />
              <Route
                path="/about"
                element={<div className="p-6"><About /></div>}
              />
              <Route path="/archive" element={<Archive />} />
              <Route
                path="/archive/:day"
                element={<ArchivedGame darkMode={darkMode} />}
              />
              <Route
                path="/login"
                element={<LoginSignup setUser={setUser} />}
              />
              <Route
                path="/account"
                element={<Account user={user} setUser={setUser} />}
              />
              <Route
                path="/help"
                element={
                  <div className="p-6">
                   { user ? <GameStats /> : <p className="text-2xl">Please <Link to="/login" className="underline hover:text-purple-300">log in</Link> or <Link to="/signup" className="underline hover:text-purple-300">sign up</Link> to view your game stats.</p> }
                  </div>
                }
              />
              <Route
                path="/verify-email"
                element={
                  <div className="p-6">
                    <p>
                      Your account creation was successful, but please verify your email address. Once you have done so,
                      you can access your account.
                    </p>
                    <p>
                      Once you have verified, close this window or{" "}
                      <Link className="text-blue-500 hover:text-blue-700" to="/login">navigate to the login page</Link>.
                    </p>
                  </div>
                }
              />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            </Routes>
          </div>
          {/* footer */}
          <div className="font-ultra fixed bottom-0 left-0 w-full z-50 text-sm h-7 flex justify-center px-4 gap-4 items-center text-white bg-gray-800">
            <div>
              by{" "}
              <a
                rel="noreferrer"
                target="_blank"
                className="underline hover:text-purple-300"
                href="https://www.instagram.com/brankam.gg"
              >
                brankam.gg
              </a>{" "}
              |{" "}
              <a
                rel="noreferrer"
                target="_blank"
                className="hover:text-purple-300"
                href="mailto:brankamgg@gmail.com"
              >
                Contact
              </a>
              {" "}|{" "}
              <Link to="/privacy-policy" className="hover:text-purple-300">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
