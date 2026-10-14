"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown } from "lucide-react"

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popularity", label: "Most Popular" },
  { value: "top_selling", label: "Best Selling" },
]

interface ProductToolbarProps {
  total: number
  activeFilterCount?: number
  sort: string
  onSortChange: (value: string) => void
}

// Product count + sort dropdown shown above product grids (/store, /category/[slug])
export function ProductToolbar({ total, activeFilterCount = 0, sort, onSortChange }: ProductToolbarProps) {
  return (
    <div className="mb-6 flex items-center justify-between gap-3 border-b border-gray-200 pb-3">
      <div className="min-w-0">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{total}</span> products
        </p>
        {activeFilterCount > 0 && (
          <p className="text-xs text-[#f26522]">
            {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} applied
          </p>
        )}
      </div>

      <Select value={sort} onValueChange={onSortChange}>
        <SelectTrigger
          aria-label="Sort products"
          className="h-9 w-auto min-w-[150px] gap-2 rounded-full border-gray-200 bg-white px-3 text-sm shadow-sm focus:ring-[#1a5ca4]"
        >
          <ArrowUpDown className="h-4 w-4 shrink-0 text-[#1a5ca4]" />
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent align="end">
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
