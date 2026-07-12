/**
 * Formate une durée de track en `m:ss` (ex. 65 → "1:05").
 * @param {number} seconds Durée en secondes.
 * @returns {string} Durée au format `m:ss`.
 */
export function formatTrackDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Formate une durée cumulée (ex. durée totale d'une playlist) en heures et
 * minutes, ou en minutes seules si moins d'une heure.
 * @param {number} seconds Durée en secondes.
 * @returns {string} Durée au format "3 h 42 min" ou "42 min".
 */
export function formatTotalDuration(seconds: number): string {
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours} h ${minutes} min` : `${minutes} min`;
}
