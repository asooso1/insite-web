# csp-was pageInfoId 권한 체계 미구현 이슈

| 항목 | 내용 |
|------|------|
| 목적 | csp-was JwtFilter의 pageInfoId 헤더 요구로 인한 401 오류 해결 |
| 상태 | 미구현 (의사결정 대기) |
| 우선순위 | 높음 |
| 담당 | 백엔드(csp-was) 또는 프론트엔드(insite-web) 판단 필요 |
| 최종 업데이트 | 2026-03-24 |

> **AI 에이전트 사용법**: 401 오류가 토큰 만료가 아닌 경우, 이 문서를 참조하세요.
> `handleAuthExpired`의 `isTokenExpired` 분기 로직과 `retry: false` 설정은
> 이 이슈의 임시 우회책입니다. 근본 해결 전까지 제거하지 마세요.

---

## 1. 필요 액션

아래 두 방안 중 하나를 선택해야 한다. **방안 A를 권장**한다.

| 방안 | 작업 내용 | 변경량 | 복잡도 |
|------|----------|--------|--------|
| **A (권장)** | csp-was `JwtFilter`에서 `pageFunctionUrlDTOs` 없을 때 통과 허용 | 1줄 | 낮음 |
| **B** | insite-web에서 매 API 요청에 `pageInfoId` 헤더 추가 | 다수 파일 | 높음 |

**방안 A 권장 근거**: pageInfoId 체계는 Thymeleaf 기반 v1(csp-web)에 특화된 설계이며, insite-web은 Next.js middleware + JWT Role로 권한을 처리한다. Spring Security의 Role 체크는 방안 A에서도 유지된다.

---

## 2. 문제 요약

csp-was `JwtFilter`는 JWT 인증 외에 **pageInfoId 헤더 기반 페이지별 URL 권한 검증**을 수행한다. insite-web은 이 헤더를 전송하지 않아, 화이트리스트에 없는 API가 **항상 401을 반환**한다.

현재 임시 우회:
- `client.ts`: 401 수신 시 토큰 만료 여부를 확인해 권한 부족 401은 무시
- `use-buildings.ts`: `retry: false`로 무한 재시도 방지

---

## 3. 기술 상세

### csp-was 권한 흐름

```
요청 수신
  -> JWT 유효성 확인 (tokenProvider.getAuthVO)
  -> 화이트리스트 URL 체크 (requestAuthentication)
      [O] 화이트리스트 -> 통과
      [X] 없음 -> AccountJwt.pageFunctionUrls 조회
          -> pageInfoId 헤더로 허용 URL 목록 매칭
          -> 요청 URL이 목록에 있으면 -> 통과
          -> 없으면 -> 401 반환
```

**관련 파일**: `csp-was/src/main/java/hdclabs/cspwas/filter/JwtFilter.java`

### 화이트리스트 (pageInfoId 없이 통과)

```
/api/account/changePassword, /api/account/token
/api/mypage/myInfoView
/open/**, /widget/**, /api/poi/**, /api/field/**
/api/devices/**, /api/chat/**
/api/guest/workOrder, /api/guest/work-orders
/api/guest/facilityList, /api/guest/buildingInfoList
/api/services/menus, /api/admin/caches/**
```

### 화이트리스트 미포함 (pageInfoId 필요 -> 현재 401)

- `/api/site/buildingAccount/buildings` (헤더 빌딩 목록)
- `/api/site/**`, `/api/workorder/**` 대부분
- 기타 업무 API 전반

### 방안 A 구현 (csp-was 수정)

```java
// JwtFilter.java - pageFunctionUrlDTOs 없을 때 통과 허용
if (pageFunctionUrlDTOs == null || pageFunctionUrlDTOs.isEmpty()) {
    return true;  // 기존 false -> true 변경
}
```

### 방안 B 구현 (insite-web 수정)

```typescript
// 매 API 요청에 pageInfoId 헤더 추가
apiClient.get('/api/site/...', {
  headers: { 'pageInfoId': String(currentPageInfoId) }
});
```

방안 B는 DB에서 페이지별 pageInfoId 매핑 확인, 모듈별 매핑 테이블 작성, 자동 헤더 주입 메커니즘 구현이 필요하여 복잡도가 높다.

---

## 4. 영향받는 insite-web 코드

해결 후 아래 파일에서 임시 우회 코드를 제거/단순화할 수 있다.

| 파일 | 현재 임시 처리 | 해결 후 변경 |
|------|--------------|-------------|
| `src/lib/api/client.ts` | `isTokenExpired()` 분기로 권한 부족 401 무시 | 모든 401을 인증 만료로 처리 (단순화) |
| `src/lib/hooks/use-buildings.ts` | `retry: false` 2곳 설정 | 표준 retry 정책으로 복원 |
| `src/lib/api/building.ts` | `/api/site/buildingAccount/buildings` 호출 | 정상 동작 (변경 없음) |
| `src/proxy.ts` | `handleAuthExpired` 관련 로직 | 단순화 가능 |

---

## 5. 타임라인

| 시점 | 항목 |
|------|------|
| 즉시 | 방안 A/B 의사결정 확정 |
| 확정 후 1일 | 방안 A: csp-was JwtFilter 1줄 수정 + 배포 |
| 배포 후 1일 | insite-web 임시 우회 코드 제거 (위 4번 파일들) |
| 방안 B 선택 시 | 별도 태스크 생성 필요 (예상 3~5일) |
