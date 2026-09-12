import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function Homepage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button
          onClick={() => navigate("/hard")}
          className="bg-red-700 px-6 py-3 text-white md:text-2xl"
        >
          Play Hard
        </Button>
        <Button
          onClick={() => navigate("/normal")}
          className="bg-blue-700 px-6 py-3 text-white md:text-2xl"
        >
          Play Normal
        </Button>
      </div>
    </div>
  );
}
