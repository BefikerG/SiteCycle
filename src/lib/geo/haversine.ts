export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function calculateDistanceFactor(distanceKm: number): number {
  if (distanceKm <= 5) return 1.0;
  if (distanceKm <= 25) {
    return 1.0 - ((distanceKm - 5) / 20) * 0.4;
  }
  if (distanceKm <= 50) {
    return 0.6 - ((distanceKm - 25) / 25) * 0.4;
  }
  return 0;
}

export const MAX_TRANSFER_RADIUS_KM = 50;
export const MIN_QUANTITY_COVERAGE = 0.2;
export const MIN_VIABLE_MATCH_SCORE = 50;
export const WEAK_MATCH_THRESHOLD = 30;