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
          href: '/ww',
          icon: 'bank',
          label: 'قضايا الدولة',
          arrows: 'arows',
          subLinks: [
            {
              label: 'المستخدمين',
              href: '/users'
            },
            {
              label: 'الموطفين',
              href: '/employees',
              disabled: true
            },
            {
              label: 'ضبط كلمة المرور',
              href: '/reset-password',
              disabled: true
            }
          ]
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
