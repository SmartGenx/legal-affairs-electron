import DirectSend from '@renderer/components/icons/directSend'
import { Button } from '@renderer/components/ui/button'
import { Plus } from 'lucide-react'
import React from 'react'

export default function TopButtons() {
  return (
    <div className="flex justify-between">
      <div className="text-3xl text-[#3734a9]">جدول قضايا الدولة</div>
      <div>
        <Button className="text-sm h-10 bg-[#fff] border-2 border-[#3734a9] text-[#3734a9] hover:bg-[#3734a9] hover:text-[#fff] rounded-[12px]">
          تصدير الكشف
          <DirectSend className="mr-2" />
        </Button>
        <Button className="text-sm mr-2 h-10 bg-[#3734a9] hover:border-2 hover:border-[#fff] hover:bg-[#2e2b8b] hover:text-[#fff] rounded-[12px]">
          إضافة قضية
          <Plus className="mr-2" />
        </Button>
      </div>
    </div>
  )
}
