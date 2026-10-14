"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Page numbers to show: first, last, and a window around the current page, with gaps as "..."
function getPageItems(current: number, total: number, siblings = 1): (number | "...")[] {
  const pages = new Set([1, total])
  for (let p = current - siblings; p <= current + siblings; p++) {
    if (p > 1 && p < total) pages.add(p)
  }
  const sorted = Array.from(pages).sort((a, b) => a - b)
  const items: (number | "...")[] = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) items.push(p - sorted[i - 1] === 2 ? p - 1 : "...")
    items.push(p)
  })
  return items
}

interface PagePaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  label?: string
  className?: string
}

export function PagePagination({ currentPage, totalPages, onPageChange, label = "Pagination", className = "" }: PagePaginationProps) {
  if (totalPages <= 1) return null

  const goTo = (page: number) => {
    const next = Math.min(Math.max(page, 1), totalPages)
    if (next !== currentPage) onPageChange(next)
  }

  return (
    <nav aria-label={label} className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="flex items-center justify-center gap-1 sm:gap-2">
        <Button
          variant="outline"
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="h-9 w-9 p-0 sm:h-10 sm:w-auto sm:px-3 border-[#1a5ca4] text-[#1a5ca4] hover:bg-[#1a5ca4] hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline ml-1">Previous</span>
        </Button>

        {getPageItems(currentPage, totalPages).map((item, i) =>
          item === "..." ? (
            <span key={`gap-${i}`} className="w-6 sm:w-10 text-center text-gray-400 select-none" aria-hidden="true">
              …
            </span>
          ) : (
            <Button
              key={item}
              variant={currentPage === item ? "default" : "outline"}
              onClick={() => goTo(item)}
              aria-label={`Page ${item}`}
              aria-current={currentPage === item ? "page" : undefined}
              className={`h-9 w-9 sm:h-10 sm:w-10 p-0 ${currentPage === item ? 'bg-[#1a5ca4] text-white hover:bg-[#1a5ca4]' : 'border-[#1a5ca4] text-[#1a5ca4] hover:bg-[#1a5ca4] hover:text-white'}`}
            >
              {item}
            </Button>
          )
        )}

        <Button
          variant="outline"
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="h-9 w-9 p-0 sm:h-10 sm:w-auto sm:px-3 border-[#1a5ca4] text-[#1a5ca4] hover:bg-[#1a5ca4] hover:text-white"
        >
          <span className="hidden sm:inline mr-1">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </p>
    </nav>
  )
}
