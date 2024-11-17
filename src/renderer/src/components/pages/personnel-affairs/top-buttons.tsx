import DirectSend from '@renderer/components/icons/directSend'
import { Button } from '@renderer/components/ui/button'
import { EmployInfo } from '@renderer/types'

import {  Plus } from 'lucide-react'
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
import EmpTablePdf from './add-employee/emp-table-pdf'

export interface propDetails{
  data:EmployInfo[]
}
export default function TopButtons({data}:propDetails) {
  const [dataPrint, setDataPrint] = useState<EmployInfo[] | any[]>([])
  const componentRef = useRef<HTMLDivElement>(null);

const handlePrint = useReactToPrint({
  contentRef: componentRef,
});
useEffect(() => {
  if (data) {
    const dataToExport = data?.map((item) => {

      return {
        "م الموظف": item.id,
        "الاسم": item.name,
        "العنوان": item.address,
        'تاريخ الميلاد': String(item.dob).split("T")[0],
        'نوع الوثيقة': item.idtype,
        'تاريخ الاصدار': String(item.employmentDate).split("T")[0],
      }
    })

    setDataPrint(dataToExport)
  }
}, [data])
const ExportCvs = () => {
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(dataPrint)
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  const fileName = 'كشف الموظفين.xlsx'
  XLSX.writeFile(workbook, fileName)
}
  return (
    <div className="flex justify-between">
      <div className="text-3xl text-[#3734a9]">كشف الموظفين</div>
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
                <button onClick={() => handlePrint()}>طباعة</button>
              </DropdownMenuItem>
              <div className="hidden">
                <EmpTablePdf ref={componentRef} data={data || []} />
              </div>
              <DropdownMenuItem className=" flex gap-2">
                {/* <AccountBalanceIcon /> */}
                <button onClick={ExportCvs}>الاكسل</button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        {/*  */}
        <Link to={'/personnel-affairs/add-employee'}>
          <Button className="text-sm h-11  bg-[#3734a9] mr-2 border-2 border-[#3734a9] text-[#fff] hover:bg-[#fff] hover:text-[#3734a9] rounded-[12px] sm:w-28 sm:text-[10px] lg:w-40 lg:text-sm">
            <h1 className="text-[13px] font-black">إضافة موظف</h1>
            <Plus className="mr-2" size={28} />
          </Button>
        </Link>
      </div>
    </div>
  )
}
