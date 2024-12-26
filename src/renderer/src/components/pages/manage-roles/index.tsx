import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAuthHeader } from 'react-auth-kit'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getApi, postApi } from '@renderer/lib/http'
import { useSearchParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@renderer/components/ui/use-toast'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { FormInput } from '@renderer/components/ui/form-input'
import { Button } from '@renderer/components/ui/button'
import { Plus } from 'lucide-react'
import RoleTable from './userTable'
export interface Roles {
  info: Info[]
  total: number
  page: string
  pageSize: string
}

export interface Info {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
}
const formSchema = z.object({
  name: z.string().min(1, 'لا يمكن أن يكون الاسم فارغًا')
})
export default function ManageRoles() {
  const authToken = useAuthHeader()
  const [searchParams] = useSearchParams()
  // const query = searchParams.get('query')
  const page = searchParams.get('page')
  const queryClient = useQueryClient()

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ''
    }
  })
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['Roles', page],
    queryFn: () =>
      getApi<Roles>('/Role', {
        params: {
          page: page || 1,
          pageSize: 10000
        },
        headers: {
          Authorization: authToken()
        }
      })
  })

  const { mutate } = useMutation({
    mutationKey: ['addGovernmentOfficeForm'],
    mutationFn: (values: z.infer<typeof formSchema>) => {
      // Return the API call to be executed
      return postApi(
        '/role',
        { ...values },
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
      queryClient.invalidateQueries({ queryKey: ['Roles'] })
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
  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message
  const infoArray = data?.data?.info || []
  console.log('infoArray:', infoArray)
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
                      label="اسم الدور"
                      placeholder="اسم الدور"
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
      <RoleTable info={infoArray || []} page={1} pageSize="1000" total="0" />
    </div>
  )
}
