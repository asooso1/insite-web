# 인증 규칙

적용 대상: `**/*.ts`, `**/*.tsx`

## 토큰 저장

| 저장소 | 허용 | 이유 |
|--------|------|------|
| httpOnly 쿠키 (`auth-token`) | ✅ | XSS 접근 불가 |
| Zustand 메모리 (`accessToken`) | ✅ | 리로드 시 소멸 |
| localStorage / sessionStorage | ❌ | XSS 취약 |

## 레이어별 인증 패턴

**클라이언트 컴포넌트**: `apiClient` 사용 → Authorization 자동 주입. 직접 fetch 금지.

**Next.js API Route**: 쿠키에서 직접 추출 → `request.cookies.get("auth-token")?.value`
```typescript
const authToken = request.cookies.get("auth-token")?.value;
if (!authToken) return NextResponse.json({ code: "E00401", message: "인증이 필요합니다." }, { status: 401 });
// fetch 시: Authorization: `Bearer ${authToken}`
```

**금지 패턴:**
- `request.headers.get("Authorization")` 조건부 포워딩
- `credentials: "include"` (서버 fetch에서 무의미)

## JWT 검증

- 서버: `verifyJWT()` (서명 검증) 또는 `decodeJwtWithExpiry()` (만료 체크)
- 직접 `as unknown as JWTPayload` 캐스팅 금지 → **Zod 스키마 검증 필수**
- JWT_SECRET 하드코딩 폴백 금지 (없으면 예외 발생)

## 401 처리

```typescript
if (status === 401) {
  if (isTokenExpired(token)) handleAuthExpired(); // 로그아웃 + /login
  else toast.error("접근 권한이 없습니다.");       // 권한 부족 - 로그아웃 안 함
}
```

## URL Redirect 보안

```typescript
function isValidRedirectUrl(url: string): boolean {
  if (!url.startsWith("/")) return false;
  if (/^\/\//i.test(url)) return false;
  return true;
}
```

## 인증 불필요 엔드포인트

`POST /api/auth/login` | `POST /api/auth/logout` | `GET /api/auth/me` | `GET/PUT /api/settings/menu-*`

## 체크리스트

- [ ] 토큰 localStorage 저장 없음
- [ ] JWT 페이로드 Zod 검증 적용
- [ ] API Route: 쿠키에서 토큰 추출
- [ ] redirect 파라미터 내부 경로만 허용
- [ ] .env.local이 .gitignore에 포함
