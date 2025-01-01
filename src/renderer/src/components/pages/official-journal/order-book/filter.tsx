import { Separator } from '@radix-ui/react-separator'
import { Filter, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../../../ui/button' // Replace with your actual button component
import { Calendar } from '../../../ui/calendar' // Replace with your actual calendar component
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '../../../ui/drawer'

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
  const [dateFrom, setDateFrom] = React.useState<Date | undefined>()
  const [dateTo, setDateTo] = React.useState<Date | undefined>()

  const [clanFrom, setClanFrom] = React.useState<boolean>(false)
  const [clanTo, setClanTo] = React.useState<boolean>(false)
  // const [searchParams] = useSearchParams()
  const [searchParams, _setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [selected, setSelected] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const handleSelect = (value) => {
    setSelected(value)
  }
  const [reference, setReference] = useState('')
  const [lic, setLic] = useState('')

  useEffect(() => {
    const reference = searchParams.get('refrance[equals]') || ''
    const orderNumber = searchParams.get('orderNumber') || ''

    setReference(reference)
    setLic(orderNumber)
  }, [searchParams])

  // const handleGenderChange = (gender: string) => {
  //   setSelectedGender(gender)
  // }
  const handleClearFilters = () => {
    navigate('/official-journal', { replace: true })
  }
  const handleFilter = () => {
    const params = new URLSearchParams()

    if (dateFrom) {
      params.set('createdAt[gte]', dateFrom?.toISOString())
    }

    if (dateTo) {
      params.set('createdAt[lte]', dateTo?.toISOString())
    }
    if (reference) {
      params.set('reference[equals]', reference)
    }
    if (lic) {
      params.set('orderNumber', lic)
    }

    setIsOpen(false)
    navigate(`/official-journal?${params.toString()}`, { replace: true })
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
          <h3 className="text-base font-semibold text-[#383838] mb-2 mt-4">البحث بـ</h3>
          <div className="flex items-center space-x-8 rtl space-x-reverse">
            {/* Second Checkbox */}
            <div className="flex items-center space-x-2 rtl space-x-reverse">
              <input
                type="radio"
                id="number"
                name="options"
                className="hidden "
                onChange={() => handleSelect('number')}
                // checked={selected === 'number'}
                checked
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
                رقم الصرف
              </label>
            </div>

            <div className="flex items-center space-x-2 rtl space-x-reverse">
              <input
                type="radio"
                id="lic"
                name="options"
                className="hidden "
                onChange={() => handleSelect('lic')}
                // checked={selected === 'lic'}
                checked
              />
              <div
                onClick={() => handleSelect('lic')}
                className={`w-4 h-4 rounded-full border-[2px] ${
                  selected === 'lic' ? 'border-[#3734A9] ' : 'border-gray-400 bg-white'
                } flex items-center justify-center cursor-pointer`}
              >
                {selected === 'lic' && <div className="w-2 h-2 rounded-full bg-[#3734A9]"></div>}
              </div>
              <label htmlFor="lic" className="text-gray-600 cursor-pointer">
                رقم السند
              </label>
            </div>
          </div>

          <div>
            {selected === 'number' ? (
              <>
                <input
                  placeholder="ادخل رقم الصرف"
                  type="text"
                  className="w-full h-11 mt-3 rounded-xl border-[3px] border-[#E5E7EB] -translate-y-0 px-2"
                  onChange={(e) => setReference(e.target.value)}
                  value={reference}
                />
              </>
            ) : (
              <>
                <input
                  placeholder="ادخل رقم السند"
                  type="text"
                  className="w-full h-11 mt-3 rounded-xl border-[3px] border-[#E5E7EB] -translate-y-0 px-2"
                  onChange={(e) => setLic(e.target.value)}
                  value={lic}
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
