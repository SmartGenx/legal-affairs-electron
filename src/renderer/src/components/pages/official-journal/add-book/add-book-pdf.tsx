import React from 'react'
import logo from '../../../../assets/images/المكتب كليشة-01.png'
import { BookInfo } from '@renderer/types'

type Props = {
  data: BookInfo[]
}
const AddBookPdf = React.forwardRef<HTMLDivElement, Props>(function ComponentToPrint(
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
          <th className="font-arial">رقم</th>
          <th className="translate-x-14 font-arial">اسم الكتاب</th>
          <th className="translate-x-5 font-arial">الكمية</th>
          <th className="translate-x-10 font-arial">سعر النسخة</th>
          <th className="translate-x-11 font-arial">تاريخ الإضافة</th>
        </tr>
        {data.map((item, index) => (
          // eslint-disable-next-line react/jsx-key
          <tr className=" -translate-x-3 h-10 text-black border-2 border-gray-300 py-5">
            <td className="px-2 font-arial">{index + 1}</td>
            <td className="font-arial">{item.name}</td>
            <td className="font-arial">{item.quantity}</td>
            <td className="font-arial">{item.price}</td>
            <td className="font-arial">{new Date(item.createdAt).toISOString().split('T')[0]}</td>
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
export default AddBookPdf
