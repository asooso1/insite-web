# /check-components - 컴포넌트 패턴 검증

컴포넌트 코드에서 디자인 시스템 및 패턴 규칙 위반을 검사합니다.

## 검사 항목

### 1. 금지된 직접 색상 클래스 (StatusBadge 미사용)
```bash
grep -rn "text-green-\|text-red-\|text-yellow-\|text-blue-\|bg-green-\|bg-red-" src/app/ src/components/ | grep -v ".stories.\|StatusBadge" | head -20
```

### 2. window.alert / window.confirm 사용 금지
```bash
grep -rn "window\.alert\|window\.confirm\|^  alert(\|^    alert(" src/app/ src/components/ | head -20
```
→ `toast.error()` / `AlertDialog` 로 교체 필요

### 3. 직접 fetch 사용 (Client Component)
```bash
grep -rn "^import.*fetch\|= fetch(" src/app/ | grep -v "api/\|route.ts\|server" | head -20
```

### 4. console.log 프로덕션 코드
```bash
# app/ 에서 API 라우트(서버사이드) 제외, 클라이언트 코드만 검사
grep -rn "console\.log\|console\.error\|console\.warn" src/app/ src/components/ | grep -v "NODE_ENV\|development\|\.stories\.|src/app/api/\|src/app/error\." | head -20
```
> 참고: `src/app/api/` 서버 라우트의 console.error는 서버 로깅 목적으로 허용.

### 5. raw <table> 태그 사용 (DataTable 미사용)
```bash
grep -rn "<table\b\|<tbody\b\|<thead\b\|<tr\b" src/app/ src/components/ | grep -v "ui/table\|\.stories\." | head -20
```

### 6. raw <input type="checkbox"> 사용
```bash
grep -rn 'type="checkbox"' src/app/ src/components/ | grep -v "Checkbox\|\.stories\." | head -20
```

### 7. !important 사용
```bash
grep -rn "!important" src/app/ src/components/ src/lib/ | head -20
```

### 8. 인라인 스타일 사용
```bash
grep -rn 'style={{' src/app/ src/components/ | grep -v "\.stories\." | head -20
```

### 9. any 타입 사용
```bash
grep -rn ": any\b\|as any\b\|<any>" src/app/ src/components/ src/lib/ | grep -v "\.stories\.\|\.d\.ts" | head -30
```

### 10. 리스트 key에 index 사용
```bash
grep -rn "key={index}\|key={i}" src/app/ src/components/ | grep -v "\.stories\." | head -20
```

## 컴포넌트 사용 규칙

| 상황 | 금지 | 허용 |
|------|------|------|
| 상태 표시 | `className="text-green-600"` | `<StatusBadge status="COMPLETE" />` |
| 테이블 | `<table><tr>...` | `<DataTable columns={...} />` |
| 체크박스 | `<input type="checkbox">` | `<Checkbox />` |
| 삭제 확인 | `window.confirm()` | `<AlertDialog>` |
| 알림 | `window.alert()` | `toast.error()` |
| 빈 상태 | 직접 구현 | `<EmptyState type="no-data" />` |
| 에러 상태 | 직접 구현 | `<EmptyState type="error" onRetry={} />` |

## 폼 페이지 필수 체크

- [ ] React Hook Form + Zod 스키마 사용
- [ ] `toast.success("저장되었습니다.")` 성공 피드백
- [ ] `handleApiError(error)` 실패 피드백
- [ ] 삭제 시 `AlertDialog` 사용

$ARGUMENTS
