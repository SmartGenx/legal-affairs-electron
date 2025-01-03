import React from 'react'
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
export default function AgencyTable({ info, page, total,pageSize }: Props) {
  const navigate = useNavigate()
  const columns = React.useMemo<ColumnDef<AgencyInfo>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'م',
        cell: ({ row }) => (row.index + 1 + (page - 1) * 10).toString().padStart(2, '0')
      },
      {
        accessorKey: 'legalName',
        header: 'اسم القانوني'
      },
      {
        accessorKey: 'providedDocument',
        header: 'رقم الوثيقة المقدمه'
      },
      {
        accessorKey: 'governmentOfficeId',
        header: 'المرفق الحكومي',
        cell: ({ row }) => {
          return row.original.governmentOffice.name
        }
      },
      {
        accessorKey: 'createdAt',
        header: 'تاريخ الإضافة',
        cell: ({ row }) => {
          return new Date(row.original.createdAt).toISOString().split('T')[0]
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
                <Link to={`/Agency/update-agency/${row.original.id}`}>تعديل</Link>
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
      pageSize={Number(pageSize)}
      onRowClick={(_, { original }) => {
        navigate(`/Agency/view-agency-info/${original.id}`)
      }}
    />
  )
}
