import type { ReactNode } from "react";

type CardProps = {
  title: string;
  children: ReactNode;
};

export function Card({ title, children }: CardProps) {
  return (
    <section className="rounded-2xl border border-white/60 bg-slate-900/90 p-6">
      <h2 className="mb-3 text-2xl font-ultra text-red-200">{title}</h2>
      {children}
    </section>
  );
}
