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
          href: '/the-department-of-al-lfta',
          icon: 'chart',
          label: ' إدارة الإفتاء',
          arrows: 'arows'
        },
        {
          href: '/decisions',
          icon: 'bill',
          label: ' القرارات',
          arrows: 'arows'
        },
        {
          href: '/official-journal',
          icon: 'documentText',
          label: ' الجريدة الرسمية',
          arrows: 'arows'
        },
        {
          href: '/generalization',
          icon: 'save2',
          label: ' التعميمات',
          arrows: 'arows'
        },
        {
          href: '/Agency',
          icon: 'notificationStatus',
          label: ' التوكيلات',
          arrows: 'arows'
        },
        {
          href: '/personnel-affairs',
          icon: 'userSquare',
          label: ' شؤون الموظفين',
          arrows: 'arows'
        }
      ]
    }
  ]
  return navItems
}
