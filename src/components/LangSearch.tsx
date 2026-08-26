import { useMemo, useState } from "react";

import type { Language } from "../utils/types";

export function LangSearch({
  languages,
  onSelect,
}: {
  languages: Language[];
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
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search a language..."
        className="w-full rounded-md border border-gray-600 bg-gray-800 px-4 py-3 text-white outline-none ring-0 placeholder:text-gray-400"
      />

      {filteredLanguages.length > 0 && (
        <ul className="absolute z-10 max-h-64 w-full overflow-y-auto rounded-md border border-gray-700 bg-gray-900 text-left shadow-lg">
          {filteredLanguages.slice(0, 5).map((language) => (
            <li key={language.iso639_3}>
              <button
                type="button"
                onClick={() => {
                  onSelect(language);
                  setQuery("");
                }}
                className="w-full px-4 py-2 text-left text-white hover:bg-gray-800"
              >
                {language.languageName}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
