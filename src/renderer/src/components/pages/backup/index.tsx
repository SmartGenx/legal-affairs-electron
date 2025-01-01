import { useQuery } from '@tanstack/react-query'
import BackupSearch from './top-buttons'
import { getApi } from '@renderer/lib/http'
import { useAuthHeader } from 'react-auth-kit'
import BackupTable from './backup-table'
import { useSearchParams } from 'react-router-dom'
export interface BackUp {
  id: number
  name: string
  path: string
  createAt: Date
  deleted: boolean
}
export default function BackupIndex() {
  const authToken = useAuthHeader()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query')
  const { data: BackUPTable } = useQuery({
    queryKey: ['BackupsTable', query],
    queryFn: () =>
      getApi<BackUp[]>('/backup', {
        params: {
          'name[contains]': query
        },
        headers: {
          Authorization: authToken()
        }
      })
  })
  return (
    <div>
      <BackupSearch />
      <BackupTable info={BackUPTable?.data || []} pageSize="5" page="2" total={5} />
    </div>
  )
}
