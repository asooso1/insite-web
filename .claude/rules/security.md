# 보안 규칙

적용 대상: `**/*.ts`, `**/*.tsx`

## 커밋 전 필수 확인

### 기본 보안
- [ ] 하드코딩된 시크릿(API 키, 비밀번호, 토큰) 없음
- [ ] 모든 사용자 입력 검증됨 (whitespace trim 포함)
- [ ] XSS 방지 (HTML 출력 시 DOMPurify sanitize 적용)
- [ ] CSRF 방어 적용 (httpOnly 쿠키 + SameSite)

### 인증/인가
- [ ] JWT 페이로드 Zod 스키마 런타임 검증 적용됨
- [ ] URL redirect 파라미터 내부 경로만 허용 (`/`로 시작, 외부 URL 차단)
- [ ] 토큰 저장: httpOnly 쿠키 또는 Zustand 메모리만 (localStorage 금지)
- [ ] 로그인 엔드포인트 rate limiting 적용

### 입력 검증
- [ ] RichText URL 입력: `http:`/`https:` 프로토콜만 허용
- [ ] URL 파라미터: `URLSearchParams.set()` 인코딩 사용
- [ ] 파일 업로드: 허용 타입/크기 검증

### Next.js
- [ ] API Routes에서 CORS Origin 검증
- [ ] CSP 헤더 설정 확인 (`next.config.ts`)
- [ ] `.env`, `.env.local` `.gitignore` 포함 확인

### 의존성
- [ ] `npm audit` 취약점 0건 (MODERATE 이상)

---

## 시크릿 처리

- 코드에 자격증명 직접 삽입 금지
- 환경변수 또는 시크릿 관리 시스템 사용
- localStorage에 토큰 저장 금지
- `.env.local`은 `.gitignore`에 포함
- JWT_SECRET 하드코딩 폴백 금지:
  ```typescript
  // 금지
  const secret = process.env.JWT_SECRET ?? "hardcoded-fallback";

  // 허용
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET 미설정");
  ```

---

## XSS 방지

**RichText 콘텐츠:**
```typescript
// HTML 렌더링 전 반드시 DOMPurify 적용
import DOMPurify from "dompurify";
const safe = DOMPurify.sanitize(htmlContent, {
  ALLOWED_TAGS: ["p", "br", "strong", "em", "ul", "ol", "li", "a", "img"],
  ALLOWED_ATTR: ["href", "src", "alt", "class"],
});
```

**URL 입력 검증:**
```typescript
function isValidUrl(url: string): boolean {
  try {
    const obj = new URL(url);
    return ["http:", "https:"].includes(obj.protocol);
  } catch { return false; }
}
```

---

## Open Redirect 방지

```typescript
// redirect 파라미터 검증 필수
function isValidRedirectUrl(url: string): boolean {
  if (!url.startsWith("/")) return false;
  if (/^\/\//i.test(url)) return false; // protocol-relative 차단
  return true;
}
const safeUrl = isValidRedirectUrl(raw) ? raw : "/dashboard";
```

---

## Rate Limiting (인증 엔드포인트)

`/api/auth/login` 엔드포인트에 적용 필수:
- 15분 내 5회 초과 시 429 응답
- IP 기반 추적

---

## 에러 메시지 보안

```typescript
// 금지 - 내부 정보 노출
return { error: error.stack, query: sql }

// 허용 - 사용자 친화적 메시지만
return { code: "E00500", message: "서버 오류가 발생했습니다." }
```

---

## 취약점 발견 시

1. 즉시 작업 중단
2. `security-reviewer` 에이전트 실행
3. 심각도 높은 취약점 해결 후 진행
4. 유사 패턴 전체 코드베이스 감사
5. `npm audit fix` 실행 후 취약점 0건 확인
