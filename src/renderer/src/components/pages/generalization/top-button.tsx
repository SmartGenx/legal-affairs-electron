import DirectSend from '@renderer/components/icons/directSend'
import { Button } from '@renderer/components/ui/button'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { GeneralizationInfo } from '@renderer/types'
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
import GeneralizationPdf from './generalization-pdf'


export interface propDetails{
  data:GeneralizationInfo[]
}
export default function TopButtons({data}:propDetails) {
  const [dataPrint, setDataPrint] = useState<GeneralizationInfo[] | any[]>([])
  const componentRef = useRef<HTMLDivElement>(null);

const handlePrint = useReactToPrint({
  contentRef: componentRef,
});
useEffect(() => {
  if (data) {
    const dataToExport = data?.map((item) => {

      return {
        "م": item.id,
        "موضوع التعميم": item.title,
        'رقم التعميم': item.refrance,
        'تاريخ الإضافة': new Date(item.createdAt).toISOString().split('T')[0],
      }
    })

    setDataPrint(dataToExport)
  }
}, [data])
const ExportCvs = () => {
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(dataPrint)
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  const fileName = 'جدول التعميمات.xlsx'
  XLSX.writeFile(workbook, fileName)
}
  return (
    <div className="flex justify-between">
      <div className="text-3xl text-[#3734a9]">جدول التعميمات</div>
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
                <button className='w-full text-start' onClick={() => handlePrint()}>طباعة</button>
              </DropdownMenuItem>
              <div className="hidden">
                <GeneralizationPdf ref={componentRef} data={data || []} />
              </div>
              <DropdownMenuItem className=" flex gap-2">
                {/* <AccountBalanceIcon /> */}
                <button className='w-full text-start' onClick={ExportCvs}>ملف إكسل</button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link to={'/generalization/add-generalization'}>
          <Button className="text-sm mr-2  h-10 bg-[#3734a9] hover:border-2 hover:border-[#fff] hover:bg-[#2e2b8b] hover:text-[#fff] rounded-[12px] sm:w-28 sm:text-[10px] lg:w-40 lg:text-sm">
            إضافة تعميم
            <Plus className="mr-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
