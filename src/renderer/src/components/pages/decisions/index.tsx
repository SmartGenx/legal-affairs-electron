import DecisionsSearch from './search'
import TopButtons from './top-buttons'
import DecisionTable from './decisions-table'
import { useAuthHeader } from 'react-auth-kit'
import { useQuery } from '@tanstack/react-query'
import { Decision } from '@renderer/types'
import { getApi } from '@renderer/lib/http'
import { useSearchParams } from 'react-router-dom'

export default function DecisionsIndex() {
  const authToken = useAuthHeader()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query')
  const page = searchParams.get('page')
  const { isLoading, error, data } = useQuery({
    queryKey: ['Decisions' , query,page],
    queryFn: () =>
      getApi<Decision>('/decision', {
        params: {
          'nameSource[contains]': query,
          'include[governmentOffice]': true,
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
      <DecisionsSearch />
      <TopButtons data={data?.data.info || []}/>
      <DecisionTable info={infoArray || []} page={Number(data?.data.page)} pageSize={String(data?.data.pageSize)} total={String(data?.data.total)} />
    </section>
  )
}
