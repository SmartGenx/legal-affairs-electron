import { cn } from '@renderer/lib/utils'
import { useEffect, useState } from 'react'
import logo from '../../assets/images/logo-icon.svg'
import useNavItems from '../../hooks/useNavItems'
import useNavItemsSetting from '../../hooks/useNavItemsSetting'
import useScreenSize from '../../hooks/useScreenSize'
import SidebarToggleIcon from '../icons/sidebar-toggler-icon'
import DashboardNav from './dashboard-nav'

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true)
  const navItems = useNavItems()
  const navItemsSetting = useNavItemsSetting()
  const screenSize = useScreenSize()
  const width = screenSize.width

  useEffect(() => {
    if (width <= 940) {
      setExpanded(false)
    } else {
      setExpanded(true)
    }
  }, [width])

  return (
    <aside
      className={cn(
        'relative z-50  flex h-[100vh] shrink-0 flex-col rounded-none  border bg-background  shadow-xl   transition-all ease-in-out bg-[#3734a9]',
        expanded ? 'w-[270px]' : 'w-24'
      )}
    >
      <SidebarToggleIcon expanded={expanded} setExpanded={setExpanded} />

      <div className={cn('flex w-full flex-col items-center justify-center gap-2', {})}>
        {expanded ? (
          <div className="flex p-4 w-full items-center text-white">
            <div>
              <img src={logo} alt="logo" className="w-[52px] h-[52px]" />
            </div>
            <div className="mr-2">
              <h3 className="font-bold text-md">مكتب الشؤون القانونية</h3>
              <p className="text-sm">محافظة حضرموت</p>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <img src={logo} alt="logo" className="w-[52px] h-[52px]" />
          </div>
        )}

        <div className="mt-6 "></div>
      </div>

      <div className="flex-grow overflow-y-auto py-4 hide-scrollbar">
        <DashboardNav items={navItems} expanded={expanded} itemsSettings={navItemsSetting} />
      </div>
    </aside>
  )
}
