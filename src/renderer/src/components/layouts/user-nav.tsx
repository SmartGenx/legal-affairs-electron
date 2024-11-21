// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDown } from 'lucide-react'
import { useIsAuthenticated, useSignOut, useAuthHeader, useAuthUser } from 'react-auth-kit'
// import { useAuthUser, useIsAuthenticated, useSignOut } from 'react-auth-kit'
// import userIcon from '../icons/user.svg'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { useNavigate } from 'react-router-dom'
// import { Avatar } from '../ui/avatar'

export type userData = {
  user: {
    name: string
    image: string
    id: number
  }
}

export default function UserNav() {
  const navigate = useNavigate()
  const issAuthenticated = useIsAuthenticated()
  const signOut = useSignOut()
  const authToken = useAuthHeader()
  const authUser = useAuthUser()
  const user = authUser()
  console.log('🚀 ~ UserNav ~ user:', user?.user?.username)
  if (!authToken) {
    navigate('/login')
  }
  // const auth = useAuthUser()

  if (issAuthenticated()) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="justify-between w-60 border">
          <Button variant="ghost" className="relative flex gap-1">
            {/* <Avatar className=''/> */}
            <div className="flex h-12 w-12 text-[#3734a9] text-4xl font-black shadow-md justify-center items-center rounded-full bg-[#3734A9]/[.20] bg-cover bg-center p-2 px-4 py-2">
              {user?.user?.username
                .split(' ')
                .slice(0, 2)
                .map((part) => part.charAt(0))
                .join(' ')
                .toUpperCase() ?? 'Unknown User'}
            </div>

            <div className="flex flex-col space-y-1">
              <p className="text-sm font-extrabold leading-none">
                {user?.user?.username ?? 'Unknown User'}
              </p>
              <p className="text-xs leading-none font-extrabold text-muted-foreground">
                {user?.user?.email ?? 'Unknown User'}
              </p>
            </div>
            <ChevronDown size={15} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal"></DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>تسجيل الخروج</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  return null
}
