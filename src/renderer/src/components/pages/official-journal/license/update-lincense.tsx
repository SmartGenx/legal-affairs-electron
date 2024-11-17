import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../../ui/form'
import React, { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAuthHeader } from 'react-auth-kit'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@renderer/components/ui/button'
import { FormInput } from '@renderer/components/ui/form-input'
import { axiosInstance, getApi, patchApi } from '@renderer/lib/http'
import { useToast } from '@renderer/components/ui/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select'
import { Textarea } from '@renderer/components/ui/textarea'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LicenseType } from '@renderer/types'
import { LoaderIcon } from 'lucide-react'

export interface Customer {
  id: number
  name: string
  type: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}
export interface licenseResp {
  id: number
  licenseTypeId: number
  customerId: number
  licenseNumber: string
  licenseYear: number
  compnayPorpose: string
  compnayLocation: string
  compnayCapital: number
  compnayManger: string
  referenceNum: string
  referenceDate: Date
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

const formSchema = z.object({
  licenseTypeId: z.string(),
  customerId: z.string(),
  licenseNumber: z.string(),
  licenseYear: z.string(),
  compnayPorpose: z.string(),
  compnayLocation: z.string(),
  compnayCapital: z.string(),
  compnayManger: z.string(),
  referenceNum: z.string(),
  referenceDate: z.string()
})

type BookFormValue = z.infer<typeof formSchema>

export default function UpdateLicense() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const authToken = useAuthHeader()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<Customer[]>([])


  const {  error, data } = useQuery({
    queryKey: ['license'],
    queryFn: () =>
      getApi<LicenseType>('/license-type?page=1&pageSize=30', {
        headers: {
          Authorization: authToken()
        }
      })
  })
  const { isPending, data: licenseById } = useQuery({
    queryKey: ['licenseById', id],
    queryFn: () =>
      getApi<licenseResp>(`/license/${id}`, {
        headers: {
          Authorization: authToken()
        }
      })
  })


