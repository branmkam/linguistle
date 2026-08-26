import type { AnswerType } from "../utils/types";

export const TableCell = ({
  children,
  type,
}: {
  children: React.ReactNode;
  type: AnswerType;
}) => {
  const typeMap = {
    correct: "bg-green-700",
    incorrect: "bg-red-700",
    partial: "bg-yellow-600",
    info: "bg-blue-900",
  };

  return (
    <div
      className={`${typeMap[type]} flex items-center justify-center p-2 text-xl ${type == "info" ? "h-28 md:h-16" : "h-24"} rounded-md w-full text-white`}
    >
      {children}
    </div>
  );
};
