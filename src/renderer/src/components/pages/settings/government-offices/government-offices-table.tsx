import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
// import DeleteDialog from './delete-dailog'
import { SettingTable } from '@renderer/components/ui/settings-table'
import DeleteSettingDialog from '../delete-dailog.-settings'
import EditDialog from '../edit-dailog'
import GovernmentOfficesEdit from './government-offices-edit'

type Props = {
  info: Info[]
  total: number
  page: string
  pageSize: string
}

export interface Info {
  id: number
  name: string
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}
export default function GovernmentOfficesTable({ info, page, total }: Props) {
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
        header: 'اسم المكتب الحكومي'
      },

      {
        id: 'actions',
        header: '',

        cell: ({ row }) => (
          <div className="flex w-fit">
            <EditDialog>
              {(onClose) => <GovernmentOfficesEdit id={row.original.id} onClose={onClose} />}
            </EditDialog>

            <DeleteSettingDialog
              url={`/government-office/${row.original?.id}`}
              keys={['governmentOfficeTable']}
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
