import { useEffect, useState } from 'react'
import { useAuthHeader } from 'react-auth-kit'
import {  useParams } from 'react-router-dom'
import { axiosInstance } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { BookInfo } from '@renderer/types'

export type customer = {
  id: number
  name: string
  type: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

export interface OrderBookResp {
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

export default function ViewOrderPage() {
  const { id } = useParams<{ id: string }>()
  const authToken = useAuthHeader()
  const [bookId, setBookId] = useState<string | null>(null)
  const [quantity, setQuantity] = useState<number>(0)
  console.log('quantity', quantity)
  const [data, setData] = useState<customer[]>([])
  const [order, setOrder] = useState<BookInfo[]>([])

  // Find the selected book's price
  const selectedBook = order.find((x) => bookId === String(x.id))
  const price = selectedBook ? selectedBook.price : 0
  const total = price * quantity

  const fetchDataById = async () => {
    const response = await axiosInstance.get<OrderBookResp[]>(
      `/book-order/?include[Customer]=true&include[Book]=true&id=${id}`,
      {
        headers: {
          Authorization: `${authToken()}`
        }
      }
    )
    return response.data
  }
  const {
    data: BookData,
    error: _BookError,
    isLoading: _BookIsLoading
  } = useQuery({
    queryKey: ['BooksById', id],
    queryFn: fetchDataById,
    enabled: !!id
  })

  useEffect(() => {
    if (!bookId && BookData && BookData.length > 0) {
        setBookId(String(BookData[0].bookId))
      }
      if (!quantity && BookData && BookData.length > 0) {
        setQuantity(BookData[0].quantity)
      }
    // }
  }, [BookData, bookId])
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('/customer', {
        headers: {
          Authorization: `${authToken()}`
        }
      })
      setData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  //
  const fetchOrder = async () => {
    try {
      const response = await axiosInstance.get('/book', {
        headers: {
          Authorization: `${authToken()}`
        }
      })
      setOrder(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  //
  // console.log('bookId', bookId)
  // console.log('data', data)
  useEffect(() => {
    fetchData()
    fetchOrder()
  }, [])

  return (
    <div className="min-h-[50vh] w-full mt-5">
      <div>
        <div className="mb-4 bg-[#dedef8] rounded-t-lg">
          <h3 className="font-bold text-[#3734a9] p-3">المعلومات</h3>
        </div>
        <div className="bg-[#dedef8] w-[95%] min-h-[70vh] m-auto rounded-2xl px-4 py-2">
          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className="text-[#757575] col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-lg">
                اسم الكتاب
              </label>
              <p className="mt-2">
                {BookData && BookData.length > 0
                  ? order.filter((x) => x.id === BookData[0]?.Book?.id)[0]?.name || ''
                  : ''}
              </p>
            </div>

            <div className="text-[#757575] col-span-1 h-[50px] ">
              <label className="font-bold text-lg">سعر الكتاب</label>
              <p className="mt-2">
              {bookId}
              </p>
            </div>

            <div className="text-[#757575] col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-lg">
                عدد الكتاب
              </label>
              <p className="mt-2">{BookData && BookData.length > 0 ? BookData[0]?.quantity : ''}</p>
            </div>
            {/*  */}
          </div>
          <Separator className="bg-[#757575] h-[2px] my-2" />
          {/* ------------------------- */}
          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className="text-[#757575] col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-lg">
                الاجمالي
              </label>
              <p>{total}</p>
            </div>

            <div className="text-[#757575] col-span-1 h-[50px] ">
              <label className="font-bold text-lg">تاريخ البيع</label>
              <p className="mt-2">
                {BookData && BookData.length > 0
                  ? String(BookData[0]?.sellingDate).split('T')[0]
                  : ''}
              </p>
            </div>
            {/*  */}
          </div>
          <Separator className="bg-[#757575] h-[3px] my-2" />
          {/* ---------------------------------- */}
          <div className="grid min-h-[20vh]   grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className="text-[#757575] col-span-1 min-h-[50px] ">
              <label htmlFor="" className="font-bold text-lg">
                ملاحظات
              </label>
              <p className="mt-2">
                {BookData && BookData.length > 0 ? BookData[0]?.description : ''}
              </p>
            </div>
          </div>
          <Separator className="bg-[#757575] h-[2px] my-2" />
          {/* ------------------------------ */}

          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className="text-[#757575] col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-lg">
                اسم المشتري
              </label>
              <p className="mt-2">
                {BookData && BookData.length > 0
                  ? data.filter((x) => x.id === BookData[0]?.Customer?.id)[0]?.name || ''
                  : ''}
              </p>
            </div>

            <div className="text-[#757575] col-span-1 h-[50px] ">
              <label className="font-bold text-lg">رقم الصرف</label>
              <p className='mt-2'>
              {BookData && BookData.length > 0 ? BookData[0]?.reference : ''}
              </p>
            </div>

            <div className="text-[#757575] col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-lg">
                رقم السند
              </label>
              <p className="mt-2">{BookData && BookData.length > 0 ? BookData[0]?.orderNumber : ''}</p>
            </div>
            {/*  */}
          </div>
          
        </div>
      </div>
    </div>
  )
}