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
import { FormControl, FormItem, FormMessage } from '@renderer/components/ui/form'
import { FormInput } from '@renderer/components/ui/form-input'
import { useToast } from '@renderer/components/ui/use-toast'
import { postApi } from '@renderer/lib/http'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useAuthHeader } from 'react-auth-kit'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'

const formSchema = z.object({
  name: z.string().min(1, 'اسم المشتري مطلوب'),
  type: z.string().min(1, 'النوع مطلوب')
})

type BookFormValue = z.infer<typeof formSchema>
const types = [
  { label: 'مشتري', value: 1 },
  { label: 'شركة', value: 2 }
]
export default function AddCustomerDialog() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const authToken = useAuthHeader()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [errors, setErrors] = useState<{ name?: string; type?: string }>({})

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
      queryClient.invalidateQueries({ queryKey: ['customerData'] })
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

  const handleSaveClick = () => {
    // Validate using zod schema
    const result = formSchema.safeParse({ name, type })

    if (!result.success) {
      // Extract errors
      const errorDetails = result.error.formErrors.fieldErrors
      setErrors({
        name: errorDetails.name?.[0],
        type: errorDetails.type?.[0]
      })
      return
    }

    // If validation passes, clear errors and proceed with mutation
    setErrors({})
    mutate({ name, type })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          type="button" // Button should not be treated as a form submit button
          className="text-sm h-10 bg-[#3734a9] border-2 border-[#3734a9] text-[#fff] hover:border-2 hover:border-[#2f2b94] hover:bg-[#fff] hover:text-[#2f2b94] rounded-[12px] sm:w-28 sm:text-[10px] lg:w-40 lg:text-sm"
        >
          إضافة مشتري
          <Plus className="mr-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-[#3734a9] w-full bg-[#ebebf7] p-4 rounded-t-lg">
            إضافة مشتري
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 p-4 text-right">
          <div className="col-span-1 h-auto">
            <FormItem>
              <FormControl>
                <FormInput
                  className="h-11 p-0 placeholder:text-base rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                  placeholder="اسم المشتري"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              {errors.name && <FormMessage>{errors.name}</FormMessage>}
            </FormItem>
          </div>

          <div className="col-span-1 h-auto mt-8">
            <FormItem>
              <FormControl>
                <Select onValueChange={(value) => setType(value)}>
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
              {errors.type && <FormMessage>{errors.type}</FormMessage>}
            </FormItem>
          </div>
          <div className="col-span-1 mt-7">
            <DialogFooter className="flex gap-2">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  type="button" // Explicitly set type as button to avoid unintended submit
                  className="text-sm h-10 md:w-30 lg:w-30 bg-[#fff] border-2 border-[#3734a9] text-[#3734a9] hover:bg-[#3734a9] hover:text-[#fff] hover:border-2 hover:border-white rounded-[12px] sm:w-28 sm:text-[10px] lg:text-sm"
                >
                  إلغاء
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={handleSaveClick}
                className="text-sm h-10 md:w-30 lg:w-30 bg-[#3734a9] border-2 border-[#3734a9] text-[#fff] hover:border-2 hover:border-[#2f2b94] hover:bg-[#fff] hover:text-[#2f2b94] rounded-[12px] sm:w-28 sm:text-[10px] lg:text-sm"
              >
                <p className="font-bold text-base">حفظ</p>
                <Plus className="mr-2" />
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
