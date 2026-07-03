import { ActionIcon, AppShell, Box, Flex, TextInput } from '@mantine/core';

/**
 * Barre supérieure de l'application, divisée en trois zones.
 *
 * Zone gauche  : navigation (précédent / suivant) + rechargement.
 * Zone centrale : bouton accueil + barre de recherche + bouton explorer.
 * Zone droite  : menu utilisateur.
 *
 * @returns {JSX.Element} Header de l'AppShell.
 */
export function TopBar() {
  return (
    <AppShell.Header>
      <Flex h="100%" align="center" justify="space-between" px="md" gap="md">
        {/* Zone gauche : navigation */}
        <Flex align="center" gap="xs" style={{ flexShrink: 0 }}>
          <ActionIcon variant="subtle" aria-label="Précédent">{'<'}</ActionIcon>
          <ActionIcon variant="subtle" aria-label="Suivant">{'>'}</ActionIcon>
          <ActionIcon variant="subtle" aria-label="Recharger">↺</ActionIcon>
        </Flex>

        {/* Zone centrale : accueil + recherche + explorer */}
        <Flex align="center" gap="xs" style={{ flex: 1, maxWidth: '40rem' }}>
          <ActionIcon variant="subtle" aria-label="Accueil">⌂</ActionIcon>
          <TextInput
            placeholder="Rechercher…"
            style={{ flex: 1 }}
            aria-label="Recherche"
          />
          <ActionIcon variant="subtle" aria-label="Explorer">⊕</ActionIcon>
        </Flex>

        {/* Zone droite : menu utilisateur */}
        <Box style={{ flexShrink: 0 }}>
          <ActionIcon variant="subtle" aria-label="Menu utilisateur">👤</ActionIcon>
        </Box>
      </Flex>
    </AppShell.Header>
  );
}
