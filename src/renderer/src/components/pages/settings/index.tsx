import { useRef, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'
import Person from '@renderer/components/icons/person'
import Category2 from '@renderer/components/icons/category-2'
import DirectInbox from '@renderer/components/icons/direct-inbox'
import SystemConfigurationIndex from '../system-configuration'
import BackupIndex from '../backup'
import ManageUsersIndex from '../manage-users'

const subTabs = [
  {
    value: 'manage-users',
    title: 'إدارة المستخدمين',
    content: <ManageUsersIndex />,
    icon: <Person />
  },
  {
    value: 'system-configuration',
    title: 'تهيئة النظام',
    content: <SystemConfigurationIndex />,
    icon: <Category2 />
  },
  {
    value: 'backup',
    title: 'النسخ الأحتياطي',
    content: <BackupIndex />,
    icon: <DirectInbox />
  }
]
export default function SettingsIndex() {
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
              <TabsContent key={tab.value} value={tab.value}>
                {tab.content}
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </div>
    </div>
  )
}
