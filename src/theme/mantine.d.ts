import type { Layout } from './layout/layout.types';

export {};

/** Un token de style typographique. */
type TypographyToken = {
  fontFamily: string;
  fontWeight?: string;
  fontStyle?: string;
  letterSpacing?: string;
  textTransform?: string;
};

/** Échelle de tailles/hauteurs de ligne pour les headings (sm → xxl). */
type HeadingSizeScale = {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
};

/** Rôles typographiques nommés et leurs tokens de style associés. */
type ThemeTypography = {
  core: {
    body: TypographyToken;
    subtitle: TypographyToken;
  };
  interface: {
    heading: TypographyToken;
    meta: TypographyToken;
    accent: TypographyToken;
  };
};

/** Opacités sémantiques pour les états UI et le texte. */
type ThemeOpacities = {
  text: {
    /** Texte principal. */
    primary: number;
    /** Texte secondaire. */
    secondary: number;
    /** Texte désactivé. */
    disabled: number;
  };
  /** Séparateurs et dividers. */
  divider: number;
  states: {
    hover: number;
    selected: number;
    disabled: number;
    focus: number;
    active: number;
  };
};

/** Fonctions de temporisation et durées pour les transitions CSS. */
type ThemeTransitions = {
  easing: {
    easeInOut: string;
    easeOut: string;
    easeIn: string;
    sharp: string;
  };
  duration: {
    shorter: string;
    short: string;
    standard: string;
    long: string;
    complex: string;
    enteringScreen: string;
    leavingScreen: string;
  };
};

declare module '@mantine/core' {
  /**
   * Étend les échelles de tailles Mantine avec les variantes du projet.
   * - fontSizes / lineHeights : ajoute `xxs`
   * - fontWeights : remplace les 3 poids par défaut par l'échelle complète
   * - breakpoints : ajoute `xxl`
   * - spacing : ajoute `xxl`
   * - shadows : ajoute `xxs` et `xxl`
   */
  interface MantineThemeSizesOverride {
    fontSizes: Record<'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl', string>;
    lineHeights: Record<'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl', string>;
    fontWeights: Record<
      | 'thin'
      | 'extralight'
      | 'light'
      | 'regular'
      | 'medium'
      | 'semibold'
      | 'bold'
      | 'extrabold'
      | 'black',
      string
    >;
    breakpoints: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl', string>;
    spacing: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl', string>;
    shadows: Record<'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl', string>;
  }

  /**
   * Étend MantineTheme avec les propriétés custom du projet :
   * typographie, palette, layout, transitions.
   */
  interface MantineTheme {
    /** Roboto Condensed — headings et labels UI. */
    fontFamilyInterface: string;
    /** Parisienne — texte d'accentuation décoratif. */
    fontFamilyAccent: string;
    /** Échelle de tailles de police pour les headings (sm → xxl), séparée de `headings.sizes`. */
    headingFontSizes: HeadingSizeScale;
    /** Échelle de hauteurs de ligne pour les headings (sm → xxl), séparée de `headings.sizes`. */
    headingLineHeights: HeadingSizeScale;
    /** Rôles typographiques nommés et leurs tokens de style. */
    typography: ThemeTypography;
    /** Opacités sémantiques pour les états UI et le texte. */
    opacities: ThemeOpacities;
    /** Configuration du système de grille et des rythmes horizontal/vertical. */
    layout: Layout;
    /** Breakpoints de hauteur (xs, sm, md) en rem. */
    heightBreakpoints: Partial<Record<string, string>>;
    /** Taille de police racine en px, utilisée pour les conversions rem ↔ px. */
    fontSize: number;
    /** Rapport entre la taille de police racine du projet et celle de Mantine (16px). */
    scale: number;
    /** Fonctions de temporisation et durées pour les transitions CSS. */
    transitions: ThemeTransitions;
    /** Mode de ripple au focus : 'focus' (défaut) ou 'activity'. */
    focusRippleMode: 'focus' | 'activity';
  }
}
