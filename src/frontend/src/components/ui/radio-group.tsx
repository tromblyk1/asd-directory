import * as React from "react";

export type RadioGroupProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">;

export function RadioGroup({
  value,
  onValueChange,
  className = "",
  children,
  ...props
}: RadioGroupProps) {
  return (
    <div
      role="radiogroup"
      aria-activedescendant={value}
      className={`grid gap-2 ${className}`}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          return child;
        }

        const isSelected =
          typeof child.props.value === "string" && child.props.value === value;

        return React.cloneElement(child, {
          "data-state": isSelected ? "checked" : "unchecked",
          onClick: (
            event: React.MouseEvent<HTMLButtonElement, MouseEvent>
          ) => {
            child.props.onClick?.(event);
            if (!event.defaultPrevented && typeof child.props.value === "string") {
              onValueChange?.(child.props.value);
            }
          },
        });
      })}
    </div>
  );
}
