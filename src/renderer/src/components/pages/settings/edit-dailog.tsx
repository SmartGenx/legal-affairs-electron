// EditDialog.tsx (Updated)
import { Edit2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@renderer/components/ui/alert-dialog'
import { useState, ReactElement } from 'react'

interface EditDialogProps {
  disabled?: boolean
  className?: string
  children: (onClose: () => void) => ReactElement
}

export default function EditDialog({ disabled = false, children, className }: EditDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger
        className={`m-0 flex w-full items-center gap-1 rounded px-2 py-1.5 text-right text-red-500 hover:bg-gray-100 ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        }`}
        onClick={handleOpen}
        disabled={disabled}
      >
        <Edit2 className="text-[#475467]" size={15} />
      </AlertDialogTrigger>
      <AlertDialogContent className={className}>
        <AlertDialogHeader className="*:text-right">
          <AlertDialogTitle>{'تعديل'}</AlertDialogTitle>
          {children(handleClose)}
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  )
}
