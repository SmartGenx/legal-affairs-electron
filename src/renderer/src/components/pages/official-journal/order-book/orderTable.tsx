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
  bookId: number
  quantity: number
  customerId: number
  reference: string
  description: string
  sellingDate: Date
  orderNumber: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
  Customer: Customer
  Book: Book
}

export interface Book {
  id: number
  name: string
  quantity: number
  price: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

export interface Customer {
  id: number
  name: string
  type: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

export default function OrderBookTable({ info, page, total }: Props) {
  const navigate = useNavigate()
  const columns = React.useMemo<ColumnDef<Info>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'م',
        cell: ({ row }) => (row.index + 1 + (Number(page) - 1) * 10).toString().padStart(2, '0')
      },
      {
        accessorKey: 'Book.name',
        header: 'اسم الكتاب',
        cell: ({ row }) => {
          return row.original.Book.name
        }
      },
      {
        accessorKey: 'Customer.name',
        header: 'اسم المشتري',
        cell: ({ row }) => {
          return row.original.Customer.name
        }
      },
      {
        accessorKey: 'reference',
        header: 'رقم السند'
      },
      {
        accessorKey: 'Book.price',
        header: 'سعر الكتاب'
      },
      {
        accessorKey: 'orderNumber',
        header: 'رقم الصرف'
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
                <Link to={`/official-journal/update-order-book/${row.original.id}`}>عرض</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <DeleteDialog
                  url={`/book-order/${row.original?.id}`}
                  keys={['OrderBookResponse']}
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
      onRowClick={(_, { original }) => {
        navigate(`/official-journal/update-order-book/${original.id}`)
      }}
    />
  )
}
