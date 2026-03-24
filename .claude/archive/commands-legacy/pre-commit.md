---
description: 커밋 전 종합 검증 (빌드 + 린트 + API/훅/컴포넌트/보안 패턴 검사)
allowed-tools: ["Bash", "Grep"]
---
# /pre-commit - 커밋 전 종합 검증

커밋 전 반드시 실행하는 종합 품질 검증 커맨드입니다.

## 실행 순서

### Step 1: 빌드 검증 (필수)
```bash
npm run build
```
빌드 실패 시 커밋 금지. `/build-fix` 실행 후 재시도.

### Step 2: 린트 검증
```bash
npm run lint
```

### Step 3: API 패턴 검사 (`/check-api`)
```bash
# buildingId 수동 주입 여부
grep -rn "buildingId" src/lib/api/ | grep -v "injectBuildingId\|client.ts"

# 직접 fetch 사용 여부
grep -rn "= fetch(" src/lib/api/ | grep -v "client.ts"

# type 파라미터 기본값 불일치
grep -rn 'params\.type ?? ""' src/lib/api/
```

### Step 4: 훅 패턴 검사 (`/check-hooks`)
```bash
# staleTime 누락 의심 파일 (수동 확인 필요)
grep -rn "useQuery({" src/lib/hooks/

# any 타입 사용
grep -rn ": any" src/lib/hooks/
```

### Step 5: 컴포넌트 패턴 검사 (`/check-components`)
```bash
# window.alert / window.confirm
grep -rn "window\.alert\|window\.confirm\|window\.prompt" src/app/ src/components/

# console.log 프로덕션 코드 (API 라우트/서버 제외)
grep -rn "console\.log\|console\.error\|console\.warn" src/app/ src/components/ | grep -v "NODE_ENV\|development\|\.stories\.\|src/app/api/\|src/app/error\."

# any 타입
grep -rn ": any\b\|as any\b" src/app/ src/components/ | grep -v "\.stories\.\|\.d\.ts"
```

### Step 6: 보안 체크 (`/check-security`)
```bash
# localStorage 토큰 저장 여부
grep -rn "localStorage.setItem.*[Tt]oken\|localStorage.setItem.*[Aa]uth" src/

# 하드코딩된 시크릿
grep -rn "password\s*=\s*[\"']\|secret\s*=\s*[\"']\|apiKey\s*=\s*[\"']" src/ | grep -v "placeholder\|label\|type=\|test\|mock\|\.stories\." | head -10

# window.confirm / window.alert (보안+UX)
grep -rn "window\.confirm\|window\.alert\|window\.prompt" src/app/ src/components/

# HTML 직접 삽입 (XSS)
grep -rn "innerHTML\|__html" src/app/ src/components/ | grep -v "DOMPurify\|sanitize\|\.stories\."
```

## 커밋 전 체크리스트

**TypeScript:**
- [ ] `any` 타입 없음
- [ ] 빌드 통과

**API 레이어:**
- [ ] `apiClient` 사용 (직접 `fetch` 금지)
- [ ] `buildingId` 수동 추가 없음
- [ ] 파라미터 기본값 일관성

**React Query:**
- [ ] 목록 쿼리 `staleTime: 30 * 1000`
- [ ] 상세 쿼리 `staleTime: 60 * 1000`
- [ ] queryKey factory 사용

**컴포넌트:**
- [ ] `window.alert` / `window.confirm` 없음
- [ ] `console.log` 프로덕션 코드 없음
- [ ] `StatusBadge` 사용 (직접 색상 클래스 금지)
- [ ] `DataTable` 사용 (raw `<table>` 금지)

**보안:**
- [ ] `localStorage` 토큰 저장 없음
- [ ] 하드코딩된 시크릿 없음
- [ ] redirect 파라미터 검증

**커밋 메시지:**
- [ ] `<type>: <한국어 설명>` 형식
- [ ] type: feat/fix/refactor/docs/test/chore/perf/ci

$ARGUMENTS
