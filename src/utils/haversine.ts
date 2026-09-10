export const toRad = (deg: number) => (deg * Math.PI) / 180;

export function haversineKm(aLat: number, aLon: number, bLat: number, bLon: number) {
  const R = 6371; // earth km
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const A = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const C = 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1 - A));
  return R * C;
}
