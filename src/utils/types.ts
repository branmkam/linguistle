export type Language = {
  languageName: string;
  languageFamily: string;
  nativeSpeakers: number;
  primaryCountries: string;
  script: string;
  isOfficialUN: string;
  iso639_3: string;
  originContinent: string;
  latitude?: number;
  longitude?: number;
  path?: string;
  familyDisplay?: string;
};

export type AnswerType = 'correct' | 'incorrect' | 'partial' | 'info';

