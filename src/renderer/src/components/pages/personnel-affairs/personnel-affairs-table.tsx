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
import { EmployInfo } from '../../../types/index'
import { Button } from '../../ui/button'
import { axiosInstance } from '@renderer/lib/http'
import { useAuthHeader } from 'react-auth-kit'
import DeleteDialog from '@renderer/components/dialog/delete-dialog'

type Props = {
  info: EmployInfo[]
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
export default function PersonnelAffairsTable({ info, page, total, pageSize }: Props) {
  const navigate = useNavigate()
  const authToken = useAuthHeader()
  const columns = React.useMemo<ColumnDef<EmployInfo>[]>(
    () => [
      {
        accessorKey: 'reference ',
        header: 'م الموظف',
        cell: ({ row }) => (row.index + 1 + (page - 1) * 10).toString().padStart(2, '0')
      },
      {
        accessorKey: 'name',
        header: 'الأسم'
      },
      {
        accessorKey: 'address',
        header: 'العنوان'
      },
      {
        accessorKey: 'dob',
        header: 'تاريخ الميلاد',
        cell: ({ row }) => {
          const date = row.original.dob
          return new Date(date).toISOString().split('T')[0]
        }
      },

      {
        accessorKey: 'idtype',
        header: 'نوع الوثقية'
      },
      {
        accessorKey: 'employmentDate',
        header: 'تاريخ الأصدار',
        cell: ({ row }) => {
          const date = row.original.employmentDate
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
                <Link to={`/personnel-affairs/view-employee-info/${row.original.id}`}>عرض</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <DeleteDialog
                  url={`/employ/${row.original?.id}`}
                  keys={['Employ']}
                  path={'personnel-affairs'}
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
        navigate(`/personnel-affairs/update-employee/${original.id}`)
      }}
    />
  )
}
