import { HeartIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { usePlaylist } from '../../hooks/useDetail';
import type { LibrarySortOrder } from '../../hooks/useLibrary';
import { useAllPlaylists } from '../../hooks/useLibrary';
import { LibraryItemCard, LibrarySection } from './components';

/**
 * Page des titres aimés ("Favoris") : tracks de la playlist spéciale Deezer
 * marquée `isLovedTrack`, triable par titre. Aucune query dédiée côté
 * backend — la playlist est repérée parmi celles déjà chargées, puis son
 * détail (tracks) est récupéré via `usePlaylist`.
 * @returns {JSX.Element} Page favoris.
 */
export function LibraryLovedPage() {
  const [sort, setSort] = useState<LibrarySortOrder>('ASC');
  const { playlists, loading: playlistsLoading } = useAllPlaylists();
  const lovedPlaylist = playlists.find((p) => p.isLovedTrack);
  const { playlist, loading: tracksLoading } = usePlaylist(lovedPlaylist?.id);

  const tracks = (
    (playlist?.tracks ?? []) as {
      id: string;
      title: string;
      artist?: { name: string } | null;
      album?: { cover?: string | null } | null;
    }[]
  )
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title) * (sort === 'ASC' ? 1 : -1));

  return (
    <LibrarySection
      title="Favoris"
      loading={playlistsLoading || tracksLoading}
      emptyIcon={<HeartIcon size={32} />}
      emptyMessage="Aucun titre aimé."
      sort={sort}
      onToggleSort={() => setSort((s) => (s === 'ASC' ? 'DESC' : 'ASC'))}
    >
      {tracks.map((track) => (
        <LibraryItemCard
          key={track.id}
          image={track.album?.cover}
          fallback={<HeartIcon />}
          title={track.title}
          subtitle={track.artist?.name}
        />
      ))}
    </LibrarySection>
  );
}
