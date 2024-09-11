import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../../../ui/form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAuthHeader } from 'react-auth-kit'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@renderer/components/ui/button'
import { FormInput } from '@renderer/components/ui/form-input'
import { axiosInstance, patchApi, postApi } from '@renderer/lib/http'
import { useToast } from '@renderer/components/ui/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../ui/select'
import { Textarea } from '@renderer/components/ui/textarea'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// import FileUploader from './FileUploader'
import { Label } from '@renderer/components/ui/label'
import TextLabel from '@renderer/components/ui/text-label'
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
export default function EmployeeInfo() {
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
            <label htmlFor="">اسم الموظف</label>
            <p>{EmployeeData?.name}</p>
          </div>

          <div className=" col-span-1 h-[50px] ">
            <label htmlFor="">رقم الموظف</label>
            <p>{EmployeeData?.reference}</p>
          </div>

          <div className=" col-span-1 h-[50px] ">
            <label htmlFor="">رقم الهاتف</label>
            <p>{EmployeeData?.phone}</p>
          </div>
          {/*  */}
        </div>

        {/*  */}
        <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
          <div className=" col-span-1 h-[50px] ">
            <label htmlFor="">العنوان</label>
            <p>{EmployeeData?.address}</p>
          </div>

          <div className=" col-span-1 h-[50px] ">
            <p>تاريخ الميلاد</p>
            <p>{String(EmployeeData?.dob).split('T')[0]}</p>
          </div>

          <div className=" col-span-1 h-[50px] ">
            <label htmlFor="">المؤهل التعليمي</label>
            <p>{EmployeeData?.education}</p>
          </div>
          {/*  */}
        </div>

        {/*  */}

        <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
          <div className=" col-span-1 h-[50px] ">
            <label htmlFor="">التخصص</label>
            <p>{major.filter((x) => x.value === EmployeeData?.megor).map((x) => x.label)}</p>
          </div>

          <div className=" col-span-1 h-[50px] ">
            <label htmlFor="">تاريخ التخرج</label>
            <p>{String(EmployeeData?.graduationDate).split('T')[0]}</p>
          </div>

          <div className=" col-span-1 h-[50px] ">
            <label htmlFor="">نوع الهوية</label>
            <p>{idTypes.filter((x) => x.value === EmployeeData?.idtype).map((x) => x.label)}</p>
          </div>
          {/*  */}
        </div>

        {/*  */}

        <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
          <div className=" col-span-1 h-[50px] ">
            <label htmlFor="">رقم الهوية</label>
            <p>{EmployeeData?.idNumber}</p>
          </div>

          <div className=" col-span-1 h-[50px] ">
            <label htmlFor="">تاريخ الإصدار</label>
            <p>{String(EmployeeData?.issuerDate).split('T')[0]}</p>
          </div>

          <div className=" col-span-1 h-[50px] ">
            <label htmlFor="">مكان الاصدار</label>
            <p>{EmployeeData?.issuerPlace}</p>
          </div>
          {/*  */}
        </div>

        {/*  */}

        <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
          <div className=" col-span-1 h-[50px] ">
            <label htmlFor="">اجازة الموظف</label>
            <p>{EmployeeData?.empLeaved}</p>
          </div>

          <div className=" col-span-1 h-[50px] ">
            <label htmlFor="">درجة الموظف</label>
            <p>{EmployeeData?.empDgree}</p>
          </div>

          <div className=" col-span-1 h-[50px] ">
            <label htmlFor="">المنصب</label>
            <p>{EmployeeData?.position}</p>
          </div>
          {/*  */}
        </div>

        {/*  */}
        <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
          <div className=" col-span-1 h-[50px] ">
            <label htmlFor="">الراتب</label>
            <p>{EmployeeData?.salary}</p>
          </div>

          <div className=" col-span-1 h-[50px] ">
            <label htmlFor="">تاريخ التوظيف الاول</label>
            <p>{String(EmployeeData?.firstEmployment).split('T')[0]}</p>
          </div>

          <div className=" col-span-1 h-[50px] ">
            <label htmlFor="">تاريخ التوظيف</label>
            <p>{String(EmployeeData?.employmentDate).split('T')[0]}</p>
          </div>
          {/*  */}
        </div>

        {/*  */}

        <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
          <div className=" col-span-1 h-[50px] ">
            <label htmlFor="">الوحدة الحالية</label>
            <p>{units.filter((x) => x.value === EmployeeData?.currentUnit).map((x) => x.label)}</p>
          </div>

          <div className=" col-span-1 h-[50px] ">
            <label htmlFor="">تاريخ التوظيف في الوحدة</label>
            <p>{String(EmployeeData?.currentEmploymentDate).split('T')[0]}</p>
          </div>

          <div className=" col-span-1 h-[50px] ">
            <label htmlFor="">المركز القانوني</label>
            <p>
              {legalStatus.filter((x) => x.value === EmployeeData?.legalStatus).map((x) => x.label)}
            </p>
          </div>
          {/*  */}
        </div>

        {/*  */}
        <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
          <div className=" col-span-1 h-[50px] ">
            <label htmlFor="">حالة الموظف</label>
            <p>
              {empStatus
                .filter((x) => x.value === EmployeeData?.employeeStatus)
                .map((x) => x.label)}
            </p>
          </div>

          <div className=" col-span-1 h-[50px] ">
            <label htmlFor="">تاريخ التوظيف في الوحدة</label>
            <p>{String(EmployeeData?.detailsDate).split('T')[0]}</p>
          </div>

          {/*  */}
        </div>

        <div className="mb-4 bg-[#dedef8] rounded-t-lg">
          <h3 className="font-bold text-[#3734a9] p-3">أرفاق مرفق</h3>
        </div>

        <div className="grid h-[150px]  grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
          <div className=" col-span-1 h-[40px] bg-black">
            <img src={EmployeeData?.Attachment} alt="" />
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
    </div>
  )
}
