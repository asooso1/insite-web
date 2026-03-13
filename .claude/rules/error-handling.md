# 에러 처리 표준

적용 대상: `**/*.ts`, `**/*.tsx`

## API 에러 처리

**공용 핸들러 사용 의무:**
```typescript
// 올바른 패턴
try {
  await addFacility(data);
  toast.success("시설이 등록되었습니다.");
} catch (error) {
  handleApiError(error); // src/lib/api/error-handler.ts
}
```

**상태 코드별 처리:**
| 상태 | 처리 |
|------|------|
| 401 (토큰 만료) | `handleAuthExpired()` → 로그아웃 + /login |
| 401 (권한 부족) | `toast.error("접근 권한이 없습니다.")` - 로그아웃 안 함 |
| 403 | `toast.error("접근 권한이 없습니다.")` |
| 404 | `toast.error("데이터를 찾을 수 없습니다.")` |
| 500 | `toast.error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")` |

## 사용자 피드백

| 상황 | 사용 방법 |
|------|----------|
| 성공 | `toast.success("한국어 메시지")` |
| 실패/오류 | `toast.error("한국어 메시지")` |
| 경고 | `toast.warning("한국어 메시지")` |
| 정보 | `toast.info("한국어 메시지")` |

**금지 패턴:**
- `window.alert()` 사용 금지
- `window.confirm()` 사용 금지 → AlertDialog 사용
- `console.error()` 프로덕션 코드 금지

## 삭제 확인

```typescript
// 올바른 패턴 - AlertDialog 필수
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">삭제</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>삭제 확인</AlertDialogTitle>
      <AlertDialogDescription>
        이 작업은 되돌릴 수 없습니다. 계속하시겠습니까?
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>취소</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>삭제</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## 로그아웃 패턴

```typescript
// 올바른 패턴 - try/finally 필수
async function performLogout(): Promise<void> {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch {
    // API 실패해도 클라이언트 상태는 정리
  } finally {
    clearAuth();
    router.push("/login");
  }
}
```

## 파일 다운로드 패턴

```typescript
// 올바른 패턴 - DOM 정리 보장
let a: HTMLAnchorElement | null = null;
try {
  const blob = await downloadFile(params);
  const url = window.URL.createObjectURL(blob);
  a = document.createElement("a");
  a.href = url;
  a.download = "파일명.xlsx";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
} finally {
  if (a?.parentNode) document.body.removeChild(a);
}
```

## 비동기 함수 onClick 패턴

```typescript
// 올바른 패턴
const handleSubmit = async (): Promise<void> => { ... };
// onClick에서 void 연산자 또는 래퍼 사용
onClick={() => void handleSubmit()}
// 또는
onClick={handleSubmit} // React 이벤트 핸들러는 Promise 반환 허용
```

## 체크리스트

- [ ] 모든 API 호출에 try/catch 있음
- [ ] 사용자 피드백은 Sonner toast 사용
- [ ] 삭제는 AlertDialog 사용 (window.confirm 금지)
- [ ] 로그아웃은 try/finally 패턴 사용
- [ ] 파일 다운로드는 finally에서 DOM 정리
- [ ] console.error는 개발 환경에서만
