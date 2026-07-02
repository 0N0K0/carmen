import { type MantineTheme } from '@mantine/core';

export interface ColumnSpanProps {
  columns: number;
  options?: {
    mode?: 'fixed' | 'fluid';
    paddingX?: number;
  };
  theme: MantineTheme;
}

/**
 * Permet de calculer la largeur totale d'une colonne ou d'un ensemble de colonnes en fonction du nombre de colonnes spécifié, du mode de calcul (fixe ou fluide) et des options de padding horizontal.
 * - En mode "fixed", la largeur est calculée en multipliant le nombre de colonnes par la largeur de chaque colonne, en ajoutant les gaps entre les colonnes et les padding horizontaux.
 * - En mode "fluid", la largeur est calculée pour chaque breakpoint en utilisant une formule qui prend en compte la largeur totale disponible (100vw), les padding horizontaux, les gaps entre les colonnes, et le nombre total de colonnes à ce breakpoint. Le résultat est une largeur responsive qui s'adapte à la taille de l'écran.
 * @param {number} props.columns Le nombre de colonnes à inclure dans le span.
 * @param {"fixed" | "fluid"} [props.options.mode="fluid"] Le mode de calcul de la largeur, soit "fixed" pour une largeur fixe basée sur les dimensions des colonnes, soit "fluid" pour une largeur responsive basée sur les breakpoints.
 * @param {number} [props.options.paddingX=0] Le padding horizontal à ajouter de chaque côté du span, en rem.
 * @param {MantineTheme} props.theme Le thème contenant la configuration du layout, nécessaire pour accéder aux dimensions des colonnes et aux breakpoints.
 * @returns {number | Record<string, number | string>} La largeur calculée en rem pour le mode "fixed", ou un objet contenant les largeurs pour chaque breakpoint en mode "fluid".
 */
export function columnSpan({
  columns,
  options = {},
  theme,
}: ColumnSpanProps): number | Record<string, number | string> {
  const { mode = 'fluid', paddingX = 0 } = options;

  if (mode === 'fixed') {
    return (
      columns * theme.layout.columnWidth +
      (columns - 1) * theme.layout.columnGap +
      paddingX * 2
    );
  }

  let currentPaddingX = theme.layout.paddingX.xs;

  return Object.fromEntries(
    Object.entries(theme.layout.columns).map(([breakpoint, totalColumns]) => {
      const bp = breakpoint as keyof typeof theme.layout.paddingX;
      if (theme.layout.paddingX[bp] !== undefined) {
        currentPaddingX = theme.layout.paddingX[bp]!;
      }

      const columnSize = `(
          (100vw
            - ${currentPaddingX * theme.scale * 2}rem
            - ${(totalColumns - 1) * theme.layout.columnGap * theme.scale}rem
          ) / ${totalColumns}
        )`;

      return [
        breakpoint,
        `calc(${columns} * ${columnSize} + ${
          (columns - 1) * theme.layout.columnGap * theme.scale
        }rem + ${paddingX * 2 * theme.scale}rem)`,
      ];
    }),
  );
}

export type RowSnapMode =
  | 'marginY'
  | 'marginTop'
  | 'marginBottom'
  | 'padding'
  | 'expand';

export interface RowSpanProps {
  rem: number;
  mode?: RowSnapMode;
  theme: MantineTheme;
}

/**
 * Permet de calculer la hauteur totale d'une ligne ou d'un ensemble de lignes en fonction du nombre de rem spécifié et du mode de snapping.
 * - En mode "expand", la hauteur est arrondie au multiple le plus proche du rythme vertical.
 * - En mode "padding", la hauteur est conservée et des padding sont ajoutés pour atteindre le rythme vertical.
 * - En mode "marginY", la hauteur est conservée et des marges sont ajoutées pour atteindre le rythme vertical.
 * - En mode "marginTop", la hauteur est conservée et une marge est ajoutée en haut pour atteindre le rythme vertical.
 * - En mode "marginBottom", la hauteur est conservée et une marge est ajoutée en bas pour atteindre le rythme vertical.
 * @param {number} props.rem La hauteur en rem à convertir en unités de rythme vertical.
 * @param {RowSnapMode} [props.mode="expand"] Le mode de snapping à utiliser.
 * @param {MantineTheme} props.theme Le thème contenant la configuration du rythme vertical.
 * @returns {Record<string, string>} Un objet contenant les styles CSS pour la hauteur et les marges/paddings en fonction du mode de snapping.
 */
