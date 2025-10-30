"use client";
import * as React from "react";

type Variant = "primary" | "secondary" | "tertiary" | "destructive";
type Size = "sm" | "md" | "lg";

export interface NButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

function cx(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const VARIANT: Record<Variant, string> = {
  primary:
    "btn-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1DD3C0]/45",
  secondary:
    "btn-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1DD3C0]/35",
  tertiary:
    "text-secondary hover:text-primary hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1DD3C0]/30 rounded-md",
  destructive:
    "bg-rose-600 hover:bg-rose-700 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/40",
};

const SIZE: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-4 py-2 text-sm rounded-lg",
  lg: "px-5 py-2.5 text-base rounded-lg",
};

export default function NButton({
  variant = "secondary",
  size = "md",
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...props
}: NButtonProps) {
  return (
    <button
      className={cx(
        "inline-flex items-center gap-2 font-semibold transition-all focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed",
        VARIANT[variant],
        SIZE[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}
