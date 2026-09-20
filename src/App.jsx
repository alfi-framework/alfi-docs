import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useThemeStore } from './store/useThemeStore'

export default function App() {
  useEffect(() => {
    const cleanup = useThemeStore.getState().initThemeListener()
    return () => cleanup && cleanup()
  }, [])

  return <RouterProvider router={router} />
}