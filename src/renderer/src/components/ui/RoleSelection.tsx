import React, { useCallback } from 'react'
import { Checkbox } from './checkbox'
import { Button } from './button'
import { Badge } from './badge'
import { ChevronsUpDown } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './command'
import { ScrollArea } from './scroll-area'
import { cn } from '../../lib/utils'

const RoleSelection = React.memo(({ roles, selectedRoles, onChange }: any) => {
  const handleSelect = useCallback(
    (roleId) => {
      const isSelected = selectedRoles.includes(roleId)
      const updatedValues = isSelected
        ? selectedRoles.filter((id) => id !== roleId)
        : [...selectedRoles, roleId]

      onChange(updatedValues)
    },
    [selectedRoles, onChange]
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            'w-full h-10 justify-between font-normal rounded-xl border-[3px] border-[#E5E7EB]',
            !selectedRoles || selectedRoles.length === 0
              ? 'font-normal text-muted-foreground'
              : 'font-medium text-primary-foreground'
          )}
        >
          {selectedRoles && selectedRoles.length > 0 ? (
            <Badge>{`تم تحديد ${selectedRoles.length}`}</Badge>
          ) : (
            'اختر وحدة'
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="ابحث عن وحدة" />
          <ScrollArea className="h-[200px] w-full" dir="rtl">
            <CommandEmpty>لا يوجد نتائج</CommandEmpty>
            <CommandGroup>
              {roles.map((role) => (
                <CommandItem key={role.id} value={role.name} onSelect={() => handleSelect(role.id)}>
                  <Checkbox
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedRoles.includes(role.id) ? 'opacity-100' : 'opacity-0'
                    )}
                    checked={selectedRoles.includes(role.id)}
                  />
                  {role.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  )
})

export default RoleSelection
