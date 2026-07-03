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
  ArrowsInSimpleIcon,
  ArrowsOutSimpleIcon,
  BookmarkSimpleIcon,
  GridFourIcon,
  ListIcon,
  PlaylistIcon,
  PlusCircleIcon,
  SortAscendingIcon,
} from '@phosphor-icons/react';
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import {
  MAIN_CONTENT_MIN_WIDTH,
  SIDEBAR_WIDTH_NORMAL_MIN,
  SIDEBAR_WIDTH_REDUCED,
  snapSidebarWidth,
  useLayoutStore,
} from '../../store/layout';

/**
 * Pixels au-delà du taquet haut à franchir volontairement pour activer la pleine page.
 * En dessous de ce seuil, le drag est clampé au taquet haut.
 */
const FULL_PAGE_DRAG_THRESHOLD = 80;

/**
 * Met à jour les CSS vars de l'AppShell directement sur le DOM, sans passer par React.
 * En mode pleine page, l'offset reste à 0 (overlay, pas de décalage du contenu principal).
 * @param {number | '100vw'} width Largeur cible.
 */
function setNavbarWidthVar(width: number | '100vw') {
  if (width === '100vw') {
    document.documentElement.style.setProperty('--app-shell-navbar-width', '100vw');
    document.documentElement.style.setProperty('--app-shell-navbar-offset', '0px');
  } else {
    document.documentElement.style.setProperty('--app-shell-navbar-width', `${width}px`);
    document.documentElement.style.setProperty('--app-shell-navbar-offset', `${width}px`);
  }
}

/** Supprime les CSS vars inlinées sur documentElement (laisse AppShell reprendre la main). */
function clearNavbarWidthVar() {
  document.documentElement.style.removeProperty('--app-shell-navbar-width');
  document.documentElement.style.removeProperty('--app-shell-navbar-offset');
}

/**
 * Vue réduite de la sidebar (72 px).
 * @returns {JSX.Element} Colonne d'icônes.
 */
function SidebarReduced({ onExpand }: { onExpand: () => void }) {
  return (
    <Flex direction="column" align="center" gap="xs" pt="xs">
      <Tooltip label="Agrandir la sidebar" position="right">
        <ActionIcon variant="subtle" onClick={onExpand} aria-label="Agrandir la sidebar">
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
  );
}

/**
 * Vue normale de la sidebar (≥ 280 px).
 * @param {boolean} props.sidebarFullPage Sidebar en mode pleine page.
 * @param {() => void} props.onReduce Bascule vers la vue réduite.
 * @param {(v: boolean) => void} props.onToggleFullPage Bascule le mode pleine page.
 * @returns {JSX.Element} Accordion bibliothèque + raccourcis.
 */
function SidebarNormal({
  sidebarFullPage,
  onReduce,
  onToggleFullPage,
}: {
  sidebarFullPage: boolean;
  onReduce: () => void;
  onToggleFullPage: (v: boolean) => void;
}) {
  return (
    <Box p="xs">
      {/* "Réduire la sidebar" masqué en mode pleine page */}
      {!sidebarFullPage && (
        <Flex justify="flex-end" mb={4}>
          <Tooltip label="Réduire la sidebar" position="right">
            <ActionIcon
              variant="subtle"
              size="sm"
              onClick={onReduce}
              aria-label="Réduire la sidebar"
            >
              <ArrowLineLeftIcon weight="bold" />
            </ActionIcon>
          </Tooltip>
        </Flex>
      )}

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
                    <ActionIcon variant="subtle" size="sm" aria-label="Trier">
                      <SortAscendingIcon weight="regular" />
                    </ActionIcon>
                  </Tooltip>
                  <Flex gap="xs">
                    <Tooltip label="Vue liste" position="top">
                      <ActionIcon variant="subtle" size="sm" aria-label="Vue liste">
                        <ListIcon weight="regular" />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Vue grille" position="top">
                      <ActionIcon variant="subtle" size="sm" aria-label="Vue grille">
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
            style={{ top: 0, right: '2.5rem', height: '2.75rem', alignItems: 'center' }}
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
            <Tooltip label={sidebarFullPage ? 'Réduire' : 'Pleine page'} position="top">
              <ActionIcon
                variant="subtle"
                size="sm"
                aria-label={
                  sidebarFullPage
                    ? 'Réduire la bibliothèque'
                    : 'Afficher en pleine page'
                }
                onClick={() => onToggleFullPage(!sidebarFullPage)}
              >
                {sidebarFullPage ? (
                  <ArrowsInSimpleIcon weight="regular" />
                ) : (
                  <ArrowsOutSimpleIcon weight="regular" />
                )}
              </ActionIcon>
            </Tooltip>
          </Flex>
        </Box>
      </Accordion>
    </Box>
  );
}

/**
 * Sidebar redimensionnable de l'application.
 *
 * Taquets de redimensionnement :
 * - 72 px  : vue réduite (icônes seuls).
 * - 280 px : largeur minimale en vue normale.
 * - viewport − MAIN_CONTENT_MIN_WIDTH : taquet haut dynamique.
 * - Pleine page : au-delà du taquet haut + FULL_PAGE_DRAG_THRESHOLD.
 *
 * Fluidité : pendant le drag, les CSS vars sont mises à jour directement sur
 * le DOM (sans re-render React). Le store n'est mis à jour qu'au pointerup.
 *
 * Transition de contenu : les vues réduite/normale se crossfadent via
 * Mantine Transition pour éviter le saut visuel au franchissement du seuil.
 *
 * @returns {JSX.Element} Navbar de l'AppShell.
 */
