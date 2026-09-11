import { useMemo, useState } from "react";
import { Button } from "./index";

import type { Language } from "../utils/types";

export function LangSearch({
  languages,
  guessedIsos = [],
  disabled = false,
  onSelect,
}: {
  languages: Language[];
  guessedIsos?: string[];
  disabled?: boolean;
  onSelect: (language: Language) => void;
}) {
  const [query, setQuery] = useState("");

  const filteredLanguages = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (normalized.length < 2) return [];

    return languages.filter((language) =>
      language.languageName.toLowerCase().includes(normalized),
    );
  }, [languages, query]);

  return (
    <div className="relative w-full max-w-xl self-center">
      <input
        type="text"
        disabled={disabled}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search a language..."
        className={`z-40 w-full rounded-md border border-gray-600 transition-all duration-150 ${!disabled && "hover:scale-102 "}hover:bg-gray-600 bg-gray-800 px-4 py-3 text-white outline-none ring-0 placeholder:text-gray-400`}
      />

      {filteredLanguages.length > 0 && (
        <ul className="absolute z-40 max-h-64 w-full overflow-y-auto rounded-md border border-gray-700 bg-gray-900 text-left shadow-lg">
          {filteredLanguages.sort((a, b) => b.nativeSpeakers - a.nativeSpeakers).map((language) => {
            const isGuessed = guessedIsos.includes(language.iso639_3);
            return (
              <li key={language.iso639_3}>
                <Button
                  noHoverScaling
                  type="button"
                  disabled={isGuessed}
                  onClick={() => {
                    if (isGuessed) return;
                    onSelect(language);
                    setQuery("");
                  }}
                  title={isGuessed ? "Already guessed" : undefined}
                  className={`w-full px-4 py-2 text-left text-white ${isGuessed ? "line-through" : "hover:bg-gray-800"}`}
                >
                  {language.languageName}
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
