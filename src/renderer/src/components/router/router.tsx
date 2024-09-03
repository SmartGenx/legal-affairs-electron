import { createHashRouter } from 'react-router-dom'
import RootLayout from '../layouts/layout'
// import ProtectedRoute from '../layouts/protected-route'
import Home from '../pages/home/home'
import Login from '../pages/login/login'
import ProtectedRoute from '../layouts/protected-route'
import StateAffairs from '../pages/state-affairs/state-affairs'
import AddIssus from '../pages/state-affairs/[id]/add'
import ViewPage from '../pages/state-affairs/[id]/view-page'
import TheDepartmentOfAllfta from '../pages/the-department-of-al-Ifta'
import ComplaintIndex from '../pages/the-department-of-al-Ifta/add-complain'
import AlLftaIndex from '../pages/the-department-of-al-Ifta/[id]'
import DecisionsIndex from '../pages/decisions'
import AddDecisions from '../pages/decisions/add-decisions'

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
      },
      {
        path: '/the-department-of-al-lfta',
        element: <ProtectedRoute element={<TheDepartmentOfAllfta />} />
      },
      {
        path: '/the-department-of-al-lfta/add-complaint',
        element: <ProtectedRoute element={<ComplaintIndex />} />
      },
      {
        path: '/the-department-of-al-lfta/info/:id',
        element: <ProtectedRoute element={<AlLftaIndex />} />
      },
      {
        path: '/decisions',
        element: <ProtectedRoute element={<DecisionsIndex />} />
      },
      {
        path: '/decisions/add-Decision',
        element: <ProtectedRoute element={<AddDecisions />} />
      }
    ]
  }
])
