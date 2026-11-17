import ArchiveCard from "../components/ArchiveCard";
import { TitleCard } from "../components/TitleCard";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { getUserGames } from "../../supabase/gameService";
import { getCurrentDay } from "../utils/utils";

// only normal archive so far.
export default function Archive({ user }: { user: User | null }) {
  const [playedDays, setPlayedDays] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlayedDays(new Set());
      return;
    }

    getUserGames()
      .then((games) =>
        setPlayedDays(
          new Set(
            games
              .filter((game) => game.mode == "normal")
              .map((game) => game.day),
          ),
        ),
      )
      .catch((error) => console.error(error));
  }, [user]);

  const currentDay = getCurrentDay();

  return (
    <div className="mx-auto px-4 justify-start flex flex-col gap-4">
      <TitleCard
        eyebrow="Archive"
        title="Play the previous 10 normal rounds (totally free!)"
        subtitle="If you're new here, get some practice. If not, play a recent round you missed."
      />

      <div className="mx-auto flex w-full max-w-300 flex-wrap items-center justify-center gap-4">
        {Array.from({ length: 10 }, (_, i) => {
          const day = currentDay - i - 1;
          return day > 0 ? (
            <div key={i} className="w-full max-w-48 sm:max-w-52">
              <ArchiveCard day={day} isPlayed={playedDays.has(day)} />
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}
