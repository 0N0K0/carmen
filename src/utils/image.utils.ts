import { API_BASE_URL } from '../config';

/**
 * Fait passer une URL d'image Deezer par le proxy backend (`/image-proxy`) :
 * Deezer bloque l'embarquement direct depuis un navigateur (anti-hotlink/bot),
 * le proxy fait le fetch serveur-à-serveur et sert les octets depuis notre domaine.
 * @param {string | null} [url] URL de l'image Deezer. `undefined`/`null` passés tels quels.
 * @returns {string | undefined} URL proxifiée, ou `undefined` si `url` est absent.
 */
export function toProxiedImageUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  return `${API_BASE_URL}/image-proxy?url=${encodeURIComponent(url)}`;
}
