import { NavItem } from '../types/index'

export default function useNavItems() {
  const navItems: NavItem[] = [
    {
      list: [
        {
          href: '/',
          icon: 'house',
          label: ' الرئيسية',
          arrows: 'arows'
        },

        {
          href: '/state-affairs',
          icon: 'bank',
          label: 'قضايا الدولة',
          arrows: 'arows'
        },
        {
          href: '/qq',
          icon: 'chart',
          label: ' إدارة الأفتاء',
          arrows: 'arows'
        },
        {
          href: '/xx',
          icon: 'bill',
          label: ' القرارات',
          arrows: 'arows'
        },
        {
          href: '/vv',
          icon: 'documentText',
          label: ' الجريدة الرسمية',
          arrows: 'arows'
        },
        {
          href: '/bb',
          icon: 'save2',
          label: ' التعميمات',
          arrows: 'arows'
        },
        {
          href: '/nn',
          icon: 'userSquare',
          label: ' شؤون الموظفين',
          arrows: 'arows'
        }
      ]
    }
  ]
  return navItems
}
