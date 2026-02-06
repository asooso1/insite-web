# csp-was 백엔드 변경 요청 사항

> 이 문서는 insite-web 마이그레이션 과정에서 발견된 csp-was 백엔드 변경 필요 사항을 기록합니다.
>
> **원칙**: csp-was 변경은 최소화하며, CORS 설정 외 변경은 반드시 사전 논의 후 진행합니다.

---

## 변경 요청 목록

### 1. CORS 설정 추가 (필수)

**상태**: ⏳ 대기

**변경 위치**: `csp-was/src/main/java/.../config/WebConfig.java` 또는 `CorsConfig.java`

**변경 내용**:
```java
// Next.js 개발 서버 및 프로덕션 도메인 추가
.allowedOrigins(
    "http://localhost:3000",      // Next.js 개발 서버
    "https://insite.example.com"  // 프로덕션 도메인 (확정 후 변경)
)
```

**사유**: insite-web(Next.js)에서 csp-was API 직접 호출 시 CORS 정책 필요

---

## 향후 검토 필요 사항

### 인증 API 응답 구조

**현재 상태**: 확인 필요

**관련 엔드포인트**: `/api/account/login`

**확인 사항**:
- 현재 응답에 `accessToken`, `refreshToken` 필드가 포함되어 있는지 확인
- 토큰 갱신 엔드포인트 (`/api/auth/refresh` 또는 유사) 존재 여부 확인

**참고**: 현재 csp-web은 세션 기반으로 동작하며, JWT 토큰 발급 여부 확인 필요

---

## 변경 이력

| 날짜 | 항목 | 상태 | 비고 |
|------|------|------|------|
| 2026-02-06 | 문서 생성 | - | 초기 작성 |

---

## 참고

- csp-was 소스: `/Volumes/jinseok-SSD-1tb/00_insite/csp-was/`
- 마이그레이션 계획: `../migration-plan.md`
