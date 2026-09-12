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

  const rank = (status: string) => {
    if (status === "correct") return 2;
    if (status === "partial") return 1;
    return 0;
  };

  // iterates thru guesses and checks each one to get best score
  const chooseBest = (
    currentBest: string,
    nextStatus: string,
  ) => {
    return rank(nextStatus) > rank(currentBest) ? nextStatus : currentBest;
  };

  const bestGuess = guessedLangs.reduce(
    (best, guess) => {
      const fam = familyChecker(guess.languageFamily, currentLang.languageFamily);
      const native = numberChecker(guess.nativeSpeakers, currentLang.nativeSpeakers);
      const macro =
        guess.originContinent === currentLang.originContinent
          ? "correct"
          : "incorrect";

      const lat1 = guess.latitude ?? 0;
      const lon1 = guess.longitude ?? 0;
      const lat2 = currentLang.latitude ?? 0;
      const lon2 = currentLang.longitude ?? 0;
      const distanceKm = haversineKm(lat1, lon1, lat2, lon2);
      const distance = distanceChecker(distanceKm);

      return {
        fam: chooseBest(best.fam, fam),
        native: chooseBest(best.native, native),
        macro: chooseBest(best.macro, macro),
        distance: chooseBest(best.distance, distance),
        closestDistance: Math.min(best.closestDistance, distanceKm),
      };
    },
    {
      fam: "incorrect",
      native: "incorrect",
      macro: "incorrect",
      distance: "incorrect",
      closestDistance: Number.POSITIVE_INFINITY,
    },
  );

  const latestGuess = guessedLangs[guessedLangs.length - 1];
  if (latestGuess.languageName === currentLang.languageName) {
    return 102 - 2 * guessedLangs.length;
  }

  const checks = [bestGuess.fam, bestGuess.native, bestGuess.macro, bestGuess.distance];
  const total = checks.reduce((sum, result) => {
    if (result === "correct") return sum + 1;
    if (result === "partial") return sum + 0.5;
    return sum;
  }, 0);

  const distRatio =
    bestGuess.closestDistance === Number.POSITIVE_INFINITY
      ? 0
      : Math.min(bestGuess.closestDistance / 20000, 1);
  const distScore = (1 - distRatio) * 0.25;

  return (total / 4 + distScore) * (102 - 4 * guessedLangs.length);
}

export function getCurrentDay(): number {
  const dayMs = 24 * 60 * 60 * 1000;
  const startDate = new Date(Date.UTC(2026, 8, 1));
  const daysPast = Math.floor((Date.now() - startDate.getTime()) / dayMs);
  return Math.abs(daysPast);
}

export const SEED = 2029; // DO NOT CHANGE SEED. This is used to shuffle the languages consistently across all users.