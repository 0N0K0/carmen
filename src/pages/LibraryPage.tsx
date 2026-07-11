import {
  ActionIcon,
  Avatar,
  Box,
  Card,
  Flex,
  Pagination,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  PlaylistIcon,
  SortAscendingIcon,
  SortDescendingIcon,
  UserIcon,
  VinylRecordIcon,
} from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import type { LibrarySortOrder } from '../hooks/useLibrary';
import { useAlbums, useArtists, usePlaylists } from '../hooks/useLibrary';

const SKELETON_COUNT = 6;
const PAGE_SIZE = 30;

/**
 * Carte affichant une vignette (image ou fallback) et un libellé.
 * @param {string} [props.image] URL de l'image. Optionnel — fallback si absent.
 * @param {ReactNode} props.fallback Icône affichée si `image` est absent.
 * @param {string} props.title Libellé principal.
 * @param {string} [props.subtitle] Libellé secondaire. Optionnel.
 * @returns {JSX.Element} Carte d'élément de bibliothèque.
 */
function LibraryItemCard({
  image,
  fallback,
  title,
  subtitle,
}: {
  image?: string | null;
  fallback: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <Card padding="sm" radius="md" withBorder>
      <Card.Section>
        <Avatar src={image} radius="md" size="100%" style={{ aspectRatio: '1 / 1' }}>
          {fallback}
        </Avatar>
      </Card.Section>
      <Text fz="sm" fw={500} mt="xs" lineClamp={1}>
        {title}
      </Text>
      {subtitle && (
        <Text fz="xs" c="dimmed" lineClamp={1}>
          {subtitle}
        </Text>
      )}
    </Card>
  );
}

/**
 * Grille de skeletons affichée pendant le chargement d'une section.
 * @returns {JSX.Element} Grille de placeholders.
 */
function LibrarySkeletonGrid() {
  return (
    <SimpleGrid cols={{ base: 2, xs: 3, sm: 4, md: 6 }}>
      {Array.from({ length: SKELETON_COUNT }, (_, i) => (
        <Stack key={i} gap="xs">
          <Skeleton radius="md" style={{ aspectRatio: '1 / 1' }} />
          <Skeleton h={12} w="80%" />
        </Stack>
      ))}
    </SimpleGrid>
  );
}

/**
 * Section de la bibliothèque : titre + bouton de tri (sur la même ligne),
 * grille d'éléments, skeleton pendant le chargement, état vide explicite si
 * la liste est vide, pagination si plus d'une page de résultats. Le tri
 * (titre/nom) est appliqué côté serveur — `children` arrive déjà trié.
 * @param {string} props.title Titre de la section.
 * @param {boolean} props.loading Section en cours de chargement.
 * @param {ReactNode} props.emptyIcon Icône affichée dans l'état vide.
 * @param {string} props.emptyMessage Message affiché dans l'état vide.
 * @param {number} props.page Page courante (1-indexée).
 * @param {(page: number) => void} props.onPageChange Change la page courante.
 * @param {number} props.totalPages Nombre total de pages.
 * @param {LibrarySortOrder} props.sort Sens de tri courant (titre/nom).
 * @param {() => void} props.onToggleSort Inverse le sens de tri.
 * @param {ReactNode[]} props.children Cartes d'éléments à afficher, déjà triées.
 * @returns {JSX.Element} Section de bibliothèque.
 */
