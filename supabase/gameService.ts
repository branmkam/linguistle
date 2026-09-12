import { supabase } from "./supabase";
import type { Game, Profile } from "./types";

// Get current user's profile
export async function getUserProfile() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.session.user.id)
    .single();

  return profile as Profile | null;
}

// Create a new game
export async function createGame(guesses: string[], solved: boolean, day: number, mode: string = "normal") {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("games")
    .insert({
      user_id: user.id,
      guesses,
      solved,
      day,
      mode,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Game;
}

// Get all games for current user
export async function getUserGames() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("user_id", user.id)
    .order("day", { ascending: false });

  if (error) throw error;
  return data as Game[];
}

// Update a game (if needed)
export async function updateGame(gameId: string, updates: Partial<Game>) {
  const { data, error } = await supabase
    .from("games")
    .update(updates)
    .eq("id", gameId)
    .select()
    .single();

  if (error) throw error;
  return data as Game;
}

// Get stats for current user
export async function getUserStats() {
  const games = await getUserGames();
  const totalGames = games.length;
  const wins = games.filter((g) => g.solved).length;
  const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;
  const currentStreak = calculateStreak(games);
  const averageGuesses =
    totalGames > 0
      ? games.reduce((sum, g) => sum + (Array.isArray(g.guesses) ? g.guesses.length : 0), 0) / totalGames
      : 0;

  return {
    totalGames,
    wins,
    winRate: Number(winRate.toFixed(1)),
    currentStreak,
    averageGuesses: Number(averageGuesses.toFixed(1)),
  };
}

// Helper to calculate current streak
function calculateStreak(games: Game[]): number {
  let streak = 0;
  const sortedGames = [...games].sort((a, b) => {
    const aDay = typeof a.day === "number" ? a.day : 0;
    const bDay = typeof b.day === "number" ? b.day : 0;
    return bDay - aDay;
  });

  for (const game of sortedGames) {
    if (game.solved) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
