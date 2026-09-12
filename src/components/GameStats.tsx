// components/GameStats.tsx
import { useGameData } from '../hooks/useGameData';

export function GameStats() {
  const { games, stats, loading } = useGameData();

  if (loading) return <div>Loading...</div>;
  console.log(games);
  console.log(stats);

  return (
    <div>
      <h2>Your Stats</h2>
      <p>Games: {stats?.totalGames || 0}</p>
      <p>Wins: {stats?.wins || 0}</p>
      <p>Win Rate: {stats?.winRate || 0}%</p>
      <p>Current Streak: {stats?.currentStreak || 0}</p>
      <p>Average Guesses: {stats?.averageGuesses || 0}</p>
    </div>
  );
}