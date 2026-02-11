"use client";

import { type ReactNode, useEffect } from "react";
import {
  type Control,
  type FieldPath,
  type FieldValues,
  type PathValue,
  useController,
  useWatch,
} from "react-hook-form";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface CascadeOption {
  label: string;
  value: string;
}

export interface CascadeLevelConfig<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  /** 필드 이름 */
  name: TName;
  /** 라벨 */
  label?: string;
  /** 플레이스홀더 */
  placeholder?: string;
  /** 옵션 조회 함수 (상위 값 의존) */
  queryFn: (parentValue: string | null) => Promise<CascadeOption[]>;
  /** React Query 키 접두사 */
  queryKeyPrefix: string;
  /** 상위 레벨 인덱스 (첫 번째 레벨은 null) */
  parentLevelIndex?: number | null;
  /** 필수 여부 */
  required?: boolean;
  /** 비활성화 여부 */
  disabled?: boolean;
}

export interface CascadingSelectProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  /** react-hook-form control */
  control: Control<TFieldValues>;
  /** 캐스케이드 레벨 설정 배열 */
  levels: CascadeLevelConfig<TFieldValues>[];
  /** 레이아웃 방향 */
  direction?: "horizontal" | "vertical";
  /** 컬럼 수 (horizontal에서만 적용) */
  columns?: 2 | 3 | 4;
  /** 컨테이너 클래스명 */
  className?: string;
}

// ============================================================================
// Single Cascade Level Component
// ============================================================================

interface CascadeLevelProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  config: CascadeLevelConfig<TFieldValues, TName>;
  parentValue: string | null;
  onValueChange?: (value: string | undefined) => void;
}

function CascadeLevel<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  config,
  parentValue,
}: CascadeLevelProps<TFieldValues, TName>): ReactNode {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name: config.name,
  });

  // 상위 값이 있을 때만 쿼리 활성화 (첫 번째 레벨은 항상 활성화)
  const isEnabled = config.parentLevelIndex === null || config.parentLevelIndex === undefined || !!parentValue;

  const { data: options = [], isLoading } = useQuery({
    queryKey: [config.queryKeyPrefix, parentValue],
    queryFn: () => config.queryFn(parentValue),
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000, // 5분
  });

  // 상위 값 변경 시 현재 값 초기화
  useEffect(() => {
    if (config.parentLevelIndex !== null && config.parentLevelIndex !== undefined) {
      // 상위 값이 변경되면 현재 값 초기화
      field.onChange(undefined as PathValue<TFieldValues, TName>);
    }
  }, [parentValue]);

  const isDisabled = config.disabled || !isEnabled || isLoading;

  return (
    <div className="space-y-2">
      {config.label && (
        <Label className={cn(error && "text-destructive")}>
          {config.label}
          {config.required && <span className="ml-1 text-destructive">*</span>}
        </Label>
      )}
      {isLoading && isEnabled ? (
        <Skeleton className="h-9 w-full" />
      ) : (
        <Select
          value={field.value ?? ""}
          onValueChange={(value) => {
            field.onChange(value as PathValue<TFieldValues, TName>);
          }}
          disabled={isDisabled}
        >
          <SelectTrigger
            aria-invalid={!!error}
            className={cn(
              error && "border-destructive focus:ring-destructive/50"
            )}
          >
            <SelectValue placeholder={config.placeholder ?? "선택하세요"} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {error?.message && (
        <p className="text-sm text-destructive">{error.message}</p>
      )}
    </div>
  );
}

// ============================================================================
// Main CascadingSelect Component
// ============================================================================

/**
 * 캐스케이딩 셀렉트 컴포넌트
 *
 * @features
 * - 다중 레벨 종속 선택 (회사→지역→빌딩→층)
 * - React Query 기반 데이터 fetching
 * - 상위 값 변경 시 하위 값 자동 초기화
 * - 로딩 상태 처리
 * - react-hook-form 통합
 *
 * @example
 * ```tsx
 * <CascadingSelect
 *   control={form.control}
 *   levels={[
 *     {
 *       name: "companyId",
 *       label: "회사",
 *       placeholder: "회사 선택",
 *       queryKeyPrefix: "companies",
 *       queryFn: () => fetchCompanies(),
 *       parentLevelIndex: null,
 *     },
 *     {
 *       name: "areaId",
 *       label: "지역",
 *       placeholder: "지역 선택",
 *       queryKeyPrefix: "areas",
 *       queryFn: (companyId) => fetchAreas(companyId),
 *       parentLevelIndex: 0,
 *     },
 *     {
 *       name: "buildingId",
 *       label: "빌딩",
 *       placeholder: "빌딩 선택",
 *       queryKeyPrefix: "buildings",
 *       queryFn: (areaId) => fetchBuildings(areaId),
 *       parentLevelIndex: 1,
 *     },
 *   ]}
 *   direction="horizontal"
 *   columns={3}
 * />
 * ```
 */
export function CascadingSelect<TFieldValues extends FieldValues = FieldValues>({
  control,
  levels,
  direction = "vertical",
  columns = 3,
  className,
}: CascadingSelectProps<TFieldValues>): ReactNode {
  // 모든 레벨의 값을 watch
  const watchedValues = useWatch({
    control,
    name: levels.map((level) => level.name),
  });

  const gridCols =
    direction === "horizontal"
      ? {
          2: "grid-cols-2",
          3: "grid-cols-3",
          4: "grid-cols-4",
        }[columns]
      : "";

  return (
    <div
      className={cn(
        direction === "horizontal" ? `grid gap-4 ${gridCols}` : "space-y-4",
        className
      )}
    >
      {levels.map((levelConfig, index) => {
        // 상위 레벨의 값 가져오기
        const parentValue =
          levelConfig.parentLevelIndex !== null &&
          levelConfig.parentLevelIndex !== undefined
            ? (watchedValues[levelConfig.parentLevelIndex] as string | null)
            : null;

        return (
          <CascadeLevel
            key={String(levelConfig.name)}
            control={control}
            config={levelConfig}
            parentValue={parentValue}
          />
        );
      })}
    </div>
  );
}

// ============================================================================
// Pre-built Location Cascading Select
// ============================================================================

export interface LocationCascadeValue {
  companyId?: string;
  areaId?: string;
  buildingId?: string;
  floorId?: string;
}

export interface LocationCascadingSelectProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  control: Control<TFieldValues>;
  /** 필드 이름 매핑 */
  fieldNames: {
    companyId: FieldPath<TFieldValues>;
    areaId?: FieldPath<TFieldValues>;
    buildingId?: FieldPath<TFieldValues>;
    floorId?: FieldPath<TFieldValues>;
  };
  /** API 엔드포인트 기본 URL */
  apiBaseUrl?: string;
  /** 포함할 레벨들 */
  includeLevels?: ("company" | "area" | "building" | "floor")[];
  /** 레이아웃 방향 */
  direction?: "horizontal" | "vertical";
  /** 클래스명 */
  className?: string;
}

