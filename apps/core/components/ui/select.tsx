import * as React from "react";
import { cn } from "@/lib/utils";

type SelectRootProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
};

type SelectItemProps = {
  value: string;
  children: React.ReactNode;
};

const SelectValue: React.FC<{ placeholder?: string; className?: string } & React.HTMLAttributes<HTMLSpanElement>> = ({
  placeholder,
  className,
  ...props
}) => <span data-placeholder={placeholder} className={cn("truncate", className)} {...props} />;
SelectValue.displayName = "SelectValue";

const SelectItem: React.FC<SelectItemProps> = ({ children }) => <>{children}</>;
SelectItem.displayName = "SelectItem";

const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
SelectContent.displayName = "SelectContent";

const SelectTrigger: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
      "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
      className
    )}
    {...props}
  >
    {children}
  </div>
);
SelectTrigger.displayName = "SelectTrigger";

function collectItems(children: React.ReactNode, items: Array<{ value: string; label: string }> = []) {
  React.Children.forEach(children as any, (child: any) => {
    if (!child) return;
    if (React.isValidElement(child)) {
      if (child.type && (child.type as any).displayName === "SelectItem") {
        const value = child.props.value as string;
        const label = typeof child.props.children === "string" ? child.props.children : String(value);
        items.push({ value, label });
      }
      if (child.props && child.props.children) collectItems(child.props.children, items);
    }
  });
  return items;
}

function findPlaceholder(children: React.ReactNode): string | undefined {
  let placeholder: string | undefined;
  React.Children.forEach(children as any, (child: any) => {
    if (placeholder) return;
    if (React.isValidElement(child)) {
      if (child.type && (child.type as any).displayName === "SelectValue") {
        placeholder = child.props.placeholder;
      } else if (child.props && child.props.children) {
        const inner = findPlaceholder(child.props.children);
        if (inner) placeholder = inner;
      }
    }
  });
  return placeholder;
}

const Select: React.FC<SelectRootProps> = ({ value, defaultValue, onValueChange, className, children }) => {
  const items = collectItems(children);
  const placeholder = findPlaceholder(children);
  const [internal, setInternal] = React.useState<string>(defaultValue || "");
  const current = value !== undefined ? value : internal;

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setInternal(e.target.value);
    onValueChange?.(e.target.value);
  }

  return (
    <div className={cn("relative", className)}>
      <SelectTrigger>
        <select
          className={cn(
            "absolute inset-0 h-10 w-full appearance-none bg-transparent outline-none opacity-0",
            "peer"
          )}
          value={current}
          onChange={handleChange}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {items.map((it) => (
            <option key={it.value} value={it.value}>
              {it.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none flex w-full items-center justify-between text-sm text-muted-foreground">
          <span>
            {items.find((i) => i.value === current)?.label || placeholder || "Selecionar"}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </div>
      </SelectTrigger>
      {/* Content is not rendered separately in this minimal implementation */}
      <SelectContent>{children}</SelectContent>
    </div>
  );
};
Select.displayName = "Select";

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };

