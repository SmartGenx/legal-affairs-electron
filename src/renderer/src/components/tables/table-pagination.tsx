import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../ui/button'
import { Pagination, PaginationContent, PaginationItem } from '../ui/pagination'

interface TablePaginationProps {
  total: number
  page: number
  pageSize: number
}

const TablePagination: React.FC<TablePaginationProps> = ({ total, page, pageSize }) => {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const pathname = location.pathname
  const navigate = useNavigate()

  const pages: number[] = []
  for (let index = 0; index < Math.ceil(total / pageSize); index++) {
    pages.push(index + 1)
  }

  const updatePage = (newPage: number) => {
    if (newPage === page) return
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    navigate(`${pathname}?${params.toString()}`, { replace: true })
  }

  const handlePreviousPage = () => {
    if (page > 1) {
      updatePage(page - 1)
    }
  }

  const handleNextPage = () => {
    if (page < pages.length) {
      updatePage(page + 1)
    }
  }

  const getPageItems = () => {
    const items: (number | string)[] = []
    if (page > 2) items.push(1, '...')
    if (page > 1) items.push(page - 1)
    items.push(page)
    if (page < pages.length) items.push(page + 1)
    if (page < pages.length - 1) items.push('...', pages.length)
    return items
  }

  return (
    <Pagination className="rtl">
      <PaginationContent>
        <PaginationItem>
          <Button
            className="!cursor-pointer"
            variant="ghost"
            size="sm"
            onClick={handlePreviousPage}
            disabled={page <= 1}
          >
            <ChevronRight size={18} />
          </Button>
        </PaginationItem>
        {getPageItems().map((item, index) =>
          typeof item === 'number' ? (
            <PaginationItem key={index}>
              <Button
                className={`dark:text-white bg-[#eef0f8] font-bold hover:bg-[#8c94b4] hover:text-[#3734a9] text-[#3734a9] ${item !== page && 'bg-[#EEEFEF] text-[#3734a9] '}`}
                variant={'default'}
                size="sm"
                onClick={() => updatePage(item)}
              >
                {item}
              </Button>
            </PaginationItem>
          ) : (
            <PaginationItem key={index}>
              <span>{item}</span>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <Button
            className="cursor-pointer"
            variant="ghost"
            size="sm"
            onClick={handleNextPage}
            disabled={page >= pages.length}
          >
            <ChevronLeft size={18} />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default TablePagination
