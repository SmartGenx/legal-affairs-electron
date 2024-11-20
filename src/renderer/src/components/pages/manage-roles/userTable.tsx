import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { OrganizationTable } from '../state-affairs/organizationTable'
import EditDialog from '../settings/edit-dailog'
import EditRoles from './role-edit'

type Props = {
  info: Info[]
  page: number
  pageSize: string
  total: string
}
export interface Info {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
}
export default function RoleTable({ info, page, total }: Props) {
  
  const columns = React.useMemo<ColumnDef<Info>[]>(
    () => [
      {
        accessorKey: 'id',
        header: '#',
        cell: ({ row }) => (row.index + 1 + (page - 1) * 10).toString().padStart(2, '0')
      },
      {
        accessorKey: 'name',
        header: 'اسم الدور'
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
          <div className="flex w-fit">
            <EditDialog content={<EditRoles id={row.original.id} />} />
            
          </div>
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
      // onRowClick={(_, { original }) => {
      //   navigate(`/decisions/update-Decision/info/${original.id}`)
      // }}
    />
  )
}
