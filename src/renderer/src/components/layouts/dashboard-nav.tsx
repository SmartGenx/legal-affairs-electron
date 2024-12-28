// DashboardNav.tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@renderer/components/ui/tooltip'
import { cn } from '@renderer/lib/utils'
import { useAuthUser, useSignOut } from 'react-auth-kit'
import { Link, useLocation } from 'react-router-dom'
import { NavItem } from '../../types/index'
import { Icons } from '../icons/icons'

interface DashboardNavProps {
  items: NavItem[]
  itemsSettings: NavItem[]
  expanded?: boolean
}

export default function DashboardNav({
  items,
  itemsSettings,
  expanded = false
}: DashboardNavProps) {
  const location = useLocation()
  const signOut = useSignOut()
  const path = location.pathname

  const authUser = useAuthUser()
  const user = authUser()

  const userRoles: number[] = user?.role || []
  console.log('🚀 ~ UserNav ~ user ~ Role:', userRoles)

  const isSelected = (href: string) => {
    return path === href
  }

  if (!items?.length) {
    return null
  }

  // Updated hasAccess function to handle array of roles
  const hasAccess = (navRoles: number[]): boolean => {
    return navRoles.some((role) => userRoles.includes(role))
  }

  return (
    <nav className="grid items-start gap-6">
      {/* Main Navigation Items */}
      {items.map((item, index) => (
        <div key={index}>
          {item.title && (
            <h5
              className={cn('mb-2 px-4 text-sm font-normal text-primary', !expanded && 'invisible')}
            >
              {item.title}
            </h5>
          )}
          {item.list
            .filter((nav) => hasAccess(nav?.role || [])) // Updated filter logic
            .map((nav, i) => {
              const Icon = Icons[nav.icon || 'arrowRight']
              const Arows = Icons[nav.arrows || 'arrowRight']
              return (
                <div key={i}>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip disableHoverableContent>
                      <TooltipTrigger asChild>
                        {nav.href === '' ? (
                          <div
                            className={cn(
                              'group mb-1 flex items-center px-4 py-3 text-sm font-medium text-white hover:bg-[#fff] hover:text-[#3734a9] w-[90%] hover:rounded-l-2xl cursor-pointer',
                              nav.subLinks &&
                                nav.subLinks.filter((x) => isSelected(x.href)).length > 0
                                ? 'text-white hover:text-[#3734a9]'
                                : 'transparent',
                              !expanded && 'justify-center',
                              nav.disabled && 'cursor-not-allowed opacity-80'
                            )}
                            onClick={(e) => {
                              if (nav.disabled) e.preventDefault()
                            }}
                          >
                            <Icon className="mx-2 h-5 w-5" />
                            {expanded && (
                              <span className="min-w-max text-lg font-medium flex items-center justify-between w-full">
                                {nav.label}
                              </span>
                            )}
                          </div>
                        ) : (
                          <Link
                            to={nav.href}
                            className={cn(
                              'group mb-1 flex items-center px-4 py-3 text-sm font-medium text-white hover:bg-[#fff] hover:text-[#3734a9] w-[90%] rounded-l-2xl cursor-pointer',
                              isSelected(nav.href) ? 'bg-white text-[#3734a9] ' : 'transparent',
                              !expanded && 'justify-center',
                              nav.disabled && 'cursor-not-allowed opacity-80'
                            )}
                            onClick={(e) => {
                              if (nav.disabled) e.preventDefault()
                            }}
                          >
                            <Icon className="mx-2 h-5 w-5" />
                            {expanded && (
                              <span className="min-w-max text-lg font-medium flex items-center justify-between w-full">
                                {nav.label}
                              </span>
                            )}
                            <Arows className={expanded ? 'mx-2 h-3 w-3' : 'hidden'} />
                          </Link>
                        )}
                      </TooltipTrigger>
                      {!expanded && (
                        <TooltipContent side="left">
                          <div>{nav.label}</div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )
            })}
        </div>
      ))}

      {/* Settings Navigation Items */}
      <div className="lg:mt-[7rem] md:mt-[6rem]">
        {itemsSettings.map((item, index) => (
          <div key={index}>
            {item.title && (
              <h5
                className={cn(
                  'mb-2 px-4 text-sm font-normal text-primary',
                  !expanded && 'invisible'
                )}
              >
                {item.title}
              </h5>
            )}
            {item.list
              .filter((nav) => hasAccess(nav?.role || [])) // Updated filter logic
              .map((nav, i) => {
                const Icon = Icons[nav.icon || 'arrowRight']

                return (
                  <div key={i}>
                    <TooltipProvider delayDuration={0}>
                      <Tooltip disableHoverableContent>
                        <TooltipTrigger asChild>
                          <Link
                            to={nav.href}
                            className={cn(
                              'group mb-1 flex items-center px-4 py-3 text-sm font-medium text-white rounded-l-2xl hover:bg-[#fff] hover:text-[#3734a9] w-[90%] hover:rounded-l-2xl cursor-pointer ',
                              isSelected(nav.href) ? 'bg-white text-[#3734a9] ' : 'transparent',
                              !expanded && 'justify-center',
                              nav.disabled && 'cursor-not-allowed opacity-80'
                            )}
                            onClick={(e) => {
                              if (nav.disabled) e.preventDefault()
                            }}
                          >
                            <Icon className="mx-2 h-5 w-5" />
                            {expanded && (
                              <span
                                onClick={nav.label === 'تسجيل الخروج' ? () => signOut() : () => {}}
                                className="min-w-max text-lg font-medium flex items-center justify-between w-full"
                              >
                                {nav.label}
                              </span>
                            )}
                          </Link>
                        </TooltipTrigger>
                        {!expanded && (
                          <TooltipContent side="left">
                            <div>{nav.label}</div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )
              })}
          </div>
        ))}
      </div>
    </nav>
  )
}
