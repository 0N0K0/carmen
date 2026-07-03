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
 * En mode pleine page (`sidebarFullPage`), les variables CSS de l'AppShell
 * sont surchargées via style inline pour que la navbar occupe 100 % de la
 * largeur et recouvre le contenu principal.
 *
 * @returns {JSX.Element} Structure AppShell complète.
 */
export function AppLayout() {
  const sidebarWidth = useLayoutStore((s) => s.sidebarWidth);
  const sidebarFullPage = useLayoutStore((s) => s.sidebarFullPage);

  const fullPageVars = sidebarFullPage
    ? ({
        '--app-shell-navbar-width': '100vw',
        '--app-shell-navbar-offset': '0px',
      } as React.CSSProperties)
    : undefined;

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
      style={fullPageVars}
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
