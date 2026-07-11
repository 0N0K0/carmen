import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { LibraryAlbumsPage } from './pages/library/LibraryAlbumsPage';
import { LibraryArtistsPage } from './pages/library/LibraryArtistsPage';
import { LibraryLayout } from './pages/library/LibraryLayout';
import { LibraryLovedPage } from './pages/library/LibraryLovedPage';
import { LibraryOverviewPage } from './pages/library/LibraryOverviewPage';
import { LibraryPlaylistsPage } from './pages/library/LibraryPlaylistsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'library',
        element: <LibraryLayout />,
        children: [
          { index: true, element: <LibraryOverviewPage /> },
          { path: 'loved', element: <LibraryLovedPage /> },
          { path: 'playlists', element: <LibraryPlaylistsPage /> },
          { path: 'albums', element: <LibraryAlbumsPage /> },
          { path: 'artists', element: <LibraryArtistsPage /> },
        ],
      },
    ],
  },
]);

/**
 * Point d'entrée React de l'application Carmen.
 *
 * Configure le routeur et monte le layout principal.
 *
 * @returns {JSX.Element} RouterProvider avec les routes de l'application.
 */
export default function App() {
  return <RouterProvider router={router} />;
}
