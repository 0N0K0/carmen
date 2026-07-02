import {
  createTheme,
  type CSSVariablesResolver,
  type MantineTheme,
} from '@mantine/core';
import { TYPOGRAPHY_CONFIG, TYPOGRAPHY_CSS_VARIABLES } from './typography';

export const theme = createTheme({
  ...TYPOGRAPHY_CONFIG,
});

export const resolver: CSSVariablesResolver = (theme: MantineTheme) => ({
  variables: {
    ...TYPOGRAPHY_CSS_VARIABLES(theme),
  },
  dark: {},
  light: {},
});
