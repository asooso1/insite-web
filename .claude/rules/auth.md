# 인증 아키텍처 규칙

적용 대상: `**/*.ts`, `**/*.tsx`

## JWT 처리 패턴

**서버사이드 검증 우선:**
- JWT_SECRET 환경변수 설정 시: `verifyJWT()` (서명 검증 포함)
- JWT_SECRET 미설정 시: `decodeJwtWithExpiry()` (만료만 체크)
- 직접 `as unknown as JWTPayload` 캐스팅 금지 → Zod 스키마 검증 필수

**JWT 페이로드 Zod 검증 의무:**
```typescript
// 올바른 패턴
const JWTPayloadSchema = z.object({
  accountId: z.number(),
  userId: z.string(),
  accountName: z.string(),
  userRoles: z.array(z.string()).default([]),
  exp: z.number(),
});
const claims = JWTPayloadSchema.parse(rawPayload);
```

## 토큰 저장 규칙

| 저장소 | 허용 여부 | 이유 |
|--------|----------|------|
| httpOnly 쿠키 (auth-token) | ✅ 허용 | XSS 접근 불가 |
| Zustand 메모리 (accessToken) | ✅ 허용 | 페이지 리로드 시 소멸 |
| localStorage | ❌ 금지 | XSS 취약 |
| sessionStorage | ❌ 금지 | XSS 취약 |

## 인증 상태 초기화

```typescript
// 올바른 패턴 - 1회 실행 보장
export function AuthInitializer(): null {
  const setAuth = useAuthStore((s) => s.setAuth);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const initRef = React.useRef(false);

  React.useEffect(() => {
    if (initRef.current || isAuthenticated) return;
    initRef.current = true;
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.accessToken && data?.user) setAuth(data.accessToken, data.user);
      })
      .catch(() => {});
  }, []); // 빈 배열 필수 - Zustand 함수 참조 변경 방지

  return null;
}
```

## URL Redirect 보안

```typescript
// redirect 파라미터 검증 필수
function isValidRedirectUrl(url: string): boolean {
  if (!url.startsWith("/")) return false;      // 외부 URL 차단
  if (/^\/\//i.test(url)) return false;        // protocol-relative 차단
  return true;
}
const safeUrl = isValidRedirectUrl(rawRedirect) ? rawRedirect : "/dashboard";
router.push(safeUrl);
```

## 환경변수 보안

- `.env`, `.env.local` 파일 git 커밋 금지 (`.gitignore` 포함 필수)
- `JWT_SECRET` 하드코딩 폴백 금지
- 프로덕션: JWT_SECRET 없으면 예외 발생 (앱 시작 불가)

## 401 처리 규칙

```typescript
// 토큰 만료 vs 권한 부족 구분
if (status === 401) {
  if (isTokenExpired(token)) {
    handleAuthExpired(); // 로그아웃 + /login 리다이렉트
  } else {
    toast.error("접근 권한이 없습니다."); // 권한 부족 - 로그아웃 안 함
  }
}
```

## 체크리스트

- [ ] JWT 페이로드 Zod 스키마 검증 적용됨
- [ ] URL redirect 파라미터 내부 경로만 허용
- [ ] 토큰을 localStorage에 저장하지 않음
- [ ] AuthInitializer useEffect 의존성 배열 `[]`
- [ ] 프로덕션 JWT_SECRET 환경변수 설정됨
- [ ] .env.local이 .gitignore에 포함됨
