/**
 * Génère un objet de variables CSS à partir d'un objet de typographie donné.
 * @param {Record<string, any>} typography L'objet de typographie à parcourir pour générer les variables CSS.
 * @returns {Record<string, string>} Un objet contenant les variables CSS générées, où les clés sont les noms des variables CSS et les valeurs sont les valeurs correspondantes extraites de l'objet de typographie.
 */
export function createTypographyVariables(
  typography: Record<string, any>,
): Record<string, string> {
  const result: Record<string, string> = {};

  /**
   * Visite l'objet de manière récursive pour trouver les tokens de typographie et générer les variables CSS correspondantes.
   * @param {Record<string, any>} obj L'objet de typographie à parcourir pour générer les variables CSS.
   * @param {string[]} [path=[]] Le chemin d'accès actuel dans l'objet, utilisé pour construire les noms de variables CSS.
   */
  function visit(obj: Record<string, any>, path: string[] = []) {
    const isTypographyToken =
      obj && typeof obj === 'object' && 'fontFamily' in obj;

    if (isTypographyToken) {
      const prefix = `--onoko-${path.join('-')}`;

      result[`${prefix}-font-family`] = obj.fontFamily;
      result[`${prefix}-font-weight`] = obj.fontWeight ?? 'normal';
      result[`${prefix}-font-style`] = obj.fontStyle ?? 'normal';
      result[`${prefix}-letter-spacing`] = obj.letterSpacing ?? 'normal';
      result[`${prefix}-text-transform`] = obj.textTransform ?? 'none';

      return;
    }

    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === 'object') {
        visit(value, [...path, key]);
      }
    }
  }

  visit(typography);

  return result;
}
