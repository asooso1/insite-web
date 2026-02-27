import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderStat {
  label: string;
  value: number | string;
  variant?: "default" | "muted";
}

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  stats?: PageHeaderStat[];
  actions?: ReactNode;
  className?: string;
}

/**
 * 페이지 헤더 컴포넌트 (Server Component)
 * - 아이콘 + 제목 + 설명 + 통계 배지 + 액션 버튼
 * - CSS 애니메이션으로 입장 효과 (tw-animate-css 사용)
 */
export function PageHeader({
  title,
  description,
  icon: Icon,
  stats,
  actions,
  className,
}: PageHeaderProps): ReactNode {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4",
        "animate-in fade-in slide-in-from-top-2 duration-300 fill-mode-both",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="rounded-lg bg-primary/10 p-2 mt-0.5">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            {stats && stats.length > 0 && (
              <div className="flex items-center gap-2">
                {stats.map((stat, i) => (
                  <span
                    key={i}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
                      stat.variant === "muted"
                        ? "bg-muted text-muted-foreground"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    <span className="font-bold">{stat.value}</span>
                    <span>{stat.label}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  );
}
