import { Button } from '@renderer/components/ui/button'
import { SearchInput } from '@renderer/components/ui/search-input'
import { Search } from 'lucide-react'
import React from 'react'

export default function DecisionsSearch() {
  return (
    <div>
      <div className="!my-10 flex flex-col items-center justify-between sm:flex-row">
        <div className="w-full gap-4 ml-2">
          <div className=" w-full">
            <div className="w-full h-full relative">
              <SearchInput
                placeholder="البحث عن..."
                className="bg-white h-11  rounded-xl text-lg"
                InputClassName="!h-12"
              />
              <Search className="absolute right-2 top-3" color="#757575" />
            </div>
          </div>
        </div>
        <div>
          <Button className="flex items-center text-xl  w-28 mr-3 h-11 bg-[#3734a9] hover:bg-[#2e2b8b] hover:text-[#fff] rounded-[12px] px-4">
            <p className="text-xl">بحث</p>
            <Search className="text-md mr-2" size={22} />
          </Button>
        </div>
      </div>
    </div>
  )
}
