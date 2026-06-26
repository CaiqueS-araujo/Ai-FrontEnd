import type { ButtonHTMLAttributes } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export function IconButton({ label, className = "", ...props }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={`inline-flex items-center justify-center rounded p-2 text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none ${className}`}
      {...props}
    />
  );
}
