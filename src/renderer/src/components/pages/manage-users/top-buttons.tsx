
import { Button } from '@renderer/components/ui/button'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TopButtons() {
 
  return (
    <div className="flex justify-between">
      <div className="text-3xl text-[#3734a9]">جدول المستخدمين</div>
      <div className="sm:flex flex-col-reverse lg:block md:block ">
       
        <Link to={'/settings/add-user'}>
          <Button className="text-sm h-11  bg-[#3734a9] mr-2 border-2 border-[#3734a9] text-[#fff] hover:bg-[#fff] hover:text-[#3734a9] rounded-[12px] sm:w-28 sm:text-[10px] lg:w-44 lg:text-sm">
            <h1 className="text-[14px] font-black">إضافة مستخدم</h1>
            <Plus className="mr-2" size={28} />
          </Button>
        </Link>
      </div>
    </div>
  )
}
