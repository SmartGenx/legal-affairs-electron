import React, { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../ui/dropdown-menu'
import { OrganizationTable } from './organizationTable'
import { ComplaintInfo, GeneralizationInfo } from '../../../types/index'
import { Button } from '../../ui/button'
import { axiosInstance } from '@renderer/lib/http'
import { useAuthHeader } from 'react-auth-kit'
import DeleteDialog from '@renderer/components/dialog/delete-dialog'

type Props = {
  info: GeneralizationInfo[]
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
export default function GeneralizationTable({ info, page, total, pageSize }: Props) {
  const navigate = useNavigate()
  const authToken = useAuthHeader()
  const columns = React.useMemo<ColumnDef<GeneralizationInfo>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'l',
        cell: ({ row }) => (row.index + 1 + (page - 1) * 10).toString().padStart(2, '0')
      },
      {
        accessorKey: 'refrance',
        header: 'رقم التعميم',
        cell: ({ row }) => (row.index + 1 + (page - 1) * 10).toString().padStart(2, '0')
      },
      {
        accessorKey: 'createdAt',
        header: 'تاريخ التعميم',
        cell: ({ row }) => {
          const date = row.original.createdAt
          return new Date(date).toISOString().split('T')[0]
        }
      },
      {
        accessorKey: 'title',
        header: 'موضوع التعميم'
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
                <DeleteDialog
                  url={`/generalization/${row.original?.id}`}
                  keys={['generalization']}
                  path={'generalization'}
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
        navigate(`/generalization/update-generalization/${original.id}`)
      }}
    />
  )
}