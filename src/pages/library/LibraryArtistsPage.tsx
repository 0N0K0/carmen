import { UserIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import type { LibrarySortOrder } from '../../hooks/useLibrary';
import { useArtistsInfinite, useLibraryStats } from '../../hooks/useLibrary';
import { LIBRARY_INFINITE_PAGE_SIZE, LibraryInfiniteSection, LibraryItemCard } from './components';
import { formatLibraryTitle } from './utils';

/**
 * Page dédiée aux artistes favoris, triable, en infinite scroll. Le compte
 * affiché dans le titre vient de `libraryStats` (total réel côté API), pas
 * du nombre de lignes synchronisées en base.
 * @returns {JSX.Element} Page artistes.
 */
export function LibraryArtistsPage() {
  const [sort, setSort] = useState<LibrarySortOrder>('ASC');
  const { artists, loading, loadingMore, hasMore, loadMore } = useArtistsInfinite(
    LIBRARY_INFINITE_PAGE_SIZE,
    sort,
  );
  const { stats } = useLibraryStats();

  return (
    <LibraryInfiniteSection
      title={formatLibraryTitle(stats?.favoriteArtistsTotal, 'artiste', 'Artistes')}
      loading={loading}
      loadingMore={loadingMore}
      hasMore={hasMore}
      onLoadMore={loadMore}
      emptyIcon={<UserIcon size={32} />}
      emptyMessage="Aucun artiste synchronisé."
      sort={sort}
      onToggleSort={() => setSort((s) => (s === 'ASC' ? 'DESC' : 'ASC'))}
    >
      {artists.map((artist: { id: string; name: string; picture?: string | null }) => (
        <LibraryItemCard
          key={artist.id}
          image={artist.picture}
          fallback={<UserIcon />}
          title={artist.name}
        />
      ))}
    </LibraryInfiniteSection>
  );
}
