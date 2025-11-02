import type { ChangeEvent, InputHTMLAttributes } from "react";

type CheckboxProps = {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "checked" | "onChange">;

export function Checkbox({
  checked,
  onCheckedChange,
  className = "",
  ...props
}: CheckboxProps) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(event: ChangeEvent<HTMLInputElement>) => onCheckedChange?.(event.target.checked)}
      className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
}
