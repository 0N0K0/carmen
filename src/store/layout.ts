import { create } from 'zustand';

/** Vue réduite — icônes uniquement. Premier taquet. */
export const SIDEBAR_WIDTH_REDUCED = 72;
/** Largeur minimale en vue normale. Second taquet. En dessous, saute à SIDEBAR_WIDTH_REDUCED. */
export const SIDEBAR_WIDTH_NORMAL_MIN = 280;
/** Seuil de bascule entre les deux taquets (milieu de l'intervalle). */
const SNAP_THRESHOLD = (SIDEBAR_WIDTH_REDUCED + SIDEBAR_WIDTH_NORMAL_MIN) / 2; // 176

/**
 * Snappe la largeur brute issue du drag vers le taquet approprié.
 *
 * - En dessous du seuil → taquet réduit (72 px).
 * - Entre le seuil et 280 → taquet normal minimum (280 px).
 * - Au-dessus de 280 → valeur libre conservée.
 *
 * @param {number} width Largeur brute issue du drag.
 * @returns {number} Largeur snappée.
 */
export function snapSidebarWidth(width: number): number {
  if (width < SNAP_THRESHOLD) return SIDEBAR_WIDTH_REDUCED;
  if (width < SIDEBAR_WIDTH_NORMAL_MIN) return SIDEBAR_WIDTH_NORMAL_MIN;
  return width;
}

interface LayoutState {
  sidebarWidth: number;
  setSidebarWidth: (width: number) => void;
}

/**
 * Store global pour l'état du layout de l'application.
 * @returns {LayoutState} État et actions pour contrôler la sidebar.
 */
export const useLayoutStore = create<LayoutState>()((set) => ({
  sidebarWidth: SIDEBAR_WIDTH_NORMAL_MIN,
  setSidebarWidth: (width) => set({ sidebarWidth: width }),
}));
