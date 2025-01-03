import { Separator } from '@radix-ui/react-dropdown-menu'
import { axiosInstance, getApi } from '@renderer/lib/http'
import { Leave } from '@renderer/types'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'
import { useEffect } from 'react'
import { useAuthHeader } from 'react-auth-kit'
import { Link, useParams } from 'react-router-dom'

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
export default function ViewPageLeave() {
  const authToken = useAuthHeader()
  const { id } = useParams<{ id: string }>()

  const fetchDataById = async () => {
    const response = await axiosInstance.get<LeaveResp[]>(
      `/leave-details?include[employ]=true&id=${id}`,
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
  useEffect(() => {}, [BookData])

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

  return (
    <>
      <div className=" flex items-center text-3xl">
        <Link to={'/personnel-affairs'}>
          <button className="w-12 flex justify-center items-center h-12 bg-transparent text-[#3734a9] hover:bg-[#3734a9] hover:text-white rounded-2xl border-2 border-[#3734a9] hover:border-2 hover:border-[#fff]">
            <ArrowRight size={20} />
          </button>
        </Link>
        {BookData?.[0] && (
          <h1 className="mr-2 text-[#3734a9] font-bold">{BookData[0].employ.name}</h1>
        )}
      </div>
      <div className="min-h-[50vh] w-full mt-5">
        <div>
          <div className="mb-4 bg-[#dedef8] rounded-t-lg">
            <h3 className="font-bold text-[#3734a9] p-3">المعلومات</h3>
          </div>
          <div className="bg-[#dedef8] w-[95%] min-h-[50vh] m-auto rounded-2xl px-4 py-2">
            <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
              <div className="text-[#757575] col-span-1 h-[50px] ">
                <label htmlFor="" className="font-bold text-lg">
                  اسم الموظف
                </label>
                <p className="mt-2">
                  {BookData?.[0] && <h1 className="mr-2 text-[#757575]">{BookData[0].employ.name}</h1>}
                </p>
              </div>

              <div className="text-[#757575] col-span-1 h-[50px] ">
                <label className="font-bold text-lg">نوع الإجازه</label>
                <p className="mt-2">
                  {LeaveTypeData?.data.info.filter((x) => x.id === BookData?.[0]?.leaveTypeId)[0]
                    ?.name || ''}
                </p>
              </div>

              <div className="text-[#757575] col-span-1 h-[50px] ">
                <label htmlFor="" className="font-bold text-lg">
                  الايام
                </label>
                <p className="mt-2">{BookData?.[0]?.dayNumber}</p>
              </div>
              {/*  */}
            </div>
            <Separator className="bg-[#757575] h-[2px] my-2" />
            {/* ------------------------- */}
            <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
              <div className="text-[#757575] col-span-1 h-[50px] ">
                <label htmlFor="" className="font-bold text-lg">
                  بداية الإجازة
                </label>
                <p>{String(BookData?.[0]?.startDate).split('T')[0]}</p>
              </div>

              <div className="text-[#757575] col-span-1 h-[50px] ">
                <label className="font-bold text-lg">نهاية الإجازة</label>
                <p className="mt-2">
                  <p>{String(BookData?.[0]?.endDate).split('T')[0]}</p>
                </p>
              </div>
              {/*  */}
            </div>
            <Separator className="bg-[#757575] h-[3px] my-2" />
            {/* ---------------------------------- */}
            <div className="grid min-h-[20vh]   grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
              <div className="text-[#757575] col-span-1 min-h-[50px] ">
                <label htmlFor="" className="font-bold text-lg">
                  ملاحظات
                </label>
                <p className="mt-2">{BookData?.[0]?.leaveNote}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
