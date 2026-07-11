import { useQuery } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
import { GET_ALBUM, GET_ARTIST, GET_PLAYLIST } from '../graphql/queries/detail';

/** Track d'une playlist, tel que renvoyé par `GET_PLAYLIST`. */
interface PlaylistTrack {
  id: string;
  title: string;
  duration: number;
  artist?: { id: string; name: string } | null;
  album?: { id: string; title: string; cover?: string | null } | null;
}

/** Playlist telle que renvoyée par `GET_PLAYLIST`, avant aplatissement de la tracklist paginée. */
interface PlaylistDetail {
  id: string;
  title: string;
  description?: string | null;
  picture?: string | null;
  duration?: number | null;
  public?: boolean | null;
  collaborative?: boolean | null;
  fans?: number | null;
  tracks?: { items: PlaylistTrack[]; pagination: { total: number } };
}

/**
 * Charge une playlist et l'intégralité de ses tracks par son identifiant
 * Deezer. `Playlist.tracks` est paginé côté serveur (100 max par appel) —
 * ce hook enchaîne silencieusement les pages jusqu'à charger la tracklist
 * complète, avant de la renvoyer aplatie sur `playlist.tracks`.
 * @param {string} [id] Identifiant de la playlist. La requête est ignorée si absent.
 * @param {number} [pageSize=100] Nombre de tracks chargés par appel réseau.
 * @returns {{ playlist: object | undefined, tracksTotal: number | undefined, loading: boolean, error: Error | undefined }} Playlist (avec tracklist complète) et état de chargement.
 */
export function usePlaylist(id?: string, pageSize = 100) {
  const { data, loading, error, fetchMore } = useQuery(GET_PLAYLIST, {
    variables: { id, tracksLimit: pageSize, tracksOffset: 0 },
    skip: !id,
  });
  const [extraTracks, setExtraTracks] = useState<PlaylistTrack[]>([]);
  const fetching = useRef(false);

  // Changer de playlist invalide les tracks déjà accumulées. Reset synchrone
  // pendant le rendu (pattern React "adjusting state on prop change").
  const [prevId, setPrevId] = useState(id);
  if (prevId !== id) {
    setPrevId(id);
    setExtraTracks([]);
  }

  const playlist = data?.playlist as PlaylistDetail | undefined;
  const firstPageTracks = playlist?.tracks?.items ?? [];
  const tracks = [...firstPageTracks, ...extraTracks];
  const tracksTotal = playlist?.tracks?.pagination.total;

  useEffect(() => {
    if (!playlist || tracksTotal === undefined || fetching.current || tracks.length >= tracksTotal)
      return;
    fetching.current = true;
    fetchMore({ variables: { tracksOffset: tracks.length } })
      .then(({ data: more }) => {
        const items = (more?.playlist as PlaylistDetail | undefined)?.tracks?.items ?? [];
        setExtraTracks((prev) => [...prev, ...items]);
      })
      .finally(() => {
        fetching.current = false;
      });
  }, [tracks.length, tracksTotal, playlist, fetchMore]);

  return {
    playlist: playlist ? { ...playlist, tracks } : undefined,
    tracksTotal,
    loading,
    error,
  };
}

/**
 * Charge un album et ses tracks par son identifiant Deezer.
 * @param {string} [id] Identifiant de l'album. La requête est ignorée si absent.
 * @returns {{ album: object | undefined, loading: boolean, error: Error | undefined }} Album et état de chargement.
 */
export function useAlbum(id?: string) {
  const { data, loading, error } = useQuery(GET_ALBUM, {
    variables: { id },
    skip: !id,
  });
  return { album: data?.album, loading, error };
}

/**
 * Charge un artiste par son identifiant Deezer.
 * @param {string} [id] Identifiant de l'artiste. La requête est ignorée si absent.
 * @returns {{ artist: object | undefined, loading: boolean, error: Error | undefined }} Artiste et état de chargement.
 */
export function useArtist(id?: string) {
  const { data, loading, error } = useQuery(GET_ARTIST, {
    variables: { id },
    skip: !id,
  });
  return { artist: data?.artist, loading, error };
}
