import ArchiveCard from "../components/ArchiveCard";
import langs from "../data/toplanguages.json";

export default function Archive() {
  const dayMs = 24 * 60 * 60 * 1000;
  const startDate = new Date(Date.UTC(2026, 8, 1)); // 26 Aug 2026
  const daysPast = Math.floor((new Date().getTime() - startDate.getTime()) / dayMs);
  const currentIndex = Math.abs(daysPast) % langs.length;

  return (
    <div className="m-4 flex flex-col gap-4">
      <h1 className="text-xl font-ultra md:text-3xl">Archive Page</h1>
      <h2 className="text-lg font-bold md:text-2xl">
        Play the previous 10 normal rounds (totally free!)
      </h2>
      <p className="text-md md:text-lg">
        If you're new here, get some practice. If not, play a recent round you
        missed.
      </p>

      <div className="mx-auto flex w-full max-w-200 flex-wrap items-center justify-center gap-4">
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
