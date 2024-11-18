import { useEffect } from 'react'
import { useAuthHeader } from 'react-auth-kit'
import { Link, useParams } from 'react-router-dom'
import { getApi } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, LoaderIcon } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'

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

  const {
    data: BookData,
    error: BookError,
    isPending: BookIsPending
  } = useQuery({
    queryKey: ['BooksInfo',id],
    queryFn: () =>
      getApi<BookResp>(`/book/${id}`, {
        headers: {
          Authorization: authToken()
        }
      })
  })

  useEffect(() => {}, [BookData])

  if (BookIsPending)
    return (
      <div className="flex justify-center items-center w-full ">
        <LoaderIcon className="mt-12 flex animate-spin items-center justify-end duration-1000" />
      </div>
    )
  if (BookError) return 'An error has occurred: ' + BookError.message

  return (
    <>
    <div className="flex items-center text-3xl">
        <Link to={'/official-journal'}>
          <Button className="w-16 h-12 bg-transparent text-[#3734a9] hover:bg-[#3734a9] hover:text-white rounded-2xl border-2 border-[#3734a9] hover:border-2 hover:border-[#fff]">
            <ArrowRight size={20} />
          </Button>
        </Link>
        <h1 className="mr-2 text-[#3734a9] font-bold">{BookData?.data.name}</h1>
      </div>
    <div className="min-h-[50vh] w-full mt-5">
      <div>
        <div className="mb-4 bg-[#dedef8] rounded-t-lg">
          <h3 className="font-bold text-[#3734a9] p-3">المعلومات</h3>
        </div>
        <div className="bg-[#dedef8] w-[95%] min-h-[40vh] m-auto rounded-2xl px-4 py-2">
          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className="text-[#757575] col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-lg">اسم الكتاب</label>
              <p className="mt-2">{BookData?.data.name}</p>
            </div>

            <div className="text-[#757575] col-span-1 h-[50px] ">
              <label className="font-bold text-lg">الكميه</label>
              <p className="mt-2">{BookData?.data.quantity}</p>
            </div>

            <div className="text-[#757575] col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-lg">سعر النسخة</label>
              <p className="mt-2">{BookData?.data.price}</p>
            </div>
            {/*  */}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
