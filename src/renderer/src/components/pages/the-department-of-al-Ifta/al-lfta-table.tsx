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
import { ComplaintInfo } from '../../../types/index'
import { Button } from '../../ui/button'
import DeleteDialog from '@renderer/components/dialog/delete-dialog'

type Props = {
  info: ComplaintInfo[]
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
export default function AlLftaTable({ info, page, total, pageSize }: Props) {
  const navigate = useNavigate()
  const columns = React.useMemo<ColumnDef<ComplaintInfo>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'م',
        cell: ({ row }) => (row.index + 1 + (page - 1) * 10).toString().padStart(2, '0')
      },
      {
        accessorKey: 'name',
        header: 'مقدم الشكوى'
      },
      {
        accessorKey: 'governmentOfficeId',
        header: 'مصدر التوجية',
        cell: ({ row }) => {
          return row.original.governmentOffice.name
        }
      },
      {
        accessorKey: 'title',
        header: 'موضوع الشكوى'
      },
      {
        accessorKey: 'date',
        header: 'تاريخ رأي المكتب',
        cell: ({ row }) => {
          const date = row.original.date
          return new Date(date).toISOString().split('T')[0]
        }
      },
      {
        accessorKey: 'officeOpinian',
        header: 'نص رأي المكتب',
        cell: ({ row }) => {
          return (
            <p
              className="whitespace-nowrap overflow-hidden text-ellipsis"
              style={{ maxWidth: '20ch' }}
            >
              {row.original.officeOpinian}
            </p>
          )
        }
      },
      {
        accessorKey: 'createdAt',
        header: 'تاريخ الإضافة',
        cell: ({ row }) => {
          const date = row.original.createdAt
          return new Date(date).toISOString().split('T')[0]
        }
      },

      {
        id: 'actions',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-8 w-7" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="h-17 -mt-[70px] ml-7 min-w-[84.51px] p-0">
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Link to={`/the-department-of-al-lfta/info/${row.original.id}`}>تعديل</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <DeleteDialog
                  url={`/complaint/${row.original?.id}`}
                  keys={['Complaint']}
                  path={'the-department-of-al-lfta'}
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
        navigate(`/the-department-of-al-lfta/view-info/${original.id}`)
      }}
    />
  )
}
