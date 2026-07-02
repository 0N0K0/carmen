import type { MantineTheme } from '@mantine/core';
import { createTypographyVariables } from './typography.utils';
import { createCssVariables } from '../../utils';

/**
 * Génère les variables CSS de typographie à partir du thème.
 * @param {MantineTheme} theme Le thème Mantine.
 * @returns {Record<string, string>} Variables CSS de typographie.
 */
export const TYPOGRAPHY_CSS_VARIABLES = (theme: MantineTheme) => {
  return {
    '--onoko-font-family-interface': theme.fontFamilyInterface,
    '--onoko-font-family-accent': theme.fontFamilyAccent,

    ...createCssVariables(theme.headingFontSizes, '--onoko-heading-font-size'),
    ...createCssVariables(
      theme.headingLineHeights,
      '--onoko-heading-line-height',
    ),

    ...createTypographyVariables(theme.typography),
  };
};
