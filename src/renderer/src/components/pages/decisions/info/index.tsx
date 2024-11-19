import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuthHeader } from 'react-auth-kit'
import { axiosInstance } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import { Separator } from '@renderer/components/ui/separator'
import { Button } from '@renderer/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Png from '@renderer/components/icons/png'
import Pdf from '@renderer/components/icons/pdf'

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
  const [modalOpen, setModalOpen] = useState(false)
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

  
  const openModal = () => {
    if (DecisionData?.attachmentPath) {
      setModalOpen(true)
    }
  }

  const closeModal = () => {
    setModalOpen(false)
  }
  const attachedUrlPrec = DecisionData?.attachmentPath ?? 'لايوجد'
  const isPDF = attachedUrlPrec?.toLowerCase().endsWith('.pdf')
  console.log('DecisionData?.attachmentPath', DecisionData?.attachmentPath)

  return (
    <>
      <div className="flex items-center text-3xl">
        <Link to={'/decisions'}>
          <Button className="w-16 h-12 bg-transparent text-[#3734a9] hover:bg-[#3734a9] hover:text-white rounded-2xl border-2 border-[#3734a9] hover:border-2 hover:border-[#fff]">
            <ArrowRight size={20} />
          </Button>
        </Link>
        <h1 className="mr-2 text-[#3734a9] font-bold">{DecisionData?.refrance}</h1>
      </div>

      <div className="min-h-[50vh] w-full mt-5">
        <div>
          <div className="mb-4 bg-[#dedef8] rounded-t-lg">
            <h3 className="font-bold text-[#3734a9] p-3">المعلومات</h3>
          </div>
          <div className="bg-[#dedef8] w-[95%] min-h-[100vh] m-auto rounded-2xl px-4 py-2">
            <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
              <div className="text-[#757575] col-span-1 h-[50px] ">
                <label className="font-bold text-lg">رقم القرار</label>
                <p className="mt-2">{DecisionData?.refrance}</p>
              </div>
              {/*  */}

              <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
                <div className="text-[#757575] col-span-1 h-[50px] ">
                  <label htmlFor="" className="font-bold text-lg">
                    تاريخة
                  </label>
                  <p className="mt-2">{String(DecisionData?.decisionDate).split('T')[0]}</p>
                </div>
              </div>
              <div className="text-[#757575] col-span-1 translate-y-2">
                <label className="font-bold text-lg">مصدر التوجيه</label>
                <p className="mt-2">
                  {data.filter((x) => x.id === DecisionData?.governmentOfficeId).map((x) => x.name)}
                </p>
              </div>
            </div>
            <Separator className="bg-[#757575]" />
            <div className="grid h-[80px] mt-5  grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
              <div className="text-[#757575] col-span-1 h-[50px] ">
                <label htmlFor="" className="font-bold text-lg">
                  موضوع الشكوى
                </label>
                <p className="mt-2">{DecisionData?.title}</p>
              </div>
              <div className="text-[#757575] col-span-1 h-[50px] ">
                <label htmlFor="" className="font-bold text-lg">
                  اسم القرار
                </label>
                <p className="mt-2">{DecisionData?.decisionName}</p>
              </div>

              <div className="text-[#757575] col-span-1 h-[40px] ">
                <label htmlFor="" className="font-bold text-lg">
                  عنوان القرار
                </label>
                <p className="mt-2">{DecisionData?.title}</p>
              </div>
            </div>

            <Separator className="bg-[#757575]" />
            <div className="grid h-[80px] mt-5  grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
              <div className="text-[#757575] col-span-1 h-[50px] ">
                <label htmlFor="" className="font-bold text-lg">
                  نص القرار
                </label>
                <p className="mt-2">{String(DecisionData?.description).split('T')[0]}</p>
              </div>
            </div>

            <div className="grid h-[150px]  grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
              <div className="text-[#757575] col-span-1 h-[40px] ">
                <label htmlFor="" className="font-bold text-lg">
                  إسم صاحب القرار
                </label>
                <p className="mt-2">{DecisionData?.nameSource}</p>
              </div>
              <div className="text-[#757575] col-span-1 h-[40px] ">
                <label htmlFor="" className="font-bold text-lg">
                  جهة القرار
                </label>
                <p className="mt-2">{DecisionData?.decisionSource}</p>
              </div>
            </div>

            <div className="mb-4 bg-[#dedef8] rounded-t-lg">
              <h3 className="font-bold text-3xl text-[#3734a9] p-3">المرفقات</h3>
            </div>

            <div className="grid h-[150px]  grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
              <div className=" col-span-1 h-[40px] ">
                <a onClick={openModal} className="cursor-pointer">
                  {isPDF ? <Pdf /> : <Png />}
                </a>
                {modalOpen && (
                  <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
                    onClick={closeModal}
                  >
                    {isPDF ? (
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

                        {/* Image Content */}
                        <iframe
                          src={attachedUrlPrec!}
                          className="w-full h-full"
                          frameBorder="0"
                        ></iframe>
                      </div>
                    ) : (
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

                        {/* Image Content */}
                        <img
                          src={DecisionData?.attachmentPath}
                          className="w-full h-full object-contain"
                          alt="Decision Screenshot"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/*  */}
          </div>
        </div>
      </div>
    </>
  )
}
