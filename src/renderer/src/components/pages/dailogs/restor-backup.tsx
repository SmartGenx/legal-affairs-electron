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
import { useAuthHeader } from 'react-auth-kit'
import { z } from 'zod'
import { useToast } from '@renderer/components/ui/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postApi } from '@renderer/lib/http'
import { Form, FormControl, FormField, FormItem } from '@renderer/components/ui/form'
import FolderDownload from '@renderer/components/icons/folder-download'
import FileUploader from '../decisions/add-decisions/FileUploader'

const formSchema = z.object({
  file: z.instanceof(File).optional()
})
// type BookFormValue = z.infer<typeof formSchema>

export default function RestoreBackupDialog() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const authToken = useAuthHeader()
  // const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })

  const { mutate } = useMutation({
    mutationKey: ['AddRestoreForm'],
    mutationFn: (values: z.infer<typeof formSchema>) => {
      const formData = new FormData()

      if (values.file) {
        formData.append('file', values.file)
      }

      return postApi('/backup/restore', formData, {
        headers: {
          Authorization: `${authToken()}`
        }
      })
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
        <Button className="flex items-center text-xl  w-40 mr-3 h-11 bg-[#fff] text-[#3734a9] border-2 border-[#3734a9] hover:bg-[#2e2b8b] hover:text-[#fff] rounded-[12px] px-4">
          <p className="text-base">استعادة نسخة</p>
          <FolderDownload className="mr-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-[#3734a9] w-full bg-[#ebebf7] p-4 rounded-t-lg">
            استعادة نسخة
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-x-2 mb-7">
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div>
                        <p className="mb-2 text-start text-lg font-medium">اختار الملف</p>
                        <FileUploader
                          setValue={form.setValue}
                          inputId={'file'}
                          isMultiple={false}
                          {...field}
                          onChange={async (files) => {
                            try {
                              if (!files?.[0]) return

                              field.onChange(files[0])
                            } catch (error) {
                              JSON.stringify(error)
                            }
                          }}
                        />
                      </div>
                    </FormControl>
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
