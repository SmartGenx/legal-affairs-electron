import React, { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../ui/dropdown-menu'
import { OrganizationTable } from './organizationTable'
import { ComplaintInfo } from '../../../types/index'
import { Button } from '../../ui/button'
import { axiosInstance } from '@renderer/lib/http'
import { useAuthHeader } from 'react-auth-kit'

type Props = {
  info: ComplaintInfo[]
  page: number
  pageSize: string
  total: string
}
export interface ReferenceProp {
  id: number
  name: string
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}
export default function AlLftaTable({ info, page, total, pageSize }: Props) {
  const navigate = useNavigate()
  const authToken = useAuthHeader()
  const columns = React.useMemo<ColumnDef<ComplaintInfo>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'م',
        cell: ({ row }) => (row.index + 1 + (page - 1) * 10).toString().padStart(2, '0')
      },
      {
        accessorKey: 'name',
        header: 'مقدم الشكوى'
      },
      {
        accessorKey: 'governmentOfficeId',
        header: 'مصدر التوجية',
        cell: ({ row }) => {
          const [data, setData] = useState<ReferenceProp>()
          const fetchData = async () => {
            try {
              const response = await axiosInstance.get(
                `/government-office/${row.original.governmentOfficeId}`,
                {
                  headers: {
                    Authorization: `${authToken()}`
                  }
                }
              )
              setData(response.data)
            } catch (error) {
              console.error('Error fetching data:', error)
            }
          }
          useEffect(() => {
            fetchData()
          }, [])

          return data?.name
        }
      },
      {
        accessorKey: 'title',
        header: 'موضوع الشكوى'
      },
      {
        accessorKey: 'date',
        header: 'تاريخ رأي المكتب',
        cell: ({ row }) => {
          const date = row.original.date
          return new Date(date).toISOString().split('T')[0]
        }
      },
      {
        accessorKey: 'officeOpinian',
        header: 'نص رأي المكتب'
      },
      {
        accessorKey: 'createdAt',
        header: 'تاريخ الإضافة',
        cell: ({ row }) => {
          const date = row.original.createdAt
          return new Date(date).toISOString().split('T')[0]
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
        navigate(`/the-department-of-al-lfta/info/${original.id}`)
      }}
    />
  )
}
