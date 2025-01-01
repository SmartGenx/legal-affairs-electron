import FolderDownload from '@renderer/components/icons/folder-download'
import { Button } from '@renderer/components/ui/button'
import { getApi } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import { Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { useAuthHeader } from 'react-auth-kit'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import AsyncSelect from 'react-select/async'

interface data {
  legalName: string
}
const BackupSearch = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const authToken = useAuthHeader()
  const pathname = location.pathname
  const selectedVal = searchParams.get('query')
  const { data: issuesSearch } = useQuery({
    queryKey: ['Agency'],
    queryFn: () =>
      getApi<data[]>('/agency', {
        headers: {
          Authorization: authToken()
        }
      })
  })
  const loadOptions = async (value: string) => {
    if (!value) return []
    const data = await getApi<data[]>('/agency', {
      params: {
        'legalName[contains]': value
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
  const onChange = (val: { legalName: string } | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (val?.legalName) {
      params.set('query', val.legalName)
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
            placeholder="البحث عن.."
            loadingMessage={() => 'جارٍ البحث ...'}
            noOptionsMessage={() => 'لا توجد نتائج'}
            cacheOptions
            instanceId="products-search"
            value={selectedVal?.length ? { legalName: selectedVal } : undefined}
            defaultOptions={issuesSearch?.data}
            loadOptions={loadOptions}
            onChange={onChange}
            getOptionLabel={({ legalName }) => legalName}
            getOptionValue={({ legalName }) => legalName}
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
          <Button className="flex items-center text-xl  w-40 mr-3 h-11 bg-[#fff] text-[#3734a9] border-2 border-[#3734a9] hover:bg-[#2e2b8b] hover:text-[#fff] rounded-[12px] px-4">
            <p className="text-base">استعادة نسخة</p>
            <FolderDownload className="mr-2" />
            {/* <Plus className="text-md mr-2" size={22} /> */}
          </Button>
        </div>
        <div>
          <Button className="flex items-center text-xl  w-40 mr-3 h-11 bg-[#3734a9] hover:border-2 hover:border-[#3734a9] hover:bg-[#fff] hover:text-[#2e2b8b] rounded-[12px] px-4">
            <p className="text-base">إنشاء نسخة</p>
            <Plus className="text-md mr-2" size={22} />
          </Button>
        </div>
      </div>
    </div>
  )
}
export default BackupSearch
