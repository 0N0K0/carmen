import { useQuery } from '@apollo/client';
import { GET_ALBUMS, GET_ARTISTS, GET_PLAYLISTS } from '../graphql/queries/library';

/** Métadonnées de pagination d'une page de résultats. */
export interface LibraryPagination {
  offset: number;
  limit: number;
  total: number;
}

/**
 * Charge les playlists synchronisées en base, paginées.
 * @param {number} [limit=50] Nombre maximum d'éléments à charger.
 * @param {number} [offset=0] Décalage de pagination.
 * @returns {{ playlists: object[], pagination: LibraryPagination | undefined, loading: boolean, error: Error | undefined }} Playlists et état de chargement.
 */
export function usePlaylists(limit = 50, offset = 0) {
  const { data, loading, error } = useQuery(GET_PLAYLISTS, { variables: { limit, offset } });
  return {
    playlists: data?.playlists.items ?? [],
    pagination: data?.playlists.pagination as LibraryPagination | undefined,
    loading,
    error,
  };
}

/**
 * Charge les albums favoris synchronisés en base, paginés.
 * @param {number} [limit=50] Nombre maximum d'éléments à charger.
 * @param {number} [offset=0] Décalage de pagination.
 * @returns {{ albums: object[], pagination: LibraryPagination | undefined, loading: boolean, error: Error | undefined }} Albums et état de chargement.
 */
export function useAlbums(limit = 50, offset = 0) {
  const { data, loading, error } = useQuery(GET_ALBUMS, { variables: { limit, offset } });
  return {
    albums: data?.albums.items ?? [],
    pagination: data?.albums.pagination as LibraryPagination | undefined,
    loading,
    error,
  };
}

/**
 * Charge les artistes favoris synchronisés en base, paginés.
 * @param {number} [limit=50] Nombre maximum d'éléments à charger.
 * @param {number} [offset=0] Décalage de pagination.
 * @returns {{ artists: object[], pagination: LibraryPagination | undefined, loading: boolean, error: Error | undefined }} Artistes et état de chargement.
 */
export function useArtists(limit = 50, offset = 0) {
  const { data, loading, error } = useQuery(GET_ARTISTS, { variables: { limit, offset } });
  return {
    artists: data?.artists.items ?? [],
    pagination: data?.artists.pagination as LibraryPagination | undefined,
    loading,
    error,
  };
}
