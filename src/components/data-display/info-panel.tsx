import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// ============================================================================
// Variants
// ============================================================================

const itemVariants = cva(
  "flex items-start justify-between gap-4 py-2.5",
  {
    variants: {
      layout: {
        horizontal: "flex-row",
        vertical: "flex-col gap-1",
      },
    },
    defaultVariants: {
      layout: "horizontal",
    },
  }
);

// ============================================================================
// Types
// ============================================================================

export interface InfoItem {
  /** 레이블 (키) */
  label: string;
  /** 값 */
  value: ReactNode;
  /** 추가 설명 */
  description?: string;
  /** 값 복사 가능 여부 */
  copyable?: boolean;
  /** 숨김 여부 */
  hidden?: boolean;
}

export interface InfoPanelProps extends VariantProps<typeof itemVariants> {
  /** 제목 */
  title?: string;
  /** 정보 항목 목록 */
  items: InfoItem[];
  /** 구분선 표시 여부 */
  showDivider?: boolean;
  /** 빈 값 대체 텍스트 */
  emptyText?: string;
  /** 로딩 상태 */
  loading?: boolean;
  /** 로딩 시 표시할 항목 수 */
  loadingItemCount?: number;
  /** 추가 클래스명 */
  className?: string;
  /** 컬럼 수 (반응형) */
  columns?: 1 | 2;
}

// ============================================================================
// Component
// ============================================================================

/**
 * 정보 패널 컴포넌트
 *
 * Key-Value 형태의 정보를 표시하는 패널입니다.
 * 상세 정보, 속성 목록, 메타데이터 표시에 적합합니다.
 *
 * @features
 * - Key-Value 리스트 형식
 * - 가로/세로 레이아웃 옵션
 * - 구분선 표시 옵션
 * - 로딩 스켈레톤
 * - 2컬럼 레이아웃 지원
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <InfoPanel
 *   title="빌딩 정보"
 *   items={[
 *     { label: "빌딩명", value: "서울타워" },
 *     { label: "주소", value: "서울시 중구 ..." },
 *     { label: "연면적", value: "25,000 m²" },
 *     { label: "준공일", value: "2020-01-15" },
 *   ]}
 * />
 *
 * // 2컬럼 레이아웃
 * <InfoPanel
 *   title="센서 상세"
 *   items={[...]}
 *   columns={2}
 *   showDivider
 * />
 * ```
 */
export function InfoPanel({
  title,
  items,
  layout = "horizontal",
  showDivider = false,
  emptyText = "-",
  loading = false,
  loadingItemCount = 4,
  className,
  columns = 1,
}: InfoPanelProps): ReactNode {
  // 숨김 처리된 항목 필터링
  const visibleItems = items.filter((item) => !item.hidden);

  // 로딩 스켈레톤
  const renderLoadingSkeleton = (): ReactNode => {
    return Array.from({ length: loadingItemCount }).map((_, index) => (
      <div
        key={`skeleton-${index}`}
        className={cn(itemVariants({ layout }), "animate-pulse")}
      >
        <div className="h-4 w-20 rounded bg-muted" />
        <div className="h-4 w-32 rounded bg-muted" />
      </div>
    ));
  };

  // 항목 렌더링
  const renderItem = (item: InfoItem, index: number): ReactNode => {
    const isLast = index === visibleItems.length - 1;

    return (
      <div key={`${item.label}-${index}`}>
        <div className={cn(itemVariants({ layout }))}>
          {/* 레이블 */}
          <span className="text-sm text-muted-foreground shrink-0">
            {item.label}
          </span>

          {/* 값 */}
          <div
            className={cn(
              "text-sm font-medium",
              layout === "horizontal" && "text-right"
            )}
          >
            {item.value === null ||
            item.value === undefined ||
            item.value === "" ? (
              <span className="text-muted-foreground">{emptyText}</span>
            ) : (
              item.value
            )}
            {item.description && (
              <p className="mt-0.5 text-xs text-muted-foreground font-normal">
                {item.description}
              </p>
            )}
          </div>
        </div>

        {/* 구분선 */}
        {showDivider && !isLast && <Separator className="my-0" />}
      </div>
    );
  };

  // 2컬럼 레이아웃
  const renderColumns = (): ReactNode => {
    if (columns === 1) {
      return visibleItems.map((item, index) => renderItem(item, index));
    }

    // 2컬럼으로 분할
    const midpoint = Math.ceil(visibleItems.length / 2);
    const leftItems = visibleItems.slice(0, midpoint);
    const rightItems = visibleItems.slice(midpoint);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        <div>{leftItems.map((item, index) => renderItem(item, index))}</div>
        <div>
          {rightItems.map((item, index) =>
            renderItem(item, index + midpoint)
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn(!title && "pt-4")}>
        {loading ? renderLoadingSkeleton() : renderColumns()}

        {/* 빈 상태 */}
        {!loading && visibleItems.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            표시할 정보가 없습니다.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// InfoRow (단일 행)
// ============================================================================

interface InfoRowProps {
  /** 레이블 */
  label: string;
  /** 값 */
  value: ReactNode;
  /** 레이아웃 */
  layout?: "horizontal" | "vertical";
  /** 추가 클래스명 */
  className?: string;
}

/**
 * 단일 정보 행 컴포넌트
 *
 * Card 없이 Key-Value 쌍만 표시할 때 사용합니다.
 *
 * @example
 * ```tsx
 * <InfoRow label="이름" value="홍길동" />
 * <InfoRow label="연락처" value="010-1234-5678" />
 * ```
 */
export function InfoRow({
  label,
  value,
  layout = "horizontal",
  className,
}: InfoRowProps): ReactNode {
  return (
    <div className={cn(itemVariants({ layout }), className)}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-sm font-medium",
          layout === "horizontal" && "text-right"
        )}
      >
        {value ?? "-"}
      </span>
    </div>
  );
}

// ============================================================================
// InfoGroup (섹션 그룹)
// ============================================================================

interface InfoGroupProps {
  /** 섹션 제목 */
  title?: string;
  /** 자식 요소 */
  children: ReactNode;
  /** 추가 클래스명 */
  className?: string;
}

/**
 * 정보 그룹 컴포넌트
 *
 * 여러 InfoRow를 그룹화할 때 사용합니다.
 *
 * @example
 * ```tsx
 * <InfoGroup title="기본 정보">
 *   <InfoRow label="이름" value="홍길동" />
 *   <InfoRow label="부서" value="시설관리팀" />
 * </InfoGroup>
 * ```
 */
export function InfoGroup({
  title,
  children,
  className,
}: InfoGroupProps): ReactNode {
  return (
    <div className={cn("space-y-1", className)}>
      {title && (
        <h4 className="text-sm font-semibold text-foreground mb-2">{title}</h4>
      )}
      <div className="space-y-0">{children}</div>
    </div>
  );
}
