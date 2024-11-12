import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../../ui/form'
import { useEffect } from 'react'
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
import FileUploader from './FileUploader'
import { DateInput } from '@renderer/components/ui/date-input'
import { EmployInfo } from '@renderer/types'

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

const major = [
  { label: 'aa', value: 1 },
  { label: 'asdada', value: 2 },
  { label: 'azxczxczxa', value: 3 },
  { label: 'wwww', value: 4 }
]
const idTypes = [
  { label: 'aa', value: 1 },
  { label: 'asdada', value: 2 },
  { label: 'azxczxczxa', value: 3 },
  { label: 'wwww', value: 4 }
]
const units = [
  { label: 'aa', value: 1 },
  { label: 'asdada', value: 2 },
  { label: 'azxczxczxa', value: 3 },
  { label: 'wwww', value: 4 }
]
const legalStatus = [
  { label: 'aa', value: 1 },
  { label: 'asdada', value: 2 },
  { label: 'azxczxczxa', value: 3 },
  { label: 'wwww', value: 4 }
]
const empStatus = [
  { label: 'aa', value: 1 },
  { label: 'asdada', value: 2 },
  { label: 'azxczxczxa', value: 3 },
  { label: 'wwww', value: 4 }
]
export default function UpdateEmployeeIndex() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const authToken = useAuthHeader()
  const navigate = useNavigate()

  const fetchData = async () => {
    const response = await axiosInstance.get<EmployInfo>(`/employ/${id}`, {
      headers: {
        Authorization: `${authToken()}`
      }
    })
    return response.data
  }

  const {
    data: EmployeeData,
    error: EmployeeError,
    isLoading: EmployeeIsLoading
  } = useQuery({
    queryKey: ['Employ', id],
    queryFn: fetchData,
    enabled: !!id
  })
  console.log('sdsdfsdfs', EmployeeData)
  const form = useForm<AddEmployeeValue>({
    resolver: zodResolver(formSchema)
  })

  useEffect(() => {
    if (EmployeeData) {
      form.reset({
        name: EmployeeData.name,
        reference: EmployeeData.reference,
        phone: EmployeeData.phone,
        address: EmployeeData.address,
        dob: new Date(EmployeeData.dob).toISOString().split('T')[0],
        education: EmployeeData.education,
        megor: String(EmployeeData.megor),
        graduationDate: new Date(EmployeeData.graduationDate).toISOString().split('T')[0],
        idtype: String(EmployeeData.idtype),
        idNumber: EmployeeData.idNumber,
        issuerDate: new Date(EmployeeData.issuerDate).toISOString().split('T')[0],
        issuerPlace: EmployeeData.issuerPlace,
        empLeaved: EmployeeData.empLeaved,
        empDgree: String(EmployeeData.empDgree),
        position: EmployeeData.position,
        salary: String(EmployeeData.salary),
        firstEmployment: new Date(EmployeeData.firstEmployment).toISOString().split('T')[0],
        employmentDate: new Date(EmployeeData.employmentDate).toISOString().split('T')[0],
        currentUnit: String(EmployeeData.currentUnit),
        currentEmploymentDate: new Date(EmployeeData.currentEmploymentDate)
          .toISOString()
          .split('T')[0],
        legalStatus: String(EmployeeData.legalStatus),
        employeeStatus: String(EmployeeData.employeeStatus),
        detailsDate: new Date(EmployeeData.detailsDate).toISOString().split('T')[0]
      })
    }
  }, [EmployeeData])
  const { mutate } = useMutation({
    mutationKey: ['UpdateEmployee'],
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

      return patchApi(`/employ/${id}`, formData, {
        headers: {
          Authorization: `${authToken()}`
        }
      })
    },
    onSuccess: () => {
      toast({
        title: 'اشعار',
        variant: 'success',
        description: 'تمت التعديل بنجاح'
      })
      queryClient.invalidateQueries({ queryKey: ['Employ'] })
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
              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-10 p-0  rounded-xl text-sm"
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
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-10 p-0  rounded-xl text-sm"
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
          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-10 p-0  rounded-xl text-sm"
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
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DateInput
                        {...field}
                        placeholder="تاريخ الميلاد"
                        type="date"
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
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-10 p-0  rounded-xl text-sm"
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

          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <FormField
                control={form.control}
                name="megor"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ? String(field.value) : String(EmployeeData?.megor)}
                      defaultValue={field.value}
                    >
                      <FormControl className="bg-transparent border-2 border-[#d1d5db] rounded-xl translate-y-2">
                        <SelectTrigger>
                          <SelectValue placeholder="التخصص" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {major.map((type) => (
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

            <div className=" col-span-1 h-[50px] ">
              <FormField
                control={form.control}
                name="graduationDate"
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

            <div className=" col-span-1 h-[50px] ">
              <FormField
                control={form.control}
                name="idtype"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ? String(field.value) : String(EmployeeData?.idtype)}
                      defaultValue={field.value}
                    >
                      <FormControl className="bg-transparent border-2 border-[#d1d5db] rounded-xl translate-y-2">
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

          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <FormField
                control={form.control}
                name="idNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-10 p-0  rounded-xl text-sm"
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
              <FormField
                name="issuerDate"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DateInput {...field} placeholder="تاريخ الإصدار" type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className=" col-span-1 h-[50px] ">
              <FormField
                control={form.control}
                name="issuerPlace"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-10 p-0  rounded-xl text-sm"
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

          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <FormField
                control={form.control}
                name="empLeaved"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-10 p-0  rounded-xl text-sm"
                        placeholder="   اجازة الموظف "
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
                name="empDgree"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-10 p-0  rounded-xl text-sm"
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
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-10 p-0  rounded-xl text-sm"
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
          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-10 p-0  rounded-xl text-sm"
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
              <FormField
                control={form.control}
                name="firstEmployment"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DateInput
                        {...field}
                        placeholder="تاريخ التوظيف الاول"
                        type="date"
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
                name="employmentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DateInput
                        {...field}
                        placeholder="تاريخ التوظيف"
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

          {/*  */}

          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <FormField
                control={form.control}
                name="currentUnit"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ? String(field.value) : String(EmployeeData?.currentUnit)}
                      defaultValue={field.value}
                    >
                      <FormControl className="bg-transparent border-2 border-[#d1d5db] rounded-xl translate-y-2">
                        <SelectTrigger>
                          <SelectValue placeholder="الوحدة الحالية" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit.value} value={String(unit.value)}>
                            {unit.label}
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
                name="currentEmploymentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DateInput
                        {...field}
                        placeholder="تاريخ  التوظيف في الوحدة"
                        type="date"
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
                name="legalStatus"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ? String(field.value) : String(EmployeeData?.legalStatus)}
                      defaultValue={field.value}
                    >
                      <FormControl className="bg-transparent border-2 border-[#d1d5db] rounded-xl translate-y-2">
                        <SelectTrigger>
                          <SelectValue placeholder="المركز القانوني" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {legalStatus.map((legal) => (
                          <SelectItem key={legal.value} value={String(legal.value)}>
                            {legal.label}
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
          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <FormField
                control={form.control}
                name="employeeStatus"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      value={
                        field.value ? String(field.value) : String(EmployeeData?.employeeStatus)
                      }
                      defaultValue={field.value}
                    >
                      <FormControl className="bg-transparent border-2 border-[#d1d5db] rounded-xl translate-y-2">
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

            <div className=" col-span-1 h-[50px] ">
              <FormField
                control={form.control}
                name="detailsDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DateInput
                        {...field}
                        placeholder="تاريخ  التوظيف في الوحدة"
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
