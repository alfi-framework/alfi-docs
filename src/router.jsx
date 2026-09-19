import React, { Suspense, lazy } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { LandingPage } from './features/landing/pages/LandingPage'
import { DocPage } from './features/docs/pages/DocPage'
import { NotFoundPage } from './pages/NotFoundPage'

const SearchDialog = lazy(() =>
  import('./features/search/components/SearchDialog').then((mod) => ({
    default: mod.SearchDialog,
  }))
)

function RootLayout() {
  return (
    <>
      <Outlet />
      <Suspense fallback={null}>
        <SearchDialog />
      </Suspense>
    </>
  )
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/docs',
        element: <Navigate to="/docs/introduction" replace />,
      },
      {
        path: '/docs/:slug',
        element: <DocPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
