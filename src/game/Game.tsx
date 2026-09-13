import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import raw from "../data/withFamily.json";
import { Modal, TableCell, LangRow, LangSearch, Button } from "../components";
import type { Language } from "../utils/types";
import {
  getCurrentDay,
  haversineKm,
  score,
  shuffleWithSeed,
  SEED,
} from "../utils";
import GameMap from "./GameMap";
import { createGame } from "../../supabase/gameService";
import { supabase } from "../../supabase/supabase";

const currentDay = getCurrentDay();

const langsFull = raw.map((item) => ({
  languageName: item.Name || item.languageLabel || item.language || "",
  languageFamily: item.path || item.classification || item.top_family || "",
  familyDisplay: item.top_family || item.first_subfamily || "",
  nativeSpeakers: Number(item.nativeSpeakers) || 0,
  totalSpeakers: Number(item.totalSpeakers) || 0,
  primaryCountries: item.Countries || item.Countries || "",
  script: item.mainScript || "",
  isOfficialUN: "",
  iso639_3: item.iso6393 || item.ISO639P3code || item.ISO639P3code || "",
  originContinent: (item.Macroarea || "").split(";")[0] || "",
  latitude: item.Latitude,
  longitude: item.Longitude,
  path: item.path,
}));

export default function Game({
  day,
  mode = "normal",
  darkMode = false,
}: {
  day: number;
  mode?: "easy" | "normal" | "hard";
  darkMode?: boolean;
}) {
  const langs = langsFull.filter((lang) => {
    const speakers = lang.nativeSpeakers;

    if (mode === "easy") return speakers > 40_000_000;
    if (mode === "hard") return speakers >= 1_000_000 && speakers <= 50_000_000;
    return speakers > 10_000_000;
  });

  const [guessedLangs, setGuessedLangs] = useState<Language[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [hasGivenUp, setHasGivenUp] = useState(false);
  const hasSavedGame = useRef(false);
  const existingGameChecked = useRef(false);

  useEffect(() => {
    let isActive = true;
    hasSavedGame.current = false;
    existingGameChecked.current = false;

    async function loadExistingGame() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !isActive) return;

      const { data, error } = await supabase
        .from("games")
        .select("*")
        .eq("user_id", user.id)
        .eq("day", day)
        .eq("mode", mode);

      if (!isActive) return;

      if (error) {
        console.error("Error checking game:", error);
        existingGameChecked.current = true;
        return;
      }

      const game = data?.[0];
      if (game) {
        hasSavedGame.current = true;

        const restoredGuesses = (game.guesses ?? []).map((iso: string) => {
          return (
            langsFull.find((lang) => lang.iso639_3 === iso) ?? {
              iso639_3: iso,
              languageName: iso,
              languageFamily: "",
              familyDisplay: "",
              nativeSpeakers: 0,
              totalSpeakers: 0,
              primaryCountries: "",
              script: "",
              isOfficialUN: "",
              originContinent: "",
              latitude: 0,
              longitude: 0,
              path: "",
            }
          );
        });

        setGuessedLangs(restoredGuesses);
      }

      existingGameChecked.current = true;
    }

    loadExistingGame();

    return () => {
      isActive = false;
    };
  }, [day]);

  const currentIndex = Math.abs(day) % langs.length;
  // DO NOT CHANGE SEED.
  const shuffledLanguages = shuffleWithSeed(langs, SEED);
  const currentLang = shuffledLanguages[currentIndex];

  const fullGuessedLangs = guessedLangs;
  const guessedIsos = guessedLangs.map((g) => g.iso639_3);
  const currentScore = score(guessedLangs, currentLang);
  const foundLanguage = guessedLangs
    .map((lang) => lang.iso639_3)
    .includes(currentLang.iso639_3);

  const gameOver = foundLanguage || guessedLangs.length >= 8 || hasGivenUp;

  useEffect(() => {
    if (!gameOver || !existingGameChecked.current || hasSavedGame.current)
      return;

    const guessedIds = guessedLangs.map((lang) => lang.iso639_3);

    createGame(guessedIds, foundLanguage, day, mode, currentScore)
      .then(() => {
        hasSavedGame.current = true;
      })
      .catch((error) => {
        console.error("Failed to save game result:", error);
      });
  }, [gameOver, foundLanguage, guessedLangs, day, mode, currentScore]);

  const wikiName = currentLang.languageName
    .replace(/\s*\([^)]*\)\s*/g, "") // remove parentheses and contents
    .trim()
    .replace(/\s+/g, "_");

  return (
    <div className="flex flex-col justify-center min-w-90 max-w-300 gap-4 h-full m-4">
      <div
        className={`flex gap-6 justify-center items-center sticky top-12 z-50 py-2 ${darkMode ? "bg-gray-900" : "bg-gray-100"} w-full`}
      >
        <h1 className="font-ultra text-xl md:text-3xl">#{day}</h1>
        <span className="font-homenaje text-2xl">{mode}</span>
        {gameOver ? (
          <>
            <span className="text-base md:text-3xl">
              {currentDay === day
                ? "Come back again tomorrow!"
                : "Thanks for playing!"}
            </span>
            <Button
              onClick={() => setShowModal(true)}
              className="text-white transition-all duration-300 ease-in-out rounded-3xl md:text-2xl w-36 bg-blue-700 px-4 py-2 hover:bg-blue-400"
            >
              View Score
            </Button>
          </>
        ) : (
          <>
            <LangSearch
              languages={langsFull}
              disabled={gameOver}
              guessedIsos={guessedIsos}
              onSelect={(language) => {
                if (gameOver || guessedIsos.includes(language.iso639_3)) return;

                setGuessedLangs((previousGuesses) => {
                  const nextGuesses = [...previousGuesses, language];

                  if (
                    language.iso639_3 === currentLang.iso639_3 ||
                    nextGuesses.length >= 8
                  ) {
                    setShowModal(true);
                  }

                  return nextGuesses;
                });
              }}
            />
            <Button
              onClick={() => {
                setHasGivenUp(true);
                setShowModal(true);
              }}
              className="text-white rounded-3xl md:text-2xl w-34 bg-red-700 px-4 py-2 hover:bg-red-400"
              disabled={gameOver}
            >
              Give up
            </Button>
          </>
        )}
      </div>

      {/* map */}
      <div className="flex justify-center">
        <div className="h-50 md:h-80 w-full z-10">
          <GameMap
            points={guessedLangs.map((lang) => ({
              id: lang.languageName,
              lat: lang.latitude || 0,
              lng: lang.longitude || 0,
              distance: haversineKm(
                lang.latitude || 0,
                lang.longitude || 0,
                currentLang.latitude || 0,
                currentLang.longitude || 0,
              ),
            }))}
            targetPoint={[
              currentLang.latitude || 0,
              currentLang.longitude || 0,
            ]}
            darkMode={darkMode}
          />
        </div>
      </div>

      <div className="grid grid-cols-5 gap-1 w-[99%] md:gap-2">
        {[
          "Name",
          "Family",
          "Native (mil.)",
          "Origin Area",
          "Distance to Origin",
        ].map((header, index) => (
          <TableCell key={index} type="info" animationPlace={index + 1}>
            {header}
          </TableCell>
        ))}

        {fullGuessedLangs.map((lang) => (
          <LangRow
            key={lang.iso639_3}
            language={lang}
            currentLanguage={currentLang}
          />
        ))}
      </div>

      {showModal && (
        <Modal>
          <h2 className="text-2xl font-ultra">LINGUISTLE</h2>
          <h3 className="text-xl">#{day}</h3>
          {foundLanguage ? (
            <span className="text-green-700 font-bold">Nice work!</span>
          ) : (
            <span className="text-red-700 font-bold">
              Better luck next time!
            </span>
          )}
          <p className="text-xl">The correct answer was: </p>
          <p className="font-ultra text-xl underline hover:text-purple-700">
            <a
              href={`https://en.wikipedia.org/wiki/${wikiName}_language`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {currentLang.languageName}
            </a>
          </p>

          <div
            className={`mt-4 flex items-center justify-center gap-3 rounded-xl px-4 py-3 text-xl font-bold ${
              foundLanguage
                ? "bg-green-700 text-white"
                : "bg-red-700 text-white"
            }`}
          >
            {foundLanguage ? (
              <>
                <span>Score: {currentScore.toFixed(0)}</span>
                <span className="text-lg">|</span>
                <span>{guessedLangs.length} guesses</span>
              </>
            ) : (
              <>
                <span>Score: {currentScore.toFixed(0)}</span>
              </>
            )}
          </div>

          <div className="mt-4 flex gap-4 justify-center">
            <Button
              onClick={async () => {
                const shareText = foundLanguage
                  ? `LINGUISTLE ${mode} #${day} (${new Date(new Date().setUTCDate(new Date(2026, 8, 1).getUTCDate() + day)).toLocaleDateString()})\nScore: ${currentScore.toFixed(0)} 🟩 — solved in ${guessedLangs.length} guesses`
                  : `LINGUISTLE ${mode} #${day} (${new Date(new Date().setUTCDate(new Date(2026, 8, 1).getUTCDate() + day)).toLocaleDateString()})\nScore: ${currentScore.toFixed(0)} 🟥`;
                try {
                  await navigator.clipboard.writeText(
                    shareText + "\nhttps://linguistle.com",
                  );
                } catch {
                  alert("Failed to copy to clipboard.");
                }
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-2xl w-24 text-white rounded-2xl"
            >
              <span className="flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faShareAlt} />
                <span>Share</span>
              </span>
            </Button>
            <Button
              onClick={() => {
                setShowModal(false);
              }}
              className="mt-4 px-4 py-2 bg-red-500 text-2xl w-24 text-white rounded-2xl"
            >
              Close
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
