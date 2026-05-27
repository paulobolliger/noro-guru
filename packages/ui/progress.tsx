import * as React from "react"

type ProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: number
}

export function Progress({ value = 0, className, ...props }: ProgressProps) {
  const boundedValue = Math.max(0, Math.min(100, value))

  return (
    <div
      className={`relative h-2 w-full overflow-hidden rounded-full bg-slate-200 ${className || ""}`}
      {...props}
    >
      <div
        className="h-full bg-slate-900 transition-all"
        style={{ width: `${boundedValue}%` }}
      />
    </div>
  )
}

