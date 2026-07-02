import { type MantineTheme } from '@mantine/core';
import { toNumberRem } from './dimension.utils';

export interface GetQueryStringProps {
  axis: 'width' | 'height';
  value:
    | string
    | number
    | {
        min: string | number;
        max: string | number;
      };
  operator?: 'up' | 'down' | 'between' | 'only' | 'not';
  theme: MantineTheme;
}

/**
 * Génère une chaîne de requête média CSS basée sur les paramètres fournis, en utilisant les breakpoints définis dans le thème.
 * @param {"width" | "height"} params.axis L'axe pour lequel générer la requête (largeur ou hauteur).
 * @param {string | number | { min: string | number; max: string | number }} params.value La valeur ou les valeurs de dimension à utiliser pour la requête. Peut être une valeur de breakpoint du thème, une chaîne avec des unités, un nombre représentant des pixels, ou un objet avec des propriétés "min" et "max".
 * @param {"up" | "down" | "between" | "only" | "not"} [params.operator="down"] L'opérateur à utiliser pour la requête média. Défaut = "down".
 * @param {MantineTheme} params.theme Le thème Mantine à utiliser pour résoudre les breakpoints et les valeurs de dimension.
 * @returns {string} La chaîne de requête média CSS générée.
 * @throws {Error} Si les paramètres sont invalides ou si les unités ne sont pas prises en charge.
 */
export function getQueryString({
  axis,
  value,
  operator = 'down',
  theme,
}: GetQueryStringProps): string {
  let resolvedValue: number | { min: number; max: number };

  const resolveOne = (v: string | number): number => {
    const heightBp = axis === 'height' && typeof v === 'string' ? theme.heightBreakpoints[v] : undefined;
    return toNumberRem({ value: heightBp ?? v, rootFontSize: theme.fontSize, theme });
  };

  if (typeof value === 'object') {
    resolvedValue = {
      min: resolveOne(value.min),
      max: resolveOne(value.max),
    };
  } else {
    resolvedValue = resolveOne(value);
  }

  const allValues = (
    Object.values(axis === 'width' ? theme.breakpoints : theme.heightBreakpoints) as string[]
  ).map((v) => toNumberRem({ value: v, rootFontSize: theme.fontSize, theme }));

  let previousValue = 0;

  if (typeof resolvedValue === 'number') {
    const smaller = allValues.filter((v) => v < resolvedValue);
    previousValue = smaller.length > 0 ? Math.max(...smaller) : 0;
  }

  let query = '';

  const min = `(min-${axis}: ${resolvedValue}rem)`;
  const max = `(max-${axis}: calc(${resolvedValue}rem - 0.5px))`;

  switch (operator) {
    case 'up':
      query = min;
      break;
    case 'down':
      query = max;
      break;
    case 'between':
      if (typeof resolvedValue === 'object') {
        query = `(min-${axis}: ${resolvedValue.min}rem) and (max-${axis}: calc(${resolvedValue.max}rem - 0.5px))`;
      }
      break;
    case 'only':
      if (typeof resolvedValue === 'number') {
        query = previousValue > 0
          ? `(min-${axis}: ${previousValue}rem) and ${max}`
          : max;
      }
      break;
    case 'not':
      if (typeof resolvedValue === 'number') {
        query = previousValue > 0
          ? `(max-${axis}: calc(${previousValue}rem - 0.5px)), ${min}`
          : min;
      }
      break;
  }

  return query;
}
