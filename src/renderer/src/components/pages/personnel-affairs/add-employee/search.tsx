import { Button } from '@renderer/components/ui/button'
import { getApi } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { useAuthHeader } from 'react-auth-kit'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import AsyncSelect from 'react-select/async'
import FilterDrawer from './filter'

interface data {
  name: string
}
const EmpSearch = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const authToken = useAuthHeader()
  const pathname = location.pathname
  const selectedVal = searchParams.get('query')
  const { data: issuesSearch } = useQuery({
    queryKey: ['Employ'],
    queryFn: () =>
      getApi<data[]>('/employ', {
        headers: {
          Authorization: authToken()
        }
      })
  })
  const loadOptions = async (value: string) => {
    if (!value) return []
    const data = await getApi<data[]>('/employ', {
      params: {
        'name[contains]': value
      },
      headers: {
        Authorization: authToken()
      }
    })
    return data.data || []
  }
  const customComponents = {
    DropdownIndicator: () => null,
    IndicatorSeparator: () => null
  }
  const onChange = (val: { name: string } | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (val?.name) {
      params.set('query', val.name)
    } else {
      params.delete('query')
    }
    params.set('page', '1')
    // queryClient.invalidateQueries({ queryKey: ['products'] })
    navigate(`${pathname}?${params.toString()}`, { replace: true })
  }
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      border: 'none',
      boxShadow: 'none',
      backgroundColor: '#fff'
    }),
    input: (provided: any) => ({
      ...provided,
      margin: 0
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999
    }),
    placeholder: (provided: any) => ({
      ...provided,
      fontWeight: 'bold',
      color: '#757575'
    }),
    singleValue: (provided: any) => ({
      ...provided
    })
  }
  return (
    <div>
      <div className="!my-10 flex flex-col items-center justify-between sm:flex-row">
        <div className="flex w-full items-center justify-center rounded-xl border-[3px] border-[#E5E7EB] ">
          <Search className="mr-2 text-gray-500" />
          <AsyncSelect<data>
            placeholder="ابحث باسم الموظف.."
            loadingMessage={() => 'جارٍ البحث ...'}
            noOptionsMessage={() => 'لا توجد نتائج'}
            cacheOptions
            instanceId="products-search"
            value={selectedVal?.length ? { name: selectedVal } : undefined}
            defaultOptions={issuesSearch?.data}
            loadOptions={loadOptions}
            onChange={onChange}
            getOptionLabel={({ name }) => name}
            getOptionValue={({ name }) => name}
            components={customComponents}
            isClearable
            menuIsOpen={isMenuOpen}
            onInputChange={(value) => {
              setIsMenuOpen(value.length > 0)
            }}
            styles={customStyles}
            className="flex-grow"
          />
        </div>
        <div>
          <FilterDrawer />
        </div>
        <div>
          <Button className="flex items-center text-xl  w-28 mr-3 h-11 bg-[#3734a9] hover:bg-[#2e2b8b] hover:text-[#fff] rounded-[12px] px-4">
            <p className="text-xl">بحث</p>
            <Search className="text-md mr-2" size={22} />
          </Button>
        </div>
      </div>
    </div>
  )
}
export default EmpSearch
