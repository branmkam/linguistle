import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import langs from "../data/toplanguages.json";
import { Modal, TableCell, LangRow, LangSearch, Button } from "../components";
import type { Language } from "../utils/types";
import { score, shuffleWithSeed } from "../utils/utils";

const currentDay = Math.floor(
  (Date.now() - new Date(Date.UTC(2026, 7, 11)).getTime()) /
    (24 * 60 * 60 * 1000),
);

export default function Game({ day }: { day: number }) {
  const [guessedLangs, setGuessedLangs] = useState<Language[]>([]);
  const [showModal, setShowModal] = useState(false);

  const currentIndex = Math.abs(day) % langs.length;
  const shuffledLanguages = shuffleWithSeed(langs, 3235);
  const currentLang = shuffledLanguages[currentIndex];

  const fullGuessedLangs = guessedLangs.map(
    (lang) => langs[langs.findIndex((l) => l.iso639_3 === lang.iso639_3)] || {},
  );
  const guessedIsos = guessedLangs.map((g) => g.iso639_3);
  const currentScore = score(guessedLangs, currentLang);
  const foundLanguage = guessedLangs
    .map((lang) => lang.iso639_3)
    .includes(currentLang.iso639_3);

  const gameOver = foundLanguage || guessedLangs.length >= 7;

  return (
    <div className="flex flex-col justify-center min-w-90 max-w-300 gap-4 h-full m-4">
      <div className="flex gap-6 justify-center items-center sticky top-12 z-50 py-2 bg-gray-100 w-full">
        <h1 className="font-ultra text-xl md:text-3xl">#{day}</h1>
        {gameOver ? (
          <>
            <span className="text-base md:text-3xl">
              {currentDay === day
                ? "Come back again tomorrow!"
                : "Thanks for playing!"}
            </span>
            <Button
              onClick={() => setShowModal(true)}
              className="text-white rounded-3xl md:text-2xl w-36 bg-blue-700 px-4 py-2 hover:bg-blue-400"
            >
              View Score
            </Button>
          </>
        ) : (
          <>
            <LangSearch
              languages={langs}
              disabled={gameOver}
              guessedIsos={guessedIsos}
              onSelect={(language) => {
                if (guessedIsos.includes(language.iso639_3)) return;

                setGuessedLangs((previousGuesses) => {
                  const nextGuesses = [...previousGuesses, language];

                  if (
                    language.iso639_3 === currentLang.iso639_3 ||
                    nextGuesses.length >= 7
                  ) {
                    setShowModal(true);
                  }

                  return nextGuesses;
                });
              }}
            />
            <Button
              onClick={() => {
                setShowModal(true);
              }}
              className="text-white rounded-3xl md:text-2xl w-28 bg-red-700 px-4 py-2 hover:bg-red-400"
              disabled={gameOver}
            >
              Give up
            </Button>
          </>
        )}
      </div>

      <div className="grid grid-cols-6 gap-1 w-[99%] md:gap-2">
        {[
          "Name",
          "Family",
          "Native (mil.)",
          "Total (mil.)",
          "Script",
          "Origin",
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
              href={`https://en.wikipedia.org/wiki/${currentLang.languageName}_language`}
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
                  ? `LINGUISTLE #${day} (${new Date(new Date().setUTCDate(new Date(2026, 7, 11).getUTCDate() + day)).toLocaleDateString()})\nScore: ${currentScore.toFixed(0)} 🟩 — solved in ${guessedLangs.length} guesses`
                  : `LINGUISTLE #${day} (${new Date(new Date().setUTCDate(new Date(2026, 7, 11).getUTCDate() + day)).toLocaleDateString()})\nScore: ${currentScore.toFixed(0)} 🟥`;
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
