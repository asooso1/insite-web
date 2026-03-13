# insite-web E2E 테스트 스펙

> Playwright를 사용한 엔드-투-엔드 테스트 가이드

## 개요

이 디렉토리는 insite-web의 E2E 테스트를 관리합니다.

**테스트 구조:**
- `global-setup.ts`: 모든 테스트 실행 전 인증 상태 설정
- `fixtures.ts`: Playwright 커스텀 fixture 정의 (인증 상태 재사용)
- `helpers/auth.ts`: 인증 관련 헬퍼 함수 (login, logout, etc.)
- `*.spec.ts`: 각 모듈별 테스트 스펙

## 작업 목록 (작업지시)

**파일:** `work-orders.spec.ts`

작업 목록 페이지의 핵심 기능 검증:

### 테스트 케이스

1. **페이지 로드 확인**
   - URL이 `/work-orders`로 올바르게 로드됨

2. **페이지 헤더 검증**
   - 제목: "작업 목록"
   - 설명: "작업지시를 관리합니다."

3. **신규 작업 등록 버튼**
   - "새 작업" 버튼 표시
   - 클릭 시 `/work-orders/new`로 네비게이션

4. **상태 필터 탭**
   - 다음 탭 표시: 전체, 작성, 발행, 처리중, 완료요청, 완료, 취소
   - 각 탭은 데이터 필터링

5. **검색 기능**
   - 검색 입력 필드 표시 ("작업명 검색...")
   - 입력 시 API 호출로 필터링

6. **엑셀 다운로드**
   - "엑셀" 버튼 표시 및 동작

7. **데이터 테이블**
   - 테이블 또는 빈 상태("작업이 없습니다") 표시

8. **필터링 동작**
   - 상태 탭 클릭으로 필터링
   - 검색어 입력으로 필터링

9. **에러 처리**
   - API 호출 실패 시에도 페이지 구조 유지
   - 에러 메시지: "데이터를 불러올 수 없습니다"
   - 재시도 버튼 제공

## 시설 관리

**파일:** `facilities.spec.ts`

시설 목록 페이지의 핵심 기능 검증:

### 테스트 케이스

1. **페이지 로드 확인**
   - URL이 `/facilities`로 올바르게 로드됨

2. **페이지 헤더 검증**
   - 제목: "시설 목록"
   - 설명: "시설을 관리합니다."

3. **신규 시설 등록 버튼**
   - "새 시설" 버튼 표시
   - 클릭 시 `/facilities/new`로 네비게이션

4. **상태 필터 탭**
   - 다음 탭 표시: 전체, 운영중, 운영전, 점검중, 운영완료, 폐기
   - 각 탭은 데이터 필터링

5. **검색 기능**
   - 검색 입력 필드 표시 ("시설명 검색...")
   - 입력 시 API 호출로 필터링

6. **엑셀 다운로드**
   - "엑셀" 버튼 표시 및 동작

7. **데이터 테이블**
   - 테이블 또는 빈 상태("시설이 없습니다") 표시

8. **필터링 동작**
   - 상태 탭 클릭으로 필터링
   - 검색어 입력으로 필터링

9. **에러 처리**
   - API 호출 실패 시에도 페이지 구조 유지
   - 에러 메시지: "데이터를 불러올 수 없습니다"
   - 재시도 버튼 제공

## 테스트 실행 방법

### 로컬에서 테스트 실행

```bash
# 모든 테스트 실행
npm run e2e

# 특정 파일 테스트
npm run e2e -- work-orders.spec.ts

# UI 모드로 실행 (디버깅 용이)
npm run e2e -- --ui

# 특정 브라우저에서만 실행
npm run e2e -- --project=chromium
```

### CI 환경에서 테스트 실행

```bash
CI=true npm run e2e
```

## 인증 흐름

### 저장된 인증 상태 재사용

1. **첫 실행**: `global-setup.ts`가 자동 실행
   - 테스트 사용자로 로그인 (기본값: admin / admin123)
   - 인증 상태를 `e2e/.auth/user.json`에 저장

2. **이후 테스트**: `storageState` 자동 로드
   - 각 테스트마다 저장된 쿠키와 localStorage 자동 복원
   - 반복 로그인 불필요 (성능 향상)

### 인증 상태 무효화

인증이 만료되거나 재설정이 필요한 경우:
```bash
rm -rf e2e/.auth/
```

다음 테스트 실행 시 `global-setup.ts`가 다시 인증 상태를 생성합니다.

## 환경변수 설정

### 테스트 사용자 커스터마이징

기본 로그인 정보 (`admin` / `admin123`) 대신 다른 사용자 사용:

```bash
TEST_USER_ID=testuser TEST_PASSWORD=testpass npm run e2e
```

## 작성 패턴

### Fixture 사용

```typescript
import { test, expect } from "./fixtures";

test("페이지 테스트", async ({ page }) => {
  // 인증 상태가 자동으로 로드되어 있음
  await page.goto("/work-orders");
  await expect(page).toHaveURL("/work-orders");
});
```

### Selector 우선순위

1. **Role-based selector** (접근성 우수)
   ```typescript
   page.getByRole("button", { name: "새 작업" })
   page.getByRole("tab", { name: "작성" })
   page.getByRole("heading", { name: "작업 목록" })
   ```

2. **Placeholder-based selector** (입력 필드)
   ```typescript
   page.getByPlaceholder("작업명 검색...")
   ```

3. **Text matcher** (텍스트 기반)
   ```typescript
   page.getByText("작업지시를 관리합니다.")
   ```

### 대기 패턴

```typescript
// 네트워크 요청 대기
await page.waitForLoadState("networkidle");

// 특정 요소 대기
await expect(element).toBeVisible({ timeout: 10000 });
```

### 에러 처리 시뮬레이션

```typescript
// API 오류 시뮬레이션
await page.route("**/api/work-orders**", (route) => {
  route.abort("failed");
});

// 페이지 새로고침
await page.reload();
```

## 고려사항

### API 의존성

테스트는 다음을 가정합니다:
- 로컬 Next.js 개발 서버 실행 (`npm run dev`)
- csp-was 백엔드 정상 작동
- 테스트 사용자 계정 존재

### 네트워크 대기

- `networkidle`: 500ms 동안 네트워크 활동이 없음을 대기
- 목록 페이지는 데이터 로드에 시간이 걸릴 수 있음

### 페이지 구조 검증

각 테스트는 다음을 확인합니다:
- ✅ 페이지가 올바른 URL에서 로드됨
- ✅ 핵심 UI 요소가 표시됨
- ✅ 필터링 및 검색 기능 동작
- ✅ API 오류 시에도 페이지 구조가 유지됨

## 추가 리소스

- [Playwright 공식 문서](https://playwright.dev)
- [Testing Library Selectors](https://testing-library.com/docs/queries/about)
- `e2e/helpers/auth.ts`: 인증 헬퍼 함수
