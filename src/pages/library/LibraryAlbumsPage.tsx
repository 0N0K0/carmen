import { VinylRecordIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import type { LibrarySortOrder } from '../../hooks/useLibrary';
import { useAlbums } from '../../hooks/useLibrary';
import { LIBRARY_PAGE_SIZE, LibraryItemCard, LibrarySection } from './components';

/**
 * Page dédiée aux albums favoris, paginée et triable.
 * @returns {JSX.Element} Page albums.
 */
export function LibraryAlbumsPage() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<LibrarySortOrder>('ASC');
  const { albums, pagination, loading } = useAlbums(page, LIBRARY_PAGE_SIZE, sort);

  return (
    <LibrarySection
      title="Albums"
      loading={loading}
      emptyIcon={<VinylRecordIcon size={32} />}
      emptyMessage="Aucun album synchronisé."
      page={page}
      onPageChange={setPage}
      totalPages={Math.ceil((pagination?.total ?? 0) / LIBRARY_PAGE_SIZE)}
      sort={sort}
      onToggleSort={() => setSort((s) => (s === 'ASC' ? 'DESC' : 'ASC'))}
    >
      {albums.map(
        (album: {
          id: string;
          title: string;
          cover?: string | null;
          artist?: { name: string } | null;
        }) => (
          <LibraryItemCard
            key={album.id}
            image={album.cover}
            fallback={<VinylRecordIcon />}
            title={album.title}
            subtitle={album.artist?.name}
          />
        ),
      )}
    </LibrarySection>
  );
}
