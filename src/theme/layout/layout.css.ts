import { type MantineTheme } from '@mantine/core';

export const LAYOUT_CSS_VARIABLES = (theme: MantineTheme) => ({
  '--onoko-horizontal-rhythm': theme.layout.horizontalRhythm + 'rem',
  '--onoko-vertical-rhythm': theme.layout.verticalRhythm + 'rem',
  '--onoko-max-full-width': theme.layout.maxFullWidth + 'rem',
  '--onoko-max-full-height': theme.layout.maxFullHeight + 'rem',
  '--onoko-default-column-gap': theme.layout.columnGap + 'rem',
});
