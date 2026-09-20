import { Link } from "react-router-dom";
import { Button } from "./Button";

export default function ArchiveCard({
  day,
  isPlayed = false,
}: {
  day: number;
  isPlayed?: boolean;
}) {
  return (
    <div
      className={`border flex justify-between items-center gap-4 p-4 rounded-lg shadow-md ${
        isPlayed
          ? "opacity-75"
          : "hover:bg-slate-200 transition-ease-in-out duration-200 hover:text-black"
      }`}
    >
      <h3 className="font-bold text-2xl md:text-4xl">#{day}</h3>
      {isPlayed ? (
        <Link to={`/archive/${day}`}>
          <Button className="bg-gray-400 text-black w-20 md:text-xl h-10">
            Played
          </Button>
        </Link>
      ) : (
        <Link to={`/archive/${day}`}>
          <Button className="bg-blue-600 text-white w-20 md:text-xl h-10">
            Play
          </Button>
        </Link>
      )}
    </div>
  );
}
