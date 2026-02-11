# 스킬: implement

> 태스크 구현 가이드 및 체크리스트

## 트리거

태스크 구현 시작 시

## 구현 워크플로우

### 1. 사전 확인

- [ ] 해당 태스크의 context 파일 확인
- [ ] 기존 csp-web 코드 참조 (필요시)
- [ ] 의존성 확인

### 2. 파일 생성/수정

**파일 명명 규칙:**
- 컴포넌트: `kebab-case.tsx` (예: `data-table.tsx`)
- 훅: `use-*.ts` (예: `use-cascading-select.ts`)
- 유틸리티: `*.ts` (예: `chart-colors.ts`)

**위치:**
```
src/components/
├── data-display/    # 데이터 표시 컴포넌트
├── forms/           # 폼 컴포넌트
├── charts/          # 차트 컴포넌트
├── widgets/         # 대시보드 위젯
└── ui/              # shadcn/ui 컴포넌트
```

### 3. 코드 작성 규칙

```typescript
// 필수: 한국어 JSDoc 주석
/**
 * 데이터 테이블 컴포넌트
 *
 * @description TanStack Table v8 기반 테이블 컴포넌트
 * @example
 * <DataTable columns={columns} data={data} />
 */
export function DataTable<T>({ ... }: DataTableProps<T>) {
  // 구현
}
```

### 4. 체크리스트

- [ ] TypeScript 타입 정의 완료
- [ ] 다크 모드 지원
- [ ] 반응형 대응 (필요시)
- [ ] 접근성 (ARIA 속성)
- [ ] 에러 처리
- [ ] 로딩 상태

### 5. 테스트 작성

```typescript
// tests/components/data-table.test.tsx
describe('DataTable', () => {
  it('데이터를 올바르게 렌더링한다', () => {
    // ...
  });
});
```

### 6. 빌드 확인

```bash
npm run build
npm run test
npm run lint
```

## 참조 패턴

### API 연결

```typescript
// React Query 훅 패턴
export function useWorkOrders(params: WorkOrderParams) {
  return useQuery({
    queryKey: ['workOrders', params],
    queryFn: () => fetchWorkOrders(params),
  });
}
```

### 폼 처리

```typescript
// react-hook-form + zod 패턴
const schema = z.object({
  title: z.string().min(1, '제목을 입력하세요'),
});

const form = useForm<FormData>({
  resolver: zodResolver(schema),
});
```

### URL 상태

```typescript
// nuqs 패턴
const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
const [search, setSearch] = useQueryState('search');
```

## 금지 사항

1. `any` 타입 사용 금지
2. `!important` 사용 금지
3. 인라인 스타일 사용 금지
4. 영문 주석/문서 금지
5. localStorage 토큰 저장 금지

## 완료 후

구현 완료 시:
1. 빌드 성공 확인
2. `test-and-commit` 스킬 실행
3. `update-progress` 스킬 실행
