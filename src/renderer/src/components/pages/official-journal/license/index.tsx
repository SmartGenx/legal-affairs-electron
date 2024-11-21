import TopButtons from './top-buttons'
import { useAuthHeader } from 'react-auth-kit'
import { useQuery } from '@tanstack/react-query'
import { getApi } from '@renderer/lib/http'
import LicenseTable from './licenseTable'
import { useSearchParams } from 'react-router-dom'
import LicenseSearch from './search'

export interface LicenseResp {
  info: Info[]
  total: number
  page: string
  pageSize: string
}

export interface Info {
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
  licenseType: LicenseType
  Customer: Customer
}
export interface Customer {
  id:        number;
  name:      string;
  type?:     number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface LicenseType {
  id: number
  name: string
  fees: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

export default function LicenseIndex() {
  const authToken = useAuthHeader()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query')
  const page = searchParams.get('page')
  const { isLoading, error, data } = useQuery({
    queryKey: ['LicenseResponse', page,query],
    queryFn: () =>
      getApi<LicenseResp>('/license', {
        params: {
          'Customer[name][contains]': query,
          'include[licenseType]': true,
          'include[Customer]': true,
          page: page || 1,
          pageSize: 5
        },
        headers: {
          Authorization: authToken()
        }
      })
  })

  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message
  const infoArray = data?.data?.info || []
  console.log('infoArray:', infoArray)
  return (
    <section className="relative space-y-4 ">
      <LicenseSearch />
      <TopButtons data={data?.data.info || []}/>
      <LicenseTable info={infoArray || []} page={String(data?.data.page)} pageSize={String(data?.data.pageSize)} total={Number(data?.data.total)} />
    </section>
  )
}
