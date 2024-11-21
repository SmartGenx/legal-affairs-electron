import { getApi } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import { useAuthHeader } from 'react-auth-kit'
import { useSearchParams } from 'react-router-dom'
import UserTable from './userTable'
import TopButtons from './top-buttons'
import UserSearch from './search'
export interface Users {
  info: Info[]
  total: number
  page: string
  pageSize: string
}

export interface Info {
  id: number
  name: string
  email: string
  phone: null
  image: null
  roles: RoleElement[]
}

export interface RoleElement {
  id: number
  userId: number
  roleId: number
  createdAt: Date
  updatedAt: Date
  role: RoleRole
}

export interface RoleRole {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
}

export default function ManageUsersIndex() {
  const authToken = useAuthHeader()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query')
  const page = searchParams.get('page')
  const { isLoading, error, data } = useQuery({
    queryKey: ['UsersInfo', query, page],
    queryFn: () =>
      getApi<Users>('/user', {
        params: {
          'username[contains]': query,
          'include[UserRole][include]': 'role',
          page: page || 1,
          pageSize: 5
        },
        headers: {
          Authorization: authToken()
        }
      })
  })
  const infoArray = data?.data?.info || []
  console.log('infoArray:', infoArray)
  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <section className="relative space-y-4 ">
      <UserSearch />
      <TopButtons  />
      <UserTable info={infoArray || []} page={'1'} pageSize="0" total={0} />
    </section>
  )
}
