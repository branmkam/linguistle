import type { AnswerType } from "../utils/types";

export const TableCell = ({
  children,
  type,
  className,
  animationPlace,
  title
}: {
  children: React.ReactNode;
  type: AnswerType;
  className?: string;
  animationPlace?: number;
  title?: string;
}) => {
  const typeMap = {
    correct: "bg-green-700",
    incorrect: "bg-red-700",
    partial: "bg-yellow-600",
    info: "bg-blue-900",
  };

  const animationDelay = animationPlace ? `${(animationPlace - 1) * 200}ms` : "0ms";

  return (
    <div
      className={`${typeMap[type]} hover:scale-104 transition-all duration-150 text-wrap wrap-break-word flex items-center justify-center p-2 sm:text-xl md:text-2xl ${type === "info" ? "h-16 sm:text-base md:text-xl" : "h-28 lg:h-20 sm:text-xl md:text-2xl"} rounded-md w-full text-white ${className ?? ""}`}
      style={{
        animation: "table-cell-flip 500ms ease-out both",
        animationDelay,
      }}
      title={title ?? ''}
    >
      {children}
    </div>
  );
};
