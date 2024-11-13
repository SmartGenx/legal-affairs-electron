import PersonnelAffairsSearch from './search'
import TopButtons from './top-buttons'
import { useAuthHeader } from 'react-auth-kit'
import { useQuery } from '@tanstack/react-query'
import { Employ } from '@renderer/types'
import { getApi } from '@renderer/lib/http'
import PersonnelAffairsTable from './personnel-affairs-table'

export default function PersonnelAffairsIndex() {
  const authToken = useAuthHeader()
  const { isLoading, error, data } = useQuery({
    queryKey: ['Employ'],
    queryFn: () =>
      getApi<Employ>('/employ?page=1&pageSize=30', {
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
      <PersonnelAffairsSearch />
      <TopButtons />
      <PersonnelAffairsTable info={infoArray || []} page={1} pageSize="0" total="0" />
    </section>
  )
}
