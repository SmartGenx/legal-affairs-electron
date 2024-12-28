import BookSearch from '../search'
import TopButtons from './top-buttons'
import { useAuthHeader } from 'react-auth-kit'
import { useQuery } from '@tanstack/react-query'
import { Books } from '@renderer/types'
import { getApi } from '@renderer/lib/http'
import BookTable from '../Book-table'
import { useSearchParams } from 'react-router-dom'

export default function AddBookIndex() {
  const authToken = useAuthHeader()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query')
  const page = searchParams.get('page')
  const { isLoading, error, data } = useQuery({
    queryKey: ['Books',query,page],
    queryFn: () =>
      getApi<Books>('/book', {
        params:{
          'name[contains]': query,
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
      <BookSearch />
      <TopButtons data={data?.data.info || []}/>
      <BookTable info={infoArray || []} page={Number(data?.data.page)} pageSize={String(data?.data.pageSize)} total={String(data?.data.total)} />
    </section>
  )
}
