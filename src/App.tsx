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
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons/faQuestionCircle";
import { GameStats } from "./components/GameStats";
import Account from "./pages/Account";
import type { User } from "@supabase/supabase-js";

function ArchivedGame() {
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

  return <Game day={Number.isFinite(parsedDay) ? parsedDay : 0} />;
}

function DailyGame({ mode }: { mode: "normal" | "hard" }) {
  return <Game day={getCurrentDay()} mode={mode} />;
}

function App() {
  const [user, setUser] = useState<User | null>(null);

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
      <div className="w-full min-h-screen bg-gray-100">
        <div className="font-homenaje text-center mx-auto max-w-300">
          {/* header */}
          <div className="fixed top-0 left-0 w-full z-50 text-2xl h-12 flex justify-between px-4 gap-4 items-center text-white  bg-gray-800">
            <Link to="/" className="font-ultra hover:text-red-200">
              Linguistle
            </Link>
            <div className="flex gap-4 text-base md:text-lg items-center">
              <Link to="/help" className="hover:text-red-200">
                <FontAwesomeIcon icon={faQuestionCircle} />
              </Link>
              <Link to="/about" className="hover:text-red-200">
                About
              </Link>
              <Link to="/archive" className="hover:text-red-200">
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

          <div className="pt-12">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/daily/normal" element={<DailyGame mode="normal" />} />
              <Route path="/daily/hard" element={<DailyGame mode="hard" />} />
              <Route
                path="/about"
                element={<div className="p-6">About page (coming soon)</div>}
              />
              <Route path="/archive" element={<Archive />} />
              <Route path="/archive/:day" element={<ArchivedGame />} />
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
                    Stats
                    <GameStats />
                  </div>
                }
              />
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
                className="underline hover:text-purple-300"
                href="mailto:brankamgg@gmail.com"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
