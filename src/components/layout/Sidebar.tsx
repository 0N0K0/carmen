import {
  Accordion,
  ActionIcon,
  AppShell,
  Box,
  Flex,
  SegmentedControl,
  TextInput,
  Tooltip,
} from '@mantine/core';
import {
  ArrowLineLeftIcon,
  ArrowLineRightIcon,
  ArrowsOutSimpleIcon,
  BookmarkSimpleIcon,
  GridFourIcon,
  ListIcon,
  PlaylistIcon,
  PlusCircleIcon,
  SortAscendingIcon,
} from '@phosphor-icons/react';
import { useRef } from 'react';
import {
  SIDEBAR_WIDTH_NORMAL_MIN,
  SIDEBAR_WIDTH_REDUCED,
  snapSidebarWidth,
  useLayoutStore,
} from '../../store/layout';

/**
 * Sidebar redimensionnable de l'application.
 *
 * Deux taquets de magnétisme :
 * - `SIDEBAR_WIDTH_REDUCED` (72 px) : vue réduite, icônes seuls.
 * - `SIDEBAR_WIDTH_NORMAL_MIN` (280 px) : largeur minimale en vue normale.
 *
 * Au-dessus de 280 px, la largeur est libre. Le snap est appliqué en live
 * pendant le drag : aucune valeur entre 72 et 280 n'est possible.
 *
 * @returns {JSX.Element} Navbar de l'AppShell.
 */
export function Sidebar() {
  const sidebarWidth = useLayoutStore((s) => s.sidebarWidth);
  const setSidebarWidth = useLayoutStore((s) => s.setSidebarWidth);

  const dragStart = useRef<{ x: number; width: number } | null>(null);
  const isReduced = sidebarWidth <= SIDEBAR_WIDTH_REDUCED;

  /**
   * Démarre le drag de redimensionnement avec capture de pointeur.
   * @param {React.PointerEvent<HTMLDivElement>} e Événement pointerdown.
   */
  function handleResizeStart(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current = { x: e.clientX, width: sidebarWidth };
  }

  /**
   * Met à jour la largeur avec snap live — aucune valeur entre 72 et 280.
   * @param {React.PointerEvent<HTMLDivElement>} e Événement pointermove.
   */
  function handleResizeMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!e.currentTarget.hasPointerCapture(e.pointerId) || !dragStart.current)
      return;
    const raw = dragStart.current.width + (e.clientX - dragStart.current.x);
    setSidebarWidth(snapSidebarWidth(raw));
  }

  /**
   * Finalise le drag (snap déjà appliqué en live).
   * @param {React.PointerEvent<HTMLDivElement>} e Événement pointerup.
   */
  function handleResizeEnd(e: React.PointerEvent<HTMLDivElement>) {
    if (!e.currentTarget.hasPointerCapture(e.pointerId) || !dragStart.current)
      return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    dragStart.current = null;
  }

  /** Bascule entre vue réduite (72 px) et vue normale minimale (280 px). */
  function toggleReduced() {
    setSidebarWidth(
      isReduced ? SIDEBAR_WIDTH_NORMAL_MIN : SIDEBAR_WIDTH_REDUCED,
    );
  }

  return (
    <AppShell.Navbar style={{ overflow: 'visible' }}>
      {/* Poignée de redimensionnement sur le bord droit */}
      <Box
        pos="absolute"
        top={0}
        right={-3}
        w={6}
        h="100%"
        style={{ cursor: 'ew-resize', zIndex: 10 }}
        onPointerDown={handleResizeStart}
        onPointerMove={handleResizeMove}
        onPointerUp={handleResizeEnd}
      />

      {/* Vue réduite (72 px) */}
      {isReduced ? (
        <Flex direction="column" align="center" gap="xs" pt="xs">
          <Tooltip label="Agrandir la sidebar" position="right">
            <ActionIcon
              variant="subtle"
              onClick={toggleReduced}
              aria-label="Agrandir la sidebar"
            >
              <ArrowLineRightIcon weight="bold" />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Raccourcis" position="right">
            <ActionIcon variant="subtle" aria-label="Raccourcis">
              <BookmarkSimpleIcon weight="fill" />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Bibliothèque" position="right">
            <ActionIcon variant="subtle" aria-label="Bibliothèque">
              <PlaylistIcon weight="fill" />
            </ActionIcon>
          </Tooltip>
        </Flex>
      ) : (
        /* Vue normale (≥ 280 px) */
        <Box p="xs">
          <Flex justify="flex-end" mb={4}>
            <Tooltip label="Réduire la sidebar" position="right">
              <ActionIcon
                variant="subtle"
                size="sm"
                onClick={toggleReduced}
                aria-label="Réduire la sidebar"
              >
                <ArrowLineLeftIcon weight="bold" />
              </ActionIcon>
            </Tooltip>
          </Flex>

          <Accordion multiple defaultValue={['raccourcis', 'bibliotheque']}>
            <Accordion.Item value="raccourcis">
              <Accordion.Control>Raccourcis</Accordion.Control>
              <Accordion.Panel>
                <Box c="dimmed" fz="sm">
                  Aucun raccourci
                </Box>
              </Accordion.Panel>
            </Accordion.Item>

            {/* Boutons d'action superposés pour éviter button > button */}
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
                        { label: 'Podcasts', value: 'podcasts' },
                      ]}
                    />
                    <TextInput
                      size="xs"
                      placeholder="Rechercher dans la bibliothèque…"
                    />
                    <Flex justify="space-between" align="center">
                      <Tooltip label="Trier" position="top">
                        <ActionIcon
                          variant="subtle"
                          size="sm"
                          aria-label="Trier"
                        >
                          <SortAscendingIcon weight="regular" />
                        </ActionIcon>
                      </Tooltip>
                      <Flex gap="xs">
                        <Tooltip label="Vue liste" position="top">
                          <ActionIcon
                            variant="subtle"
                            size="sm"
                            aria-label="Vue liste"
                          >
                            <ListIcon weight="regular" />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Vue grille" position="top">
                          <ActionIcon
                            variant="subtle"
                            size="sm"
                            aria-label="Vue grille"
                          >
                            <GridFourIcon weight="regular" />
                          </ActionIcon>
                        </Tooltip>
                      </Flex>
                    </Flex>
                    <Box c="dimmed" fz="sm">
                      Aucun élément
                    </Box>
                  </Flex>
                </Accordion.Panel>
              </Accordion.Item>

              <Flex
                gap={4}
                pos="absolute"
                style={{
                  top: 0,
                  right: '2.5rem',
                  height: '2.75rem',
                  alignItems: 'center',
                }}
              >
                <Tooltip label="Ajouter" position="top">
                  <ActionIcon
                    variant="subtle"
                    size="sm"
                    aria-label="Ajouter à la bibliothèque"
                  >
                    <PlusCircleIcon weight="regular" />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Pleine page" position="top">
                  <ActionIcon
                    variant="subtle"
                    size="sm"
                    aria-label="Afficher en pleine page"
                  >
                    <ArrowsOutSimpleIcon weight="regular" />
                  </ActionIcon>
                </Tooltip>
              </Flex>
            </Box>
          </Accordion>
        </Box>
      )}
    </AppShell.Navbar>
  );
}
