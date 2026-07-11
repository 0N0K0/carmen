import { useQuery } from '@apollo/client';
import { GET_ALBUM, GET_ARTIST, GET_PLAYLIST } from '../graphql/queries/detail';

/**
 * Charge une playlist et ses tracks par son identifiant Deezer.
 * @param {string} [id] Identifiant de la playlist. La requête est ignorée si absent.
 * @returns {{ playlist: object | undefined, loading: boolean, error: Error | undefined }} Playlist et état de chargement.
 */
export function usePlaylist(id?: string) {
  const { data, loading, error } = useQuery(GET_PLAYLIST, {
    variables: { id },
    skip: !id,
  });
  return { playlist: data?.playlist, loading, error };
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
