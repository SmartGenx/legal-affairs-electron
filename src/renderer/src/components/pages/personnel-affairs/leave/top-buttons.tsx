import DirectSend from '@renderer/components/icons/directSend'
import { Button } from '@renderer/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import * as XLSX from 'xlsx'
import {  Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import LeaveTablePdf from './leave-table-pdf'
export interface Info {
  id: number
  employeeeId: number
  leaveTypeId: number
  dayNumber: number
  year: number
  startDate: Date
  endDate: Date
  leaveNote: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
  LeaveType: LeaveType
  employ: Employ
}

export interface LeaveType {
  id: number
  name: string
  defaultDay: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

export interface Employ {
  id: number
  name: string
  reference: string
  phone: string
  address: string
  dob: Date
  education: string
  megor: number
  graduationDate: Date
  idtype: number
  idNumber: string
  issuerDate: Date
  issuerPlace: string
  empLeaved: string
  empDgree: number
  position: string
  salary: number
  firstEmployment: Date
  employmentDate: Date
  currentUnit: number
  currentEmploymentDate: Date
  legalStatus: number
  employeeStatus: number
  detailsDate: Date
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}
export interface propDetails{
  data:Info[]
}
export default function TopButtons({data}:propDetails) {
  const [dataPrint, setDataPrint] = useState<Info[] | any[]>([])
  const componentRef = useRef<HTMLDivElement>(null);

const handlePrint = useReactToPrint({
  contentRef: componentRef,
});
useEffect(() => {
  if (data) {
    const dataToExport = data?.map((item) => {

      return {
        "id": item.id,
        "م الموظف": item.employ.reference,
        'الأسم': item.employ.name,
        'نوع الإجازة': item.LeaveType.name,
        'بداية الإجازة': String(item.startDate).split("T")[0],
        'نهاية الإجازة': String(item.endDate).split("T")[0],
      }
    })

    setDataPrint(dataToExport)
  }
}, [data])
const ExportCvs = () => {
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(dataPrint)
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  const fileName = 'كشف الإجــازات.xlsx'
  XLSX.writeFile(workbook, fileName)
}
  return (
    <div className="flex justify-between">
      <div className="text-3xl text-[#3734a9]">كشف الإجــازات</div>
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
                <LeaveTablePdf ref={componentRef} data={data || []} />
              </div>
              <DropdownMenuItem className=" flex gap-2">
                {/* <AccountBalanceIcon /> */}
                <button className='w-full text-start' onClick={ExportCvs}>ملف إكسل</button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Link to={'/personnel-affairs/add-leave'}>
          <Button className="text-sm h-11  bg-[#3734a9] mr-2 border-2 border-[#3734a9] text-[#fff] hover:bg-[#fff] hover:text-[#3734a9] rounded-[12px] sm:w-28 sm:text-[10px] lg:w-40 lg:text-sm">
            <h1 className="text-[14px] font-black">إدارة الأجازات</h1>
            <Plus className="mr-2" size={28} />
          </Button>
        </Link>
      </div>
    </div>
  )
}
