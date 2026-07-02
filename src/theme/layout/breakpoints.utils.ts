import { type MantineBreakpoint } from '@mantine/core';
import { DIMENSIONS_RANK } from './dimensions.const';
import type { Layout } from './layout.types';

/**
 * Génère des breakpoints de largeur basés sur la configuration de layout.
 * @param {Layout} layout La configuration de layout utilisée pour calculer les breakpoints.
 * @returns {Record<MantineBreakpoint, string>} Un objet contenant les breakpoints de largeur en rem.
 */
export function createWidthBreakpoints(
  layout: Layout,
): Record<MantineBreakpoint, string> {
  const widthBreakpointsValues = {} as Record<MantineBreakpoint, string>;

  widthBreakpointsValues['xxl'] = `${layout.maxFullWidth}rem`;

  let currentPaddingX = layout.paddingX.xs;

  for (const breakpoint of Object.keys(
    DIMENSIONS_RANK,
  ) as MantineBreakpoint[]) {
    const paddingX = layout.paddingX[breakpoint] ?? currentPaddingX;
    if (widthBreakpointsValues[breakpoint] || !(breakpoint in layout.columns)) {
      continue;
    }

    widthBreakpointsValues[breakpoint] = `${
      layout.columns[breakpoint] * layout.columnWidth +
      (layout.columns[breakpoint] - 1) * layout.columnGap +
      paddingX * 2
    }rem`;
    currentPaddingX = paddingX;
  }

  return widthBreakpointsValues;
}

/**
 * Génère des breakpoints de hauteur basés sur la configuration de layout.
 * @param {Layout} layout La configuration de layout utilisée pour calculer les breakpoints.
 * @returns {Partial<Record<MantineBreakpoint, string>>} Un objet contenant les breakpoints de hauteur en rem.
 */
export function createHeightBreakpoints(
  layout: Layout,
): Partial<Record<MantineBreakpoint, string>> {
  return {
    xs: `${layout.verticalRhythm * 25}rem`,
    sm: `${layout.verticalRhythm * 35}rem`,
    md: `${layout.maxFullHeight}rem`,
  };
}

/**
 * Crée une configuration de breakpoints pour les mises en page widthes et heightes.
 * @param {Layout} layout La configuration de layout utilisée pour calculer les breakpoints.
 * @returns {{
 *    widthBreakpointsValues: Record<MantineBreakpoint, string>,
 *    heightBreakpointsValues: Partial<Record<MantineBreakpoint, string>>
 * }} Un objet contenant les breakpoints horizontaux et verticaux.
 */
export function createBreakpoints(layout: Layout): {
  widthBreakpointsValues: Record<MantineBreakpoint, string>;
  heightBreakpointsValues: Partial<Record<MantineBreakpoint, string>>;
} {
  const widthBreakpointsValues = createWidthBreakpoints(layout);
  const heightBreakpointsValues = createHeightBreakpoints(layout);

  return { widthBreakpointsValues, heightBreakpointsValues };
}
