import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../../ui/form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAuthHeader } from 'react-auth-kit'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@renderer/components/ui/button'
import { FormInput } from '@renderer/components/ui/form-input'
import { axiosInstance, postApi } from '@renderer/lib/http'
import { useToast } from '@renderer/components/ui/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select'
import { Textarea } from '@renderer/components/ui/textarea'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import FileUploader from '../../decisions/add-decisions/FileUploader'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const formSchema = z.object({
  title: z.string(),
  refrance: z.string(),
  description: z.string(),
  file: z.instanceof(File).optional()
})

type BookFormValue = z.infer<typeof formSchema>

export default function AddGeneralizationForm() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const authToken = useAuthHeader()
  const navigate = useNavigate()

  const form = useForm<BookFormValue>({
    resolver: zodResolver(formSchema)
  })
  const { mutate } = useMutation({
    mutationKey: ['AddGeneralization'],
    mutationFn: (datas: BookFormValue) => {
      const formData = new FormData()
      formData.append('title', datas.title) // Corrected this from decisionDate to decisionName
      formData.append('refrance', datas.refrance)
      formData.append('description', datas.description)

      if (datas.file) {
        formData.append('file', datas.file) // Add the file to formData
      }
      return postApi(`/generalization/create_generalization`, formData, {
        headers: {
          Authorization: `${authToken()}`,
          'Content-Type': 'multipart/form-data'
        }
      })
    },
    onSuccess: () => {
      toast({
        title: 'اشعار',
        variant: 'success',
        description: 'تمت الاضافة بنجاح'
      })
      queryClient.invalidateQueries({ queryKey: ['generalization'] })
      navigate('/generalization')
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
    mutate(datas)
  }
  return (
    <div className="min-h-[50vh] w-full mt-5">
      <Form {...form}>
        <form
          id="complainsForm"
          //   key={key}
          onSubmit={form.handleSubmit(onSubmit)}
          className=""
        >
          {process.env.NODE_ENV === 'development' && (
            <>
              <p>Ignore it, it just in dev mode</p>
              <div>{JSON.stringify(form.formState.errors)}</div>
            </>
          )}
          <div className="mb-4 bg-[#dedef8] rounded-t-lg">
            <h3 className="font-bold text-[#3734a9] p-3">المعلومات الأساسية</h3>
          </div>

          <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <FormField
                control={form.control}
                name="refrance"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-10 p-0  rounded-xl text-sm"
                        placeholder="  رقم التعميم "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className=" col-span-1 h-[50px] ">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-10 p-0  rounded-xl text-sm"
                        placeholder="   موضوع التعميم "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/*  */}
          </div>
          <div className="grid h-[150px]  grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[40px] ">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormControl>
                      <Textarea
                        className="bg-transparent border-2 border-[#d1d5db] rounded-xl"
                        rows={5}
                        {...field}
                        placeholder="تفاصيل التعميم"
                      ></Textarea>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/*  */}
          </div>

          <div className="mb-4 bg-[#dedef8] rounded-t-lg">
            <h3 className="font-bold text-[#3734a9] p-3">المرفقات</h3>
          </div>

          <div className="grid h-[150px]  grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[40px] ">
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div>
                        <p className="mb-2 text-start text-lg font-medium">أرفاق صورة التعميم</p>
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
            {/*  */}
          </div>
          <div className="w-full flex justify-end gap-2 mb-4">
            <Link to={'/state-affairs'}>
              <Button className="text-sm h-10  bg-[#fff] border-2 border-[#3734a9] text-[#3734a9] hover:bg-[#3734a9] hover:text-[#fff] hover:border-2 hover:border-white rounded-[12px] sm:w-28 sm:text-[10px] lg:w-40 lg:text-sm">
                إلغاء
              </Button>
            </Link>

            <Button
              className="text-sm h-10  bg-[#3734a9] border-2 border-[#3734a9] text-[#fff] hover:border-2 hover:border-[#2f2b94] hover:bg-[#fff] hover:text-[#2f2b94] rounded-[12px] sm:w-28 sm:text-[10px] lg:w-40 lg:text-sm"
              type="submit"
            >
              حفظ
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}