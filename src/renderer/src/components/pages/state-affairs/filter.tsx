import React, { useEffect, useState } from 'react'
import { Button } from '../../ui/button' // Replace with your actual button component
import { Calendar } from '../../ui/calendar' // Replace with your actual calendar component
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '../../ui/drawer' 
import { Filter, X } from 'lucide-react'
import { Separator } from '@radix-ui/react-separator'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FormInput } from '@renderer/components/ui/form-input'

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
const FilterDrawer = () => {
  
  const kindOfCase = [
    { label: 'جنائية', value: 1 },
    { label: 'مدنية', value: 2 },
    { label: 'تجارية', value: 3 },
    { label: 'إدارية', value: 4 }
  ] as const
  const DegreeOfLitigationOptions = [
    { label: 'إستئناف', value: 1 },
    { label: 'ابتدائي', value: 2 },
    { label: 'عليا', value: 3 }
  ] as const
  // const [selectedValue, setSelectedValue] = useState<number | undefined>(undefined)
  const [selected, setSelected] = useState('')
  console.log('🚀 ~ FilterDrawer ~ selected:', selected)

  const handleSelect = (value) => {
    setSelected(value)
  }
  const [dateFrom, setDateFrom] = React.useState<Date | undefined>()
  const [dateTo, setDateTo] = React.useState<Date | undefined>()

  const [clanFrom, setClanFrom] = React.useState<boolean>(false)
  const [clanTo, setClanTo] = React.useState<boolean>(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  // const authToken = useAuthHeader()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedGovernorates, setSelectedGovernorates] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedGender, setSelectedGender] = useState<string>('')
  // const {
  //   isPending: isdirectoratePending,
  //   error: directorateError,
  //   data: governorateData
  // } = useQuery({
  //   queryKey: ['directorate'],
  //   queryFn: () =>
  //     getApi<Directorate[]>('/directorate', {
  //       headers: {
  //         Authorization: authToken()
  //       }
  //     })
  // })

  // const {
  //   isPending: isCategoryPending,
  //   error: categoryError,
  //   data: categoryData
  // } = useQuery({
  //   queryKey: ['category'],
  //   queryFn: () =>
  //     getApi<Category[]>('/category', {
  //       headers: {
  //         Authorization: authToken()
  //       }
  //     })
  // })

  useEffect(() => {
    const governorates = searchParams.getAll('directorateGlobalId')
    const categories = searchParams.getAll('categoryGlobalId')
    const gender = searchParams.get('gender') || ''

    setSelectedGovernorates(governorates)
    setSelectedCategories(categories)

    setSelectedGender(gender)
  }, [searchParams])

  const handleGovernorateChange = (globalId: string) => {
    setSelectedGovernorates((prev) =>
      prev.includes(globalId) ? prev.filter((id) => id !== globalId) : [...prev, globalId]
    )
  }

  const handleCategoryChange = (globalId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(globalId) ? prev.filter((id) => id !== globalId) : [...prev, globalId]
    )
  }

  // const handleGenderChange = (gender: string) => {
  //   setSelectedGender(gender)
  // }
  const handleClearFilters = () => {
    navigate('/applicants', { replace: true })
  }
  const handleFilter = () => {
    const params = new URLSearchParams()

    selectedGovernorates.forEach((id) => params.append('directorateGlobalId', id))
    selectedCategories.forEach((id) => params.append('categoryGlobalId', id))

    if (dateFrom) {
      params.set('submissionDate[gte]', dateFrom?.toISOString())
    }
    if (dateTo) {
      params.set('submissionDate[lte]', dateTo?.toISOString())
    }

    if (selectedGender) {
      params.set('gender', selectedGender)
    }
    setIsOpen(false)
    navigate(`/applicants?${params.toString()}`, { replace: true })
  }
  // if (isdirectoratePending || isCategoryPending) return 'Loading...'
  // if (directorateError || categoryError)
  //   return 'An error has occurred: ' + (directorateError?.message || categoryError?.message)

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction="left">
      <DrawerTrigger asChild>
        <Button className="flex items-center text-xl  w-28 mr-3 h-11 bg-[#fff] text-[#3734a9] border-2 border-[#3734a9] hover:bg-[#2e2b8b] hover:text-[#fff] rounded-[12px] px-4">
          <p className="text-xl">الفترة</p>
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
            <h3 className="text-base font-semibold text-[#383838] mb-2">نوع القضية</h3>
            <div className="grid grid-cols-3 gap-4">
              {kindOfCase?.map((governorate) => (
                <div key={governorate.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={governorate.value}
                    checked={selectedGovernorates.includes(String(governorate.value))}
                    onChange={() => handleGovernorateChange(String(governorate.value))}
                    className="ml-2 accent-[#3734A9]"
                  />
                  <label
                    className="text-sm truncate text-[#595959] font-semibold"
                    dir="rtl"
                    style={{ maxWidth: '120px' }}
                    title={governorate.label}
                  >
                    {governorate.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full h-[1px] bg-[#F0F1F5]"></div>
          <div className="mb-6 mt-4">
            <h3 className="text-base font-semibold text-[#383838] mb-2">درجة التقاضي</h3>
            <div className="grid grid-cols-3 gap-4">
              {DegreeOfLitigationOptions?.map((category) => (
                <div key={category.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={category.value}
                    checked={selectedCategories.includes(String(category.value))}
                    onChange={() => handleCategoryChange(String(category.value))}
                    className="ml-2 accent-[#3734A9]"
                  />
                  <label
                    className="text-sm truncate text-[#595959] font-semibold"
                    dir="rtl"
                    style={{ maxWidth: '120px' }}
                    title={category.label}
                  >
                    {category.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <h3 className="text-base font-semibold text-[#383838] mb-2 mt-4">البحث بـ</h3>
          <div className="flex items-center space-x-8 rtl space-x-reverse">
            {/* First Checkbox */}
            <div className="flex items-center space-x-2 rtl space-x-reverse">
              <input
                type="radio"
                id="name"
                name="options"
                className="hidden"
                onChange={() => handleSelect('name')}
                checked={selected === 'name'}
              />
              <div
                onClick={() => handleSelect('name')}
                className={`w-4 h-4 rounded-full border-[2px] ${
                  selected === 'name' ? 'border-[#3734A9] ' : 'border-gray-400 bg-white'
                } flex items-center justify-center cursor-pointer`}
              >
                {selected === 'name' && <div className="w-2 h-2 rounded-full bg-[#3734A9]"></div>}
              </div>
              <label htmlFor="name" className="text-gray-600 cursor-pointer">
                الاسم
              </label>
            </div>

            {/* Second Checkbox */}
            <div className="flex items-center space-x-2 rtl space-x-reverse">
              <input
                type="radio"
                id="number"
                name="options"
                className="hidden "
                onChange={() => handleSelect('number')}
                checked={selected === 'number'}
              />
              <div
                onClick={() => handleSelect('number')}
                className={`w-4 h-4 rounded-full border-[2px] ${
                  selected === 'number' ? 'border-[#3734A9] ' : 'border-gray-400 bg-white'
                } flex items-center justify-center cursor-pointer`}
              >
                {selected === 'number' && <div className="w-2 h-2 rounded-full bg-[#3734A9]"></div>}
              </div>
              <label htmlFor="number" className="text-gray-600 cursor-pointer">
                رقم الحكم
              </label>
            </div>
          </div>

          <div>
            {selected === 'number' ? (
              <>
                <FormInput
                  label="رقم الحكم"
                  placeholder="ادخل رقم الحكم"
                  type="text"
                  className="w-full mt-3 h-11 rounded-xl border-[3px] border-[#E5E7EB] -translate-y-0 px-2"
                />
              </>
            ) : (
              <>
                <FormInput
                  label="الاسم"
                  placeholder="ادخل الاسم"
                  type="text"
                  className="w-full h-11 mt-3 rounded-xl border-[3px] border-[#E5E7EB] -translate-y-0 px-2"
                />
              </>
            )}
          </div>
          <div className="w-full h-[1px] bg-[#F0F1F5]"></div>
          <div className="mb-6 mt-5">
            <h3 className="text-base font-semibold text-[#383838] mb-2">الفترة</h3>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <Button
                className=" border-[3px] w-30 bg-white h-10 border-[#E5E7EB] rounded-xl hover:#757575 hover:text-white text-[#757575] "
                onClick={() => setClanFrom(!clanFrom)}
              >
                الفترة من
              </Button>
              <Button
                className=" border-[3px] w-30 bg-white h-10 border-[#E5E7EB] rounded-xl hover:#757575 hover:text-white text-[#757575]"
                onClick={() => setClanTo(!clanTo)}
              >
                الفترة الى
              </Button>
            </div>
            {clanFrom ? (
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={setDateFrom}
                className="rounded-md border "
              />
            ) : null}
            {clanTo ? (
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={setDateTo}
                className="rounded-md border "
              />
            ) : null}
          </div>
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
