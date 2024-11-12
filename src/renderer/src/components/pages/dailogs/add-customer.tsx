import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@renderer/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@renderer/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@renderer/components/ui/form'
import { FormInput } from '@renderer/components/ui/form-input'
import { useToast } from '@renderer/components/ui/use-toast'
import { postApi } from '@renderer/lib/http'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useAuthHeader } from 'react-auth-kit'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

const formSchema = z.object({
  name: z.string(),
  type: z.string()
})

type BookFormValue = z.infer<typeof formSchema>

export default function AddCustomerDialog() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const authToken = useAuthHeader()
  const navigate = useNavigate()
  const form = useForm<BookFormValue>({
    resolver: zodResolver(formSchema)
  })

  const { mutate } = useMutation({
    mutationKey: ['AddCustomer'],
    mutationFn: (datas: BookFormValue) =>
      postApi(
        '/customer',
        {
          name: datas.name,
          type: +datas.type
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
      queryClient.invalidateQueries({ queryKey: ['OrderBook'] })
      navigate('/official-journal/order-book')
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
    // mutate(datas)
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-sm h-10    bg-[#3734a9] border-2 border-[#3734a9] text-[#fff] hover:border-2 hover:border-[#2f2b94] hover:bg-[#fff] hover:text-[#2f2b94] rounded-[12px] sm:w-28 sm:text-[10px] lg:w-40 lg:text-sm"
        >
          إضافة مشتري
          <Plus className="mr-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-[#3734a9] bg-[#ebebf7] p-4 rounded-t-lg">
            إضافة مشتري
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="" id="AddCustomerForm">
            <div className="grid grid-cols-1 p-4  text-right">
              <div className="col-span-1 h-auto">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormInput
                          className="h-10 py-5 px-0  rounded-xl text-sm"
                          placeholder=" اسم المشتري"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-1 h-auto mt-8">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormInput
                          className="h-10 py-5 px-0  rounded-xl text-sm"
                          placeholder=" النوع"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-1">
                <div className="border-b-1 mb-5 mt-5 border border-gray-300"></div>

                <DialogFooter className="flex gap-2">
                  <DialogClose asChild>
                    <Button size={'lg'} variant="outline">
                      إلغاء
                    </Button>
                  </DialogClose>
                  <Button form="AddCustomerForm" type="submit" size={'lg'}>
                    حفظ
                  </Button>
                </DialogFooter>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
