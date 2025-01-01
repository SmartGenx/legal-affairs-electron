import { getApi } from '@renderer/lib/http'
import { Employ } from '@renderer/types'
import { useQuery } from '@tanstack/react-query'
import { useAuthHeader } from 'react-auth-kit'
import TopButtons from '../top-buttons'
import PersonnelAffairsTable from '../personnel-affairs-table'
import { useSearchParams } from 'react-router-dom'
import EmpSearch from './search'

export default function EmployeeIndex() {
  const authToken = useAuthHeader()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query')
  const page = searchParams.get('page')
  const phone = searchParams.get('phone[equals]')
  const { isLoading, error, data } = useQuery({
    queryKey: ['Employ', page, query, phone],
    queryFn: () =>
      getApi<Employ>('/employ', {
        params: {
          'name[contains]': query,
          'phone[equals]': phone,
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
      <EmpSearch />
      <TopButtons data={data?.data.info || []} />
      <PersonnelAffairsTable
        info={infoArray || []}
        page={Number(data?.data.page)}
        pageSize={String(data?.data.pageSize)}
        total={String(data?.data.total)}
      />
    </section>
  )
}
