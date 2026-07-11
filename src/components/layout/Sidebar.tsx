import {
  Accordion,
  ActionIcon,
  AppShell,
  Avatar,
  Box,
  Flex,
  Scroller,
  ScrollArea,
  SimpleGrid,
  Skeleton,
  Stack,
  Tabs,
  Text,
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
  SortDescendingIcon,
  UserIcon,
  VinylRecordIcon,
} from '@phosphor-icons/react';
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Link } from 'react-router-dom';
import type { LibrarySortOrder } from '../../hooks/useLibrary';
import {
  useAllAlbums,
  useAllArtists,
  useAllPlaylists,
} from '../../hooks/useLibrary';
import {
  MAIN_CONTENT_MIN_WIDTH,
  SIDEBAR_WIDTH_NORMAL_MIN,
  SIDEBAR_WIDTH_REDUCED,
  snapSidebarWidth,
  useLayoutStore,
} from '../../store/layout';
import { SyncDeezerButton } from '../ui/SyncDeezerButton';

/** Élément normalisé affiché dans une liste de la sidebar. */
interface SidebarLibraryItem {
  id: string;
  label: string;
  image?: string | null;
  /** Icône propre à l'élément — utilisée par l'onglet "Tout" qui mélange plusieurs types. */
  icon?: React.ReactNode;
}

/** Mode d'affichage d'une liste de bibliothèque dans la sidebar. */
type SidebarLibraryView = 'list' | 'grid';

/**
 * Liste compacte d'éléments de bibliothèque pour la sidebar : skeleton
 * pendant le chargement, état vide explicite, sinon les éléments en liste
 * (une ligne chacun) ou en grille (vignette + libellé), selon `view`. Le tri
 * (titre/nom) est appliqué côté serveur — `items` arrive déjà trié.
 * @param {SidebarLibraryItem[]} props.items Éléments à afficher, déjà triés.
 * @param {boolean} props.loading Chargement en cours.
 * @param {React.ReactNode} props.fallbackIcon Icône affichée si pas d'image et pas d'`item.icon`.
 * @param {string} props.emptyMessage Message affiché si `items` est vide.
 * @param {SidebarLibraryView} props.view Mode d'affichage (liste ou grille).
 * @returns {JSX.Element} Liste ou état de chargement/vide.
 */
