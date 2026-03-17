"use client"

import * as React from "react"
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"
import { type VariantProps } from "class-variance-authority"

import { toggleVariants } from "./toggle"
import { cn } from "@/lib/utils"

interface ToggleGroupContextValue {
  variant: VariantProps<typeof toggleVariants>["variant"]
  size: VariantProps<typeof toggleVariants>["size"]
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | undefined>(
  undefined
)

function useToggleGroup(): ToggleGroupContextValue {
  const context = React.useContext(ToggleGroupContext)
  if (!context) {
    throw new Error("useToggleGroup must be used within <ToggleGroup>")
  }
  return context
}

function ToggleGroup({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <ToggleGroupContext.Provider value={{ variant, size }}>
      <ToggleGroupPrimitive.Root
        data-slot="toggle-group"
        className={cn("inline-flex items-center justify-center gap-1", className)}
        {...props}
      />
    </ToggleGroupContext.Provider>
  )
}

function ToggleGroupItem({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = useToggleGroup()

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        toggleVariants({
          variant: variant || context.variant,
          size: size || context.size,
          className,
        })
      )}
      {...props}
    />
  )
}

export { ToggleGroup, ToggleGroupItem }
