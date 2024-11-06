import DirectSend from '@renderer/components/icons/directSend'
import { Button } from '@renderer/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { ChevronDown, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TopButtons() {
  return (
    <div className="flex justify-between">
      <div className="text-3xl text-[#3734a9]">كشف الموظفين</div>
      <div className="sm:flex flex-col-reverse lg:block md:block">
        <Button className="text-sm h-10  bg-[#fff] border-2 border-[#3734a9] text-[#3734a9] hover:bg-[#3734a9] hover:text-[#fff] rounded-[12px] sm:w-28 sm:text-[10px] lg:w-40 lg:text-sm">
          تصدير الكشف
          <DirectSend className="mr-2" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="text-sm h-10  bg-[#3734a9] border-2  border-[#fff] text-[#fff] hover:bg-[#fff]  hover:text-[#3734a9] lg:translate-y-0 sm:translate-y-0 lg:mr-2 sm:mr-0 rounded-[12px] sm:w-28 sm:text-[10px] lg:w-40 lg:text-sm">
              <span className="text-nowrap px-2">إضافة موظف</span>
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[180px]">
            <DropdownMenuGroup>
              <DropdownMenuItem className=" flex gap-2">
                {/* <PersonAddIcon /> */}
                <Link to="/personnel-affairs/add-employee">إضافة موظف</Link>
              </DropdownMenuItem>

              <DropdownMenuItem className=" flex gap-2">
                {/* <AccountBalanceIcon /> */}
                <Link to="/personnel-affairs/add-leave">إدارة الأجازات</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
