'use client'
import * as React from 'react'
import { Button } from '../../ui/button'
import { Form, FormControl, FormField, FormItem } from '../../ui/form'
import { Input } from '../../ui/input'
import { useToast } from '../../ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
// import { signIn } from "next-auth/react";
// import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { cn } from '../../../lib/utils'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
// import { Eye, EyeOff } from 'lucide-react'

const formSchema = z.object({
  username: z.string().email({ message: 'اسم المستخدم' }),
  password: z.string().min(1, { message: 'ادخل كلمة المرور' })
})

type UserFormValue = z.infer<typeof formSchema>

export default function LoginForm() {
  // const { toast } = useToast()
  // const { push, replace } = useRouter()
  // const pathname = usePathname()
  // const searchParams = useSearchParams()
  // const callbackUrl = searchParams.get('callbackUrl')
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema)
  })
  const [delayedSubmitting, setDelayedSubmitting] = useState(form.formState.isSubmitting)
  const [showPassword, setShowPassword] = useState(false)

  // const onSubmit = async (data: UserFormValue) => {
  //   try {
  //     const res = await signIn('credentials', {
  //       email: data.email,
  //       password: data.password,
  //       redirect: false
  //     })
  //     if (res?.ok) {
  //       push(callbackUrl ?? '/dashboard/local-organizations')
  //     } else {
  //       toast({
  //         title: res?.error ?? 'حدث خطأ ما!',
  //         variant: 'destructive'
  //       })
  //     }
  //   } catch (error) {
  //     return JSON.stringify(error)
  //   }
  // }

  // React.useEffect(() => {
  // const params = new URLSearchParams(searchParams.toString())
  // if (callbackUrl?.includes('/dashboard/logout')) {
  // params.set('callbackUrl', '/dashboard')
  // replace(`${pathname}?${params.toString()}`)
  // }
  // }, [callbackUrl, pathname, replace, searchParams])
  // useEffect(() => {
  // if (form.formState.isSubmitting) {
  // const timer = setTimeout(() => {
  // setDelayedSubmitting(form.formState.isSubmitting)
  // }, 2000)
  // return () => clearTimeout(timer) // Cleanup timeout on component unmount or when effect re-runs
  // } else {
  // setDelayedSubmitting(form.formState.isSubmitting)
  // }
  // }, [form.formState.isSubmitting])
  //
  // const handleShowPassword = () => {
  // setShowPassword((prev) => !prev)
  // }

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-md">
        <Form {...form}>
          <form
            // onSubmit={form.handleSubmit(onSubmit)}
            className={cn('w-full space-y-4', {
              'pointer-events-none opacity-50': delayedSubmitting
            })}
          >
            <div className="mb-3 flex flex-col gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl className="">
                      <Input
                        martial
                        label="اسم المستخدم"
                        placeholder="اسم المستخدم"
                        type="email"
                        {...field}
                        // disabled={delayedSubmitting}
                        className="bg-primary/5"
                        InputClassName="!h-12"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          martial
                          label="كلمة المرور"
                          placeholder="كلمة المرور"
                          // type={showPassword ? 'text' : 'password'}
                          {...field}
                          // disabled={delayedSubmitting}
                          className="bg-primary/5"
                          InputClassName="!h-12"
                        />
                        <button
                          type="button"
                          // onClick={() => handleShowPassword()}
                          className="absolute left-3 top-1/2 -translate-y-1/2 transform cursor-pointer p-2 text-lg"
                        >
                          {/* {showPassword ? (
                            <EyeOff size={23} color="#434749" />
                          ) : (
                            <Eye size={23} color="#434749" />
                          )} */}
                        </button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Link
              to="#"
              className="text-sm font-medium"
              // style={{
              // pointerEvents: delayedSubmitting ? 'none' : 'auto',
              // color: delayedSubmitting ? 'gray' : '#12425A'
              // }}
            >
              نسيت كلمة المرور ؟
            </Link>
            <Button
              className="!mt-4 !h-12 w-full bg-[#3734a9] text-sm hover:bg-[#d4d5d5] hover:text-[#8d8d8d]"
              type="submit"
              //   isLoading={delayedSubmitting}
              // disabled={delayedSubmitting}
            >
              تسجيل الدخول
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
