import DecisionsSearch from './search'
import TopButtons from './top-buttons'
import DecisionTable from './decisions-table'
import { useAuthHeader } from 'react-auth-kit'
import { useQuery } from '@tanstack/react-query'
import { Decision } from '@renderer/types'
import { getApi } from '@renderer/lib/http'

export default function DecisionsIndex() {
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
      <DecisionTable info={infoArray || []} page={1} pageSize="0" total="0" />
    </section>
  )
}
