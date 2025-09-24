import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

const buttonVariants = {
  default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md",
  secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-500 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600",
  outline: "border border-slate-300 bg-transparent hover:bg-slate-50 focus:ring-slate-500 dark:border-slate-600 dark:hover:bg-slate-800/50",
  ghost: "bg-transparent hover:bg-slate-100 focus:ring-slate-500 dark:hover:bg-slate-800/50",
  destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md"
} as const;

const buttonSizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg"
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  loading?: boolean;
}

export default function Button({ 
  children, 
  variant = "default", 
  size = "md", 
  className, 
  disabled,
  loading,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-blue-400 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed",
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 mr-2 spinner" />
      )}
      {children}
    </button>
  );
}