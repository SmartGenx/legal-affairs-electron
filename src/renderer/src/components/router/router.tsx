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
import UpdateDecisions from '../pages/decisions/update-decisions'
import OfficialJournalIndex from '../pages/official-journal'
import AddBookIndex from '../pages/official-journal/add-book'
import OrderBookIndex from '../pages/official-journal/order-book'
import ViewBook from '../pages/official-journal/add-book/view-page'
import PersonnelAffairsIndex from '../pages/personnel-affairs'
import PersonnelIndex from '../pages/personnel-affairs/add-employee'
import UpdateEmployeeIndex from '../pages/personnel-affairs/add-employee/update-form'
import LicenseIndex from '../pages/official-journal/license'
import GeneralizationIndex from '../pages/generalization'
import AddGeneralizationForm from '../pages/generalization/add-generalization'
import UpdateGeneralization from '../pages/generalization/update-generalization'
import AgencyIndex from '../pages/Agency'
import AddAgency from '../pages/Agency/add-agency'
import UpdateAgency from '../pages/Agency/update-agency'
import AddLeave from '../pages/personnel-affairs/leave'

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
      },
      {
        path: '/decisions/update-Decision/info/:id',
        element: <ProtectedRoute element={<UpdateDecisions />} />
      },
      {
        path: '/official-journal',
        element: <ProtectedRoute element={<OfficialJournalIndex />} />
      },
      {
        path: '/official-journal/add-book',
        element: <ProtectedRoute element={<AddBookIndex />} />
      },
      {
        path: '/official-journal/view-book/:id',
        element: <ProtectedRoute element={<ViewBook />} />
      },
      {
        path: '/official-journal/order-book',
        element: <ProtectedRoute element={<OrderBookIndex />} />
      },
      {
        path: '/personnel-affairs',
        element: <ProtectedRoute element={<PersonnelAffairsIndex />} />
      },
      {
        path: '/personnel-affairs/add-employee',
        element: <ProtectedRoute element={<PersonnelIndex />} />
      },
      {
        path: '/personnel-affairs/update-employee/:id',
        element: <ProtectedRoute element={<UpdateEmployeeIndex />} />
      },
      {
        path: '/personnel-affairs/add-leave',
        element: <ProtectedRoute element={<AddLeave />} />
      },
      {
        path: '/license/add-license',
        element: <ProtectedRoute element={<LicenseIndex />} />
      },
      {
        path: '/generalization',
        element: <ProtectedRoute element={<GeneralizationIndex />} />
      },
      {
        path: '/generalization/add-generalization',
        element: <ProtectedRoute element={<AddGeneralizationForm />} />
      },
      {
        path: '/generalization/update-generalization/:id',
        element: <ProtectedRoute element={<UpdateGeneralization />} />
      },
      {
        path: '/Agency',
        element: <ProtectedRoute element={<AgencyIndex />} />
      },
      {
        path: '/Agency/add-agency',
        element: <ProtectedRoute element={<AddAgency />} />
      },
      {
        path: '/Agency/update-agency/:id',
        element: <ProtectedRoute element={<UpdateAgency />} />
      }
    ]
  }
])
