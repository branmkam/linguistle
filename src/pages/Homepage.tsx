import Game from "../game/Game";

export default function Homepage() {
  const dayMs = 24 * 60 * 60 * 1000;
  const startDate = new Date(Date.UTC(2026, 7, 11));
  const daysPast = Math.floor((Date.now() - startDate.getTime()) / dayMs);
  const day = Math.abs(daysPast);

  return <Game day={day} />;
}
