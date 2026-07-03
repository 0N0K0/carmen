import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
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
