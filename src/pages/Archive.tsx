import ArchiveCard from "../components/ArchiveCard";
import { TitleCard } from "../components/TitleCard";
import langs from "../data/toplanguages.json";

export default function Archive() {
  const dayMs = 24 * 60 * 60 * 1000;
  const startDate = new Date(Date.UTC(2026, 8, 1)); // 26 Aug 2026
  const daysPast = Math.floor(
    (new Date().getTime() - startDate.getTime()) / dayMs,
  );
  const currentIndex = Math.abs(daysPast) % langs.length;

  return (
    <div className="mx-auto px-4 justify-start flex flex-col gap-4">
      <TitleCard
        eyebrow="Archive"
        title="Play the previous 10 normal rounds (totally free!)"
        subtitle="If you're new here, get some practice. If not, play a recent round you missed."
      />

      <div className="mx-auto flex w-full max-w-300 flex-wrap items-center justify-center gap-4">
        {Array.from({ length: 10 }, (_, i) => {
          const day = currentIndex - i - 1;
          return day > 0 ? (
            <div key={i} className="w-full max-w-48 sm:max-w-52">
              <ArchiveCard day={day} />
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}
