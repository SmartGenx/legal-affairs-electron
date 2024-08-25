import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../../ui/form'
import React, { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { number, z } from 'zod'
import { Input } from '../../../../ui/input'
import { axiosInstance, postApi } from '../../../../../lib/http'
import { useMutation } from '@tanstack/react-query'
import { useToast } from '../../../../ui/use-toast'
import { Label } from '../../../../ui/label'
import { FormInput } from '@renderer/components/ui/form-input'
import { GevStatus, kind_of_case, GovernmentFacility, Level } from '@renderer/types/enum'
import Dropdown from '@renderer/components/ui/dropdown'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '../../../../ui/select'
import { Textarea } from '@renderer/components/ui/textarea'
import { Button } from '@renderer/components/ui/button'
import { Link } from 'react-router-dom'
import { IssuesResponse } from '@renderer/types'
const formSchema = z.object({
  name: z.string(),
  postionId: z.number(),
  governmentOfficeId: z.number(),
  title: z.string(),
  type: z.number(),
  invitationType: z.number(),
  state: z.boolean(),
  issueId: z.number(),
  level: z.number(),
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

const Postions = [
  { label: 'مدير إدارة', value: GevStatus.Director_of_the_Department as unknown as string }
] as const
const GovernmentFacilities = [
  { label: 'الشؤون القانونية', value: GovernmentFacility.Legal_Affairs as unknown as string }
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
export default function AddIssueForm() {
  const { toast } = useToast()

  const [selectedValue, setSelectedValue] = useState<kind_of_case | null>(null)

  const [selectedResumedValue, setSelectedResumedValue] = useState<boolean | null>(null)
  const [selectedStateValue, setSelectedStatedValue] = useState<boolean | null>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  useEffect(() => {}, [selectedOption])

  const form = useForm<IssuesFormValue>({
    resolver: zodResolver(formSchema)
  })
  const [delayedSubmitting, setDelayedSubmitting] = useState(form.formState.isSubmitting)

  const onSubmit = (data: IssuesFormValue) => {
    console.log('asdasdsd', data)
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

            <div className="col-span-1 ">
              <FormField
                control={form.control}
                name="postionId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select disabled={delayedSubmitting} {...field} value={field.value}>
                        <SelectTrigger className="">
                          <SelectValue placeholder="الصفة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>الصفة</SelectLabel>
                            {Postions.map((position) => (
                              <SelectItem key={position.value} value={String(position.value)}>
                                {position.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            {/*  */}

            <div className="col-span-1 ">
              <FormField
                control={form.control}
                name="governmentOfficeId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select disabled={delayedSubmitting} {...field}>
                        <SelectTrigger className="">
                          <SelectValue placeholder="المرفق الحكومي" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>المرفق الحكومي</SelectLabel>
                            {GovernmentFacilities.map((directorate) => (
                              <SelectItem key={directorate.value} value={String(directorate.value)}>
                                {directorate.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
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
                              checked={selectedValue === caseType.value}
                              onChange={() => {
                                const newValue =
                                  selectedValue === caseType.value ? null : caseType.value
                                setSelectedValue(newValue)
                                field.onChange(newValue)
                              }}
                              className="appearance-none w-6 h-6 border border-gray-300  rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none"
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
                        <FormLabel className="font-normal ml-20 mr-2">{caseType.label}</FormLabel>
                      </div>
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/*  */}

            <div className=" col-span-1 h-auto">
              {selectedValue === kind_of_case.civilian ? (
                <FormField
                  control={form.control}
                  name="governmentOfficeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select disabled={delayedSubmitting} {...field}>
                          <SelectTrigger className="">
                            <SelectValue placeholder="اختر واحد" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>اختر واحد</SelectLabel>
                              {type2.map((types) => (
                                <SelectItem key={types.value} value={String(types.value)}>
                                  {types.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              ) : selectedValue === kind_of_case.business ? (
                <FormField
                  control={form.control}
                  name="governmentOfficeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select disabled={delayedSubmitting} {...field}>
                          <SelectTrigger className="">
                            <SelectValue placeholder="اختر واحد" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>اختر واحد</SelectLabel>
                              {type2.map((types) => (
                                <SelectItem key={types.value} value={String(types.value)}>
                                  {types.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              ) : selectedValue === kind_of_case.criminal ? (
                <FormField
                  control={form.control}
                  name="governmentOfficeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select disabled={delayedSubmitting} {...field}>
                          <SelectTrigger className="">
                            <SelectValue placeholder="اختر واحد" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>اختر واحد</SelectLabel>
                              {type1.map((types) => (
                                <SelectItem key={types.value} value={String(types.value)}>
                                  {types.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              ) : selectedValue === kind_of_case.administrative ? (
                <FormField
                  control={form.control}
                  name="governmentOfficeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select disabled={delayedSubmitting} {...field}>
                          <SelectTrigger className="">
                            <SelectValue placeholder="اختر واحد" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>اختر واحد</SelectLabel>
                              {type1.map((types) => (
                                <SelectItem key={types.value} value={String(types.value)}>
                                  {types.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="governmentOfficeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select disabled={delayedSubmitting} {...field}>
                            <SelectTrigger className="">
                              <SelectValue placeholder="اختر واحد" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>اختر واحد</SelectLabel>
                                {type1.map((types) => (
                                  <SelectItem key={types.value} value={String(types.value)}>
                                    {types.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
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
            <div className="col-span-1 ">
              <Select onValueChange={(value) => setSelectedOption(parseInt(value, 10))}>
                <SelectTrigger className="w-full h-[50px] rounded-xl bg-transparent border-[1px] border-transparent ">
                  <SelectValue placeholder="الصفة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {DegreeOfLitigationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          {selectedOption === 1 ? (
            <>
              <div className="grid h-[60px]  grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
                <div className=" col-span-1 h-[40px] ">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FormInput
                            className="h-12  rounded-xl text-sm"
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
                    name="name"
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
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
                    name="name"
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
                    name="name"
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
                                  className="appearance-none w-6 h-6 border border-gray-300 rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none"
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
          ) : selectedOption === 2 ? (
            <>
              <div className="grid h-[60px]  grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
                <div className=" col-span-1 h-[40px] ">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FormInput
                            className="h-12  rounded-xl text-sm"
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
                    name="name"
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
                    name="name"
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
          ) : selectedOption === 3 ? (
            <>
              <div className="grid h-[60px]  grid-cols-1 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
                <div className=" col-span-1 h-[40px] ">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FormInput
                            className="h-12  rounded-xl text-sm"
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
                                  className="appearance-none w-6 h-6 border border-gray-300 rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none"
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
                              className="appearance-none w-6 h-6 border border-gray-300 rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none"
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
  )
}
