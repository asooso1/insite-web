"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"

import { Button } from "./button"
import { Input } from "./input"
import { cn } from "@/lib/utils"

interface NumberInputProps
  extends Omit<React.ComponentProps<typeof Input>, "value" | "onChange" | "type"> {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}

function NumberInput({
  value,
  onChange,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  disabled = false,
  className,
  ...props
}: NumberInputProps) {
  const handleDecrement = React.useCallback(() => {
    const newValue = value - step
    if (newValue >= min) {
      onChange(newValue)
    }
  }, [value, step, min, onChange])

  const handleIncrement = React.useCallback(() => {
    const newValue = value + step
    if (newValue <= max) {
      onChange(newValue)
    }
  }, [value, step, max, onChange])

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      if (inputValue === "" || inputValue === "-") {
        return
      }
      const numValue = parseFloat(inputValue)
      if (!Number.isNaN(numValue) && numValue >= min && numValue <= max) {
        onChange(numValue)
      }
    },
    [min, max, onChange]
  )

  const isDecrementDisabled = disabled || value <= min
  const isIncrementDisabled = disabled || value >= max

  return (
    <div
      data-slot="number-input"
      className={cn("flex items-center gap-1", className)}
    >
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={handleDecrement}
        disabled={isDecrementDisabled}
        aria-label="값 감소"
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Input
        type="number"
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        className="text-center"
        min={min}
        max={max}
        step={step}
        {...props}
      />
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={handleIncrement}
        disabled={isIncrementDisabled}
        aria-label="값 증가"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  )
}

export { NumberInput }
