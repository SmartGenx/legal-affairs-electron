import React from 'react'
import logo from '../../../../assets/images/logo-icon.svg'
import {   EmployInfo } from '@renderer/types'

type Props = {
  data: EmployInfo[]
}
const EmpTablePdf = React.forwardRef<HTMLDivElement, Props>(function ComponentToPrint(
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
        <p className="basis-[20%] font-extrabold">كشف الموظفين</p>
      </div>
      <table dir="rtl" className="w-full h-full rounded-t-lg">
        <tr className="  h-10 text-black border-2 border-gray-300 py-5 bg-[#eef0f8]">
          <th>م الموظف</th>
          <th >الاسم</th>
          <th>العنوان</th>
          <th>تاريخ الميلاد</th>
          <th>نوع الوثيقة</th>
          <th>تاريخ الاصدار</th>
        </tr>
        {data.map((item) => (
          
          // eslint-disable-next-line react/jsx-key
          <tr className=" -translate-x-3 h-10 text-black border-2 border-gray-300 py-5">
            <td className="px-2">{item.id}</td>
            <td>{item.name}</td>
            <td>{item.address}</td>
            <td>{new Date(item.dob).toISOString().split('T')[0]}</td>
            <td>{item.idtype}</td>
            <td>{new Date(item.employmentDate).toISOString().split('T')[0]}</td>
          </tr>
        ))}
      </table>
    </div>
  )
})
export default EmpTablePdf