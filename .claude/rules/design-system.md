# 디자인 시스템 규칙

적용 대상: `**/*.tsx`, `src/components/**`

## 컴포넌트 사용 원칙

**금지 패턴:**
```typescript
// ❌ 직접 색상 클래스 사용
<span className="text-green-600 bg-green-100">운영중</span>
<input type="checkbox" className="h-4 w-4 rounded border-gray-300" />

// ✅ 컴포넌트 사용
<StatusBadge status={state} />
<Checkbox />  // shadcn/ui Checkbox 컴포넌트
```

**섀도우 통일:**
```typescript
// ❌ 혼용 금지
shadow-sm          // Tailwind 직접
shadow-[var(--shadow-card)]  // CSS 변수

// ✅ CSS 변수로 통일 (globals.css 기준)
shadow-[var(--shadow-card)]   // 카드
shadow-[var(--shadow-panel)]  // 패널
```

---

## 상태 표현 패턴

**4가지 상태 필수 처리:**
```typescript
// 목록 페이지 필수 상태
if (isLoading) return <DataTableSkeleton columns={5} rows={10} />;
if (isError)   return <EmptyState type="error" onRetry={refetch} />;
if (!data?.length) return <EmptyState type="no-data" />;
// 정상 렌더링
```

**빈 상태 구분:**
- 데이터 없음: `<EmptyState type="no-data">` + 등록 유도 버튼
- 검색 결과 없음: `<EmptyState type="no-results">` + 필터 초기화 버튼
- 에러: `<EmptyState type="error">` + 재시도 버튼

**스켈레톤 높이 표준:**
| 컴포넌트 | 높이 |
|---------|------|
| 테이블 행 | `h-10` |
| 카드 제목 | `h-5` |
| 카드 내용 | `h-4` |
| KPI 수치 | `h-9` |

---

## 폼 에러 처리

```typescript
// FormField의 aria-invalid를 Input에 전달해야 함
<FormField name="userId" error={errors.userId?.message}>
  <Input
    aria-invalid={!!errors.userId}  // 필수
    aria-describedby={errors.userId ? "userId-error" : undefined}
    {...register("userId")}
  />
</FormField>
```

---

## 반응형 브레이크포인트

**기준 (일관되게 사용):**
- 모바일: `< lg` (1024px 미만) → 드로어 사이드바
- 데스크톱: `lg+` (1024px 이상) → 고정 사이드바

**금지:** `hidden sm:flex`, `md:flex`, `hidden lg:block` 혼용 금지 → `lg:` 기준 통일

**카드 패딩:** 페이지 컨테이너와 일치 (`p-4 md:p-6`, 카드 내부 `p-4 md:p-6`)

---

## 애니메이션

```typescript
// ❌ 무조건 애니메이션 적용 금지
<div className="animate-in fade-in slide-in-from-top-2">

// ✅ prefers-reduced-motion 확인 후 적용
import { useMotionPreference } from "@/lib/hooks/use-motion-preference";

const { prefersReducedMotion } = useMotionPreference();
<div className={prefersReducedMotion ? "" : "animate-in fade-in slide-in-from-top-2"}>
```

---

## 접근성 (WCAG 2.1 AA)

**필수 ARIA 속성:**
```typescript
// 서브메뉴
<button aria-expanded={open} aria-controls={`submenu-${id}`}>
<div id={`submenu-${id}`} role="list">

// 아이콘 전용 버튼
<Button aria-label="삭제"><Trash2 aria-hidden="true" /></Button>

// 현재 페이지 링크
<Link aria-current={isActive ? "page" : undefined}>
```

**다크모드 대비율 주의:**
```typescript
// ❌ opacity 축소로 대비 부족 (3.2:1 - WCAG 실패)
dark:bg-blue-900/30 dark:text-blue-400

// ✅ 불투명 배경으로 대비 확보 (4.5:1 이상)
dark:bg-blue-900 dark:text-blue-300
```

---

## 타이포그래피 스케일

| 요소 | 클래스 |
|------|--------|
| 페이지 제목 | `text-xl font-semibold` |
| 섹션 제목 | `text-base font-semibold` |
| 카드 제목 | `text-base font-semibold` |
| 필드 레이블 | `text-sm font-medium` |
| 헬퍼/에러 텍스트 | `text-xs text-muted-foreground` |
| KPI 수치 | `font-display tabular-nums` |

---

## 네비게이션 패턴

**상세 페이지:** 반드시 뒤로가기 버튼 포함 (`router.back()`)
```typescript
// PageHeader에 뒤로가기 필수
<PageHeader
  title="작업 상세"
  backButton={{ label: "목록으로", onClick: () => router.back() }}
/>
```

**Breadcrumb:** 3단계 이상 계층 구조일 때 사용 (`src/components/ui/breadcrumb.tsx` 존재)

---

## DataTable 패턴

**열 정렬:**
- 텍스트 열: 좌측 정렬 (기본)
- 숫자/금액 열: 우측 정렬 (`className="text-right"`)
- 상태 배지 열: 중앙 정렬 (`className="text-center"`)

**행 선택:** 테이블 헤더 raw `<input type="checkbox">` 사용 금지 → `Checkbox` 컴포넌트

---

## 체크리스트

- [ ] 상태 배지: `StatusBadge` 컴포넌트 사용 (직접 색상 금지)
- [ ] 체크박스: `Checkbox` 컴포넌트 사용 (raw input 금지)
- [ ] 로딩/빈/에러 상태 3가지 모두 처리됨
- [ ] 애니메이션: `useMotionPreference` 확인
- [ ] 반응형: `lg:` 기준 통일
- [ ] 아이콘 버튼: `aria-label` 포함
- [ ] 다크모드 대비율: opacity 축소 없음
- [ ] 상세 페이지: 뒤로가기 버튼 포함
