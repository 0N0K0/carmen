import { useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { getQueryString } from './queryString.gen';

/**
 * Détermine si l'appareil prend en charge le survol et a une précision de pointeur fine (comme une souris).
 * @returns {boolean} true si l'appareil peut survoler, sinon false.
 */
export const useCanHover = (): boolean => useMediaQuery('(hover: hover) and (pointer: fine)') ?? false;

export type Density = 'tight' | 'compact' | 'loose';

/**
 * Détermine la densité de l'interface utilisateur en fonction des breakpoints horizontaux et verticaux.
 * @returns {Density} "tight" si la largeur ou la hauteur est en breakpoint "xs", "compact" si en breakpoint "sm", sinon "loose".
 */
export const useDensity = (): Density => {
  const theme = useMantineTheme();

  const widthXs = useMediaQuery(getQueryString({ axis: 'width', value: 'xs', operator: 'only', theme }));
  const widthSm = useMediaQuery(getQueryString({ axis: 'width', value: 'sm', operator: 'only', theme }));
  const heightXs = useMediaQuery(getQueryString({ axis: 'height', value: 'xs', operator: 'only', theme }));
  const heightSm = useMediaQuery(getQueryString({ axis: 'height', value: 'sm', operator: 'only', theme }));

  const isTight = (widthXs ?? false) || (heightXs ?? false);
  const isCompact = (widthSm ?? false) || (heightSm ?? false);

  return isTight ? 'tight' : isCompact ? 'compact' : 'loose';
};
