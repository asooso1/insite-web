# 성능 최적화 규칙

## Next.js 15 최적화

**컴포넌트:**
- Server Component 우선 사용 (데이터 fetching은 서버에서)
- Client Component는 상호작용이 필요한 최소 범위만
- `use client` 경계를 가능한 하위로 유지

**React Query:**
- `staleTime` 적절히 설정 (목록: 30s, 상세: 60s)
- `gcTime` 기본값 유지
- 목록 무효화 시 `invalidateQueries` keys factory 사용
- 불필요한 refetch 방지 (`refetchOnWindowFocus: false` 고려)

**이미지/폰트:**
- `next/image` 사용 (일반 `<img>` 금지)
- `next/font` 사용

**번들 크기:**
- dynamic import로 무거운 컴포넌트 지연 로딩
- barrel export (`index.ts`) 남용 금지

## 모델 선택 가이드

| 작업 | 모델 |
|------|------|
| 간단한 조회/스캔 | haiku |
| 일반 구현/디버깅 | sonnet |
| 아키텍처/심층 분석 | opus |

## 빌드 실패 시

build-error-resolver 에이전트 실행 → 에러별 최소 수정 → 빌드 확인 반복

## 코드 복잡도

- 알고리즘 복잡도 명시 (O(n²) 이상이면 개선 검토)
- N+1 쿼리 패턴 금지
- 불필요한 API 중복 호출 방지
