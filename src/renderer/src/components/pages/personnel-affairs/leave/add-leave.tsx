import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../../ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAuthHeader } from 'react-auth-kit'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@renderer/components/ui/button'
import { FormInput } from '@renderer/components/ui/form-input'
import { getApi, postApi } from '@renderer/lib/http'
import { useToast } from '@renderer/components/ui/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select'
import { Textarea } from '@renderer/components/ui/textarea'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { EmployInfo, Leave } from '@renderer/types'
import { Plus } from 'lucide-react'

const formSchema = z.object({
  employeeeId: z.string(),
  leaveTypeId: z.string(),
  dayNumber: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  leaveNote: z.string()
})

type AddEmployeeValue = z.infer<typeof formSchema>

export default function AddLeaveIndex() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const authToken = useAuthHeader()
  const navigate = useNavigate()
  //   const [data, setData] = useState<Employ[]>([])
  const {
    data: employData,
    isLoading: employLoading,
    error: employError // Changed the name from employLoading to employError
  } = useQuery({
    queryKey: ['Employ'],
    queryFn: () =>
      getApi<EmployInfo[]>('/employ', {
        headers: {
          Authorization: authToken()
        }
      })
  })

  const {
    isLoading: _LeaveTypeLoading,
    error: _LeaveTypeError,
    data: LeaveTypeData
  } = useQuery({
    queryKey: ['Leave'],
    queryFn: () =>
      getApi<Leave>('/leave-type?page=1&pageSize=30', {
        headers: {
          Authorization: authToken()
        }
      })
  })

  // Assuming LeaveTypeData is correct and not LeaveTypeLoading in the last line
  const infoArray = employData?.data || []
  const DataArray = LeaveTypeData?.data?.info || [] // Changed LeaveTypeLoading to LeaveTypeData here

  //

  //
  const form = useForm<AddEmployeeValue>({
    resolver: zodResolver(formSchema)
  })

  const { mutate } = useMutation({
    mutationKey: ['AddLeave'],
    mutationFn: (datas: AddEmployeeValue) =>
      postApi(
        '/leave-details',
        {
          employeeeId: +datas.employeeeId,
          leaveTypeId: +datas.leaveTypeId,
          dayNumber: +datas.dayNumber,
          startDate: new Date(datas.startDate).toISOString(),
          endDate: new Date(datas.endDate).toISOString(),
          leaveNote: datas.leaveNote
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
      queryClient.invalidateQueries({ queryKey: ['leaveAllocation'] })
      navigate('/personnel-affairs')
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'حدث خطأ ما'
      toast({
        title: 'لم تتم العملية',
        description: errorMessage,
        variant: 'destructive'
      })
    }
  })

  const onSubmit = (datas: AddEmployeeValue) => {
    mutate(datas)
  }
  if (employLoading) return 'Loading...'

  if (employError) return 'An error has occurred: ' + employError.message
  return (
    <div className="min-h-[50vh] w-full mt-5">
      <Form {...form}>
        <form
          id="complainsForm"
          //   key={key}
          onSubmit={form.handleSubmit(onSubmit)}
          className=""
        >
         
          <div className="mb-4 bg-[#dedef8] rounded-t-lg">
            <h3 className="font-bold text-[#3734a9] p-3">بيانات الموظف الشخصية</h3>
          </div>

          <div className="grid min-h-[80px] mb-4  grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 min-h-[50px] -translate-y-2">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                اسم الموظف
              </label>
              <FormField
                control={form.control}
                name="employeeeId"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl className="bg-transparent mt-2 h-11 text-[#757575] text-base border-[3px] border-[#E5E7EB] rounded-xl">
                        <SelectTrigger>
                          <SelectValue placeholder="اسم الموظف" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {infoArray.map((options) => (
                          <SelectItem key={options.id} value={String(options.id)}>
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

            <div className=" col-span-1 min-h-[50px] -translate-y-2">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                نوع الإجازة
              </label>
              <FormField
                control={form.control}
                name="leaveTypeId"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl className="mt-2 bg-transparent h-11 text-[#757575] text-base border-[3px] border-[#E5E7EB] rounded-xl">
                        <SelectTrigger>
                          <SelectValue placeholder="نوع الإجازة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DataArray.map((options) => (
                          <SelectItem key={options.id} value={String(options.id)}>
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
                الايام
              </label>
              <FormField
                control={form.control}
                name="dayNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 px-3 placeholder:px-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        placeholder="   الايام "
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
          <div className="grid min-h-[80px] mb-4  grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                تاريخ بداية الإجازة
              </label>
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        {...field}
                        placeholder="تاريخ بداية الإجازة"
                        type="date"
                        className="h-11 px-1 placeholder:text-base  rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        onChange={(e) => {
                          field.onChange(e)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                تاريخ انتهاء الإجازة
              </label>
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        {...field}
                        placeholder="تاريخ انتهاء الإجازة"
                        type="date"
                        className="h-11 px-1 placeholder:text-base  rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        onChange={(e) => {
                          field.onChange(e)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/*  */}

          <div className="grid min-h-[150px] mb-4 grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 min-h-[40px] ">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                ملاحظات
              </label>
              <FormField
                control={form.control}
                name="leaveNote"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormControl>
                      <Textarea
                        className="bg-transparent mt-2 placeholder:text-base rounded-xl border-[3px] border-[#E5E7EB]"
                        rows={5}
                        {...field}
                        placeholder="ملاحظات"
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

          {/*  */}

          <div className="w-full flex justify-end gap-2 mb-4">
            <Link to={'/personnel-affairs'}>
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
