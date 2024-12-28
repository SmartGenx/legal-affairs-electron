import { useEffect, useState } from 'react'
import { useAuthHeader } from 'react-auth-kit'
import { Link, useParams } from 'react-router-dom'
import { axiosInstance } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import { AgencyInfo } from '@renderer/types'
import { ArrowRight } from 'lucide-react'

export type GovernmentOffice = {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

export default function ViewAgencyInfo() {
  const { id } = useParams<{ id: string }>()
  const authToken = useAuthHeader()
  const [dataGovernment, setGovernmentData] = useState<GovernmentOffice[]>([])

  const fetchGovernmentData = async () => {
    try {
      const response = await axiosInstance.get('/government-office', {
        headers: {
          Authorization: `${authToken()}`
        }
      })
      setGovernmentData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const fetchAgencyData = async () => {
    const response = await axiosInstance.get<AgencyInfo>(`/agency/${id}`, {
      headers: {
        Authorization: `${authToken()}`
      }
    })
    return response.data
  }
  const {
    data: AgencyData,
    error: _AgencyError,
    isLoading: _AgencyIsLoading
  } = useQuery({
    queryKey: ['Agency', id],
    queryFn: fetchAgencyData,
    enabled: !!id
  })

  useEffect(() => {
    fetchGovernmentData()
  }, [AgencyData])

  return (
    <>
    <div className=" flex items-center text-3xl">
        <Link to={'/Agency'}>
          <button className="w-12 flex justify-center items-center h-12 bg-transparent text-[#3734a9] hover:bg-[#3734a9] hover:text-white rounded-2xl border-2 border-[#3734a9] hover:border-2 hover:border-[#fff]">
            <ArrowRight size={20} />
          </button>
        </Link>
        <h1 className="mr-2 text-[#3734a9] font-bold">{AgencyData?.legalName}</h1>
      </div>
    <div className="min-h-[50vh] w-full mt-5">
      <div>
        <div className="mb-4 bg-[#dedef8] rounded-t-lg">
          <h3 className="font-bold text-[#3734a9] p-3">المعلومات</h3>
        </div>
        <div className="bg-[#dedef8] w-[95%] min-h-[40vh] m-auto rounded-2xl px-4 py-2">
          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className="text-[#757575] col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-lg">اسم القانوني</label>
              <p className="mt-2">{AgencyData?.legalName}</p>
            </div>

            <div className="text-[#757575] col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-lg">رقم الوثيقة المقدمه</label>
              <p className="mt-2">{AgencyData?.providedDocument}</p>
            </div>

            <div className="col-span-1 text-[#757575]">
              <label htmlFor="" className="font-bold text-lg">المرفق الحكومي</label>
              <p className="mt-2">
                {dataGovernment
                  .filter((x) => x.id === AgencyData?.governmentOfficeId)
                  .map((x) => x.name)}
              </p>
            </div>
            {/*  */}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
