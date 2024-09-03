import React from 'react'
import BookSearch from './search'
import TopButtons from './top-buttons'
import { useAuthHeader } from 'react-auth-kit'
import { useQuery } from '@tanstack/react-query'
import { Books } from '@renderer/types'
import { getApi } from '@renderer/lib/http'
import BookTable from './Book-table'

export default function OfficialJournalIndex() {
  const authToken = useAuthHeader()
  const { isLoading, error, data } = useQuery({
    queryKey: ['Books'],
    queryFn: () =>
      getApi<Books[]>('/book?page=1&pageSize=30', {
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
      <TopButtons />
      <BookTable info={infoArray || []} page={1} pageSize="0" total="0" />
    </section>
  )
}
