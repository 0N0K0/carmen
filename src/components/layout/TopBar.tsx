import { ActionIcon, AppShell, Flex, TextInput, Tooltip } from '@mantine/core';

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
          <Tooltip label="Précédent" position="bottom">
            <ActionIcon variant="subtle" aria-label="Précédent">{'<'}</ActionIcon>
          </Tooltip>
          <Tooltip label="Suivant" position="bottom">
            <ActionIcon variant="subtle" aria-label="Suivant">{'>'}</ActionIcon>
          </Tooltip>
          <Tooltip label="Recharger" position="bottom">
            <ActionIcon variant="subtle" aria-label="Recharger">↺</ActionIcon>
          </Tooltip>
        </Flex>

        {/* Zone centrale : accueil + recherche + explorer */}
        <Flex align="center" gap="xs" style={{ flex: 1, maxWidth: '40rem' }}>
          <Tooltip label="Accueil" position="bottom">
            <ActionIcon variant="subtle" aria-label="Accueil">⌂</ActionIcon>
          </Tooltip>
          <TextInput
            placeholder="Rechercher…"
            style={{ flex: 1 }}
            aria-label="Recherche"
          />
          <Tooltip label="Explorer" position="bottom">
            <ActionIcon variant="subtle" aria-label="Explorer">⊕</ActionIcon>
          </Tooltip>
        </Flex>

        {/* Zone droite : menu utilisateur */}
        <Tooltip label="Menu utilisateur" position="bottom-end">
          <ActionIcon variant="subtle" aria-label="Menu utilisateur">👤</ActionIcon>
        </Tooltip>
      </Flex>
    </AppShell.Header>
  );
}
