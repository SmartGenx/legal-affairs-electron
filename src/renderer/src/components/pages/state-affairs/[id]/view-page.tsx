import { useEffect, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select'
import { Button } from '@renderer/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { InfoIssue, IssuesResponse } from '@renderer/types'
import { useAuthHeader } from 'react-auth-kit'
import { axiosInstance, patchApi } from '@renderer/lib/http'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { kind_of_case, Level } from '@renderer/types/enum'
import { z } from 'zod'
import { FormInput } from '@renderer/components/ui/form-input'
import { Textarea } from '@renderer/components/ui/textarea'
import { useToast } from '@renderer/components/ui/use-toast'

export type Tribunal = {
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
  type: z.string(),
  invitationType: z.string(),
  state: z.boolean(),
  tribunalId: z.string(),
  level: z.string(),
  detailsDate: z.string().refine(
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
  judgment: z.string(),
  refrance: z.string(),
  Resumed: z.boolean().nullable().optional()
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

export type GovernmentOffice = {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

const kindOfCase = [
  { label: 'جنائية', value: kind_of_case.criminal },
  { label: 'مدنية', value: kind_of_case.civilian },
  { label: 'تجارية', value: kind_of_case.business },
  { label: 'إدارية', value: kind_of_case.administrative }
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
export default function ViewPage() {
  const { id } = useParams<{ id: string }>()
  const authToken = useAuthHeader()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [tribunal, setTribunal] = useState<Tribunal[]>([])
  const [dataGovernment, setGovernmentData] = useState<GovernmentOffice[]>([])
  const [_selectedStateValue, setSelectedStatedValue] = useState<boolean | null>(null)
  const [dataPosition, setPositionData] = useState<PositionsProp[]>([])
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
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
  // Fetch tribunal data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/tribunal', {
          headers: {
            Authorization: `${authToken()}`
          }
        })
        setTribunal(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchGovernmentData()
    fetchPositionData()
    fetchData()
  }, [selectedOption]) // Include authToken as a dependency

  // Fetch issue by ID
  const fetchIssueById = async () => {
    const response = await axiosInstance.get<IssuesResponse[]>(
      `/issue?include[IssueDetails]=true&id=${id}`,
      {
        headers: {
          Authorization: `${authToken()}`
        }
      }
    )
    return response.data
  }

  // Use the useQuery hook to fetch issue data
  const {
    data: issueData,
    error: issueError,
    isLoading: isIssueLoading
  } = useQuery({
    queryKey: ['judgment', id],
    queryFn: fetchIssueById,
    enabled: !!id // Only fetch if ID exists
  })

  // UseEffect to update form default values when data is available
  const form = useForm<IssuesFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '' // Initialize with empty string
    }
  })

  useEffect(() => {
    if (issueData) {
      // const issueName = data[0]?.name || ''
      const positionId = issueData?.[0].postionId || ''

      const governmentOfficeId = issueData?.[0].governmentOfficeId || ''
      form.reset({
        name: issueData[0]?.name,
        postionId: String(positionId),
        governmentOfficeId: String(governmentOfficeId),
        title: issueData[0]?.title,
        type: String(issueData[0]?.type),
        invitationType: String(issueData[0]?.invitationType),
        state: issueData[0]?.state,
        tribunalId: String(issueData?.[0].IssueDetails[0].tribunalId),
        level: String(issueData?.[0].IssueDetails[0].level),
        detailsDate: new Date(issueData?.[0].IssueDetails[0].detailsDate)
          .toISOString()
          .split('T')[0],
        judgment: issueData?.[0].IssueDetails[0].judgment,
        refrance: issueData?.[0].IssueDetails[0].refrance,
        Resumed: issueData?.[0].IssueDetails[0].Resumed ?? null
      })
    }
  }, [issueData])

  const [selectedValue, setSelectedValue] = useState<kind_of_case | null>()
  console.log("issueData?.[0].IssueDetails[0].level",issueData?.[0].IssueDetails[0].level)
  useEffect(() => {
    setSelectedValue((Number(issueData?.[0].type) as kind_of_case) || null)
  }, [issueData])

  const levelString = String(issueData?.[0].IssueDetails[0].level ?? '')

  const tribunalIdString = String(issueData?.[0].IssueDetails[0].tribunalId ?? '')

  const {
    mutate: firstMutate,
    isError: _firstIsError,
    isSuccess: _firstIsSuccess,
    isPending: _firstIsPending
  } = useMutation({
    mutationKey: ['issue'],
    mutationFn: (datas: IssuesFormValue) =>
      patchApi(
        `/issue/${id}`,
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
        Resumed: variables.Resumed ?? undefined
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
      patchApi(
        `/issue-details/${id}`,
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
  if (isIssueLoading) return <div>Loading...</div>
  if (issueError) return <div>Error fetching issue data</div>
  // if (issueDetailsError) return <div>Error fetching issue details data</div>
  return (
    <>
      <div className="flex items-center text-3xl">
        <Link to={'/state-affairs'}>
          <button className="w-12 flex justify-center items-center h-12 bg-transparent text-[#3734a9] hover:bg-[#3734a9] hover:text-white rounded-2xl border-2 border-[#3734a9] hover:border-2 hover:border-[#fff]">
            <ArrowRight size={20} />
          </button>
        </Link>
        <h1 className="mr-2 text-[#3734a9] font-bold">{issueData?.[0].title}</h1>
      </div>

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
                          className="h-11 text-[#595959] placeholder:text-[#595959] px-3 placeholder:px-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ? String(field.value) : String(issueData?.[0].postionId)}
                        defaultValue={String(issueData?.[0].postionId)}
                      >
                        <FormControl className="bg-transparent mt-2 h-11 text-[#595959] text-base border-[3px] border-[#E5E7EB] rounded-xl">
                          <SelectTrigger>
                            <SelectValue placeholder="الصفة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {dataPosition.map((position) => (
                            <SelectItem
                              key={position.id}
                              value={String(position.id) || String(issueData?.[0].postionId)}
                            >
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
                      <Select
                        onValueChange={field.onChange}
                        value={
                          field.value
                            ? String(field.value)
                            : String(issueData?.[0].governmentOfficeId)
                        }
                        defaultValue={String(issueData?.[0].governmentOfficeId)}
                      >
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
            <div className="grid  min-h-[100px]  grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right mt-4 ">
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
                          <FormLabel className="font-normal text-[#595959] ml-20 mr-2 relative top-4">
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
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          setSelectedOption(parseInt(value, 10))
                        }}
                        value={field.value ? String(field.value) : String(levelString)}
                        defaultValue={levelString}
                      >
                        <FormControl className="w-full  h-[50px] rounded-xl bg-transparent text-[#595959] text-base border-[3px] border-[#a6a3ee]/[.40] ">
                          <SelectTrigger>
                            <SelectValue placeholder="اختار درجة التقاضي" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DegreeOfLitigationOptions.map((options) => (
                            <SelectItem key={options.value} value={String(options.value)}>
                              {options.label}
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

            <div className="col-span-1 h-auto">
              {(() => {
                const level = selectedOption ?? issueData?.[0].IssueDetails[0].level

                if (level === "1") {
                  return (
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
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value ? String(field.value) : tribunalIdString}
                                  defaultValue={tribunalIdString}
                                >
                                  <FormControl className="bg-transparent mt-2 h-11 text-[#595959] text-base border-[3px] border-[#E5E7EB] rounded-xl">
                                    <SelectTrigger>
                                      <SelectValue placeholder="المحكمه" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {tribunal.map((options) => (
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
                        {/*  */}
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
                                    className="h-11 px-2 mt-2 placeholder:text-base text-[#595959]  rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                                    placeholder="   عنوان القضية "
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
                                    className="bg-transparent placeholder:text-base text-[#595959] rounded-xl border-[3px] border-[#E5E7EB]"
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
                                    className="h-11 px-1 placeholder:text-base  rounded-xl border-[3px] border-[#E5E7EB] text-sm"
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
                                    className="h-11 text-[#595959] px-3 placeholder:px-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
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
                                  <div key={caseType.label} className="flex items-center">
                                    <FormControl>
                                      <div className="relative">
                                        <input
                                          type="checkbox"
                                          // This ensures the checkbox is checked if the form's value matches the caseType's value
                                          checked={field.value === caseType.value}
                                          onChange={() => {
                                            const newValue =
                                              field.value === caseType.value ? null : caseType.value
                                            field.onChange(newValue) // Update the form control with the new value
                                          }}
                                          className="appearance-none w-6 h-6 border-[3px] border-gray-300 rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none"
                                        />
                                        <svg
                                          className={`w-4 h-4 text-white absolute top-1 left-1 pointer-events-none ${
                                            field.value === caseType.value ? 'block' : 'hidden'
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
                  )
                } else if (level === "2") {
                  return (
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
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value ? String(field.value) : tribunalIdString}
                                  defaultValue={tribunalIdString}
                                >
                                  <FormControl className="bg-transparent mt-2 h-11 text-[#595959] text-base border-[3px] border-[#E5E7EB] rounded-xl">
                                    <SelectTrigger>
                                      <SelectValue placeholder="المحكمه" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {tribunal.map((options) => (
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
                        {/*  */}
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
                                    className="h-11 mt-2 text-[#595959] placeholder:text-[#595959] px-2 placeholder:text-base  rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                                    placeholder="   عنوان القضية "
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
                                    className="bg-transparent text-[#595959] mt-2 placeholder:text-base rounded-xl border-[3px] border-[#E5E7EB]"
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
                                    className="h-11 px-1 text-[#595959] placeholder:text-base  rounded-xl border-[3px] border-[#E5E7EB] text-sm"
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
                                    className="h-11 px-3 text-[#595959] placeholder:px-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
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
                  )
                } else if (level === "3") {
                  return (
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
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value ? String(field.value) : tribunalIdString}
                                  defaultValue={tribunalIdString}
                                >
                                  <FormControl className="bg-transparent mt-2 h-11 text-[#595959] text-base border-[3px] border-[#E5E7EB] rounded-xl">
                                    <SelectTrigger>
                                      <SelectValue placeholder="المحكمه" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {tribunal.map((options) => (
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
                        {/*  */}
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
                                    className="h-11 text-[#595959] placeholder:text-[#595959] px-2 placeholder:text-base  rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                                    placeholder="   عنوان القضية "
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
                                    className="bg-transparent text-[#595959] placeholder:text-base rounded-xl border-[3px] border-[#E5E7EB]"
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
                                    className="h-11 px-1 text-[#595959] placeholder:text-base  rounded-xl border-[3px] border-[#E5E7EB] text-sm"
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
                                    className="h-11 px-3 text-[#595959] placeholder:px-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
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
                                  <div key={caseType.label} className="flex items-center">
                                    <FormControl>
                                      <div className="relative">
                                        <input
                                          type="checkbox"
                                          // This ensures the checkbox is checked if the form's value matches the caseType's value
                                          checked={field.value === caseType.value}
                                          onChange={() => {
                                            const newValue =
                                              field.value === caseType.value ? null : caseType.value
                                            field.onChange(newValue) // Update the form control with the new value
                                          }}
                                          className="appearance-none w-6 h-6 border-[3px] border-gray-300 rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none"
                                        />
                                        <svg
                                          className={`w-4 h-4 text-white absolute top-1 left-1 pointer-events-none ${
                                            field.value === caseType.value ? 'block' : 'hidden'
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
                  )
                } else {
                  return (
                    <div>
                      <p>No data available for this level.</p>
                    </div>
                  )
                }
              })()}
                console.log("🚀 ~ ViewPage ~ level:", level);
            </div>

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
                                checked={issueData?.[0].state === caseType.value}
                                onChange={() => {
                                  const newValue =
                                    issueData?.[0].state === caseType.value ? null : caseType.value
                                  setSelectedStatedValue(newValue)
                                  field.onChange(newValue)
                                }}
                                className="appearance-none w-6 h-6 border-[3px] border-gray-300 rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none"
                              />
                              <svg
                                className={`w-4 h-4 text-white absolute top-1 left-1 pointer-events-none ${
                                  issueData?.[0].state === caseType.value ? 'block' : 'hidden'
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
                <p className="font-bold text-base">تعديل</p>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}
