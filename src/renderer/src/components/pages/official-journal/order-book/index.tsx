import BookSearch from '../search'
import { useAuthHeader } from 'react-auth-kit'
import { useQuery } from '@tanstack/react-query'
import { getApi } from '@renderer/lib/http'
import OrderBookTable from './orderTable'
import TopButtons from './top-button'

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
  const { isLoading, error, data } = useQuery({
    queryKey: ['OrderBookResponse'],
    queryFn: () =>
      getApi<OrderBookResponse>(
        '/book-order?page=1&pageSize=4&include[Customer]=true&include[Book]=true',
        {
          headers: {
            Authorization: authToken()
          }
        }
      )
  })

  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message
  const infoArray = data?.data?.info || []
  console.log('infoArray:', infoArray)
  return (
    <section className="relative space-y-4 ">
      <BookSearch />
      <TopButtons />
      <OrderBookTable info={infoArray || []} page="1" pageSize="0" total={0} />
    </section>
  )
}
