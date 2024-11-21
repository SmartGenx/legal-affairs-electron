import DecisionsSearch from './search'
import TopButtons from './top-buttons'
import AgencyTable from './agency-table'
import { useAuthHeader } from 'react-auth-kit'
import { useQuery } from '@tanstack/react-query'
import { getApi } from '@renderer/lib/http'
import { Agency } from '@renderer/types'
import { useSearchParams } from 'react-router-dom'

export default function AgencyIndex() {
  const authToken = useAuthHeader()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query')
  const page = searchParams.get('page')
  const { isLoading, error, data } = useQuery({
    queryKey: ['Agency', query, page],
    queryFn: () =>
      getApi<Agency>('/agency', {
        params: {
          'legalName[contains]': query,
          "include[governmentOffice]":true,
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
      <AgencyTable info={infoArray || []} page={Number(data?.data.page)} pageSize={String(data?.data.pageSize)} total={String(data?.data.total)} />
    </section>
  )
}
