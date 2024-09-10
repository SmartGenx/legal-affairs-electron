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
import { AgencyInfo } from '@renderer/types'

const formSchema = z.object({
  legalName: z.string(),
  providedDocument: z.string(),
  governmentOfficeId: z.string()
})
export type GovernmentOffice = {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}
type BookFormValue = z.infer<typeof formSchema>

export default function ViewAgencyInfo() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const authToken = useAuthHeader()
  const navigate = useNavigate()
  const [dataGovernment, setGovernmentData] = useState<GovernmentOffice[]>([])

  const form = useForm<BookFormValue>({
    resolver: zodResolver(formSchema)
  })

  const fetchGovernmentData = async () => {
    try {
      const response = await axiosInstance.get('/government-office', {
        headers: {
          Authorization: `${authToken()}`
        }
      })
      setGovernmentData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const fetchAgencyData = async () => {
    const response = await axiosInstance.get<AgencyInfo>(`/agency/${id}`, {
      headers: {
        Authorization: `${authToken()}`
      }
    })
    return response.data
  }
  const {
    data: AgencyData,
    error: AgencyError,
    isLoading: AgencyIsLoading
  } = useQuery({
    queryKey: ['Agency', id],
    queryFn: fetchAgencyData,
    enabled: !!id
  })

  useEffect(() => {
    fetchGovernmentData()
  }, [AgencyData])

  return (
    <div className="min-h-[50vh] w-full mt-5">
      <div>
        <div className="mb-4 bg-[#dedef8] rounded-t-lg">
          <h3 className="font-bold text-[#3734a9] p-3">المعلومات</h3>
        </div>
        <div className="bg-[#3734A9]/[.1] w-[90%] min-h-[50vh] m-auto rounded-md px-4 py-2">
          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="">اسم القانوني</label>
              <p>{AgencyData?.legalName}</p>
            </div>

            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="">الوثيقة المقدمه</label>
              <p>{AgencyData?.providedDocument}</p>
            </div>

            <div className="col-span-1 ">
              <label htmlFor="">المرفق الحكومي</label>
              <p>
                {dataGovernment
                  .filter((x) => x.id === AgencyData?.governmentOfficeId)
                  .map((x) => x.name)}
              </p>
            </div>
            {/*  */}
          </div>
        </div>
      </div>
    </div>
  )
}
