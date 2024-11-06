import { axiosInstance } from '@renderer/lib/http'
import { useState, useEffect } from 'react'
import { useAuthHeader } from 'react-auth-kit'
import {  useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { Separator } from '@renderer/components/ui/separator'
import { LoaderIcon } from 'lucide-react'

export type complaint = {
  id: number
  name: string
  refrance: string
  governmentOfficeId: number
  title: string
  description: string
  date: Date
  officeOpinian: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}
const formSchema = z.object({
  name: z.string(),
  refrance: z.string(),
  governmentOfficeId: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string(),
  officeOpinian: z.string()
})

export type GovernmentOffice = {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

type ComplaintFormValue = z.infer<typeof formSchema>
export default function AllaftaInfo() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<GovernmentOffice[]>([])
  const authToken = useAuthHeader()

  const fetchDataGovernment = async () => {
    try {
      const response = await axiosInstance.get('/government-office', {
        headers: {
          Authorization: `${authToken()}`
        }
      })
      setData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const form = useForm<ComplaintFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ''
    }
  })
  const fetchData = async () => {
    const response = await axiosInstance.get<complaint>(`/complaint/${id}`, {
      headers: {
        Authorization: `${authToken()}`
      }
    })
    return response.data
  }
  const {
    data: complaintData,
    error: complaintError,
    isPending:complaintIsPending
  } = useQuery({
    queryKey: ['complaint', id],
    queryFn: fetchData,
    enabled: !!id
  })

  useEffect(() => {
    if (complaintData) {
      form.reset({
        name: complaintData.name,
        refrance: complaintData.refrance,
        governmentOfficeId: String(complaintData.governmentOfficeId),
        title: complaintData.title,
        description: complaintData.description,
        date: new Date(complaintData.date).toISOString().split('T')[0],
        officeOpinian: complaintData.officeOpinian
      })
    }
    fetchDataGovernment()
  }, [complaintData])
  if (complaintIsPending)
    return (
      <div className="flex justify-center items-center w-full ">
        <LoaderIcon className="mt-12 flex animate-spin items-center justify-end duration-1000" />
      </div>
    )
  if (complaintError) return 'An error has occurred: ' + complaintError.message
  return (
    <div className="min-h-[50vh] w-full mt-5">
      <div>
        <div className="mb-4 bg-[#dedef8] rounded-t-lg">
          <h3 className="font-bold text-[#3734a9] p-3">المعلومات</h3>
        </div>
        <div className="bg-[#3734A9]/[.1] w-[90%] min-h-[50vh] m-auto rounded-md px-4 py-2">
          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <label>مقدم الشكوى</label>
              <p>{complaintData?.name}</p>
            </div>
            {/*  */}

            <div className="col-span-1 translate-y-2">
              <label>مصدر التوجيه</label>
              <p>
                {data.filter((x) => x.id === complaintData?.governmentOfficeId).map((x) => x.name)}
              </p>
            </div>

            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="">موضوع الشكوى</label>
              <p>{complaintData?.title}</p>
            </div>
          </div>
          <Separator className="bg-[#757575]" />
          {/*  */}
          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="">رقم الشكوى</label>
              <p>{complaintData?.refrance}</p>
            </div>
          </div>
          {/*  */}
          <div className="grid min-h-[80px]  grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[40px] ">
              <label htmlFor="">تفاصيل الشكوى</label>
              <p>{complaintData?.description}</p>
            </div>
          </div>
          <Separator className="bg-[#757575]" />
          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="">تاريخة</label>
              <p>{String(complaintData?.date).split('T')[0]}</p>
            </div>
          </div>

          <div className="grid h-[150px]  grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[40px] ">
              <label htmlFor="">نص الرأي</label>
              <p>{complaintData?.officeOpinian}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
