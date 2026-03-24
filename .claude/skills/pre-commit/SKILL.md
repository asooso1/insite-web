---
name: pre-commit
description: 커밋 전 종합 검증 (빌드 + 린트 + API/훅/컴포넌트/보안 패턴 검사). git commit 전 필수 실행.
disable-model-invocation: true
allowed-tools: Bash, Grep, Read
---

# 커밋 전 종합 검증

커밋 전 반드시 실행하는 종합 품질 검증입니다. $ARGUMENTS

## 실행 순서

### Step 1: 빌드 + 린트
```bash
npm run build && npm run lint
```
빌드 실패 시 `/build-fix` 실행 후 재시도.

### Step 2: API 패턴 검사
```bash
# buildingId 수동 주입
grep -rn "buildingId" src/lib/api/ | grep -v "injectBuildingId\|client.ts"
# 직접 fetch
grep -rn "= fetch(" src/lib/api/ | grep -v "client.ts"
```

### Step 3: React Query 훅 검사
```bash
for f in src/lib/hooks/*.ts; do
  if grep -q "useQuery" "$f" && ! grep -q "staleTime" "$f"; then
    echo "[MISSING staleTime] $f"
  fi
done
```

### Step 4: 컴포넌트 패턴 검사
```bash
# window.alert/confirm + console.log + any 타입
grep -rn "window\.alert\|window\.confirm\|window\.prompt" src/app/ src/components/
grep -rn "console\.log\|console\.error" src/app/ src/components/ | grep -v "NODE_ENV\|\.stories\.\|src/app/api/"
grep -rn ": any\b\|as any\b" src/app/ src/components/ src/lib/ | grep -v "\.stories\.\|\.d\.ts"
```

### Step 5: 보안 체크
```bash
# localStorage 토큰 + 하드코딩 시크릿 + XSS
grep -rn "localStorage.setItem.*[Tt]oken\|localStorage.setItem.*[Aa]uth" src/
grep -rn "innerHTML\|__html" src/app/ src/components/ | grep -v "DOMPurify\|sanitize\|\.stories\."
```

## 커밋 전 체크리스트

- [ ] 빌드 통과 + 린트 통과
- [ ] `any` 타입 없음
- [ ] `apiClient` 사용 (직접 fetch 금지)
- [ ] staleTime 설정됨
- [ ] `window.alert/confirm` 없음
- [ ] `console.log` 프로덕션 코드 없음
- [ ] localStorage 토큰 저장 없음
- [ ] 커밋 메시지: `<type>: <한국어 설명>`
