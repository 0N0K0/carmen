import type { MantineTheme } from '@mantine/core';
import { toNumberPx } from '../layout';

/**
 * Calcule la durée d'une transition CSS en fonction de la taille d'un élément, en utilisant une formule empirique pour obtenir une durée qui semble naturelle.
 * @param {string | number} props.dimension La taille de l'élément, qui peut être une chaîne avec des unités ou un nombre représentant des pixels.
 * @param {MantineTheme} props.theme Le thème contenant la configuration de la taille de police, nécessaire pour résoudre les valeurs de taille en pixels.
 * @returns {number} La durée calculée de la transition en millisecondes.
 */
export function getAutoDimensionDuration({
  dimension,
  theme,
}: {
  dimension: string | number;
  theme?: MantineTheme;
}): number {
  const dimensionPx = toNumberPx({
    value: dimension,
    rootFontSize: theme?.fontSize || 16,
    theme,
  });

  const constant = dimensionPx / 36;
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
}
