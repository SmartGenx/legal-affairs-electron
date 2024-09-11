import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../../ui/form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAuthHeader } from 'react-auth-kit'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@renderer/components/ui/button'
import { FormInput } from '@renderer/components/ui/form-input'
import { axiosInstance, patchApi, postApi } from '@renderer/lib/http'
import { useToast } from '@renderer/components/ui/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select'
import { Textarea } from '@renderer/components/ui/textarea'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import FileUploader from '../../decisions/add-decisions/FileUploader'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const formSchema = z.object({
  title: z.string(),
  refrance: z.string(),
  description: z.string(),
  file: z.instanceof(File).optional()
})

export type Generalization = {
  id: number
  title: string
  refrance: string
  description: string
  file: File
}

type BookFormValue = z.infer<typeof formSchema>

export default function GeneralizationInfo() {
  const { id } = useParams<{ id: string }>()

  const authToken = useAuthHeader()

  const form = useForm<BookFormValue>({
    resolver: zodResolver(formSchema)
  })

  const fetchGeneralizationData = async () => {
    const response = await axiosInstance.get<Generalization>(`/generalization/${id}`, {
      headers: {
        Authorization: `${authToken()}`
      }
    })
    return response.data
  }
  const {
    data: GeneralizationData,
    error: GeneralizationError,
    isLoading: GeneralizationIsLoading
  } = useQuery({
    queryKey: ['generalization', id],
    queryFn: fetchGeneralizationData,
    enabled: !!id
  })

  console.log('GeneralizationData', GeneralizationData)
  useEffect(() => {
    if (GeneralizationData) {
      form.reset({
        title: GeneralizationData.title,
        refrance: GeneralizationData.refrance,
        description: GeneralizationData.description,
        file: GeneralizationData.file
      })
    }
  }, [GeneralizationData])

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
              <label htmlFor="">رقم التعميم</label>
              <p>{GeneralizationData?.refrance}</p>
            </div>

            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="">موضوع التعميم</label>
              <p>{GeneralizationData?.title}</p>
            </div>

            {/*  */}
          </div>
          <div className="grid h-[150px]  grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[40px] ">
              <label htmlFor="">تفاصيل التعميم</label>
              <p>{GeneralizationData?.description}</p>
            </div>
            {/*  */}
          </div>

          <div className="mb-4 bg-[#dedef8] rounded-t-lg">
            <h3 className="font-bold text-[#3734a9] p-3">المرفقات</h3>
          </div>

          <div className="grid h-[150px]  grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[40px] bg-black">
              <img src={GeneralizationData?.file} alt="" />
            </div>
            {/*  */}
          </div>
        </div>
      </div>
    </div>
  )
}
