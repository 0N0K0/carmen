import { AppShell } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { useLayoutStore } from '../../store/layout';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

const HEADER_HEIGHT = 64;  // 64px ≈ 2.67 × 24px (tolérance ±12px accordée aux éléments fixes)
const FOOTER_HEIGHT = 96;  // 96px = 4 × 24px

/**
 * Layout principal de l'application.
 *
 * Compose l'AppShell Mantine avec TopBar, Sidebar et Footer, et rend la
 * zone de contenu principale via `<Outlet />` (React Router).
 *
 * La largeur de la sidebar est pilotée par `useLayoutStore`.
 * La sidebar n'est jamais entièrement masquée : sa largeur minimale est
 * `SIDEBAR_WIDTH_MIN` (vue réduite).
 *
 * @returns {JSX.Element} Structure AppShell complète.
 */
export function AppLayout() {
  const sidebarWidth = useLayoutStore((s) => s.sidebarWidth);

  return (
    <AppShell
      header={{ height: HEADER_HEIGHT }}
      navbar={{
        width: sidebarWidth,
        breakpoint: 'sm',
        collapsed: { mobile: true, desktop: false },
      }}
      footer={{ height: FOOTER_HEIGHT }}
      padding={0}
    >
      <TopBar />
      <Sidebar />
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
      <Footer />
    </AppShell>
  );
}
