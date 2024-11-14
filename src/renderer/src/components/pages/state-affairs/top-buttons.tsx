import DirectSend from '@renderer/components/icons/directSend'
import { Button } from '@renderer/components/ui/button'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { InfoIssue } from '@renderer/types'
import * as XLSX from 'xlsx'
import { useEffect, useRef, useState } from 'react'
import { kind_of_case, Level } from '@renderer/types/enum'
import {useReactToPrint} from 'react-to-print'
import StataAffairsPdf from './stata-affairs-pdf'
export interface propDetails {
  data: InfoIssue[]
}
export default function TopButtons({ data }: propDetails) {
  const [dataPrint, setDataPrint] = useState<InfoIssue[] | any[]>([])
  const componentRef = useRef<HTMLDivElement>(null);

const handlePrint = useReactToPrint({
  contentRef: componentRef,
});

  useEffect(() => {
    if (data) {
      const dataToExport = data?.map((item) => {
        const typeExcal = item.type
        const levelExcal = item.IssueDetails[0].level
        return {
          "id": item.id,
          "الأسم": item.name,
          "الصفة": item.postion.name,
          'المرفق الحكومي': item.governmentOffice.name,
          'نوع القضية': (() => {
            switch (typeExcal) {
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
          })(),
          'درجة التقاضي': (() => {
            switch (levelExcal) {
              case Level.appeal:
                return 'إستئناف'
              case Level.elementary:
                return 'ابتدائي'
              case Level.high:
                return 'عليا'
              default:
                return ''
            }
          })(),
          'رقم الحكم': item.IssueDetails[0].refrance
        }
      })

      setDataPrint(dataToExport)
    }
  }, [data])
  const ExportCvs = () => {
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(dataPrint)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

    const fileName = 'جدول قضايا الدولة.xlsx'
    XLSX.writeFile(workbook, fileName)
  }
  return (
    <div className="flex justify-between">
      <div className="text-3xl text-[#3734a9]">جدول قضايا الدولة</div>
      <div className="sm:flex flex-col-reverse lg:block md:block ">
        {/*  */}
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
                <button onClick={() => handlePrint()}>طباعة</button>
              </DropdownMenuItem>
              <div className="hidden">
                <StataAffairsPdf ref={componentRef} data={data || []} />
              </div>
              <DropdownMenuItem className=" flex gap-2">
                {/* <AccountBalanceIcon /> */}
                <button onClick={ExportCvs}>الاكسل</button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link to={'/state-affairs/info/add'}>
          <Button className="text-sm h-11  bg-[#3734a9] mr-2 border-2 border-[#3734a9] text-[#fff] hover:bg-[#fff] hover:text-[#3734a9] rounded-[12px] sm:w-28 sm:text-[10px] lg:w-40 lg:text-sm">
            <h1 className="text-[14px] font-black">إضافة قضية</h1>
            <Plus className="mr-2" size={28} />
          </Button>
        </Link>
      </div>
    </div>
  )
}
