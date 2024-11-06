import React, { useEffect, useState } from 'react'
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
import { BookInfo, ComplaintInfo } from '../../../../types/index'
import { Button } from '../../../ui/button'
import { axiosInstance } from '@renderer/lib/http'
import { useAuthHeader } from 'react-auth-kit'
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

export default function OrderBookTable({ info, page, total, pageSize }: Props) {
  const navigate = useNavigate()
  const authToken = useAuthHeader()
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
        accessorKey: 'quantity',
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
                <Link to={`/official-journal/book-info/${row.original.id}`}>عرض</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <DeleteDialog
                  url={`/book/${row.original?.id}`}
                  keys={['Books']}
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
        navigate(`/official-journal/view-book/${original.id}`)
      }}
    />
  )
}
