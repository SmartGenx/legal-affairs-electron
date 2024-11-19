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

import { DecisionInfo } from '../../../types/index'
import { Button } from '../../ui/button'
import DeleteDialog from '@renderer/components/dialog/delete-dialog'
import { OrganizationTable } from '../state-affairs/organizationTable'

type Props = {
  info: Info[]
  total: number
  page: string
  pageSize: string
}

export interface Info {
  id: number
  name: string
  email: string
  phone: null
  image: null
  roles: RoleElement[]
}

export interface RoleElement {
  id: number
  userId: number
  roleId: number
  createdAt: Date
  updatedAt: Date
  role: RoleRole
}

export interface RoleRole {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
}
export default function UserTable({ info, page, total }: Props) {
  const navigate = useNavigate()
  const columns = React.useMemo<ColumnDef<Info>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'الاسم'
      },
      {
        accessorKey: 'email',
        header: 'البريد الاكتروني'
      },
      {
        accessorKey: 'phone',
        header: 'رقم الهاتف',
        
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
                  url={`/user/${row.original?.id}`}
                  keys={['UsersInfo']}
                  path={'settings'}
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
      //   onRowClick={(_, { original }) => {
      //     navigate(`/decisions/update-Decision/info/${original.id}`)
      //   }}
    />
  )
}
