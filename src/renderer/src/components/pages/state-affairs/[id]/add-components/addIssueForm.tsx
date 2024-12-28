import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../../ui/form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { axiosInstance, postApi } from '../../../../../lib/http'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '../../../../ui/use-toast'
import { useAuthHeader } from 'react-auth-kit'
import { FormInput } from '@renderer/components/ui/form-input'
import { kind_of_case, Level } from '@renderer/types/enum'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../ui/select'
import {
  NewSelect,
  NewSelectContent,
  NewSelectItem,
  NewSelectTrigger,
  NewSelectValue
} from '../../../../ui/new-select'
import { Textarea } from '@renderer/components/ui/textarea'
import { Button } from '@renderer/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { InfoIssue } from '@renderer/types'
import { Plus } from 'lucide-react'
// import { IssuesResponse } from '@renderer/types'

export type Tribunal = {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}
export type GovernmentOffice = {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}
export type PositionsProp = {
  id: number
  name: string
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
  Issue: InfoIssue[]
}

const formSchema = z.object({
  name: z.string(),
  postionId: z.string(),
  governmentOfficeId: z.string(),
  title: z.string(),
  type: z.number(),
  invitationType: z.string(),
  state: z.boolean(),
  tribunalId: z.string(),
  level: z.string(),
  detailsDate: z.string().refine(
    (date) => {
      // Parse the input date string (yyyy-mm-dd) and construct a new Date object
      const [year, month, day] = date.split('-').map(Number);
      const inputDate = new Date(year, month - 1, day); // Month is 0-based in JS Date

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set today's date to midnight to ignore time

      return inputDate <= today; // Return true if inputDate is today or before
    },
    {
      message: 'Date must be today or before.',
    }
  ),
  judgment: z.string(),
  refrance: z.string(),
  Resumed: z.boolean().optional()
})
const type1 = [
  {
    label: 'جاني',
    value: 1
  },
  {
    label: 'مجني عليه',
    value: 2
  }
]
const type2 = [
  {
    label: 'مدعي',
    value: 1
  },
  {
    label: 'مدعي عليه',
    value: 2
  }
]

const kindOfCase = [
  { label: 'جنائية', value: kind_of_case.criminal },
  { label: 'مدنية', value: kind_of_case.civilian },
  { label: 'تجارية', value: kind_of_case.business },
  { label: 'إدارية', value: kind_of_case.administrative }
] as const

const Resumed = [
  { label: 'مستأنف عليه', value: false },
  { label: 'مستأنف', value: true }
] as const

const contested = [
  { label: 'طاعن عليه', value: false },
  { label: 'مطعون', value: true }
] as const

const CompletionOfTheCase = [
  { label: 'نعم', value: true },
  { label: 'لا', value: false }
] as const

const DegreeOfLitigationOptions = [
  { label: 'إستئناف', value: Level.appeal },
  { label: 'ابتدائي', value: Level.elementary },
  { label: 'عليا', value: Level.high }
] as const

