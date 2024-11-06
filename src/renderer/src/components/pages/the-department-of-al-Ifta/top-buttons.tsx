import DirectSend from '@renderer/components/icons/directSend'
import { Button } from '@renderer/components/ui/button'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

export default function TopButtons() {
  return (
    <div className="flex justify-between">
      <div className="text-3xl text-[#3734a9]">جدول الشكاوى</div>
      <div className="sm:flex flex-col-reverse lg:block md:block">
        <Button className="text-sm h-11  bg-[#fff] border-2 border-[#3734a9] text-[#3734a9] hover:bg-[#3734a9] hover:text-[#fff] rounded-[12px] sm:w-28 sm:text-[10px] lg:w-40 lg:text-sm">
          <h1 className="text-[13px] font-black">تصدير الكشف</h1>
          <DirectSend className="mr-2 " />
        </Button>
        <Link to={'/the-department-of-al-lfta/add-complaint'}>
          <Button className="text-sm h-11  bg-[#3734a9] mr-2 border-2 border-[#3734a9] text-[#fff] hover:bg-[#fff] hover:text-[#3734a9] rounded-[12px] sm:w-28 sm:text-[10px] lg:w-40 lg:text-sm">
            <h1 className="text-[13px] font-black">إضافة شكوى</h1>
            <Plus className="mr-2" size={28} />
          </Button>
        </Link>
      </div>
    </div>
  )
}
