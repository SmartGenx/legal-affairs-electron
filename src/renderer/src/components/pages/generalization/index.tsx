import TopButtons from './top-button'
import { useAuthHeader } from 'react-auth-kit'
import { useQuery } from '@tanstack/react-query'
import { Generalization } from '@renderer/types'
import { getApi } from '@renderer/lib/http'
import GeneralizationSearch from './search'
import GeneralizationTable from './generalization-table'
// import BookTable from './Book-table'

export default function GeneralizationIndex() {
  const authToken = useAuthHeader()
  const { isLoading, error, data } = useQuery({
    queryKey: ['generalization'],
    queryFn: () =>
      getApi<Generalization>('/generalization?page=1&pageSize=30', {
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
      <GeneralizationSearch />
      <TopButtons />
      <GeneralizationTable info={infoArray || []} page={1} pageSize="0" total="0" />
    </section>
  )
}
