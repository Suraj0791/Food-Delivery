import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import MainLayout from './MainLayout'
import Signup from './auth/Signup'
import Login from './auth/Login'
import ForgotPassword from './auth/ForgotPassword'
import ResetPassword from './auth/ResetPassword'
import VerifyEmail from './auth/VerifyEmail'

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
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword/>,
  },
  {
    path: '/reset-password',
    element: <ResetPassword/>,
  },
  {
    path:'/verify-email',
    element:<VerifyEmail/>
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
