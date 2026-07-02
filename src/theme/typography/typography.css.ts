import type { MantineTheme } from '@mantine/core';
import { createTypographyVariables } from './typography.utils';
import { createCssVariables } from '../../utils';

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
