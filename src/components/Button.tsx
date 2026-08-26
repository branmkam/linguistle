import React from "react";

export function Button({
  children,
  className = "",
  disabled = false,
  noHoverScaling = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { noHoverScaling?: boolean }) {
  const base = "transition-all duration-150 transform rounded-2xl";
  const stateClass = disabled ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer";
  const hoverClass = !noHoverScaling && !disabled ? "hover:scale-106" : ""; 

  return (
    <button
      className={`${base} ${stateClass} ${hoverClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