export function Sidebar() {
  const sidebarWidth = useLayoutStore((s) => s.sidebarWidth);
  const setSidebarWidth = useLayoutStore((s) => s.setSidebarWidth);
  const sidebarFullPage = useLayoutStore((s) => s.sidebarFullPage);
  const setSidebarFullPage = useLayoutStore((s) => s.setSidebarFullPage);

  const dragStart = useRef<{ x: number; width: number } | null>(null);
  /** Valeur à commiter dans le store au pointerup. */
  const pending = useRef<number | 'fullPage' | null>(null);
  /**
   * Catégorie live pendant le drag — déclenche un re-render uniquement au
   * franchissement du seuil (max 1-2 re-renders par drag, pas un par pixel).
   * `null` en dehors d'un drag.
   */
  const [dragCategory, setDragCategory] = useState<'reduced' | 'normal' | null>(null);

  const isReduced =
    !sidebarFullPage &&
    (dragCategory !== null
      ? dragCategory === 'reduced'
      : sidebarWidth <= SIDEBAR_WIDTH_REDUCED);

  /**
   * Démarre le drag : capture le pointeur et mémorise l'état initial.
   * @param {React.PointerEvent<HTMLDivElement>} e Événement pointerdown.
   */
  function handleResizeStart(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current = { x: e.clientX, width: sidebarWidth };
    pending.current = null;
    setDragCategory(sidebarWidth <= SIDEBAR_WIDTH_REDUCED ? 'reduced' : 'normal');
  }

  /**
   * Met à jour les CSS vars directement (pas de re-render) pour un drag fluide.
   * - Au-delà du taquet haut + FULL_PAGE_DRAG_THRESHOLD : prévisualise la pleine page.
   * - En dessous : applique le snap habituel.
   * @param {React.PointerEvent<HTMLDivElement>} e Événement pointermove.
   */
  function handleResizeMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!e.currentTarget.hasPointerCapture(e.pointerId) || !dragStart.current)
      return;

    const raw = dragStart.current.width + (e.clientX - dragStart.current.x);
    const max = window.innerWidth - MAIN_CONTENT_MIN_WIDTH;

    if (raw > max + FULL_PAGE_DRAG_THRESHOLD) {
      setNavbarWidthVar('100vw');
      pending.current = 'fullPage';
      setDragCategory('normal');
    } else {
      const snapped = snapSidebarWidth(raw, max);
      const cat: 'reduced' | 'normal' = snapped <= SIDEBAR_WIDTH_REDUCED ? 'reduced' : 'normal';
      // flushSync : React re-render synchrone avant setNavbarWidthVar →
      // contenu et largeur mis à jour dans le même frame navigateur, sans flash.
      if (dragCategory !== cat) {
        flushSync(() => setDragCategory(cat));
      }
      setNavbarWidthVar(snapped);
      pending.current = snapped;
    }
  }

  /**
   * Commit la valeur finale dans le store et rend la main à AppShell.
   * @param {React.PointerEvent<HTMLDivElement>} e Événement pointerup.
   */
  function handleResizeEnd(e: React.PointerEvent<HTMLDivElement>) {
    if (!e.currentTarget.hasPointerCapture(e.pointerId) || !dragStart.current)
      return;

    e.currentTarget.releasePointerCapture(e.pointerId);
    clearNavbarWidthVar();

    if (pending.current === 'fullPage') {
      setSidebarFullPage(true);
    } else if (pending.current !== null) {
      if (sidebarFullPage) setSidebarFullPage(false);
      setSidebarWidth(pending.current);
    }

    dragStart.current = null;
    pending.current = null;
    setDragCategory(null);
  }

  /** Bascule entre vue réduite (72 px) et vue normale minimale (280 px). */
  function toggleReduced() {
    if (isReduced) {
      const max = window.innerWidth - MAIN_CONTENT_MIN_WIDTH;
      setSidebarWidth(Math.min(SIDEBAR_WIDTH_NORMAL_MIN, max));
    } else {
      setSidebarWidth(SIDEBAR_WIDTH_REDUCED);
    }
  }

  return (
    <AppShell.Navbar
      style={{
        overflow: 'visible',
        // Transition sur la largeur uniquement hors drag (boutons, fin de drag).
        transition: dragCategory === null ? 'width 200ms ease' : undefined,
      }}
    >
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

      {/*
       * overflow:hidden clippe la vue normale si elle dépasse la largeur
       * courante (ex. bref frame à 72 px avant le re-render React).
       * minWidth sur la vue normale empêche le reflow à 72 px.
       */}
      <Box h="100%" style={{ overflow: 'hidden' }}>
        {isReduced ? (
          <SidebarReduced onExpand={toggleReduced} />
        ) : (
          <Box style={{ minWidth: SIDEBAR_WIDTH_NORMAL_MIN }}>
            <SidebarNormal
              sidebarFullPage={sidebarFullPage}
              onReduce={toggleReduced}
              onToggleFullPage={setSidebarFullPage}
            />
          </Box>
        )}
      </Box>
    </AppShell.Navbar>
  );
}
