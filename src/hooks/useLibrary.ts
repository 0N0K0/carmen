import { useQuery } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
import { GET_ALBUMS, GET_ARTISTS, GET_PLAYLISTS } from '../graphql/queries/library';

/** Métadonnées de pagination d'une page de résultats. */
export interface LibraryPagination {
  offset: number;
  limit: number;
  total: number;
}

/** Page de résultats paginés renvoyée par les queries de bibliothèque. */
interface LibraryPage<T> {
  items: T[];
  pagination: LibraryPagination;
}

/**
 * Charge une unique page d'une ressource paginée.
 * @param {import('@apollo/client').DocumentNode} query Query GraphQL paginée (`{ items, pagination }`).
 * @param {(data: any) => LibraryPage<T>} selectPage Extrait la page depuis la réponse GraphQL.
 * @param {number} page Numéro de page (1-indexé).
 * @param {number} pageSize Nombre d'éléments par page.
 * @returns {{ items: T[], pagination: LibraryPagination | undefined, loading: boolean, error: Error | undefined }} Éléments de la page courante et état de chargement.
 */
function usePage<T>(
  query: Parameters<typeof useQuery>[0],
  selectPage: (data: unknown) => LibraryPage<T>,
  page: number,
  pageSize: number,
) {
  const { data, loading, error } = useQuery(query, {
    variables: { limit: pageSize, offset: (page - 1) * pageSize },
  });
  const result = data ? selectPage(data) : undefined;
  return { items: result?.items ?? [], pagination: result?.pagination, loading, error };
}

/**
 * Charge la totalité d'une ressource paginée : récupère la première page via
 * `useQuery`, puis enchaîne silencieusement les pages suivantes (via
 * `fetchMore`) jusqu'à ce que tous les éléments soient chargés. Le serveur
 * plafonnant `limit` (100 max), c'est le seul moyen d'obtenir une liste
 * complète (ex. 742 playlists) sans pagination visible côté UI. Réservé aux
 * vues d'aperçu (sidebar) — la page bibliothèque utilise `usePage` (paginée).
 * @param {import('@apollo/client').DocumentNode} query Query GraphQL paginée (`{ items, pagination }`).
 * @param {(data: any) => LibraryPage<T>} selectPage Extrait la page depuis la réponse GraphQL.
 * @param {number} pageSize Taille de page utilisée pour chaque requête.
 * @returns {{ items: T[], pagination: LibraryPagination | undefined, loading: boolean, error: Error | undefined }} Éléments accumulés et état de chargement.
 */
function usePaginatedAll<T>(
  query: Parameters<typeof useQuery>[0],
  selectPage: (data: unknown) => LibraryPage<T>,
  pageSize: number,
) {
  const { data, loading, error, fetchMore } = useQuery(query, {
    variables: { limit: pageSize, offset: 0 },
  });
  /** Éléments accumulés au-delà de la première page (pages 2+). */
  const [extraItems, setExtraItems] = useState<T[]>([]);
  const fetching = useRef(false);

  const firstPage = data ? selectPage(data) : undefined;
  const items = firstPage ? [...firstPage.items, ...extraItems] : [];
  const pagination = firstPage?.pagination;

  useEffect(() => {
    if (!pagination || fetching.current || items.length >= pagination.total) return;
    fetching.current = true;
    fetchMore({ variables: { offset: items.length } })
      .then(({ data: more }) => {
        const page = selectPage(more);
        setExtraItems((prev) => [...prev, ...page.items]);
      })
      .finally(() => {
        fetching.current = false;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, pagination?.total, fetchMore]);

  return { items, pagination, loading, error };
}

/**
 * Charge une page de playlists synchronisées en base.
 * @param {number} [page=1] Numéro de page (1-indexé).
 * @param {number} [pageSize=50] Nombre d'éléments par page.
 * @returns {{ playlists: object[], pagination: LibraryPagination | undefined, loading: boolean, error: Error | undefined }} Playlists de la page courante et état de chargement.
 */
export function usePlaylists(page = 1, pageSize = 50) {
  const { items, pagination, loading, error } = usePage(
    GET_PLAYLISTS,
    (data) => (data as { playlists: LibraryPage<unknown> }).playlists,
    page,
    pageSize,
  );
  return { playlists: items, pagination, loading, error };
}

/**
 * Charge une page d'albums favoris synchronisés en base.
 * @param {number} [page=1] Numéro de page (1-indexé).
 * @param {number} [pageSize=50] Nombre d'éléments par page.
 * @returns {{ albums: object[], pagination: LibraryPagination | undefined, loading: boolean, error: Error | undefined }} Albums de la page courante et état de chargement.
 */
export function useAlbums(page = 1, pageSize = 50) {
  const { items, pagination, loading, error } = usePage(
    GET_ALBUMS,
    (data) => (data as { albums: LibraryPage<unknown> }).albums,
    page,
    pageSize,
  );
  return { albums: items, pagination, loading, error };
}

/**
 * Charge une page d'artistes favoris synchronisés en base.
 * @param {number} [page=1] Numéro de page (1-indexé).
 * @param {number} [pageSize=50] Nombre d'éléments par page.
 * @returns {{ artists: object[], pagination: LibraryPagination | undefined, loading: boolean, error: Error | undefined }} Artistes de la page courante et état de chargement.
 */
export function useArtists(page = 1, pageSize = 50) {
  const { items, pagination, loading, error } = usePage(
    GET_ARTISTS,
    (data) => (data as { artists: LibraryPage<unknown> }).artists,
    page,
    pageSize,
  );
  return { artists: items, pagination, loading, error };
}

/**
 * Charge la totalité des playlists synchronisées en base (sidebar).
 * @param {number} [pageSize=100] Taille de page utilisée pour chaque requête réseau.
 * @returns {{ playlists: object[], pagination: LibraryPagination | undefined, loading: boolean, error: Error | undefined }} Playlists et état de chargement.
 */
export function useAllPlaylists(pageSize = 100) {
  const { items, pagination, loading, error } = usePaginatedAll(
    GET_PLAYLISTS,
    (data) => (data as { playlists: LibraryPage<unknown> }).playlists,
    pageSize,
  );
  return { playlists: items, pagination, loading, error };
}

/**
 * Charge la totalité des albums favoris synchronisés en base (sidebar).
 * @param {number} [pageSize=100] Taille de page utilisée pour chaque requête réseau.
 * @returns {{ albums: object[], pagination: LibraryPagination | undefined, loading: boolean, error: Error | undefined }} Albums et état de chargement.
 */
export function useAllAlbums(pageSize = 100) {
  const { items, pagination, loading, error } = usePaginatedAll(
    GET_ALBUMS,
    (data) => (data as { albums: LibraryPage<unknown> }).albums,
    pageSize,
  );
  return { albums: items, pagination, loading, error };
}

/**
 * Charge la totalité des artistes favoris synchronisés en base (sidebar).
 * @param {number} [pageSize=100] Taille de page utilisée pour chaque requête réseau.
 * @returns {{ artists: object[], pagination: LibraryPagination | undefined, loading: boolean, error: Error | undefined }} Artistes et état de chargement.
 */
export function useAllArtists(pageSize = 100) {
  const { items, pagination, loading, error } = usePaginatedAll(
    GET_ARTISTS,
    (data) => (data as { artists: LibraryPage<unknown> }).artists,
    pageSize,
  );
  return { artists: items, pagination, loading, error };
}
