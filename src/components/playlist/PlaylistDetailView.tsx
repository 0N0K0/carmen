import { Avatar, Badge, Button, Flex, Skeleton, Stack, Table, Text, Title, Tooltip } from '@mantine/core';
import { HeartIcon, PlayIcon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import type { PlaylistTrack } from '../../hooks/useDetail';
import { formatTotalDuration, formatTrackDuration, toProxiedImageUrl } from '../../utils';

const SKELETON_TRACK_ROWS = 8;

/**
 * Squelette de chargement du header d'une playlist (cover, titre, métadonnées).
 * @returns {JSX.Element} Header en cours de chargement.
 */
export function PlaylistHeaderSkeleton() {
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
export function TracklistSkeleton() {
  return (
    <Stack gap="xs">
      {Array.from({ length: SKELETON_TRACK_ROWS }, (_, i) => (
        <Skeleton key={i} h={40} radius="sm" />
      ))}
    </Stack>
  );
}

/**
 * Header d'une vue de type playlist : cover, libellé (ex. "Playlist",
 * "Bibliothèque"), titre, nombre de titres + durée totale, bouton "Lire tout".
 *
 * La lecture n'est pas encore câblée (aucun lecteur audio en place) — "Lire
 * tout" est pour l'instant statique.
 * @param {string} [props.picture] URL de la cover. Optionnel — fallback si absent.
 * @param {ReactNode} props.fallbackIcon Icône affichée si pas de cover.
 * @param {string} props.eyebrow Libellé au-dessus du titre (ex. "Playlist").
 * @param {string} props.title Titre affiché.
 * @param {number} props.tracksTotal Nombre total de titres.
 * @param {number} props.durationSeconds Durée totale en secondes.
 * @returns {JSX.Element} Header de playlist.
 */
export function PlaylistHeader({
  picture,
  fallbackIcon,
  eyebrow,
  title,
  tracksTotal,
  durationSeconds,
}: {
  picture?: string | null;
  fallbackIcon: ReactNode;
  eyebrow: string;
  title: string;
  tracksTotal: number;
  durationSeconds: number;
}) {
  return (
    <Flex gap="lg" align="flex-end">
      <Avatar src={toProxiedImageUrl(picture)} radius="md" w={180} h={180}>
        {fallbackIcon}
      </Avatar>
      <Stack gap={4} style={{ flex: 1 }}>
        <Text fz="sm" c="dimmed">
          {eyebrow}
        </Text>
        <Title order={1}>{title}</Title>
        <Text fz="sm" c="dimmed">
          {tracksTotal} titres · {formatTotalDuration(durationSeconds)}
        </Text>
        <Button leftSection={<PlayIcon weight="fill" />} radius="xl" w="fit-content" mt="sm">
          Lire tout
        </Button>
      </Stack>
    </Flex>
  );
}

/**
 * Tableau de tracklist : index, coup de cœur, titre (+ badge explicite),
 * artiste, album, durée.
 * @param {PlaylistTrack[]} props.tracks Tracks à afficher, déjà triées.
 * @returns {JSX.Element} Tableau de tracklist.
 */
export function TracklistTable({ tracks }: { tracks: PlaylistTrack[] }) {
  return (
    <Table verticalSpacing="xs" highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>#</Table.Th>
          <Table.Th></Table.Th>
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
            <Table.Td>
              {track.isFavorite && (
                <Tooltip label="Coup de cœur">
                  <HeartIcon weight="fill" color="var(--mantine-color-error-6)" />
                </Tooltip>
              )}
            </Table.Td>
            <Table.Td>
              <Flex align="center" gap={6}>
                {track.title}
                {track.explicitLyrics && (
                  <Tooltip label="Paroles explicites">
                    <Badge size="xs" variant="filled" color="gray" radius="sm">
                      E
                    </Badge>
                  </Tooltip>
                )}
              </Flex>
            </Table.Td>
            <Table.Td>{track.artist?.name}</Table.Td>
            <Table.Td>{track.album?.title}</Table.Td>
            <Table.Td ta="right">{formatTrackDuration(track.duration)}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
