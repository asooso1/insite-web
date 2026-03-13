# 컴포넌트 패턴 표준

적용 대상: `**/*.tsx`

## 목록 페이지 패턴

```
page.tsx (목록)
├── PageHeader (제목 + 설명 + 우측 액션 버튼)
├── 필터 바 (검색 입력 + 탭/셀렉트 필터)
├── DataTable (로딩/빈 상태 포함)
└── 페이지네이션 (DataTable 내장)
```

**필수 사항:**
- `DataTable` 컴포넌트 사용 (일반 `<table>` 태그 직접 사용 금지)
- 초기 로딩: `Skeleton` (컨텐츠 구조 반영)
- 빈 데이터: `EmptyState` with 등록 유도 버튼
- 에러: `EmptyState` with 재시도 버튼

## 상세 페이지 패턴

```
[id]/page.tsx (상세)
├── PageHeader (제목 + 뒤로가기 + 수정/삭제 버튼)
├── Tabs (기본정보 / 관련 데이터1 / 관련 데이터2 ...)
│   ├── TabsTrigger (탭 메뉴)
│   └── TabsContent
│       └── InfoPanel (레이블-값 목록)
└── 삭제: AlertDialog 확인 후 실행
```

## 폼 페이지 패턴

```
new/page.tsx 또는 [id]/edit/page.tsx
├── PageHeader (제목 + 뒤로가기)
└── _components/{module}-form.tsx
    ├── React Hook Form + Zod 스키마
    ├── FormField 컴포넌트 (label + input + error)
    ├── 취소 버튼 (router.back())
    └── 저장 버튼 (isPending 로딩 상태)
```

**필수 사항:**
- React Hook Form + Zod 스키마 조합 필수
- 성공: `toast.success("등록/수정되었습니다.")`
- 실패: `handleApiError(error)`
- 필수 필드: `label` 끝에 `*` 표시

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

// 실시간성 중요한 경우
useQuery({
  staleTime: 0, // 의도적 설정임을 주석으로 명시
});
```

**refetchOnWindowFocus 기본값:** 불필요한 재요청 방지 위해 QueryClient에서 `false` 설정

**staleTime 점진적 적용 가이드:**
- **신규 모듈**: 반드시 staleTime 설정 후 구현
- **기존 모듈**: 점진적 마이그레이션 (월 1~2개 모듈 단위로 추가)
- **우선순위**: 사용 빈도 높은 모듈 먼저 (work-orders, facilities)
- 기존 모듈에 staleTime 없어도 빌드/기능 오류가 아니므로 즉시 적용 불필요

## 접근성 (A11y) 필수 속성

```typescript
// 서브메뉴 버튼
<button
  aria-expanded={isOpen}
  aria-controls={`submenu-${id}`}
>

// 서브메뉴 목록
<div id={`submenu-${id}`} role="list">

// 모달 트리거
<button aria-haspopup="dialog">

// 현재 페이지 링크
<Link aria-current={isActive ? "page" : undefined}>

// 아이콘 전용 버튼
<Button aria-label="삭제">
  <Trash2 className="h-4 w-4" aria-hidden="true" />
</Button>
```

## 색상/상태 시스템

**상태 배지 색상 기준 (StatusBadge 컴포넌트 사용):**
- 활성/정상/완료: `success` (green)
- 비활성/중단: `secondary` (gray)
- 진행중/처리중: `default` (blue)
- 경고/지연: `warning` (yellow/orange)
- 오류/폐기: `destructive` (red)

**직접 색상 클래스 사용 금지:**
```typescript
// 금지
<span className="text-green-600">운영중</span>

// 허용
<StatusBadge status={FacilityState.ONGOING_OPERATING} />
```

## 폼 필드 간격 표준

```typescript
// 표준 폼 레이아웃
<form className="space-y-4">        // 필드 간격 16px
  <div className="grid grid-cols-2 gap-4"> // 2열 그리드
    <FormField label="제목" required>
      <Input ... />
    </FormField>
    <FormField label="상태">
      <Select ... />
    </FormField>
  </div>
</form>
```

## 체크리스트

- [ ] 목록: DataTable 사용, 로딩/에러/빈 상태 처리
- [ ] 상세: InfoPanel + 탭 구조
- [ ] 폼: React Hook Form + Zod, toast 피드백
- [ ] 삭제: AlertDialog 사용
- [ ] staleTime 설정됨 (목록 30s, 상세 60s)
- [ ] ARIA 속성 적용됨
- [ ] StatusBadge 컴포넌트 사용 (직접 색상 금지)
