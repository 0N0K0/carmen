import { useLayoutEffect, useState } from 'react';

/**
 * Calcule la hauteur et la largeur disponibles dans un élément `main`, en tenant compte de ses padding et de la largeur de la scrollbar.
 * Utilise un `ResizeObserver` pour mettre à jour les dimensions lorsque la taille de l'élément `main` change, ainsi qu'un écouteur d'événements pour les redimensionnements de la fenêtre.
 * @returns {{ fullHeight: string, fullWidth: string }} Un objet contenant `fullHeight` et `fullWidth`, qui sont des chaînes de caractères représentant les dimensions calculées en utilisant `calc()`.
 */
export function useFullViewportSize(querySelector: string = 'main'): {
  fullHeight: string;
  fullWidth: string;
} {
  const [size, setSize] = useState({
    fullHeight: '0',
    fullWidth: '0',
  });

  useLayoutEffect(() => {
    const el: HTMLElement | null = document.querySelector(querySelector);
    if (!el) {
      return;
    }

    const getScrollbarWidth = () => {
      return window.innerWidth - document.documentElement.clientWidth;
    };

    const getPadding = () => {
      const style = getComputedStyle(el);
      return {
        x: parseFloat(style.paddingLeft) + parseFloat(style.paddingRight),
        y: parseFloat(style.paddingTop) + parseFloat(style.paddingBottom),
      };
    };

    const update = () => {
      const { x, y } = getPadding();

      setSize({
        fullWidth: `calc(100dvw - ${x}px - ${getScrollbarWidth()}px)`,
        fullHeight: `calc(100dvh - ${y}px)`,
      });
    };

    const observer = new ResizeObserver(update);
    observer.observe(el);

    update();

    return () => {
      observer.disconnect();
    };
  }, [querySelector]);

  return size;
}
