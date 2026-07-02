import {
  alpha,
  lighten,
  type MantineColorsTuple,
  type MantineTheme,
} from '@mantine/core';
import chroma from 'chroma-js';
import { createPalette } from './palette.utils';

// Teintes de base
export const HUES: Record<string, number> = {
  red: 10, // natif
  deepOrange: 20,
  orange: 30, // natif
  amber: 40,
  yellow: 50, // natif
  lime: 70, // natif
  green: 110, // natif
  teal: 150, // natif
  cyan: 170, // natif
  lightBlue: 190,
  blue: 210, // natif
  indigo: 250, // natif
  violet: 270, // natif
  grappe: 290, // natif
  fuchsia: 310,
  pink: 330, // natif
  strawberry: 350,
};

// Génération des couleurs à partir des teintes
export const COLORS: Record<string, string> = {};
for (const [color, hue] of Object.entries(HUES)) {
  const hslColor = `hsl(${hue} 70% 50%)`;
  COLORS[color] = chroma(hslColor).hex();
}

const palette: Record<string, MantineColorsTuple> = {};
for (const [key, value] of Object.entries(COLORS)) {
  palette[key] = createPalette({ value }) as MantineColorsTuple;
}
const gray = chroma('hsl(210 10% 50%)').hex();

const darkElevations = createPalette({
  value: chroma('hsl(210 10% 20%)').hex(),
  valueStop: 100,
  colorMode: 'linear',
  steps: [100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
}) as Array<string>;
darkElevations.reverse();

const colors: Record<string, MantineColorsTuple> = {
  ...palette,
  golden: createPalette({ value: '#A68659' }) as MantineColorsTuple,
  gray: createPalette({
    value: gray,
    colorMode: 'linear',
  }) as MantineColorsTuple,
  dark: createPalette({
    value: gray,
    colorMode: 'linear',
    lMax: 80,
  }) as MantineColorsTuple,
  darkElevations: darkElevations as unknown as MantineColorsTuple,
  core: createPalette({ value: '#0DB9F2' }) as MantineColorsTuple,
  support: createPalette({ value: '#4DB2A1' }) as MantineColorsTuple,
  get accent() {
    return this.golden;
  },
  get info() {
    return this.lightBlue;
  },
  get success() {
    return this.lime;
  },
  get warning() {
    return this.amber;
  },
  get error() {
    return this.red;
  },
};

const opacities = {
  text: {
    primary: 0.9,
    secondary: 0.6,
    disabled: 0.4,
  },
  divider: 0.15,
  states: {
    hover: 0.05,
    selected: 0.1,
    disabled: 0.15,
    focus: 0.15,
    active: 0.15,
  },
};

export const COLOR_CONFIG = {
  colors,
  primaryShade: { light: 5, dark: 6 } as const,
  primaryColor: 'core',
  autoContrast: true,
  defaultGradient: {
    from: 'core',
    to: 'support',
    deg: 135,
  },
  opacities,
};

export const COLOR_SCHEME_PALETTE_RESOLVER = (
  theme: MantineTheme,
): {
  light: Record<string, string>;
  dark: Record<string, string>;
} => {
  const baseShade = (scheme: 'light' | 'dark') =>
    typeof theme.primaryShade === 'object'
      ? theme.primaryShade[scheme]
      : theme.primaryShade;

  /**
   * Génère les variables CSS pour la variante "filled" d'une couleur donnée
   * @param {string} color Le nom de la couleur (ex: "red", "blue", etc.)
   * @param {MantineColorsTuple} shades Les différentes nuances de la couleur
   * @param {"light" | "dark"} scheme Le schéma de couleurs (clair ou sombre)
   * @returns {Record<string, string>} Un objet contenant les variables CSS pour la variante "filled"
   */
  const getFilledVars = (
    color: string,
    shades: MantineColorsTuple,
    scheme: 'light' | 'dark',
  ): Record<string, string> => {
    const base = baseShade(scheme);

    const offset = (shade: number, dir: number): number => {
      const offset = shade >= 5 ? shade + dir : shade - dir;
      if (offset < 0) {
        return 0;
      }
      if (offset > shades.length - 1) {
        return shades.length - 1;
      }
      return offset;
    };

    return {
      [`--mantine-color-${color}-filled`]: shades[base],
      [`--mantine-color-${color}-filled-hover`]: shades[offset(base, -1)],
      [`--onoko-color-${color}-filled-focus`]:
        scheme === 'dark'
          ? alpha(shades[offset(base, -2)], 0.3)
          : shades[offset(base, -2)],
      [`--onoko-color-${color}-filled-touch`]:
        scheme === 'dark'
          ? alpha(shades[base >= 5 ? 1 : 7], 0.6)
          : shades[base >= 5 ? 1 : 7],
    };
  };

  /**
   * Génère les variables CSS pour la variante "outline" d'une couleur donnée
   * @param {string} color Le nom de la couleur (ex: "red", "blue", etc.)
   * @param {MantineColorsTuple} shades Les différentes nuances de la couleur
   * @param {"light" | "dark"} scheme Le schéma de couleurs (clair ou sombre)
   * @returns {Record<string, string>} Un objet contenant les variables CSS pour la variante "outline"
   */
  const getOutlineVars = (
    color: string,
    shades: MantineColorsTuple,
    scheme: 'light' | 'dark',
  ): Record<string, string> => {
    return {
      [`--mantine-color-${color}-outline`]:
        scheme === 'light' ? shades[6] : shades[4],
      [`--mantine-color-${color}-outline-hover`]: alpha(
        shades[scheme === 'light' ? 5 : 4],
        0.1,
      ),
      [`--onoko-color-${color}-outline-focus`]: alpha(shades[5], 0.2),
      [`--onoko-color-${color}-outline-touch`]: alpha(shades[5], 0.6),
    };
  };

  /**
   * Génère les variables CSS pour la variante "light" d'une couleur donnée
   * @param {string} color Le nom de la couleur (ex: "red", "blue", etc.)
   * @param {MantineColorsTuple} shades Les différentes nuances de la couleur
   * @param {"light" | "dark"} scheme Le schéma de couleurs (clair ou sombre)
   * @returns {Record<string, string>} Un objet contenant les variables CSS pour la variante "light"
   */
  const getLightVars = (
    color: string,
    shades: MantineColorsTuple,
    scheme: 'light' | 'dark',
  ): Record<string, string> => {
    if (scheme === 'light') {
      return {
        [`--mantine-color-${color}-light-color`]: shades[8],
        [`--onoko-color-${color}-light-focus`]: alpha(shades[4], 0.3),
        [`--onoko-color-${color}-light-touch`]: alpha(shades[4], 0.6),
      };
    }

    return {
      [`--mantine-color-${color}-light`]: shades[9],
      [`--mantine-color-${color}-light-hover`]: shades[8],
      [`--onoko-color-${color}-light-focus`]: alpha(shades[7], 0.3),
      [`--onoko-color-${color}-light-touch`]: alpha(shades[1], 0.6),
    };
  };

  /**
   * Génère les variables CSS pour la variante "white" d'une couleur donnée
   * @param {string} color Le nom de la couleur (ex: "red", "blue", etc.)
   * @param {MantineColorsTuple} shades Les différentes nuances de la couleur
   * @returns {Record<string, string>} Un objet contenant les variables CSS pour la variante "white"
   */
  const getWhiteVars = (
    color: string,
    shades: MantineColorsTuple,
  ): Record<string, string> => {
    return {
      [`--onoko-color-${color}-white-hover`]: alpha(shades[0], 0.4),
    };
  };

  /**
   * Génère les variables CSS pour les couleurs de base et les états génériques.
   * @param {MantineTheme} theme Le thème Mantine pour accéder aux couleurs et à la configuration
   * @param {"light" | "dark"} scheme Le schéma de couleurs (clair ou sombre)
   * @returns {[key: string]: string} Un objet contenant les variables CSS pour les couleurs de base et les états génériques
   */
  const getDefaultVars = (
    theme: MantineTheme,
    scheme: 'light' | 'dark',
  ): {
    [key: string]: string;
  } => {
    if (scheme === 'light') {
      return {
        '--mantine-color-disabled': alpha(theme.colors.gray[5], 0.1),
        '--mantine-color-disabled-color': theme.colors.gray[5],

        '--mantine-color-default-hover': lighten(theme.colors.gray[0], 0.5),
        '--onoko-color-default-focus': theme.colors.gray[2],
        '--onoko-color-default-touch': theme.colors.gray[3],
      };
    }
    return {
      '--mantine-color-disabled': alpha(theme.colors.dark[5], 0.1),
      '--mantine-color-disabled-color': theme.colors.dark[5],

      '--mantine-color-default': theme.colors.dark[9],
      '--mantine-color-default-hover': theme.colors.dark[8],
      '--mantine-color-default-border': theme.colors.dark[9],
      '--onoko-color-default-focus': theme.colors.dark[6],
      '--onoko-color-default-touch': theme.colors.gray[0],
    };
  };

  /**
   * Génère les variables CSS pour toutes les couleurs et variantes d'un schéma de couleurs donné
   * @param {"light" | "dark"} scheme Le schéma de couleurs (clair ou sombre)
   * @returns {Record<string, string>} Un objet contenant toutes les variables CSS pour les couleurs et variantes du schéma donné
   */
  const buildScheme = (scheme: 'light' | 'dark'): Record<string, string> => {
    return {
      ...getDefaultVars(theme, scheme),

      ...Object.fromEntries(
        Object.entries(theme.colors).flatMap(([color, shades]) => [
          ...Object.entries(getFilledVars(color, shades, scheme)),
          ...Object.entries(getOutlineVars(color, shades, scheme)),
          ...Object.entries(getLightVars(color, shades, scheme)),
          ...Object.entries(getWhiteVars(color, shades)),
        ]),
      ),
    };
  };

  return {
    light: buildScheme('light'),
    dark: buildScheme('dark'),
  };
};
