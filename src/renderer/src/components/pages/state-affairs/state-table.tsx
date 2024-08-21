'use client'
import * as React from 'react'
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

  const columns = React.useMemo<ColumnDef<Issues>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'الرقم',
        cell: ({ row }) => (row.index + 1 + (page - 1) * 10).toString().padStart(2, '0')
      },
      {
        header: 'اسم الجهة',
        cell: ({ row }) => (
          <div className="flex w-fit items-center gap-2">
            <Avatar className="bg-black">
              <AvatarImage
              //   src={row.original?.logo} alt={row.original?.arabicName}
              />
              <AvatarFallback className="bg-secondary"></AvatarFallback>
            </Avatar>
            <h1>{/* {row.original?.arabicName} */}</h1>
          </div>
        )
      },
      {
        accessorKey: 'orgType.name',
        header: 'النوع'
      },
      {
        accessorKey: 'orgActive.name',
        header: 'النشاط'
      },
      {
        accessorKey: 'fieldsOrgs',
        header: 'المجال',
        cell: ({ row }) => {
          //   const fields = row.original?.fieldsOrgs
          return (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-base font-medium">
                    {/* {fields?.length > 1 ? (
                      <>
                        <span className="text-primary-500 ms-1 ">متعدد</span>
                      </>
                    ) : (
                      <>{fields[0]?.fieldsType.name}</>
                    )} */}
                  </span>
                </TooltipTrigger>

                {/* {fields?.length > 1 && (
                  <TooltipContent className="m-2 p-2">
                    {fields?.slice(1)?.map((field, i) => (
                      <span key={i}>
                        {field.fieldsType.name}
                        {i !== fields?.length - 2 && ', '}
                      </span>
                    ))}
                  </TooltipContent>
                )} */}
              </Tooltip>
            </TooltipProvider>
          )
        }
      },
      {
        accessorKey: 'orgScope',
        header: 'النطاق'
        // cell: ({ row }) => orgScope[row.original?.orgScope as keyof typeof orgScope] ?? ' - '
      },
      {
        accessorKey: 'status',
        header: 'حالة الترخيص ',
        cell: ({ row }) => {
          //   const statusObj = enumData.licenseStatus?.find(
          //     (status) => status.value == row.original?.licenseStatus
          //   )

          return (
            <Badge
            //   className={cn(
            // 'flex h-fit w-24 items-center justify-center px-4 py-1 text-base font-medium',
            // {
            //   'text-on-success-container': row.original?.licenseStatus === 2,
            //   'text-on-error-container': row.original?.licenseStatus === 3
            // }
            //   )}
            //   variant={
            //     row.original?.licenseStatus === 3
            //       ? 'destructive'
            //       : row.original?.licenseStatus === 2
            //         ? 'success'
            //         : null
            //   }
            >
              {/* {statusObj?.label} */}
            </Badge>
          )
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
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    ],
    [page]
  )

  return (
    // <OrganizationTable
    //   columns={columns}
    //   data={data}
    //   page={page.toString()}
    //   total={total}
    //   onRowClick={(_, { original }) => {
    // navigate(`/${original.id}`)
    //   }}
    // />
    <>
      {info.map((el) => (
        <span>{el.name}</span>
      ))}
    </>
  )
}
