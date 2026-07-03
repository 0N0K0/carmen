import { ActionIcon, AppShell, Box, Flex, Text } from '@mantine/core';

/**
 * Pied de page fixe contenant le lecteur audio, divisé en trois zones.
 *
 * Zone gauche  : pochette + titre/artiste + like + ajouter à une playlist.
 * Zone centrale : contrôles de lecture (précédent, lecture/pause, suivant,
 *                 répétition, aléatoire) + barre de progression.
 * Zone droite  : paroles + file d'attente + volume + égaliseur.
 *
 * @returns {JSX.Element} Footer de l'AppShell.
 */
export function Footer() {
  return (
    <AppShell.Footer>
      <Flex h="100%" align="center" justify="space-between" px="md" gap="md">
        {/* Zone gauche : piste en cours */}
        <Flex align="center" gap="sm" style={{ flex: 1, minWidth: 0 }}>
          <Box
            w={48}
            h={48}
            style={{ borderRadius: 4, background: 'var(--onoko-color-default-border)', flexShrink: 0 }}
          />
          <Box style={{ minWidth: 0 }}>
            <Text size="sm" fw={500} truncate>Titre de la piste</Text>
            <Text size="xs" c="dimmed" truncate>Artiste</Text>
          </Box>
          <ActionIcon variant="subtle" aria-label="J'aime">♡</ActionIcon>
          <ActionIcon variant="subtle" aria-label="Ajouter à une playlist">+</ActionIcon>
        </Flex>

        {/* Zone centrale : contrôles */}
        <Flex direction="column" align="center" gap={4} style={{ flex: 2 }}>
          <Flex align="center" gap="xs">
            <ActionIcon variant="subtle" aria-label="Aléatoire">⇌</ActionIcon>
            <ActionIcon variant="subtle" aria-label="Précédent">⏮</ActionIcon>
            <ActionIcon variant="filled" radius="xl" aria-label="Lecture/Pause">▶</ActionIcon>
            <ActionIcon variant="subtle" aria-label="Suivant">⏭</ActionIcon>
            <ActionIcon variant="subtle" aria-label="Répétition">↻</ActionIcon>
          </Flex>
          <Flex align="center" gap="xs" w="100%" style={{ maxWidth: '28rem' }}>
            <Text size="xs" c="dimmed" style={{ flexShrink: 0 }}>0:00</Text>
            <Box style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--onoko-color-default-border)' }} />
            <Text size="xs" c="dimmed" style={{ flexShrink: 0 }}>0:00</Text>
          </Flex>
        </Flex>

        {/* Zone droite : outils */}
        <Flex align="center" gap="xs" justify="flex-end" style={{ flex: 1 }}>
          <ActionIcon variant="subtle" aria-label="Paroles">♪</ActionIcon>
          <ActionIcon variant="subtle" aria-label="File d'attente">≡</ActionIcon>
          <ActionIcon variant="subtle" aria-label="Volume">🔊</ActionIcon>
          <ActionIcon variant="subtle" aria-label="Égaliseur">∿</ActionIcon>
        </Flex>
      </Flex>
    </AppShell.Footer>
  );
}
