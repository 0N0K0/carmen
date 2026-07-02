import { convertCase } from './text.utils';

/**
 * Génère un objet de variables CSS à partir d'un objet de valeurs, en préfixant les noms des variables avec un préfixe spécifié.
 * @param {Record<string, string>} values Un objet contenant les paires clé-valeur à convertir en variables CSS.
 * @param {string} variablePrefix Le préfixe à ajouter au début de chaque nom de variable CSS généré.
 * @returns {Record<string, string>} Un objet contenant les variables CSS générées, où chaque clé est le nom de la variable CSS (préfixé) et chaque valeur est la valeur correspondante de l'objet d'entrée.
 */
export function createCssVariables(
  values: Record<string, string>,
  variablePrefix: string,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      `${variablePrefix}-${convertCase(key, 'kebab')}`,
      value,
    ]),
  );
}
