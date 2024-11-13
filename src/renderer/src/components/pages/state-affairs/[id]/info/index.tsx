import { useEffect, useState } from 'react'
import { Button } from '@renderer/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useParams, Link } from 'react-router-dom'
import { InfoIssue, IssuesDetailInfo, IssuesResponse } from '@renderer/types'
import { useAuthHeader } from 'react-auth-kit'
import { axiosInstance } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { useForm } from 'react-hook-form'
import {
  // GevStatus,
  kind_of_case,
  Level
} from '@renderer/types/enum'
// import { z } from 'zod'
import { Separator } from '@renderer/components/ui/separator'

export type Tribunal = {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
}

// const formSchema = z.object({
//   name: z.string(),
//   postionId: z.string(),
//   governmentOfficeId: z.string(),
//   title: z.string(),
//   type: z.number(),
//   invitationType: z.string(),
//   state: z.boolean(),
//   tribunalId: z.string(),
//   level: z.string(),
//   detailsDate: z.string(),
//   judgment: z.string(),
//   refrance: z.string(),
//   Resumed: z.boolean()
// })
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

export type PositionsProp = {
  id: number
  name: string
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
  Issue: InfoIssue[]
}

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

// const contested = [
//   { label: 'طاعن عليه', value: false },
//   { label: 'مطعون', value: true }
// ] as const

const CompletionOfTheCase = [
  { label: 'نعم', value: true },
  { label: 'لا', value: false }
] as const

const DegreeOfLitigationOptions = [
  { label: 'إستئناف', value: Level.appeal },
  { label: 'ابتدائي', value: Level.elementary },
  { label: 'عليا', value: Level.high }
] as const

