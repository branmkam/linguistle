import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { getCurrentDay } from "../utils/utils";
import type { User } from "@supabase/supabase-js";

export default function Homepage({ user }: { user: User | null }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-4 min-h-[75vh]">
      <h2 className="text-4xl font-bold">
        Welcome to Linguistle
        {user?.user_metadata?.display_name
          ? `, ${user.user_metadata.display_name}`
          : ""}
        !
      </h2>
      <p className="text-lg">
        In Linguistle, your job is not to identify a mystery language by how it
        looks, but by its characteristics and location.
      </p>
      <p className="text-lg">More modes and games coming soon.</p>
      <h3 className="text-3xl font-ultra">
        <span className="text-amber-600">Day {getCurrentDay()}</span> |{" "}
        {new Date().toLocaleDateString(undefined, {
          month: "numeric",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        })}
      </h3>
      <h2 className="text-2xl font-semibold mb-4">Choose your difficulty:</h2>
      <div className="flex flex-col items-center w-80 gap-4">
        <div className="flex items-center justify-between text-white w-full min-h-20 bg-slate-700/90 p-4 rounded-lg border-white">
          <Button
            onClick={() => navigate("/daily/easy")}
            className="bg-green-700 px-6 w-28 py-3 md:text-2xl"
          >
            Easy
          </Button>
          <p className="text-xl">{">40 mil. speakers"}</p>
        </div>
        <div className="flex items-center justify-between text-white w-full min-h-20 bg-slate-700/90 p-4 rounded-lg border-white">
          <Button
            onClick={() => navigate("/daily/normal")}
            className="bg-blue-700 px-6 w-28 py-3 md:text-2xl"
          >
            Normal
          </Button>
          <p className="text-xl">{">10 mil. speakers"}</p>
        </div>
        <div className="flex items-center justify-between text-white w-full min-h-20 bg-slate-700/90 p-4 rounded-lg border-white">
          <Button
            onClick={() => navigate("/daily/hard")}
            className="bg-red-700 px-6 w-28 py-3 md:text-2xl"
          >
            Hard
          </Button>
          <p className="text-xl">{"1 to 50 mil. speakers"}</p>
        </div>
      </div>
    </div>
  );
}
