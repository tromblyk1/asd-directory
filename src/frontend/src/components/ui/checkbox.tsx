import * as React from "react";

export function Checkbox({
  checked,
  onCheckedChange,
  className = "",
  ...props
}: {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
}
