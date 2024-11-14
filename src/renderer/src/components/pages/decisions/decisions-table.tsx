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
import { DecisionInfo } from '../../../types/index'
import { Button } from '../../ui/button'
import DeleteDialog from '@renderer/components/dialog/delete-dialog'

type Props = {
  info: DecisionInfo[]
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
export default function DecisionTable({ info, page, total }: Props) {
  const navigate = useNavigate()
  const columns = React.useMemo<ColumnDef<DecisionInfo>[]>(
    () => [
      {
        accessorKey: 'refrance',
        header: 'رقم القرار',
      },
      {
        accessorKey: 'createdAt',
        header: 'تاريخ القرار',
        cell: ({ row }) => {
          const date = row.original.decisionDate
          return new Date(date).toISOString().split('T')[0]
        }
      },
      {
        accessorKey: 'governmentOffice.name',
        header: 'جهة القرار',
        cell: ({ row }) => {
          return row.original.governmentOffice.name
        }
      },
      {
        accessorKey: 'nameSource',
        header: 'اسم صاحب القرار'
      },
      {
        accessorKey: 'date',
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
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="h-17 -mt-[70px] ml-7 min-w-[84.51px] p-0">
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Link to={`/decisions/view-info/${row.original.id}`}>عرض</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <DeleteDialog
                  url={`/decision/${row.original?.id}`}
                  keys={['Decisions']}
                  path={'decisions'}
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
        navigate(`/decisions/update-Decision/info/${original.id}`)
      }}
    />
  )
}
