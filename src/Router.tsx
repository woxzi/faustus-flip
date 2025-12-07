import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';

const router = createBrowserRouter([
  {
    path: '/faustus-flip',
    element: <HomePage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
