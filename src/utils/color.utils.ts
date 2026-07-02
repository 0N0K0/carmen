import {
  luminance,
  parseThemeColor,
  type MantineColor,
  type MantineGradient,
  type MantineTheme,
} from '@mantine/core';
import { getColorScheme } from '../theme/palette/palette.utils';

/**
 * Récupère le contraste de couleur en fonction du thème, de la variante, de la couleur ou du gradient.
 * @param {MantineTheme} props.theme Le thème Mantine.
 * @param {("gradient" | "filled")} props.variant La variante du composant (gradient ou filled).
 * @param {MantineColor} [props.color] La couleur du composant (optionnelle).
 * @param {MantineGradient} [props.gradient] Le gradient du composant (optionnel).
 * @returns {string} La couleur de contraste (noir ou blanc) en fonction des paramètres.
 */
export function getContrastColor({
  theme,
  variant,
  color,
  gradient,
  autoContrast,
}: {
  theme: MantineTheme;
  variant: 'gradient' | 'filled';
  color?: MantineColor;
  gradient?: MantineGradient;
  autoContrast?: boolean;
}): string {
  const colorScheme = getColorScheme();

  const defaultColor =
    theme.colors[theme.primaryColor][
      typeof theme.primaryShade === 'object'
        ? theme.primaryShade[colorScheme]
        : theme.primaryShade
    ];

  const parsedDefaultColor = parseThemeColor({
    color: defaultColor,
    theme,
    colorScheme,
  });

  const parsedColor = parseThemeColor({
    color: color || defaultColor,
    theme,
    colorScheme,
  });

  const _autoContrast =
    typeof autoContrast === 'boolean' ? autoContrast : theme.autoContrast;

  if (!_autoContrast) {
    return parsedDefaultColor.isLight
      ? 'var(--mantine-color-black)'
      : 'var(--mantine-color-white)';
  }

  if (variant === 'gradient') {
    const parsedFrom = parseThemeColor({
      color: gradient?.from || theme.defaultGradient.from,
      theme,
      colorScheme,
    });
    const parsedTo = parseThemeColor({
      color: gradient?.to || theme.defaultGradient.to,
      theme,
      colorScheme,
    });

    if (parsedFrom.isLight !== parsedTo.isLight) {
      const fromLuminance = luminance(parsedFrom.value);
      const toLuminance = luminance(parsedTo.value);
      const mediumLuminance = (fromLuminance + toLuminance) / 2;

      return mediumLuminance > theme.luminanceThreshold
        ? 'var(--mantine-color-black)'
        : 'var(--mantine-color-white)';
    }

    return parsedFrom.isLight
      ? 'var(--mantine-color-black)'
      : 'var(--mantine-color-white)';
  }

  return parsedColor.isLight
    ? 'var(--mantine-color-black)'
    : 'var(--mantine-color-white)';
}
