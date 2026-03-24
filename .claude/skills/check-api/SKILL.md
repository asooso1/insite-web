---
name: check-api
description: API 클라이언트 패턴 검증 (buildingId 주입, fetch 금지, any 타입)
allowed-tools: Bash, Grep
---

# API 패턴 검증

API 레이어 아키텍처 규칙 위반을 검사합니다. $ARGUMENTS

## 검사 항목

```bash
# 1. buildingId 수동 주입 (CRITICAL)
grep -rn "buildingId" src/lib/api/ | grep -v "injectBuildingId\|client.ts" | head -20

# 2. 직접 fetch 사용 금지
grep -rn "fetch(" src/lib/api/ | grep -v "client.ts\|error-handler" | head -20

# 3. NPE 방지 파라미터 기본값
grep -rn 'params\.\w* || ""\|params\.\w* ?? ""' src/lib/api/ | head -20

# 4. console.log
grep -rn "console\." src/lib/api/ | grep -v "NODE_ENV\|development" | head -20

# 5. any 타입
grep -rn ": any\|as any\|<any>" src/lib/api/ | head -20
```

## API 함수 네이밍

| CRUD | 함수명 |
|------|--------|
| 목록 | `get{Module}List(params)` |
| 상세 | `get{Module}Detail(id)` |
| 등록 | `add{Module}(data)` |
| 수정 | `update{Module}(data)` |
| 삭제 | `delete{Module}(id)` |
| 엑셀 | `download{Module}Excel(params)` |
