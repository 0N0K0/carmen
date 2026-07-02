/**
 * Convertit une chaîne de caractères en un tableau de mots, en gérant les différentes conventions de nommage et les séparateurs courants.
 * @param {string} str La chaîne de caractères d'entrée à tokeniser.
 * @returns {string[]} Un tableau de mots extraits de la chaîne d'entrée.
 */
function tokenize(str: string): string[] {
  return str
    .replace(/\.[^/.]+$/, '') // extension
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_\-.]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export type CaseConvention =
  | 'display'
  | 'camel'
  | 'pascal'
  | 'kebab'
  | 'snake'
  | 'upper-snake';

/**
 * Convertit une chaîne de caractères en une convention de nommage spécifiée.
 * @param {string} str La chaîne de caractères d'entrée à convertir.
 * @param {CaseConvention} convention La convention de nommage cible pour la conversion.
 * @returns {string} La chaîne convertie selon la convention spécifiée.
 */
export function convertCase(str: string, convention: CaseConvention): string {
  const words = tokenize(str);

  switch (convention) {
    case 'display':
      return words
        .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

    case 'camel':
      return words
        .map((word, index) =>
          index === 0
            ? word.toLowerCase()
            : word[0].toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join('');

    case 'pascal':
      return words
        .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
        .join('');

    case 'kebab':
      return words.map((word) => word.toLowerCase()).join('-');

    case 'snake':
      return words.map((word) => word.toLowerCase()).join('_');

    case 'upper-snake':
      return words.map((word) => word.toUpperCase()).join('_');

    default:
      return str;
  }
}
