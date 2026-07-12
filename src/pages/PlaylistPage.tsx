import { Box, Stack } from '@mantine/core';
import { PlaylistIcon } from '@phosphor-icons/react';
import { useParams } from 'react-router-dom';
import {
  PlaylistHeader,
  PlaylistHeaderSkeleton,
  TracklistSkeleton,
  TracklistTable,
} from '../components/playlist/PlaylistDetailView';
import type { PlaylistTrack } from '../hooks/useDetail';
import { usePlaylist } from '../hooks/useDetail';

/**
 * Page de détail d'une playlist : header (cover, titre, nombre de tracks,
 * durée totale), bouton "Lire tout" et tracklist complète.
 * @returns {JSX.Element} Page de playlist.
 */
export function PlaylistPage() {
  const { id } = useParams<{ id: string }>();
  const { playlist, tracksTotal, loading } = usePlaylist(id);

  if (loading || !playlist) {
    return (
      <Box p="md">
        <Stack gap="xl">
          <PlaylistHeaderSkeleton />
          <TracklistSkeleton />
        </Stack>
      </Box>
    );
  }

  const tracks = playlist.tracks as PlaylistTrack[];

  return (
    <Box p="md">
      <Stack gap="xl">
        <PlaylistHeader
          picture={playlist.picture}
          fallbackIcon={<PlaylistIcon size={64} />}
          eyebrow="Playlist"
          title={playlist.title}
          tracksTotal={tracksTotal ?? tracks.length}
          durationSeconds={playlist.duration ?? 0}
        />
        <TracklistTable tracks={tracks} />
      </Stack>
    </Box>
  );
}