function SidebarLibraryList({
  items,
  loading,
  fallbackIcon,
  emptyMessage,
  view,
}: {
  items: SidebarLibraryItem[];
  loading: boolean;
  fallbackIcon: React.ReactNode;
  emptyMessage: string;
  view: SidebarLibraryView;
}) {
  if (loading) {
    return view === 'grid' ? (
      <SimpleGrid
        cols={3}
        spacing="xs"
        verticalSpacing="xs"
        style={{ flex: 1, minHeight: 0 }}
      >
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} radius="sm" style={{ aspectRatio: '1 / 1' }} />
        ))}
      </SimpleGrid>
    ) : (
      <Stack gap={4} style={{ flex: 1, minHeight: 0 }}>
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} h={32} radius="sm" />
        ))}
      </Stack>
    );
  }

  if (items.length === 0) {
    return (
      <Box c="dimmed" fz="sm" style={{ flex: 1, minHeight: 0 }}>
        {emptyMessage}
      </Box>
    );
  }

  if (view === 'grid') {
    return (
      <ScrollArea
        style={{ flex: 1, minHeight: 0 }}
        type="auto"
        offsetScrollbars
      >
        <SimpleGrid cols={3} spacing="xs" verticalSpacing="xs">
          {items.map((item) => (
            <Stack key={item.id} gap={4} align="center">
              <Avatar
                src={item.image}
                radius="sm"
                size="100%"
                style={{ aspectRatio: '1 / 1' }}
              >
                {item.icon ?? fallbackIcon}
              </Avatar>
              <Text fz="xs" ta="center" lineClamp={1} w="100%">
                {item.label}
              </Text>
            </Stack>
          ))}
        </SimpleGrid>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea style={{ flex: 1, minHeight: 0 }} type="auto" offsetScrollbars>
      <Stack gap={2}>
        {items.map((item) => (
          <Flex key={item.id} align="center" gap="xs">
            <Avatar src={item.image} size="sm" radius="sm">
              {item.icon ?? fallbackIcon}
            </Avatar>
            <Text fz="sm" lineClamp={1}>
              {item.label}
            </Text>
          </Flex>
        ))}
      </Stack>
    </ScrollArea>
  );
}

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
    document.documentElement.style.setProperty(
      '--app-shell-navbar-width',
      '100vw',
    );
    document.documentElement.style.setProperty(
      '--app-shell-navbar-offset',
      '0px',
    );
  } else {
    document.documentElement.style.setProperty(
      '--app-shell-navbar-width',
      `${width}px`,
    );
    document.documentElement.style.setProperty(
      '--app-shell-navbar-offset',
      `${width}px`,
    );
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
        <ActionIcon
          variant="subtle"
          onClick={onExpand}
          aria-label="Agrandir la sidebar"
        >
          <ArrowLineRightIcon />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Raccourcis" position="right">
        <ActionIcon variant="subtle" aria-label="Raccourcis">
          <BookmarkSimpleIcon weight="fill" />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Ma bibliothèque" position="right">
        <ActionIcon
          component={Link}
          to="/library"
          variant="subtle"
          aria-label="Ma bibliothèque"
        >
          <PlaylistIcon weight="fill" />
        </ActionIcon>
      </Tooltip>
      <SyncDeezerButton />
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
  const [libraryTab, setLibraryTab] = useState('playlists');
  const [libraryView, setLibraryView] = useState<SidebarLibraryView>('list');
  const [librarySort, setLibrarySort] = useState<LibrarySortOrder>('ASC');
  const [librarySearch, setLibrarySearch] = useState('');
  const { playlists, loading: playlistsLoading } = useAllPlaylists(
    100,
    librarySort,
  );
  const { albums, loading: albumsLoading } = useAllAlbums(100, librarySort);
  const { artists, loading: artistsLoading } = useAllArtists(100, librarySort);

  const libraryLoading = playlistsLoading || albumsLoading || artistsLoading;

  /** Fusion playlists/albums/artistes, triée, pour l'onglet "Tout" et la recherche (tous contextes). */
  const mixedItems: SidebarLibraryItem[] = [
    ...playlists.map(
      (p: { id: string; title: string; picture?: string | null }) => ({
        id: `playlist-${p.id}`,
        label: p.title,
        image: p.picture,
        icon: <PlaylistIcon />,
      }),
    ),
    ...albums.map(
      (a: { id: string; title: string; cover?: string | null }) => ({
        id: `album-${a.id}`,
        label: a.title,
        image: a.cover,
        icon: <VinylRecordIcon />,
      }),
    ),
    ...artists.map(
      (a: { id: string; name: string; picture?: string | null }) => ({
        id: `artist-${a.id}`,
        label: a.name,
        image: a.picture,
        icon: <UserIcon />,
      }),
    ),
  ].sort(
    (a, b) => a.label.localeCompare(b.label) * (librarySort === 'ASC' ? 1 : -1),
  );

  const searchQuery = librarySearch.trim().toLowerCase();
  const isSearching = searchQuery.length > 0;
  const searchResults = isSearching
    ? mixedItems.filter((item) =>
        item.label.toLowerCase().includes(searchQuery),
      )
    : [];

  return (
    <Box
      p="xs"
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Flex
        justify="space-between"
        align="center"
        mb={4}
        style={{ flexShrink: 0 }}
      >
        {!sidebarFullPage && (
          <Tooltip label="Réduire la sidebar" position="right">
            <ActionIcon
              variant="subtle"
              size="sm"
              onClick={onReduce}
              aria-label="Réduire la sidebar"
            >
              <ArrowLineLeftIcon />
            </ActionIcon>
          </Tooltip>
        )}
        <Flex gap={4} align="center">
          <SyncDeezerButton size="sm" tooltipPosition="left" />
          <Tooltip
            label={sidebarFullPage ? 'Réduire' : 'Pleine page'}
            position="left"
          >
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
                <ArrowsInSimpleIcon />
              ) : (
                <ArrowsOutSimpleIcon />
              )}
            </ActionIcon>
          </Tooltip>
        </Flex>
      </Flex>

      <Accordion
        multiple
        defaultValue={['raccourcis', 'bibliotheque']}
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Accordion.Item value="raccourcis" style={{ flexShrink: 0 }}>
          <Accordion.Control>Raccourcis</Accordion.Control>
          <Accordion.Panel>
            <Box c="dimmed" fz="sm">
              Aucun raccourci
            </Box>
          </Accordion.Panel>
        </Accordion.Item>

        {/* Bouton Ajouter superposé pour éviter button > button */}
        <Box
          pos="relative"
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Accordion.Item
            value="bibliotheque"
            style={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Accordion.Control>Bibliothèque</Accordion.Control>
            <Accordion.Panel
              style={{
                flex: 1,
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
              }}
              styles={{
                content: {
                  flex: 1,
                  minHeight: 0,
                  display: 'flex',
                  flexDirection: 'column',
                },
              }}
            >
              <Flex
                direction="column"
                gap="xs"
                style={{ flex: 1, minHeight: 0 }}
              >
                <Tabs
                  value={libraryTab}
                  onChange={(v) => v && setLibraryTab(v)}
                  style={{ flexShrink: 0 }}
                >
                  <Tabs.List>
                    <Scroller>
                      <Tabs.Tab value="tout">Tout</Tabs.Tab>
                      <Tabs.Tab value="playlists">Playlists</Tabs.Tab>
                      <Tabs.Tab value="albums">Albums</Tabs.Tab>
                      <Tabs.Tab value="artistes">Artistes</Tabs.Tab>
                      <Tabs.Tab value="podcasts">Podcasts</Tabs.Tab>
                    </Scroller>
                  </Tabs.List>
                </Tabs>
                <TextInput
                  size="xs"
                  placeholder="Rechercher dans la bibliothèque…"
                  value={librarySearch}
                  onChange={(e) => setLibrarySearch(e.currentTarget.value)}
                  style={{ flexShrink: 0 }}
                />
                <Flex
                  justify="space-between"
                  align="center"
                  style={{ flexShrink: 0 }}
                >
                  <Tooltip
                    label={
                      librarySort === 'ASC'
                        ? 'Trier de A à Z'
                        : 'Trier de Z à A'
                    }
                    position="top"
                  >
                    <ActionIcon
                      variant="subtle"
                      size="sm"
                      aria-label="Trier"
                      onClick={() =>
                        setLibrarySort((s) => (s === 'ASC' ? 'DESC' : 'ASC'))
                      }
                    >
                      {librarySort === 'ASC' ? (
                        <SortAscendingIcon />
                      ) : (
                        <SortDescendingIcon />
                      )}
                    </ActionIcon>
                  </Tooltip>
                  <Flex gap="xs">
                    <Tooltip label="Vue liste" position="top">
                      <ActionIcon
                        variant={libraryView === 'list' ? 'light' : 'subtle'}
                        size="sm"
                        aria-label="Vue liste"
                        onClick={() => setLibraryView('list')}
                      >
                        <ListIcon />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Vue grille" position="top">
                      <ActionIcon
                        variant={libraryView === 'grid' ? 'light' : 'subtle'}
                        size="sm"
                        aria-label="Vue grille"
                        onClick={() => setLibraryView('grid')}
                      >
                        <GridFourIcon />
                      </ActionIcon>
                    </Tooltip>
                  </Flex>
                </Flex>

                {isSearching ? (
                  <SidebarLibraryList
                    items={searchResults}
                    loading={libraryLoading}
                    fallbackIcon={<PlaylistIcon />}
                    emptyMessage="Aucun résultat."
                    view={libraryView}
                  />
                ) : (
                  <>
                    {libraryTab === 'tout' && (
                      <SidebarLibraryList
                        items={mixedItems}
                        loading={libraryLoading}
                        fallbackIcon={<PlaylistIcon />}
                        emptyMessage="Bibliothèque vide."
                        view={libraryView}
                      />
                    )}
                    {libraryTab === 'playlists' && (
                      <SidebarLibraryList
                        items={playlists.map(
                          (p: {
                            id: string;
                            title: string;
                            picture?: string | null;
                          }) => ({
                            id: p.id,
                            label: p.title,
                            image: p.picture,
                          }),
                        )}
                        loading={playlistsLoading}
                        fallbackIcon={<PlaylistIcon />}
                        emptyMessage="Aucune playlist synchronisée."
                        view={libraryView}
                      />
                    )}
                    {libraryTab === 'albums' && (
                      <SidebarLibraryList
                        items={albums.map(
                          (a: {
                            id: string;
                            title: string;
                            cover?: string | null;
                          }) => ({
                            id: a.id,
                            label: a.title,
                            image: a.cover,
                          }),
                        )}
                        loading={albumsLoading}
                        fallbackIcon={<VinylRecordIcon />}
                        emptyMessage="Aucun album synchronisé."
                        view={libraryView}
                      />
                    )}
                    {libraryTab === 'artistes' && (
                      <SidebarLibraryList
                        items={artists.map(
                          (a: {
                            id: string;
                            name: string;
                            picture?: string | null;
                          }) => ({
                            id: a.id,
                            label: a.name,
                            image: a.picture,
                          }),
                        )}
                        loading={artistsLoading}
                        fallbackIcon={<UserIcon />}
                        emptyMessage="Aucun artiste synchronisé."
                        view={libraryView}
                      />
                    )}
                    {libraryTab === 'podcasts' && (
                      <Box c="dimmed" fz="sm" style={{ flex: 1, minHeight: 0 }}>
                        Aucun élément
                      </Box>
                    )}
                  </>
                )}
              </Flex>
            </Accordion.Panel>
          </Accordion.Item>

          <Flex
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
                <PlusCircleIcon />
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
  const [dragCategory, setDragCategory] = useState<'reduced' | 'normal' | null>(
    null,
  );

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
    setDragCategory(
      sidebarWidth <= SIDEBAR_WIDTH_REDUCED ? 'reduced' : 'normal',
    );
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
      const cat: 'reduced' | 'normal' =
        snapped <= SIDEBAR_WIDTH_REDUCED ? 'reduced' : 'normal';
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
          <Box style={{ minWidth: SIDEBAR_WIDTH_NORMAL_MIN, height: '100%' }}>
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
