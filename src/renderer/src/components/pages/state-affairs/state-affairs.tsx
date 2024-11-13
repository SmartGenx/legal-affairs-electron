import SearchAffairs from './search'
import { Issues } from '../../../types/index'
import TopButtons from './top-buttons'
import { getApi } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import StateTable from './state-table'
import { useAuthHeader } from 'react-auth-kit'

export default function StateAffairs() {
  const authToken = useAuthHeader()
  const { isLoading, error, data } = useQuery({
    queryKey: ['Issues'],
    queryFn: () =>
      getApi<Issues>('/issue?page=1&pageSize=40', {
        headers: {
          Authorization: authToken()
        }
      })
  })

  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message
  const infoArray = data?.data?.info || [] // Directly access the `info` array from `data.data`
  console.log('infoArray:', infoArray)

  return (
    <section className="relative space-y-4 ">
      <SearchAffairs />
      <TopButtons />
      <StateTable info={infoArray || []} page={1} pageSize="0" total="0" />
    </section>
  )
}
