import { LucideProps } from 'lucide-react'

export default function DirectInbox({ ...props }: LucideProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10 1.66699V7.50033L11.6667 5.83366"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.99992 7.50065L8.33325 5.83398"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.6499 10.833H5.3249C5.64157 10.833 5.9249 11.008 6.06657 11.2913L7.04157 13.2413C7.3249 13.808 7.8999 14.1663 8.53324 14.1663H11.4749C12.1082 14.1663 12.6832 13.808 12.9666 13.2413L13.9416 11.2913C14.0832 11.008 14.3749 10.833 14.6832 10.833H18.3166"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.83341 3.44141C2.88341 3.87474 1.66675 5.60807 1.66675 9.16641V12.4997C1.66675 16.6664 3.33341 18.3331 7.50008 18.3331H12.5001C16.6667 18.3331 18.3334 16.6664 18.3334 12.4997V9.16641C18.3334 5.60807 17.1167 3.87474 14.1667 3.44141"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
