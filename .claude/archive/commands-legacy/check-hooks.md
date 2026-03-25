---
description: React Query 훅 패턴 검증 (staleTime, queryKey factory, enabled 조건)
allowed-tools: ["Bash", "Grep"]
---
# /check-hooks - React Query 훅 패턴 검증

전체 훅 파일에서 React Query 표준 패턴 위반을 검사합니다.

## 검사 항목

### 1. staleTime 누락 파일 탐색 (CRITICAL)
```bash
# useQuery가 있는데 staleTime이 없는 파일 탐색
for f in src/lib/hooks/*.ts; do
  if grep -q "useQuery" "$f" && ! grep -q "staleTime" "$f"; then
    echo "[MISSING staleTime] $f"
  fi
done
```

staleTime이 일부만 있는 경우 수동 확인:
```bash
grep -n "useQuery({" src/lib/hooks/use-{파일명}.ts
grep -n "staleTime" src/lib/hooks/use-{파일명}.ts
```

**staleTime 기준:**
| 쿼리 유형 | staleTime |
|-----------|-----------|
| 목록 (xxxList) | `30 * 1000` |
| 상세 (xxxDetail/xxxView/단일 id) | `60 * 1000` |
| 정적 데이터 (buildings, menus) | `Infinity` |
| 실시간 필요 | `0` + 주석 |

### 2. queryKey Factory 패턴 검사
```bash
grep -rn "queryKey:" src/lib/hooks/ | grep -v "Keys\." | head -20
```
queryKey는 반드시 `{module}Keys.xxx(params)` 패턴 사용

### 3. 상세 쿼리 enabled 조건 검사
```bash
# detail 쿼리에 enabled 없는 파일 확인
grep -rn "detail\|Detail" src/lib/hooks/ | grep "useQuery" | head -20
```
상세 쿼리는 `enabled: !!id` 또는 `enabled: id > 0` 필수

### 4. useMutation onError/onSuccess 패턴
```bash
grep -rn "useMutation(" src/lib/hooks/ | head -20
```
useMutation에 onSuccess에서 `invalidateQueries` 호출 필수

### 5. any 타입 사용 검사
```bash
grep -rn ": any\b\|as any\b" src/lib/hooks/ | head -20
```

## 수정 패턴

```typescript
// ✅ 목록 쿼리
return useQuery({
  queryKey: moduleKeys.list(params),
  queryFn: () => getModuleList(params),
  staleTime: 30 * 1000,  // 30초 필수
});

// ✅ 상세 쿼리
return useQuery({
  queryKey: moduleKeys.detail(id),
  queryFn: () => getModuleDetail(id),
  enabled: !!id,         // 필수
  staleTime: 60 * 1000,  // 1분 필수
});

// ✅ mutation
return useMutation({
  mutationFn: addModule,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: moduleKeys.lists() });
  },
});
```

$ARGUMENTS