/**
 * 위치 선택 전용 캐스케이딩 셀렉트
 * 회사 → 지역 → 빌딩 → 층 구조
 *
 * @example
 * ```tsx
 * <LocationCascadingSelect
 *   control={form.control}
 *   fieldNames={{
 *     companyId: "companyId",
 *     areaId: "areaId",
 *     buildingId: "buildingId",
 *   }}
 *   includeLevels={["company", "area", "building"]}
 *   direction="horizontal"
 * />
 * ```
 */
export function LocationCascadingSelect<
  TFieldValues extends FieldValues = FieldValues,
>({
  control,
  fieldNames,
  apiBaseUrl = "/api",
  includeLevels = ["company", "area", "building", "floor"],
  direction = "horizontal",
  className,
}: LocationCascadingSelectProps<TFieldValues>): ReactNode {
  // API 호출 함수들 (실제 구현 시 API 경로에 맞게 수정)
  const fetchCompanies = async (): Promise<CascadeOption[]> => {
    const response = await fetch(`${apiBaseUrl}/companies`);
    if (!response.ok) throw new Error("회사 목록 조회 실패");
    const data = await response.json();
    return data.map((item: { id: string; name: string }) => ({
      value: item.id,
      label: item.name,
    }));
  };

  const fetchAreas = async (companyId: string | null): Promise<CascadeOption[]> => {
    if (!companyId) return [];
    const response = await fetch(`${apiBaseUrl}/companies/${companyId}/areas`);
    if (!response.ok) throw new Error("지역 목록 조회 실패");
    const data = await response.json();
    return data.map((item: { id: string; name: string }) => ({
      value: item.id,
      label: item.name,
    }));
  };

  const fetchBuildings = async (areaId: string | null): Promise<CascadeOption[]> => {
    if (!areaId) return [];
    const response = await fetch(`${apiBaseUrl}/areas/${areaId}/buildings`);
    if (!response.ok) throw new Error("빌딩 목록 조회 실패");
    const data = await response.json();
    return data.map((item: { id: string; name: string }) => ({
      value: item.id,
      label: item.name,
    }));
  };

  const fetchFloors = async (buildingId: string | null): Promise<CascadeOption[]> => {
    if (!buildingId) return [];
    const response = await fetch(`${apiBaseUrl}/buildings/${buildingId}/floors`);
    if (!response.ok) throw new Error("층 목록 조회 실패");
    const data = await response.json();
    return data.map((item: { id: string; name: string }) => ({
      value: item.id,
      label: item.name,
    }));
  };

  // 레벨 설정 생성
  const levels: CascadeLevelConfig<TFieldValues>[] = [];
  let levelIndex = 0;

  if (includeLevels.includes("company")) {
    levels.push({
      name: fieldNames.companyId,
      label: "회사",
      placeholder: "회사 선택",
      queryKeyPrefix: "companies",
      queryFn: fetchCompanies,
      parentLevelIndex: null,
    });
    levelIndex++;
  }

  if (includeLevels.includes("area") && fieldNames.areaId) {
    levels.push({
      name: fieldNames.areaId,
      label: "지역",
      placeholder: "지역 선택",
      queryKeyPrefix: "areas",
      queryFn: fetchAreas,
      parentLevelIndex: levels.length > 0 ? levels.length - 1 : null,
    });
    levelIndex++;
  }

  if (includeLevels.includes("building") && fieldNames.buildingId) {
    levels.push({
      name: fieldNames.buildingId,
      label: "빌딩",
      placeholder: "빌딩 선택",
      queryKeyPrefix: "buildings",
      queryFn: fetchBuildings,
      parentLevelIndex: levels.length > 0 ? levels.length - 1 : null,
    });
    levelIndex++;
  }

  if (includeLevels.includes("floor") && fieldNames.floorId) {
    levels.push({
      name: fieldNames.floorId,
      label: "층",
      placeholder: "층 선택",
      queryKeyPrefix: "floors",
      queryFn: fetchFloors,
      parentLevelIndex: levels.length > 0 ? levels.length - 1 : null,
    });
  }

  return (
    <CascadingSelect
      control={control}
      levels={levels}
      direction={direction}
      columns={levels.length as 2 | 3 | 4}
      className={className}
    />
  );
}
