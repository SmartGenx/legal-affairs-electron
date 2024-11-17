import React from 'react'
import logo from '../../../../assets/images/logo-icon.svg'

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
    <div ref={ref} className="w-[95%] mx-auto h-full">
      <div className="w-full h-[150px]  mb-7 flex items-end">
        <p className="basis-[40%] font-extrabold">{String(date)}</p>
        <div className="basis-[40%]">
          <img src={logo} className=" w-[40%] h-[40%] object-cover " />
        </div>
        <p className="basis-[20%] font-extrabold">كشف الإجــازات</p>
      </div>
      <table dir="rtl" className="w-full h-full rounded-t-lg">
        <tr className="  h-10 text-black border-2 border-gray-300 py-5 bg-[#eef0f8]">
          <th>رقم</th>
          <th>م الموظف</th>
          <th>الأسم</th>
          <th>نوع الإجازة</th>
          <th>بداية الإجازة</th>
          <th>نهاية الإجازة</th>
        </tr>
        {data.map((item, index) => (
          // eslint-disable-next-line react/jsx-key
          <tr className=" -translate-x-3 h-10 text-black border-2 border-gray-300 py-5">
            <td className="px-2">{index + 1}</td>
            <td>{item.employ.reference}</td>
            <td>{item.employ.name}</td>
            <td>{item.LeaveType.name}</td>
            <td>{String(item.startDate).split("T")[0]}</td>
            <td>{String(item.endDate).split("T")[0]}</td>
          </tr>
        ))}
      </table>
    </div>
  )
})
export default LeaveTablePdf
