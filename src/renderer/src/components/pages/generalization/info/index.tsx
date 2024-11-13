import { z } from 'zod'
import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAuthHeader } from 'react-auth-kit'
import { useParams } from 'react-router-dom'
import { axiosInstance } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'

const formSchema = z.object({
  title: z.string(),
  refrance: z.string(),
  description: z.string(),
  attachmentPath: z.string()
})

export type Generalization = {
  id: number
  title: string
  refrance: string
  description: string
  attachmentPath: string
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
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
    error: _GeneralizationError,
    isLoading: _GeneralizationIsLoading
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
        attachmentPath: GeneralizationData.attachmentPath
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
              <img src={GeneralizationData?.attachmentPath} alt="" />
            </div>
            {/*  */}
          </div>
        </div>
      </div>
    </div>
  )
}