// type IssuesFormValue = z.infer<typeof formSchema>
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
  const [dataPosition, setPositionData] = useState<PositionsProp[]>([])
  const [dataGovernment, _setGovernmentData] = useState<GovernmentOffice[]>([])
  const [tribunal, setTribunal] = useState<Tribunal[]>([])
  const [selectedOption, _setSelectedOption] = useState<number | null>(null)

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
    fetchPositionData()
    fetchData()
  }, [selectedOption])

  const fetchIssueById = async () => {
    const response = await axiosInstance.get<IssuesResponse>(`/issue?id=${id}`, {
      headers: {
        Authorization: `${authToken()}`
      }
    })
    return response.data
  }
  const fetchIssueDetailsById = async () => {
    const response = await axiosInstance.get<IssuesDetailInfo[]>(`/issue-details?issueId=${id}`, {
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
    isLoading: isIssueDetailsLoading
  } = useQuery({
    queryKey: ['issueDetails', id],
    queryFn: fetchIssueDetailsById,
    enabled: !!id // Only fetch if ID exists
  })

  console.log('issueDetailsData?.level', issueDetailsData?.[0]?.level)
  // if (issueDetailsData?.length > 0) {
  //   console.log('Level:', issueDetailsData[0]?.level)
  // } else {
  //   console.log('No data found for issueDetailsData')
  // }
  const issueName = issueData?.[0].name
  const issueType = Number(issueData?.[0]?.type)
  const matchingCase = kindOfCase.find((caseType) => caseType.value === issueType)

  const matchingCaseLabel = matchingCase?.label || 'No matching case found'
  const matchingCaseValue = matchingCase?.value

  // UseEffect to update form default values when data is available
  // const form = useForm<IssuesFormValue>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     name: '' // Initialize with empty string
  //   }
  // })

  // const levelLabel = DegreeOfLitigationOptions.find(
  //   (caseType) => caseType.value === issueDetailsData?.level
  // )?.label

  const filteredPosition = dataPosition
    .filter((x) => x.id === issueData?.[0]?.postionId)
    .map((x) => x.name)[0]

  const filteredGovernmentName = dataGovernment
    .filter((x) => x.id === issueData?.[0]?.governmentOfficeId)
    .map((x) => x.name)[0]

  const [_selectedValue, _setSelectedValue] = useState<string | null>(issueData?.[0]?.type || null)

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
        <main className="">
          <div className="mb-4 bg-[#dedef8] rounded-t-lg">
            <h3 className="font-bold text-[#3734a9] p-3">المعلومات</h3>
          </div>

          <div className="bg-[#dedef8] w-[95%] min-h-[100vh] m-auto rounded-2xl px-4 py-2">
            <div className="grid h-[80px]   grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
              <div className="text-[#757575] col-span-1 h-[50px] ">
                <label className="font-bold text-lg">الاسم</label>
                <p className="mt-2">{issueData?.[0].name}</p>
              </div>

              <div className="text-[#757575] col-span-1 ">
                <label htmlFor="" className="font-bold text-lg">
                  الصفة
                </label>
                <p className="mt-2">{filteredPosition}</p>
              </div>

              <div className="col-span-1 text-[#757575]">
                <label htmlFor="" className="font-bold text-lg">
                  المرفق الحكومي
                </label>
                <p className="mt-2">
                  {filteredGovernmentName
                    ? filteredGovernmentName
                    : 'No matching government office'}
                </p>
              </div>
            </div>
            {/*  */}
            <div className="grid h-[80px] text-[#757575] grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
              <div className=" col-span-1 h-[50px] ">
                <label className="font-bold text-lg">عنوان القضية</label>
                <p className="mt-2">{issueData?.[0].title}</p>
              </div>
            </div>
            <Separator className="bg-[#757575]" />

            <div className="grid h-[100px] grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth text-right mt-4">
              <div className="col-span-1 h-[50px] text-[#757575]">
                <label className="font-bold text-lg">عنوان القضية</label>
                <p className="mt-2">{matchingCaseLabel}</p>
              </div>

              <div className="text-[#757575] col-span-1 h-auto">
                <label className="font-bold text-lg">النوع</label>
                <p className="mt-2">
                  {(() => {
                    // Initialize options as an empty array of the correct type
                    let options = [] as typeof type1 | typeof type2

                    // Determine which options to use based on matchingCaseValue
                    if (matchingCaseValue === kind_of_case.civilian) {
                      // civilian
                      options = type2
                    } else if (matchingCaseValue === kind_of_case.business) {
                      // business
                      options = type2
                    } else if (matchingCaseValue === kind_of_case.criminal) {
                      // criminal
                      options = type1
                    } else if (matchingCaseValue === kind_of_case.administrative) {
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

            <Separator className="bg-[#757575] mb-3" />
            <div className="mb-4 bg-[#dedef8] rounded-t-lg grid   grid-cols-3">
              <div className="col-span-1 ">
                <label className="text-[#757575] font-bold text-lg">درجة التقاضي</label>
                <p className="mt-2 text-[#757575]">
                  {issueDetailsData !== null
                    ? DegreeOfLitigationOptions.filter(
                        (x) => x.value === issueDetailsData?.[0]?.level
                      ).map((x) => x.label)
                    : 'No data found for issueDetailsData'}
                </p>
              </div>
            </div>
            <Separator className="bg-[#757575] mt-3 h-[2px]" />
            <div className="col-span-1 h-auto">
              {(() => {
                const level =
                  issueDetailsData !== null
                    ? issueDetailsData?.[0]?.level // We extract the first item since .map returns an array
                    : 'No data found for issueDetailsData'

                if (level === 1) {
                  return (
                    <>
                      <div className="grid min-h-[15vh] grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth text-right">
                        <div className="col-span-1 text-[#757575]">
                          <label htmlFor="" className="font-bold text-lg">
                            المحكمه
                          </label>
                          <p className="mt-2">
                            {tribunal
                              .filter((x) => x.id === issueDetailsData?.[0]?.tribunalId)
                              .map((x) => x.name)}
                          </p>
                        </div>
                        <div className="text-[#757575] col-span-1">
                          <label htmlFor="" className="font-bold text-lg">
                            عنوان القضية
                          </label>
                          <p className="mt-2">{issueData?.[0]?.title}</p>
                        </div>
                        <div className="text-[#757575] col-span-1">
                          <label htmlFor="" className="font-bold text-lg">
                            نص الحكم
                          </label>
                          <p className="mt-2">{issueDetailsData?.[0]?.judgment}</p>
                        </div>
                      </div>

                      <div className="grid min-h-[10vh] grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth text-right">
                        <div className="text-[#757575] col-span-1">
                          <label htmlFor="" className="font-bold text-lg">تاريخه</label>
                          <p className="mt-2">{String(issueDetailsData?.[0]?.detailsDate).split('T')[0]}</p>
                        </div>
                        <div className="text-[#757575] col-span-1">
                          <label htmlFor="" className="font-bold text-lg">رقم الحكم</label>
                          <p className="mt-2">{issueDetailsData?.[0]?.refrance}</p>
                        </div>
                        <div className="text-[#757575] col-span-1">
                          <p className="mt-10">
                            {Resumed.filter((x) => x.value === issueDetailsData?.[0]?.Resumed).map(
                              (x) => x.label
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="grid min-h-[10vh] mt-10 grid-cols-3  items-start gap-4 overflow-y-scroll scroll-smooth text-right">
                      <div className="text-[#757575] col-span-1 ">
                          <label htmlFor="" className="font-bold text-lg">أنجاز القضية</label>
                          <p className="mt-2">
                            {CompletionOfTheCase.filter((x) => x.value === issueData?.[0]?.state).map(
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
                          {/* <p>
                            {tribunal
                              .filter((x) => x.id === issueDetailsData[0]?.tribunalId)
                              .map((x) => x.name)}
                          </p> */}
                        </div>
                      </div>
                      <div className="grid h-[60px] mb-3 grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth text-right">
                        <div className="col-span-1 h-[40px]">
                          <label htmlFor="">عنوان القضية</label>
                          {/* <p>{issueData[0].title}</p> */}
                        </div>
                      </div>
                      {/* Uncomment the following code if needed */}
                      <div className="grid min-h-[70px] grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth text-right">
                        <div className="col-span-1 h-[40px]">
                          <label htmlFor="">نص الحكم</label>
                          {/* <p>{issueDetailsData[0].judgment}</p> */}
                        </div>
                      </div>
                      {/*  */}
                      <div className="grid min-h-[70px] grid-cols-4 items-start gap-4 overflow-y-scroll scroll-smooth text-right">
                        <div className="col-span-1 h-[40px]">
                          <label htmlFor="">تاريخه</label>
                          {/* <p>{issueDetailsData[0].detailsDate}</p> */}
                        </div>
                        <div className="col-span-1 h-[40px]">
                          <label htmlFor="">رقم الحكم</label>
                          {/* <p>{issueDetailsData[0].refrance}</p> */}
                        </div>
                        <div className="col-span-1 h-[40px]">
                          <label htmlFor="">أنجاز القضية</label>
                          {/* <p>
                            {CompletionOfTheCase.filter((x) => x.value === issueData[0].state).map(
                              (x) => x.label
                            )}
                          </p> */}
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
                          {/* <p>
                            {tribunal
                              .filter((x) => x.id === issueDetailsData[0]?.tribunalId)
                              .map((x) => x.name)}
                          </p> */}
                        </div>
                      </div>
                      <div className="grid h-[60px] mb-3 grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth text-right">
                        <div className="col-span-1 h-[40px]">
                          <label htmlFor="">عنوان القضية</label>
                          {/* <p>{issueData[0].title}</p> */}
                        </div>
                      </div>
                      {/* Uncomment the following code if needed */}
                      <div className="grid min-h-[70px] grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth text-right">
                        <div className="col-span-1 h-[40px]">
                          <label htmlFor="">نص الحكم</label>
                          {/* <p>{issueDetailsData[0].judgment}</p> */}
                        </div>
                      </div>
                      {/*  */}
                      <div className="grid min-h-[70px] grid-cols-4 items-start gap-4 overflow-y-scroll scroll-smooth text-right">
                        <div className="col-span-1 h-[40px]">
                          <label htmlFor="">تاريخه</label>
                          {/* <p>{issueDetailsData[0].detailsDate}</p> */}
                        </div>
                        <div className="col-span-1 h-[40px]">
                          <label htmlFor="">رقم الحكم</label>
                          {/* <p>{issueDetailsData[0].refrance}</p> */}
                        </div>
                        <div className="col-span-1 h-[40px]">
                          {/* <p>
                            {contested
                              .filter((x) => x.value === issueDetailsData[0].Resumed)
                              .map((x) => x.label)}
                          </p> */}
                        </div>
                        <div className="col-span-1 h-[40px]">
                          <label htmlFor="">أنجاز القضية</label>
                          {/* <p>
                            {CompletionOfTheCase.filter((x) => x.value === issueData[0].state).map(
                              (x) => x.label
                            )}
                          </p> */}
                        </div>
                      </div>
                    </>
                  )
                } else {
                  return (
                    <div>
                      <p>No data available for this level.</p>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
