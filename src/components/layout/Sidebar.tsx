import { Accordion, ActionIcon, AppShell, Box, Flex, SegmentedControl, TextInput } from '@mantine/core';
import { useLayoutStore } from '../../store/layout';

/**
 * Sidebar collapsible de l'application.
 *
 * Contient deux accordéons :
 * - **Raccourcis** : liens rapides épinglés par l'utilisateur.
 * - **Bibliothèque** : playlists, albums et artistes avec onglets, recherche,
 *   tri et mode d'affichage.
 *
 * L'état collapsed est lu depuis le store Zustand `useLayoutStore`.
 * Les boutons "Ajouter" et "Pleine page" sont superposés en position absolue
 * sur l'en-tête de l'accordéon Bibliothèque pour éviter d'imbriquer des
 * éléments `button` dans un `button` (contrainte HTML).
 *
 * @returns {JSX.Element} Navbar de l'AppShell.
 */
export function Sidebar() {
  const collapsed = useLayoutStore((s) => s.sidebarCollapsed);

  return (
    <AppShell.Navbar p={collapsed ? 0 : 'xs'}>
      {!collapsed && (
        <Accordion multiple defaultValue={['raccourcis', 'bibliotheque']}>
          {/* Accordéon Raccourcis */}
          <Accordion.Item value="raccourcis">
            <Accordion.Control>Raccourcis</Accordion.Control>
            <Accordion.Panel>
              <Box c="dimmed" fz="sm">Aucun raccourci</Box>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Accordéon Bibliothèque */}
          {/*
           * Box pos="relative" wraps uniquement cet item pour permettre
           * le positionnement absolu des boutons sur le AccordionControl.
           */}
          <Box pos="relative">
            <Accordion.Item value="bibliotheque">
              <Accordion.Control>Bibliothèque</Accordion.Control>
              <Accordion.Panel>
                <Flex direction="column" gap="xs">
                  <SegmentedControl
                    size="xs"
                    data={[
                      { label: 'Playlists', value: 'playlists' },
                      { label: 'Albums', value: 'albums' },
                      { label: 'Artistes', value: 'artistes' },
                    ]}
                  />
                  <TextInput size="xs" placeholder="Rechercher dans la bibliothèque…" />
                  <Flex justify="space-between" align="center">
                    <ActionIcon variant="subtle" size="sm" aria-label="Trier">⇅ Tri</ActionIcon>
                    <Flex gap="xs">
                      <ActionIcon variant="subtle" size="sm" aria-label="Vue liste">☰</ActionIcon>
                      <ActionIcon variant="subtle" size="sm" aria-label="Vue grille">⊞</ActionIcon>
                    </Flex>
                  </Flex>
                  <Box c="dimmed" fz="sm">Aucun élément</Box>
                </Flex>
              </Accordion.Panel>
            </Accordion.Item>

            {/* Boutons superposés sur le AccordionControl Bibliothèque */}
            <Flex
              gap={4}
              pos="absolute"
              style={{ top: 0, right: '2.5rem', height: '2.75rem', alignItems: 'center' }}
            >
              <ActionIcon variant="subtle" size="sm" aria-label="Ajouter à la bibliothèque">+</ActionIcon>
              <ActionIcon variant="subtle" size="sm" aria-label="Afficher en pleine page">⤢</ActionIcon>
            </Flex>
          </Box>
        </Accordion>
      )}
    </AppShell.Navbar>
  );
}
