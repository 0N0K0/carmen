import {
  createTheme,
  type CSSVariablesResolver,
  type MantineTheme,
} from '@mantine/core';
import { TYPOGRAPHY_CONFIG, TYPOGRAPHY_CSS_VARIABLES } from './typography';
import { COLOR_CONFIG, COLOR_SCHEME_PALETTE_RESOLVER } from './palette';
import { LAYOUT_CONFIG, LAYOUT_CSS_VARIABLES } from './layout';
import { SHAPES_CONFIG } from './shapes';
import { TRANSITIONS_CONFIG, TRANSITIONS_CSS_VARIABLES } from './transitions';

export const theme = createTheme({
  ...TYPOGRAPHY_CONFIG,
  ...LAYOUT_CONFIG,
  ...SHAPES_CONFIG,
  ...COLOR_CONFIG,
  ...TRANSITIONS_CONFIG,
});

/**
 * Résout les variables CSS du thème pour les schémas light et dark.
 * @param {MantineTheme} theme Le thème Mantine.
 * @returns {ConvertCSSVariablesInput} Variables CSS pour les trois contextes (global, light, dark).
 */
export const resolver: CSSVariablesResolver = (theme: MantineTheme) => ({
  variables: {
    ...TYPOGRAPHY_CSS_VARIABLES(theme),
    ...LAYOUT_CSS_VARIABLES(theme),
    ...TRANSITIONS_CSS_VARIABLES(theme),
  },
  ...COLOR_SCHEME_PALETTE_RESOLVER(theme),
});
