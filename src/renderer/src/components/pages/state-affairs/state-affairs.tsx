import React from 'react'
import LocalOrgAsyncSearch from './local-orgs-async-search'
import { Input } from '@renderer/components/ui/input'
import { Button } from '@renderer/components/ui/button'
import { Eye, EyeOff, Plus, Search } from 'lucide-react'
import SearchAffairs from './search'
import TopButtons from './top-buttons'

export default function StateAffairs() {
  return (
    <section className="relative space-y-4 ">
      <SearchAffairs />
      <TopButtons />
    </section>
  )
}
