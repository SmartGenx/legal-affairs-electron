import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <div className=" flex items-center text-3xl">
      <Link to={'/personnel-affairs'}>
        <button className="w-12 flex justify-center items-center h-12 bg-transparent text-[#3734a9] hover:bg-[#3734a9] hover:text-white rounded-2xl border-2 border-[#3734a9] hover:border-2 hover:border-[#fff]">
          <ArrowRight size={20} />
        </button>
      </Link>
      <h1 className="mr-2 text-[#3734a9] font-bold">إضافة موظف</h1>
    </div>
  )
}
