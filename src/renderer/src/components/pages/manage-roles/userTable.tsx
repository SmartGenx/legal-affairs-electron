import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { OrganizationTable } from '../state-affairs/organizationTable'

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
export default function UsersTable({ info, page, total }: Props) {
  
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

      // {
      //   id: 'actions',
      //   cell: ({ row }) => (
      //     <DropdownMenu>
      //       <DropdownMenuTrigger asChild>
      //         <Button variant="ghost" className="h-8 w-8 p-0">
      //           <MoreHorizontal className="h-4 w-4" />
      //         </Button>
      //       </DropdownMenuTrigger>
      //       <DropdownMenuContent align="end" className="h-17 -mt-[70px] ml-7 min-w-[84.51px] p-0">
      //         <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
      //           <Link to={`/decisions/view-info/${row.original.id}`}>عرض</Link>
      //         </DropdownMenuItem>
      //         <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
      //           <DeleteDialog
      //             url={`/decision/${row.original?.id}`}
      //             keys={['Decisions']}
      //             path={'decisions'}
      //           />
      //         </DropdownMenuItem>
      //       </DropdownMenuContent>
      //     </DropdownMenu>
      //   )
      // }
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
