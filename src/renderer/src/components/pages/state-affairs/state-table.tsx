'use client'
import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { kind_of_case, Level } from '../../../types/enum'
import { MoreHorizontal } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../ui/dropdown-menu'
import { OrganizationTable } from './organizationTable'
import { InfoIssue } from '../../../types/index'
import { Button } from '../../ui/button'
import DeleteDialog from '@renderer/components/dialog/delete-dialog'

type Props = {
  info: InfoIssue[]
  page: number
  pageSize: string
  total: string
}

export default function StateTable({ info, page, total }: Props) {
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
        accessorKey: 'postion.name',
        header: 'الصفة',
        cell: ({ row }) => {
          return row.original.postion.name
        }
      },
      {
        accessorKey: 'governmentOffice.name',
        header: 'المرفق الحكومي',
        cell: ({ row }) => {
          return row.original.governmentOffice.name
        }
      },
      {
        accessorKey: 'type',
        header: 'نوع القضية',
        cell: ({ row }) => {
          const state = row.original.type as kind_of_case
          switch (state) {
            case kind_of_case.civilian:
              return 'مدني'
            case kind_of_case.criminal:
              return 'جنائية'
            case kind_of_case.administrative:
              return 'إدارية'
            case kind_of_case.business:
              return 'تجارية'
            default:
              return ''
          }
        }
      },
      {
        accessorKey: 'IssueDetails[0].level',
        header: 'درجة التقاضي',
        cell({ row }) {
          const levels = row.original.IssueDetails[0].level as Level
          switch (levels) {
            case Level.appeal:
              return 'إستئناف'
            case Level.elementary:
              return 'ابتدائي'
            case Level.high:
              return 'عليا'

            default:
              return undefined;
          }
          
        }
      },
      {
        accessorKey: 'IssueDetails[0].level',
        header: 'رقم الحكم',
        cell({ row }) {
          return row.original.IssueDetails[0].refrance
        }
      },
      // {
      //   accessorKey: 'invitationType',
      //   header: 'نوع القضية',
      //   cell({ row }) {
      //     const { type, invitationType } = row.original

      //     // Define the options based on the 'type' value
      //     const optionsArray =
      //       type === 1
      //         ? [
      //             { label: 'جاني', value: 1 },
      //             { label: 'مجني عليه', value: 2 }
      //           ]
      //         : [
      //             { label: 'مدعي', value: 1 },
      //             { label: 'مدعي عليه', value: 2 }
      //           ]

      //     // Find the matching label
      //     const option = optionsArray.find((opt) => opt.value === invitationType)

      //     // Return the label or a default value
      //     return option ? option.label : ''
      //   }
      // },

      {
        id: 'actions',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-8 w-7" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="h-17 -mt-[70px] ml-7 min-w-[84.51px] p-0">
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Link to={`/state-affairs/info/${row.original.id}`}>تعديل</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <DeleteDialog
                  url={`/issue/${row.original?.id}`}
                  keys={['Issues']}
                  path={'state-affairs'}
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
        navigate(`/state-affairs/view-info/${original.id}`)
      }}
    />
  )
}
