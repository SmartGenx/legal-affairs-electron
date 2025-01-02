import React from 'react'
import logo from '../../../assets/images/المكتب كليشة-01.png'
import { InfoIssue } from '@renderer/types'
import { kind_of_case, Level } from '@renderer/types/enum'

type Props = {
  data: InfoIssue[]
}
const StataAffairsPdf = React.forwardRef<HTMLDivElement, Props>(function ComponentToPrint(
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
        <thead>
          <tr className="h-10 text-black border-2 border-gray-300 py-5 bg-[#eef0f8]">
            <th className='font-arial'>رقم</th>
            <th className="translate-x-4 font-arial">الأسم</th>
            <th className='font-arial translate-x-4'>الصفة</th>
            <th className='font-arial translate-x-4'>المرفق الحكومي</th>
            <th className='font-arial'>نوع القضية</th>
            <th className='font-arial translate-x-4'>درجة التقاضي</th>
            <th className='font-arial'>رقم الحكم</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className=" -translate-x-3 h-10 text-black border-2 border-gray-300 py-5"
            >
              <td className="px-2 font-arial">{index + 1}</td>
              <td className='font-arial'>{item.name}</td>
              <td className='font-arial'>{item.postion.name}</td>
              <td className='font-arial'>{item.governmentOffice.name}</td>
              <td className='font-arial'>
                {(() => {
                  switch (Number(item.type)) {
                    case kind_of_case.civilian:
                      return 'مدني'
                    case kind_of_case.criminal:
                      return 'جنائية'
                    case kind_of_case.administrative:
                      return 'إدارية'
                    case kind_of_case.business:
                      return 'تجارية'
                    default:
                      return ''
                  }
                })()}
              </td>
              <td className='font-arial'>
                {(() => {
                  switch (Number(item.IssueDetails[0].level)) {
                    case Level.appeal:
                      return 'إستئناف'
                    case Level.elementary:
                      return 'ابتدائي'
                    case Level.high:
                      return 'عليا'
                    default:
                      return ''
                  }
                })()}
              </td>
              <td className='font-arial'>{item.IssueDetails[0].refrance}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer for Print */}
      <div className="print-footer font-arial text-2xl font-medium">
        الجمهورية اليمنية - مكتب وزارة الشؤون القانونية - محافظة / حضرموت - تليفاكس (( 309020 ))
      </div>
    </div>
  )
})
export default StataAffairsPdf
