import { z } from 'zod'
import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAuthHeader } from 'react-auth-kit'
import { Link, useParams } from 'react-router-dom'
import { axiosInstance } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@renderer/components/ui/button'
import { ArrowRight } from 'lucide-react'

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
    <>
      <div className=" flex items-center text-3xl">
        <Link to={'/generalization'}>
          <Button className="w-16 h-12 bg-transparent text-[#3734a9] hover:bg-[#3734a9] hover:text-white rounded-2xl border-2 border-[#3734a9] hover:border-2 hover:border-[#fff]">
            <ArrowRight size={20} />
          </Button>
        </Link>
        <h1 className="mr-2 text-[#3734a9] font-bold">{GeneralizationData?.title}</h1>
      </div>
      <div className="min-h-[50vh] w-full mt-5">
        <div>
          <div className="mb-4 bg-[#dedef8] rounded-t-lg">
            <h3 className="font-bold text-[#3734a9] p-3">المعلومات</h3>
          </div>
          <div className="bg-[#dedef8] w-[95%] min-h-[40vh] m-auto rounded-2xl px-4 py-2">
            <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
              <div className="text-[#757575] col-span-1 h-[50px] ">
                <label htmlFor="" className="font-bold text-lg">
                  رقم التعميم
                </label>
                <p className="mt-2">{GeneralizationData?.refrance}</p>
              </div>

              <div className="text-[#757575] col-span-1 h-[50px] ">
                <label htmlFor="" className="font-bold text-lg">
                  موضوع التعميم
                </label>
                <p className="mt-2">{GeneralizationData?.title}</p>
              </div>

              {/*  */}
            </div>
            <div className="grid h-[150px]  grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
              <div className="text-[#757575] col-span-1 h-[40px] ">
                <label htmlFor="" className="font-bold text-lg">
                  تفاصيل التعميم
                </label>
                <p className="mt-2">{GeneralizationData?.description}</p>
              </div>
              {/*  */}
            </div>

            <div className="mb-4 bg-[#dedef8] rounded-t-lg">
              <h3 className="font-bold text-3xl text-[#3734a9] p-3">المرفقات</h3>
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
    </>
  )
}
