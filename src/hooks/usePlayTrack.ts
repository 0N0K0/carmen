import { useCallback } from 'react';
import { usePlayerStore, type Track } from '../store/player';

/** Sous-ensemble du type Track GraphQL nécessaire pour lancer la lecture. */
export interface GqlTrack {
  id: string;
  title: string;
  duration: number;
  preview?: string | null;
  artist: { name: string };
  album: { cover?: string | null };
}

/**
 * Convertit un track GraphQL en track du store player.
 * @param {GqlTrack} t Track issu de l'API GraphQL.
 * @returns {Track} Track compatible avec le store player.
 */
function mapTrack(t: GqlTrack): Track {
  return {
    id: t.id,
    title: t.title,
    artist: t.artist.name,
    artworkUrl: t.album.cover ?? undefined,
    audioUrl: t.preview ?? '',
    duration: t.duration,
  };
}

/**
 * Hook pour lancer la lecture d'un track depuis l'API Carmen.
 * Mappe le track GraphQL vers le format du store et démarre la lecture.
 * La résolution de l'URL de stream (getStreamUrl) est gérée par le Player.
 *
 * @returns {(track: GqlTrack, queue?: GqlTrack[]) => void} Fonction pour lancer la lecture.
 */
export function usePlayTrack(): (track: GqlTrack, queue?: GqlTrack[]) => void {
  const play = usePlayerStore((s) => s.play);

  return useCallback(
    (track: GqlTrack, queue: GqlTrack[] = []) => {
      play(mapTrack(track), queue.map(mapTrack));
    },
    [play],
  );
}