function LibrarySection({
  title,
  loading,
  emptyIcon,
  emptyMessage,
  page,
  onPageChange,
  totalPages,
  sort,
  onToggleSort,
  children,
}: {
  title: string;
  loading: boolean;
  emptyIcon: ReactNode;
  emptyMessage: string;
  page: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  sort: LibrarySortOrder;
  onToggleSort: () => void;
  children: ReactNode[];
}) {
  return (
    <Stack gap="sm">
      <Flex align="center" gap="xs">
        <Title order={2} fz="lg">
          {title}
        </Title>
        <Tooltip label={sort === 'ASC' ? 'Trier de A à Z' : 'Trier de Z à A'}>
          <ActionIcon variant="subtle" size="sm" aria-label="Trier" onClick={onToggleSort}>
            {sort === 'ASC' ? <SortAscendingIcon /> : <SortDescendingIcon />}
          </ActionIcon>
        </Tooltip>
      </Flex>
      {loading ? (
        <LibrarySkeletonGrid />
      ) : children.length === 0 ? (
        <Stack align="center" gap="xs" py="xl" c="dimmed">
          {emptyIcon}
          <Text fz="sm">{emptyMessage}</Text>
        </Stack>
      ) : (
        <>
          <SimpleGrid cols={{ base: 2, xs: 3, sm: 4, md: 6 }}>{children}</SimpleGrid>
          {totalPages > 1 && (
            <Pagination total={totalPages} value={page} onChange={onPageChange} mt="xs" />
          )}
        </>
      )}
    </Stack>
  );
}

/**
 * Page "Ma bibliothèque" : playlists, albums et artistes favoris synchronisés
 * depuis Deezer, chacun dans sa propre section avec chargement et état vide.
 *
 * @returns {JSX.Element} Page de bibliothèque.
 */
export function LibraryPage() {
  const [playlistsPage, setPlaylistsPage] = useState(1);
  const [albumsPage, setAlbumsPage] = useState(1);
  const [artistsPage, setArtistsPage] = useState(1);

  const [playlistsSort, setPlaylistsSort] = useState<LibrarySortOrder>('ASC');
  const [albumsSort, setAlbumsSort] = useState<LibrarySortOrder>('ASC');
  const [artistsSort, setArtistsSort] = useState<LibrarySortOrder>('ASC');

  const { playlists, pagination: playlistsPagination, loading: playlistsLoading } = usePlaylists(
    playlistsPage,
    PAGE_SIZE,
    playlistsSort,
  );
  const { albums, pagination: albumsPagination, loading: albumsLoading } = useAlbums(
    albumsPage,
    PAGE_SIZE,
    albumsSort,
  );
  const { artists, pagination: artistsPagination, loading: artistsLoading } = useArtists(
    artistsPage,
    PAGE_SIZE,
    artistsSort,
  );

  return (
    <Box p="md">
      <Stack gap="xl">
        <LibrarySection
          title="Playlists"
          loading={playlistsLoading}
          emptyIcon={<PlaylistIcon size={32} />}
          emptyMessage="Aucune playlist synchronisée."
          page={playlistsPage}
          onPageChange={setPlaylistsPage}
          totalPages={Math.ceil((playlistsPagination?.total ?? 0) / PAGE_SIZE)}
          sort={playlistsSort}
          onToggleSort={() => setPlaylistsSort((s) => (s === 'ASC' ? 'DESC' : 'ASC'))}
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

        <LibrarySection
          title="Albums"
          loading={albumsLoading}
          emptyIcon={<VinylRecordIcon size={32} />}
          emptyMessage="Aucun album synchronisé."
          page={albumsPage}
          onPageChange={setAlbumsPage}
          totalPages={Math.ceil((albumsPagination?.total ?? 0) / PAGE_SIZE)}
          sort={albumsSort}
          onToggleSort={() => setAlbumsSort((s) => (s === 'ASC' ? 'DESC' : 'ASC'))}
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

        <LibrarySection
          title="Artistes"
          loading={artistsLoading}
          emptyIcon={<UserIcon size={32} />}
          emptyMessage="Aucun artiste synchronisé."
          page={artistsPage}
          onPageChange={setArtistsPage}
          totalPages={Math.ceil((artistsPagination?.total ?? 0) / PAGE_SIZE)}
          sort={artistsSort}
          onToggleSort={() => setArtistsSort((s) => (s === 'ASC' ? 'DESC' : 'ASC'))}
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
      </Stack>
    </Box>
  );
}
