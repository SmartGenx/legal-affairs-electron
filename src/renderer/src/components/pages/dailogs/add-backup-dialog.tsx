import { Button } from '@renderer/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose // Updated import
} from '@renderer/components/ui/dialog' // Ensure DialogClose is imported from the same Dialog set
import { Plus } from 'lucide-react'
import { useAuthHeader } from 'react-auth-kit'
import { z } from 'zod'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@renderer/components/ui/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postApi } from '@renderer/lib/http'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { FormInput } from '@renderer/components/ui/form-input'

const formSchema = z.object({
  backupName: z.string().min(1, 'اسم النسخة')
})
type BookFormValue = z.infer<typeof formSchema>

export default function AddBackupDialog() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const authToken = useAuthHeader()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })

  const { mutate } = useMutation({
    mutationKey: ['AddBackUpForm'],
    mutationFn: (values: z.infer<typeof formSchema>) => {
      // Return the API call to be executed
      return postApi(
        `/backup`,
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
      queryClient.invalidateQueries({ queryKey: ['BackupsTable'] })
    },
    onError(error: any) {
      // Added type for error
      toast({
        title: 'لم تتم العملية',
        description: error.message,
        variant: 'destructive'
      })
    }
  })

  // Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center text-xl w-40 mr-3 h-11 bg-[#3734a9] hover:border-2 hover:border-[#3734a9] hover:bg-[#fff] hover:text-[#2e2b8b] rounded-[12px] px-4">
          <p className="text-base">إنشاء نسخة</p>
          <Plus className="text-md mr-2" size={22} />
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-[#3734a9] w-full bg-[#ebebf7] p-4 rounded-t-lg">
            إنشاء نسخة
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-x-2 mb-7">
              <FormField
                control={form.control}
                name="backupName"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormControl>
                      <FormInput label="اسم نسخة" placeholder="اسم نسخة" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end ">
              <DialogClose className="text-sm h-11 bg-[#fff] md:w-20 mr-2 border-2 border-[#3734a9] text-[#3734a9] hover:bg-[#3734a9] hover:text-[#fff] rounded-[12px] sm:w-28 sm:text-[10px] lg:text-sm">
                إلغاء
              </DialogClose>
              <Button
                type="submit" // Changed to submit type
                className="text-sm h-11 bg-[#3734a9] md:w-20 mr-2 border-2 border-[#3734a9] text-[#fff] hover:bg-[#fff] hover:text-[#3734a9] rounded-[12px] sm:w-28 sm:text-[10px] lg:text-sm"
              >
                حفظ
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
