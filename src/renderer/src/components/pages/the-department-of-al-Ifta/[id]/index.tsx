import { axiosInstance, patchApi } from '@renderer/lib/http'

import { useState, useEffect } from 'react'
import { useAuthHeader } from 'react-auth-kit'
import { Link, useParams } from 'react-router-dom'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../../ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '@renderer/components/ui/button'
import { Textarea } from '@renderer/components/ui/textarea'
import { FormInput } from '../../../ui/form-input'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@renderer/components/ui/use-toast'

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
export default function AlLftaIndex() {
  const queryClient = useQueryClient()
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()
  const navigate = useNavigate()
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
    isLoading: complaintIsLoading
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

  const { mutate, isError, isSuccess, isPending } = useMutation({
    mutationKey: ['editComplaint'],
    mutationFn: (datas: ComplaintFormValue) =>
      patchApi(
        `/complaint/${id}`,
        {
          name: datas.name,
          refrance: datas.refrance,
          governmentOfficeId: +datas.governmentOfficeId,
          title: datas.title,
          description: datas.description,
          date: new Date(datas.date),
          officeOpinian: datas.officeOpinian
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
      queryClient.invalidateQueries({ queryKey: ['Complaint'] })
      navigate('/the-department-of-al-lfta')
    },
    onError: (error) => {
      toast({
        title: 'لم تتم العملية',
        description: error.message,
        variant: 'destructive'
      })
    }
  })
  const onSubmit = (datas: ComplaintFormValue) => {
    mutate(datas)
  }

  return (
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

          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-10 p-0  rounded-xl text-sm"
                        placeholder="   مقدم الشكوى "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/*  */}

            <div className="col-span-1 ">
              <FormField
                control={form.control}
                name="governmentOfficeId"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      value={
                        field.value
                          ? String(field.value)
                          : String(complaintData?.governmentOfficeId)
                      }
                      defaultValue={field.value}
                    >
                      <FormControl className="bg-transparent border-2 border-[#d1d5db] rounded-xl">
                        <SelectTrigger>
                          <SelectValue placeholder="مصدر التوجيه" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {data.map((options) => (
                          <SelectItem key={options.name} value={String(options.id)}>
                            {options.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className=" col-span-1 h-[50px] ">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-10 p-0  rounded-xl text-sm"
                        placeholder="   موضوع الشكوى "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/*  */}
          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <FormField
                control={form.control}
                name="refrance"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-10 p-0  rounded-xl text-sm"
                        placeholder="   رقم الشكوى "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/*  */}
          </div>
          {/*  */}
          <div className="grid h-[150px]  grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[40px] ">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormControl>
                      <Textarea
                        className="bg-transparent border-2 border-[#d1d5db] rounded-xl"
                        rows={5}
                        {...field}
                        placeholder="تفاصيل الشكوى"
                      ></Textarea>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/*  */}
          </div>

          <div className="mb-4 bg-[#dedef8] rounded-t-lg">
            <h3 className="font-bold text-[#3734a9] p-3">رأي المكتب</h3>
          </div>

          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        {...field}
                        placeholder="تاريخة"
                        type="date"
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/*  */}
          </div>

          <div className="grid h-[150px]  grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[40px] ">
              <FormField
                control={form.control}
                name="officeOpinian"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormControl>
                      <Textarea
                        className="bg-transparent border-2 border-[#d1d5db] rounded-xl"
                        rows={5}
                        {...field}
                        placeholder="نص الرأي"
                      ></Textarea>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/*  */}
          </div>
          <div className="w-full flex justify-end gap-2 mb-4">
            <Link to={'/state-affairs'}>
              <Button className="text-sm h-10  bg-[#fff] border-2 border-[#3734a9] text-[#3734a9] hover:bg-[#3734a9] hover:text-[#fff] hover:border-2 hover:border-white rounded-[12px] sm:w-28 sm:text-[10px] lg:w-40 lg:text-sm">
                إلغاء
              </Button>
            </Link>

            <Button
              className="text-sm h-10  bg-[#3734a9] border-2 border-[#3734a9] text-[#fff] hover:border-2 hover:border-[#2f2b94] hover:bg-[#fff] hover:text-[#2f2b94] rounded-[12px] sm:w-28 sm:text-[10px] lg:w-40 lg:text-sm"
              type="submit"
            >
              حفظ
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}