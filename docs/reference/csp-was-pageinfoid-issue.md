# csp-was pageInfoId 권한 체계 미구현 이슈

> **상태**: 미구현 (필수 구현 필요)
> **우선순위**: 높음
> **영향 범위**: 모든 `/api/site/**`, `/api/workorder/**` 등 화이트리스트 외 API 엔드포인트

## 문제 개요

csp-was `JwtFilter`는 JWT 인증 외에 **페이지별 기능 URL 권한 체계**를 추가로 사용한다.
insite-web은 이 체계를 구현하지 않아 일부 API 호출이 **항상 401 반환**된다.

## csp-was 권한 흐름

```
요청 수신
  → JWT 유효성 확인 (tokenProvider.getAuthVO)
  → 화이트리스트 URL 체크 (requestAuthentication)
      ✅ 화이트리스트에 있으면 → 통과
      ❌ 없으면 → AccountJwt 테이블에서 pageFunctionUrls 조회
          → pageInfoId 헤더 값과 매칭되는 URL 목록 조회
          → 요청 URL이 목록에 있으면 → 통과
          → 없거나 목록 없으면 → 401 반환
```

**관련 파일**: `csp-was/src/main/java/hdclabs/cspwas/filter/JwtFilter.java`

### 화이트리스트 (pageInfoId 없이 통과되는 URL)
```java
/api/account/changePassword
/api/account/token
/api/mypage/myInfoView
/open/**
/widget/**
/api/guest/workOrder, /api/guest/work-orders
/api/poi/**
/api/field/**
/api/devices/**
/api/guest/facilityList, /api/guest/buildingInfoList
/api/chat/**
/api/services/menus   ← 메뉴 API (화이트리스트)
/api/admin/caches/**
```

### 화이트리스트 미포함 (pageInfoId 필요)
- `/api/site/buildingAccount/buildings` ← 헤더의 빌딩 목록
- `/api/site/**` (대부분)
- `/api/workorder/**` (일부)
- 기타 대부분의 업무 API

## v1 csp-web 구현 방식

v1 웹(csp-web)은 모든 API 요청에 `pageInfoId` 헤더를 함께 전송했다.
`pageInfoId`는 현재 사용자가 보고 있는 페이지의 ID로, DB `AccountJwt` 테이블의
`pageFunctionUrls` JSON과 매핑되어 해당 페이지에서 허용된 API URL 목록을 검증했다.

## 현재 임시 처리 방식

`src/lib/api/client.ts`의 `handleAuthExpired`:
- 401 발생 시 JWT `exp` 클레임을 확인
- **토큰이 유효하면** → 권한 부족 401로 판단 → 로그아웃 안 함 (무시)
- **토큰이 만료됐으면** → 실제 인증 만료 → 로그아웃 + `/login` 리다이렉트

빌딩 목록 (`/api/site/buildingAccount/buildings`):
- 항상 401 반환 → 빈 배열 표시
- `retry: false`로 무한 재시도 방지

## 필수 구현 방안

### 방안 A: csp-was JwtFilter 수정 (권장)

`JwtFilter.requestAuthentication()` 에서 `pageFunctionUrlDTOs`가 없을 때 `false` → `true`로 변경:

```java
// JwtFilter.java
if (pageFunctionUrlDTOs == null || pageFunctionUrlDTOs.isEmpty()) {
    return true;  // false에서 변경 - JWT 유효하면 허용
}
```

또는 특정 URL만 화이트리스트 추가:
```java
|| requestURI.startsWith("/api/site/buildingAccount/buildings")
```

**효과**: JWT만 유효하면 모든 API 접근 허용. Spring Security의 Role 체크는 유지됨.

### 방안 B: insite-web에서 pageInfoId 헤더 구현

각 페이지에서 해당 pageInfoId를 헤더로 전송:
```typescript
// API 요청 시 pageInfoId 헤더 추가
apiClient.get('/api/site/...', {
  headers: { 'pageInfoId': String(currentPageInfoId) }
});
```

**필요 작업**:
1. DB에서 페이지별 pageInfoId 값 확인
2. 각 모듈/페이지에 pageInfoId 매핑 테이블 작성
3. API 호출 시 자동으로 헤더 추가하는 메커니즘 구현

**단점**: 복잡도 높음, 유지보수 부담

## 결론 및 권장

**방안 A (csp-was 수정)를 권장**:
- insite-web은 Next.js Server Component + middleware에서 인증/권한을 처리
- csp-was의 페이지 기반 권한 체계는 Thymeleaf 기반 v1 아키텍처에 특화된 것
- JWT Role 기반 권한은 Spring Security에서 여전히 유효하게 동작

**구현 시 변경 파일**:
- `csp-was/src/main/java/hdclabs/cspwas/filter/JwtFilter.java`
- (방안 A 선택 시 약 1줄 변경)

**구현 후 insite-web에서 제거/복원할 내용**:
- `src/lib/api/client.ts`: `isTokenExpired()` 함수 단순화 가능 (모든 401을 만료로 처리)
- `src/lib/hooks/use-buildings.ts`: `retry: false` 제거 가능
