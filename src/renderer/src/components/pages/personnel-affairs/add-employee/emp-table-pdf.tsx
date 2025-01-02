import React from 'react'
import logo from '../../../../assets/images/المكتب كليشة-01.png'
import { EmployInfo } from '@renderer/types'

type Props = {
  data: EmployInfo[]
}
const EmpTablePdf = React.forwardRef<HTMLDivElement, Props>(function ComponentToPrint(
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
          <th className='font-arial'>م الموظف</th>
          <th className="translate-x-4 font-arial">الاسم</th>
          <th className="translate-x-4 font-arial">العنوان</th>
          <th className="translate-x-4 font-arial">تاريخ الميلاد</th>
          <th className="translate-x-4 font-arial">نوع الوثيقة</th>
          <th className="translate-x-4 font-arial">تاريخ الاصدار</th>
        </tr>
        {data.map((item) => (
          // eslint-disable-next-line react/jsx-key
          <tr className=" -translate-x-3 h-10 text-black border-2 border-gray-300 py-5">
            <td className="px-2 font-arial">{item.id}</td>
            <td className='font-arial'>{item.name}</td>
            <td className='font-arial'>{item.address}</td>
            <td className='font-arial'>{new Date(item.dob).toISOString().split('T')[0]}</td>
            <td className='font-arial'>
              {(() => {
                switch (Number(item.idtype)) {
                  case 1:
                    return 'بطاقة'
                  case 2:
                    return 'جواز'
                  case 3:
                    return 'شهادة ميلاد'
                  default:
                    return ''
                }
              })()}
            </td>
            <td className='font-arial'>{new Date(item.employmentDate).toISOString().split('T')[0]}</td>
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
export default EmpTablePdf
