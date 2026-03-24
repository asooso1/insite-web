# 컴포넌트 패턴 표준

적용 대상: `**/*.tsx`

---

## 목록 페이지 패턴

```
page.tsx ("use client") → PageHeader + FilterBar + DataTable
```

필수:
- `DataTable` 사용 (`<table>` 금지), `FilterBar` 사용 (직접 Input/Tabs 구성 금지)
- `StatusBadge` 사용 (직접 색상 클래스 금지)
- 빈 데이터: `<EmptyState type="no-data">`, 에러: `<EmptyState type="error" onRetry={refetch}>`
- 기존 모듈 참조: `src/app/(modules)/facilities/page.tsx`

## 상세 페이지 패턴

```
[id]/page.tsx (Server Component) → PageHeader + Tabs + InfoPanel
삭제: AlertDialog 확인 후 실행 (window.confirm 금지)
뒤로가기: _components/back-button.tsx (Client Component)로 분리
```

## 폼 페이지 패턴

```
new/ or [id]/edit/ → PageHeader + _components/{module}-form.tsx (Client Component)
폼: React Hook Form + zodResolver, 성공: toast.success(), 실패: handleApiError(error)
저장 버튼: disabled={isPending}, 취소: router.back()
```

기존 모듈 참조: `src/app/(modules)/facilities/new/page.tsx`

---

## React Query 표준 설정

```typescript
// 목록 쿼리
useQuery({
  queryKey: moduleKeys.list(params),
  queryFn: () => getModuleList(params),
  staleTime: 30 * 1000,        // 30초 필수
});

// 상세 쿼리
useQuery({
  queryKey: moduleKeys.detail(id),
  queryFn: () => getModuleDetail(id),
  enabled: id > 0,
  staleTime: 60 * 1000,        // 1분 필수
});

// 실시간성이 중요한 경우
useQuery({
  staleTime: 0, // 의도적 설정임을 주석으로 명시
});
```

**staleTime 기준:**
| 쿼리 유형 | staleTime |
|-----------|-----------|
| 목록 | `30 * 1000` (30초) |
| 상세 | `60 * 1000` (1분) |
| 정적 데이터(빌딩 목록 등) | `Infinity` |
| 실시간 필요 | `0` + 주석 |

**QueryClient 전역 설정 (`src/components/providers/query-provider.tsx`):**
```typescript
refetchOnWindowFocus: false  // 탭 전환 시 불필요한 재요청 방지
retry: 1                     // 실패 시 1회만 재시도
```

---

## 색상/상태 시스템

**StatusBadge 사용 기준:**
| 상태 의미 | StatusBadge status |
|---------|-------------------|
| 활성/정상/완료 | `completed` / `ONGOING_OPERATING` / `COMPLETE` |
| 비활성/중단/취소 | `cancelled` / `CANCEL` |
| 진행중/처리중 | `inProgress` / `PROCESSING` |
| 대기/작성 | `pending` / `WRITE` |
| 경고/긴급 | `high` / `urgent` |

**직접 색상 클래스 사용 금지:**
```typescript
// ❌ 금지
<span className="text-green-600">운영중</span>
<div className="bg-red-100 text-red-700">오류</div>

// ✅ 허용
<StatusBadge status="ONGOING_OPERATING" />
<StatusBadge status="urgent" />
```

---

## 폼 필드 간격 표준

```typescript
<form className="space-y-4">
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <FormField label="제목" required><Input {...} /></FormField>
    <FormField label="상태"><Select {...} /></FormField>
  </div>
  <FormField label="내용"><Textarea {...} /></FormField>
</form>
```

---

## DataTable 컬럼 정렬 기준

| 열 유형 | 정렬 | 방법 |
|--------|------|-----|
| 텍스트 | 좌측 (기본) | - |
| 숫자/금액 | 우측 | `meta: { className: "text-right" }` |
| 상태 배지 | 중앙 | `meta: { className: "text-center" }` |
| 날짜 | 좌측 | `className="text-muted-foreground"` |

---

## 접근성 (A11y) 필수 속성

```typescript
// 아이콘 전용 버튼
<Button aria-label="삭제">
  <Trash2 className="h-4 w-4" aria-hidden="true" />
</Button>

// 서브메뉴 버튼
<button aria-expanded={isOpen} aria-controls={`submenu-${id}`}>
<div id={`submenu-${id}`} role="list">

// 모달 트리거
<button aria-haspopup="dialog">

// 현재 페이지 링크
<Link aria-current={isActive ? "page" : undefined}>
```

---

## 체크리스트

- [ ] 목록: `DataTable` + `FilterBar` + `PageHeader` 사용
- [ ] 상세: `InfoPanel` + `Tabs` + `PageHeader` 구조
- [ ] 폼: `React Hook Form` + `Zod` + `toast` 피드백
- [ ] 삭제: `AlertDialog` 사용
- [ ] staleTime 설정됨 (목록 30s, 상세 60s)
- [ ] `StatusBadge` 컴포넌트 사용 (직접 색상 금지)
- [ ] ARIA 속성 적용됨
- [ ] 새 컴포넌트 → Stories 파일 생성
