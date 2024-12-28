import DepartmentOfAlLftaSearch from './search'
import TopButtons from './top-buttons'
import { getApi } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import { useAuthHeader } from 'react-auth-kit'
import { Complaint } from '@renderer/types'
import AlLftaTable from './al-lfta-table'
import { useSearchParams } from 'react-router-dom'

export default function TheDepartmentOfAllfta() {
  const authToken = useAuthHeader()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query')
  const page = searchParams.get('page')
  const { isLoading, error, data } = useQuery({
    queryKey: ['Complaint', query, page],
    queryFn: () =>
      getApi<Complaint>('/complaint', {
        params: {
          'name[contains]': query,
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
      <DepartmentOfAlLftaSearch />
      <TopButtons data={data?.data.info || []} />
      <AlLftaTable info={infoArray || []} page={Number(data?.data.page)} pageSize={String(data?.data.pageSize)} total={String(data?.data.total)} />
    </section>
  )
}
