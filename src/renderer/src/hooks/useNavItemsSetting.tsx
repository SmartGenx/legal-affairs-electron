import { NavItem } from '../types/index'

export default function useNavItemsSetting() {
  const navItems: NavItem[] = [
    {
      list: [
        {
          href: '/settings',
          icon: 'gear',
          label: 'الأعدادات',
          disabled: false,
          arrows: 'arows',
          role: [1,9]
        },
        {
          href: '/login',
          icon: 'signOut',
          label: 'تسجيل الخروج',
          disabled: false,
          arrows: 'arows',
          role: [1,2,3,4,5,6,7,8,9]
        }
      ]
    }
  ]
  return navItems
}
