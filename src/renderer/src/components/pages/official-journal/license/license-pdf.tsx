import React from 'react'
import logo from '../../../../assets/images/المكتب كليشة-01.png'

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
  id: number
  name: string
  type?: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
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
          <th className="translate-x-5 font-arial">اسم الشركة</th>
          <th className="translate-x-6 font-arial">نوع الترخيص</th>
          <th className="translate-x-2 font-arial">السنة</th>
          <th className="translate-x-4 font-arial">رسوم النشر</th>
          <th className="translate-x-6 font-arial">رقم الترخيص</th>
        </tr>
        {data.map((item, index) => (
          // eslint-disable-next-line react/jsx-key
          <tr className=" -translate-x-3 h-10 text-black border-2 border-gray-300 py-5">
            <td className="px-2 font-arial">{index + 1}</td>
            <td className='font-arial'>{item.Customer.name}</td>
            <td className='font-arial'>{item.licenseType.name}</td>
            <td className='font-arial'>
              {(() => {
                switch (Number(item.licenseYear)) {
                  case 1:
                    return 'يناير'
                  case 2:
                    return 'فبراير'
                  case 3:
                    return 'مارس'
                  case 4:
                    return 'أبريل'
                  case 5:
                    return ' 	مايو'
                  case 6:
                    return 'يونيو'
                  case 7:
                    return 'يوليو'
                  case 8:
                    return 'أغسطس'
                  case 9:
                    return 'سبتمبر'
                  case 10:
                    return 'أكتوبر'
                  case 11:
                    return 'نوفمبر'
                  case 12:
                    return 'ديسمبر'
                  default:
                    return 'الشهر غير معروف'
                }
              })()}
            </td>
            <td className='font-arial'>{item.licenseType.fees}</td>
            <td className='font-arial'>{item.referenceNum}</td>
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
export default LicensePdf
