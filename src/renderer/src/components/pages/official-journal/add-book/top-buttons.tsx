import DirectSend from '@renderer/components/icons/directSend'
import { Button } from '@renderer/components/ui/button'
import { BookInfo } from '@renderer/types'
import { Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import * as XLSX from 'xlsx'
import AddBookPdf from './add-book-pdf'

export interface propDetails{
  data:BookInfo[]
}
export default function TopButtons({data}:propDetails) {
  const [dataPrint, setDataPrint] = useState<BookInfo[] | any[]>([])
  const componentRef = useRef<HTMLDivElement>(null);

const handlePrint = useReactToPrint({
  contentRef: componentRef,
});
useEffect(() => {
  if (data) {
    const dataToExport = data?.map((item) => {

      return {
        "id": item.id,
        "اسم الكتاب": item.name,
        'الكمية': item.quantity,
        'سعر النسخة': item.price,
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

  const fileName = 'جدول عرض الكتب.xlsx'
  XLSX.writeFile(workbook, fileName)
}
  return (
    <div className="flex justify-between">
      <div className="text-3xl text-[#3734a9]">جدول عرض الكتب</div>
      <div className="sm:flex flex-col-reverse lg:block md:block ">
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
                <AddBookPdf ref={componentRef} data={data || []} />
              </div>
              <DropdownMenuItem className=" flex gap-2">
                {/* <AccountBalanceIcon /> */}
                <button onClick={ExportCvs}>الاكسل</button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link to={'/official-journal/add-book'}>
          <Button className="text-sm h-11  bg-[#3734a9] mr-2 border-2 border-[#3734a9] text-[#fff] hover:bg-[#fff] hover:text-[#3734a9] rounded-[12px] sm:w-28 sm:text-[10px] lg:w-40 lg:text-sm">
            <h1 className="text-[14px] font-black">إضافة كتاب</h1>
            <Plus className="mr-2" size={28} />
          </Button>
        </Link>
      </div>
    </div>
  )
}
