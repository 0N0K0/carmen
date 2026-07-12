import { Box, Button, Flex, Skeleton, Stack, Text, Title } from '@mantine/core';
import { PlayIcon } from '@phosphor-icons/react';
import { TracklistSkeleton, TracklistTable } from '../../components/playlist/PlaylistDetailView';
import { usePlaylist } from '../../hooks/useDetail';
import type { PlaylistTrack } from '../../hooks/useDetail';
import { useAllPlaylists, useLibraryStats } from '../../hooks/useLibrary';
import { formatTotalDuration } from '../../utils';

/**
 * Page des coups de cœur : tracks de la playlist spéciale Deezer marquée
 * `isLovedTrack`. Le titre "Bibliothèque" et la navigation sont déjà rendus
 * par `LibraryLayout` — cette page n'affiche que le compte + durée totale,
 * le bouton "Lire tout" et la tracklist (pas de cover/titre dupliqués).
 *
 * Aucune query dédiée côté backend pour la liste — la playlist est repérée
 * parmi celles déjà chargées, puis son détail (tracks) est récupéré via
 * `usePlaylist`. Le nombre de titres vient de `libraryStats` (total réel
 * côté API) : la playlist spéciale peut être tronquée en base par la sync,
 * sans rapport avec le nombre réel de coups de cœur — la durée totale, elle,
 * reste celle de la playlist telle que synchronisée.
 * @returns {JSX.Element} Page coups de cœur.
 */
export function LibraryLovedPage() {
  const { playlists, loading: playlistsLoading } = useAllPlaylists();
  const lovedPlaylist = playlists.find((p) => p.isLovedTrack);
  const { playlist, tracksTotal, loading: tracksLoading } = usePlaylist(lovedPlaylist?.id);
  const { stats } = useLibraryStats();

  const loading = playlistsLoading || tracksLoading || !playlist;

  if (loading) {
    return (
      <Box p="md">
        <Stack gap="xl">
          <Flex align="center" gap="md">
            <Skeleton h={16} w={220} />
            <Skeleton h={36} w={140} radius="xl" />
          </Flex>
          <TracklistSkeleton />
        </Stack>
      </Box>
    );
  }

  const tracks = playlist.tracks as PlaylistTrack[];
  const count = stats?.favoriteTracksTotal ?? tracksTotal ?? tracks.length;

  return (
    <Box p="md">
      <Stack gap="xl">
        <Stack gap={4}>
          <Flex align="center" gap="md">
            <Title order={2} fz="lg">
              {count} coups de cœur
            </Title>
            <Button leftSection={<PlayIcon weight="fill" />} radius="xl">
              Lire tout
            </Button>
          </Flex>
          <Text fz="sm" c="dimmed">
            {formatTotalDuration(playlist.duration ?? 0)}
          </Text>
        </Stack>
        <TracklistTable tracks={tracks} />
      </Stack>
    </Box>
  );
}
