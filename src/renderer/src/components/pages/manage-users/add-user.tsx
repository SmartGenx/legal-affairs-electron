import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAuthHeader } from 'react-auth-kit'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@renderer/components/ui/button'
import { FormInput } from '@renderer/components/ui/form-input'
import { getApi, postApi } from '@renderer/lib/http'
import { useToast } from '@renderer/components/ui/use-toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import FileUploader from '../decisions/add-decisions/FileUploader'
import { ArrowRight, Plus } from 'lucide-react'
import MultiSelect from '@renderer/components/ui/MultiSelect'

const formSchema = z.object({
  email: z.string(),
  username: z.string(),
  password: z.string(),
  file: z.instanceof(File).optional(),
  roleId: z.array(z.number()),
  phone: z.string()
})
export interface RolesResp {
  info: Info[]
  total: number
  page: string
  pageSize: string
}

export interface Info {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
}

type BookFormValue = z.infer<typeof formSchema>
export default function AddUserForm() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const authToken = useAuthHeader()
  const navigate = useNavigate()

  const { data: RoleIds } = useQuery({
    queryKey: ['RoleIdsData'],
    queryFn: () =>
      getApi<RolesResp>('/Role?page=1&pageSize=1000', {
        headers: {
          Authorization: authToken()
        }
      })
  })
  console.log('RoleIds', RoleIds?.data.info)

  const form = useForm<BookFormValue>({
    resolver: zodResolver(formSchema)
  })
  const { mutate } = useMutation({
    mutationKey: ['AddGeneralization'],
    mutationFn: (datas: BookFormValue) => {
      const formData = new FormData()
      formData.append('email', datas.email) // Corrected this from decisionDate to decisionName
      formData.append('username', datas.username)
      formData.append('password', datas.password)
      // formData.append('roleId', datas.roleId)
      formData.append('phone', datas.phone)

      if (datas.file) {
        formData.append('file', datas.file) // Add the file to formData
      }
      return postApi(`/user/registration`, formData, {
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
      queryClient.invalidateQueries({ queryKey: ['UsersInfo'] })
      navigate('/settings')
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
    <>
      <div className=" flex items-center text-3xl">
        <Link to={'/settings'}>
          <Button className="w-16 h-12 bg-transparent text-[#3734a9] hover:bg-[#3734a9] hover:text-white rounded-2xl border-2 border-[#3734a9] hover:border-2 hover:border-[#fff]">
            <ArrowRight size={20} />
          </Button>
        </Link>
        <h1 className="mr-2 text-[#3734a9] font-bold">إضافة مستخدم</h1>
      </div>
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

            <div className="grid min-h-[80px]  mb-4 grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
              <div className=" col-span-1 h-[50px] ">
                <label htmlFor="" className="font-bold text-sm text-[#757575]">
                  البريد الاكتروني
                </label>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormInput
                          className="h-11 p-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                          placeholder="  البريد الاكتروني "
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className=" col-span-1 h-[50px] ">
                <label htmlFor="" className="font-bold text-sm text-[#757575]">
                  اسم المتسخدم
                </label>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormInput
                          className="h-11 p-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                          placeholder="  اسم المتسخدم "
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className=" col-span-1 h-[50px] ">
                <label htmlFor="" className="font-bold text-sm text-[#757575]">
                  كلمة المرور
                </label>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormInput
                          type="password"
                          className="h-11 p-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                          placeholder="  كلمة المرور "
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

            <div className="grid min-h-[80px]  mb-4 grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth  text-right">
              <div className=" col-span-1 min-h-[50px] ">
                <label htmlFor="" className="font-bold text-sm text-[#757575]">
                  رقم الهاتف
                </label>
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormInput
                          className="h-11 p-0 placeholder:text-base   rounded-xl border-[3px] border-[#E5E7EB] text-sm"
                          placeholder="  رقم الهاتف "
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className=" col-span-1 min-h-[50px] ">
                <label htmlFor="" className="font-bold text-sm text-[#757575]">
                  الادوار
                </label>
               
                <FormField
                  name="roleId"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormControl>
                        <MultiSelect
                          label="اختار الدور"
                          required
                          options={RoleIds?.data.info || []}
                          value={
                            RoleIds?.data.info?.filter((field) => value?.includes(field.id)) || []
                          }
                          getLabel={(option) => option.name}
                          getValue={(option) => option.id}
                          onChange={(values) => onChange(values.map(({ id }) => id))}
                        />
                      </FormControl>
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
                          <p className="mb-2 text-start text-lg font-medium">صورة المتسخدم</p>
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
              <Link to={'/settings'}>
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
    </>
  )
}
