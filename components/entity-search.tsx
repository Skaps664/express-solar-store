"use client"

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import axios from 'axios'

export interface SearchableEntity {
  _id: string
  name: string
  slug: string
  image?: string
}

interface EntitySearchProps {
  type: 'product' | 'brand'
  onSelect: (entity: SearchableEntity) => void
  placeholder?: string
}

export function EntitySearch({ type, onSelect, placeholder }: EntitySearchProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [entities, setEntities] = useState<SearchableEntity[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const searchEntities = async () => {
      if (!searchTerm) {
        setEntities([])
        return
      }

      setLoading(true)
      try {
        const endpoint = type === 'product' 
          ? '/api/products/search'
          : '/api/brands/search'
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}${endpoint}?q=${searchTerm}`)
        if (response.data.success) {
          setEntities(response.data.data)
        }
      } catch (error) {
        console.error(`Error searching ${type}s:`, error)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchEntities, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm, type])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Search className="mr-2 h-4 w-4" />
          {placeholder || `Search ${type}s...`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput 
            placeholder={`Search ${type}s...`}
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>{loading ? "Searching..." : "No results found."}</CommandEmpty>
            <CommandGroup>
              {entities.map((entity) => (
                <CommandItem
                  key={entity._id}
                  onSelect={() => {
                    onSelect(entity)
                    setOpen(false)
                    setSearchTerm("")
                  }}
                >
                  {entity.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
