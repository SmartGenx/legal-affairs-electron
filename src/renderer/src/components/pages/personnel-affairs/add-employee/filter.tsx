import { Separator } from '@radix-ui/react-separator'
import { Filter, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../../../ui/button' // Replace with your actual button component
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '../../../ui/drawer'
import { useAuthHeader } from 'react-auth-kit'
import { useQuery } from '@tanstack/react-query'
import { getApi } from '@renderer/lib/http'

export interface Directorate {
  id: number
  globalId: string
  governorateGlobalId?: string
  name: string
  deleted: boolean
  version: number
  lastModified: Date
  Governorate?: Directorate
}
export interface Category {
  id: number
  globalId: string
  name: string
  SupportRatio: number
  deleted: boolean
  description: string
  version: number
  lastModified: Date
}

export interface EmpRes {
  id: number
  name: string
  reference: string
  phone: string
  address: string
  dob: Date
  education: string
  megor: string
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
  currentUnit: string
  currentEmploymentDate: Date
  legalStatus: string
  employeeStatus: number
  detailsDate: Date
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

const FilterDrawer = () => {
  
  // const [selectedValue, setSelectedValue] = useState<number | undefined>(undefined)
  const [selected, _setSelected] = useState('')
  console.log('🚀 ~ FilterDrawer ~ selected:', selected)
  const authToken = useAuthHeader()
  

  const { data: empData } = useQuery({
    queryKey: ['employ'],
    queryFn: () =>
      getApi<EmpRes[]>('/employ', {
        headers: {
          Authorization: authToken()
        }
      })
  })

  console.log('empData,empData', empData?.data)
  const [dateFrom, _setDateFrom] = React.useState<Date | undefined>()
  const [dateTo, _setDateTo] = React.useState<Date | undefined>()

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  // const authToken = useAuthHeader()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<string[]>([])
  const [selectedLevel, setSelectedLevel] = useState<string[]>([])
  const [selectedGender, setSelectedGender] = useState<string>('')

  const [reference, setReference] = useState('')
  console.log('🚀 ~ FilterDrawer ~ reference:', reference)

  useEffect(() => {
    const type = searchParams.getAll('type')
    const level = searchParams.getAll('IssueDetails[some][level]')
    const gender = searchParams.get('gender') || ''
    const reference = searchParams.get('IssueDetails[some][reference]') || ''

    setSelectedType(type)
    setSelectedLevel(level)
    setReference(reference)
    setSelectedGender(gender)
  }, [searchParams])

  const handleGovernorateChange = (globalId: string) => {
    setSelectedType((prev) =>
      prev.includes(globalId) ? prev.filter((id) => id !== globalId) : [...prev, globalId]
    )
  }

  

  // const handleGenderChange = (gender: string) => {
  //   setSelectedGender(gender)
  // }
  const handleClearFilters = () => {
    navigate('/personnel-affairs', { replace: true })
  }
  const handleFilter = () => {
    const params = new URLSearchParams()

    selectedType.forEach((id) => params.append('education[contains]', id))
    selectedLevel.forEach((id) => params.append('IssueDetails[some][level]', id))

    if (dateFrom) {
      params.set('createdAt[gte]', dateFrom?.toISOString())
    }

    if (dateTo) {
      params.set('createdAt[lte]', dateTo?.toISOString())
    }
    if (reference) {
      params.set('phone[equals]', reference)
    }
    if (selectedGender) {
      params.set('gender', selectedGender)
    }
    setIsOpen(false)
    navigate(`/personnel-affairs?${params.toString()}`, { replace: true })
  }
  // if (isdirectoratePending || isCategoryPending) return 'Loading...'
  // if (directorateError || categoryError)
  //   return 'An error has occurred: ' + (directorateError?.message || categoryError?.message)

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction="left">
      <DrawerTrigger asChild>
        <Button className="flex items-center text-xl  w-28 mr-3 h-11 bg-[#fff] text-[#3734a9] border-2 border-[#3734a9] hover:bg-[#2e2b8b] hover:text-[#fff] rounded-[12px] px-4">
          <p className="text-xl">فلترة</p>
          <Filter className="text-md mr-2" />
          {/* <Search className="text-md mr-2" size={22} /> */}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-fit max-w-sm bg-white">
        <DrawerHeader className="flex justify-between p-4">
          <DrawerTitle className="text-lg font-bold">فلترة</DrawerTitle>
          <DrawerClose>
            <X className="w-5 h-5 text-gray-600" />
          </DrawerClose>
        </DrawerHeader>
        <Separator />

        <div className="w-full bg-[#C6C9CA] h-[2px] -translate-y-2"></div>
        <div className="p-6 overflow-y-auto">
          {/* Governorates Filter */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-[#383838] mb-2">المؤهل التعليمي</h3>
            <div className="grid grid-cols-3 gap-4">
              {empData?.data?.map((governorate) => (
                <div key={governorate.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={governorate.id}
                    checked={selectedType.includes(String(governorate.education))}
                    onChange={() => handleGovernorateChange(String(governorate.education))}
                    className="ml-2 accent-[#3734A9]"
                  />
                  <label
                    className="text-sm truncate text-[#595959] font-semibold"
                    dir="rtl"
                    style={{ maxWidth: '120px' }}
                    title={governorate.education}
                  >
                    {governorate.education}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <h3 className="text-base font-semibold text-[#383838] mb-2 mt-4">البحث برقم الموظف</h3>
          <input
            placeholder="ادخل رقم الموظف"
            type="text"
            className="w-full h-11 mt-3 rounded-xl border-[3px] border-[#E5E7EB] -translate-y-0 px-2"
            onChange={(e) => setReference(e.target.value)}
            value={reference}
          />
        </div>

        <DrawerFooter className="flex justify-between p-4">
          <div className="flex justify-between gap-2">
            {/* 'إلغاء' button wrapped with DrawerClose */}
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="bg-[#fff] text-[#3734a9] h-7 hover:bg-[#2e2b8b] border-2 border-[#2e2b8b] hover:text-[#fff] rounded-[12px] px-0"
              >
                إلغاء
              </Button>
            </DrawerClose>
            {/* 'إعادة تعيين' button to clear filters */}
            <Button
              variant="outline"
              className="h-7 px-0 border-2 text-[#2e2b8b] border-transparent"
              onClick={handleClearFilters}
            >
              إعادة تعيين
            </Button>
            {/* 'فلتر' button */}
            <Button
              className="bg-[#3734a9] h-7 hover:bg-[#2e2b8b] hover:text-[#fff] rounded-[12px] px-0"
              onClick={handleFilter}
            >
              فلتر
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default FilterDrawer
