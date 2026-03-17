# API 인증 규칙

> csp-was 모든 API: `Authorization: Bearer {token}` 헤더 필수

## 핵심 원칙

모든 csp-was 백엔드 API 요청에는 `Authorization: Bearer {token}` 헤더를 포함해야 한다.

---

## 레이어별 구현 패턴

### 1. 클라이언트 컴포넌트 → apiClient 사용 (자동 처리)

`src/lib/api/client.ts`의 `apiClient`가 Zustand `accessToken`을 자동으로 주입한다.
**별도 구현 불필요.**

```typescript
// ✅ apiClient 사용 - Authorization 자동 주입
export function getWorkOrderList(params: SearchVO) {
  return apiClient.get(`/api/workorder/v1/list`);
}

// ❌ 직접 fetch - Authorization 헤더 누락
export function getWorkOrderList(params: SearchVO) {
  return fetch(`/api/workorder/v1/list`);
}
```

### 2. Next.js API Route → 쿠키에서 직접 추출 (명시적 처리)

서버 사이드에서는 Zustand에 접근할 수 없으므로, httpOnly 쿠키 `auth-token`에서 직접 추출한다.

```typescript
// ✅ 올바른 패턴
export async function GET(request: NextRequest): Promise<NextResponse> {
  const authToken = request.cookies.get("auth-token")?.value;

  if (!authToken) {
    return NextResponse.json(
      { code: "E00401", message: "인증이 필요합니다." },
      { status: 401 }
    );
  }

  const response = await fetch(`${backendUrl}/api/...`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
  });
}

// ❌ 금지 패턴 - 클라이언트 헤더 조건부 포워딩
const authHeader = request.headers.get("Authorization");
headers: { ...(authHeader ? { Authorization: authHeader } : {}) }
// 이유: 클라이언트가 헤더를 전달하지 않으면 토큰 누락

// ❌ 금지 패턴 - credentials: "include" (서버사이드 fetch에서 무의미)
fetch(url, { credentials: "include" })
```

---

## 체크리스트

### Next.js API Route 작성 시
- [ ] `request.cookies.get("auth-token")?.value`로 토큰 추출
- [ ] 토큰 없으면 즉시 401 반환
- [ ] `Authorization: \`Bearer ${authToken}\`` 헤더 설정
- [ ] `credentials: "include"` 제거 (서버 fetch에 불필요)
- [ ] `request.headers.get("Authorization")` 조건부 포워딩 패턴 사용 금지

### 클라이언트 API 함수 작성 시
- [ ] `apiClient.get/post/put/delete` 사용 (직접 fetch 금지)
- [ ] Authorization 헤더 수동 추가 금지 (apiClient가 자동 처리)

---

## 인증 불필요 엔드포인트 (예외)

| 경로 | 이유 |
|------|------|
| `POST /api/auth/login` | 로그인 전 상태 |
| `POST /api/auth/logout` | 쿠키 삭제만 수행 |
| `GET /api/auth/me` | 쿠키에서 직접 검증 |
| `GET/PUT /api/settings/menu-*` | DB/파일 I/O만 수행 |
