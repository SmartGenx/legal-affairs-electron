import React, { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../ui/dropdown-menu'
import { OrganizationTable } from './organizationTable'
import { AgencyInfo } from '../../../types/index'
import { Button } from '../../ui/button'
import { axiosInstance } from '@renderer/lib/http'
import { useAuthHeader } from 'react-auth-kit'
import DeleteDialog from '@renderer/components/dialog/delete-dialog'

type Props = {
  info: AgencyInfo[]
  page: number
  pageSize: string
  total: string
}
export interface ReferenceProp {
  id: number
  name: string
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}
export default function AgencyTable({ info, page, total }: Props) {
  const navigate = useNavigate()
  const authToken = useAuthHeader()
  const columns = React.useMemo<ColumnDef<AgencyInfo>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'م',
        cell: ({ row }) => (row.index + 1 + (page - 1) * 10).toString().padStart(2, '0')
      },
      {
        accessorKey: 'legalName',
        header: 'الاسم القانوني'
      },
      {
        accessorKey: 'providedDocument',
        header: 'المرفق الذي يمثله'
      },
      {
        accessorKey: 'governmentOfficeId',
        header: 'المرفق الحكومي',
        cell: ({ row }) => {
          const [data, setData] = useState<ReferenceProp>()
          const fetchData = async () => {
            try {
              const response = await axiosInstance.get(
                `/government-office/${row.original.governmentOfficeId}`,
                {
                  headers: {
                    Authorization: `${authToken()}`
                  }
                }
              )
              setData(response.data)
            } catch (error) {
              console.error('Error fetching data:', error)
            }
          }
          useEffect(() => {
            fetchData()
          }, [])

          return data?.name
        }
      },

      {
        id: 'actions',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="h-17 -mt-[70px] ml-7 min-w-[84.51px] p-0">
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Link to={`/Agency/view-agency-info/${row.original.id}`}>عرض</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <DeleteDialog
                  url={`/agency/${row.original?.id}`}
                  keys={['Agency']}
                  path={'Agency'}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    ],
    [page]
  )

  return (
    <OrganizationTable
      columns={columns}
      data={info}
      page={page.toString()}
      total={Number(total)}
      onRowClick={(_, { original }) => {
        navigate(`/Agency/update-agency/${original.id}`)
      }}
    />
  )
}
