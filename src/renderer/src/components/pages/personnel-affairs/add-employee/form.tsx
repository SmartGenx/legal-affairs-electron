import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../../ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAuthHeader } from 'react-auth-kit'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@renderer/components/ui/button'
import { FormInput } from '@renderer/components/ui/form-input'
import { postApi } from '@renderer/lib/http'
import { useToast } from '@renderer/components/ui/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import FileUploader from './FileUploader'
import { Plus } from 'lucide-react'

const formSchema = z.object({
  name: z.string(),
  reference: z.string(),
  phone: z.string(),
  address: z.string(),
  dob: z.string(),
  education: z.string(),
  megor: z.string(),
  graduationDate: z.string(),
  idtype: z.string(),
  idNumber: z.string(),
  issuerDate: z.string(),
  issuerPlace: z.string(),
  empLeaved: z.string(),
  empDgree: z.string(),
  position: z.string(),
  salary: z.string(),
  firstEmployment: z.string(),
  employmentDate: z.string(),
  currentUnit: z.string(),
  currentEmploymentDate: z.string(),
  legalStatus: z.string(),
  employeeStatus: z.string(),
  file: z.instanceof(File).optional(),
  detailsDate: z.string()
})

type AddEmployeeValue = z.infer<typeof formSchema>

const idTypes = [
  { label: 'بطاقة', value: 1 },
  { label: 'جواز', value: 2 },
  { label: 'شهادة ميلاد', value: 3 }
]
const empStatus = [
  { label: 'موظف', value: 1 },
  { label: 'متقاعد', value: 2 },
  { label: 'اجر يومي', value: 3 }
]
const LeaveStatus = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' }
]
export default function AddEmployeeIndex() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const authToken = useAuthHeader()
  const navigate = useNavigate()

  const form = useForm<AddEmployeeValue>({
    resolver: zodResolver(formSchema)
  })

  const { mutate } = useMutation({
    mutationKey: ['AddEmployee'],
    mutationFn: (datas: AddEmployeeValue) => {
      const formData = new FormData()
      formData.append('name', datas.name)
      formData.append('reference', datas.reference)
      formData.append('phone', datas.phone)
      formData.append('address', datas.address)
      formData.append('dob', new Date(datas.dob).toISOString())
      formData.append('education', datas.education)
      formData.append('megor', datas.megor)
      formData.append('graduationDate', new Date(datas.graduationDate).toISOString())
      formData.append('idtype', datas.idtype)
      formData.append('idNumber', datas.idNumber)
      formData.append('issuerDate', new Date(datas.issuerDate).toISOString())
      formData.append('issuerPlace', datas.issuerPlace)
      formData.append('empLeaved', datas.empLeaved)
      formData.append('empDgree', datas.empDgree)
      formData.append('position', datas.position)
      formData.append('salary', datas.salary)
      formData.append('firstEmployment', new Date(datas.firstEmployment).toISOString())
      formData.append('employmentDate', new Date(datas.employmentDate).toISOString())
      formData.append('currentUnit', datas.currentUnit)
      formData.append('currentEmploymentDate', new Date(datas.currentEmploymentDate).toISOString())
      formData.append('legalStatus', datas.legalStatus)
      formData.append('employeeStatus', datas.employeeStatus)
      formData.append('detailsDate', new Date(datas.detailsDate).toISOString())

      if (datas.file) {
        formData.append('file', datas.file)
      }

      return postApi('/employ/create_employ', formData, {
        headers: {
          Authorization: `${authToken()}`
        }
      })
    },
    onSuccess: () => {
      toast({
        title: 'اشعار',
        variant: 'success',
        description: 'تمت الاضافة بنجاح'
      })
      queryClient.invalidateQueries({ queryKey: ['Employ'] })
      queryClient.invalidateQueries({ queryKey: ['EmployInfo'] })
      queryClient.invalidateQueries({ queryKey: ['EmployInfoView'] })
      queryClient.invalidateQueries({ queryKey: ['statisticsSDashboard'] })
      setTimeout(() => {
        window.location.reload()
      }, 1000)
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

          <div className="grid h-[80px] mb-4  grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                اسم الموظف
              </label>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 p-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        placeholder="   اسم الموظف "
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
                رقم الموظف
              </label>
              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 p-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        placeholder="   رقم الموظف "
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
                رقم الهاتف
              </label>
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 p-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        placeholder="   رقم الهاتف "
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
          <div className="grid h-[80px] mb-4   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                العنوان
              </label>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 p-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        placeholder="   العنوان "
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
                تاريخ الميلاد
              </label>
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        {...field}
                        placeholder="تاريخ الميلاد"
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
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                المؤهل التعليمي
              </label>
              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 p-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        placeholder="   المؤهل التعليمي "
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

          <div className="grid h-[80px] mb-4   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                التخصص
              </label>
              <FormField
                control={form.control}
                name="megor"
                render={({ field }) => (
                  <FormItem>
                    <FormInput
                      className="h-11 p-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                      placeholder="التخصص "
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className=" col-span-1 h-[50px] -translate-y-2">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                تاريخ التخرج
              </label>
              <FormField
                control={form.control}
                name="graduationDate"
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

            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                نوع الهوية
              </label>
              <FormField
                control={form.control}
                name="idtype"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl className="bg-transparent h-11 text-[#757575] text-base border-[3px] border-[#E5E7EB] rounded-xl">
                        <SelectTrigger>
                          <SelectValue placeholder="نوع الهوية" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {idTypes.map((type) => (
                          <SelectItem key={type.value} value={String(type.value)}>
                            {type.label}
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

          {/*  */}

          <div className="grid h-[80px] mb-4   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                رقم الهوية
              </label>
              <FormField
                control={form.control}
                name="idNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 p-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        placeholder="   رقم الهوية "
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
                تاريخ الإصدار
              </label>
              <FormField
                name="issuerDate"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        {...field}
                        placeholder="تاريخ الإصدار"
                        type="date"
                        className="h-11 px-1 placeholder:text-base  rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                مكان الاصدار
              </label>
              <FormField
                control={form.control}
                name="issuerPlace"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 p-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        placeholder="   مكان الاصدار "
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

          <div className="grid h-[80px] mb-4   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] translate-y-2">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                اجازة الموظف
              </label>
              <FormField
                control={form.control}
                name="empLeaved"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl className="bg-transparent h-11 text-[#757575] text-base border-[3px] border-[#E5E7EB] rounded-xl">
                          <SelectTrigger>
                            <SelectValue placeholder="اجازة الموظف" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LeaveStatus.map((status) => (
                            <SelectItem key={status.value} value={String(status.value)}>
                              {status.label}
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

            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                درجة الموظف
              </label>
              <FormField
                control={form.control}
                name="empDgree"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 p-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        placeholder="   درجة الموظف "
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
                المنصب
              </label>
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 p-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        placeholder="   المنصب "
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
          <div className="grid h-[80px] mb-4   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                الراتب
              </label>
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 p-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        placeholder="   الراتب "
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
                تاريخ التوظيف الاول
              </label>
              <FormField
                control={form.control}
                name="firstEmployment"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        {...field}
                        placeholder="تاريخ التوظيف الاول"
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
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                تاريخ التوظيف
              </label>
              <FormField
                control={form.control}
                name="employmentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        {...field}
                        placeholder="تاريخ التوظيف"
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

          {/*  */}

          <div className="grid h-[80px] mb-4   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                الوحدة الحالية
              </label>
              <FormField
                control={form.control}
                name="currentUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormInput
                      className="h-11 p-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                      placeholder="الوحدة الحالية"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className=" col-span-1 h-[50px] -translate-y-2">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                تاريخ التوظيف في الوحدة
              </label>
              <FormField
                control={form.control}
                name="currentEmploymentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        {...field}
                        placeholder="تاريخ  التوظيف في الوحدة"
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
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                المركز القانوني
              </label>
              <FormField
                control={form.control}
                name="legalStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormInput
                      className="h-11 p-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                      placeholder="المركز القانوني"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/*  */}
          </div>

          {/*  */}
          <div className="grid h-[80px] mb-4   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-sm text-[#757575] ">
                حالة الموظف
              </label>
              <FormField
                control={form.control}
                name="employeeStatus"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl className="bg-transparent h-11 text-[#757575] text-base border-[3px] border-[#E5E7EB] rounded-xl">
                        <SelectTrigger>
                          <SelectValue placeholder="حالة الموظف" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {empStatus.map((status) => (
                          <SelectItem key={status.value} value={String(status.value)}>
                            {status.label}
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
              <label htmlFor="" className="font-bold text-sm text-[#757575] ">
                تاريخ التوظيف في الوحدة
              </label>
              <FormField
                control={form.control}
                name="detailsDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        {...field}
                        placeholder="تاريخ  التوظيف في الوحدة"
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

          <div className="mb-4 bg-[#dedef8] rounded-t-lg">
            <h3 className="font-bold text-[#3734a9] p-3">أرفاق مرفق</h3>
          </div>

          <div className="grid h-[150px]  grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[40px] ">
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div>
                        <p className="mb-2 text-start text-lg font-medium">أرفاق صورة القرار</p>
                        <FileUploader
                          setValue={form.setValue}
                          inputId={'file'}
                          isMultiple={false}
                          {...field}
                          onChange={async (files) => {
                            try {
                              if (!files?.[0]) return

                              field.onChange(files[0])
                            } catch (error) {
                              JSON.stringify(error)
                            }
                          }}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
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
