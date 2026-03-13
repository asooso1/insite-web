# 성능 최적화 규칙

## Next.js 15 최적화

**컴포넌트:**
- Server Component 우선 사용 (데이터 fetching은 서버에서)
- Client Component는 상호작용이 필요한 최소 범위만
- `use client` 경계를 가능한 하위로 유지

**이미지/폰트:**
- `next/image` 사용 (일반 `<img>` 금지)
- `next/font` 사용

**번들 크기:**
- dynamic import로 무거운 컴포넌트 지연 로딩
- barrel export (`index.ts`) 남용 금지

---

## React Query 표준 설정

**staleTime 기준 (설정 필수):**

| 쿼리 유형 | staleTime | 이유 |
|-----------|-----------|------|
| 목록 쿼리 | `30 * 1000` (30초) | 페이지 이동 시 불필요한 재요청 방지 |
| 상세 쿼리 | `60 * 1000` (1분) | 상세 데이터는 더 안정적 |
| 실시간 필요 | `0` | 주석으로 이유 명시 필수 |
| 정적 데이터 | `Infinity` | 빌딩 목록 등 거의 안 바뀌는 데이터 |

```typescript
// 올바른 패턴 - staleTime 항상 명시
export function useWorkOrderList(params: SearchWorkOrderVO) {
  return useQuery({
    queryKey: workOrderKeys.list(params),
    queryFn: () => getWorkOrderList(params),
    staleTime: 30 * 1000,  // 30초 - 목록 쿼리 표준
  });
}

export function useWorkOrderDetail(id: number) {
  return useQuery({
    queryKey: workOrderKeys.detail(id),
    queryFn: () => getWorkOrderDetail(id),
    enabled: id > 0,
    staleTime: 60 * 1000,  // 1분 - 상세 쿼리 표준
  });
}
```

**QueryClient 전역 설정 (`src/components/providers/query-provider.tsx`):**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,  // 탭 전환 시 불필요한 재요청 방지
      retry: 1,                     // 실패 시 1회만 재시도
    },
  },
});
```

**캐시 무효화:**
```typescript
// onSuccess에서 keys factory 사용
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
}
```

**에러 retry 비활성화 (권한 오류):**
```typescript
// 401/403 오류는 retry 불필요
useQuery({
  retry: (failureCount, error) => {
    if (error instanceof ApiError && [401, 403].includes(error.status)) {
      return false;
    }
    return failureCount < 1;
  },
})
```

---

## 모델 선택 가이드

| 작업 | 모델 |
|------|------|
| 간단한 조회/스캔 | haiku |
| 일반 구현/디버깅 | sonnet |
| 아키텍처/심층 분석 | opus |

---

## 빌드 실패 시

`build-fixer` 에이전트 실행 → 에러별 최소 수정 → 빌드 확인 반복

---

## 코드 복잡도

- 알고리즘 복잡도 명시 (O(n²) 이상이면 개선 검토)
- N+1 쿼리 패턴 금지
- 불필요한 API 중복 호출 방지

---

## 체크리스트

- [ ] 목록 쿼리 `staleTime: 30 * 1000` 설정됨
- [ ] 상세 쿼리 `staleTime: 60 * 1000` 설정됨
- [ ] QueryClient `refetchOnWindowFocus: false` 설정됨
- [ ] 401/403 오류 retry 비활성화
- [ ] 무거운 컴포넌트 dynamic import 사용
