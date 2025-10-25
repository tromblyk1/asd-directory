import * as React from "react";

export function Card({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={`rounded-2xl border bg-white shadow-sm ${props.className || ""}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`p-4 ${props.className || ""}`}>{children}</div>;
}
