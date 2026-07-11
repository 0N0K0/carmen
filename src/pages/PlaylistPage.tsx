import {
  Avatar,
  Box,
  Button,
  Flex,
  Skeleton,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { PlayIcon, PlaylistIcon } from '@phosphor-icons/react';
import { useParams } from 'react-router-dom';
import { usePlaylist } from '../hooks/useDetail';
import { formatTotalDuration, formatTrackDuration } from '../utils';

const SKELETON_TRACK_ROWS = 8;

/**
 * Squelette de chargement du header (cover, titre, métadonnées).
 * @returns {JSX.Element} Header en cours de chargement.
 */
function PlaylistHeaderSkeleton() {
  return (
    <Flex gap="lg" align="flex-end">
      <Skeleton radius="md" w={180} h={180} />
      <Stack gap="xs" style={{ flex: 1 }}>
        <Skeleton h={12} w={100} />
        <Skeleton h={36} w="60%" />
        <Skeleton h={16} w={160} />
        <Skeleton h={36} w={140} mt="sm" />
      </Stack>
    </Flex>
  );
}

/**
 * Squelette de chargement de la tracklist.
 * @returns {JSX.Element} Lignes de tracks en cours de chargement.
 */
function TracklistSkeleton() {
  return (
    <Stack gap="xs">
      {Array.from({ length: SKELETON_TRACK_ROWS }, (_, i) => (
        <Skeleton key={i} h={40} radius="sm" />
      ))}
    </Stack>
  );
}

/**
 * Page de détail d'une playlist : header (cover, titre, nombre de tracks,
 * durée totale), bouton "Lire tout" et tracklist complète.
 *
 * La lecture n'est pas encore câblée (aucun lecteur audio en place) — le
 * bouton "Lire tout" et les lignes de la tracklist sont pour l'instant
 * statiques.
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

  const tracks = playlist.tracks as {
    id: string;
    title: string;
    duration: number;
    artist?: { id: string; name: string } | null;
    album?: { id: string; title: string; cover?: string | null } | null;
  }[];

  return (
    <Box p="md">
      <Stack gap="xl">
        <Flex gap="lg" align="flex-end">
          <Avatar src={playlist.picture} radius="md" w={180} h={180}>
            <PlaylistIcon size={64} />
          </Avatar>
          <Stack gap={4} style={{ flex: 1 }}>
            <Text fz="sm" c="dimmed">
              Playlist
            </Text>
            <Title order={1}>{playlist.title}</Title>
            <Text fz="sm" c="dimmed">
              {tracksTotal ?? tracks.length} titres · {formatTotalDuration(playlist.duration ?? 0)}
            </Text>
            <Button
              leftSection={<PlayIcon weight="fill" />}
              radius="xl"
              w="fit-content"
              mt="sm"
            >
              Lire tout
            </Button>
          </Stack>
        </Flex>

        <Table verticalSpacing="xs" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>#</Table.Th>
              <Table.Th>Titre</Table.Th>
              <Table.Th>Artiste</Table.Th>
              <Table.Th>Album</Table.Th>
              <Table.Th ta="right">Durée</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {tracks.map((track, index) => (
              <Table.Tr key={track.id}>
                <Table.Td>{index + 1}</Table.Td>
                <Table.Td>{track.title}</Table.Td>
                <Table.Td>{track.artist?.name}</Table.Td>
                <Table.Td>{track.album?.title}</Table.Td>
                <Table.Td ta="right">{formatTrackDuration(track.duration)}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    </Box>
  );
}
