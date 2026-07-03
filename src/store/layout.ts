import { create } from 'zustand';

/** Vue réduite — icônes uniquement. Premier taquet. */
export const SIDEBAR_WIDTH_REDUCED = 72;
/** Largeur minimale en vue normale. Second taquet. En dessous, saute à SIDEBAR_WIDTH_REDUCED. */
export const SIDEBAR_WIDTH_NORMAL_MIN = 280;
/** Largeur minimale du contenu principal. Définit le taquet haut de la sidebar. */
export const MAIN_CONTENT_MIN_WIDTH = 400;
/** Seuil de bascule entre les deux premiers taquets (milieu de l'intervalle). */
const SNAP_THRESHOLD = (SIDEBAR_WIDTH_REDUCED + SIDEBAR_WIDTH_NORMAL_MIN) / 2; // 176

/**
 * Snappe la largeur brute issue du drag vers le taquet approprié.
 *
 * Ordre de priorité :
 * 1. Au-dessus de maxWidth → taquet haut (maxWidth). Vérifié en premier pour
 *    éviter qu'un saut vers SIDEBAR_WIDTH_NORMAL_MIN dépasse la contrainte.
 * 2. En dessous du seuil → taquet réduit (72 px).
 * 3. Entre le seuil et 280 → taquet normal minimum (280 px).
 * 4. Entre 280 et maxWidth → valeur libre.
 *
 * @param {number} width Largeur brute issue du drag.
 * @param {number} [maxWidth] Taquet haut dynamique (viewport − MAIN_CONTENT_MIN_WIDTH).
 * @returns {number} Largeur snappée.
 */
export function snapSidebarWidth(width: number, maxWidth = Infinity): number {
  if (width > maxWidth) return maxWidth;
  if (width < SNAP_THRESHOLD) return SIDEBAR_WIDTH_REDUCED;
  if (width < SIDEBAR_WIDTH_NORMAL_MIN) return SIDEBAR_WIDTH_NORMAL_MIN;
  return width;
}

interface LayoutState {
  sidebarWidth: number;
  sidebarFullPage: boolean;
  setSidebarWidth: (width: number) => void;
  setSidebarFullPage: (v: boolean) => void;
}

/**
 * Store global pour l'état du layout de l'application.
 * @returns {LayoutState} État et actions pour contrôler la sidebar.
 */
export const useLayoutStore = create<LayoutState>()((set) => ({
  sidebarWidth: SIDEBAR_WIDTH_NORMAL_MIN,
  sidebarFullPage: false,
  setSidebarWidth: (width) => set({ sidebarWidth: width }),
  setSidebarFullPage: (v) => set({ sidebarFullPage: v }),
}));
