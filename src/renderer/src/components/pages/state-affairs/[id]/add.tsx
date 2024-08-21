import { Button } from '../../../ui/button'
import { ArrowRight } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function AddIssus() {
  return (
    <div className=" flex items-center text-2xl">
      <Link to={'/state-affairs'}>
        <Button className="w-30 bg-transparent text-[#3734a9] hover:bg-[#3734a9] hover:text-white rounded-2xl border-2 border-[#3734a9]">
          <ArrowRight size={30} />
        </Button>
      </Link>
      <h1 className="mr-2"> إضافة قضية</h1>
    </div>
  )
}
