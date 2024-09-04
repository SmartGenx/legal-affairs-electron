import React from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  type?: string
  martial?: boolean
  label?: string | React.ReactElement
  InputClassName?: string
}

const DateInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ InputClassName, className, type, martial = true, label, ...props }, ref) => {
    const isInvalid = props['aria-invalid']

    if (martial)
      return (
        <div className="group relative max-w-full   text-right text-on-surface-variant bg-transparent  py-2">
          <input
            {...props}
            type={type}
            ref={ref}
            className={cn(
              'flex h-11 w-full rounded-xl border bg-transparent   py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',

              InputClassName
            )}
            placeholder=" "
          />

          <fieldset
            className={cn(
              'pointer-events-none visible absolute inset-0  rounded-xl bg-transparent border  translate-y-2 h-11 group-focus-within:border group-focus-within:!border-secondary peer-placeholder-shown:invisible border-gray-300'
            )}
          ></fieldset>
        </div>
      )

    return (
      <input
        type={type}
        className={cn(
          'flex h-14 w-full rounded-xl border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
          isInvalid ? 'border-red-500' : 'border-gray-300',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

DateInput.displayName = 'Input'

export { DateInput }
