import "./App.css";
import { useState } from "react";
import langs from "./data/toplanguages.json";
import { TableCell, LangRow, LangSearch } from "./components";
import type { Language } from "./utils/types";

function seededRandom(seed: number) {
  let value = seed >>> 0;

  return () => {
    value = (value + 0x6d2b79f5) >>> 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t = ((t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t) >>> 0;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  const array = [...items];
  const next = seededRandom(seed);

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function App() {
  const [guessedLangs, setGuessedLangs] = useState<Language[]>([]);

  // DO NOT CHANGE THE SEED VALUE
  const shuffledLanguages = shuffleWithSeed(langs, 15);
  const currentLang = shuffledLanguages[2]; // replace with UTC math
  console.log(currentLang);

  const fullGuessedLangs = guessedLangs.map(
    (lang) => langs[langs.findIndex((l) => l.iso639_3 === lang.iso639_3)] || {},
  );

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
            onSelect={(language) =>
              setGuessedLangs([...guessedLangs, language])
            }
          />
          <button
            onClick={() => setGuessedLangs([])}
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
    </div>
  );
}

export default App;
