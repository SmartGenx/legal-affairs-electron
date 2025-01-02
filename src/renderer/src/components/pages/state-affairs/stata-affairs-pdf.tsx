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
  return (
    <div ref={ref} className="w-[95%] mx-auto h-full">
      <div className="w-full h-[150px]  mb-7 flex items-end">
        <div className="basis-[40%] font-extrabold text-end -translate-x-3">
          <p className="mb-1"> : الرقم</p>
          <p className="mb-1"> : التاريخ</p>
          <p> : الموافق</p>
        </div>
        <div className="basis-[20%]">
          <img src={logo} className=" w-[100%] h-[100%] object-cover " />
        </div>
        <div className="basis-[40%] text-center">
          <p className="basis-[20%] text-lg font-medium mb-1">الجمهورية اليمنية</p>
          <p className="basis-[20%] text-lg font-black mb-1">مكتب وزارة الشؤون القانونية</p>
          <p className="basis-[20%] text-lg font-medium">ساحل محافظة حضرموت</p>
        </div>
      </div>
      <table dir="rtl" className="w-full h-full rounded-t-lg">
        <tr className="  h-10 text-black border-2 border-gray-300 py-5 bg-[#eef0f8]">
          <th>رقم</th>
          <th className="translate-x-4">الأسم</th>
          <th>الصفة</th>
          <th>المرفق الحكومي</th>
          <th>نوع القضية</th>
          <th>درجة التقاضي</th>
          <th>رقم الحكم</th>
        </tr>
        {data.map((item, index) => (
          // eslint-disable-next-line react/jsx-key
          <tr className=" -translate-x-3 h-10 text-black border-2 border-gray-300 py-5">
            <td className="px-2">{index + 1}</td>
            <td>{item.name}</td>
            <td>{item.postion.name}</td>
            <td>{item.governmentOffice.name}</td>
            <td>
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
            <td>
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
            <td>{item.IssueDetails[0].refrance}</td>
          </tr>
        ))}
      </table>
    </div>
  )
})
export default StataAffairsPdf
