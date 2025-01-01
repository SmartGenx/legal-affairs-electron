import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
// import DeleteDialog from './delete-dailog'
import { SettingTable } from '@renderer/components/ui/settings-table'

type Props = {
  info: Info[]
  total: number
  page: string
  pageSize: string
}

export interface Info {
  id: number
  name: string
  path: string
  createAt: Date
  deleted: boolean
}
export default function BackupTable({ info, page, total }: Props) {
  const columns = React.useMemo<ColumnDef<Info>[]>(
    () => [
      {
        accessorKey: 'id',
        header: '#',
        cell: ({ row }) => {
          return <p>{row.index + 1}</p>
        },
        enableSorting: false
      },
      {
        accessorKey: 'name',
        header: 'اسم النسخة'
      },
      {
        accessorKey: 'createAt',
        header: 'تاريخ الانشاء',
        cell: ({ row }) => {
          return new Date(row.original.createAt).toISOString().split('T')[0]
        }
      }
    ],
    [page]
  )
  return <SettingTable columns={columns} data={info} page={page.toString()} total={Number(total)} />
}
