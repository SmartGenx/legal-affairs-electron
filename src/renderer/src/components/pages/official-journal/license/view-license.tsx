import { useEffect } from 'react'
import { useAuthHeader } from 'react-auth-kit'
import { useParams } from 'react-router-dom'
import { getApi } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import { LoaderIcon } from 'lucide-react'
import { Separator } from '@radix-ui/react-dropdown-menu'

export type BookResp = {
  id: number
  name: string
  quantity: number
  price: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}
export interface licenseResp {
  id: number
  licenseTypeId: number
  customerId: number
  licenseNumber: string
  licenseYear: number
  compnayPorpose: string
  compnayLocation: string
  compnayCapital: number
  compnayManger: string
  referenceNum: string
  referenceDate: Date
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
  licenseType: LicenseType
  Customer: Customer
}
export interface LicenseType {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
  fees?: number
}
export interface Customer {
  id: number
  name: string
  type?: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
  fees?: number
}

export default function ViewLicense() {
  const { id } = useParams<{ id: string }>()
  const authToken = useAuthHeader()

  const {
    isPending,
    data: licenseByIdView,
    error
  } = useQuery({
    queryKey: ['licenseByIdView', id],
    queryFn: () =>
      getApi<licenseResp>(`/license/${id}`, {
        params:{
          "include[licenseType]":true,
          "include[Customer]":true,
        },
        headers: {
          Authorization: authToken()
        }
      })
  })
  console.log('licenseByIdView', licenseByIdView?.data)
  useEffect(() => {}, [licenseByIdView])

  if (isPending)
    return (
      <div className="flex justify-center items-center w-full ">
        <LoaderIcon className="mt-12 flex animate-spin items-center justify-end duration-1000" />
      </div>
    )
  if (error) return 'An error has occurred: ' + error.message

  return (
    <div className="min-h-[50vh] w-full mt-5">
      <div>
        <div className="mb-4 bg-[#dedef8] rounded-t-lg">
          <h3 className="font-bold text-[#3734a9] p-3">المعلومات</h3>
        </div>
        <div className="bg-[#dedef8] w-[95%] min-h-[80vh] m-auto rounded-2xl px-4 py-2">
          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className="text-[#757575] col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-lg">
                نوع الرخصة
              </label>
              <p className="mt-2">{licenseByIdView?.data.licenseType.name}</p>
            </div>

            <div className="text-[#757575] col-span-1 h-[50px] ">
              <label className="font-bold text-lg">اسم الشركة</label>
              <p className="mt-2">{licenseByIdView.data.Customer.name}</p>
            </div>

            <div className="text-[#757575] col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-lg">مركز الشركة</label>
              <p className="mt-2">{licenseByIdView.data.compnayLocation}</p>
            </div>
            {/*  */}
          </div>
          <Separator className="bg-[#757575] h-[2px] my-2" />
          {/* ------------------------- */}
          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className="text-[#757575] col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-lg">
              مسؤول الشركة
              </label>
              <p className="mt-2">{licenseByIdView?.data.compnayManger}</p>
            </div>

            <div className="text-[#757575] col-span-1 h-[50px] ">
              <label className="font-bold text-lg">رأس مال الشركة</label>
              <p className="mt-2">{licenseByIdView.data.compnayCapital}</p>
            </div>
            {/*  */}
          </div>
          <Separator className="bg-[#757575] h-[3px] my-2" />
          {/* ---------------------------------- */}
          <div className="grid min-h-[20vh]   grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
          <div className="text-[#757575] col-span-1 min-h-[50px] ">
              <label htmlFor="" className="font-bold text-lg">غرض الشركة ( أكتب الغرض من أنشاء الشركة )</label>
              <p className="mt-2">{licenseByIdView.data.compnayPorpose}</p>
            </div>
          </div>
          <Separator className="bg-[#757575] h-[2px] my-2" />
          {/* ------------------------------ */}
          <div className="mb-4 bg-[#dedef8] rounded-t-lg">
            <h3 className="font-bold text-[#3734a9] text-3xl p-3">معلومات الترخيص</h3>
          </div>
          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className="text-[#757575] col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-lg">
              رقم الترخيص
              </label>
              <p className="mt-2">{licenseByIdView?.data.licenseNumber}</p>
            </div>

            <div className="text-[#757575] col-span-1 h-[50px] ">
              <label className="font-bold text-lg">السنة</label>
              <p className="mt-2">{licenseByIdView.data.licenseYear}</p>
            </div>

            <div className="text-[#757575] col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-lg">رقم السند</label>
              <p className="mt-2">{licenseByIdView.data.referenceNum}</p>
            </div>
            {/*  */}
          </div>
          {/* -------------------- */}
          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className="text-[#757575] col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-lg">
              تاريخ التخرج
              </label>
              <p className="mt-2">{new Date(licenseByIdView?.data.referenceDate).toISOString().split("T")[0]}</p>
            </div>

            {/*  */}
          </div>
        </div>
      </div>
    </div>
  )
}
