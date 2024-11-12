import DecisionsSearch from './search'
import { useAuthHeader } from 'react-auth-kit'
import { useQuery } from '@tanstack/react-query'
import { Decision } from '@renderer/types'
import { getApi } from '@renderer/lib/http'
import TopButtons from './top-button'
import UsersTable from './userTable'
export default function ManageUsers() {
  const authToken = useAuthHeader()
  const { isLoading, error, data } = useQuery({
    queryKey: ['Decisions'],
    queryFn: () =>
      getApi<Decision>('/decision?page=1&pageSize=30', {
        headers: {
          Authorization: authToken()
        }
      })
  })

  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message
  const infoArray = data?.data?.info || []
  console.log('infoArray:', infoArray)
  return (
    <section className="relative space-y-4 ">
      <DecisionsSearch />
      <TopButtons />
      <UsersTable info={infoArray || []} page={1} pageSize="0" total="0" />
    </section>
  )
}
