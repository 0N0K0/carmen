import type { MantineTheme } from '@mantine/core';
import { createCssVariables } from '../../utils/css.utils';

export const TRANSITIONS_CSS_VARIABLES = (theme: MantineTheme) => ({
  ...createCssVariables(theme.transitions.easing, '--onoko-transition-timing-function'),
  ...createCssVariables(theme.transitions.duration, '--onoko-transition-duration'),
});
