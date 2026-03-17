# 빌딩 컨텍스트 규칙

> csp-web v1 참조: axiosApiGet 래퍼에서 searchVo.buildingId를 쿼리스트링으로 전달

## 핵심 원칙

모든 csp-was API 요청에 현재 선택된 빌딩 ID를 자동으로 쿼리 파라미터로 주입한다.
`apiClient` (`src/lib/api/client.ts`)의 `injectBuildingId()` 함수가 이를 담당한다.

## 동작 방식

```
apiClient.get("/api/workorder/v1/list")
  → injectBuildingId() 호출
  → /api/workorder/v1/list?buildingId=123
```

## buildingId 주입 규칙

| 조건 | 주입 여부 | 이유 |
|------|----------|------|
| buildingId가 null | ❌ 생략 | 빌딩 미선택 상태 |
| buildingId === "0" | ❌ 생략 | 전체 빌딩 보기 모드 (JWT viewAllBuildings 클레임으로 제어) |
| `/api/auth/*` 경로 | ❌ 생략 | 인증/세션 API |
| `/api/buildings/*` 경로 | ❌ 생략 | 빌딩 목록 조회 자체 |
| `/api/services/*` 경로 | ❌ 생략 | 메뉴/서비스 API |
| 외부 URL (http로 시작) | ❌ 생략 | 외부 서비스 |
| 그 외 모든 경로 | ✅ 주입 | `?buildingId=123` 또는 `&buildingId=123` |

## 개발 가이드

**API 함수 작성 시 buildingId를 수동으로 추가하지 말 것:**
```typescript
// ❌ 금지 - apiClient가 자동 주입함
export function getWorkOrderList(params: SearchVO) {
  const buildingId = useTenantStore.getState().currentBuilding?.id;
  return apiClient.get(`/api/workorder/v1/list?buildingId=${buildingId}&...`);
}

// ✅ 허용 - apiClient가 자동으로 buildingId 추가
export function getWorkOrderList(params: SearchVO) {
  return apiClient.get(`/api/workorder/v1/list?${new URLSearchParams(params).toString()}`);
}
```

**skip 경로 추가 시 `SKIP_BUILDING_ID_PREFIXES`에 등록:**
```typescript
// src/lib/api/client.ts
const SKIP_BUILDING_ID_PREFIXES = [
  "/api/auth/",
  "/api/buildings/",
  "/api/services/",
  "/api/새로운-제외-경로/", // 추가
];
```

## 빌딩 전환 흐름

```
사용자가 빌딩 선택
  → PUT /api/auth/token (새 JWT 발급)
  → setAuth() + setContext() 업데이트
  → queryClient.invalidateQueries() 전체 캐시 무효화
  → 이후 모든 API 요청에 새 buildingId 자동 주입
```

## 전체 빌딩 모드 (관리자 전용)

- buildingId = "0" → `injectBuildingId()`가 파라미터 생략
- 백엔드는 JWT의 `viewAllBuildings` 클레임으로 전체 빌딩 데이터 반환
- 관련 컴포넌트: `src/components/layout/header.tsx` `BuildingSelector`
