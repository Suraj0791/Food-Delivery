import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Login from './auth/login'
import MainLayout from './MainLayout'
import Signup from './auth/Signup'

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,

  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  }

])

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <RouterProvider router={appRouter} />
        
    </>
  )
}

export default App
