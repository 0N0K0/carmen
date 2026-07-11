import { HeartIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { usePlaylist } from '../../hooks/useDetail';
import type { LibrarySortOrder } from '../../hooks/useLibrary';
import { useAllPlaylists, useLibraryStats } from '../../hooks/useLibrary';
import { LibraryItemCard, LibrarySection } from './components';
import { formatLibraryTitle } from './utils';

/**
 * Page des coups de cœur : tracks de la playlist spéciale Deezer
 * marquée `isLovedTrack`, triable par titre. Aucune query dédiée côté
 * backend pour la liste — la playlist est repérée parmi celles déjà
 * chargées, puis son détail (tracks) est récupéré via `usePlaylist`. Le
 * compte affiché dans le titre vient de `libraryStats` (total réel côté
 * API) : la playlist spéciale peut être tronquée en base par la sync, sans
 * rapport avec le nombre réel de coups de cœur.
 * @returns {JSX.Element} Page coups de cœur.
 */
export function LibraryLovedPage() {
  const [sort, setSort] = useState<LibrarySortOrder>('ASC');
  const { playlists, loading: playlistsLoading } = useAllPlaylists();
  const lovedPlaylist = playlists.find((p) => p.isLovedTrack);
  const { playlist, loading: tracksLoading } = usePlaylist(lovedPlaylist?.id);
  const { stats } = useLibraryStats();

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
      title={formatLibraryTitle(
        stats?.favoriteTracksTotal,
        'coup de cœur',
        'Coups de cœur',
        'coups de cœur',
      )}
      loading={playlistsLoading || tracksLoading}
      emptyIcon={<HeartIcon size={32} />}
      emptyMessage="Aucun coup de cœur."
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
