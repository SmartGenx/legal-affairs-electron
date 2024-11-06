import DepartmentOfAlLftaSearch from './search'
import TopButtons from './top-buttons'
import { getApi } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import { useAuthHeader } from 'react-auth-kit'
import { Complaint } from '@renderer/types'
import AlLftaTable from './al-lfta-table'

export default function TheDepartmentOfAllfta() {
  const authToken = useAuthHeader()
  const { isLoading, error, data } = useQuery({
    queryKey: ['Complaint'],
    queryFn: () =>
      getApi<Complaint>('/complaint?page=1&pageSize=30', {
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
      <TopButtons />
      <AlLftaTable info={infoArray || []} page={1} pageSize="0" total="0" />
    </section>
  )
}
