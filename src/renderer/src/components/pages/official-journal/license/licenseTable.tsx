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
  licenseTypeId: number
  customerId: number
  licenseNumber: string
  licenseYear: number
  compnayPorpose: string
  compnayLocation: string
  compnayCapital: number
  compnayManger: string
  referenceNum: string
  referenceDate: Date
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
  licenseType: LicenseType
  Customer: Customer
}
export interface Customer {
  id: number
  name: string
  type?: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

export interface LicenseType {
  id: number
  name: string
  fees: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

export default function LicenseTable({ info, page, total, pageSize }: Props) {
  const navigate = useNavigate()
  const columns = React.useMemo<ColumnDef<Info>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'م',
        cell: ({ row }) => (row.index + 1 + (Number(page) - 1) * 10).toString().padStart(2, '0')
      },
      {
        accessorKey: 'customerId',
        header: 'اسم الشركة',
        cell: ({ row }) => {
          return row.original.Customer.name
        }
      },
      {
        accessorKey: 'licenseTypeId',
        header: 'نوع الترخيص',
        cell: ({ row }) => {
          return row.original.licenseType.name
        }
      },
      {
        accessorKey: 'licenseYear',
        header: 'السنة',
        cell: ({ row }) => {
          const year = row.original.licenseYear
          switch (year) {
            case 1:
              return 'يناير'
            case 2:
              return 'فبراير'
            case 3:
              return 'مارس'
            case 4:
              return 'أبريل'
            case 5:
              return ' 	مايو'
            case 6:
              return 'يونيو'
            case 7:
              return 'يوليو'
            case 8:
              return 'أغسطس'
            case 9:
              return 'سبتمبر'
            case 10:
              return 'أكتوبر'
            case 11:
              return 'نوفمبر'
            case 12:
              return 'ديسمبر'
            default:
              return 'الشهر غير معروف'
          }
        }
      },
      {
        accessorKey: 'licenseType.fees',
        header: 'رسوم النشر'
      },
      {
        accessorKey: 'licenseNumber',
        header: 'رقم الترخيص'
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
                <Link to={`/license/update-license/${row.original.id}`}>تعديل</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <DeleteDialog
                  url={`/license/${row.original?.id}`}
                  keys={['LicenseResponse']}
                  path={'official-journal'}
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
      pageSize={Number(pageSize)}
      onRowClick={(_, { original }) => {
        navigate(`/license/view-license/${original.id}`)
      }}
    />
  )
}
