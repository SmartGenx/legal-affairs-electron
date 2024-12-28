import { Button } from '@renderer/components/ui/button'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TopButtons() {
  return (
    <div className="flex justify-between w-full ">
      <div className="text-3xl text-[#3734a9] w-[85%]">جدول المستخدمين</div>
      <div className="sm:flex flex-col-reverse lg:block md:block w-[15%] ">
        <Link to={'/decisions/add-Decision'}>
          <Button className="text-sm h-11  bg-[#3734a9] md:w-full  mr-2 border-2 border-[#3734a9] text-[#fff] hover:bg-[#fff] hover:text-[#3734a9] rounded-[12px] sm:w-28 sm:text-[10px] lg:w-full lg:text-sm">
            <h1 className="text-[13px] font-black">إضافة مستخدم</h1>
            <Plus className="mr-1" size={28} />
          </Button>
        </Link>
      </div>
    </div>
  )
}
