import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
// import DeleteDialog from './delete-dailog'
import { SettingTable } from '@renderer/components/ui/settings-table'
import DeleteSettingDialog from '../delete-dailog.-settings'
import EditDialog from '../edit-dailog'
import LeaveTypeEdit from './LeaveType-edit'

type Props = {
  info: Info[]
  total: number
  page: string
  pageSize: string
}

export interface Info {
  id: number
  name: string
  defaultDay:number
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}
export default function LeaveTypeTable({ info, page, total }: Props) {
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
        header: 'عنوان الاجازة'
      },
      {
        accessorKey: 'defaultDay',
        header: 'الايام الافتراضية'
      },
      {
        id: 'actions',
        header: '',

        cell: ({ row }) => (
          <div className="flex w-fit">
            <EditDialog>
              {(onClose) => <LeaveTypeEdit id={row.original.id} onClose={onClose} />}
            </EditDialog>
            <DeleteSettingDialog
              url={`/leave-type/${row.original?.id}`}
              keys={['LeaveTypeTable']}
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
