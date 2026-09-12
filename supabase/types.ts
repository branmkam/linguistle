export interface Game {
  id: string;
  user_id: string;
  day: number;
  date?: string;
  solved: boolean;
  guesses: string[];
  created_at: string;
  mode: string;
  score: number;
}

export interface Profile {
  id: string;
  username: string;
  created_at: string;
}

export interface UserWithGames extends Profile {
  games: Game[];
}

export interface Stats {
  totalGames: number;
  wins: number;
  winRate: number;
  currentStreak: number;
  averageGuesses: number;
  averageScore: number;
}
