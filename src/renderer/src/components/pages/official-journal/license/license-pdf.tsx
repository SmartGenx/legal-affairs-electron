import React from 'react'
import logo from '../../../../assets/images/logo-icon.svg'

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
type Props = {
  data: Info[]
}
const LicensePdf = React.forwardRef<HTMLDivElement, Props>(function ComponentToPrint(
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
        <p className="basis-[20%] font-extrabold">جدول التراخيص</p>
      </div>
      <table dir="rtl" className="w-full h-full rounded-t-lg">
        <tr className="  h-10 text-black border-2 border-gray-300 py-5 bg-[#eef0f8]">
          <th>رقم</th>
          <th>اسم الشركة</th>
          <th>نوع الترخيص</th>
          <th>السنة</th>
          <th>رسوم النشر</th>
          <th>رقم الترخيص</th>
        </tr>
        {data.map((item, index) => (
          // eslint-disable-next-line react/jsx-key
          <tr className=" -translate-x-3 h-10 text-black border-2 border-gray-300 py-5">
            <td className="px-2">{index + 1}</td>
            <td>{item.Customer.name}</td>
            <td>{item.licenseType.name}</td>
            <td>{item.licenseYear}</td>
            <td>{item.licenseType.fees}</td>
            <td>{item.referenceNum}</td>
          </tr>
        ))}
      </table>
    </div>
  )
})
export default LicensePdf
