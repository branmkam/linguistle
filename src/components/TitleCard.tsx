type TitleCardProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
};

export function TitleCard({
  eyebrow,
  title,
  subtitle,
  className = "",
}: TitleCardProps) {
  return (
    <div
      className={`mb-8 rounded-2xl border border-white/10 bg-black/100 p-6 shadow-sm backdrop-blur-sm ${className}`.trim()}
    >
      {eyebrow ? (
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-red-300">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-3xl font-bold text-white sm:text-4xl">{title}</h1>
      {subtitle ? <p className="mt-3 text-base text-slate-200">{subtitle}</p> : null}
    </div>
  );
}
