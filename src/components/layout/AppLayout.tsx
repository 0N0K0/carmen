import { AppShell } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { useLayoutStore } from '../../store/layout';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

const HEADER_HEIGHT = 64;   // 64px ≈ 2.67 × 24px — aligné grille verticale (±12px tolerance)
const FOOTER_HEIGHT = 96;   // 96px = 4 × 24px
const NAVBAR_WIDTH = 280;   // largeur sidebar développée
const NAVBAR_WIDTH_COLLAPSED = 0; // sidebar repliée disparaît

/**
 * Layout principal de l'application.
 *
 * Compose l'AppShell Mantine avec TopBar, Sidebar et Footer, et rend la
 * zone de contenu principale via `<Outlet />` (React Router).
 *
 * La sidebar se replie via le store `useLayoutStore`.
 *
 * @returns {JSX.Element} Structure AppShell complète.
 */
export function AppLayout() {
  const collapsed = useLayoutStore((s) => s.sidebarCollapsed);

  return (
    <AppShell
      header={{ height: HEADER_HEIGHT }}
      navbar={{
        width: collapsed ? NAVBAR_WIDTH_COLLAPSED : NAVBAR_WIDTH,
        breakpoint: 'sm',
        collapsed: { mobile: true, desktop: collapsed },
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
