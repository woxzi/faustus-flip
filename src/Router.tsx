import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';

console.log(import.meta.env.VITE_BASE_PATH);

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <HomePage />,
    },
  ],
  {
    basename: import.meta.env.VITE_BASE_PATH,
  }
);

export function Router() {
  return <RouterProvider router={router} />;
}
