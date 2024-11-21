import { useRef, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/newTab'
import ManageRoles from '../manage-roles'
import { Plus } from 'lucide-react'
import GovernmentOfficesIndex from '../settings/government-offices'
// import { ChevronLeft, ChevronRight } from 'lucide-react'
import PostionIndex from '../settings/Postion'
import LeaveTypeIndex from '../settings/LeaveType'
import LicenseTypeIndex from '../settings/licenseType'
import TribunalIndex from '../settings/Tribunal'

const subTabs = [
  { value: 'manage-users', title: 'الادوار', content: <ManageRoles /> },
  { value: 'system-configuration', title: 'إضافة الصفة', content: <PostionIndex /> },
  { value: 'backup', title: 'المكاتب الحكومية', content: <GovernmentOfficesIndex /> },
  { value: 'manage-users-2', title: 'نوع  الإجازات', content: <LeaveTypeIndex /> },
  { value: 'system-configuration-2', title: 'أنواع التراخيص', content: <LicenseTypeIndex /> },
  { value: 'backup-2', title: 'المحكمة', content: <TribunalIndex /> }
]

export default function SystemConfigurationIndex() {
  const [activeTab, setActiveTab] = useState<string>(subTabs[0].value)
  const tabListRef = useRef<HTMLDivElement>(null)

  // const scrollLeft = () => {
  //   if (tabListRef.current) {
  //     tabListRef.current.scrollBy({ left: -100, behavior: 'smooth' })
  //   }
  // }

  // const scrollRight = () => {
  //   if (tabListRef.current) {
  //     tabListRef.current.scrollBy({ left: 100, behavior: 'smooth' })
  //   }
  // }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col justify-center rounded-[8px] pb-20">
        <section className="rounded-xl bg-background">
          <Tabs
            defaultValue={activeTab}
            onValueChange={(value) => setActiveTab(value)}
            className="dark:bg-[#3734a9]"
          >
            <div className="relative flex items-center">
              {/* <button
                onClick={scrollRight}
                className="p-2 absolute -right-9 text-gray-500 hover:text-gray-800 top-9"
              >
                <ChevronRight size={35} color="#3734a9" />
              </button> */}
              <TabsList
                ref={tabListRef}
                className="flex overflow-x-auto h-20 whitespace-nowrap scrollbar-hide p-0 gap-4 mt-6"
                style={{ scrollBehavior: 'smooth' }}
              >
                {subTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="gap-x-2 font-black h-[3.5rem] text-lg relative rounded-xl px-4 py-2 text-gray-500  bg-gray-100 hover:bg-gray-200 active:bg-[#3734a9] active:text-white"
                  >
                    {tab.title}
                    <Plus className="ml-1" size={28} />
                  </TabsTrigger>
                ))}
              </TabsList>
              {/* <button
                onClick={scrollLeft}
                className="p-2 absolute -left-9 text-gray-500 hover:text-gray-800 top-9"
              >
                <ChevronLeft size={35} color="#3734a9" />
              </button> */}
            </div>
            {subTabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="p-4">
                {tab.content}
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </div>
    </div>
  )
}
