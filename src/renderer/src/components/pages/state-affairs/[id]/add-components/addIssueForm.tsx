import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../../ui/form'
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { number, z } from 'zod'
import { Input } from '../../../../ui/input'
import { postApi } from '../../../../../lib/http'
import { useMutation } from '@tanstack/react-query'
import { useToast } from '../../../../ui/use-toast'
import { Label } from '../../../../ui/label'

const formSchema = z.object({
  name: z.string(),
  postionId: z.number(),
  governmentOfficeId: z.number(),
  title: z.string(),
  type: z.number(),
  invitationType: z.number(),
  state: z.boolean()
})

export default function AddIssueForm() {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })
  return (
    <div className="h-[50vh] w-full mt-5">
      <div className="mb-4 bg-[#dedef8] py-4 px-2 rounded-t-lg">
        <h3 className="font-bold text-[#3734a9]">بيانات المختص القانوني</h3>
      </div>

      <Form {...form}>
        <form
          id="governoratesForm"
          //   key={key}
          //   onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <div className="grid h-[450px] grid-cols-3 items-start gap-4 overflow-y-scroll scroll-smooth p-4 text-right">
            <div className=" col-span-1 h-auto">
              {/* <Label text=" الرقم العسكري   " /> */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-red-900">{' الرقم العسكري '}</FormLabel>
                    <FormControl>
                      <Input placeholder="   الرقم العسكري " {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/*  */}

            <div className=" col-span-1 h-auto">
              {/* <Label text=" الرقم العسكري   " /> */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-red-900">{' الرقم العسكري '}</FormLabel>
                    <FormControl>
                      <Input placeholder="   الرقم العسكري " {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/*  */}

            <div className=" col-span-1 h-auto">
              {/* <Label text=" الرقم العسكري   " /> */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-red-900">{' الرقم العسكري '}</FormLabel>
                    <FormControl>
                      <Input placeholder="   الرقم العسكري " {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
