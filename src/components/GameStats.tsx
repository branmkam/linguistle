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
      <p>Games: {stats?.totalGames}</p>
      <p>Wins: {stats?.wins}</p>
      <p>Win Rate: {stats?.winRate}%</p>
      <p>Current Streak: {stats?.currentStreak}</p>
      <p>Average Guesses: {stats?.averageGuesses}</p>
    </div>
  );
}