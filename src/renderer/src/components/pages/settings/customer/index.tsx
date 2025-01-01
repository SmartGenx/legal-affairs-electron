import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@renderer/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getApi, postApi } from '@renderer/lib/http'
import { useAuthHeader } from 'react-auth-kit'
import { toast } from '@renderer/components/ui/use-toast'
import { Plus } from 'lucide-react'
import { FormInput } from '@renderer/components/ui/form-input'
import CustomerTable from './customerTable'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
export interface Potions {
  name: string
}

const formSchema = z.object({
  name: z.string().min(1, 'لا يمكن أن يكون الاسم فارغًا'),
  type: z.string()
})

export interface CustomerResp {
  id: number
  name: string
  type: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

export default function CustomerIndex() {
  const authToken = useAuthHeader()
  const queryClient = useQueryClient()

  const types = [
    { label: 'مشتري', value: 1 },
    { label: 'شركة', value: 2 }
  ]
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ''
    }
  })
  const { data: customer, refetch } = useQuery({
    queryKey: ['customers'],
    queryFn: () =>
      getApi<CustomerResp[]>('/customer', {
        headers: {
          Authorization: authToken()
        }
      })
  })

  const { mutate } = useMutation({
    mutationKey: ['AddCustomerSetting'],
    mutationFn: (values: z.infer<typeof formSchema>) => {
      // Return the API call to be executed
      return postApi(
        '/customer',
        { ...values, type: +values.type },
        {
          headers: {
            Authorization: `${authToken()}`
          }
        }
      )
    },
    onSuccess: () => {
      toast({
        title: 'تمت العملية',
        description: 'تمت الاضافة بنجاح',
        variant: 'success'
      })
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      refetch()
      form.reset()
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'حدث خطأ ما'
      toast({
        title: 'لم تتم العملية',
        description: errorMessage,
        variant: 'destructive'
      })
    }
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values)
  }
  return (
    <div className="space-y-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex justify-between gap-x-2">
          <div className="grid w-full grid-cols-1 gap-x-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FormInput
                      label="اسم العميل"
                      placeholder="اسم العميل"
                      type="text"
                      {...field}
                      className="w-full h-11 rounded-xl border-[3px] border-[#E5E7EB] -translate-y-0 px-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid w-full grid-cols-1 gap-x-2">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl className="bg-transparent h-11 text-[#757575] text-base border-[3px] border-[#E5E7EB] rounded-xl ">
                        <SelectTrigger>
                          <SelectValue placeholder="نوع العميل" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {types.map((directorate) => (
                          <SelectItem key={directorate.value} value={String(directorate.value)}>
                            {directorate.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            className="text-sm h-11  bg-[#3734a9] md:w-40  mr-2 border-2 border-[#3734a9] text-[#fff] hover:bg-[#fff] hover:text-[#3734a9] rounded-[12px] sm:w-28 sm:text-[10px] lg:text-sm"
          >
            <h1 className="text-[13px] font-black">إضافة</h1>
            <Plus className="mr-1" size={28} />
          </Button>
        </form>
      </Form>
      <CustomerTable info={customer?.data || []} pageSize="5" page="2" total={5} />
    </div>
  )
}
