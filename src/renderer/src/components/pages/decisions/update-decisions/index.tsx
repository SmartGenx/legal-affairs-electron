import { useParams } from 'react-router-dom'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../../ui/form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAuthHeader } from 'react-auth-kit'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@renderer/components/ui/button'
import { FormInput } from '@renderer/components/ui/form-input'
import { axiosInstance, patchApi } from '@renderer/lib/http'
import { useToast } from '@renderer/components/ui/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select'
import { Textarea } from '@renderer/components/ui/textarea'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import FileUploader from './../add-decisions/FileUploader'
import { ArrowRight } from 'lucide-react'

export type Complain = {
  id: number
  decisionName: string
  refrance: string
  governmentOfficeId: number
  title: string
  description: string
  decisionSource: string
  nameSource: string
  isDeleted: boolean
  attachmentPath: string
  createdAt: Date
  updatedAt: Date
  decisionDate: Date
}
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
export default function UpdateDecisions() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const authToken = useAuthHeader()
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

  const fetchDecisionData = async () => {
    const response = await axiosInstance.get<Complain>(`/decision/${id}`, {
      headers: {
        Authorization: `${authToken()}`
      }
    })
    return response.data
  }
  const {
    data: DecisionData,
    error: _DecisionError,
    isLoading: _DecisionIsLoading
  } = useQuery({
    queryKey: ['Decisions', id],
    queryFn: fetchDecisionData,
    enabled: !!id
  })

  useEffect(() => {
    if (DecisionData && formSchema) {
      form.reset({
        decisionName: DecisionData.decisionName,
        refrance: DecisionData.refrance,
        governmentOfficeId: String(DecisionData.governmentOfficeId),
        title: DecisionData.title,
        description: DecisionData.description,
        decisionSource: DecisionData.decisionSource,
        nameSource: DecisionData.nameSource,
        decisionDate: new Date(DecisionData.decisionDate).toISOString().split('T')[0]
      })
    }

    fetchData()
  }, [DecisionData])

  const form = useForm<DecisionsFormValue>({
    resolver: zodResolver(formSchema)
  })
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
  const { mutate } = useMutation({
    mutationKey: ['UpdateDecisions'],
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

      return patchApi(`/decision/${id}`, formData, {
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
    <>
      <div className="flex items-center text-3xl">
        <Link to={'/decisions'}>
          <button className="w-12 flex justify-center items-center h-12 bg-transparent text-[#3734a9] hover:bg-[#3734a9] hover:text-white rounded-2xl border-2 border-[#3734a9] hover:border-2 hover:border-[#fff]">
            <ArrowRight size={20} />
          </button>
        </Link>
        <h1 className="mr-2 text-[#3734a9] font-bold">{DecisionData?.refrance}</h1>
      </div>

      <div className="min-h-[50vh] w-full mt-5">
        <Form {...form}>
          <form
            id="decisionForm"
            //   key={key}

            onSubmit={form.handleSubmit(onSubmit)}
            className=""
          >
            
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
                          className="h-11 text-[#595959] placeholder:text-[#595959] px-3 placeholder:px-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
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
                          className="h-11 px-1 text-[#595959] placeholder:text-[#595959] placeholder:text-base  rounded-xl border-[3px] border-[#E5E7EB] text-sm"
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
                      <Select
                        onValueChange={field.onChange}
                        value={
                          field.value
                            ? String(field.value)
                            : String(DecisionData?.governmentOfficeId)
                        }
                        defaultValue={String(field.value)}
                      >
                        <FormControl className="mt-2 text-[#595959] placeholder:text-[#595959] bg-transparent h-11 text-[#757575] text-base border-[3px] border-[#E5E7EB] rounded-xl">
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
                <label htmlFor="" className="font-bold text-sm text-[#757575]">
                  اسم القرار
                </label>
                <FormField
                  control={form.control}
                  name="decisionName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormInput
                          className="h-11 px-3 text-[#595959] placeholder:text-[#595959] placeholder:px-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
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
                          className="h-11 px-3 text-[#595959] placeholder:text-[#595959] placeholder:px-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
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
                          className="bg-transparent text-[#595959] placeholder:text-[#595959] mt-2 placeholder:text-base rounded-xl border-[3px] border-[#E5E7EB]"
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
                          className="h-11 px-3 text-[#595959] placeholder:text-[#595959] placeholder:px-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
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
                          className="h-11 px-3 text-[#595959] placeholder:text-[#595959] placeholder:px-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
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
                <p className="font-bold text-base">تعديل</p>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}
