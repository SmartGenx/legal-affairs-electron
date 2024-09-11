import React, { useEffect, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../../ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '../../../../ui/select'
import { Button } from '@renderer/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { IssuesDetailInfo, IssuesDetailResponse, IssuesResponse } from '@renderer/types'
import { useAuthHeader } from 'react-auth-kit'
import { axiosInstance } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { GevStatus, kind_of_case, GovernmentFacility, Level } from '@renderer/types/enum'
import { z } from 'zod'
import { FormInput } from '@renderer/components/ui/form-input'
import { Textarea } from '@renderer/components/ui/textarea'
import { Input } from '@renderer/components/ui/input'
import { DateInput } from '@renderer/components/ui/date-input'
import { Label } from '@renderer/components/ui/label'
import { Separator } from '@renderer/components/ui/separator'

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
export type GovernmentOffice = {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}
export default function StateAffairsInfo() {
  const { id } = useParams<{ id: string }>()
  const authToken = useAuthHeader()
  const [dataGovernment, setGovernmentData] = useState<GovernmentOffice[]>([])
  const [tribunal, setTribunal] = useState<Tribunal[]>([])
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [selectedResumedValue, setSelectedResumedValue] = useState<boolean | null>(null)
  const [selectedStateValue, setSelectedStatedValue] = useState<boolean | null>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  const navigate = useNavigate()

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
  }, [selectedOption]) // Include authToken as a dependency

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
    const response = await axiosInstance.get<IssuesDetailInfo>(`/issue-details?issueId=${id}`, {
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
    isSuccess
  } = useQuery({
    queryKey: ['issueDetails', id],
    queryFn: fetchIssueDetailsById,
    enabled: !!id // Only fetch if ID exists
  })

  if (issueDetailsData?.length > 0) {
    console.log('Level:', issueDetailsData[0]?.level)
  } else {
    console.log('No data found for issueDetailsData')
  }
  const issueName = issueData?.[0].name
  const matchingCaseLabel = kindOfCase.find(
    (caseType) => caseType.value === issueData?.[0]?.type
  )?.label

  // UseEffect to update form default values when data is available
  const form = useForm<IssuesFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '' // Initialize with empty string
    }
  })

  // const levelLabel = DegreeOfLitigationOptions.find(
  //   (caseType) => caseType.value === issueDetailsData?.level
  // )?.label

  const filteredGovernmentName = dataGovernment
    .filter((x) => x.id === issueData?.[0]?.governmentOfficeId)
    .map((x) => x.name)[0]

  const [selectedValue, setSelectedValue] = useState<string | null>(issueData?.[0]?.type || null)

  const handleCheckboxChange = (value: string) => {
    // Update the selected value when checkbox is clicked
    setSelectedValue((prev) => (prev === value ? null : value))
  }
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
        <main className="">
          <div className="mb-4 bg-[#dedef8] rounded-t-lg">
            <h3 className="font-bold text-[#3734a9] p-3">المعلومات</h3>
          </div>

          <div className="bg-[#dedef8] w-[90%] min-h-[100vh] m-auto rounded-md px-4 py-2">
            <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
              <div className=" col-span-1 h-[50px] ">
                <label>الاسم</label>
                <p>{issueData?.[0].name}</p>
              </div>

              <div className="col-span-1 translate-y-2 ">
                <label htmlFor="">الصفة</label>
                <p>
                  {Postions.map((position) => (
                    <p key={position.value} value={String(issueData?.[0].postionId)}>
                      {position.label}
                    </p>
                  ))}
                </p>
              </div>

              <div className="col-span-1 translate-y-2">
                <label htmlFor="">المرفق الحكومي</label>
                <p>
                  {filteredGovernmentName
                    ? filteredGovernmentName
                    : 'No matching government office'}
                </p>
              </div>
            </div>
            {/*  */}
            <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
              <div className=" col-span-1 h-[50px] ">
                <label>عنوان القضية</label>
                <p>{issueData?.[0].title}</p>
              </div>
            </div>
            <Separator className="bg-[#757575]" />

            <div className="grid h-[100px]  grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right mt-4 ">
              <div className="col-span-1 h-[50px] ">
                <label>عنوان القضية</label>
                <p>{matchingCaseLabel || 'No matching case found'}</p>
              </div>

              <div className="col-span-1 h-auto">
                <label>النوع</label>
                <p>
                  {(() => {
                    // Initialize options as an empty array of the correct type
                    let options = [] as typeof type1 | typeof type2

                    // Determine which options to use based on matchingCaseLabel (use label strings for comparison)
                    if (matchingCaseLabel === kind_of_case.civilian) {
                      // civilian
                      options = type2
                    } else if (matchingCaseLabel === kind_of_case.business) {
                      // business
                      options = type2
                    } else if (matchingCaseLabel === kind_of_case.criminal) {
                      // criminal
                      options = type1
                    } else if (matchingCaseLabel === kind_of_case.administrative) {
                      // administrative
                      options = type2
                    } else {
                      options = type1 // Default or fallback options
                    }

                    // Find the label corresponding to the invitationType
                    const selectedOption = options.find(
                      (option) => option.value === issueData?.[0]?.invitationType
                    )

                    return (
                      <div className="col-span-1 h-auto">
                        {selectedOption ? (
                          <p>{selectedOption.label}</p>
                        ) : (
                          <p>No invitation type available</p>
                        )}
                      </div>
                    )
                  })()}
                </p>
              </div>
            </div>

            <Separator className="bg-[#757575]" />
            <div className="mb-4 bg-[#dedef8] rounded-t-lg grid   grid-cols-3">
              <div className="col-span-1 ">
                <label>درجة التقاضي</label>
                <p>
                  {issueDetailsData?.length > 0
                    ? DegreeOfLitigationOptions.filter(
                        (x) => x.value === issueDetailsData[0]?.level
                      ).map((x) => x.label)
                    : 'No data found for issueDetailsData'}
                </p>
              </div>
            </div>

            <div className="col-span-1 h-auto">
              {(() => {
                const level =
                  issueDetailsData?.length > 0
                    ? issueDetailsData[0]?.level // We extract the first item since .map returns an array
                    : 'No data found for issueDetailsData'

                if (level === 1) {
                  return (
                    <>
                      <div className="grid h-[60px] grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth text-right">
                        <div className="col-span-1">
                          <label htmlFor="">المحكمه</label>
                          <p>
                            {tribunal
                              .filter((x) => x.id === issueDetailsData[0]?.tribunalId)
                              .map((x) => x.name)}
                          </p>
                        </div>
                      </div>
                      <div className="grid h-[60px] mb-3 grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth text-right">
                        <div className="col-span-1 h-[40px]">
                          <label htmlFor="">عنوان القضية</label>
                          <p>{issueData[0].title}</p>
                        </div>
                      </div>
                      {/* Uncomment the following code if needed */}
                      <div className="grid min-h-[70px] grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth text-right">
                        <div className="col-span-1 h-[40px]">
                          <label htmlFor="">نص الحكم</label>
                          <p>{issueDetailsData[0].judgment}</p>
                        </div>
                      </div>
                      {/*  */}
                      <div className="grid min-h-[70px] grid-cols-4 items-start gap-4 overflow-y-scroll scroll-smooth text-right">
                        <div className="col-span-1 h-[40px]">
                          <label htmlFor="">تاريخه</label>
                          <p>{issueDetailsData[0].detailsDate}</p>
                        </div>
                        <div className="col-span-1 h-[40px]">
                          <label htmlFor="">رقم الحكم</label>
                          <p>{issueDetailsData[0].refrance}</p>
                        </div>
                        <div className="col-span-1 h-[40px]">
                          <p>
                            {Resumed.filter((x) => x.value === issueDetailsData[0].Resumed).map(
                              (x) => x.label
                            )}
                          </p>
                        </div>
                        <div className="col-span-1 h-[40px]">
                          <label htmlFor="">أنجاز القضية</label>
                          <p>
                            {CompletionOfTheCase.filter((x) => x.value === issueData[0].state).map(
                              (x) => x.label
                            )}
                          </p>
                        </div>
                      </div>
                    </>
                  )
                } else if (level === 2) {
                  return (
                    <>
                      <div className="grid h-[60px] grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth text-right">
                        <div className="col-span-1">
                          <label htmlFor="">المحكمه</label>
                          <p>
                            {tribunal
                              .filter((x) => x.id === issueDetailsData[0]?.tribunalId)
                              .map((x) => x.name)}
                          </p>
                        </div>
                      </div>
                      <div className="grid h-[60px] mb-3 grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth text-right">
                        <div className="col-span-1 h-[40px]">
                          <label htmlFor="">عنوان القضية</label>
                          <p>{issueData[0].title}</p>
                        </div>
                      </div>
                      {/* Uncomment the following code if needed */}
                      <div className="grid min-h-[70px] grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth text-right">
                        <div className="col-span-1 h-[40px]">
                          <label htmlFor="">نص الحكم</label>
                          <p>{issueDetailsData[0].judgment}</p>
                        </div>
                      </div>
                      {/*  */}
                      <div className="grid min-h-[70px] grid-cols-4 items-start gap-4 overflow-y-scroll scroll-smooth text-right">
                        <div className="col-span-1 h-[40px]">
                          <label htmlFor="">تاريخه</label>
                          <p>{issueDetailsData[0].detailsDate}</p>
                        </div>
                        <div className="col-span-1 h-[40px]">
                          <label htmlFor="">رقم الحكم</label>
                          <p>{issueDetailsData[0].refrance}</p>
                        </div>
                        <div className="col-span-1 h-[40px]">
                          <label htmlFor="">أنجاز القضية</label>
                          <p>
                            {CompletionOfTheCase.filter((x) => x.value === issueData[0].state).map(
                              (x) => x.label
                            )}
                          </p>
                        </div>
                      </div>
                    </>
                  )
                } else if (level === 3) {
                  return (
                    <>
                      <div className="grid h-[60px] grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth text-right">
                        <div className="col-span-1">
                          <label htmlFor="">المحكمه</label>
                          <p>
                            {tribunal
                              .filter((x) => x.id === issueDetailsData[0]?.tribunalId)
                              .map((x) => x.name)}
                          </p>
                        </div>
                      </div>
                      <div className="grid h-[60px] mb-3 grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth text-right">
                        <div className="col-span-1 h-[40px]">
                          <label htmlFor="">عنوان القضية</label>
                          <p>{issueData[0].title}</p>
                        </div>
                      </div>
                      {/* Uncomment the following code if needed */}
                      <div className="grid min-h-[70px] grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth text-right">
                        <div className="col-span-1 h-[40px]">
                          <label htmlFor="">نص الحكم</label>
                          <p>{issueDetailsData[0].judgment}</p>
                        </div>
                      </div>
                      {/*  */}
                      <div className="grid min-h-[70px] grid-cols-4 items-start gap-4 overflow-y-scroll scroll-smooth text-right">
                        <div className="col-span-1 h-[40px]">
                          <label htmlFor="">تاريخه</label>
                          <p>{issueDetailsData[0].detailsDate}</p>
                        </div>
                        <div className="col-span-1 h-[40px]">
                          <label htmlFor="">رقم الحكم</label>
                          <p>{issueDetailsData[0].refrance}</p>
                        </div>
                        <div className="col-span-1 h-[40px]">
                          <p>
                            {contested
                              .filter((x) => x.value === issueDetailsData[0].Resumed)
                              .map((x) => x.label)}
                          </p>
                        </div>
                        <div className="col-span-1 h-[40px]">
                          <label htmlFor="">أنجاز القضية</label>
                          <p>
                            {CompletionOfTheCase.filter((x) => x.value === issueData[0].state).map(
                              (x) => x.label
                            )}
                          </p>
                        </div>
                      </div>
                    </>
                  )
                }
              })()}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
