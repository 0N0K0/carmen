import { FONT_SIZE, MANTINE_FONT_SIZE } from '../typography';
import { createHeightBreakpoints, createWidthBreakpoints } from './breakpoints.utils';
import type { Layout } from './layout.types';

// Configuration de layout pour le thème
const layout: Layout = {
  columns: {
    xs: 3,
    sm: 4,
    md: 6,
    lg: 9,
    xl: 12,
    xxl: 12,
  },

  columnWidth: 6,
  horizontalRhythm: 1,
  verticalRhythm: 1.5,

  maxFullWidth: 120,
  get maxFullHeight() {
    return 45 * this.verticalRhythm;
  },

  get paddingX() {
    return {
      xs: this.horizontalRhythm,
      sm: this.horizontalRhythm * 2,
      md: this.horizontalRhythm * 4,
    };
  },
  get columnGap() {
    return this.horizontalRhythm;
  },
};

const breakpoints = {
  layout,
  get breakpoints() {
    return createWidthBreakpoints(this.layout);
  },
  get heightBreakpoints() {
    return createHeightBreakpoints(this.layout);
  },
};

export const LAYOUT_CONFIG = {
  ...breakpoints,
  fontSize: FONT_SIZE,
  get scale(): number {
    return this.fontSize / MANTINE_FONT_SIZE;
  },
  spacing: {
    xs: '0.75rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    xxl: '4rem',
  },
};
