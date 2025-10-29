"use client";
import * as React from "react";

type Variant = "success" | "warning" | "error" | "info";

export interface NAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  icon?: React.ReactNode;
  title?: string;
}

function cx(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const MAP: Record<Variant, string> = {
  success: "alert alert-success",
  warning: "alert alert-warning",
  error: "alert alert-error",
  info: "alert alert-info",
};

export default function NAlert({ variant = "info", icon, title, className, children, ...props }: NAlertProps) {
  return (
    <div className={cx(MAP[variant], className)} role="alert" {...props}>
      {icon}
      <div>
        {title && <div className="font-semibold mb-0.5">{title}</div>}
        {children}
      </div>
    </div>
  );
}

