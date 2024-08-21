'use client'
import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { GevStatus, GovernmentFacility, kind_of_case } from '../../../types/enum'
import { MoreHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../ui/dropdown-menu'
import { OrganizationTable } from './organizationTable'
import { InfoIssue, Issues } from '../../../types/index'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'
// import enumData from '@/enum.json'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
// import DeleteDialog from '@/components/delete-dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip'
// import { Paths } from '@/enums'
import { cn } from '@/lib/utils'

type Props = {
  info: InfoIssue[]
  page: number
  pageSize: string
  total: string
}

export default function StateTable({ info, page, total, pageSize }: Props) {
  const navigate = useNavigate()

  const columns = React.useMemo<ColumnDef<InfoIssue>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'م',
        cell: ({ row }) => (row.index + 1 + (page - 1) * 10).toString().padStart(2, '0')
      },
      {
        accessorKey: 'name',
        header: 'الأسم'
      },
      {
        accessorKey: 'id',
        header: 'الصفة',
        cell: ({ row }) => {
          const state = row.original.type as GevStatus
          switch (state) {
            case GevStatus.Director_of_the_Department:
              return 'مدير إدارة'

            default:
              return 'sfvv'
          }
        }
      },
      {
        accessorKey: 'id',
        header: 'المرفق الحكومي',
        cell: ({ row }) => {
          const state = row.original.governmentOfficeId as GovernmentFacility
          switch (state) {
            case GovernmentFacility.Legal_Affairs:
              return 'الشؤون القانونية'

            default:
              return 'sfvv'
          }
        }
      },
      {
        accessorKey: 'postionId',
        header: 'نوع القضية',
        cell: ({ row }) => {
          const state = row.original.postionId as kind_of_case
          switch (state) {
            case kind_of_case.civilian:
              return 'مدني'

            default:
              return 'تجارية'
          }
        }
      },
      {
        accessorKey: 'title',
        header: 'درجة التقاضي'
      },
      {
        accessorKey: 'invitationType',
        header: 'رقم الحكم'
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
                {/* <DeleteDialog
                  url={`/Organization/${row.original?.id}`}
                  revalidatePath={Paths.localOrg}
                /> */}
                تعديل
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                {/* <DeleteDialog
                  url={`/Organization/${row.original?.id}`}
                  revalidatePath={Paths.localOrg}
                /> */}
                حذف
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
        navigate(`/state-affairs/info/${original.id}`)
      }}
    />
  )
}
