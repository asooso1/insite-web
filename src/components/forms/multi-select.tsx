"use client"

import * as React from "react"
import { Check, X, ChevronsUpDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface MultiSelectOption {
  value: string
  label: string
}

export interface MultiSelectProps {
  options: MultiSelectOption[]
  value: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  maxCount?: number
  disabled?: boolean
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "선택해주세요",
  maxCount = 3,
  disabled = false,
}: MultiSelectProps): React.ReactElement {
  const [open, setOpen] = React.useState(false)

  const selectedItems = options.filter(opt => value.includes(opt.value))
  const displayCount = value.length > maxCount ? maxCount : value.length

  const handleSelect = (optionValue: string): void => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  const handleRemove = (optionValue: string): void => {
    onChange(value.filter(v => v !== optionValue))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between"
        >
          <div className="flex flex-wrap gap-1">
            {selectedItems.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <>
                {selectedItems.slice(0, displayCount).map(item => (
                  <Badge key={item.value} variant="secondary" className="gap-1">
                    {item.label}
                    <button
                      className="ml-1 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleRemove(item.value)
                        }
                      }}
                      onMouseDown={e => {
                        e.preventDefault()
                        handleRemove(item.value)
                      }}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                ))}
                {selectedItems.length > maxCount && (
                  <Badge variant="secondary">
                    +{selectedItems.length - maxCount}
                  </Badge>
                )}
              </>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="검색..." />
          <CommandList>
            <CommandEmpty>결과가 없습니다.</CommandEmpty>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
