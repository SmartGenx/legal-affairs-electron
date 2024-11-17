import { useAuthHeader } from 'react-auth-kit'
import { useQuery } from '@tanstack/react-query'
import { getApi } from '@renderer/lib/http'
import OrderBookTable from './orderTable'
import TopButtons from './top-button'
import { useSearchParams } from 'react-router-dom'
import OrderBookSearch from './search'

export interface OrderBookResponse {
  info: Info[]
  total: number
  page: string
  pageSize: string
}

export interface Info {
  id: number
  bookId: number
  quantity: number
  customerId: number
  reference: string
  description: string
  sellingDate: Date
  orderNumber: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
  Customer: Customer
  Book: Book
}

export interface Book {
  id: number
  name: string
  quantity: number
  price: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

export interface Customer {
  id: number
  name: string
  type: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

export default function OrderBookIndex() {
  const authToken = useAuthHeader()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query')
  const page = searchParams.get('page')
  const { isLoading, error, data } = useQuery({
    queryKey: ['OrderBookResponseTable',page],
    queryFn: () =>
      getApi<OrderBookResponse>(
        '/book-order',
        {
          params: {
            'Book[name][contains]': query,
            'include[Book]': true,
            'include[Customer]': true,
            page: page || 1,
            pageSize: 5
          },
          headers: {
            Authorization: authToken()
          }
        }
      )
  })
  const infoArray = data?.data?.info || []
  console.log('infoArray:', infoArray)
  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message
  
  return (
    <section className="relative space-y-4 ">
      <OrderBookSearch />
      <TopButtons data={data?.data.info || []}/>
      <OrderBookTable info={infoArray || []} page="1" pageSize="0" total={0} />
    </section>
  )
}
