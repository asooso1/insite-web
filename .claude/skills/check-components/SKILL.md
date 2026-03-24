---
name: check-components
description: 컴포넌트 패턴 검증 (window.alert, console.log, StatusBadge, DataTable, any 타입)
allowed-tools: Bash, Grep
---

# 컴포넌트 패턴 검증

디자인 시스템 및 패턴 규칙 위반을 검사합니다. $ARGUMENTS

## 검사 항목

```bash
# 1. StatusBadge 미사용 (직접 색상 클래스)
grep -rn "text-green-\|text-red-\|text-yellow-\|bg-green-\|bg-red-" src/app/ src/components/ | grep -v ".stories.\|StatusBadge" | head -20

# 2. window.alert/confirm
grep -rn "window\.alert\|window\.confirm\|window\.prompt" src/app/ src/components/ | head -20

# 3. console.log 프로덕션 코드
grep -rn "console\.log\|console\.error" src/app/ src/components/ | grep -v "NODE_ENV\|\.stories\.\|src/app/api/" | head -20

# 4. raw <table> (DataTable 미사용)
grep -rn "<table\b\|<tbody\b" src/app/ src/components/ | grep -v "ui/table\|\.stories\." | head -20

# 5. !important
grep -rn "!important" src/app/ src/components/ src/lib/ | head -20

# 6. 인라인 스타일
grep -rn 'style={{' src/app/ src/components/ | grep -v "\.stories\." | head -20

# 7. any 타입
grep -rn ": any\b\|as any\b" src/app/ src/components/ src/lib/ | grep -v "\.stories\.\|\.d\.ts" | head -30
```

## 필수 컴포넌트 매핑

| 상황 | 금지 | 사용 |
|------|------|------|
| 상태 표시 | `className="text-green-600"` | `<StatusBadge status="..." />` |
| 테이블 | `<table>` | `<DataTable columns={} />` |
| 삭제 확인 | `window.confirm()` | `<AlertDialog>` |
| 알림 | `window.alert()` | `toast.error()` |
| 빈 상태 | 직접 구현 | `<EmptyState type="no-data" />` |
