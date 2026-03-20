# /check-api - API 클라이언트 패턴 검증

API 레이어 코드에서 아키텍처 규칙 위반을 검사합니다.

## 검사 항목

### 1. buildingId 자동 주입 패턴 검사 (CRITICAL)
```bash
# 직접 buildingId를 수동으로 추가하는 코드 탐색
grep -rn "buildingId" src/lib/api/ | grep -v "injectBuildingId\|client.ts" | head -20
```
**규칙**: `apiClient.*` 사용 시 buildingId 수동 추가 금지. `injectBuildingId()`가 자동 처리.

### 2. 직접 fetch 사용 금지 검사
```bash
grep -rn "fetch(" src/lib/api/ | grep -v "client.ts\|error-handler" | head -20
```
**규칙**: 모든 API 호출은 `apiClient.get/post/put/delete/postForm/putForm/getBlob` 사용.

### 3. 백엔드 NPE 방지 파라미터 검사
```bash
grep -rn "params\.\w* || \"\"\|params\.\w* ?? \"\"" src/lib/api/ | head -20
```
null/undefined가 될 수 있는 필수 파라미터는 빈 문자열 기본값 필수.

### 4. type 파라미터 일관성 검사
```bash
grep -rn "params\.type" src/lib/api/ | head -20
```
type 파라미터는 `params.type || "all"` 패턴으로 통일.

### 5. console.log 프로덕션 코드 검사
```bash
grep -rn "console\." src/lib/api/ | grep -v "NODE_ENV\|development" | head -20
```

### 6. any 타입 사용 검사
```bash
grep -rn ": any\|as any\|<any>" src/lib/api/ | head -20
```

## apiClient 사용 패턴

```typescript
// ✅ 올바른 패턴 - buildingId 자동 주입
apiClient.get<T>('/api/module/list', { page: 1 })
apiClient.post<T>('/api/module/add', data)
apiClient.put<T>('/api/module/update', data)
apiClient.delete<T>('/api/module/delete/1')
apiClient.postForm<T>('/api/module/upload', formData)
apiClient.putForm<T>('/api/module/update', formData)
apiClient.getBlob('/api/module/excel')

// ❌ 금지 패턴
fetch('/api/module/list?buildingId=123')
fetch('/api/module/list', { headers: { Authorization: `Bearer ${token}` } })
```

## API 함수 네이밍 패턴

| CRUD | 함수명 패턴 |
|------|------------|
| 목록 | `get{Module}List(params)` |
| 상세 | `get{Module}Detail(id)` |
| 등록 | `add{Module}(data)` |
| 수정 | `update{Module}(data)` |
| 삭제 | `delete{Module}(id)` |
| 엑셀 | `download{Module}Excel(params)` |

$ARGUMENTS
