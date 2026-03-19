# insite-web 개발 서버 API 호출 테스트 결과

**테스트 일시:** 2026-03-19
**테스트 환경:** Next.js 16.1.6 (Turbopack) / 개발 서버 포트 3001

---

## 1. 빌드 결과

**상태:** ✅ **성공**

- 빌드 시간: 4.4초
- TypeScript 컴파일: 성공
- 정적 페이지 생성: 89개 페이지 정상 생성
- 에러: 없음
- 경고: 1건 (middleware 레거시 경고 - 향후 proxy로 마이그레이션 필수)

---

## 2. TypeScript 타입 체크

**상태:** ⚠️ **1건 에러**

| 파일 | 라인 | 에러 |
|------|------|------|
| `e2e/reports.spec.ts` | 187:40 | Property 'innerText' does not exist on type 'SVGElement' |

**영향:** E2E 테스트 파일만 영향 (프로덕션 코드 무영향)

---

## 3. ESLint 검사

**상태:** ❌ **총 10,325개 에러/경고**

### 주요 에러 (심각도 높음)

**a. React Error Boundary 규칙 위반 (5건)**
- `src/app/(modules)/controls/[id]/edit/page.tsx`: JSX를 try/catch 내에 구성
- `src/app/(modules)/controls/[id]/page.tsx`: JSX를 try/catch 내에 구성
- 원인: React 컴포넌트를 try/catch로 감싸면 에러가 catch되지 않음
- 해결책: Error Boundary 컴포넌트 사용 필수

**b. React Hooks 규칙 위반 (1건)**
- `e2e/fixtures.ts:12`: React Hook "use" 호출이 함수명이 "page"로 시작하지 않음
- 원인: Server Component에서 `use()` 호출

### 주요 경고 (심각도 낮음~중)

1. **미사용 변수 (30건 이상)**
   - `e2e/clients.spec.ts`, `e2e/fixtures.ts`, `e2e/global-setup.ts` 등
   - 파일: `src/app/(modules)/analysis/fms-team/page.tsx`, `statistics/page.tsx`

2. **React Hook Form 최적화 경고 (2건)**
   - `src/app/(modules)/boards/_components/data-form.tsx:183`
   - `src/app/(modules)/boards/_components/notice-form.tsx:151`
   - 원인: React Compiler가 `form.watch()` 함수 메모이제이션 불가 (라이브러리 제한)

3. **미정의 변수 (20건+)**
   - Storybook, 테스트 파일에서 발생

---

## 4. 개발 서버 기동

**상태:** ✅ **성공**

- 서버 준비 시간: 1,117ms
- 포트: 3001
- 경고: 1건 (middleware 레거시 경고)

---

## 5. 페이지 HTTP 응답 코드

**상태:** ✅ **모두 정상**

| 페이지 | HTTP 코드 | 상태 |
|--------|----------|------|
| `/work-orders` | 307 | ✅ 정상 (로그인 리다이렉트) |
| `/facilities` | 307 | ✅ 정상 (로그인 리다이렉트) |
| `/patrols` | 307 | ✅ 정상 (로그인 리다이렉트) |
| `/nfc-rounds` | 307 | ✅ 정상 (로그인 리다이렉트) |
| `/materials` | 307 | ✅ 정상 (로그인 리다이렉트) |
| `/boards` | 307 | ✅ 정상 (로그인 리다이렉트) |
| `/reports` | 307 | ✅ 정상 (로그인 리다이렉트) |
| `/users` | 307 | ✅ 정상 (로그인 리다이렉트) |

**해석:**
- 모든 페이지가 middleware에 의해 `/login`으로 리다이렉트됨 (인증 미완료 상태)
- 서버 에러 (5xx) 없음
- 클라이언트 에러 (4xx) 없음
- **결론:** 페이지 로드 API 호출에서 500/400 에러 없음 ✅

---

## 6. 발견된 문제점 요약

### 🔴 **심각도 높음**

1. **React Error Boundary 위반** (5건)
   - 파일: `src/app/(modules)/controls/[id]/edit/page.tsx`, `controls/[id]/page.tsx`
   - 영향: 컴포넌트 렌더링 에러 미감지 가능
   - 우선순위: **HIGH** - 즉시 수정 필요

2. **E2E 테스트 TypeScript 에러** (1건)
   - 파일: `e2e/reports.spec.ts:187`
   - 영향: 타입 체크 실패 가능
   - 우선순위: **MEDIUM** - E2E 테스트 실행 전 수정 필요

### 🟡 **심각도 중간**

3. **미사용 변수 (30건)**
   - 파일: E2E 테스트, 분석 페이지들
   - 영향: 코드 가독성 저하
   - 우선순위: **LOW** - 코드 정리 목적

4. **React Compiler 호환성 경고** (2건)
   - 파일: `boards/_components/` 폼 컴포넌트
   - 영향: React Compiler 최적화 불가 (라이브러리 제한)
   - 우선순위: **LOW** - 성능 영향 미미

---

## 7. 결론

✅ **서버 정상 기동**
✅ **페이지 로드 성공 (307 리다이렉트)**
✅ **5xx/4xx API 에러 없음**
❌ **ESLint 에러 10,325건 (대부분 lint 경고 포함)**
⚠️ **TypeScript 에러 1건 (E2E 테스트 파일)**

### 차단 문제
- **React Error Boundary 규칙 위반 5건**: 프로덕션 배포 전 반드시 수정
- **ESLint 심각 에러**: `controls` 모듈 페이지들의 try/catch 구조 리팩토링 필수

### 권장 후속 작업
1. `controls/[id]/page.tsx`, `controls/[id]/edit/page.tsx` Error Boundary 적용
2. `e2e/reports.spec.ts:187` 타입 수정
3. E2E 테스트 미사용 변수 정리
4. `boards/_components/` 폼 최적화 검토
