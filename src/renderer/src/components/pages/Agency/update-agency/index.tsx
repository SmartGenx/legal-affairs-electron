import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../../ui/form'
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AgencyInfo } from '@renderer/types'
import { ArrowRight } from 'lucide-react'

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

export default function UpdateAgency() {
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
    error: _AgencyError,
    isLoading: _AgencyIsLoading
  } = useQuery({
    queryKey: ['Agency', id],
    queryFn: fetchAgencyData,
    enabled: !!id
  })

  useEffect(() => {
    if (AgencyData) {
      form.reset({
        legalName: AgencyData.legalName,
        governmentOfficeId: String(AgencyData.governmentOfficeId),
        providedDocument: String(AgencyData.providedDocument)
      })
    }
    fetchGovernmentData()
  }, [AgencyData])
  const { mutate } = useMutation({
    mutationKey: ['UpdateAgency'],
    mutationFn: (datas: BookFormValue) =>
      patchApi(
        `/agency/${id}`,
        {
          legalName: datas.legalName,
          providedDocument: +datas.providedDocument,
          governmentOfficeId: +datas.governmentOfficeId
        },
        {
          headers: {
            Authorization: `${authToken()}`
          }
        }
      ),
    onSuccess: () => {
      toast({
        title: 'اشعار',
        variant: 'success',
        description: 'تمت الاضافة بنجاح'
      })
      queryClient.invalidateQueries({ queryKey: ['Agency'] })
      navigate('/Agency')
    },
    onError: (error) => {
      toast({
        title: 'لم تتم العملية',
        description: error.message,
        variant: 'destructive'
      })
    }
  })
  const onSubmit = (datas: BookFormValue) => {
    mutate(datas)
  }
  return (
    <>
      <div className=" flex items-center text-3xl">
        <Link to={'/Agency'}>
          <Button className="w-16 h-12 bg-transparent text-[#3734a9] hover:bg-[#3734a9] hover:text-white rounded-2xl border-2 border-[#3734a9] hover:border-2 hover:border-[#fff]">
            <ArrowRight size={20} />
          </Button>
        </Link>
        <h1 className="mr-2 text-[#3734a9] font-bold">{AgencyData?.legalName}</h1>
      </div>
      <div className="min-h-[50vh] w-full mt-5">
        <Form {...form}>
          <form
            id="complainsForm"
            //   key={key}
            onSubmit={form.handleSubmit(onSubmit)}
            className=""
          >
            {process.env.NODE_ENV === 'development' && (
              <>
                <p>Ignore it, it just in dev mode</p>
                <div>{JSON.stringify(form.formState.errors)}</div>
              </>
            )}
            <div className="mb-4 bg-[#dedef8] rounded-t-lg">
              <h3 className="font-bold text-[#3734a9] p-3">المعلومات الأساسية</h3>
            </div>

            <div className="grid min-h-[80px] mb-4  grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
              <div className=" col-span-1 h-[50px] ">
                <label htmlFor="" className="font-bold text-sm text-[#757575]">
                  اسم القانوني
                </label>
                <FormField
                  control={form.control}
                  name="legalName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormInput
                          className="h-11 p-0 placeholder:text-base text-[#757575]  rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                          placeholder="   اسم القانوني "
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className=" col-span-1 h-[50px] ">
                <label htmlFor="" className="font-bold text-sm text-[#757575]">
                  رقم الوثيقة المقدمه
                </label>
                <FormField
                  control={form.control}
                  name="providedDocument"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormInput
                          className="h-11 p-0 placeholder:text-base text-[#757575]  rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                          placeholder="   رقم الوثيقة المقدمه "
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-1 ">
                <label htmlFor="" className="font-bold text-sm text-[#757575]">
                  المرفق الحكومي
                </label>
                <FormField
                  control={form.control}
                  name="governmentOfficeId"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        value={
                          field.value ? String(field.value) : String(AgencyData?.governmentOfficeId)
                        }
                        defaultValue={field.value}
                      >
                        <FormControl className="bg-transparent h-11 text-[#757575] text-base border-[3px] border-[#E5E7EB] rounded-xl translate-y-2">
                          <SelectTrigger>
                            <SelectValue placeholder="المرفق الحكومي" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {dataGovernment.map((directorate) => (
                            <SelectItem key={directorate.name} value={String(directorate.id)}>
                              {directorate.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/*  */}
            </div>

            <div className="w-full flex justify-end gap-2 mb-4">
              <Link to={'/Agency'}>
                <Button className="text-sm h-10 md:w-30 lg:w-30  bg-[#fff] border-2 border-[#3734a9] text-[#3734a9] hover:bg-[#3734a9] hover:text-[#fff] hover:border-2 hover:border-white rounded-[12px] sm:w-28 sm:text-[10px]  lg:text-sm">
                  إلغاء
                </Button>
              </Link>

              <Button
                className="text-sm h-10 md:w-30 lg:w-30  bg-[#3734a9] border-2 border-[#3734a9] text-[#fff] hover:border-2 hover:border-[#2f2b94] hover:bg-[#fff] hover:text-[#2f2b94] rounded-[12px] sm:w-28 sm:text-[10px]  lg:text-sm"
                type="submit"
              >
                <p className="font-bold text-base">تعديل</p>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}
