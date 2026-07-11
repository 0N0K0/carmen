import { Carousel } from '@mantine/carousel';
import type { CarouselProps } from '@mantine/carousel';
import {
  ActionIcon,
  Avatar,
  Card,
  Flex,
  Pagination,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  CaretLeftIcon,
  CaretRightIcon,
  SortAscendingIcon,
  SortDescendingIcon,
} from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LibrarySortOrder } from '../../hooks/useLibrary';

/** Nombre d'éléments par page dans les vues de bibliothèque paginées. */
export const LIBRARY_PAGE_SIZE = 30;

/** Nombre de skeletons affichés pendant le chargement d'une section. */
const SKELETON_COUNT = 6;

/** Largeur fixe d'une carte dans un carrousel horizontal. */
const CAROUSEL_CARD_WIDTH = 150;

/** Nombre d'éléments visibles simultanément dans un carrousel, et navigués par bloc. */
const CAROUSEL_SLIDES_PER_VIEW = 6;

/** Instance embla exposée par `Carousel.getEmblaApi` (type dérivé de l'API publique Mantine). */
type EmblaApi = Parameters<NonNullable<CarouselProps['getEmblaApi']>>[0];

/**
 * Carte affichant une vignette (image ou fallback) et un libellé.
 * @param {string} [props.image] URL de l'image. Optionnel — fallback si absent.
 * @param {ReactNode} props.fallback Icône affichée si `image` est absent.
 * @param {string} props.title Libellé principal.
 * @param {string} [props.subtitle] Libellé secondaire. Optionnel.
 * @returns {JSX.Element} Carte d'élément de bibliothèque.
 */
export function LibraryItemCard({
  image,
  fallback,
  title,
  subtitle,
}: {
  image?: string | null;
  fallback: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <Card padding="sm" radius="md" withBorder>
      <Card.Section>
        <Avatar src={image} radius="md" size="100%" style={{ aspectRatio: '1 / 1' }}>
          {fallback}
        </Avatar>
      </Card.Section>
      <Text fz="sm" fw={500} mt="xs" lineClamp={1}>
        {title}
      </Text>
      {subtitle && (
        <Text fz="xs" c="dimmed" lineClamp={1}>
          {subtitle}
        </Text>
      )}
    </Card>
  );
}

/**
 * Grille de skeletons affichée pendant le chargement d'une section.
 * @returns {JSX.Element} Grille de placeholders.
 */
export function LibrarySkeletonGrid() {
  return (
    <SimpleGrid cols={{ base: 2, xs: 3, sm: 4, md: 6 }}>
      {Array.from({ length: SKELETON_COUNT }, (_, i) => (
        <Stack key={i} gap="xs">
          <Skeleton radius="md" style={{ aspectRatio: '1 / 1' }} />
          <Skeleton h={12} w="80%" />
        </Stack>
      ))}
    </SimpleGrid>
  );
}

/**
 * Section de la bibliothèque : titre + bouton de tri (sur la même ligne),
 * grille d'éléments, skeleton pendant le chargement, état vide explicite si
 * la liste est vide, pagination si plus d'une page de résultats. Le tri
 * (titre/nom) est appliqué côté serveur — `children` arrive déjà trié.
 * @param {string} props.title Titre de la section.
 * @param {boolean} props.loading Section en cours de chargement.
 * @param {ReactNode} props.emptyIcon Icône affichée dans l'état vide.
 * @param {string} props.emptyMessage Message affiché dans l'état vide.
 * @param {number} [props.page] Page courante (1-indexée). Optionnel — omet la pagination si absent.
 * @param {(page: number) => void} [props.onPageChange] Change la page courante. Optionnel.
 * @param {number} [props.totalPages] Nombre total de pages. Optionnel.
 * @param {LibrarySortOrder} [props.sort] Sens de tri courant (titre/nom). Optionnel — omet le bouton de tri si absent.
 * @param {() => void} [props.onToggleSort] Inverse le sens de tri. Optionnel.
 * @param {ReactNode[]} props.children Cartes d'éléments à afficher, déjà triées.
 * @returns {JSX.Element} Section de bibliothèque.
 */
