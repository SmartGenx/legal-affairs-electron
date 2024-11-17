import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../../ui/form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAuthHeader } from 'react-auth-kit'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@renderer/components/ui/button'
import { FormInput } from '@renderer/components/ui/form-input'
import { axiosInstance, patchApi } from '@renderer/lib/http'
import { useToast } from '@renderer/components/ui/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select'
import { Textarea } from '@renderer/components/ui/textarea'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BookInfo } from '@renderer/types'
import AddCustomerDialog from '../../dailogs/add-customer'

const formSchema = z.object({
  bookId: z.string(),
  quantity: z.string(),
  customerId: z.string(),
  reference: z.string(),
  description: z.string(),
  sellingDate: z.string(),
  orderNumber: z.string()
})

export type customer = {
  id: number
  name: string
  type: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

export interface OrderBookResp {
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

type BookFormValue = z.infer<typeof formSchema>

export default function UpdateOrderBook() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const authToken = useAuthHeader()
  const navigate = useNavigate()
  const [bookId, setBookId] = useState<string | null>(null)
  const [quantity, setQuantity] = useState<number>(0)
  console.log('quantity', quantity)
  const [data, setData] = useState<customer[]>([])
  const [order, setOrder] = useState<BookInfo[]>([])

  // Find the selected book's price
  const selectedBook = order.find((x) => bookId === String(x.id))
  const price = selectedBook ? selectedBook.price : 0
  const total = price * quantity

  const fetchDataById = async () => {
    const response = await axiosInstance.get<OrderBookResp[]>(
      `/book-order/?include[Customer]=true&include[Book]=true&id=${id}`,
      {
        headers: {
          Authorization: `${authToken()}`
        }
      }
    )
    return response.data
  }
  const {
    data: BookData,
    error: _BookError,
    isLoading: _BookIsLoading
  } = useQuery({
    queryKey: ['BooksById', id],
    queryFn: fetchDataById,
    enabled: !!id
  })

  useEffect(() => {
    if (BookData) {
      form.reset({
        bookId: String(BookData[0].bookId),
        quantity: String(BookData[0].quantity),
        customerId: String(BookData[0].customerId),
        reference: String(BookData[0].reference),
        description: String(BookData[0].description),
        sellingDate: String(BookData[0].sellingDate).split('T')[0],
        orderNumber: String(BookData[0].orderNumber)
      })
    }
    if (!bookId && BookData && BookData.length > 0) {
      setBookId(String(BookData[0].bookId))
    }
    if (!quantity && BookData && BookData.length > 0) {
      setQuantity(BookData[0].quantity)
    }
  }, [BookData, bookId])
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('/customer', {
        headers: {
          Authorization: `${authToken()}`
        }
      })
      setData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  //
  const fetchOrder = async () => {
    try {
      const response = await axiosInstance.get('/book', {
        headers: {
          Authorization: `${authToken()}`
        }
      })
      setOrder(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  //
  // console.log('bookId', bookId)
  // console.log('data', data)
  useEffect(() => {
    fetchData()
    fetchOrder()
  }, [])
  const form = useForm<BookFormValue>({
    resolver: zodResolver(formSchema)
  })
  const { mutate } = useMutation({
    mutationKey: ['UpdateOrderBook'],
    mutationFn: (datas: BookFormValue) =>
      patchApi(
        `/book-order/${id}`,
        {
          bookId: +datas.bookId,
          quantity: +datas.quantity,
          customerId: +datas.customerId,
          reference: datas.reference,
          description: datas.description,
          sellingDate: new Date(datas.sellingDate).toISOString(),
          orderNumber: +datas.orderNumber
        },
        {
          headers: {
            Authorization: `${authToken()}`
          }
        }
      ),
    onSuccess: () => {
      toast({
        title: 'اشعار',
        variant: 'success',
        description: 'تمت الاضافة بنجاح'
      })
      queryClient.invalidateQueries({ queryKey: ['OrderBookResponseTable'] })
      queryClient.invalidateQueries({ queryKey: ['BooksById', id] })
      navigate('/official-journal')
    },
    onError: (error) => {
      toast({
        title: 'لم تتم العملية',
        description: error.message,
        variant: 'destructive'
      })
    }
  })
  const onSubmit = (datas: BookFormValue) => {
    mutate(datas)
  }
  return (
    <div className="min-h-[50vh] w-full mt-5">
      <Form {...form}>
        <form
          id="OrderBookForm"
          //   key={key}
          onSubmit={form.handleSubmit(onSubmit)}
          className=""
        >
          {process.env.NODE_ENV === 'development' && (
            <>
              <p>Ignore it, it just in dev mode</p>
              <div>{JSON.stringify(form.formState.errors)}</div>
            </>
          )}
          <div className="mb-4 bg-[#dedef8] rounded-t-lg">
            <h3 className="font-bold text-[#3734a9] p-3">المعلومات الأساسية</h3>
          </div>

          <div className="grid h-[80px]   grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <FormField
                control={form.control}
                name="bookId"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setBookId(value)

                        // Add any additional handling as needed here
                        if (BookData) {
                          const selectedBook = BookData.find(
                            (book) => String(book.bookId) === value
                          )
                          if (selectedBook) {
                            console.log('Selected Book:', selectedBook)
                          }
                        }
                      }}
                      value={
                        field.value
                          ? String(field.value)
                          : BookData && BookData.length > 0
                            ? String(BookData[0].bookId)
                            : ''
                      }
                      defaultValue={
                        field.value
                          ? String(field.value)
                          : BookData && BookData.length > 0
                            ? String(BookData[0].bookId)
                            : ''
                      }
                    >
                      <FormControl className="bg-transparent h-11 text-[#757575] text-base border-[3px] border-[#E5E7EB] rounded-xl">
                        <SelectTrigger>
                          <SelectValue placeholder="اسم الكتاب" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {order.map((options) => (
                          <SelectItem key={options.id} value={String(options.id)}>
                            {options.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/*  */}
          </div>

          {/*  */}

          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <FormInput
                className="h-11 p-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                placeholder="سعر الكتاب"
                value={order.find((x) => bookId === String(x.id))?.price || ''} // Find the price by matching the bookId
                disabled
              />
            </div>

            <div className=" col-span-1 h-[50px] ">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        {...field}
                        className="h-11 p-0 placeholder:text-base rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        placeholder="   عدد الكتب "
                        onChange={(e) => {
                          const value = e.target.value
                            ? Number(e.target.value)
                            : BookData && BookData.length > 0
                              ? BookData[0].quantity
                              : 0 // Default to 0 if BookData is undefined or empty

                          setQuantity(value)
                          field.onChange(e)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className=" col-span-1 h-[50px] ">
              <FormInput
                className="h-11 p-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                disabled
                value={total}
                placeholder="   الإجمالي "
              />
            </div>
            {/*  */}
          </div>
          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <FormField
                control={form.control}
                name="sellingDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        {...field}
                        placeholder="تاريخ التخرج"
                        type="date"
                        className="h-11 px-1 placeholder:text-base  rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/*  */}

          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-2 h-[50px] ">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      value={
                        field.value
                          ? String(field.value)
                          : BookData && BookData[0]
                            ? String(BookData[0].customerId)
                            : ''
                      }
                      defaultValue={field.value}
                    >
                      <FormControl className="bg-transparent h-11 text-[#757575] text-base border-[3px] border-[#E5E7EB] rounded-xl">
                        <SelectTrigger>
                          <SelectValue placeholder="اسم المشتري" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {data.map((options) => (
                          <SelectItem key={options.name} value={String(options.id)}>
                            {options.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className=" col-span-1 h-[50px] ">
              <AddCustomerDialog />
            </div>
          </div>

          <div className="grid h-[80px]   grid-cols-2 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 p-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        placeholder="   رقم الصرف "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className=" col-span-1 h-[50px] ">
              <FormField
                control={form.control}
                name="orderNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 p-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        placeholder="   رقم السند "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid h-[150px]  grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[40px] ">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormControl>
                      <Textarea
                        className="bg-transparent placeholder:text-base rounded-xl border-[3px] border-[#E5E7EB]"
                        rows={5}
                        {...field}
                        placeholder="ملاحظات"
                      ></Textarea>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/*  */}
          </div>

          <div className="w-full flex justify-end gap-2 mb-4">
            <Link to={'/state-affairs'}>
              <Button className="text-sm h-10 md:w-30 lg:w-30  bg-[#fff] border-2 border-[#3734a9] text-[#3734a9] hover:bg-[#3734a9] hover:text-[#fff] hover:border-2 hover:border-white rounded-[12px] sm:w-28 sm:text-[10px]  lg:text-sm">
                إلغاء
              </Button>
            </Link>

            <Button
              className="text-sm h-10 md:w-30 lg:w-30  bg-[#3734a9] border-2 border-[#3734a9] text-[#fff] hover:border-2 hover:border-[#2f2b94] hover:bg-[#fff] hover:text-[#2f2b94] rounded-[12px] sm:w-28 sm:text-[10px]  lg:text-sm"
              type="submit"
            >
              <p className="font-bold text-base">تعديل</p>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
