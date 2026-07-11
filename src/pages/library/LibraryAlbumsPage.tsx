import { VinylRecordIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import type { LibrarySortOrder } from '../../hooks/useLibrary';
import { useAlbumsInfinite, useLibraryStats } from '../../hooks/useLibrary';
import { LIBRARY_INFINITE_PAGE_SIZE, LibraryInfiniteSection, LibraryItemCard } from './components';
import { formatLibraryTitle } from './utils';

/**
 * Page dédiée aux albums favoris, triable, en infinite scroll. Le compte
 * affiché dans le titre vient de `libraryStats` (total réel côté API), pas
 * du nombre de lignes synchronisées en base.
 * @returns {JSX.Element} Page albums.
 */
export function LibraryAlbumsPage() {
  const [sort, setSort] = useState<LibrarySortOrder>('ASC');
  const { albums, loading, loadingMore, hasMore, loadMore } = useAlbumsInfinite(
    LIBRARY_INFINITE_PAGE_SIZE,
    sort,
  );
  const { stats } = useLibraryStats();

  return (
    <LibraryInfiniteSection
      title={formatLibraryTitle(stats?.favoriteAlbumsTotal, 'album', 'Albums')}
      loading={loading}
      loadingMore={loadingMore}
      hasMore={hasMore}
      onLoadMore={loadMore}
      emptyIcon={<VinylRecordIcon size={32} />}
      emptyMessage="Aucun album synchronisé."
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
    </LibraryInfiniteSection>
  );
}
