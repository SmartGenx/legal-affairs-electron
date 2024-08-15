import { cn } from '@renderer/lib/utils'
import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  type?: string
  martial?: boolean
  label?: string | React.ReactElement
  InputClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ InputClassName, className, type, martial = true, label, ...props }, ref) => {
    const isInvalid = props['aria-invalid']

    if (martial)
      return (
        <div className="group relative max-w-full text-right text-on-surface-variant">
          <input
            {...props}
            type={type}
            ref={ref}
            className={cn(
              'peer h-14 w-full rounded-sm px-3 py-3 outline-none',
              isInvalid ? 'border-red-500' : 'border-gray-300',
              InputClassName
            )}
            placeholder=" "
          />
          <label className="group-focus-within:!text-border-secondary pointer-events-none absolute right-[9px] top-px -translate-y-[55%] transform px-1 text-[12px] font-medium  transition-all duration-300 group-focus-within:!top-px group-focus-within:!text-xs peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base">
            {label}
          </label>

          <fieldset
            className={cn(
              'pointer-events-none invisible absolute inset-0 mt-[-8px] rounded-sm border group-focus-within:border group-focus-within:!border-secondary peer-placeholder-shown:visible',
              isInvalid ? 'border-red-500' : 'border-outlineBorder'
            )}
          >
            <legend className="invisible mr-2 max-w-[0.01px] whitespace-nowrap px-0 text-xs transition-all duration-300 group-focus-within:max-w-full group-focus-within:px-1">
              {label}
            </legend>
          </fieldset>

          <fieldset
            className={cn(
              'pointer-events-none visible absolute inset-0 mt-[-8px] rounded-lg border group-focus-within:border group-focus-within:!border-secondary peer-placeholder-shown:invisible',
              isInvalid ? 'border-red-500' : 'border-gray-300'
            )}
          >
            <legend className="invisible mr-2 max-w-full whitespace-nowrap px-1 text-xs">
              {label}
            </legend>
          </fieldset>
        </div>
      )

    return (
      <input
        type={type}
        className={cn(
          'flex h-14 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
          isInvalid ? 'border-red-500' : 'border-gray-300',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export { Input }
