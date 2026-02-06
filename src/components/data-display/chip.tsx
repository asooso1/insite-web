import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        primary: "bg-primary/10 text-primary",
        secondary: "bg-secondary text-secondary-foreground",
        success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        outline: "border border-border bg-transparent text-foreground",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface ChipProps extends VariantProps<typeof chipVariants> {
  children: ReactNode;
  className?: string;
  onRemove?: () => void;
  icon?: ReactNode;
}

/**
 * Chip 컴포넌트
 * - 태그, 상태, 카테고리 표시
 * - 제거 가능 옵션
 *
 * @example
 * <Chip variant="success">완료</Chip>
 * <Chip variant="warning" onRemove={() => {}}>진행중</Chip>
 */
export function Chip({
  children,
  className,
  variant,
  size,
  onRemove,
  icon,
}: ChipProps): ReactNode {
  return (
    <span className={cn(chipVariants({ variant, size }), className)}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
          aria-label="제거"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
