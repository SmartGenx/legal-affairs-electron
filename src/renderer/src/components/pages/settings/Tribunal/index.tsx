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
import TribunalResTable from './tribunalTable'
export interface Potions {
  name: string
}

const formSchema = z.object({
  name: z.string().min(1, 'لا يمكن أن يكون الاسم فارغًا')
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
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

export default function TribunalIndex() {
  const authToken = useAuthHeader()
  const queryClient = useQueryClient()

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ''
    }
  })
  const { data: TribunalTable, refetch } = useQuery({
    queryKey: ['TribunalTable'],
    queryFn: () =>
      getApi<Info[]>('/tribunal', {
        headers: {
          Authorization: authToken()
        }
      })
  })

  const { mutate } = useMutation({
    mutationKey: ['addTribunalForm'],
    mutationFn: (values: z.infer<typeof formSchema>) => {
      // Return the API call to be executed
      return postApi(
        '/tribunal',
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
      queryClient.invalidateQueries({ queryKey: ['addTribunalForm'] })
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
                      label="اسم المحكمة"
                      placeholder="اسم المحكمة"
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
      <TribunalResTable info={TribunalTable?.data || []} pageSize="5" page="2" total={5} />
    </div>
  )
}
