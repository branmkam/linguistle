// hooks/useGameData.ts
import { useEffect, useState } from "react";
import { getUserGames, getUserStats } from "../../supabase/gameService";
import type { Game, StatsByMode } from "../../supabase/types";

export function useGameData() {
  const [games, setGames] = useState<Game[]>([]);
  const [stats, setStats] = useState<StatsByMode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const userGames = await getUserGames();
        setGames(userGames);
        const userStats = getUserStats(userGames);
        setStats(userStats);
      } catch (error) {
        console.error("Error loading games:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return { games, stats, loading };
}
