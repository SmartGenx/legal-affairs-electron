import { z } from 'zod'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAuthHeader } from 'react-auth-kit'
import { Link, useParams } from 'react-router-dom'
import { axiosInstance } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import { EmployInfo } from '@renderer/types'
import { ArrowRight, LoaderIcon } from 'lucide-react'
import { Separator } from '@renderer/components/ui/separator'
import { Button } from '@renderer/components/ui/button'
import Pdf from '@renderer/components/icons/pdf'
import Png from '@renderer/components/icons/png'

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

export default function EmployeeInfo() {
  const [modalOpen, setModalOpen] = useState(false)
  const { id } = useParams<{ id: string }>()
  const authToken = useAuthHeader()

  const fetchData = async () => {
    const response = await axiosInstance.get<EmployInfo>(`/employ/${id}?include[Attachment]=true`, {
      headers: {
        Authorization: `${authToken()}`
      }
    })
    return response.data
  }

  const {
    data: EmployeeData,
    error: _EmployeeError,
    isLoading: _EmployeeIsLoading,
    isPending: EmployeeIsPending
  } = useQuery({
    queryKey: ['EmployInfo', id],
    queryFn: fetchData,
    enabled: !!id
  })

  const form = useForm<AddEmployeeValue>({
    resolver: zodResolver(formSchema)
  })
  console.log('EmployeeData', EmployeeData)
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

  const openModal = () => {
    if (EmployeeData?.Attachment?.[0]?.file) {
      setModalOpen(true)
    }
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const attachedUrlPrec = EmployeeData?.Attachment?.[0]?.file ?? 'لايوجد'
  const isPDF = attachedUrlPrec?.toLowerCase().endsWith('.pdf')

  if (EmployeeIsPending) {
    return (
      <div className="flex w-full items-center justify-center ">
        <LoaderIcon className="mt-12 flex animate-spin items-center justify-end duration-1000" />
      </div>
    )
  }

  return (
    <>
      <div className=" flex items-center text-3xl">
        <Link to={'/personnel-affairs'}>
          <Button className="w-16 h-12 bg-transparent text-[#3734a9] hover:bg-[#3734a9] hover:text-white rounded-2xl border-2 border-[#3734a9] hover:border-2 hover:border-[#fff]">
            <ArrowRight size={20} />
          </Button>
        </Link>
        <h1 className="mr-2 text-[#3734a9] font-bold">{EmployeeData?.name}</h1>
      </div>
      <div className="min-h-[50vh] w-full mt-5">
        <div>
          <div className="mb-4 bg-[#dedef8] rounded-t-lg">
            <h3 className="font-bold text-[#3734a9] p-3 text-xl">بيانات الموظف الشخصية</h3>
          </div>

          <div className="bg-[#dedef8] w-[95%] min-h-[40vh] m-auto rounded-2xl px-4 py-2">
            <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
              <div className=" col-span-1 h-[50px] text-[#757575] ">
                <label className="font-bold text-lg" htmlFor="">
                  اسم الموظف
                </label>
                <p className="mt-2">{EmployeeData?.name}</p>
              </div>

              <div className=" col-span-1 h-[50px] text-[#757575] ">
                <label className="font-bold text-lg" htmlFor="">
                  رقم الموظف
                </label>
                <p className="mt-2">{EmployeeData?.reference}</p>
              </div>

              <div className=" col-span-1 h-[50px] text-[#757575] ">
                <label className="font-bold text-lg" htmlFor="">
                  رقم الهاتف
                </label>
                <p className="mt-2">{EmployeeData?.phone}</p>
              </div>
              {/*  */}
            </div>
            <Separator className="bg-[#757575] h-[2px] my-2" />
            {/*  */}
            <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
              <div className=" col-span-1 h-[50px] text-[#757575] ">
                <label className="font-bold text-lg" htmlFor="">
                  العنوان
                </label>
                <p className="mt-2">{EmployeeData?.address}</p>
              </div>

              <div className=" col-span-1 h-[50px] text-[#757575] ">
                <label className="font-bold text-lg">تاريخ الميلاد</label>
                <p className="mt-2">{String(EmployeeData?.dob).split('T')[0]}</p>
              </div>

              <div className=" col-span-1 h-[50px] text-[#757575] ">
                <label className="font-bold text-lg" htmlFor="">
                  المؤهل التعليمي
                </label>
                <p className="mt-2">{EmployeeData?.education}</p>
              </div>
              {/*  */}
            </div>
            <Separator className="bg-[#757575] h-[2px] my-2" />
            {/*  */}

            <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
              <div className=" col-span-1 h-[50px] text-[#757575] ">
                <label className="font-bold text-lg" htmlFor="">
                  التخصص
                </label>
                <p className="mt-2">{EmployeeData?.megor}</p>
              </div>

              <div className=" col-span-1 h-[50px] text-[#757575] ">
                <label className="font-bold text-lg" htmlFor="">
                  تاريخ التخرج
                </label>
                <p className="mt-2">{String(EmployeeData?.graduationDate).split('T')[0]}</p>
              </div>

              <div className=" col-span-1 h-[50px] text-[#757575] ">
                <label className="font-bold text-lg" htmlFor="">
                  نوع الهوية
                </label>
                <p className="mt-2">
                  {idTypes.filter((x) => x.value === EmployeeData?.idtype).map((x) => x.label)}
                </p>
              </div>
              {/*  */}
            </div>
            <Separator className="bg-[#757575] h-[2px] my-2" />
            {/*  */}

            <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
              <div className=" col-span-1 h-[50px] text-[#757575] ">
                <label className="font-bold text-lg" htmlFor="">
                  رقم الهوية
                </label>
                <p className="mt-2">{EmployeeData?.idNumber}</p>
              </div>

              <div className=" col-span-1 h-[50px] text-[#757575] ">
                <label className="font-bold text-lg" htmlFor="">
                  تاريخ الإصدار
                </label>
                <p className="mt-2">{String(EmployeeData?.issuerDate).split('T')[0]}</p>
              </div>

              <div className=" col-span-1 h-[50px] text-[#757575] ">
                <label className="font-bold text-lg" htmlFor="">
                  مكان الاصدار
                </label>
                <p className="mt-2">{EmployeeData?.issuerPlace}</p>
              </div>
              {/*  */}
            </div>
            <Separator className="bg-[#757575] h-[2px] my-2" />
            {/*  */}

            <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
              <div className=" col-span-1 h-[50px] text-[#757575] ">
                <label className="font-bold text-lg" htmlFor="">
                  اجازة الموظف
                </label>
                <p className="mt-2">{EmployeeData?.empLeaved}</p>
              </div>

              <div className=" col-span-1 h-[50px] text-[#757575] ">
                <label className="font-bold text-lg" htmlFor="">
                  درجة الموظف
                </label>
                <p className="mt-2">{EmployeeData?.empDgree}</p>
              </div>

              <div className=" col-span-1 h-[50px] text-[#757575] ">
                <label className="font-bold text-lg" htmlFor="">
                  المنصب
                </label>
                <p className="mt-2">{EmployeeData?.position}</p>
              </div>
              {/*  */}
            </div>
            <Separator className="bg-[#757575] h-[2px] my-2" />
            {/*  */}
            <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
              <div className=" col-span-1 h-[50px] text-[#757575] ">
                <label className="font-bold text-lg" htmlFor="">
                  الراتب
                </label>
                <p className="mt-2">{EmployeeData?.salary}</p>
              </div>

              <div className=" col-span-1 h-[50px] text-[#757575] ">
                <label className="font-bold text-lg" htmlFor="">
                  تاريخ التوظيف الاول
                </label>
                <p className="mt-2">{String(EmployeeData?.firstEmployment).split('T')[0]}</p>
              </div>

              <div className=" col-span-1 h-[50px] text-[#757575] ">
                <label className="font-bold text-lg" htmlFor="">
                  تاريخ التوظيف
                </label>
                <p className="mt-2">{String(EmployeeData?.employmentDate).split('T')[0]}</p>
              </div>
              {/*  */}
            </div>
            <Separator className="bg-[#757575] h-[2px] my-2" />
            {/*  */}

            <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
              <div className=" col-span-1 h-[50px] text-[#757575] ">
                <label className="font-bold text-lg" htmlFor="">
                  الوحدة الحالية
                </label>
                <p className="mt-2">{EmployeeData?.currentUnit}</p>
              </div>

              <div className=" col-span-1 h-[50px] text-[#757575] ">
                <label className="font-bold text-lg" htmlFor="">
                  تاريخ التوظيف في الوحدة
                </label>
                <p className="mt-2">{String(EmployeeData?.currentEmploymentDate).split('T')[0]}</p>
              </div>

              <div className=" col-span-1 h-[50px] text-[#757575] ">
                <label className="font-bold text-lg" htmlFor="">
                  المركز القانوني
                </label>
                <p className="mt-2">{EmployeeData?.legalStatus}</p>
              </div>
              {/*  */}
            </div>
            <Separator className="bg-[#757575] h-[2px] my-2" />
            {/*  */}
            <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
              <div className=" col-span-1 h-[50px] text-[#757575] ">
                <label className="font-bold text-lg" htmlFor="">
                  حالة الموظف
                </label>
                <p className="mt-2">
                  {empStatus
                    .filter((x) => x.value === EmployeeData?.employeeStatus)
                    .map((x) => x.label)}
                </p>
              </div>

              <div className=" col-span-1 h-[50px] text-[#757575] ">
                <label className="font-bold text-lg" htmlFor="">
                  تاريخ التوظيف في الوحدة
                </label>
                <p className="mt-2">{String(EmployeeData?.detailsDate).split('T')[0]}</p>
              </div>

              {/*  */}
            </div>
            <Separator className="bg-[#757575] h-[2px] my-2" />
            <div className="mb-4 bg-[#dedef8] rounded-t-lg">
              <h3 className="font-bold text-[#3734a9] text-3xl p-3">المرفقات</h3>
            </div>

            <div className="grid h-[150px] grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth text-right">
              <div className="col-span-1 h-[40px]">
                <a onClick={openModal} className="cursor-pointer">
                  {isPDF ? <Pdf /> : <Png />}
                </a>
                {modalOpen && EmployeeData?.Attachment?.[0]?.file && (
                  <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
                    onClick={closeModal}
                  >
                    <div
                      className="relative w-[80%] h-[80%] bg-black bg-opacity-75 z-50 rounded-lg overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Close Button */}
                      <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-black font-bold py-1 px-3 rounded"
                      >
                        X
                      </button>

                      {isPDF ? (
                        <iframe
                          src={attachedUrlPrec!}
                          className="w-full h-full"
                          frameBorder="0"
                        ></iframe>
                      ) : (
                        <img
                          src={attachedUrlPrec!}
                          className="w-full h-full object-contain"
                          alt="Decision Screenshot"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
