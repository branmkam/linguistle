// components/GameStats.tsx
import { useGameData } from '../hooks/useGameData';
import { gameModes } from '../../supabase/types';

export function GameStats() {
  const { stats, loading } = useGameData();

  if (loading || !stats) return <div>Loading...</div>;

  const statRows = [
    ['Games', (modeStats: typeof stats.easy) => modeStats.totalGames],
    ['Wins', (modeStats: typeof stats.easy) => modeStats.wins],
    ['Win Rate', (modeStats: typeof stats.easy) => `${modeStats.winRate}%`],
    ['Current Streak', (modeStats: typeof stats.easy) => modeStats.currentStreak],
    ['Average Guesses', (modeStats: typeof stats.easy) => modeStats.averageGuesses],
    ['Average Score', (modeStats: typeof stats.easy) => modeStats.averageScore],
  ] as const;

  return (
    <div>
      <h2 className="text-4xl font-bold mb-2">Your Stats</h2>
      <table className="w-full text-xl text-left">
        <thead>
          <tr className="border-b border-gray-500">
            <th className="py-2 pr-4">Stat</th>
            {gameModes.map((mode) => (
              <th key={mode} className="py-2 px-4 capitalize">
                {mode}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {statRows.map(([label, getValue]) => (
            <tr key={label} className="border-b border-gray-700">
              <th className="py-2 pr-4 font-normal">{label}</th>
              {gameModes.map((mode) => (
                <td key={mode} className="py-2 px-4">
                  {getValue(stats[mode])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}