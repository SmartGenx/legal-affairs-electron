import { Separator } from "@radix-ui/react-select"
import Pdf from "@renderer/components/icons/pdf"
import Png from "@renderer/components/icons/png"
import { Button } from "@renderer/components/ui/button"
import { getApi } from "@renderer/lib/http"
import { useQuery } from "@tanstack/react-query"
import { ArrowRight } from "lucide-react"
import { useState } from "react"
import { useAuthHeader } from "react-auth-kit"
import { Link, useParams } from "react-router-dom"
export interface Users {
    info: InfoUsers[]
    total: number
    page: string
    pageSize: string
  }
  
  export interface InfoUsers {
    id: number
    name: string
    email: string
    phone: string
    image: string
    roles: RoleElement[]
  }
  
  export interface RoleElement {
    id: number
    userId: number
    roleId: number
    createdAt: Date
    updatedAt: Date
    role: RoleRole
  }
  
  export interface RoleRole {
    id: number
    name: string
    createdAt: Date
    updatedAt: Date
  }
export default function ViewUser() {
    const [modalOpen, setModalOpen] = useState(false)
  const { id } = useParams<{ id: string }>()
  const authToken = useAuthHeader()
  const { data: UserById } = useQuery({
    queryKey: ['UserByIdInfo', id],
    queryFn: () =>
      getApi<Users>(`/user?pageSize=3000&page=1&include[UserRole][include]=role&id[equals]=${id}`, {
        headers: {
          Authorization: authToken()
        }
      })
  })
  const openModal = () => {
    if (UserById?.data.info[0].image) {
      setModalOpen(true)
    }
  }

  const closeModal = () => {
    setModalOpen(false)
  }
  const attachedUrlPrec = UserById?.data.info[0].image ?? 'لايوجد'
  const isPDF = attachedUrlPrec?.toLowerCase().endsWith('.pdf')
  return <>
  <div className="flex items-center text-3xl">
    <Link to={'/settings'}>
      <Button className="w-16 h-12 bg-transparent text-[#3734a9] hover:bg-[#3734a9] hover:text-white rounded-2xl border-2 border-[#3734a9] hover:border-2 hover:border-[#fff]">
        <ArrowRight size={20} />
      </Button>
    </Link>
    <h1 className="mr-2 text-[#3734a9] font-bold">{UserById?.data.info[0].name}</h1>
  </div>

  <div className="min-h-[50vh] w-full mt-5">
    <div>
      <div className="mb-4 bg-[#dedef8] rounded-t-lg">
        <h3 className="font-bold text-[#3734a9] p-3">المعلومات</h3>
      </div>
      <div className="bg-[#dedef8] w-[95%] min-h-[40vh] m-auto rounded-2xl px-4 py-2">
        <div className="grid h-[80px]  min-h-[100px] grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
          <div className="text-[#757575] col-span-1 min-h-[50px] ">
            <label className="font-bold text-lg ">البريد الاكتروني</label>
            <p className="mt-2">{UserById?.data.info[0].email}</p>
          </div>
          {/*  */}

          <div className="grid min-h-[80px]   grid-cols-3 items-start gap-4 w-full  overflow-y-scroll scroll-smooth  text-right">
            <div className="text-[#757575] col-span-1 min-h-[60px] w-40">
              <label htmlFor="" className="font-bold text-lg ">
              اسم المتسخدم
              </label>
              <p className="mt-2">{UserById?.data.info[0].name}</p>
            </div>
          </div>
          
        </div>
        <Separator className="bg-[#757575] h-1" />
        <div className="grid h-[80px] mt-5  grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
          <div className="text-[#757575] col-span-1 h-[50px] ">
            <label htmlFor="" className="font-bold text-lg">
            رقم الهاتف
            </label>
            <p className="mt-2">{UserById?.data.info[0].phone}</p>
          </div>
          <div className="text-[#757575] col-span-1 h-[50px] ">
            <label htmlFor="" className="font-bold text-lg">
              الدور
            </label>
            <p className="mt-2">{UserById?.data.info[0].roles[0].role.name}</p>
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
                    
                    <button
                      onClick={closeModal}
                      className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-black font-bold py-1 px-3 rounded"
                    >
                      X
                    </button>

                    
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
                   
                    <button
                      onClick={closeModal}
                      className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-black font-bold py-1 px-3 rounded"
                    >
                      X
                    </button>

                    
                    <img
                      src={UserById?.data.info[0].image}
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
}
