import { NavItem } from '../types/index'

export default function useNavItems() {
  const navItems: NavItem[] = [
    {
      list: [
        {
          href: '/',
          icon: 'house',
          label: ' الرئيسية',
          arrows: 'arows',
          role: [1, 2, 3, 4, 5, 6, 7, 8, 9]
        },

        {
          href: '/state-affairs',
          icon: 'bank',
          label: 'قضايا الدولة',
          arrows: 'arows',
          role: [1, 2]
        },
        {
          href: '/the-department-of-al-lfta',
          icon: 'chart',
          label: ' إدارة الإفتاء',
          arrows: 'arows',
          role: [1, 3]
        },
        {
          href: '/decisions',
          icon: 'bill',
          label: ' القرارات',
          arrows: 'arows',
          role: [1, 4]
        },
        {
          href: '/official-journal',
          icon: 'documentText',
          label: ' الجريدة الرسمية',
          arrows: 'arows',
          role: [1, 5]
        },
        {
          href: '/generalization',
          icon: 'save2',
          label: ' التعميمات',
          arrows: 'arows',
          role: [1, 6]
        },
        {
          href: '/Agency',
          icon: 'notificationStatus',
          label: ' التوكيلات',
          arrows: 'arows',
          role: [1, 7]
        },
        {
          href: '/personnel-affairs',
          icon: 'userSquare',
          label: ' شؤون الموظفين',
          arrows: 'arows',
          role: [1, 8]
        }
      ]
    }
  ]
  return navItems
}
// 'admin',
//           'state-affairs',
//           'the-department-of-al-lfta ',
//           'decisions',
//           'official-journal',
//           'generalization',
//           'Agency',
//           'personnel-affairs',
//           'settings'
