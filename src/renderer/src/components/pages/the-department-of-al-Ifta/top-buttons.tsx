import DirectSend from '@renderer/components/icons/directSend'
import { Button } from '@renderer/components/ui/button'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { ComplaintInfo } from '@renderer/types'
import { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import * as XLSX from 'xlsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import TheDepartmentOfAlIftaPdf from './the-department-of-al-Ifta-pdf'

export interface propDetails {
  data: ComplaintInfo[]
}
export default function TopButtons({ data }: propDetails) {
  const [dataPrint, setDataPrint] = useState<ComplaintInfo[] | any[]>([])
  const componentRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: componentRef
  })

  useEffect(() => {
    if (data) {
      const dataToExport = data?.map((item) => {
        return {
          "م": item.id,
          'مقدم الرأي': item.name,
          'مصدر التوجية': item.governmentOffice.name,
          'موضوع الرأي': item.title,
          'رقم الرأي': item.refrance,
          'تاريخ الرأي والإفتاء': new Date(item.date).toISOString().split('T')[0]
        }
      })

      setDataPrint(dataToExport)
    }
  }, [data])
  const ExportCvs = () => {
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(dataPrint)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

    const fileName = 'الآراء والفتوى.xlsx'
    XLSX.writeFile(workbook, fileName)
  }
  return (
    <div className="flex justify-between">
      <div className="text-3xl text-[#3734a9]">الآراء والفتوى</div>
      <div className="sm:flex flex-col-reverse lg:block md:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="text-sm h-11  bg-[#fff] border-2 border-[#3734a9] text-[#3734a9] hover:bg-[#3734a9] hover:text-[#fff] rounded-[12px] sm:w-28 sm:text-[10px] lg:w-40 lg:text-sm">
              <h1 className="text-[13px] font-black">تصدير الكشف</h1>
              <DirectSend className="mr-2 " />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[180px]">
            <DropdownMenuGroup>
              <DropdownMenuItem className=" flex gap-2">
                <button className="w-full text-start" onClick={() => handlePrint()}>
                  طباعة
                </button>
              </DropdownMenuItem>
              <div className="hidden">
                <TheDepartmentOfAlIftaPdf ref={componentRef} data={data || []} />
              </div>
              <DropdownMenuItem className=" flex gap-2">
                {/* <AccountBalanceIcon /> */}
                <button className="w-full text-start" onClick={ExportCvs}>
                  ملف إكسل
                </button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link to={'/the-department-of-al-lfta/add-complaint'}>
          <Button className="text-sm h-11  bg-[#3734a9] relative mr-2 border-2 border-[#3734a9] text-[#fff] hover:bg-[#fff] hover:text-[#3734a9] rounded-[12px] sm:w-28 sm:text-[10px] lg:w-40 lg:text-sm">
            <h1 className="text-[13px] font-black ml-5">إضافة رأي</h1>
            <Plus className="ml-2 absolute left-2" size={28} />
          </Button>
        </Link>
      </div>
    </div>
  )
}
