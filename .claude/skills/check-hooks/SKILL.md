---
name: check-hooks
description: React Query 훅 패턴 검증 (staleTime, queryKey factory, enabled 조건)
allowed-tools: Bash, Grep
---

# React Query 훅 패턴 검증

React Query 표준 패턴 위반을 검사합니다. $ARGUMENTS

## 검사 항목

```bash
# 1. staleTime 누락 (CRITICAL)
for f in src/lib/hooks/*.ts; do
  if grep -q "useQuery" "$f" && ! grep -q "staleTime" "$f"; then
    echo "[MISSING staleTime] $f"
  fi
done

# 2. queryKey Factory 미사용
grep -rn "queryKey:" src/lib/hooks/ | grep -v "Keys\." | head -20

# 3. 상세 쿼리 enabled 없음
grep -rn "detail\|Detail" src/lib/hooks/ | grep "useQuery" | head -20

# 4. any 타입
grep -rn ": any\b\|as any\b" src/lib/hooks/ | head -20
```

## staleTime 기준

| 쿼리 유형 | staleTime |
|-----------|-----------|
| 목록 | `30 * 1000` |
| 상세 | `60 * 1000` |
| 정적 데이터 | `Infinity` |
| 실시간 필요 | `0` + 주석 |

## 올바른 패턴

```typescript
// 목록
useQuery({ queryKey: moduleKeys.list(params), queryFn: () => getList(params), staleTime: 30_000 });

// 상세
useQuery({ queryKey: moduleKeys.detail(id), queryFn: () => getDetail(id), enabled: !!id, staleTime: 60_000 });

// mutation
useMutation({ mutationFn: addModule, onSuccess: () => queryClient.invalidateQueries({ queryKey: moduleKeys.lists() }) });
```
