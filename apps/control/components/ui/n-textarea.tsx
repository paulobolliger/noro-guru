"use client";
import * as React from "react";

export interface NTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

function cx(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function NTextarea({ invalid, className, ...props }: NTextareaProps) {
  return (
    <textarea
      className={cx(
        "w-full px-4 py-2 rounded-lg border bg-white/5 text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-indigo-400/40",
        invalid ? "border-[var(--error)]" : "border-default",
        className
      )}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