type IssuesFormValue = z.infer<typeof formSchema>
export default function AddIssueForm() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const authToken = useAuthHeader()
  const navigate = useNavigate()

  const [data, setData] = useState<Tribunal[]>([])
  const [dataGovernment, setGovernmentData] = useState<GovernmentOffice[]>([])
  const [dataPosition, setPositionData] = useState<PositionsProp[]>([])
  const [selectedValue, setSelectedValue] = useState<kind_of_case | null>(null)
  const [selectedResumedValue, setSelectedResumedValue] = useState<boolean | null>(null)
  const [selectedStateValue, setSelectedStatedValue] = useState<boolean | null>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('/tribunal', {
        headers: {
          Authorization: `${authToken()}`
        }
      })
      setData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const fetchPositionData = async () => {
    try {
      const response = await axiosInstance.get('/position', {
        headers: {
          Authorization: `${authToken()}`
        }
      })
      setPositionData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const fetchGovernmentData = async () => {
    try {
      const response = await axiosInstance.get('/government-office', {
        headers: {
          Authorization: `${authToken()}`
        }
      })
      setGovernmentData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

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

  useEffect(() => {
    fetchData()
    fetchPositionData()
    fetchGovernmentData()
  }, [selectedOption])

  const form = useForm<IssuesFormValue>({
    resolver: zodResolver(formSchema)
  })

  const {
    mutate: firstMutate,
    isError: _firstIsError,
    isSuccess: _firstIsSuccess,
    isPending: _firstIsPending
  } = useMutation({
    mutationKey: ['issue'],
    mutationFn: (datas: IssuesFormValue) =>
      postApi(
        '/issue',
        {
          name: datas.name,
          postionId: +datas.postionId,
          governmentOfficeId: +datas.governmentOfficeId,
          title: datas.title,
          type: datas.type,
          invitationType: +datas.invitationType,
          state: datas.state
        },
        {
          headers: {
            Authorization: `${authToken()}`
          }
        }
      ),
    onSuccess: (data, variables) => {
      console.log('Response data:', data)

      // Trigger the second mutation using the ID from the first mutation's response
      secondMutate({
        //@ts-ignore
        issueId: data.data.id,
        level: variables.level,
        tribunalId: variables.tribunalId,
        detailsDate: variables.detailsDate,
        judgment: variables.judgment,
        refrance: variables.refrance,
        Resumed: variables.Resumed
      })
    },
    onError: (error) => {
      toast({
        title: 'لم تتم العملية',
        description: error.message,
        variant: 'destructive'
      })
    }
  })

  const {
    mutate: secondMutate,
    isError: _secondIsError,
    isSuccess: _secondIsSuccess,
    isPending: _secondIsPending
  } = useMutation({
    mutationKey: ['judgment'],
    mutationFn: (datas: {
      issueId: number
      level: string
      tribunalId: string
      detailsDate: string
      judgment: string
      refrance: string
      Resumed?: boolean
    }) =>
      postApi(
        '/issue-details',
        {
          issueId: datas.issueId, // Use the issueId passed from the first mutation's response
          tribunalId: +datas.tribunalId,
          level: +datas.level,
          detailsDate: new Date(datas.detailsDate),
          judgment: datas.judgment,
          refrance: datas.refrance,
          Resumed: datas.Resumed
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
      queryClient.invalidateQueries({ queryKey: ['Issues'] })
      queryClient.invalidateQueries({ queryKey: ['statisticsSDashboard'] })
      navigate('/state-affairs')
    },
    onError: (error) => {
      toast({
        title: 'لم تتم العملية',
        description: error.message,
        variant: 'destructive'
      })
    }
  })

  const onSubmit = (datas: IssuesFormValue) => {
    firstMutate(datas)
  }

  return (
    <div className="min-h-[50vh] w-full mt-5">
      <Form {...form}>
        <form
          id="governoratesForm"
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
            <h3 className="font-bold text-[#3734a9] p-3">بيانات المختص القانوني</h3>
          </div>

          <div className="grid h-[80px] mb-5  grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className=" col-span-1 h-[50px] ">
              <label htmlFor="" className="font-bold text-sm text-[#595959]">
                الإسم
              </label>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormInput
                        className="h-11 px-3 placeholder:px-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                        placeholder="   الإسم "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/*  */}

            <div className="col-span-1 ">
              <label htmlFor="" className="font-bold text-sm text-[#595959]">
                الصفة
              </label>
              <FormField
                control={form.control}
                name="postionId"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl className="bg-transparent h-11 mt-2 text-[#595959] text-base border-[3px] border-[#E5E7EB] rounded-xl">
                        <SelectTrigger>
                          <SelectValue placeholder="الصفة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dataPosition.map((position) => (
                          <SelectItem key={position.id} value={String(position.id)}>
                            {position.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/*  */}

            <div className="col-span-1 ">
              <label htmlFor="" className="font-bold text-sm text-[#595959]">
                المرفق الحكومي
              </label>
              <FormField
                control={form.control}
                name="governmentOfficeId"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl className="bg-transparent mt-2 h-11 text-[#595959] text-base border-[3px] border-[#E5E7EB] rounded-xl">
                        <SelectTrigger>
                          <SelectValue placeholder="المرفق الحكومي" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dataGovernment.map((directorate) => (
                          <SelectItem key={directorate.name} value={String(directorate.id)}>
                            {directorate.name}
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

          {/*  */}
          <div className="mb-4 bg-[#dedef8] rounded-t-lg">
            <h3 className="font-bold text-[#3734a9] p-3">نوع القضية</h3>
          </div>
          <div className="grid min-h-[100px]  grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right mt-4 ">
            <div className="col-span-2 min-h-[50px] ">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="col-span-2 flex ">
                    {kindOfCase.map((caseType) => (
                      <div key={caseType.value} className="flex items-center ">
                        <FormControl>
                          <div className="relative top-5">
                            <input
                              type="checkbox"
                              value={caseType.value}
                              checked={selectedValue === caseType.value}
                              onChange={() => {
                                const newValue =
                                  selectedValue === caseType.value ? null : caseType.value
                                setSelectedValue(newValue)
                                field.onChange(newValue)
                              }}
                              className="appearance-none w-6 h-6 border-[3px] border-[#595959]  rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none"
                            />
                            <svg
                              className={`w-4 h-4 text-white absolute top-1 left-1 pointer-events-none  ${
                                selectedValue === caseType.value ? 'block' : 'hidden'
                              }`}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </FormControl>
                        <FormLabel className="font-normal ml-20 text-[#595959] mr-2 relative top-4">
                          {caseType.label}
                        </FormLabel>
                      </div>
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/*  */}

            <div className=" col-span-1 h-auto -translate-y-2">
              <label htmlFor="" className="font-bold text-sm text-[#595959]">
                اختار نوع الدعوة
              </label>
              {selectedValue === kind_of_case.civilian ? (
                <FormField
                  control={form.control}
                  name="invitationType"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl className="bg-transparent h-11 mt-2 text-[#595959] text-base border-[3px] border-[#E5E7EB] rounded-xl">
                          <SelectTrigger>
                            <SelectValue placeholder="اختار واحد" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {type2.map((type) => (
                            <SelectItem key={type.value} value={String(type.value)}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : selectedValue === kind_of_case.business ? (
                <FormField
                  control={form.control}
                  name="invitationType"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl className="bg-transparent h-11 mt-2 text-[#595959] text-base border-[3px] border-[#E5E7EB] rounded-xl">
                          <SelectTrigger>
                            <SelectValue placeholder="اختار واحد" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {type2.map((type) => (
                            <SelectItem key={type.value} value={String(type.value)}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : selectedValue === kind_of_case.criminal ? (
                <FormField
                  control={form.control}
                  name="invitationType"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl className="bg-transparent h-11 mt-2 text-[#595959] text-base border-[3px] border-[#E5E7EB] rounded-xl">
                          <SelectTrigger>
                            <SelectValue placeholder="اختار واحد" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {type1.map((type) => (
                            <SelectItem key={type.value} value={String(type.value)}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : selectedValue === kind_of_case.administrative ? (
                <FormField
                  control={form.control}
                  name="invitationType"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl className="bg-transparent h-11 mt-2 text-[#595959] text-base border-[3px] border-[#E5E7EB] rounded-xl">
                          <SelectTrigger>
                            <SelectValue placeholder="اختار واحد" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {type2.map((type) => (
                            <SelectItem key={type.value} value={String(type.value)}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="invitationType"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl className="bg-transparent h-11 mt-2 text-[#595959] text-base border-[3px] border-[#E5E7EB] rounded-xl">
                            <SelectTrigger>
                              <SelectValue placeholder="اختار واحد" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {type2.map((type) => (
                              <SelectItem key={type.value} value={String(type.value)}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>
            {/*  */}
          </div>
          {/*  */}

          <div className="mb-4 bg-[#dedef8] rounded-t-lg grid   grid-cols-3">
            <div className="col-span-2">
              <h3 className="font-bold text-[#3734a9] p-3">درجة التقاضي</h3>
            </div>
            <div className="col-span-1 p-2 ">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <NewSelect
                      onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedOption(parseInt(value, 10))
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full  h-[50px] rounded-xl bg-transparent text-[#595959] text-base border-[3px] border-[#a6a3ee]/[.40] ">
                        <NewSelectTrigger>
                          <NewSelectValue placeholder="اختار درجة التقاضي" />
                        </NewSelectTrigger>
                      </FormControl>
                      <NewSelectContent>
                        {DegreeOfLitigationOptions.map((options) => (
                          <NewSelectItem key={options.value} value={String(options.value)}>
                            {options.label}
                          </NewSelectItem>
                        ))}
                      </NewSelectContent>
                    </NewSelect>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {selectedOption === 1 ? (
            <>
              <div className="grid h-[80px] mb-1 grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right ">
                <div className="col-span-1 ">
                  <label htmlFor="" className="font-bold text-sm text-[#595959]">
                    المحكمة
                  </label>
                  <FormField
                    control={form.control}
                    name="tribunalId"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl className="bg-transparent mt-2 h-11 text-[#595959] text-base border-[3px] border-[#E5E7EB] rounded-xl">
                            <SelectTrigger>
                              <SelectValue placeholder="المحكمة" />
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
              <div className="grid h-[85px] mb-5 grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
                <div className=" col-span-1 h-[50px] ">
                  <label htmlFor="" className="font-bold text-sm text-[#595959]">
                    عنوان القضية
                  </label>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FormInput
                            className="h-11 px-3 placeholder:px-0 placeholder:text-[#595959] text-[#595959] placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                            placeholder="عنوان القضية"
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
              <div className="grid min-h-[160px] mb-5  grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
                <label htmlFor="" className="font-bold text-sm text-[#595959]">
                  نص الحكم
                </label>
                <div className=" col-span-1 min-h-[40px] ">
                  <FormField
                    control={form.control}
                    name="judgment"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormControl>
                          <Textarea
                            className="bg-transparent placeholder:text-base placeholder:text-[#595959] rounded-xl border-[3px] border-[#E5E7EB]"
                            rows={5}
                            {...field}
                            placeholder="نص الحكم"
                          ></Textarea>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/*  */}
              </div>

              <div className="grid min-h-[95px] mb-5 grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
                {/*  */}

                <div className=" col-span-1 h-auto">
                  <label htmlFor="" className="font-bold text-sm text-[#595959]">
                    تاريخة
                  </label>
                  <FormField
                    control={form.control}
                    name="detailsDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FormInput
                            {...field}
                            placeholder="تاريخة"
                            type="date"
                            className="h-11 px-1 placeholder:text-base  text-[#595959] rounded-xl border-[3px] border-[#E5E7EB] text-sm"
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

                <div className=" col-span-1 h-[40px] ">
                  <label htmlFor="" className="font-bold text-sm text-[#595959]">
                    رقم الحكم
                  </label>
                  <FormField
                    control={form.control}
                    name="refrance"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FormInput
                            className="h-11 p-0 placeholder:text-base placeholder:text-[#595959]  rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                            placeholder="   رقم الحكم "
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-1 h-[50px] translate-y-9">
                  <FormField
                    control={form.control}
                    name="Resumed"
                    render={({ field }) => (
                      <FormItem className="col-span-2 flex">
                        {Resumed.map((caseType) => (
                          <div key={caseType.label} className="flex items-center ">
                            <FormControl>
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={selectedResumedValue === caseType.value}
                                  onChange={() => {
                                    const newValue =
                                      selectedResumedValue === caseType.value
                                        ? null
                                        : caseType.value
                                    setSelectedResumedValue(newValue)
                                    field.onChange(newValue)
                                  }}
                                  className="appearance-none w-6 h-6 border-[3px] border-gray-300 rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none"
                                />
                                <svg
                                  className={`w-4 h-4 text-white absolute top-1 left-1 pointer-events-none ${
                                    selectedResumedValue === caseType.value ? 'block' : 'hidden'
                                  }`}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </FormControl>
                            <FormLabel className="font-normal ml-20 mr-2 text-[#595959] relative -top-1">
                              {caseType.label}
                            </FormLabel>
                          </div>
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/*  */}
                {/*  */}
              </div>
            </>
          ) : selectedOption === 2 ? (
            <>
              <div className="grid h-[80px] mb-1 grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right ">
                <div className="col-span-1 ">
                  <label htmlFor="" className="font-bold text-sm text-[#595959]">
                    المحكمة
                  </label>
                  <FormField
                    control={form.control}
                    name="tribunalId"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl className="bg-transparent mt-2 h-11 text-[#595959] text-base border-[3px] border-[#E5E7EB] rounded-xl">
                            <SelectTrigger>
                              <SelectValue placeholder="المحكمة" />
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
              <div className="grid h-[85px] mb-5 grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
                <div className=" col-span-1 h-[50px] ">
                  <label htmlFor="" className="font-bold text-sm text-[#595959]">
                    عنوان القضية
                  </label>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FormInput
                            className="h-11 px-2 placeholder:text-base text-[#595959] placeholder:text-[#595959] mt-2  rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                            placeholder="عنوان القضية"
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
              <div className="grid min-h-[160px] mb-5  grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
                <div className=" col-span-1 h-[40px] ">
                  <label htmlFor="" className="font-bold text-sm text-[#595959]">
                    نص الحكم
                  </label>
                  <FormField
                    control={form.control}
                    name="judgment"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormControl>
                          <Textarea
                            className="bg-transparent mt-2 text-[#595959] placeholder:text-[#595959] placeholder:text-base rounded-xl border-[3px] border-[#E5E7EB]"
                            rows={5}
                            {...field}
                            placeholder="نص الحكم"
                          ></Textarea>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/*  */}
              </div>

              <div className="grid min-h-[85px] mb-5 grid-cols-2 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
                {/*  */}

                <div className=" col-span-1 h-auto">
                  <label htmlFor="" className="font-bold text-sm text-[#595959]">
                    تاريخة
                  </label>
                  <FormField
                    control={form.control}
                    name="detailsDate"
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

                <div className=" col-span-1 h-[40px] ">
                  <label htmlFor="" className="font-bold text-sm text-[#595959]">
                    رقم الحكم
                  </label>
                  <FormField
                    control={form.control}
                    name="refrance"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FormInput
                            className="h-11 px-3 placeholder:px-0 text-[#595959] placeholder:text-[#595959] placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                            placeholder="   رقم الحكم "
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </>
          ) : selectedOption === 3 ? (
            <>
              <div className="grid h-[80px] mb-1 grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right ">
                <div className="col-span-1 ">
                  <label htmlFor="" className="font-bold text-sm text-[#595959]">
                    المحكمة
                  </label>
                  <FormField
                    control={form.control}
                    name="tribunalId"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl className="bg-transparent mt-2 h-11 text-[#595959] text-base border-[3px] border-[#E5E7EB] rounded-xl">
                            <SelectTrigger>
                              <SelectValue placeholder="المحكمة" />
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
              <div className="grid h-[85px] mb-5 grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
                <div className=" col-span-1 h-[50px] ">
                  <label htmlFor="" className="font-bold text-sm text-[#595959]">
                    عنوان القضية
                  </label>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FormInput
                            className="h-11 px-2 mt-2 text-[#595959] placeholder:text-[#595959] placeholder:text-base  rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                            placeholder="عنوان القضية"
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
              <div className="grid min-h-[160px] mb-5  grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
                <label htmlFor="" className="font-bold text-sm text-[#595959]">
                  نص الحكم
                </label>
                <div className=" col-span-1 min-h-[40px] ">
                  <FormField
                    control={form.control}
                    name="judgment"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormControl>
                          <Textarea
                            className="bg-transparent placeholder:text-[#595959] text-[#595959] placeholder:text-base rounded-xl border-[3px] border-[#E5E7EB]"
                            rows={5}
                            {...field}
                            placeholder="نص الحكم"
                          ></Textarea>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/*  */}
              </div>

              <div className="grid min-h-[95px] mb-5 grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
                {/*  */}

                <div className=" col-span-1 h-auto">
                  <label htmlFor="" className="font-bold text-sm text-[#595959]">
                    تاريخة
                  </label>
                  <FormField
                    name="detailsDate"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FormInput
                            {...field}
                            placeholder="تاريخه"
                            type="date"
                            className="h-11 px-1 placeholder:text-[#595959] text-[#595959] placeholder:text-base  rounded-xl border-[3px] border-[#E5E7EB] text-sm"
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

                <div className=" col-span-1 h-[40px] ">
                  <label htmlFor="" className="font-bold text-sm text-[#595959]">
                    رقم الحكم
                  </label>
                  <FormField
                    control={form.control}
                    name="refrance"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FormInput
                            className="h-11 px-3 placeholder:px-0 placeholder:text-[#595959] text-[#595959] placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                            placeholder="   رقم الحكم "
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-1 h-[50px] translate-y-9">
                  <FormField
                    control={form.control}
                    name="Resumed"
                    render={({ field }) => (
                      <FormItem className="col-span-2 flex">
                        {contested.map((caseType) => (
                          <div key={caseType.label} className="flex items-center ">
                            <FormControl>
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={selectedResumedValue === caseType.value}
                                  onChange={() => {
                                    const newValue =
                                      selectedResumedValue === caseType.value
                                        ? null
                                        : caseType.value
                                    setSelectedResumedValue(newValue)
                                    field.onChange(newValue)
                                  }}
                                  className="appearance-none w-6 h-6 border-[3px] border-gray-300 rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none"
                                />
                                <svg
                                  className={`w-4 h-4 text-white absolute top-1 left-1 pointer-events-none ${
                                    selectedResumedValue === caseType.value ? 'block' : 'hidden'
                                  }`}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </FormControl>
                            <FormLabel className="font-normal text-[#595959] ml-20 mr-2 relative -top-1">
                              {caseType.label}
                            </FormLabel>
                          </div>
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/*  */}
                {/*  */}
              </div>
            </>
          ) : (
            <></>
          )}

          <div className="mb-4 bg-[#dedef8] rounded-t-lg">
            <h3 className="font-bold text-[#3734a9] p-3">هل تم إنجاز القضية</h3>
          </div>
          <div className="grid h-[60px]  grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
            <div className="col-span-1 h-[50px]">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="col-span-2 flex">
                    {CompletionOfTheCase.map((caseType) => (
                      <div key={caseType.label} className="flex items-center ">
                        <FormControl>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={selectedStateValue === caseType.value}
                              onChange={() => {
                                const newValue =
                                  selectedStateValue === caseType.value ? null : caseType.value
                                setSelectedStatedValue(newValue)
                                field.onChange(newValue)
                              }}
                              className="appearance-none w-6 h-6 border-[3px] border-gray-300 rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none"
                            />
                            <svg
                              className={`w-4 h-4 text-white absolute top-1 left-1 pointer-events-none ${
                                selectedStateValue === caseType.value ? 'block' : 'hidden'
                              }`}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </FormControl>
                        <FormLabel className="font-normal ml-20 text-[#595959] relative -top-1 mr-2">
                          {caseType.label}
                        </FormLabel>
                      </div>
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/*  */}
          </div>
          <div className="w-full flex justify-end gap-2 mb-4">
            <Link to={'/state-affairs'}>
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
