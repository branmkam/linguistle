export interface Game {
  id: string;
  user_id: string;
  date: string;
  solved: boolean;
  guesses: string[];
  created_at: string;
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
}