import { z } from 'zod'
import { useEffect } from 'react'
import { useAuthHeader } from 'react-auth-kit'
import { useParams } from 'react-router-dom'
import { axiosInstance, getApi } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import { LoaderIcon } from 'lucide-react'

export type BookResp = {
  id: number
  name: string
  quantity: number
  price: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

export default function BookInfo() {
  const { id } = useParams<{ id: string }>()
  const authToken = useAuthHeader()

  // const fetchData = async () => {
  //   const response = await axiosInstance.get<BookResp>(`/book/${id}`, {
  //     headers: {
  //       Authorization: `${authToken()}`
  //     }
  //   })
  //   return response.data
  // }
  // const {
  //   data: BookData,
  //   error: BookError,
  //   isLoading: BookIsLoading
  // } = useQuery({
  //   queryKey: ['Books', id],
  //   queryFn: fetchData,
  //   enabled: !!id
  // })

  const {
    data: BookData,
    error: BookError,
    isLoading: BookIsLoading
  } = useQuery({
    queryKey: ['BooksInfo'],
    queryFn: () =>
      getApi<BookResp>(`/book-order/${id}`, {
        headers: {
          Authorization: authToken()
        }
      })
  })

  useEffect(() => {}, [BookData])
  console.log('BookData', BookData)
  if (BookIsLoading)
    return (
      <div className="flex justify-center items-center w-full ">
        <LoaderIcon className="mt-12 flex animate-spin items-center justify-end duration-1000" />
      </div>
    )
  if (BookError) return 'An error has occurred: ' + BookError.message

  return (
    <div className="min-h-[50vh] w-full mt-5">
      <div>
        <div className="mb-4 bg-[#dedef8] rounded-t-lg">
          <h3 className="font-bold text-[#3734a9] p-3">المعلومات</h3>
        </div>
        <div className="bg-[#3734A9]/[.1] w-[90%] min-h-[50vh] m-auto rounded-md px-4 py-2">
          <div className="mb-4 bg-[#dedef8] rounded-t-lg">
            <h3 className="font-bold text-[#3734a9] p-3">المعلومات الأساسية</h3>
          </div>

          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="">اسم الكتاب</label>
              <p>{BookData?.data.name}</p>
            </div>

            <div className=" col-span-1 h-[50px] ">
              <label>الكميه</label>
              <p>{BookData?.data.quantity}</p>
            </div>

            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="">سعر النسخة</label>
              <p>{BookData?.data.price}</p>
            </div>
            {/*  */}
          </div>
        </div>
      </div>
    </div>
  )
}
