import { useQuery } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
import { GET_ALBUMS, GET_ARTISTS, GET_PLAYLISTS } from '../graphql/queries/library';

/** Métadonnées de pagination d'une page de résultats. */
export interface LibraryPagination {
  offset: number;
  limit: number;
  total: number;
}

/** Sens de tri par titre/nom (`SortOrder` GraphQL). D'autres critères de tri pourront s'ajouter plus tard. */
export type LibrarySortOrder = 'ASC' | 'DESC';

/** Page de résultats paginés renvoyée par les queries de bibliothèque. */
interface LibraryPage<T> {
  items: T[];
  pagination: LibraryPagination;
}

/** Playlist telle que renvoyée par `GET_PLAYLISTS`. */
export interface PlaylistSummary {
  id: string;
  title: string;
  picture?: string | null;
  public?: boolean | null;
  isLovedTrack?: boolean | null;
}

/** Album favori tel que renvoyé par `GET_ALBUMS`. */
export interface AlbumSummary {
  id: string;
  title: string;
  cover?: string | null;
  artist?: { id: string; name: string } | null;
}

/** Artiste favori tel que renvoyé par `GET_ARTISTS`. */
export interface ArtistSummary {
  id: string;
  name: string;
  picture?: string | null;
  nbAlbum?: number | null;
}

/**
 * Charge une unique page d'une ressource paginée, triée par le serveur.
 * @param {import('@apollo/client').DocumentNode} query Query GraphQL paginée (`{ items, pagination }`).
 * @param {(data: any) => LibraryPage<T>} selectPage Extrait la page depuis la réponse GraphQL.
 * @param {number} page Numéro de page (1-indexé).
 * @param {number} pageSize Nombre d'éléments par page.
 * @param {LibrarySortOrder} orderBy Sens de tri (titre/nom).
 * @returns {{ items: T[], pagination: LibraryPagination | undefined, loading: boolean, error: Error | undefined }} Éléments de la page courante et état de chargement.
 */
