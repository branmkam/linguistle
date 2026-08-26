export type Language = {
  languageName: string;
  languageFamily: string;
  nativeSpeakers: number;
  totalSpeakers: number;
  primaryCountries: string;
  script: string;
  isOfficialUN: string;
  iso639_3: string;
  originContinent: string;
};

export type AnswerType = 'correct' | 'incorrect' | 'partial' | 'info';