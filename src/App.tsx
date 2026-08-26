import "./App.css";
import { useState } from "react";
import langs from "./data/toplanguages.json";
import { Modal, TableCell, LangRow, LangSearch } from "./components";
import type { Language } from "./utils/types";
import { score, shuffleWithSeed } from "./utils/utils";

function App() {
  const [guessedLangs, setGuessedLangs] = useState<Language[]>([]);
  const [showModal, setShowModal] = useState(false);

  // DO NOT CHANGE THE SEED VALUE
  const shuffledLanguages = shuffleWithSeed(langs, 15);
  const currentLang = shuffledLanguages[25]; // replace with UTC math
  console.log(currentLang);

  const fullGuessedLangs = guessedLangs.map(
    (lang) => langs[langs.findIndex((l) => l.iso639_3 === lang.iso639_3)] || {},
  );
  const currentScore = score(guessedLangs, currentLang);
  const foundLanguage = guessedLangs
    .map((lang) => lang.iso639_3)
    .includes(currentLang.iso639_3);

  return (
    <div className="font-homenaje text-center">
      <div className="fixed top-0 left-0 w-full z-50 text-2xl h-12 flex justify-between px-4 gap-4 items-center bg-gray-800">
        <span className="text-white">Linguistle</span>
        <div className="flex gap-4 text-gray-200">
          <span>About</span>
          <span>Archive</span>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-4 h-full m-4 mt-16">
        <div className="flex gap-8 justify-center">
          <LangSearch
            languages={langs}
            onSelect={(language) => {
              setGuessedLangs([...guessedLangs, language]);
              if (
                language.iso639_3 === currentLang.iso639_3 ||
                guessedLangs.length >= 7
              ) {
                setShowModal(true);
              }
            }}
          />
          <button
            onClick={() => {
              setShowModal(true);
            }}
            className="hover:cursor-pointer text-white rounded-3xl text-2xl bg-red-700 px-4 py-2"
          >
            Give up
          </button>
        </div>
        <div className="grid grid-cols-6 gap-4">
          <TableCell type="info">Language Name</TableCell>
          <TableCell type="info">Family</TableCell>
          <TableCell type="info">Native Speakers (mil.)</TableCell>
          <TableCell type="info">Total Speakers (mil.)</TableCell>
          <TableCell type="info">Script</TableCell>
          <TableCell type="info">Origin Continent</TableCell>
          {fullGuessedLangs.map((lang) => (
            <LangRow
              key={lang.iso639_3}
              language={lang}
              currentLanguage={currentLang}
            />
          ))}
        </div>
      </div>

      {/* Modal Section */}
      {showModal && (
        <Modal>
          <h2 className="text-2xl mb-4">LINGUISTLE</h2>
          <p>The correct answer was: {currentLang.languageName}</p>

          <div
            className={`mt-4 flex items-center justify-center gap-3 rounded-xl px-4 py-3 text-xl font-bold ${
              foundLanguage
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
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
            <button
              onClick={() => {
                setShowModal(false);
                setGuessedLangs([]);
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-xl"
            >
              Close
            </button>
            <button
              onClick={async () => {
                const shareText = foundLanguage
                  ? `LINGUISTLE ${new Date().toLocaleDateString()} — Score: ${currentScore.toFixed(0)} 🟩 — solved in ${guessedLangs.length} guesses`
                  : `LINGUISTLE ${new Date().toLocaleDateString()} — Score: ${currentScore.toFixed(0)} 🟥`;
                try {
                  await navigator.clipboard.writeText(shareText);
                } catch {
                  // no-op for clipboard issues
                }
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-xl"
            >
              Share
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default App;
