import {
  createTheme,
  type CSSVariablesResolver,
  type MantineTheme,
} from '@mantine/core';
import { TYPOGRAPHY_CONFIG, TYPOGRAPHY_CSS_VARIABLES } from './typography';
import { COLOR_CONFIG, COLOR_SCHEME_PALETTE_RESOLVER } from './palette';

export const theme = createTheme({
  ...TYPOGRAPHY_CONFIG,
  ...COLOR_CONFIG,
});

export const resolver: CSSVariablesResolver = (theme: MantineTheme) => ({
  variables: {
    ...TYPOGRAPHY_CSS_VARIABLES(theme),
  },
  ...COLOR_SCHEME_PALETTE_RESOLVER(theme),
});
