import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../../ui/form'
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
import { Employ, Leave } from '@renderer/types'
import { useEffect } from 'react'

const formSchema = z.object({
  employeeeId: z.string(),
  leaveTypeId: z.string(),
  dayNumber: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  leaveNote: z.string()
})

export interface LeaveResp {
  id: number
  employeeeId: number
  leaveTypeId: number
  dayNumber: number
  year: number
  startDate: Date
  endDate: Date
  leaveNote: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
  LeaveType: LeaveType
  employ: EmployRes
}

export interface LeaveType {
  id: number
  name: string
  defaultDay: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

export interface EmployRes {
  id: number
  name: string
  reference: string
  phone: string
  address: string
  dob: Date
  education: string
  megor: number
  graduationDate: Date
  idtype: number
  idNumber: string
  issuerDate: Date
  issuerPlace: string
  empLeaved: string
  empDgree: number
  position: string
  salary: number
  firstEmployment: Date
  employmentDate: Date
  currentUnit: number
  currentEmploymentDate: Date
  legalStatus: number
  employeeStatus: number
  detailsDate: Date
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

type AddEmployeeValue = z.infer<typeof formSchema>

export default function UpdateLeaveIndex() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const authToken = useAuthHeader()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const fetchDataById = async () => {
    const response = await axiosInstance.get<LeaveResp[]>(
      `/leave-details?include[LeaveType]=true&include[employ]=true&id=${id}`,
      {
        headers: {
          Authorization: `${authToken()}`
        }
      }
    )
    return response.data
  }
  const {
    data: BookData,
    error: _BookError,
    isLoading: _BookIsLoading
  } = useQuery({
    queryKey: ['LeaveByIdResp', id],
    queryFn: fetchDataById,
    enabled: !!id
  })

  console.log('BookData', BookData)
  useEffect(() => {
    if (BookData) {
      form.reset({
        employeeeId: String(BookData[0].employeeeId),
        leaveTypeId: String(BookData[0].leaveTypeId),
        dayNumber: String(BookData[0].dayNumber),
        startDate: String(BookData[0].startDate).split('T')[0],
        endDate: String(BookData[0].endDate).split('T')[0],
        leaveNote: String(BookData[0].leaveNote)
      })
    }
  }, [BookData])
  const {
    data: employData,
    isLoading: employLoading,
    error: employError // Changed the name from employLoading to employError
  } = useQuery({
    queryKey: ['Employ'],
    queryFn: () =>
      getApi<Employ>('/employ?page=1&pageSize=30', {
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
  const infoArray = employData?.data?.info || []
  const DataArray = LeaveTypeData?.data?.info || [] // Changed LeaveTypeLoading to LeaveTypeData here

  console.log('DataArray', DataArray)
  //   useEffect(() => {
  //     fetchData()
  //   }, [])
  const form = useForm<AddEmployeeValue>({
    resolver: zodResolver(formSchema)
  })

  const { mutate } = useMutation({
    mutationKey: ['AddLeave'],
    mutationFn: (datas: AddEmployeeValue) =>
      patchApi(
        `/leave-details/${id}`,
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
      queryClient.invalidateQueries({ queryKey: ['LeaveByIdResp', id] })
      navigate('/personnel-affairs')
    },
    onError: (error) => {
      toast({
        title: 'لم تتم العملية',
        description: error.message,
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
          {process.env.NODE_ENV === 'development' && (
            <>
              <p>Ignore it, it just in dev mode</p>
              <div>{JSON.stringify(form.formState.errors)}</div>
            </>
          )}
          <div className="mb-4 bg-[#dedef8] rounded-t-lg">
            <h3 className="font-bold text-[#3734a9] p-3">بيانات الموظف الشخصية</h3>
          </div>

          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] translate-y-2">
              <FormField
                control={form.control}
                name="employeeeId"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      value={
                        field.value
                          ? String(field.value)
                          : BookData && BookData.length > 0
                            ? String(BookData[0].employeeeId)
                            : '' // fallback in case BookData is undefined or empty
                      }
                      defaultValue={field.value}
                    >
                      <FormControl className="bg-transparent h-11 text-[#757575] text-base border-[3px] border-[#E5E7EB] rounded-xl">
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

            <div className=" col-span-1 h-[50px] translate-y-2">
              <FormField
                control={form.control}
                name="leaveTypeId"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange}
                    value={
                        field.value
                          ? String(field.value)
                          : BookData && BookData.length > 0
                            ? String(BookData[0].leaveTypeId)
                            : '' // fallback in case BookData is undefined or empty
                      }
                    defaultValue={field.value}>
                      <FormControl className="bg-transparent h-11 text-[#757575] text-base border-[3px] border-[#E5E7EB] rounded-xl">
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

            <div className=" col-span-1 h-[50px] ">
              <FormField
                control={form.control}
                name="dayNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 p-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
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
          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
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
                        onChange={(e) => field.onChange(e.target.value)}
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
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        {...field}
                        placeholder="تاريخ انتهاء الإجازة"
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
          </div>

          {/*  */}

          <div className="grid h-[150px]  grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[40px] ">
              <FormField
                control={form.control}
                name="leaveNote"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormControl>
                      <Textarea
                        className="bg-transparent placeholder:text-base rounded-xl border-[3px] border-[#E5E7EB]"
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
