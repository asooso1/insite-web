---
name: check-security
description: 보안 패턴 검증 (localStorage 토큰, 하드코딩 시크릿, open redirect, XSS)
disable-model-invocation: true
allowed-tools: Bash, Grep
---

# 보안 패턴 검증

보안 취약점 및 민감 데이터 노출 위험 코드를 검사합니다. $ARGUMENTS

## 검사 항목

```bash
# 1. localStorage 토큰 저장 (CRITICAL)
grep -rn "localStorage.setItem.*[Tt]oken\|localStorage.setItem.*[Aa]uth" src/

# 2. 하드코딩된 시크릿
grep -rn "password\s*=\s*[\"']\|secret\s*=\s*[\"']\|apiKey\s*=\s*[\"']" src/ | grep -v "placeholder\|label\|type=\|test\|mock\|\.stories\." | head -10

# 3. JWT_SECRET 폴백
grep -rn "JWT_SECRET.*??\|JWT_SECRET.*||" src/

# 4. Open Redirect
grep -rn "redirect\|router\.push\|router\.replace" src/app/ | grep -v "isValidRedirect\|startsWith.*/" | head -20

# 5. XSS (HTML 직접 삽입)
grep -rn "innerHTML\|__html" src/app/ src/components/ | grep -v "DOMPurify\|sanitize\|\.stories\." | head -10

# 6. .env git 추적
git ls-files | grep "\.env"
```

## 규칙 요약

| 항목 | 금지 | 허용 |
|------|------|------|
| 토큰 저장 | localStorage | httpOnly 쿠키 + Zustand |
| HTML 렌더링 | sanitize 없이 삽입 | DOMPurify.sanitize() 후 |
| redirect | 외부 URL | `/`로 시작하는 내부 경로만 |
| 환경변수 | 하드코딩 폴백 | 없으면 예외 발생 |
