# /check-security - 보안 패턴 검증

보안 취약점 및 민감 데이터 노출 위험 코드를 검사합니다.

## 검사 항목

### 1. localStorage 토큰 저장 여부 (CRITICAL)
```bash
grep -rn "localStorage.setItem.*[Tt]oken\|localStorage.setItem.*[Aa]uth" src/
```
**규칙**: 토큰은 httpOnly 쿠키 또는 Zustand 메모리에만 저장. localStorage 금지.

### 2. 하드코딩된 시크릿
```bash
grep -rn "password\s*=\s*[\"']\|secret\s*=\s*[\"']\|apiKey\s*=\s*[\"']" src/ | grep -v "placeholder\|label\|type=\|test\|mock\|\.stories\." | head -10
```

### 3. JWT_SECRET 폴백 패턴
```bash
grep -rn "JWT_SECRET.*??\|JWT_SECRET.*||" src/
```
**규칙**: 없으면 예외 발생 필수. 하드코딩 폴백 금지.

### 4. Open Redirect 취약점
```bash
grep -rn "redirect\|router\.push\|router\.replace" src/app/ | grep -v "isValidRedirect\|startsWith.*/" | head -20
```
외부 URL로 redirect되는 코드 탐색.

### 5. XSS 취약점 (HTML 직접 삽입)
```bash
grep -rn "innerHTML\|__html" src/app/ src/components/ | grep -v "DOMPurify\|sanitize\|\.stories\." | head -10
```
**규칙**: HTML 직접 삽입 시 반드시 DOMPurify.sanitize() 적용.

### 6. 직접 fetch에 인증 헤더 누락
```bash
grep -rn "fetch(" src/app/ | grep -v "api/auth\|Authorization\|route\.ts\|api/" | head -20
```

### 7. window.confirm / window.alert 사용
```bash
grep -rn "window\.confirm\|window\.alert\|window\.prompt" src/app/ src/components/ | head -10
```
→ `AlertDialog` / `toast` 로 교체 필요

### 8. .env 파일 git 추적 여부
```bash
git ls-files | grep "\.env"
```
→ `.env`, `.env.local`은 .gitignore에 포함 필수

## 보안 규칙 요약

| 항목 | 금지 | 허용 |
|------|------|------|
| 토큰 저장 | localStorage | httpOnly 쿠키 + Zustand |
| HTML 렌더링 | sanitize 없이 직접 삽입 | DOMPurify.sanitize() 후 사용 |
| redirect | 외부 URL | `/`로 시작하는 내부 경로만 |
| 환경변수 | 하드코딩 폴백 | 없으면 예외 발생 |
| 삭제 확인 | window.confirm | AlertDialog |
| 알림 | window.alert | toast |

$ARGUMENTS
