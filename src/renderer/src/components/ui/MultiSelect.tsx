'use client'
import { useState } from 'react'
import { Badge } from './badge'
import { Check, ChevronDown, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { ScrollArea } from './scroll-area'
import { useClickAway } from '@uidotdev/usehooks'

type SelectProps<T> = {
  value: T[]
  options: T[]

  getValue: (option: T) => string | number
  getLabel: (option: T) => string

  onChange: (value: T[]) => void

  required?: boolean
  label: string
  'aria-invalid'?: boolean
}

export default function MultiSelect<T>({
  value: values,
  options,
  onChange,
  required = false,
  getLabel,
  getValue,
  label,
  ...props
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false)

  const ref = useClickAway<HTMLDivElement>(() => {
    setIsOpen(false)
  })

  function selectOption(option: T) {
    if (values.includes(option)) {
      onChange(values.filter((s) => s !== option))
    } else {
      onChange([...values, option])
    }
  }

  function isOptionSelected(option: T) {
    return values.some((value) => getValue(value) === getValue(option))
  }
  const isInvalid = props['aria-invalid']

  return (
    <div ref={ref} className=" mt-2 w-full min-h-0">
      <button
        type="button"
        className={cn(
          'flex h-12 w-full items-center justify-between rounded-md border bg-primary-foreground px-4 py-2 text-left shadow-sm focus:outline-none',
          isInvalid ? 'border-red-500' : 'border-gray-300'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="line-clamp-1 font-medium">
          {label}
          {/* {required && <span className=" text-lg font-bold text-red-600">*</span>} */}
          {/* {values.length
            ? values.map((v) => getLabel(v)).join(", ")
            : "مجال عمل المؤسسة"} */}
        </span>
        <ChevronDown size={16} strokeWidth={2.5} />
      </button>
      {isOpen && (
        <div className="  z-10 mt-2 w-full rounded-md border bg-white shadow-lg">
          <ScrollArea className="max-h-36 overflow-y-scroll">
            <ul className="flex flex-col gap-1 p-2">
              {options.map((option) => (
                <li
                  className={cn(
                    isOptionSelected(option) && 'bg-primary/30',
                    'flex cursor-pointer justify-between rounded-md p-2 hover:bg-primary/10'
                  )}
                  key={getValue(option)}
                  onClick={() => {
                    selectOption(option)
                  }}
                >
                  <span className="line-clamp-1">{getLabel(option)}</span>
                  {isOptionSelected(option) && <Check strokeWidth={1.5} />}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      )}
      <div className="mt-2 flex flex-wrap">
        {values.map((v) => (
          <Badge
            variant="outline"
            className="m-1 cursor-pointer rounded-full text-sm text-gray-500"
            key={getValue(v)}
            onClick={() => selectOption(v)}
          >
            {getLabel(v)}
            <span className="ml-1 inline-block">
              <X className="align-text-bottom" size={16} strokeWidth={2.5} />
            </span>
          </Badge>
        ))}
      </div>
    </div>
  )
}
