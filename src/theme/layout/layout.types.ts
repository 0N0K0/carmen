import type { MantineBreakpoint } from '@mantine/core';

export type Layout = {
  columns: Record<MantineBreakpoint, number>;
  columnWidth: number;
  paddingX: Partial<Record<MantineBreakpoint, number>> & { xs: number };
  columnGap: number;
  horizontalRhythm: number;
  verticalRhythm: number;
  maxFullWidth: number;
  maxFullHeight: number;
};
