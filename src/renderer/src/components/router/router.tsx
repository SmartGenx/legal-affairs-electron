import { createHashRouter } from 'react-router-dom'
import RootLayout from '../layouts/layout'
// import ProtectedRoute from '../layouts/protected-route'
import Home from '../pages/home/home'
import Login from '../pages/login/login'
import ProtectedRoute from '../layouts/protected-route'
import StateAffairs from '../pages/state-affairs/state-affairs'
import AddIssus from '../pages/state-affairs/[id]/add'
import ViewPage from '../pages/state-affairs/[id]/view-page'

export const router = createHashRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <ProtectedRoute element={<Home />} />
        // element: <Home />
      },
      {
        path: '/state-affairs',
        element: <ProtectedRoute element={<StateAffairs />} />
        // element: <Home />
      },
      {
        path: '/state-affairs/info/:id',
        element: <ProtectedRoute element={<ViewPage />} />
      },
      {
        path: '/state-affairs/info/add',
        element: <ProtectedRoute element={<AddIssus />} />
      }
    ]
  }
])