  React.useEffect(() => {
    if (licenseById?.data) {
      form.reset({
        licenseTypeId: String(licenseById.data.licenseTypeId),
        customerId: String(licenseById.data.customerId),
        licenseNumber: licenseById.data.licenseNumber,
        licenseYear: String(licenseById.data.licenseYear),
        compnayPorpose: licenseById.data.compnayPorpose,
        compnayLocation: licenseById.data.compnayLocation,
        compnayCapital: String(licenseById.data.compnayCapital),
        compnayManger: licenseById.data.compnayManger,
        referenceNum: licenseById.data.referenceNum,
        referenceDate: new Date(licenseById.data.referenceDate).toISOString().split('T')[0],
      })
    }
  }, [licenseById?.data])
  const infoArray = data?.data?.info || [] // Directly access the `info` array from `data.data`

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('/customer', {
        headers: {
          Authorization: `${authToken()}`
        }
      })
      setCustomer(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
  const form = useForm<BookFormValue>({
    resolver: zodResolver(formSchema)
  })
  const { mutate } = useMutation({
    mutationKey: ['UpdateLicense'],
    mutationFn: (datas: BookFormValue) =>
      patchApi(
        `/license/${id}`,
        {
          licenseTypeId: +datas.licenseTypeId,
          customerId: +datas.customerId,
          licenseNumber: datas.licenseNumber,
          licenseYear: +datas.licenseYear,
          compnayPorpose: datas.compnayPorpose,
          compnayLocation: datas.compnayLocation,
          compnayCapital: +datas.compnayCapital,
          compnayManger: datas.compnayManger,
          referenceNum: datas.referenceNum,
          referenceDate: new Date(datas.referenceDate).toISOString()
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
      queryClient.invalidateQueries({ queryKey: ['LicenseResponse'] })
      navigate('/official-journal')
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
  if (isPending)
    return (
      <div className="flex justify-center items-center w-full ">
        <LoaderIcon className="mt-12 flex animate-spin items-center justify-end duration-1000" />
      </div>
    )

  if (error) return 'An error has occurred: ' + error.message
  return (
    <div className="min-h-[50vh] w-full mt-5">
      <Form {...form}>
        <form
          id="AddLicenseForm"
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
            <div className="col-span-1 h-[50px] translate-y-2">
              <FormField
                control={form.control}
                name="licenseTypeId"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange}
                    value={
                        field.value
                          ? String(field.value)
                          : String(licenseById?.data.licenseTypeId)
                      }
                    defaultValue={field.value}>
                      <FormControl className="bg-transparent h-11 text-[#757575] text-base border-[3px] border-[#E5E7EB] rounded-xl">
                        <SelectTrigger>
                          <SelectValue placeholder="نوع الرخصه" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {infoArray.map((options) => (
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

            <div className=" col-span-1 h-[50px] translate-y-2">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange}
                    value={
                        field.value
                          ? String(field.value)
                          : String(licenseById?.data.customerId)
                      }
                    defaultValue={field.value}>
                      <FormControl className="bg-transparent h-11 text-[#757575] text-base border-[3px] border-[#E5E7EB] rounded-xl">
                        <SelectTrigger>
                          <SelectValue placeholder="اسم الشركة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customer.map((options) => (
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
                name="compnayLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 p-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        placeholder="   مركز الشركة "
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

          <div className="grid h-[80px]   grid-cols-2 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <FormField
                control={form.control}
                name="compnayManger"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 p-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        placeholder="   مسؤول الشركة "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className=" col-span-1 h-[50px] ">
              <FormField
                control={form.control}
                name="compnayCapital"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 p-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        placeholder="   رأس مال الشركة "
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
                name="compnayPorpose"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormControl>
                      <Textarea
                        className="bg-transparent placeholder:text-base rounded-xl border-[3px] border-[#E5E7EB]"
                        rows={5}
                        {...field}
                        placeholder="غرض الشركة ( أكتب الغرض من أنشاء الشركة )"
                      ></Textarea>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/*  */}
          </div>

          {/*  */}

          <div className="mb-4 bg-[#dedef8] rounded-t-lg">
            <h3 className="font-bold text-[#3734a9] p-3">معلومات الترخيص</h3>
          </div>

          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <FormField
                control={form.control}
                name="licenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 p-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        placeholder="   رقم الترخيص "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className=" col-span-1 h-[50px] ">
              <FormField
                control={form.control}
                name="licenseYear"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 p-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        placeholder="   السنة "
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
          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-2 h-[50px] ">
              <FormField
                control={form.control}
                name="referenceNum"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 p-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        placeholder="   رقم السند "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className=" col-span-1 h-[50px] ">
              <FormField
                control={form.control}
                name="referenceDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        {...field}
                        placeholder="تاريخ التخرج"
                        type="date"
                        className="h-11 px-1 placeholder:text-base  rounded-xl border-[3px] border-[#E5E7EB] text-sm"
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
          <div className="w-full flex justify-end gap-2 mb-4">
            <Link to={'/state-affairs'}>
              <Button className="text-sm h-10 md:w-30 lg:w-30  bg-[#fff] border-2 border-[#3734a9] text-[#3734a9] hover:bg-[#3734a9] hover:text-[#fff] hover:border-2 hover:border-white rounded-[12px] sm:w-28 sm:text-[10px]  lg:text-sm">
                إلغاء
              </Button>
            </Link>

            <Button
              className="text-sm h-10 md:w-30 lg:w-30  bg-[#3734a9] border-2 border-[#3734a9] text-[#fff] hover:border-2 hover:border-[#2f2b94] hover:bg-[#fff] hover:text-[#2f2b94] rounded-[12px] sm:w-28 sm:text-[10px]  lg:text-sm"
              type="submit"
            >
              <p className='font-bold text-base'>تعديل</p>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
