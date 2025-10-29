"use client";
import * as React from "react";

export interface NSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

function cx(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function NSelect({ className, children, ...props }: NSelectProps) {
  return (
    <select
      className={cx(
        "px-3 py-2 rounded-lg border border-default bg-white/5 text-primary focus:outline-none focus:ring-2 focus:ring-indigo-400/40",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

