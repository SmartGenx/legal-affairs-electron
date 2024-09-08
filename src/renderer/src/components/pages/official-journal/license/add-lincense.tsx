import { string, z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../../ui/form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAuthHeader } from 'react-auth-kit'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@renderer/components/ui/button'
import { FormInput } from '@renderer/components/ui/form-input'
import { axiosInstance, getApi, postApi } from '@renderer/lib/http'
import { useToast } from '@renderer/components/ui/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select'
import { Textarea } from '@renderer/components/ui/textarea'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LicenseType } from '@renderer/types'
import { Customer } from '@prisma/client'
import { DateInput } from '@renderer/components/ui/date-input'

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

export default function AddLincense() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const authToken = useAuthHeader()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<Customer[]>([])

  const { isLoading, error, data } = useQuery({
    queryKey: ['license'],
    queryFn: () =>
      getApi<LicenseType[]>('/license-type?page=1&pageSize=30', {
        headers: {
          Authorization: authToken()
        }
      })
  })

  const infoArray = data?.data?.info || [] // Directly access the `info` array from `data.data`

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('/customer?page=1&pageSize=2', {
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
    mutationKey: ['AddLicense'],
    mutationFn: (datas: BookFormValue) =>
      postApi(
        '/license',
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
      queryClient.invalidateQueries({ queryKey: ['Books'] })
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
  if (isLoading) return 'Loading...'

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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl className="bg-transparent border-2 border-[#d1d5db] rounded-xl">
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl className="bg-transparent border-2 border-[#d1d5db] rounded-xl">
                        <SelectTrigger>
                          <SelectValue placeholder="اسم الشركة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customer.info.map((options) => (
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
                        className="h-10 p-0  rounded-xl text-sm"
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
                        className="h-10 p-0  rounded-xl text-sm"
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
                        className="h-10 p-0  rounded-xl text-sm"
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
                        className="bg-transparent border-2 border-[#d1d5db] rounded-xl"
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
                        className="h-10 p-0  rounded-xl text-sm"
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
                        className="h-10 p-0  rounded-xl text-sm"
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
                        className="h-10 p-0  rounded-xl text-sm"
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
                      <DateInput
                        {...field}
                        placeholder="تاريخ التخرج"
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
          <div className="w-full flex justify-end gap-2 mb-4">
            <Link to={'/state-affairs'}>
              <Button className="text-sm h-10  bg-[#fff] border-2 border-[#3734a9] text-[#3734a9] hover:bg-[#3734a9] hover:text-[#fff] hover:border-2 hover:border-white rounded-[12px] sm:w-28 sm:text-[10px] lg:w-40 lg:text-sm">
                إلغاء
              </Button>
            </Link>

            <Button
              className="text-sm h-10  bg-[#3734a9] border-2 border-[#3734a9] text-[#fff] hover:border-2 hover:border-[#2f2b94] hover:bg-[#fff] hover:text-[#2f2b94] rounded-[12px] sm:w-28 sm:text-[10px] lg:w-40 lg:text-sm"
              type="submit"
              id="AddLicenseForm"
            >
              حفظ
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
