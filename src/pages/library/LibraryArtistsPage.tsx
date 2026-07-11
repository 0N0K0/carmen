import { UserIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import type { LibrarySortOrder } from '../../hooks/useLibrary';
import { useArtists } from '../../hooks/useLibrary';
import { LIBRARY_PAGE_SIZE, LibraryItemCard, LibrarySection } from './components';

/**
 * Page dédiée aux artistes favoris, paginée et triable.
 * @returns {JSX.Element} Page artistes.
 */
export function LibraryArtistsPage() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<LibrarySortOrder>('ASC');
  const { artists, pagination, loading } = useArtists(page, LIBRARY_PAGE_SIZE, sort);

  return (
    <LibrarySection
      title="Artistes"
      loading={loading}
      emptyIcon={<UserIcon size={32} />}
      emptyMessage="Aucun artiste synchronisé."
      page={page}
      onPageChange={setPage}
      totalPages={Math.ceil((pagination?.total ?? 0) / LIBRARY_PAGE_SIZE)}
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
    </LibrarySection>
  );
}
