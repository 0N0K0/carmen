import { Stack } from '@mantine/core';
import { PlaylistIcon, UserIcon, VinylRecordIcon } from '@phosphor-icons/react';
import { useAlbums, useArtists, usePlaylists } from '../../hooks/useLibrary';
import { LIBRARY_PAGE_SIZE, LibraryCarouselSection, LibraryItemCard } from './components';

/**
 * Vue d'ensemble de la bibliothèque : playlists, albums et artistes favoris,
 * chacun dans un carrousel des 30 premiers (sans tri ni pagination). Le
 * titre de chaque section renvoie vers sa page dédiée.
 * @returns {JSX.Element} Vue d'ensemble.
 */
export function LibraryOverviewPage() {
  const { playlists, loading: playlistsLoading } = usePlaylists(1, LIBRARY_PAGE_SIZE);
  const { albums, loading: albumsLoading } = useAlbums(1, LIBRARY_PAGE_SIZE);
  const { artists, loading: artistsLoading } = useArtists(1, LIBRARY_PAGE_SIZE);

  return (
    <Stack gap="xl">
      <LibraryCarouselSection
        title="Playlists"
        to="/library/playlists"
        loading={playlistsLoading}
        emptyIcon={<PlaylistIcon size={32} />}
        emptyMessage="Aucune playlist synchronisée."
      >
        {playlists.map((playlist: { id: string; title: string; picture?: string | null }) => (
          <LibraryItemCard
            key={playlist.id}
            image={playlist.picture}
            fallback={<PlaylistIcon />}
            title={playlist.title}
          />
        ))}
      </LibraryCarouselSection>

      <LibraryCarouselSection
        title="Albums"
        to="/library/albums"
        loading={albumsLoading}
        emptyIcon={<VinylRecordIcon size={32} />}
        emptyMessage="Aucun album synchronisé."
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
      </LibraryCarouselSection>

      <LibraryCarouselSection
        title="Artistes"
        to="/library/artists"
        loading={artistsLoading}
        emptyIcon={<UserIcon size={32} />}
        emptyMessage="Aucun artiste synchronisé."
      >
        {artists.map((artist: { id: string; name: string; picture?: string | null }) => (
          <LibraryItemCard
            key={artist.id}
            image={artist.picture}
            fallback={<UserIcon />}
            title={artist.name}
          />
        ))}
      </LibraryCarouselSection>
    </Stack>
  );
}
