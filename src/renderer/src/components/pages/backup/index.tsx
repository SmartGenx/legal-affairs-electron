import { useQuery } from '@tanstack/react-query'
import BackupSearch from './top-buttons'
import { getApi } from '@renderer/lib/http'
import { useAuthHeader } from 'react-auth-kit'
import BackupTable from './backup-table'
export interface PotionsResp {
  info: Info[]
  total: number
  page: string
  pageSize: string
}

export interface Info {
  id: number
  name: string
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}
export default function BackupIndex() {
  const authToken = useAuthHeader()
  const { data: TribunalTable, refetch } = useQuery({
    queryKey: ['TribunalTable'],
    queryFn: () =>
      getApi<Info[]>('/tribunal', {
        headers: {
          Authorization: authToken()
        }
      })
  })
  return (
    <div>
      <BackupSearch />
      <BackupTable info={TribunalTable?.data || []} pageSize="5" page="2" total={5} />
    </div>
  )
}
