import { cn } from '@renderer/lib/utils'
import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  type?: string
  martial?: boolean
  label?: string | React.ReactElement
  InputClassName?: string
}

const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ InputClassName, className, type, martial = true, label, ...props }, ref) => {
    const isInvalid = props['aria-invalid']
    return (
      <input
        type={type}
        className={cn(
          'flex h-14 w-full rounded-md border bg-transparent pr-10 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
          isInvalid ? 'border-red-500' : 'border-gray-300',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

SearchInput.displayName = 'Input'

export { SearchInput }
