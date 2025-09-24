import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

export default function Loading({ className, size = "default", text = "Loading..." }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Loader2 className={cn("animate-spin", sizeClasses[size])} />
      {text && <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>}
    </div>
  );
}