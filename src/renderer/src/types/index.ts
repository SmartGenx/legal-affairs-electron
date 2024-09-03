import { Icons } from '@renderer/components/icons/icons'

export type NavItem = {
  title?: string
  list: Array<{
    type?: 'link'
    href: string
    disabled?: boolean
    external?: boolean
    icon?: keyof typeof Icons
    label: string
    description?: string
    arrows?: keyof typeof Icons
    subLinks?: { href: string; label: string; disabled?: boolean }[]
  }>
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[]
}

export interface FooterItem {
  title: string
  items: {
    title: string
    href: string
    external?: boolean
  }[]
}

export interface TribunalResponse {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

export interface LogInResponse {
  email: string
  username: string
  token: string
}
export interface IssuesResponse {
  id: number
  name: string
  postionId: number
  governmentOfficeId: number
  title: string
  type: number
  invitationType: number
  isDeleted: boolean
  state: boolean
  createdAt: Date
  updatedAt: Date
}
export interface InfoIssue {
  id: number
  name: string
  postionId: number
  governmentOfficeId: number
  title: string
  type: number
  invitationType: number
  isDeleted: boolean
  state: boolean
  createdAt: Date
  updatedAt: Date
}
export type Issues = {
  info: InfoIssue[]
  total: number
  page: string
  pageSize: string
}

export interface ComplaintInfo {
  id: number
  name: string
  refrance: string
  governmentOfficeId: number
  title: string
  description: string
  date: Date
  officeOpinian: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
  governmentOffice: GovernmentOffice
}

export interface GovernmentOffice {
  id: number
  name: string
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}
export type Complaint = {
  info: ComplaintInfo[]
  total: number
  page: string
  pageSize: string
}

export interface DecisionInfo {
  id: number
  decisionName: string
  refrance: string
  governmentOfficeId: number
  title: string
  description: string
  decisionSource: string
  nameSource: string
  isDeleted: boolean
  attachmentPath: string
  createdAt: Date
  updatedAt: Date
  decisionDate: Date
  governmentOffice: GovernmentOffice
}

export type Decision = {
  info: DecisionInfo[]
  total: number
  page: string
  pageSize: string
}

export interface BookInfo {
  id: number
  name: string
  quantity: number
  price: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}
export type Books = {
  info: BookInfo[]
  total: number
  page: string
  pageSize: string
}
export type MainNavItem = NavItemWithOptionalChildren

export type SidebarNavItem = NavItemWithChildren
