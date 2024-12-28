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
import FileUploader from './FileUploader'
import { Plus } from 'lucide-react'

const formSchema = z.object({
  decisionName: z.string(),
  refrance: z.string(),
  governmentOfficeId: z.string(),
  title: z.string(),
  description: z.string(),
  decisionSource: z.string(),
  nameSource: z.string(),
  decisionDate: z.string().refine(
    (date) => {
      // Parse the input date string (yyyy-mm-dd) and construct a new Date object
      const [year, month, day] = date.split('-').map(Number)
      const inputDate = new Date(year, month - 1, day) // Month is 0-based in JS Date

      const today = new Date()
      today.setHours(0, 0, 0, 0) // Set today's date to midnight to ignore time

      return inputDate <= today // Return true if inputDate is today or before
    },
    {
      message: 'Date must be today or before.'
    }
  ),
  file: z.instanceof(File).optional()
})

export type GovernmentOffice = {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}
type DecisionsFormValue = z.infer<typeof formSchema>
export default function AddDecisionForm() {
  const { toast } = useToast()
  const authToken = useAuthHeader()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [data, setData] = useState<GovernmentOffice[]>([])
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('/government-office', {
        headers: {
          Authorization: `${authToken()}`
        }
      })
      setData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  //
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (value) {
      const inputDate = new Date(value)
      const today = new Date()

      // Reset hours, minutes, seconds, and milliseconds for today
      today.setHours(0, 0, 0, 0)

      // Compare the date components directly
      const inputDateOnly = new Date(inputDate.setHours(0, 0, 0, 0))

      if (inputDateOnly > today) {
        toast({
          title: 'لم تتم العملية',
          description: 'التاريخ يجب أن يكون اليوم أو قبل اليوم.',
          variant: 'destructive'
        })
      }
    }
  }
  //
  useEffect(() => {
    fetchData()
  }, [])
  const form = useForm<DecisionsFormValue>({
    resolver: zodResolver(formSchema)
  })

  const { mutate } = useMutation({
    mutationKey: ['AddDecisions'],
    mutationFn: (datas: DecisionsFormValue) => {
      const formData = new FormData()
      formData.append('decisionName', datas.decisionName) // Corrected this from decisionDate to decisionName
      formData.append('refrance', datas.refrance)
      formData.append('governmentOfficeId', datas.governmentOfficeId)
      formData.append('title', datas.title)
      formData.append('description', datas.description)
      formData.append('decisionSource', datas.decisionSource)
      formData.append('nameSource', datas.nameSource)
      formData.append('decisionDate', new Date(datas.decisionDate).toISOString())

      if (datas.file) {
        formData.append('file', datas.file)
      }

      return postApi('/decision/create_decision', formData, {
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
      queryClient.invalidateQueries({ queryKey: ['Decisions'] })
      navigate('/decisions')
    },
    onError: (error) => {
      toast({
        title: 'لم تتم العملية',
        description: error.message,
        variant: 'destructive'
      })
    }
  })

  const onSubmit = (datas: DecisionsFormValue) => {
    mutate(datas)
  }

  return (
    <div className="min-h-[50vh] w-full mt-5">
      <Form {...form}>
        <form
          id="decisionForm"
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

          <div className="grid min-h-[80px] mb-4  grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                رقم القرار
              </label>
              <FormField
                control={form.control}
                name="refrance"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 px-3 placeholder:pl-0 text-[#595959] placeholder:text-[#595959] placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        placeholder="   رقم القرار "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/*  */}
            <div className=" col-span-1 h-[30px] ">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                تاريخة
              </label>
              <FormField
                control={form.control}
                name="decisionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        {...field}
                        placeholder="تاريخة"
                        type="date"
                        className="h-11 px-1 placeholder:text-base text-[#595959] placeholder:text-[#595959]  rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        onChange={(e) => {
                          field.onChange(e)
                          handleDateChange(e) // Validation is triggered whenever the value changes
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                مصدر التوجيه
              </label>
              <FormField
                control={form.control}
                name="governmentOfficeId"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl className="mt-2 bg-transparent h-11 text-[#757575] text-base border-[3px] border-[#E5E7EB] rounded-xl">
                        <SelectTrigger>
                          <SelectValue placeholder="مصدر التوجيه" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {data.map((options) => (
                          <SelectItem key={options.name} value={String(options.id)}>
                            {options.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid min-h-[80px] mb-4   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-sm text-[#595959]">
                اسم القرار
              </label>
              <FormField
                control={form.control}
                name="decisionName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 px-3 placeholder:text-base text-[#595959] placeholder:text-[#595959]  rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        placeholder="   اسم القرار "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/*  */}
            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                عنوان القرار
              </label>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 px-3 placeholder:text-base text-[#595959] placeholder:text-[#595959] rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        placeholder="   عنوان القرار "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/*  */}
          <div className="grid min-h-[150px] mb-4 grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 min-h-[40px] ">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                نص القرار
              </label>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormControl>
                      <Textarea
                        className="bg-transparent mt-2 placeholder:text-base text-[#595959] placeholder:text-[#595959] rounded-xl border-[3px] border-[#E5E7EB]"
                        rows={5}
                        {...field}
                        placeholder="نص القرار"
                      ></Textarea>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/*  */}
          </div>

          <div className="grid min-h-[80px] mb-4  grid-cols-2 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                إسم صاحب القرار
              </label>
              <FormField
                control={form.control}
                name="nameSource"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 px-3 placeholder:text-base  text-[#595959] placeholder:text-[#595959] rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        placeholder="   إسم صاحب القرار "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/*  */}

            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-sm text-[#757575]">
                جهة القرار
              </label>
              <FormField
                control={form.control}
                name="decisionSource"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 px-3 placeholder:text-base text-[#595959] placeholder:text-[#595959]  rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        placeholder="   جهة القرار   "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                        <p className="mb-2 text-start text-lg font-medium">أرفاق صورة القرار</p>
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
            <Link to={'/decisions'}>
              <Button className="text-sm h-10 md:w-30 lg:w-30  bg-[#fff] border-2 border-[#3734a9] text-[#3734a9] hover:bg-[#3734a9] hover:text-[#fff] hover:border-2 hover:border-white rounded-[12px] sm:w-28 sm:text-[10px]  lg:text-sm">
                إلغاء
              </Button>
            </Link>

            <Button
              className="text-sm h-10 md:w-30 lg:w-30  bg-[#3734a9] border-2 border-[#3734a9] text-[#fff] hover:border-2 hover:border-[#2f2b94] hover:bg-[#fff] hover:text-[#2f2b94] rounded-[12px] sm:w-28 sm:text-[10px]  lg:text-sm"
              type="submit"
            >
              <p className="font-bold text-base">حفظ</p>
              <Plus className="mr-2" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
