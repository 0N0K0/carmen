import { PlaylistIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import type { LibrarySortOrder } from '../../hooks/useLibrary';
import { usePlaylists } from '../../hooks/useLibrary';
import { LIBRARY_PAGE_SIZE, LibraryItemCard, LibrarySection } from './components';

/**
 * Page dédiée aux playlists favorites, paginée et triable.
 * @returns {JSX.Element} Page playlists.
 */
export function LibraryPlaylistsPage() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<LibrarySortOrder>('ASC');
  const { playlists, pagination, loading } = usePlaylists(page, LIBRARY_PAGE_SIZE, sort);

  return (
    <LibrarySection
      title="Playlists"
      loading={loading}
      emptyIcon={<PlaylistIcon size={32} />}
      emptyMessage="Aucune playlist synchronisée."
      page={page}
      onPageChange={setPage}
      totalPages={Math.ceil((pagination?.total ?? 0) / LIBRARY_PAGE_SIZE)}
      sort={sort}
      onToggleSort={() => setSort((s) => (s === 'ASC' ? 'DESC' : 'ASC'))}
    >
      {playlists.map((playlist: { id: string; title: string; picture?: string | null }) => (
        <LibraryItemCard
          key={playlist.id}
          image={playlist.picture}
          fallback={<PlaylistIcon />}
          title={playlist.title}
        />
      ))}
    </LibrarySection>
  );
}
