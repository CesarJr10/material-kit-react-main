import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes   } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import ProtectedRoute from 'src/contexts/ProtectedRoute';  // Ajusta la ruta de importación si es necesario

const IndexPage    = lazy(() => import('src/pages/app'));
const UserPage     = lazy(() => import('src/pages/user'));
const MarkerPage   = lazy(() => import('src/pages/marker'));
const RoutePage    = lazy(() => import('src/pages/route'));
const LoginPage    = lazy(() => import('src/pages/login'));
// const RegisterPage = lazy(() => import('src/pages/register'));
const Page404      = lazy(() => import('src/pages/page-not-found'));

export default function Router() {
  const routes = useRoutes([
    {
      path: '/',
      element: <LoginPage />, // Página de inicio por defecto
    },

    // {
    //   path: '/register',
    //   element: <RegisterPage />, 
    // },

    {
      path: 'dashboard',
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </ProtectedRoute>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'marker', element: <MarkerPage /> },
        { path: 'route', element: <RoutePage /> },
      ],
    },
    
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
