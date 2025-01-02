import React from 'react'
import logo from '../../../../assets/images/المكتب كليشة-01.png'

export interface OrderBookResponse {
  info: Info[]
  total: number
  page: string
  pageSize: string
}

export interface Info {
  id: number
  bookId: number
  quantity: number
  customerId: number
  reference: string
  description: string
  sellingDate: Date
  orderNumber: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
  Customer: Customer
  Book: Book
}

export interface Book {
  id: number
  name: string
  quantity: number
  price: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

export interface Customer {
  id: number
  name: string
  type: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}
type Props = {
  data: Info[]
}
const OrderBookPdf = React.forwardRef<HTMLDivElement, Props>(function ComponentToPrint(
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
          <th className="translate-x-3 font-arial">اسم الكتاب</th>
          <th className="translate-x-6 font-arial">اسم المشتري</th>
          <th className="translate-x-3 font-arial"> رقم السند</th>
          <th className="translate-x-4 font-arial"> سعر الكتاب</th>
          <th className="translate-x-4 font-arial"> رقم الصرف</th>
        </tr>
        {data.map((item, index) => (
          // eslint-disable-next-line react/jsx-key
          <tr className=" -translate-x-3 h-10 text-black border-2 border-gray-300 py-5">
            <td className="px-2 font-arial">{index + 1}</td>
            <td className='font-arial'>{item.Book.name}</td>
            <td className='font-arial'>{item.Customer.name}</td>
            <td className='font-arial'>{item.reference}</td>
            <td className='font-arial'>{item.Book.price}</td>
            <td className='font-arial'>{item.orderNumber}</td>
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
export default OrderBookPdf
