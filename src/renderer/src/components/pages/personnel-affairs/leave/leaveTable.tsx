import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../ui/dropdown-menu'
import { OrganizationTable } from '../organizationTable'
import { Button } from '../../../ui/button'
import DeleteDialog from '@renderer/components/dialog/delete-dialog'

type Props = {
  info: Info[]
  total: number
  page: string
  pageSize: string
}

export interface Info {
  id: number
  employeeeId: number
  leaveTypeId: number
  dayNumber: number
  year: number
  startDate: Date
  endDate: Date
  leaveNote: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
  LeaveType: LeaveType
  employ: Employ
}

export interface LeaveType {
  id: number
  name: string
  defaultDay: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

export interface Employ {
  id: number
  name: string
  reference: string
  phone: string
  address: string
  dob: Date
  education: string
  megor: number
  graduationDate: Date
  idtype: number
  idNumber: string
  issuerDate: Date
  issuerPlace: string
  empLeaved: string
  empDgree: number
  position: string
  salary: number
  firstEmployment: Date
  employmentDate: Date
  currentUnit: number
  currentEmploymentDate: Date
  legalStatus: number
  employeeStatus: number
  detailsDate: Date
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

export default function LeaveTable({ info, page, total }: Props) {
  const navigate = useNavigate()
  const columns = React.useMemo<ColumnDef<Info>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'م',
        cell: ({ row }) => (row.index + 1 + (Number(page) - 1) * 10).toString().padStart(2, '0')
      },
      {
        accessorKey: 'employ.reference',
        header: 'م الموظف',
        cell: ({ row }) => {
          return row.original.employ.reference
        }
      },
      {
        accessorKey: 'employ.name',
        header: 'الأسم',
        cell: ({ row }) => {
          return row.original.employ.name
        }
      },
      {
        accessorKey: 'LeaveType.name',
        header: 'نوع الإجازة'
      },
        {
          accessorKey: 'startDate',
          header: 'بداية الإجازة',
          cell: ({ row }) => {
            return String(row.original.startDate).split("T")[0]
          }
        },
        {
          accessorKey: 'endDate',
          header: 'نهاية الإجازة',
          cell: ({ row }) => {
            return String(row.original.endDate).split("T")[0]
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
                <Link to={`/personnel-affairs/view-leave/${row.original.id}`}>عرض</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <DeleteDialog
                  url={`/leave-details/${row.original?.id}`}
                  keys={['leaveAllocation']}
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
        navigate(`/personnel-affairs/update-leave/${original.id}`)
      }}
    />
  )
}