export function LibrarySection({
  title,
  loading,
  emptyIcon,
  emptyMessage,
  page,
  onPageChange,
  totalPages,
  sort,
  onToggleSort,
  children,
}: {
  title: string;
  loading: boolean;
  emptyIcon: ReactNode;
  emptyMessage: string;
  page?: number;
  onPageChange?: (page: number) => void;
  totalPages?: number;
  sort?: LibrarySortOrder;
  onToggleSort?: () => void;
  children: ReactNode[];
}) {
  return (
    <Stack gap="sm">
      <Flex align="center" gap="xs">
        <Title order={2} fz="lg">
          {title}
        </Title>
        {sort && onToggleSort && (
          <Tooltip label={sort === 'ASC' ? 'Trier de A à Z' : 'Trier de Z à A'}>
            <ActionIcon variant="subtle" size="sm" aria-label="Trier" onClick={onToggleSort}>
              {sort === 'ASC' ? <SortAscendingIcon /> : <SortDescendingIcon />}
            </ActionIcon>
          </Tooltip>
        )}
      </Flex>
      {loading ? (
        <LibrarySkeletonGrid />
      ) : children.length === 0 ? (
        <Stack align="center" gap="xs" py="xl" c="dimmed">
          {emptyIcon}
          <Text fz="sm">{emptyMessage}</Text>
        </Stack>
      ) : (
        <>
          <SimpleGrid cols={{ base: 2, xs: 3, sm: 4, md: 6 }}>{children}</SimpleGrid>
          {totalPages !== undefined && totalPages > 1 && page !== undefined && onPageChange && (
            <Pagination total={totalPages} value={page} onChange={onPageChange} mt="xs" />
          )}
        </>
      )}
    </Stack>
  );
}

/**
 * Ligne de skeletons affichée pendant le chargement d'un carrousel.
 * @returns {JSX.Element} Ligne de placeholders.
 */
function LibrarySkeletonRow() {
  return (
    <Flex gap="sm">
      {Array.from({ length: SKELETON_COUNT }, (_, i) => (
        <Stack key={i} gap="xs" w={CAROUSEL_CARD_WIDTH} style={{ flexShrink: 0 }}>
          <Skeleton radius="md" style={{ aspectRatio: '1 / 1' }} />
          <Skeleton h={12} w="80%" />
        </Stack>
      ))}
    </Flex>
  );
}

/**
 * Section "vue d'ensemble" : titre cliquable (navigue vers la page dédiée de
 * la section) avec les flèches du carrousel alignées à droite sur la même
 * ligne, carrousel horizontal (`@mantine/carousel`) affichant
 * `CAROUSEL_SLIDES_PER_VIEW` éléments et naviguant par blocs de ce nombre,
 * pas de pagination ni de tri — ces contrôles vivent sur la page dédiée.
 * @param {string} props.title Titre de la section.
 * @param {string} props.to Chemin de la page dédiée (ex. `/library/playlists`).
 * @param {boolean} props.loading Section en cours de chargement.
 * @param {ReactNode} props.emptyIcon Icône affichée dans l'état vide.
 * @param {string} props.emptyMessage Message affiché dans l'état vide.
 * @param {ReactNode[]} props.children Cartes d'éléments à afficher.
 * @returns {JSX.Element} Section de bibliothèque en carrousel.
 */
export function LibraryCarouselSection({
  title,
  to,
  loading,
  emptyIcon,
  emptyMessage,
  children,
}: {
  title: string;
  to: string;
  loading: boolean;
  emptyIcon: ReactNode;
  emptyMessage: string;
  children: ReactNode[];
}) {
  const navigate = useNavigate();
  const embla = useRef<EmblaApi | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  /**
   * Synchronise l'état activé/désactivé des flèches sur la position réelle du carrousel.
   * @param {EmblaApi} api Instance embla exposée par `Carousel`.
   * @returns {void}
   */
  function syncScrollState(api: EmblaApi) {
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }

  const showControls = !loading && children.length > 0;

  return (
    <Stack gap="sm">
      <Flex align="center" justify="space-between">
        <Title order={2} fz="lg" onClick={() => navigate(to)} style={{ cursor: 'pointer' }}>
          {title}
        </Title>
        {showControls && (
          <Flex gap={4}>
            <ActionIcon
              variant="subtle"
              size="sm"
              aria-label="Précédent"
              disabled={!canScrollPrev}
              onClick={() => embla.current?.scrollPrev()}
            >
              <CaretLeftIcon />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              size="sm"
              aria-label="Suivant"
              disabled={!canScrollNext}
              onClick={() => embla.current?.scrollNext()}
            >
              <CaretRightIcon />
            </ActionIcon>
          </Flex>
        )}
      </Flex>
      {loading ? (
        <LibrarySkeletonRow />
      ) : children.length === 0 ? (
        <Stack align="center" gap="xs" py="xl" c="dimmed">
          {emptyIcon}
          <Text fz="sm">{emptyMessage}</Text>
        </Stack>
      ) : (
        <Carousel
          slideSize={`${100 / CAROUSEL_SLIDES_PER_VIEW}%`}
          slideGap="sm"
          withControls={false}
          emblaOptions={{ align: 'start', slidesToScroll: CAROUSEL_SLIDES_PER_VIEW }}
          getEmblaApi={(api) => {
            embla.current = api;
            syncScrollState(api);
            api.on('select', () => syncScrollState(api));
            api.on('reInit', () => syncScrollState(api));
          }}
        >
          {children.map((child, i) => (
            <Carousel.Slide key={i}>{child}</Carousel.Slide>
          ))}
        </Carousel>
      )}
    </Stack>
  );
}