function usePage<T>(
  query: Parameters<typeof useQuery>[0],
  selectPage: (data: unknown) => LibraryPage<T>,
  page: number,
  pageSize: number,
  orderBy: LibrarySortOrder,
) {
  const { data, loading, error } = useQuery(query, {
    variables: { limit: pageSize, offset: (page - 1) * pageSize, orderBy },
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
 * @param {LibrarySortOrder} orderBy Sens de tri (titre/nom).
 * @returns {{ items: T[], pagination: LibraryPagination | undefined, loading: boolean, error: Error | undefined }} Éléments accumulés et état de chargement.
 */
function usePaginatedAll<T>(
  query: Parameters<typeof useQuery>[0],
  selectPage: (data: unknown) => LibraryPage<T>,
  pageSize: number,
  orderBy: LibrarySortOrder,
) {
  const { data, loading, error, fetchMore } = useQuery(query, {
    variables: { limit: pageSize, offset: 0, orderBy },
  });
  /** Éléments accumulés au-delà de la première page (pages 2+). */
  const [extraItems, setExtraItems] = useState<T[]>([]);
  const fetching = useRef(false);

  // Le tri change l'ordre global : les pages déjà accumulées avec l'ancien tri ne sont plus
  // valables. Reset synchrone pendant le rendu (pattern React "adjusting state on prop change"),
  // pas d'effet, pour éviter un rendu intermédiaire avec des données mélangées.
  const [prevOrderBy, setPrevOrderBy] = useState(orderBy);
  if (prevOrderBy !== orderBy) {
    setPrevOrderBy(orderBy);
    setExtraItems([]);
  }

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
 * @param {number} [page=1] Numéro de page (1-indexée).
 * @param {number} [pageSize=50] Nombre d'éléments par page.
 * @param {LibrarySortOrder} [orderBy='ASC'] Sens de tri par titre.
 * @returns {{ playlists: object[], pagination: LibraryPagination | undefined, loading: boolean, error: Error | undefined }} Playlists de la page courante et état de chargement.
 */
export function usePlaylists(page = 1, pageSize = 50, orderBy: LibrarySortOrder = 'ASC') {
  const { items, pagination, loading, error } = usePage(
    GET_PLAYLISTS,
    (data) => (data as { playlists: LibraryPage<PlaylistSummary> }).playlists,
    page,
    pageSize,
    orderBy,
  );
  return { playlists: items, pagination, loading, error };
}

/**
 * Charge une page d'albums favoris synchronisés en base.
 * @param {number} [page=1] Numéro de page (1-indexée).
 * @param {number} [pageSize=50] Nombre d'éléments par page.
 * @param {LibrarySortOrder} [orderBy='ASC'] Sens de tri par titre.
 * @returns {{ albums: object[], pagination: LibraryPagination | undefined, loading: boolean, error: Error | undefined }} Albums de la page courante et état de chargement.
 */
export function useAlbums(page = 1, pageSize = 50, orderBy: LibrarySortOrder = 'ASC') {
  const { items, pagination, loading, error } = usePage(
    GET_ALBUMS,
    (data) => (data as { albums: LibraryPage<AlbumSummary> }).albums,
    page,
    pageSize,
    orderBy,
  );
  return { albums: items, pagination, loading, error };
}

/**
 * Charge une page d'artistes favoris synchronisés en base.
 * @param {number} [page=1] Numéro de page (1-indexée).
 * @param {number} [pageSize=50] Nombre d'éléments par page.
 * @param {LibrarySortOrder} [orderBy='ASC'] Sens de tri par nom.
 * @returns {{ artists: object[], pagination: LibraryPagination | undefined, loading: boolean, error: Error | undefined }} Artistes de la page courante et état de chargement.
 */
export function useArtists(page = 1, pageSize = 50, orderBy: LibrarySortOrder = 'ASC') {
  const { items, pagination, loading, error } = usePage(
    GET_ARTISTS,
    (data) => (data as { artists: LibraryPage<ArtistSummary> }).artists,
    page,
    pageSize,
    orderBy,
  );
  return { artists: items, pagination, loading, error };
}

/**
 * Charge la totalité des playlists synchronisées en base (sidebar).
 * @param {number} [pageSize=100] Taille de page utilisée pour chaque requête réseau.
 * @param {LibrarySortOrder} [orderBy='ASC'] Sens de tri par titre.
 * @returns {{ playlists: object[], pagination: LibraryPagination | undefined, loading: boolean, error: Error | undefined }} Playlists et état de chargement.
 */
export function useAllPlaylists(pageSize = 100, orderBy: LibrarySortOrder = 'ASC') {
  const { items, pagination, loading, error } = usePaginatedAll(
    GET_PLAYLISTS,
    (data) => (data as { playlists: LibraryPage<PlaylistSummary> }).playlists,
    pageSize,
    orderBy,
  );
  return { playlists: items, pagination, loading, error };
}

/**
 * Charge la totalité des albums favoris synchronisés en base (sidebar).
 * @param {number} [pageSize=100] Taille de page utilisée pour chaque requête réseau.
 * @param {LibrarySortOrder} [orderBy='ASC'] Sens de tri par titre.
 * @returns {{ albums: object[], pagination: LibraryPagination | undefined, loading: boolean, error: Error | undefined }} Albums et état de chargement.
 */
export function useAllAlbums(pageSize = 100, orderBy: LibrarySortOrder = 'ASC') {
  const { items, pagination, loading, error } = usePaginatedAll(
    GET_ALBUMS,
    (data) => (data as { albums: LibraryPage<AlbumSummary> }).albums,
    pageSize,
    orderBy,
  );
  return { albums: items, pagination, loading, error };
}

/**
 * Charge la totalité des artistes favoris synchronisés en base (sidebar).
 * @param {number} [pageSize=100] Taille de page utilisée pour chaque requête réseau.
 * @param {LibrarySortOrder} [orderBy='ASC'] Sens de tri par nom.
 * @returns {{ artists: object[], pagination: LibraryPagination | undefined, loading: boolean, error: Error | undefined }} Artistes et état de chargement.
 */
export function useAllArtists(pageSize = 100, orderBy: LibrarySortOrder = 'ASC') {
  const { items, pagination, loading, error } = usePaginatedAll(
    GET_ARTISTS,
    (data) => (data as { artists: LibraryPage<ArtistSummary> }).artists,
    pageSize,
    orderBy,
  );
  return { artists: items, pagination, loading, error };
}
