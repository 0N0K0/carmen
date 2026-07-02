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

declare module '@mantine/core' {
  /**
   * Étend les échelles de tailles Mantine avec les variantes du projet.
   * - fontSizes / lineHeights : ajoute `xxs`
   * - fontWeights : remplace les 3 poids par défaut par l'échelle complète
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
  }

  /**
   * Étend MantineTheme avec les familles de polices, échelles de heading
   * et la carte des rôles typographiques du projet.
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
  }
}
