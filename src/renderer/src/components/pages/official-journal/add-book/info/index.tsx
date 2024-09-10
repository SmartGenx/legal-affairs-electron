import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../../../ui/form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAuthHeader } from 'react-auth-kit'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@renderer/components/ui/button'
import { FormInput } from '@renderer/components/ui/form-input'
import { axiosInstance, patchApi } from '@renderer/lib/http'
import { useToast } from '@renderer/components/ui/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select'
import { Textarea } from '@renderer/components/ui/textarea'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const formSchema = z.object({
  name: z.string(),
  quantity: z.string(),
  price: z.string()
})

export type BookResp = {
  id: number
  name: string
  quantity: number
  price: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

type BookFormValue = z.infer<typeof formSchema>

export default function BookInfo() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const authToken = useAuthHeader()
  const navigate = useNavigate()

  const fetchData = async () => {
    const response = await axiosInstance.get<BookResp>(`/book/${id}`, {
      headers: {
        Authorization: `${authToken()}`
      }
    })
    return response.data
  }
  const {
    data: BookData,
    error: BookError,
    isLoading: BookIsLoading
  } = useQuery({
    queryKey: ['Books', id],
    queryFn: fetchData,
    enabled: !!id
  })

  console.log('sdsdfsdfs', BookData)

  useEffect(() => {}, [BookData])

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
              <p>{BookData?.name}</p>
            </div>

            <div className=" col-span-1 h-[50px] ">
              <label>الكميه</label>
              <p>{BookData?.quantity}</p>
            </div>

            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="">سعر النسخة</label>
              <p>{BookData?.price}</p>
            </div>
            {/*  */}
          </div>
        </div>
      </div>
    </div>
  )
}
