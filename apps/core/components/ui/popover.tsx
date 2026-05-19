// components/ui/popover.tsx
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type PopoverContextType = {
  open: boolean
  setOpen: (open: boolean) => void
}

const PopoverContext = React.createContext<PopoverContextType | null>(null)

function usePopoverContext() {
  const ctx = React.useContext(PopoverContext)
  if (!ctx) {
    throw new Error("Popover components must be used within <Popover>.")
  }
  return ctx
}

type PopoverProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

function Popover({ open, onOpenChange, children }: PopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = typeof open === "boolean"
  const isOpen = isControlled ? (open as boolean) : internalOpen

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen)
      }
      onOpenChange?.(nextOpen)
    },
    [isControlled, onOpenChange]
  )

  return <PopoverContext.Provider value={{ open: isOpen, setOpen }}>{children}</PopoverContext.Provider>
}

type PopoverTriggerProps = {
  asChild?: boolean
  children: React.ReactNode
  className?: string
}

function PopoverTrigger({ asChild = false, children, className }: PopoverTriggerProps) {
  const { setOpen } = usePopoverContext()

  if (asChild && React.isValidElement(children)) {
    const originalOnClick = (children.props as { onClick?: (event: React.MouseEvent) => void }).onClick
    return React.cloneElement(children, {
      onClick: (event: React.MouseEvent) => {
        originalOnClick?.(event)
        setOpen(true)
      },
    })
  }

  return (
    <button type="button" className={className} onClick={() => setOpen(true)}>
      {children}
    </button>
  )
}

type PopoverContentProps = React.HTMLAttributes<HTMLDivElement> & {
  align?: "start" | "center" | "end"
  sideOffset?: number
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, align = "center", sideOffset = 4, children, ...props }, ref) => {
    const { open, setOpen } = usePopoverContext()
    if (!open) return null

    const alignClass =
      align === "start" ? "left-0" : align === "end" ? "right-0" : "left-1/2 -translate-x-1/2"

    return (
      <div className="fixed inset-0 z-50" onClick={() => setOpen(false)}>
        <div
          ref={ref}
          className={cn(
            "absolute mt-2 w-auto rounded-md border shadow-md outline-none bg-white text-gray-900",
            alignClass,
            className
          )}
          style={{ top: sideOffset + 44 }}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {children}
        </div>
      </div>
    )
  }
)
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }