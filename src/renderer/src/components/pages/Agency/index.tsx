import DecisionsSearch from './search'
import TopButtons from './top-buttons'
import AgencyTable from './agency-table'
import { useAuthHeader } from 'react-auth-kit'
import { useQuery } from '@tanstack/react-query'
import { getApi } from '@renderer/lib/http'
import { Agency } from '@renderer/types'

export default function AgencyIndex() {
  const authToken = useAuthHeader()
  const { isLoading, error, data } = useQuery({
    queryKey: ['Agency'],
    queryFn: () =>
      getApi<Agency>('/agency?page=1&pageSize=30', {
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
      <AgencyTable info={infoArray || []} page={1} pageSize="0" total="0" />
    </section>
  )
}
