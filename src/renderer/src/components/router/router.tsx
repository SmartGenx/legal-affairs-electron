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
import ViewBook from '../pages/official-journal/add-book/view-page'
import PersonnelAffairsIndex from '../pages/personnel-affairs'
import UpdateEmployeeIndex from '../pages/personnel-affairs/add-employee/update-form'
import GeneralizationIndex from '../pages/generalization'
import AddGeneralizationForm from '../pages/generalization/add-generalization'
import UpdateGeneralization from '../pages/generalization/update-generalization'
import AgencyIndex from '../pages/Agency'
import AddAgency from '../pages/Agency/add-agency'
import UpdateAgency from '../pages/Agency/update-agency'
import StateAffairsInfo from '../pages/state-affairs/[id]/info'
import AllaftaInfo from '../pages/the-department-of-al-Ifta/info'
import DecisionInfo from '../pages/decisions/info'
import BookInfo from '../pages/official-journal/add-book/info'
import GeneralizationInfo from '../pages/generalization/info'
import ViewAgencyInfo from '../pages/Agency/info/index'
import EmployeeInfo from '../pages/personnel-affairs/add-employee/info'
import AddBookForm from '../pages/official-journal/add-book/add-book'
import HeaderFormLicense from '../pages/official-journal/license/header-form'
import OrderBookFormIndex from '../pages/official-journal/order-book/header-form'
import SettingsIndex from '../pages/settings'
import UpdateLicense from '../pages/official-journal/license/update-lincense'
import ViewLicense from '../pages/official-journal/license/view-license'
import UpdateOrderBook from '../pages/official-journal/order-book/update-order-book'
import AddEmployeeForm from '../pages/personnel-affairs/add-employee/add-emp'
import AddLeaveForm from '../pages/personnel-affairs/leave/form'
import UpdateLeaveIndex from '../pages/personnel-affairs/leave/update-leave'
import ViewOrderPage from '../pages/official-journal/order-book/view-order-page'
import ViewPageLeave from '../pages/personnel-affairs/leave/view-page-leave'

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
        path: '/state-affairs/view-info/:id',
        element: <ProtectedRoute element={<StateAffairsInfo />} />
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
        path: '/the-department-of-al-lfta/view-info/:id',
        element: <ProtectedRoute element={<AllaftaInfo />} />
      },
      {
        path: '/decisions',
        element: <ProtectedRoute element={<DecisionsIndex />} />
      },
      {
        path: '/decisions/view-info/:id',
        element: <ProtectedRoute element={<DecisionInfo />} />
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
        element: <ProtectedRoute element={<AddBookForm />} />
      },
      {
        path: '/official-journal/book-info/:id',
        element: <ProtectedRoute element={<BookInfo />} />
      },
      {
        path: '/official-journal/view-book/:id',
        element: <ProtectedRoute element={<ViewBook />} />
      },
      {
        path: '/official-journal/order-book',
        element: <ProtectedRoute element={<OrderBookFormIndex />} />
      },
      {
        path: '/official-journal/update-order-book/:id',
        element: <ProtectedRoute element={<UpdateOrderBook />} />
      },
      {
        path: '/official-journal/view-order-book/:id',
        element: <ProtectedRoute element={<ViewOrderPage />} />
      },
      {
        path: '/personnel-affairs',
        element: <ProtectedRoute element={<PersonnelAffairsIndex />} />
      },
      {
        path: '/personnel-affairs/add-employee',
        element: <ProtectedRoute element={<AddEmployeeForm />} />
      },
      {
        path: '/personnel-affairs/view-employee-info/:id',
        element: <ProtectedRoute element={<EmployeeInfo />} />
      },
      {
        path: '/personnel-affairs/update-employee/:id',
        element: <ProtectedRoute element={<UpdateEmployeeIndex />} />
      },
      {
        path: '/personnel-affairs/add-leave',
        element: <ProtectedRoute element={<AddLeaveForm />} />
      },
      {
        path: '/personnel-affairs/update-leave/:id',
        element: <ProtectedRoute element={<UpdateLeaveIndex />} />
      },
      {
        path: '/personnel-affairs/view-leave/:id',
        element: <ProtectedRoute element={<ViewPageLeave />} />
      },
      {
        path: '/license/add-license',
        element: <ProtectedRoute element={<HeaderFormLicense />} />
      },
      {
        path: '/license/update-license/:id',
        element: <ProtectedRoute element={<UpdateLicense />} />
      },
      {
        path: '/license/view-license/:id',
        element: <ProtectedRoute element={<ViewLicense />} />
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
        path: '/generalization/view-generalization-info/:id',
        element: <ProtectedRoute element={<GeneralizationInfo />} />
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
      },
      {
        path: '/Agency/view-agency-info/:id',
        element: <ProtectedRoute element={<ViewAgencyInfo />} />
      },
      {
        path: '/settings',
        element: <ProtectedRoute element={<SettingsIndex />} />
      }
    ]
  }
])
