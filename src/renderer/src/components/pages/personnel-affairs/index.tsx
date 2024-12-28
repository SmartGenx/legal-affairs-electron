import  { useRef, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'
import Assignment from '@renderer/components/icons/assignment'
import LeaveIndex from './leave'
import EmployeeIndex from './add-employee'
import ExportNotes from '@renderer/components/icons/export_notes'
const subTabs = [
  {
    value: 'Medical-allocations',
    title: 'كشف الموظفين',
    content: <EmployeeIndex />,
    icon: <Assignment />
  },
  {
    value: 'Follow-the-recipes',
    title: 'إدارة الأجازات',
    content: <LeaveIndex />,
    icon: <ExportNotes />,
  }
]
export default function PersonnelAffairsIndex() {
  const [activeTab, setActiveTab] = useState<string>(subTabs[0].value)
  const firstTabRef = useRef<HTMLButtonElement>(null)
  return (
    <div className="flex flex-col gap-6  ">
      <div className="flex  flex-col justify-center px-6 gap-5  rounded-[8px] pb-20 ">
        <section className="rounded-xl bg-background  ">
          <Tabs
            defaultValue={activeTab}
            onValueChange={(value) => setActiveTab(value)}
            className=" dark:bg-[#3734a9]"
          >
            <TabsList className="p-0 flex justify-start">
              {subTabs.map((tab, index) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="gap-x-2 font-black text-lg"
                  ref={index === 0 ? firstTabRef : null}
                >
                  <span>{tab.icon}</span>
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {subTabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="p-4 ">
                {tab.content}
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </div>
    </div>
  )
}
