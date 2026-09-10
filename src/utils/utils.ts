import type { Language } from "./types";
import { familyChecker, numberChecker, distanceChecker } from "./checkers";
import { haversineKm } from "./haversine";

function seededRandom(seed: number) {
  let value = seed >>> 0;

  return () => {
    value = (value + 0x6d2b79f5) >>> 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t = ((t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t) >>> 0;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  const array = [...items];
  const next = seededRandom(seed);

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export function score(guessedLangs: Language[], currentLang: Language): number {
  if (guessedLangs.length === 0) return 0;

  // score based on latest guess
  // if correct
  const latestGuess = guessedLangs[guessedLangs.length - 1];
  if (latestGuess.languageName === currentLang.languageName) {
    return 102 - 2 * guessedLangs.length;
  }
  // if not correct: evaluate family, native speakers, macroarea, and distance
  const fam = familyChecker(latestGuess.languageFamily, currentLang.languageFamily);
  const native = numberChecker(latestGuess.nativeSpeakers, currentLang.nativeSpeakers);
  const macro = (latestGuess.originContinent === currentLang.originContinent) ? "correct" : "incorrect";

  const lat1 = latestGuess.latitude ?? 0;
  const lon1 = latestGuess.longitude ?? 0;
  const lat2 = currentLang.latitude ?? 0;
  const lon2 = currentLang.longitude ?? 0;

  const distanceKm = haversineKm(lat1, lon1, lat2, lon2);
  const distCheck = distanceChecker(Math.round(distanceKm));

  const checks = [fam, native, macro, distCheck];

  const total = checks.reduce((sum, result) => {
    if (result === "correct") return sum + 1;
    if (result === "partial") return sum + 0.5;
    return sum;
  }, 0);

  return (total / checks.length) * (102 - 4 * guessedLangs.length);
}
