import { NavItem } from '../types/index'

export default function useNavItemsSetting() {
  const navItems: NavItem[] = [
    {
      list: [
        {
          href: '/backup',
          icon: 'gear',
          label: 'الأعدادات',
          disabled: false,
          arrows: 'arows'
        },
        {
          href: '/backup',
          icon: 'signOut',
          label: 'تسجيل الخروج',
          disabled: false,
          arrows: 'arows'
        }
      ]
    }
  ]
  return navItems
}
