import DirectSend from '@renderer/components/icons/directSend'
import { Button } from '@renderer/components/ui/button'

import {  Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
// export interface Info {
//   id: number
//   employeeeId: number
//   leaveTypeId: number
//   dayNumber: number
//   year: number
//   startDate: Date
//   endDate: Date
//   leaveNote: string
//   createdAt: Date
//   updatedAt: Date
//   isDeleted: boolean
//   LeaveType: LeaveType
//   employ: Employ
// }

// export interface LeaveType {
//   id: number
//   name: string
//   defaultDay: number
//   createdAt: Date
//   updatedAt: Date
//   isDeleted: boolean
// }

// export interface Employ {
//   id: number
//   name: string
//   reference: string
//   phone: string
//   address: string
//   dob: Date
//   education: string
//   megor: number
//   graduationDate: Date
//   idtype: number
//   idNumber: string
//   issuerDate: Date
//   issuerPlace: string
//   empLeaved: string
//   empDgree: number
//   position: string
//   salary: number
//   firstEmployment: Date
//   employmentDate: Date
//   currentUnit: number
//   currentEmploymentDate: Date
//   legalStatus: number
//   employeeStatus: number
//   detailsDate: Date
//   createdAt: Date
//   updatedAt: Date
//   isDeleted: boolean
// }
// export interface propDetails{
//   data:Info[]
// }
export default function TopButtons() {
//   const [dataPrint, setDataPrint] = useState<Info[] | any[]>([])
//   const componentRef = useRef<HTMLDivElement>(null);

// const handlePrint = useReactToPrint({
//   contentRef: componentRef,
// });
// useEffect(() => {
//   if (data) {
//     const dataToExport = data?.map((item) => {

//       return {
//         "id": item.id,
//         // "اسم الكتاب": item.Book.name,
//         // 'اسم المشتري': item.quantity,
//         // 'رقم السند': item.reference,
//         // 'سعر الكتاب': item.Book.price,
//         // 'رقم الصرف': item.orderNumber,
//       }
//     })

//     setDataPrint(dataToExport)
//   }
// }, [data])
// const ExportCvs = () => {
//   const workbook = XLSX.utils.book_new()
//   const worksheet = XLSX.utils.json_to_sheet(dataPrint)
//   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

//   const fileName = 'جدول مبيعات الكتب.xlsx'
//   XLSX.writeFile(workbook, fileName)
// }
  return (
    <div className="flex justify-between">
      <div className="text-3xl text-[#3734a9]">كشف الموظفين</div>
      <div className="sm:flex flex-col-reverse lg:block md:block">
        <Button className="text-sm h-10  bg-[#fff] border-2 border-[#3734a9] text-[#3734a9] hover:bg-[#3734a9] hover:text-[#fff] rounded-[12px] sm:w-28 sm:text-[10px] lg:w-40 lg:text-sm">
          تصدير الكشف
          <DirectSend className="mr-2" />
        </Button>
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
