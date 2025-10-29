import * as React from "react";

type Variant = "default" | "success" | "warning" | "error" | "info";

export interface NBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

function cx(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const MAP: Record<Variant, string> = {
  default: "badge",
  success: "badge badge-success",
  warning: "badge badge-warning",
  error: "badge badge-error",
  info: "badge badge-info",
};

export default function NBadge({ variant = "default", className, ...props }: NBadgeProps) {
  return <span className={cx(MAP[variant], className)} {...props} />;
}

