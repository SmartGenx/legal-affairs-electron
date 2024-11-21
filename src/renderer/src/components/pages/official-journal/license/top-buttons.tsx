import DirectSend from '@renderer/components/icons/directSend'
import { Button } from '@renderer/components/ui/button'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import * as XLSX from 'xlsx'
import { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import LicensePdf from './license-pdf'
export interface Info {
  id: number
  licenseTypeId: number
  customerId: number
  licenseNumber: string
  licenseYear: number
  compnayPorpose: string
  compnayLocation: string
  compnayCapital: number
  compnayManger: string
  referenceNum: string
  referenceDate: Date
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
  licenseType: LicenseType
  Customer: Customer
}
export interface Customer {
  id:        number;
  name:      string;
  type?:     number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface LicenseType {
  id: number
  name: string
  fees: number
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
        "اسم الشركة": item.Customer.name,
        'نوع الترخيص': item.licenseType.name,
        'السنة': item.licenseYear,
        'رسوم النشر': item.licenseType.fees,
        'رقم الترخيص': item.referenceNum,
      }
    })

    setDataPrint(dataToExport)
  }
}, [data])
const ExportCvs = () => {
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(dataPrint)
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  const fileName = 'جدول التراخيص.xlsx'
  XLSX.writeFile(workbook, fileName)
}
  return (
    <div className="flex justify-between">
      <div className="text-3xl text-[#3734a9]">جدول التراخيص</div>
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
                <button className='w-full text-start' onClick={() => handlePrint()}>طباعة</button>
              </DropdownMenuItem>
              <div className="hidden">
                <LicensePdf ref={componentRef} data={data || []} />
              </div>
              <DropdownMenuItem className=" flex gap-2">
                {/* <AccountBalanceIcon /> */}
                <button className='w-full text-start' onClick={ExportCvs}>ملف إكسل</button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link to={'/license/add-license'}>
          <Button className="text-sm h-11  bg-[#3734a9] mr-2 border-2 border-[#3734a9] text-[#fff] hover:bg-[#fff] hover:text-[#3734a9] rounded-[12px] sm:w-28 sm:text-[10px] lg:w-40 lg:text-sm">
            <h1 className="text-[13px] font-black">إضافة ترخيص</h1>
            <Plus className="mr-2" size={28} />
          </Button>
        </Link>
      </div>
    </div>
  )
}
