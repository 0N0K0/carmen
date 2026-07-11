/**
 * Formate un titre de section avec son compte pluralisé (ex. "742 playlists", "1 artiste").
 * @param {number} [total] Nombre total d'éléments. `undefined` tant que non connu — retombe sur `fallback`.
 * @param {string} singular Libellé au singulier (ex. "playlist").
 * @param {string} fallback Titre affiché tant que `total` est inconnu (ex. "Playlists").
 * @param {string} [plural] Libellé au pluriel. Par défaut `${singular}s`.
 * @returns {string} Titre de section prêt à afficher.
 */
export function formatLibraryTitle(
  total: number | undefined,
  singular: string,
  fallback: string,
  plural?: string,
): string {
  if (total === undefined) return fallback;
  const formattedTotal = total.toLocaleString('fr-FR').replace(/\u202F/g, ' ');
  return `${formattedTotal} ${total > 1 ? (plural ?? `${singular}s`) : singular}`;
}

/** Un mois est compt\u00E9 comme 30 jours pour ce calcul approximatif de dur\u00E9e cumul\u00E9e. */
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;
const MS_PER_MONTH = 30 * MS_PER_DAY;

/**
 * Convertit une dur\u00E9e en millisecondes en un libell\u00E9 "X mois, Y jours, Z
 * heures, W minutes, V secondes" (unit\u00E9s nulles en t\u00EAte omises).
 * @param {number} durationMs Dur\u00E9e totale en millisecondes.
 * @returns {string} Dur\u00E9e format\u00E9e en toutes lettres.
 */
export function formatDuration(durationMs: number): string {
  let remaining = durationMs;
  const months = Math.floor(remaining / MS_PER_MONTH);
  remaining -= months * MS_PER_MONTH;
  const days = Math.floor(remaining / MS_PER_DAY);
  remaining -= days * MS_PER_DAY;
  const hours = Math.floor(remaining / MS_PER_HOUR);
  remaining -= hours * MS_PER_HOUR;
  const minutes = Math.floor(remaining / MS_PER_MINUTE);
  remaining -= minutes * MS_PER_MINUTE;
  const seconds = Math.floor(remaining / MS_PER_SECOND);

  const units: [number, string, string][] = [
    [months, 'mois', 'mois'],
    [days, 'jour', 'jours'],
    [hours, 'heure', 'heures'],
    [minutes, 'minute', 'minutes'],
    [seconds, 'seconde', 'secondes'],
  ];

  const firstNonZero = units.findIndex(([value]) => value > 0);
  const parts = units.slice(firstNonZero === -1 ? units.length - 1 : firstNonZero);

  return parts.map(([value, singular, plural]) => `${value} ${value > 1 ? plural : singular}`).join(', ');
}
