// EditPosition.tsx
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
  name: z.string().min(1, "اسم الصفة مطلوب") // Added validation
})

interface Props {
  id: number
  onClose: () => void // Added onClose prop
}

export interface PositionById {
  id: number
  name: string
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

export default function EditPosition({ id, onClose }: Props) { // Destructure onClose
  const authToken = useAuthHeader()
  const queryClient = useQueryClient()

  const { data: positionByIdData, isSuccess } = useQuery({
    queryKey: ['positionById', id],
    queryFn: async () =>
      await getApi<PositionById>(`/position/${id}`, {
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
    if (isSuccess && positionByIdData) {
      form.reset({
        name: positionByIdData.data.name
      })
    }
  }, [isSuccess, positionByIdData, form])

  const { mutate, isPending } = useMutation({
    mutationKey: ['editPositionById'],
    mutationFn: (values: z.infer<typeof formSchema>) => {
      // Return the API call to be executed
      return patchApi(
        `/position/${id}`,
        { ...values },
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
      queryClient.invalidateQueries({ queryKey: ['PotionsRespTable'] })
      form.reset()
      onClose() // Close the dialog after successful mutation
    },
    onError(error: any) { // Specify error type if possible
      toast({
        title: 'لم تتم العملية',
        description: error.message || 'حدث خطأ غير متوقع',
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-1 gap-x-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormControl>
                    <Input 
                      label="اسم الصفة" 
                      placeholder="اسم الصفة" 
                      type="text" 
                      {...field} 
                      disabled={isPending} // Optional: disable input while loading
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-between">
            <AlertDialogCancel className="text-sm h-11 bg-[#fff] md:w-40 mr-2 border-2 border-[#3734a9] text-[#3734a9] hover:bg-[#3734a9] hover:text-[#fff] rounded-[12px] sm:w-28 sm:text-[10px] lg:text-sm">
              إلغاء
            </AlertDialogCancel>
            <Button
              type="submit" // Changed to 'submit'
              className="text-sm h-11 bg-[#3734a9] md:w-40 mr-2 border-2 border-[#3734a9] text-[#fff] hover:bg-[#fff] hover:text-[#3734a9] rounded-[12px] sm:w-28 sm:text-[10px] lg:text-sm"
              disabled={isPending} // Optional: disable button while loading
            >
              {isPending ? 'جارٍ الحفظ...' : 'حفظ'} {/* Optional: show loading state */}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
