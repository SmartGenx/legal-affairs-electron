import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@renderer/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
// import CategoryTabel from '../_components/CategoryTabel'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getApi, postApi } from '@renderer/lib/http'
import { useAuthHeader } from 'react-auth-kit'
import { toast } from '@renderer/components/ui/use-toast'
import { Plus } from 'lucide-react'
import { FormInput } from '@renderer/components/ui/form-input'
import LeaveTypeTable from './LeaveTypeTable'
export interface Potions {
  name: string
}

const formSchema = z.object({
  name: z.string(),
  defaultDay: z.string()
})

export interface PotionsResp {
  info: Info[]
  total: number
  page: string
  pageSize: string
}

export interface Info {
  id: number
  name: string
  defaultDay: number
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

export default function LeaveTypeIndex() {
  const authToken = useAuthHeader()
  const queryClient = useQueryClient()

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ''
    }
  })
  const { data: governmentOfficeTable, refetch } = useQuery({
    queryKey: ['LeaveTypeTable'],
    queryFn: () =>
      getApi<Info[]>('/leave-type', {
        headers: {
          Authorization: authToken()
        }
      })
  })

  const { mutate } = useMutation({
    mutationKey: ['addLeaveTypeForm'],
    mutationFn: (values: z.infer<typeof formSchema>) => {
      // Return the API call to be executed
      return postApi(
        '/leave-type',
        { ...values, defaultDay: +values.defaultDay },
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
      queryClient.invalidateQueries({ queryKey: ['addLeaveTypeForm'] })
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
                      label="عنوان الاجازة"
                      placeholder="عنوان الاجازة"
                      type="text"
                      {...field}
                      className="w-full h-11 rounded-xl -translate-y-0 px-2"
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
              name="defaultDay"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FormInput
                      label="الايام الافتراضية"
                      placeholder="الايام الافتراضية"
                      type="text"
                      {...field}
                      className="w-full h-11 rounded-xl -translate-y-0 px-2"
                    />
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
      <LeaveTypeTable info={governmentOfficeTable?.data || []} pageSize="5" page="2" total={5} />
    </div>
  )
}
