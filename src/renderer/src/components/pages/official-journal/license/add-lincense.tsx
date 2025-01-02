import { z } from 'zod'
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
import { Plus } from 'lucide-react'

export interface Customer {
  id: number
  name: string
  type: number
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
  referenceDate: z.string().refine(
    (date) => {
      // Parse the input date string (yyyy-mm-dd) and construct a new Date object
      const [year, month, day] = date.split('-').map(Number)
      const inputDate = new Date(year, month - 1, day) // Month is 0-based in JS Date

      const today = new Date()
      today.setHours(0, 0, 0, 0) // Set today's date to midnight to ignore time

      return inputDate <= today // Return true if inputDate is today or before
    },
    {
      message: 'Date must be today or before.'
    }
  )
})

type BookFormValue = z.infer<typeof formSchema>

const year = [
  { label: 'يناير', value: 1 },
  { label: 'فبراير', value: 2 },
  { label: 'مارس', value: 3 },
  { label: 'أبريل', value: 4 },
  { label: 'مايو', value: 5 },
  { label: 'يونيو', value: 6 },
  { label: 'يوليو', value: 7 },
  { label: 'أغسطس', value: 8 },
  { label: 'سبتمبر', value: 9 },
  { label: 'أكتوبر', value: 10 },
  { label: 'نوفمبر', value: 11 },
  { label: 'ديسمبر', value: 12 }
]
export default function AddLincense() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const authToken = useAuthHeader()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<Customer[]>([])

  console.log('customer', customer)
  const { isLoading, error, data } = useQuery({
    queryKey: ['license'],
    queryFn: () =>
      getApi<LicenseType>('/license-type?page=1&pageSize=30', {
        headers: {
          Authorization: authToken()
        }
      })
  })

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
  //
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (value) {
      const inputDate = new Date(value)
      const today = new Date()

      // Reset hours, minutes, seconds, and milliseconds for today
      today.setHours(0, 0, 0, 0)

      // Compare the date components directly
      const inputDateOnly = new Date(inputDate.setHours(0, 0, 0, 0))

      if (inputDateOnly > today) {
        toast({
          title: 'لم تتم العملية',
          description: 'التاريخ يجب أن يكون اليوم أو قبل اليوم.',
          variant: 'destructive'
        })
      }
    }
  }
  //
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
         
          <div className="mb-4 bg-[#dedef8] rounded-t-lg">
            <h3 className="font-bold text-[#3734a9] p-3">المعلومات الأساسية</h3>
          </div>

          <div className="grid min-h-[80px] mb-4  grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] -translate-y-2">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                نوع الرخصه
              </label>
              <FormField
                control={form.control}
                name="licenseTypeId"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl className="bg-transparent mt-2 h-11 text-[#595959] placeholder:text-[#595959] text-base border-[3px] border-[#E5E7EB] rounded-xl">
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

            <div className=" col-span-1 h-[50px] -translate-y-2">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                اسم الشركة
              </label>
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl className="bg-transparent mt-2 h-11 text-[#595959] placeholder:text-[#595959] text-base border-[3px] border-[#E5E7EB] rounded-xl">
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

            <div className=" col-span-1 h-[50px] -translate-y-2">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                مركز الشركة
              </label>
              <FormField
                control={form.control}
                name="compnayLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 px-3 placeholder:px-0 placeholder:text-base text-[#595959] placeholder:text-[#595959]  rounded-xl border-[3px] border-[#E5E7EB] text-sm"
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

          <div className="grid min-h-[80px] mb-4  grid-cols-2 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                مسؤول الشركة
              </label>
              <FormField
                control={form.control}
                name="compnayManger"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 px-3 placeholder:px-0 placeholder:text-base text-[#595959] placeholder:text-[#595959]  rounded-xl border-[3px] border-[#E5E7EB] text-sm"
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
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                رأس مال الشركة
              </label>
              <FormField
                control={form.control}
                name="compnayCapital"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 px-3 placeholder:px-0 text-[#595959] placeholder:text-[#595959] placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
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

          <div className="grid min-h-[150px] mb-4 grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 min-h-[40px] ">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                غرض الشركة
              </label>
              <FormField
                control={form.control}
                name="compnayPorpose"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormControl>
                      <Textarea
                        className="bg-transparent mt-2 text-[#595959] placeholder:text-[#595959] placeholder:text-base rounded-xl border-[3px] border-[#E5E7EB]"
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

          <div className="grid min-h-[80px] mb-4  grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                رقم الترخيص
              </label>
              <FormField
                control={form.control}
                name="licenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 px-3 placeholder:px-0 text-[#595959] placeholder:text-[#595959] placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
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
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                السنة
              </label>
              <FormField
                control={form.control}
                name="licenseYear"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl className="bg-transparent h-11 text-[#757575] text-base border-[3px] border-[#E5E7EB] rounded-xl translate-y-2">
                          <SelectTrigger>
                            <SelectValue placeholder="المرفق الحكومي" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {year.map((years) => (
                            <SelectItem key={years.value} value={String(years.value)}>
                              {years.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/*  */}
          </div>

          {/*  */}
          <div className="grid min-h-[80px] mb-4  grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-2 h-[50px] ">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                رقم السند
              </label>
              <FormField
                control={form.control}
                name="referenceNum"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 px-3 placeholder:px-0 placeholder:text-base text-[#595959] placeholder:text-[#595959]  rounded-xl border-[3px] border-[#E5E7EB] text-sm"
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
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                تاريخ السند
              </label>
              <FormField
                control={form.control}
                name="referenceDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        {...field}
                        placeholder="تاريخ السند"
                        type="date"
                        className="h-11 px-1 placeholder:text-base text-[#595959] placeholder:text-[#595959] rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        onChange={(e) => {
                          field.onChange(e)
                          handleDateChange(e) // Validation is triggered whenever the value changes
                        }}
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
            <Link to={'/official-journal'}>
              <Button className="text-sm h-10 md:w-30 lg:w-30  bg-[#fff] border-2 border-[#3734a9] text-[#3734a9] hover:bg-[#3734a9] hover:text-[#fff] hover:border-2 hover:border-white rounded-[12px] sm:w-28 sm:text-[10px]  lg:text-sm">
                إلغاء
              </Button>
            </Link>

            <Button
              className="text-sm h-10 md:w-30 lg:w-30  bg-[#3734a9] border-2 border-[#3734a9] text-[#fff] hover:border-2 hover:border-[#2f2b94] hover:bg-[#fff] hover:text-[#2f2b94] rounded-[12px] sm:w-28 sm:text-[10px]  lg:text-sm"
              type="submit"
            >
              <p className="font-bold text-base">حفظ</p>
              <Plus className="mr-2" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
