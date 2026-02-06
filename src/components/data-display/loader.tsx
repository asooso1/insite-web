import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const loaderVariants = cva("animate-spin text-muted-foreground", {
  variants: {
    size: {
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-8 w-8",
      xl: "h-12 w-12",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface LoaderProps extends VariantProps<typeof loaderVariants> {
  className?: string;
}

/**
 * 로딩 스피너 컴포넌트
 *
 * @example
 * <Loader />
 * <Loader size="lg" />
 */
export function Loader({ size, className }: LoaderProps): ReactNode {
  return <Loader2 className={cn(loaderVariants({ size }), className)} />;
}

interface FullPageLoaderProps {
  message?: string;
}

/**
 * 전체 페이지 로딩 컴포넌트
 *
 * @example
 * <FullPageLoader message="데이터를 불러오는 중..." />
 */
export function FullPageLoader({ message }: FullPageLoaderProps): ReactNode {
  return (
    <div className="fixed inset-0 z-loader flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Loader size="xl" />
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    </div>
  );
}

interface InlineLoaderProps {
  message?: string;
  className?: string;
}

/**
 * 인라인 로딩 컴포넌트
 *
 * @example
 * <InlineLoader message="로딩 중..." />
 */
export function InlineLoader({
  message,
  className,
}: InlineLoaderProps): ReactNode {
  return (
    <div className={cn("flex items-center justify-center gap-2 py-8", className)}>
      <Loader size="md" />
      {message && (
        <span className="text-sm text-muted-foreground">{message}</span>
      )}
    </div>
  );
}
