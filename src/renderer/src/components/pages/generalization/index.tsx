import TopButtons from './top-button'
import { useAuthHeader } from 'react-auth-kit'
import { useQuery } from '@tanstack/react-query'
import { Generalization } from '@renderer/types'
import { getApi } from '@renderer/lib/http'
import GeneralizationSearch from './search'
import GeneralizationTable from './generalization-table'
import { useSearchParams } from 'react-router-dom'
// import BookTable from './Book-table'

export default function GeneralizationIndex() {
  const authToken = useAuthHeader()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query')
  const page = searchParams.get('page')
  const refrance = searchParams.get('refrance[equals]')
  const dateFrom = searchParams.get('createdAt[gte]')
  const dateTo = searchParams.get('createdAt[lte]')

  const { isLoading, error, data } = useQuery({
    queryKey: ['generalization', query, page, refrance, dateFrom, dateTo],
    queryFn: () =>
      getApi<Generalization>('/generalization', {
        params: {
          'title[contains]': query,
          'refrance[equals]': refrance,
          'createdAt[gte]': dateFrom,
          'createdAt[lte]': dateTo,
          page: page || 1,
          pageSize: 5
        },
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
      <TopButtons data={data?.data.info || []} />
      <GeneralizationTable
        info={infoArray || []}
        page={Number(data?.data.page)}
        pageSize={String(data?.data.pageSize)}
        total={String(data?.data.total)}
      />
    </section>
  )
}
