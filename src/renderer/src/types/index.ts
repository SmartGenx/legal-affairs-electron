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
export type GeneralizationInfo = {
  id: number
  title: string
  refrance: string
  description: string
  attachmentPath: string
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}
export type Generalization = {
  info: GeneralizationInfo[]
  total: number
  page: string
  pageSize: string
}

export interface EmployInfo {
  id: number
  name: string
  reference: string
  phone: string
  address: string
  dob: Date
  education: string
  megor: number
  graduationDate: Date
  idtype: number
  idNumber: string
  issuerDate: Date
  issuerPlace: string
  empLeaved: string
  empDgree: number
  position: string
  salary: number
  firstEmployment: Date
  employmentDate: Date
  currentUnit: number
  currentEmploymentDate: Date
  legalStatus: number
  employeeStatus: number
  detailsDate: Date
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
  Attachment: Attachment[]
}

export interface Attachment {
  id: number
  file: string
  emploteeId: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

export type Employ = {
  info: EmployInfo[]
  total: number
  page: string
  pageSize: string
}

export interface licenseType {
  id: number
  name: string
  fees: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
  license: License[]
}

export interface License {
  id: number
  licenseTypeId: number
  customerId: number
  licenseNumber: string
  licenseYear: number
  compnayPorpose: string
  compnayLocation: string
  compnayCapital: number
  compnayManger: string
  referenceNum: string
  referenceDate: Date
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

export interface LicenseType {
  info: licenseType[]
  total: number
  page: string
  pageSize: string
}

export interface CustomerInfo {
  id: number
  name: string
  type: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}
export interface Customer {
  info: CustomerInfo[]
  total: number
  page: string
  pageSize: string
}

export interface AgencyInfo {
  id: number
  legalName: string
  providedDocument: number
  governmentOfficeId: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}
export interface Agency {
  info: AgencyInfo[]
  total: number
  page: string
  pageSize: string
}
export type MainNavItem = NavItemWithOptionalChildren

export type SidebarNavItem = NavItemWithChildren
