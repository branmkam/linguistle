import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { getCurrentDay } from "../utils/utils";
import type { User } from "@supabase/supabase-js";


export default function Homepage({ user }: { user: User | null }) {
  const navigate = useNavigate();


  return (
    <div className="flex flex-col items-center gap-4 min-h-[75vh]">
      <h2 className="text-4xl font-bold">Welcome to Linguistle{user?.user_metadata?.display_name ? `, ${user.user_metadata.display_name}` : ''}!</h2>
      <p>
        In Linguistle, your job is not to identify a mystery language by how it
        looks, but by its characteristics and features. Try your hand at the
        different difficulties now! More modes and games coming soon.
      </p>
      <h3 className="text-3xl font-ultra">Day {getCurrentDay()}</h3>
      <h2 className="text-2xl font-semibold mb-4">Choose your difficulty:</h2>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button
          onClick={() => navigate("/daily/normal")}
          className="bg-blue-700 px-6 py-3 text-white md:text-2xl"
        >
          Normal
        </Button>
        <Button
          onClick={() => navigate("/daily/hard")}
          className="bg-red-700 px-6 py-3 text-white md:text-2xl"
        >
          Hard
        </Button>
      </div>
    </div>
  );
}
