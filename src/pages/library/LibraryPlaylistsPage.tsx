import { PlaylistIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import type { LibrarySortOrder } from '../../hooks/useLibrary';
import { useLibraryStats, usePlaylistsInfinite } from '../../hooks/useLibrary';
import { LIBRARY_INFINITE_PAGE_SIZE, LibraryInfiniteSection, LibraryItemCard } from './components';
import { formatLibraryTitle } from './utils';

/**
 * Page dédiée aux playlists favorites, triable, en infinite scroll. Le
 * compte affiché dans le titre vient de `libraryStats` (total réel côté
 * API), pas du nombre de lignes synchronisées en base.
 * @returns {JSX.Element} Page playlists.
 */
export function LibraryPlaylistsPage() {
  const [sort, setSort] = useState<LibrarySortOrder>('ASC');
  const { playlists, loading, loadingMore, hasMore, loadMore } = usePlaylistsInfinite(
    LIBRARY_INFINITE_PAGE_SIZE,
    sort,
  );
  const { stats } = useLibraryStats();

  return (
    <LibraryInfiniteSection
      title={formatLibraryTitle(stats?.playlistsTotal, 'playlist', 'Playlists')}
      loading={loading}
      loadingMore={loadingMore}
      hasMore={hasMore}
      onLoadMore={loadMore}
      emptyIcon={<PlaylistIcon size={32} />}
      emptyMessage="Aucune playlist synchronisée."
      sort={sort}
      onToggleSort={() => setSort((s) => (s === 'ASC' ? 'DESC' : 'ASC'))}
    >
      {playlists.map((playlist: { id: string; title: string; picture?: string | null }) => (
        <LibraryItemCard
          key={playlist.id}
          image={playlist.picture}
          fallback={<PlaylistIcon />}
          title={playlist.title}
          to={`/playlist/${playlist.id}`}
        />
      ))}
    </LibraryInfiniteSection>
  );
}
