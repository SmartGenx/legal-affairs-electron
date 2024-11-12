import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuthHeader } from 'react-auth-kit'
import { axiosInstance } from '@renderer/lib/http'
import {  useQuery } from '@tanstack/react-query'
import { Separator } from '@renderer/components/ui/separator'

export type Complain = {
  id: number
  decisionName: string
  refrance: string
  governmentOfficeId: number
  title: string
  description: string
  decisionSource: string
  nameSource: string
  isDeleted: boolean
  attachmentPath: string
  createdAt: Date
  updatedAt: Date
  decisionDate: Date
}


export type GovernmentOffice = {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

export default function DecisionInfo() {
  const { id } = useParams<{ id: string }>()
  const authToken = useAuthHeader()
  const [data, setData] = useState<GovernmentOffice[]>([])
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('/government-office', {
        headers: {
          Authorization: `${authToken()}`
        }
      })
      setData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const fetchDecisionData = async () => {
    const response = await axiosInstance.get<Complain>(`/decision/${id}`, {
      headers: {
        Authorization: `${authToken()}`
      }
    })
    return response.data
  }
  const {
    data: DecisionData,
    error: _DecisionError,
    isLoading: _DecisionIsLoading
  } = useQuery({
    queryKey: ['Decisions', id],
    queryFn: fetchDecisionData,
    enabled: !!id
  })

  useEffect(() => {
    fetchData()
  }, [DecisionData])

  return (
    <div className="min-h-[50vh] w-full mt-5">
      <div>
        <div className="mb-4 bg-[#dedef8] rounded-t-lg">
          <h3 className="font-bold text-[#3734a9] p-3">المعلومات</h3>
        </div>
        <div className="bg-[#3734A9]/[.1] w-[90%] min-h-[50vh] m-auto rounded-md px-4 py-2">
          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <label>رقم القرار</label>
              <p>{DecisionData?.refrance}</p>
            </div>
            {/*  */}

            <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
              <div className=" col-span-1 h-[50px] ">
                <label htmlFor="">تاريخة</label>
                <p>{String(DecisionData?.decisionDate).split('T')[0]}</p>
              </div>
            </div>
            <div className="col-span-1 translate-y-2">
              <label>مصدر التوجيه</label>
              <p>
                {data.filter((x) => x.id === DecisionData?.governmentOfficeId).map((x) => x.name)}
              </p>
            </div>
          </div>
          <Separator className="bg-[#757575]" />
          <div className="grid h-[80px] mt-5  grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="">موضوع الشكوى</label>
              <p>{DecisionData?.title}</p>
            </div>
            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="">اسم القرار</label>
              <p>{DecisionData?.decisionName}</p>
            </div>

            <div className=" col-span-1 h-[40px] ">
              <label htmlFor="">عنوان القرار</label>
              <p>{DecisionData?.title}</p>
            </div>
          </div>

          <Separator className="bg-[#757575]" />
          <div className="grid h-[80px] mt-5  grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="">نص القرار</label>
              <p>{String(DecisionData?.description).split('T')[0]}</p>
            </div>
          </div>

          <div className="grid h-[150px]  grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[40px] ">
              <label htmlFor="">إسم صاحب القرار</label>
              <p>{DecisionData?.nameSource}</p>
            </div>
            <div className=" col-span-1 h-[40px] ">
              <label htmlFor="">جهة القرار</label>
              <p>{DecisionData?.decisionSource}</p>
            </div>
          </div>

          <div className="mb-4 bg-[#dedef8] rounded-t-lg">
            <h3 className="font-bold text-[#3734a9] p-3">المرفقات</h3>
          </div>

          <div className="grid h-[150px]  grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[40px] bg-black">
              <img src={DecisionData?.attachmentPath} alt="" />
            </div>
          </div>
          {/*  */}
        </div>
      </div>
    </div>
  )
}
