import { Issues } from '../../../types/index'
import TopButtons from './top-buttons'
import { getApi } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import StateTable from './state-table'
import { useAuthHeader } from 'react-auth-kit'
import SearchStateAffairs from './searchState-affairs'
import { useSearchParams } from 'react-router-dom'

export default function StateAffairs() {
  const authToken = useAuthHeader()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query')
  const page = searchParams.get('page')
  const { isLoading, error, data } = useQuery({
    queryKey: ['Issues', query,page],
    queryFn: () =>
      getApi<Issues>('/issue', {
        params: {
          'name[contains]': query,
          "include[IssueDetails]":true,
          "include[governmentOffice]":true,
          "include[postion]":true,
          page: page || 1,
          pageSize: 5
        },
        headers: {
          Authorization: authToken()
        }
      })
  })

  // console.log("datadatadatadatadatadatadata",data?.data.info[0].IssueDetails[0].level)
  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message
  const infoArray = data?.data?.info || [] // Directly access the `info` array from `data.data`
  console.log('infoArray:', infoArray)

  return (
    <section className="relative space-y-4 ">
      <SearchStateAffairs />
      <TopButtons data={data?.data.info || []}/>
      <StateTable info={infoArray || []} page={1} pageSize="0" total="0" />
    </section>
  )
}
