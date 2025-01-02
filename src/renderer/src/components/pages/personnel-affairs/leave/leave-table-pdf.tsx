import React from 'react'
import logo from '../../../../assets/images/المكتب كليشة-01.png'

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
type Props = {
  data: Info[]
}
const LeaveTablePdf = React.forwardRef<HTMLDivElement, Props>(function ComponentToPrint(
  { data },
  ref
) {
  const date = new Date().toISOString().split('T')[0]
  return (
    <div ref={ref} className="w-[95%] mx-auto h-full relative">
      <div className="w-full h-[150px]  mb-7 flex items-end">
        <div className="basis-[40%] font-extrabold text-end -translate-x-6">
          <p className="mb-1 font-arial"> : الرقم</p>
          <p className="mb-1 font-arial">{date} : التاريخ</p>
          <p className="font-arial"> : الموافق</p>
        </div>
        <div className="basis-[20%]">
          <img src={logo} className=" w-[100%] h-[100%] object-cover " alt="Logo" />
        </div>
        <div className="basis-[40%] text-center">
          <p className="basis-[20%] text-xl font-bo mb-1 font-arial">الجمهورية اليمنية</p>
          <p className="basis-[20%] text-xl font-black mb-1 font-arial">
            مكتب وزارة الشؤون القانونية
          </p>
          <p className="basis-[20%] text-xl font-medium font-arial">ساحل محافظة حضرموت</p>
        </div>
      </div>
      <div className="h-2 bg-black w-full"></div>
      <div className="h-[1px] bg-black w-full mt-1 mb-2"></div>
      <table dir="rtl" className="w-full h-full rounded-t-lg">
        <tr className="  h-10 text-black border-2 border-gray-300 py-5 bg-[#eef0f8]">
          <th className='font-arial'>رقم</th>
          <th className="translate-x-6 font-arial">م الموظف</th>
          <th className="translate-x-4 font-arial">الأسم</th>
          <th className="translate-x-4 font-arial">نوع الإجازة</th>
          <th className="translate-x-6 font-arial">بداية الإجازة</th>
          <th className="translate-x-6 font-arial">نهاية الإجازة</th>
        </tr>
        {data.map((item, index) => (
          // eslint-disable-next-line react/jsx-key
          <tr className=" -translate-x-3 h-10 text-black border-2 border-gray-300 py-5">
            <td className="px-2 font-arial">{index + 1}</td>
            <td className='font-arial'>{item.employ.reference}</td>
            <td className='font-arial'>{item.employ.name}</td>
            <td className='font-arial'>{item.LeaveType.name}</td>
            <td className='font-arial'>{String(item.startDate).split('T')[0]}</td>
            <td className='font-arial'>{String(item.endDate).split('T')[0]}</td>
          </tr>
        ))}
      </table>
      {/* Footer for Print */}
      <div className="print-footer font-arial text-2xl font-medium">
        الجمهورية اليمنية - مكتب وزارة الشؤون القانونية - محافظة / حضرموت - تليفاكس (( 309020 ))
      </div>
    </div>
  )
})
export default LeaveTablePdf