export function rowSpan({
  rem,
  mode = 'expand',
  theme,
}: RowSpanProps): Record<string, string> {
  const snapped =
    Math.ceil(rem / theme.layout.verticalRhythm) * theme.layout.verticalRhythm;

  const diff = snapped - rem;
  const half = diff / 2;

  const strategies: Record<RowSnapMode, () => any> = {
    expand: () => ({
      height: `${snapped * theme.scale}rem`,
    }),

    padding: () => ({
      height: `${rem * theme.scale}rem`,
      paddingTop: `${half * theme.scale}rem`,
      paddingBottom: `${half * theme.scale}rem`,
    }),

    marginY: () => ({
      height: `${rem * theme.scale}rem`,
      marginTop: `${half * theme.scale}rem`,
      marginBottom: `${half * theme.scale}rem`,
    }),

    marginTop: () => ({
      height: `${rem * theme.scale}rem`,
      marginTop: `${diff * theme.scale}rem`,
    }),

    marginBottom: () => ({
      height: `${rem * theme.scale}rem`,
      marginBottom: `${diff * theme.scale}rem`,
    }),
  };

  return strategies[mode]();
}

export type LayoutContext = {
  theme: MantineTheme;
  startOffset?: number;
  endOffset?: number;
  offset?: number;
  max?: boolean;
};

/**
 * Permet de calculer les styles de largeur et de marge pour les éléments en pleine largeur, en tenant compte des offsets et d'une option de largeur maximale.
 * - La largeur est calculée en soustrayant les offsets (startOffset et endOffset) de 100vw, avec une option pour limiter la largeur à une valeur maximale définie dans la configuration du thème (maxFullWidth).
 * - La marge gauche est calculée pour centrer l'élément en utilisant la largeur calculée.
 * @param {number} [props.startOffset=0] L'offset en rem à soustraire du côté gauche de l'élément.
 * @param {number} [props.endOffset=0] L'offset en rem à soustraire du côté droit de l'élément.
 * @param {boolean} [props.max=true] Indique si la largeur doit être limitée à une valeur maximale définie dans la configuration du thème.
 * @returns {Object} Un objet contenant les styles CSS pour la largeur et la marge gauche de l'élément en pleine largeur.
 */
export function fullWidth({
  theme,
  startOffset = 0,
  endOffset = 0,
  max = true,
}: LayoutContext): {
  width: string;
  marginLeft: string;
} {
  const totalOffset = startOffset + endOffset;
  const width = max
    ? `min(calc(100vw - ${totalOffset * theme.scale}rem), ${theme.layout.maxFullWidth * theme.scale}rem)`
    : `calc(100vw - ${totalOffset * theme.scale}rem)`;
  return {
    width,
    marginLeft: `calc(50% - (${width}) / 2)`,
  };
}

/**
 * Permet de calculer la hauteur d'un élément en pleine hauteur, en tenant compte de l'offset et d'une option de hauteur maximale.
 * - La hauteur est calculée en soustrayant l'offset de 100vh, avec une option pour limiter la hauteur à une valeur maximale définie dans la configuration du thème (maxFullHeight).
 * @param {number} [props.offset=0] L'offset en rem à soustraire de l'élément.
 * @param {boolean} [props.max=true] Indique si la hauteur doit être limitée à une valeur maximale définie dans la configuration du thème.
 * @returns {string} La hauteur calculée pour l'élément en pleine hauteur.
 */
export function fullHeight({
  theme,
  offset = 0,
  max = true,
}: LayoutContext): string {
  return max
    ? `min(calc(100vh - ${offset * theme.scale}rem), ${theme.layout.maxFullHeight * theme.scale}rem)`
    : `calc(100vh - ${offset * theme.scale}rem)`;
}
