import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Modal,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { ArrowsClockwiseIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { useSyncDeezer } from '../../hooks/useSyncDeezer';
import type { SyncLibraryError } from '../../hooks/useSyncDeezer';

/** Libellé affiché pour chaque type d'élément en erreur. */
const ERROR_TYPE_LABEL: Record<SyncLibraryError['type'], string> = {
  playlist: 'Playlist',
  album: 'Album',
  artist: 'Artiste',
};

/**
 * Bouton de déclenchement de la synchronisation complète de la bibliothèque
 * Deezer (playlists, albums et artistes favoris) en un clic.
 *
 * Affiche un spinner pendant la synchronisation puis un toast résumant le
 * résultat. Les éléments en échec sont listés dans une boîte de dialogue
 * permettant de les resynchroniser individuellement.
 *
 * @param {'sm' | 'md'} [props.size='md'] Taille de l'icône, alignée sur les boutons voisins. Optionnel.
 * @param {'left' | 'right'} [props.tooltipPosition='right'] Position du tooltip. Optionnel.
 * @returns {JSX.Element} Icône de synchronisation + modale des erreurs éventuelles.
 */
export function SyncDeezerButton({
  size = 'md',
  tooltipPosition = 'right',
}: {
  size?: 'sm' | 'md';
  tooltipPosition?: 'left' | 'right';
}) {
  const { syncLibrary, syncPlaylist, syncAlbum, syncArtist, loading } =
    useSyncDeezer();
  const [errors, setErrors] = useState<SyncLibraryError[]>([]);
  const [retryingKey, setRetryingKey] = useState<string | null>(null);

  /** Lance la synchronisation complète de la bibliothèque favorite. */
  async function handleSync() {
    try {
      const result = await syncLibrary();
      setErrors(result?.errors ?? []);
    } catch {
      // Le toast d'erreur est déjà géré par useSyncDeezer.
    }
  }

  /**
   * Resynchronise individuellement un élément resté en erreur.
   * @param {SyncLibraryError} err Erreur à rejouer.
   * @returns {Promise<void>} Résolue une fois le retry terminé (succès ou échec géré par le hook).
   */
  async function handleRetry(err: SyncLibraryError) {
    const key = `${err.type}:${err.deezerId}`;
    setRetryingKey(key);
    try {
      if (err.type === 'playlist') await syncPlaylist(err.deezerId);
      else if (err.type === 'album') await syncAlbum(err.deezerId);
      else await syncArtist(err.deezerId);
      setErrors((prev) =>
        prev.filter((e) => `${e.type}:${e.deezerId}` !== key),
      );
    } catch {
      // Le toast d'erreur est déjà géré par useSyncDeezer.
    } finally {
      setRetryingKey(null);
    }
  }

  return (
    <>
      <Tooltip label="Synchroniser la bibliothèque" position={tooltipPosition}>
        <ActionIcon
          variant="subtle"
          size={size}
          loading={loading}
          aria-label="Synchroniser la bibliothèque"
          onClick={handleSync}
        >
          <ArrowsClockwiseIcon />
        </ActionIcon>
      </Tooltip>

      <Modal
        opened={errors.length > 0}
        onClose={() => setErrors([])}
        title="Éléments non synchronisés"
      >
        <Stack gap="sm">
          {errors.map((err) => {
            const key = `${err.type}:${err.deezerId}`;
            return (
              <Flex key={key} justify="space-between" align="center" gap="sm">
                <Box>
                  <Text size="sm">
                    {ERROR_TYPE_LABEL[err.type]} · {err.deezerId}
                  </Text>
                  <Text size="xs" c="error">
                    {err.message}
                  </Text>
                </Box>
                <Button
                  size="xs"
                  variant="light"
                  loading={retryingKey === key}
                  onClick={() => handleRetry(err)}
                >
                  Réessayer
                </Button>
              </Flex>
            );
          })}
        </Stack>
      </Modal>
    </>
  );
}
