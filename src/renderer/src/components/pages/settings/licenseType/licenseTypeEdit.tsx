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
const formSchema = z.object({
  name: z.string(),
  fees: z.string()
})
interface Props {
  id: number
}
export interface licenseTypeById {
  id: number
  name: string
  fees: number
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

export default function LicenseTypeEdit({ id }: Props) {
  const authToken = useAuthHeader()
  const queryClient = useQueryClient()
  const { data: GovernmentOffice, isSuccess } = useQuery({
    queryKey: ['licenseTypeById', id],
    queryFn: async () =>
      await getApi<licenseTypeById>(`/license-type/${id}`, {
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
        fees: String(GovernmentOffice.data.fees)
      })
    }
  }, [GovernmentOffice])
  const { mutate } = useMutation({
    mutationKey: ['editLicenseTypeById'],
    mutationFn: (values: z.infer<typeof formSchema>) => {
      // Return the API call to be executed
      return patchApi(
        `/license-type/${id}`,
        { ...values, fees: +values.fees },
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

      queryClient.invalidateQueries({ queryKey: ['LicenseTypeTable'] })
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
                    <Input
                      label="عنوان الاجازة"
                      placeholder="عنوان الاجازة"
                      type="text"
                      {...field}
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
              name="fees"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      label="الرسوم"
                      placeholder="الرسوم"
                      type="text"
                      {...field}
                    />
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