import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LandingPage } from './features/landing/pages/LandingPage'
import { DocPage } from './features/docs/pages/DocPage'
import { NotFoundPage } from './pages/NotFoundPage'

export const router = createBrowserRouter([
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
])
