import  { useEffect, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../ui/select'
import { Button } from '@renderer/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useParams, Link } from 'react-router-dom'
import { IssuesResponse } from '@renderer/types'
import { useAuthHeader } from 'react-auth-kit'
import { axiosInstance } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { GevStatus, kind_of_case, GovernmentFacility, Level } from '@renderer/types/enum'
import { z } from 'zod'
import { FormInput } from '@renderer/components/ui/form-input'
import { Textarea } from '@renderer/components/ui/textarea'
import { DateInput } from '@renderer/components/ui/date-input'

export type Tribunal = {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
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
  detailsDate: z.string(),
  judgment: z.string(),
  refrance: z.string(),
  Resumed: z.boolean()
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

const Postions = [{ label: 'مدير إدارة', value: GevStatus.Director_of_the_Department }] as const
const GovernmentFacilities = [
  { label: 'الشؤون القانونية', value: GovernmentFacility.Legal_Affairs }
] as const

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

  const [tribunal, setTribunal] = useState<Tribunal[]>([])
  const [_selectedStateValue, setSelectedStatedValue] = useState<boolean | null>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)


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

    fetchData()
  }, [selectedOption, authToken]) // Include authToken as a dependency

  // Fetch issue by ID
  const fetchIssueById = async () => {
    const response = await axiosInstance.get<IssuesResponse>(`/issue?id=${id}`, {
      headers: {
        Authorization: `${authToken()}`
      }
    })
    return response.data
  }
  const fetchIssueDetailsById = async () => {
    const response = await axiosInstance.get<IssuesResponse>(`/issue-details?issueId=${id}`, {
      headers: {
        Authorization: `${authToken()}`
      }
    })
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

  //   Use the useQuery hook to fetch issue Details data
  const {
    data: issueDetailsData,
    error: issueDetailsError,
    isLoading: isIssueDetailsLoading,
  } = useQuery({
    queryKey: ['issue', id],
    queryFn: fetchIssueDetailsById,
    enabled: !!id // Only fetch if ID exists
  })

  const issueName = issueData?.[0].name

  // UseEffect to update form default values when data is available
  const form = useForm<IssuesFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '' // Initialize with empty string
    }
  })

  useEffect(() => {
    if (issueData && issueDetailsData) {
      //   const issueName = data[0]?.name || ''
      const positionId = issueData?.[0].postionId || ''

      const governmentOfficeId = issueData?.[0].governmentOfficeId || ''
      form.reset({
        name: issueData[0]?.name,
        postionId: positionId,
        governmentOfficeId: governmentOfficeId,
        title: issueData[0]?.title,
        type: issueData[0]?.type,
        invitationType: issueData[0]?.invitationType,
        state: issueData[0]?.state,
        tribunalId: issueDetailsData[0]?.tribunalId,
        level: issueDetailsData[0]?.level,
        detailsDate: new Date(issueDetailsData[0]?.detailsDate).toISOString().split('T')[0],
        judgment: issueDetailsData[0]?.judgment,
        refrance: issueDetailsData[0]?.refrance,
        Resumed: issueDetailsData[0]?.Resumed
      })
    }
  }, [issueData, issueDetailsData, form])

  const [selectedValue, _setSelectedValue] = useState<string | null>(issueData?.[0]?.type || null)
  const levelString = String(issueDetailsData?.[0]?.level ?? '');
  const tribunalIdString = String(issueDetailsData?.[0]?.tribunalId ?? '')

  // const handleCheckboxChange = (value: string) => {
  //   // Update the selected value when checkbox is clicked
  //   setSelectedValue((prev) => (prev === value ? null : value))
  // }
  if (isIssueLoading && isIssueDetailsLoading) return <div>Loading...</div>
  if (issueError) return <div>Error fetching issue data</div>
  if (issueDetailsError) return <div>Error fetching issue details data</div>
  // const [delayedSubmitting, setDelayedSubmitting] = useState(form.formState.isSubmitting)
  return (
    <>
      <div className="flex items-center text-3xl">
        <Link to={'/state-affairs'}>
          <Button className="w-16 h-12 bg-transparent text-[#3734a9] hover:bg-[#3734a9] hover:text-white rounded-2xl border-2 border-[#3734a9] hover:border-2 hover:border-[#fff]">
            <ArrowRight size={20} />
          </Button>
        </Link>
        <h1 className="mr-2 text-[#3734a9] font-bold">{issueName}</h1>
      </div>

      <div className="min-h-[50vh] w-full mt-5">
        <Form {...form}>
          <form
            id="governoratesForm"
            //   key={key}
            // onSubmit={form.handleSubmit(onSubmit)}
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

            <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
              <div className=" col-span-1 h-[50px] ">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormInput
                          className="h-10 p-0  rounded-xl text-sm"
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

              <div className="col-span-1 translate-y-2 ">
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
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="الصفة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Postions.map((position) => (
                            <SelectItem
                              key={position.value}
                              value={String(position.value) || String(issueData?.[0].postionId)}
                            >
                              {position.label}
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

              <div className="col-span-1 translate-y-2">
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
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="المرفق الحكومي" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GovernmentFacilities.map((directorate) => (
                            <SelectItem key={directorate.value} value={String(directorate.value)}>
                              {directorate.label}
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
            <div className="grid h-[100px]  grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right mt-4 ">
              <div className="col-span-2 h-[50px] ">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="col-span-2 flex ">
                      {kindOfCase.map((caseType) => (
                        <div key={caseType.value} className="flex items-center ">
                          <FormControl>
                            <div className="relative">
                              <input
                                type="checkbox"
                                value={caseType.value}
                                // This checks if the current issueData type matches the caseType value and reflects that in the UI
                                checked={field.value === caseType.value}
                                onChange={() => {
                                  const newValue =
                                    field.value === caseType.value ? null : caseType.value
                                  field.onChange(newValue) // Update the form value
                                }}
                                className="appearance-none w-6 h-6 border border-gray-300 rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none"
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
                          <FormLabel className="font-normal ml-20 mr-2">{caseType.label}</FormLabel>
                        </div>
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/*  */}

              <div className="col-span-1 h-auto">
                {(() => {
                  // Initialize options as an empty array of the correct type
                  let options = [] as typeof type1 | typeof type2

                  // Determine which options to use based on issue type
                  if (selectedValue || issueData?.[0]?.type === kind_of_case.civilian) {
                    options = type2
                  } else if (selectedValue || issueData?.[0]?.type === kind_of_case.business) {
                    options = type2
                  } else if (selectedValue || issueData?.[0]?.type === kind_of_case.criminal) {
                    options = type1
                  } else if (
                    selectedValue ||
                    issueData?.[0]?.type === kind_of_case.administrative
                  ) {
                    options = type2
                  } else {
                    options = type1 // Default or fallback options
                  }

                  return (
                    <FormField
                      control={form.control}
                      name="invitationType"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            value={String(field.value)}
                            defaultValue={String(field.value)}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختار واحد" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {options.map((type) => (
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
                  )
                })()}
              </div>

              {/*  */}
            </div>
            {/*  */}

            <div className="mb-4 bg-[#dedef8] rounded-t-lg grid   grid-cols-3">
              <div className="col-span-2">
                <h3 className="font-bold text-[#3734a9] p-3">درجة التقاضي</h3>
              </div>
              <div className="col-span-1 ">
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
                        value={
                          field.value
                            ? String(field.value)
                            : levelString
                        }
                        defaultValue={levelString}
                      >
                        <FormControl className="w-full h-[50px] rounded-xl bg-transparent border-[1px] border-transparent ">
                          <SelectTrigger>
                            <SelectValue placeholder="الصفة" />
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
                const level = selectedOption ?? issueDetailsData?.[0]?.level

                if (level === 1) {
                  return (
                    <>
                      <div className="grid h-[60px]  grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
                        <div className="col-span-1 ">
                          <FormField
                            control={form.control}
                            name="tribunalId"
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  onValueChange={field.onChange}
                                  value={
                                    field.value
                                      ? String(field.value)
                                      : tribunalIdString
                                  }
                                  defaultValue={tribunalIdString}
                                >
                                  <FormControl>
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
                      <div className="grid h-[60px] mb-3  grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
                        <div className=" col-span-1 h-[40px] ">
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <FormInput
                                    className="h-12 p-0  rounded-xl text-sm"
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
                      <div className="grid h-[150px]   grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
                        <div className=" col-span-1 h-[40px] ">
                          <FormField
                            control={form.control}
                            name="judgment"
                            render={({ field }) => (
                              <FormItem className="col-span-2">
                                <FormControl>
                                  <Textarea
                                    className="bg-white"
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

                      <div className="grid h-[60px]  grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
                        {/*  */}

                        <div className=" col-span-1 h-auto">
                          <FormField
                            control={form.control}
                            name="detailsDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <DateInput
                                    {...field}
                                    placeholder="تاريخ الميلاد"
                                    type="date"
                                    onChange={(e) => field.onChange(e.target.value)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className=" col-span-1 h-[40px] ">
                          <FormField
                            control={form.control}
                            name="refrance"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <FormInput
                                    className="h-12  rounded-xl text-sm"
                                    placeholder="   رقم الحكم "
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="col-span-1 h-[50px]">
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
                                          className="appearance-none w-6 h-6 border border-gray-300 rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none"
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
                                    <FormLabel className="font-normal ml-20 mr-2">
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
                } else if (level === 2) {
                  return (
                    <>
                      <div className="grid h-[60px]  grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
                        <div className="col-span-1 ">
                          <FormField
                            control={form.control}
                            name="tribunalId"
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  onValueChange={field.onChange}
                                  value={
                                    field.value
                                      ? String(field.value)
                                      : tribunalIdString
                                  }
                                  defaultValue={tribunalIdString}
                                >
                                  <FormControl>
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
                      <div className="grid h-[60px] mb-3  grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
                        <div className=" col-span-1 h-[40px] ">
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <FormInput
                                    className="h-12 p-0  rounded-xl text-sm"
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
                      <div className="grid h-[150px]  grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
                        <div className=" col-span-1 h-[40px] ">
                          <FormField
                            control={form.control}
                            name="judgment"
                            render={({ field }) => (
                              <FormItem className="col-span-2">
                                <FormControl>
                                  <Textarea
                                    className="bg-white"
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

                      <div className="grid h-[60px]  grid-cols-2 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
                        {/*  */}

                        <div className=" col-span-1 h-auto">
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
                                    onChange={(e) => field.onChange(e.target.value)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className=" col-span-1 h-[40px] ">
                          <FormField
                            control={form.control}
                            name="refrance"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <FormInput
                                    className="h-12  rounded-xl text-sm"
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
                } else if (level === 3) {
                  return (
                    <>
                      <div className="grid h-[60px]  grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
                        <div className="col-span-1 ">
                          <FormField
                            control={form.control}
                            name="tribunalId"
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  onValueChange={field.onChange}
                                  value={
                                    field.value
                                      ? String(field.value)
                                      : tribunalIdString
                                  }
                                  defaultValue={tribunalIdString}
                                >
                                  <FormControl>
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
                      <div className="grid h-[60px] mb-3  grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
                        <div className=" col-span-1 h-[40px] ">
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <FormInput
                                    className="h-12 p-0  rounded-xl text-sm"
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

                      <div className="grid h-[150px]  grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
                        <div className=" col-span-1 h-[40px] ">
                          <FormField
                            control={form.control}
                            name="judgment"
                            render={({ field }) => (
                              <FormItem className="col-span-2">
                                <FormControl>
                                  <Textarea
                                    className="bg-white"
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

                      <div className="grid h-[60px]  grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
                        {/*  */}

                        <div className=" col-span-1 h-auto">
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
                                    onChange={(e) => field.onChange(e.target.value)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className=" col-span-1 h-[40px] ">
                          <FormField
                            control={form.control}
                            name="refrance"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <FormInput
                                    className="h-12  rounded-xl text-sm"
                                    placeholder="   رقم الحكم "
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="col-span-1 h-[50px]">
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
                                          className="appearance-none w-6 h-6 border border-gray-300 rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none"
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
                                    <FormLabel className="font-normal ml-20 mr-2">
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
                }else {
                  return (
                    <div>
                      <p>No data available for this level.</p>
                    </div>
                  );
                }
              })()}
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
                                className="appearance-none w-6 h-6 border border-gray-300 rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none"
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
                          <FormLabel className="font-normal ml-20 mr-2">{caseType.label}</FormLabel>
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
    </>
  )
}
