import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
// import DeleteDialog from './delete-dailog'
import { SettingTable } from '@renderer/components/ui/settings-table'
import DeleteSettingDialog from '../delete-dailog.-settings'
import EditDialog from '../edit-dailog'
import CustomerEdit from './editCustomer'
// import TribunalEdit from './tribunal-edit'

type Props = {
  info: Info[]
  total: number
  page: string
  pageSize: string
}

export interface Info {
  id: number
  name: string
  type: number
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}
const types = [
  { label: 'مشتري', value: 1 },
  { label: 'شركة', value: 2 }
]
export default function CustomerTable({ info, page, total }: Props) {
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
        header: 'اسم العميل'
      },
      {
        accessorKey: 'type',
        header: 'نوع العميل',
        cell: ({ row }) => {
          const typeId = row.original.type
          const type = types.find((x) => x.value === typeId)
          return type ? type.label : 'Unknown Type'
        }
      },
      {
        id: 'actions',
        header: '',

        cell: ({ row }) => (
          <div className="flex w-fit">
            <EditDialog>
              {(onClose) => <CustomerEdit id={row.original.id} onClose={onClose} />}
            </EditDialog>
            <DeleteSettingDialog
              url={`/customer/${row.original?.id}`}
              keys={['customers']}
              path={'settings'}
            />
          </div>
        )
      }
    ],
    [page]
  )
  return <SettingTable columns={columns} data={info} page={page.toString()} total={Number(total)} />
}
