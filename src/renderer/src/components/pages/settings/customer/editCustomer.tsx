import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@renderer/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getApi, patchApi } from '@renderer/lib/http'
import { useAuthHeader } from 'react-auth-kit'
import { toast } from '@renderer/components/ui/use-toast'
import { AlertDialogCancel } from '@renderer/components/ui/alert-dialog'
import { useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
const formSchema = z.object({
  name: z.string(),
  type: z.string()
})
interface Props {
  id: number
  onClose: () => void // Added onClose prop
}
export interface CustomerResp {
  id: number
  name: string
  type: number
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}
const types = [
  { label: 'مشتري', value: 1 },
  { label: 'شركة', value: 2 }
]
export default function CustomerEdit({ id, onClose }: Props) {
  const authToken = useAuthHeader()
  const queryClient = useQueryClient()
  const { data: GovernmentOffice, isSuccess } = useQuery({
    queryKey: ['CustomerRespId', id],
    queryFn: async () =>
      await getApi<CustomerResp>(`/customer/${id}`, {
        headers: {
          Authorization: authToken()
        }
      })
  })

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })
  useEffect(() => {
    if (isSuccess) {
      form.reset({
        name: GovernmentOffice.data.name,
        type: String(GovernmentOffice.data.type)
      })
    }
  }, [GovernmentOffice])
  const { mutate } = useMutation({
    mutationKey: ['editCustomerById'],
    mutationFn: (values: z.infer<typeof formSchema>) => {
      // Return the API call to be executed
      return patchApi(
        `/customer/${id}`,
        { ...values, type: +values.type },
        {
          headers: {
            Authorization: `${authToken()}`
          }
        }
      )
    },
    onSuccess() {
      toast({
        title: 'تمت العملية',
        description: 'تمت التعديل بنجاح',
        variant: 'success'
      })
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      form.reset()
      onClose()
    },
    onError(error) {
      toast({
        title: 'لم تتم العملية',
        description: error.message,
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
        <form className="space-y-3">
          <div className="grid grid-cols-1 gap-x-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormControl>
                    <Input label="اسم العميل" placeholder="اسم العميل" type="text" {...field} />
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
                    <Select
                      onValueChange={field.onChange}
                      value={
                        field.value ? String(field.value) : String(GovernmentOffice?.data.type)
                      }
                      defaultValue={field.value}
                    >
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
          <div className="flex justify-between">
            <AlertDialogCancel className="text-sm h-11   bg-[#fff] md:w-40  mr-2 border-2 border-[#3734a9] text-[#3734a9] hover:bg-[#3734a9] hover:text-[#fff] rounded-[12px] sm:w-28 sm:text-[10px] lg:text-sm">
              إلغاء
            </AlertDialogCancel>
            <Button
              type="button"
              className="text-sm h-11   bg-[#3734a9] md:w-40  mr-2 border-2 border-[#3734a9] text-[#fff] hover:bg-[#fff] hover:text-[#3734a9] rounded-[12px] sm:w-28 sm:text-[10px] lg:text-sm"
              onClick={() => {
                onSubmit(form.getValues())
              }}
            >
              حفظ
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
