# Phase 2A: 핵심 데이터 컴포넌트 + 폼 시스템 + 차트 ✅ 완료

> 이 Phase는 완료되었습니다. (2026-02-12)

## 개요

Phase 1에서 구축한 기반 위에 재사용 가능한 데이터 컴포넌트, 폼 시스템, 차트 시스템을 구축합니다.
이 컴포넌트들은 Phase 3 이후 모든 페이지에서 사용됩니다.

## 2A.1 데이터 디스플레이 컴포넌트

| 컴포넌트 | 상태 | 설명 |
|----------|------|------|
| DataTable | ✅ | TanStack Table v8 + 가상화, variant: default/striped/category |
| DataTable Toolbar | ✅ | 검색 + 필터바 |
| DataTable Pagination | ✅ | 페이지네이션 통합 |
| KPICard | ✅ | Rajdhani 폰트 숫자 + 트렌드 표시 (Phase 1에서 생성됨) |
| StatWidget | ✅ | 스파크라인 차트 포함 미니 통계 위젯 |
| InfoPanel | ✅ | Key-Value 리스트, InfoRow, InfoGroup |
| EmptyState | ✅ | 아이콘 + 메시지 + 액션 (Phase 1에서 생성됨) |

### DataTable 구현 가이드

```typescript
// 위치: components/data-display/data-table.tsx
// 의존성: @tanstack/react-table, @tanstack/react-virtual

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  variant?: 'default' | 'striped' | 'category';
  pagination?: boolean;
  virtualScroll?: boolean;  // 1000+ 행에서 활성화
  toolbar?: React.ReactNode;
}
```

## 2A.2 폼 시스템

| 컴포넌트 | 상태 | 설명 |
|----------|------|------|
| FormField | ✅ | label + input + helper + error, react-hook-form 통합 |
| EnumSelect | ⏳ | Java Enum 기반 드롭다운 (필요시 구현) |
| CascadingSelect | ✅ | 회사→지역→빌딩→층, React Query dependent queries |
| SearchFilterBar | ✅ | 검색 + 필터 + URL 상태 동기화 (nuqs) |
| DatePicker | ✅ | 날짜 선택기, 한국어 로케일 |
| MonthPicker | ✅ | 월 선택기, 년도 네비게이션 |
| FileUpload | ✅ | 드래그앤드롭 + 이미지 미리보기 |

### CascadingSelect 구현 가이드

```typescript
// 위치: components/forms/cascading-select.tsx
// 참조: csp-web vueCommon.js lines 687-881

// React Query dependent queries 패턴 사용
const { data: areas } = useQuery({
  queryKey: ['areas', companyId],
  queryFn: () => fetchAreas(companyId),
  enabled: !!companyId,
});

const { data: buildings } = useQuery({
  queryKey: ['buildings', areaId],
  queryFn: () => fetchBuildings(areaId),
  enabled: !!areaId,
});
```

## 2A.3 차트 시스템 (Recharts)

| 컴포넌트 | 상태 | 설명 |
|----------|------|------|
| ChartContainer | ✅ | shadcn/ui chart.tsx 포함 |
| ChartTooltip | ✅ | shadcn/ui chart.tsx 포함 |
| ChartLegend | ✅ | shadcn/ui chart.tsx 포함 |
| BarChart 프리셋 | ✅ | 막대 차트 |
| LineChart 프리셋 | ✅ | 선 차트 |
| AreaChart 프리셋 | ✅ | 영역 차트 |
| PieChart 프리셋 | ✅ | 파이 차트 |
| RadarChart 프리셋 | ⏳ | 레이더 차트 (필요시 구현) |
| ComboChart 프리셋 | ⏳ | 복합 차트 (필요시 구현) |
| chart-colors.ts | ✅ | 시리즈 수별 자동 categorical 팔레트 |

### 차트 컬러 시스템

```typescript
// 위치: lib/utils/chart-colors.ts
// CSS 변수 사용: --chart-blue-10 ~ --chart-blue-90 등

export function getChartColors(seriesCount: number): string[] {
  // 시리즈 수에 따라 최적 팔레트 반환
}
```

## 2A.4 테스트

- [ ] 디자인 토큰 무결성 테스트 (CSS 변수 정의 검증)
- [ ] 다크 테마 누락 체크
- [ ] 컴포넌트 렌더링 테스트 (모든 variant × size 조합)
- [ ] 접근성 테스트 (jest-axe)
- [ ] Unit/Integration 테스트

## 작업 순서 권장

1. **DataTable 시스템** (가장 많이 사용됨)
   - DataTable 기본 구현
   - Toolbar 통합
   - Pagination 통합
   - 가상화 옵션

2. **폼 시스템**
   - FormField 래퍼
   - CascadingSelect (복잡도 높음)
   - DatePicker/MonthPicker
   - SearchFilterBar
   - FileUpload

3. **차트 시스템**
   - ChartContainer
   - chart-colors.ts
   - 각 차트 프리셋

4. **테스트**
   - 각 컴포넌트별 테스트 작성

## 의존성

```bash
# 이미 설치됨: recharts
# 추가 필요:
npm install @tanstack/react-table @tanstack/react-virtual
```

## 완료 기준

- [ ] 모든 컴포넌트 구현 완료
- [ ] Storybook 또는 테스트 페이지에서 동작 확인
- [ ] 다크 모드 지원 확인
- [ ] 테스트 커버리지 80% 이상
- [ ] 빌드 성공
