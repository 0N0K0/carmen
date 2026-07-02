import type { MantineTheme } from '@mantine/core';

export interface toNumberProps {
  value: string | number;
  rootFontSize?: number;
  theme?: MantineTheme;
}

/**
 * Résout une valeur de dimension (comme "16px" ou "1rem") en pixels, en tenant compte d'une taille de police racine pour les unités "rem".
 * @param {string | number} props.value La valeur de dimension à résoudre, qui peut être une chaîne avec des unités ou un nombre représentant des pixels.
 * @param {number} [props.rootFontSize=16] La taille de police racine à utiliser pour convertir les unités "rem" en pixels. Par défaut = 16.
 * @param {MantineTheme} [props.theme] Le thème contenant les breakpoints, nécessaire pour résoudre les valeurs de breakpoint en pixels.
 * @returns {number} La valeur résolue en pixels.
 * @throws {Error} Si la valeur utilise une unité non prise en charge ou si le format est invalide.
 */
export function toNumberPx({ value, rootFontSize = 16, theme }: toNumberProps): number {
  if (typeof value === 'number') {
    return value;
  }

  if (theme?.breakpoints[value]) {
    return toNumberPx({ value: theme.breakpoints[value], rootFontSize });
  }

  const trimmed = value.trim();

  if (trimmed.endsWith('px')) {
    return parseFloat(trimmed);
  }
  if (trimmed.endsWith('em')) {
    return parseFloat(trimmed) * rootFontSize;
  }
  if (trimmed.endsWith('rem')) {
    return parseFloat(trimmed) * rootFontSize;
  }

  throw new Error(`Unsupported unit: ${value}`);
}

/**
 * Résout une valeur de dimension (comme "16px" ou "1rem") en rem, en tenant compte d'une taille de police racine pour les unités "rem".
 * @param {string | number} props.value La valeur de dimension à résoudre, qui peut être une chaîne avec des unités ou un nombre représentant des pixels.
 * @param {number} [props.rootFontSize=16] La taille de police racine à utiliser pour convertir les unités "px" en rem. Par défaut = 16.
 * @param {MantineTheme} [props.theme] Le thème contenant les breakpoints, nécessaire pour résoudre les valeurs de breakpoint en rem.
 * @returns {number} La valeur résolue en rem.
 * @throws {Error} Si la valeur utilise une unité non prise en charge ou si le format est invalide.
 */
export function toNumberRem({ value, rootFontSize = 16, theme }: toNumberProps): number {
  if (typeof value === 'number') {
    return value / rootFontSize;
  }

  if (theme?.breakpoints[value]) {
    return toNumberRem({ value: theme.breakpoints[value], rootFontSize });
  }

  const trimmed = value.trim();

  if (trimmed.endsWith('px')) {
    return parseFloat(trimmed) / rootFontSize;
  }
  if (trimmed.endsWith('em')) {
    return parseFloat(trimmed);
  }
  if (trimmed.endsWith('rem')) {
    return parseFloat(trimmed);
  }

  throw new Error(`Unsupported unit: ${value}`);
}

/**
 * Permet de convertir une valeur en unités de rythme horizontal (rw) en rem, en fonction de la valeur définie pour le rythme horizontal dans la configuration du thème.
 * @param {number} value La valeur à convertir en rem, exprimée en unités de rythme horizontal (rw).
 * @param {MantineTheme} theme Le thème contenant la configuration du rythme horizontal, nécessaire pour accéder à la valeur du rythme horizontal.
 * @returns {number} La valeur convertie en rem, calculée en multipliant la valeur d'entrée par le rythme horizontal défini dans la configuration du thème.
 */
export function toRw(value: number, theme: MantineTheme): string {
  return `${value * theme.layout.horizontalRhythm}rem`;
}

/**
 * Permet de convertir une valeur en unités de rythme vertical (rh) en rem, en fonction de la valeur définie pour le rythme vertical dans la configuration du thème.
 * @param {number} value La valeur à convertir en rem, exprimée en unités de rythme vertical (rh).
 * @param {MantineTheme} theme Le thème contenant la configuration du rythme vertical, nécessaire pour accéder à la valeur du rythme vertical.
 * @returns {number} La valeur convertie en rem, calculée en multipliant la valeur d'entrée par le rythme vertical défini dans la configuration du thème.
 */
export function toRh(value: number, theme: MantineTheme): string {
  return `${value * theme.layout.verticalRhythm}rem`;
}
