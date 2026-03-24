# insite-web 문서 감사 보고서

> **분석 기준일**: 2026-03-11
> **분석 범위**: 규칙 문서 + 모듈별 CLAUDE.md + 구현 코드 + docs/ 파일
> **목표**: 현재 룰의 완성도 평가, 누락된 규칙 식별, docs → rules 격상 필요 항목 도출

---

## 1. 현재 룰 현황 분석

### 1.1 기존 규칙 파일 (5개)

| 파일 | 라인수 | 완성도 | 평가 |
|------|--------|--------|------|
| `CLAUDE.md` | 130 | 70% | 인증 아키텍처는 상세하지만 구현 패턴 설명 부족 |
| `coding-style.md` | 48 | 75% | 핵심 원칙은 명확하나 실제 코드와 일부 불일치 |
| `git-workflow.md` | 37 | 85% | 커밋/PR 프로세스 명확, 에이전트 참조는 OMC 문서로 이관 가능 |
| `testing.md` | 49 | 60% | 기본 구조만 있음, 구체적 예시 부족 |
| `performance.md` | 41 | 50% | 모델 선택 가이드는 OMC 문서 중복, Next.js 최적화는 실제 구현과 괴리 |
| `security.md` | 39 | 65% | 체크리스트는 있으나 실제 구현 사례 부족 |

**총평**: 기본 틀은 있지만 **실제 코드와 괴리**, 구체적 예시 부족, 실제 구현된 패턴과 불일치 문제

---

## 2. 코드 vs 문서 불일치 분석

### 2.1 높은 우선순위 불일치 사항

#### 2.1.1 URL 상태 관리 (CRITICAL)

**문서 (CLAUDE.md 라인 27)**:
```
신규 모듈은 nuqs 사용 (useQueryState + parsers). 기존 모듈은 useState 사용중.
```

**실제 코드**:
- ✅ `nuqs` 사용: analysis, fieldwork, settings 모듈 (신규 모듈)
- ❌ `useState` 사용: work-orders, facilities 등 기존 모듈도 혼재됨
- 실제 패턴: **모듈과 무관하게 선택적 사용** (페이지/컴포넌트 복잡도에 따라 결정)

**권장 변경**:
```
URL 상태 관리:
- 단순 필터링: useState 사용
- 복잡한 다중 필터/탭: nuqs 사용 (useQueryState + parsers)
- 새 모듈부터는 nuqs 권장
- 기존 모듈 리팩토링 시 복잡도 평가 후 선택
```

#### 2.1.2 API 클라이언트 패턴 (HIGH)

**문서 (CLAUDE.md 라인 81-85)**:
```
개별 export 함수 패턴 (get{Module}List, add{Module} 등)
- URL 패턴/HTTP method는 모듈마다 상이 → csp-was 컨트롤러 확인 필수
- JSON body: apiClient.post/put | 파일 포함: apiClient.postForm/putForm
```

**실제 코드 (src/lib/api/*.ts)**:
- ✅ 함수별 내보내기 패턴 일관성 있음
- ⚠️ 하지만 `apiClient.postForm` 사용 없음 (모든 파일 업로드는 FormData 처리)
- ⚠️ 일부 API가 불규칙한 URL 패턴 사용:
  - `getWorkOrderStatePerCount()`: `/open/workOrder/...` (공개 엔드포인트)
  - 대부분: `/api/...` (인증 필요)
- ⚠️ SearchVO 파라미터가 복잡하지만 기본 권장 구조는 따름

**권장 변경**:
```
## API 클라이언트 패턴

### URL 패턴 (csp-was 컨트롤러별 상이)
- 인증 필요: /api/{module}/...
- 공개 (JWT 불필요): /open/{module}/...
- 위젯/대시보드: /widget/{module}/...

예시:
- /api/workOrder/workOrderList (인증)
- /open/workOrder/workOrderStatePerCount (공개)

### 함수 네이밍
- 조회: get{Module}List, get{Module}View, get{Module}StateCount
- 생성/수정: create{Module}, update{Module}, copy{Module}
- 상태 변경: issue{Module}, approve{Module}, cancel{Module}
- 다중 작업: {action}Multi{Module}

### 요청 본문 처리
- JSON 요청: apiClient.post/put (자동 JSON.stringify)
- FormData (파일 포함):
  - new FormData() 생성 후 append()로 필드 추가
  - apiClient.post에 FormData 직접 전달 (Content-Type 자동 설정)
  - 예: src/lib/api/facility.ts (QR/NFC 이미지 업로드)
```

#### 2.1.3 타입 정의 패턴 (HIGH)

**문서**:
```
Enum: const assertion + Label Record + Style Record 매핑
DTO: 백엔드 응답 인터페이스 (id, 필드들)
VO: 생성/수정 요청 (required만 필수)
SearchVO: 검색 파라미터 (keyword?, page?, size?)
```

**실제 코드**:
- ✅ Enum + Label + Style 3단계 매핑 일관됨
- ✅ DTO/VO 분리 기본 패턴 따름
- ⚠️ 하지만 **중첩 DTO 패턴이 복잡함**:
  - `WorkOrderListDTO { workOrderDTO, ... }` (1단계 래핑)
  - `SearchWorkOrderVO` (15개+ 선택 필드)
- ⚠️ **응답 타입 일관성 부족**:
  - 일부: `WorkOrderListResponse { code, message, data: WorkOrderListDTO[] }`
  - 일부: 직접 DTO 배열 반환
- ⚠️ **SearchVO 크기**: WorkOrder (15개), Facility (10개+) → 검색 조건 문서화 필요

**권장 추가**:
```
## 타입 정의 세부 가이드

### 중첩 DTO 처리
백엔드가 래핑된 응답을 반환할 때:
```typescript
// ❌ 피해야 할 패턴
export interface WorkOrderListDTO {
  workOrderDTO: { id, name, ... };  // 한 단계 더 래핑
}

// ✅ 권장 패턴
export interface WorkOrderDTO {
  id: number;
  name: string;
  // ...
}
export type WorkOrderListDTO = WorkOrderDTO;  // 별칭으로 의도 명확화
```

### SearchVO 크기 관리
- 15개 이상 필드: 주석으로 필수/선택 명시
- 선택 필드는 모두 optional (?)로 표기
- 필터링 가능한 값들은 `const` Enum으로 정의
```

#### 2.1.4 React Query 훅 패턴 (HIGH)

**문서**:
```
Keys Factory: all > lists > list(params) > details > detail(id)
useQuery: queryKey + queryFn 조합
useMutation: mutationFn + onSuccess invalidateQueries
```

**실제 코드**:
- ✅ Keys Factory 패턴 일관됨
- ✅ staleTime/gcTime 설정 미포함 (성능 규칙과 괴리)
- ⚠️ **invalidateQueries 패턴 불완전**:
  - 예: `queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() })`
  - 하지만 페이지네이션된 목록은 여러 캐시 키가 있음
  - 목록 수정 후 특정 페이지만 캐시 무효화되지 않음 (전체 목록이 오염됨)

**권장 추가**:
```
## React Query 훅 패턴 심화

### 캐시 무효화 전략
1. 목록 수정 → 모든 목록 캐시 무효화
   ✅ queryClient.invalidateQueries({ queryKey: moduleKeys.lists() })

2. 상세 수정 → 해당 ID 캐시만 무효화
   ✅ queryClient.invalidateQueries({ queryKey: moduleKeys.detail(id) })

3. 페이지네이션 주의
   - 목록 수정 시 모든 페이지 캐시 무효화
   - 예: updateWorkOrder → invalidate workOrderKeys.lists()

### staleTime 설정 (성능.md에서도 중복)
- 목록 페이지: 30초 (변경 빈도 낮음)
- 상세 페이지: 60초 (안정적)
- 대시보드 KPI: 5분 (거의 변경 없음)
- 예:
  ```typescript
  useQuery({
    queryKey,
    queryFn,
    staleTime: 30000,  // 30초
    gcTime: 5 * 60 * 1000,  // 5분 (기본값)
  })
  ```
```

### 2.2 중간 우선순위 불일치 사항

#### 2.2.1 에러 처리 (MEDIUM)

**문서 (coding-style.md)**:
```
async/await + try-catch 사용
사용자 노출 메시지는 한국어로
```

**실제 코드**:
- ✅ try-catch 기본 따름
- ✅ 한국어 메시지 일관됨
- ⚠️ **에러 핸들링 구조 미문서화**:
  - `src/lib/api/error-handler.ts` 존재하지만 문서에 언급 없음
  - `ApiError` 클래스, `extractApiError()` 함수 구현됨
  - 실제 사용: 모든 API 함수에서 `await apiClient.get/post()` 만 사용
  - 에러는 `apiClient` 내부에서 처리됨

**권장 추가**:
```
## 에러 처리 상세 규칙

### API 요청 에러 처리
1. apiClient가 처리하는 에러:
   - 401 (만료): 자동 로그아웃 + /login 리다이렉트
   - 401 (권한 부족): 무시 (csp-was pageInfoId 미구현)
   - 4xx/5xx: ApiError 예외 발생

2. 호출부에서의 처리:
   ```typescript
   try {
     const data = await getWorkOrderList(params);
     // 성공 처리
   } catch (error) {
     const { message } = extractApiError(error);
     toast.error(message);  // 사용자 노출
   }
   ```

### 에러 메시지 노출 규칙
- 서버 에러 (4xx/5xx): 서버 메시지 그대로 사용
- 네트워크 에러: "네트워크 오류가 발생했습니다"
- 타임아웃: "요청 시간이 초과했습니다"
- 모든 메시지는 한국어로
```

#### 2.2.2 입력 검증 (MEDIUM)

**문서 (coding-style.md)**:
```
Zod 스키마 기반 검증 적용
검증 실패 시 조기 종료
```

**실제 코드**:
- ✅ react-hook-form + Zod 조합 (로그인 폼)
- ⚠️ **검증 스키마 파일 구조 미정의**:
  - 실제: `src/lib/validations/auth.ts` (로그인만)
  - 다른 모듈: 검증 스키마 없음 (모두 폼에 임베드됨)
  - 권장: 모든 폼 입력에 Zod 스키마 필요

**권장 추가**:
```
## 입력 검증 규칙

### 검증 스키마 구조
1. 파일 위치: `src/lib/validations/{module}.ts`
2. 모든 폼 입력에 Zod 스키마 정의
3. 예시:
   ```typescript
   import { z } from 'zod';

   export const workOrderSchema = z.object({
     title: z.string().min(1, "제목은 필수입니다"),
     description: z.string().optional(),
     startDate: z.date(),
   });

   export type WorkOrderFormData = z.infer<typeof workOrderSchema>;
   ```

4. 폼 사용 시:
   ```typescript
   const form = useForm<WorkOrderFormData>({
     resolver: zodResolver(workOrderSchema),
   });
   ```

### 검증 규칙 (필수)
- 필수 필드: min(1)
- 숫자 범위: z.number().min(0).max(999)
- 이메일: z.string().email()
- 날짜: z.date() 또는 z.string().refine(isValidDate)
- 선택 필드: .optional() 또는 .nullable()
```

#### 2.2.3 파일 업로드 (MEDIUM)

**현재 상황**:
- 실제 구현: 여러 모듈에서 파일 업로드 기능 있음
  - Facility (QR/NFC 이미지)
  - Board (첨부파일)
  - Report (첨부파일)
  - Material (?)
- 문서: **전혀 언급되지 않음**
- 패턴: FormData 생성 → append → apiClient.post

**권장 추가**:
```
## 파일 업로드 패턴

### 다중 필드 FormData 처리
```typescript
async function uploadFacilityImage(id: number, file: File): Promise<void> {
  const formData = new FormData();
  formData.append('id', String(id));
  formData.append('image', file);

  // apiClient가 자동으로 multipart/form-data Content-Type 설정
  return apiClient.post(`/api/facility/upload`, { body: formData });
}
```

### 드래그&드롭 + 미리보기
- 컴포넌트: `FileUpload` (src/components/forms/...)
- 지원 포맷: 폼 컴포넌트에서 accept 속성 정의
- 크기 제한: 명시적으로 검증
```

---

## 3. 누락된 규칙 (신규 작성 필요)

### 3.1 API 레이어 규칙 (NEW - HIGH)

**필요성**:
- 20개 API 클라이언트 파일 존재하지만 패턴 통일 문서 없음
- 수정된 CLAUDE.md의 패턴 설명이 불완전함

**내용 (신규 파일 추천: `api-layer-rules.md`)**:
```
- API 함수 네이밍 컨벤션 (상세)
- 파라미터 구성 (필수 vs 선택)
- 응답 타입 처리 (래핑된 응답 vs 직접 DTO)
- 에러 처리 패턴
- 파일 업로드 처리
- 페이지네이션 표준
- 필터 파라미터 구조 (SearchVO)
```

### 3.2 폼 구현 규칙 (NEW - HIGH)

**필요성**:
- 20개 폼 컴포넌트가 서로 다른 패턴 사용
- react-hook-form + Zod 조합만 문서화되지 않음
- FormField 사용 패턴 미정의

**내용 (신규 파일 추천: `forms-rules.md`)**:
```
- 폼 구조 (react-hook-form + Zod)
- FormField 컴포넌트 사용 패턴
- 상호작용 필드 (종속 선택, 조건부 표시)
- 폼 상태 관리 (로딩, 제출, 에러)
- 다중 폼 탭 처리
- 파일 입력 필드
- 날짜/시간 입력 필드
```

### 3.3 컴포넌트 구조 규칙 (NEW - MEDIUM)

**필요성**:
- 페이지 레이아웃에 일관성 있는 패턴 있음
- 문서화되지 않음

**내용**:
```
페이지 구조:
- PageHeader (제목 + 버튼 + 검색)
- Tabs (상태 필터링)
- DataTable (목록)
- Pagination (페이지네이션)

상세 페이지 구조:
- PageHeader + 뒤로가기
- InfoPanel (읽기 전용 정보)
- Tabs (다중 정보 섹션)
- ActionButtons (상태 변경 버튼)
```

### 3.4 테스트 구현 규칙 (NEW - MEDIUM)

**현재**: 테스트 규칙 존재하지만 구현 사례 없음

**필요 항목**:
```
- MSW 핸들러 작성 패턴 (현재 기본 설정만 있음)
- React Query 훅 테스트 (setupServer 사용)
- 컴포넌트 렌더링 테스트 (vitest + @testing-library/react)
- 폼 테스트 (react-hook-form 통합)
- 통합 테스트 (여러 모듈 상호작용)
```

### 3.5 상태 관리 규칙 (NEW - MEDIUM)

**현재**: 여러 저장소 사용하지만 규칙 없음
- `useAuthStore` (Zustand)
- `useUIStore` (Zustand)
- `useTenantStore` (Zustand)
- React Query (서버 상태)
- URL 상태 (nuqs/useState 혼재)

**필요 항목**:
```
- 상태 분류: 인증 vs UI vs 서버 vs URL
- Zustand 저장소 작성 패턴
- 서버 상태 vs 클라이언트 상태 구분
- 상태 동기화 (예: 빌딩 전환 시)
```

### 3.6 성능 최적화 세부 규칙 (NEW - MEDIUM)

**현재 규칙**: 일반적 가이드만 있음

**필요 항목** (실제 구현 사례로):
```
- DataTable 가상화 (TanStack Table v8 사용)
- 차트 지연 로딩 (next/dynamic)
- 이미지 최적화 (next/image 사용 현황)
- 번들 크기 모니터링 (analyze 스크립트)
- React Query staleTime 최적값 (모듈별)
```

### 3.7 인증/권한 규칙 (NEW - HIGH)

**현재**: CLAUDE.md의 인증 아키텍처는 상세하지만 구현 세부사항 부족

**필요 항목**:
```
- 쿠키 저장 메커니즘 (httpOnly 설정)
- 서버 컴포넌트에서 인증 확인
- 미들웨어에서의 토큰 검증
- 401 vs 403 처리 구분
- pageInfoId 임시 처리 (차단된 API 사항)
```

---

## 4. docs 파일에서 rules로 격상해야 할 내용

### 4.1 차단된 이슈 (csp-was-pageinfoid-issue.md)

**현재 위치**: `docs/csp-was-pageinfoid-issue.md`

**평가**:
- 상태: **필수 구현 필요** (Phase 7-9 동안 임시 우회)
- 내용: 매우 상세함 (권장/방안 포함)

**권장 변경**:
- 파일명 변경: `docs/api-blocking-issues.md` (향후 추가 이슈 포함)
- 또는 규칙에 통합: `security.md` 또는 별도 `auth-rules.md`
- 필수: 모든 개발자가 이 제약을 인지해야 함

**이관 후 규칙**:
```
## 알려진 API 차단 이슈

### pageInfoId 권한 체계 미구현
- 상태: 미구현 (Phase 7-9 임시 우회 중)
- 영향: /api/site/**, /api/workorder/** 등 일부 엔드포인트
- 임시 처리: isTokenExpired() 함수로 401 구분
- 해결 방안: csp-was JwtFilter 수정 1줄 필요
```

### 4.2 백엔드 API 문서화

**현재**: `docs/v1-api-reference.md` (부분적)

**평가**:
- OpenAPI 스펙 자동 생성 계획만 있음
- 실제 API 응답 구조 문서 없음
- 각 모듈별 SearchVO 파라미터 문서 없음

**권장**:
- 실제 필요: **각 모듈 API 문서** (또는 모듈별 CLAUDE.md에 추가)
- 내용:
  - API 엔드포인트 목록
  - 파라미터 정의 (필수/선택)
  - 응답 예시
  - 에러 코드

**예**: `src/lib/api/CLAUDE.md`에 추가
```
## API 클라이언트 구조

### 모듈별 API 문서
- work-order.ts: 작업지시 15개 함수, 검색 조건 12개
- facility.ts: 시설 14개 함수, 파일 업로드 2개
- ...
```

---

## 5. 모듈별 CLAUDE.md 일관성 검토

### 5.1 현황

**모듈별 CLAUDE.md 파일들** (총 30개, 대부분 빈 파일):
- ✅ 내용 있는 파일:
  - `src/app/(modules)/work-orders/CLAUDE.md` (claude-mem만)
  - `src/app/(modules)/facilities/CLAUDE.md` (claude-mem만)
  - `src/lib/types/CLAUDE.md` (claude-mem만)
  - `src/components/charts/CLAUDE.md` (claude-mem만)
  - `src/components/common/CLAUDE.md` (claude-mem만)
  - `src/lib/hooks/CLAUDE.md` (claude-mem만)
  - `src/lib/api/CLAUDE.md` (claude-mem만)

- ❌ 실제 문서 내용: **모두 없음** (claude-mem 메타데이터만)

### 5.2 평가

- 모듈별 CLAUDE.md는 **실제 역할을 하지 못함**
- claude-mem 메타데이터만 있어 혼란 초래
- 권장 사항:
  - **Option A**: 모든 모듈 CLAUDE.md 삭제 (claude-mem 메타는 보존됨)
  - **Option B**: 각 모듈에 실제 내용 작성 (비용 높음)

**권장 방향**: Option A + 모듈 문서화는 main CLAUDE.md에 통합

---

## 6. 우선순위별 개선 계획

### Priority 1 (Blocking - 즉시)

| 항목 | 현황 | 필요 | 파일 |
|------|------|------|------|
| URL 상태 관리 규칙 수정 | 오류 | 명확화 | CLAUDE.md |
| API 클라이언트 패턴 상세화 | 불완전 | 완성 | CLAUDE.md + new |
| 파일 업로드 패턴 문서화 | 없음 | 추가 | new |
| pageInfoId 이슈 공식화 | docs만 | rules로 이관 | security.md |

**예상 작업시간**: 4-6시간

### Priority 2 (High - 1주일 내)

| 항목 | 필요 | 파일 |
|------|------|------|
| 신규 API 레이어 규칙 파일 | 새로 작성 | `api-layer-rules.md` |
| 신규 폼 구현 규칙 파일 | 새로 작성 | `forms-rules.md` |
| 타입 정의 세부 가이드 추가 | CLAUDE.md에 추가 | CLAUDE.md |
| React Query 심화 가이드 추가 | CLAUDE.md에 추가 | CLAUDE.md |
| 에러 처리 패턴 문서화 | 새로 추가 | coding-style.md |

**예상 작업시간**: 8-12시간

### Priority 3 (Medium - 2주일 내)

| 항목 | 필요 | 파일 |
|------|------|------|
| 검증 스키마 구조 정의 | 추가 | coding-style.md |
| 컴포넌트 구조 패턴 | 새로 작성 | new |
| 상태 관리 규칙 | 새로 작성 | new |
| 테스트 구현 예시 | 추가 | testing.md |
| 모듈별 API 문서 | 참조용 추가 | lib/api/CLAUDE.md |

**예상 작업시간**: 10-15시간

### Priority 4 (Low - 추후)

| 항목 | 필요 |
|------|------|
| 모듈별 CLAUDE.md 정리 | 선택적 삭제 또는 통합 |
| 성능 프로파일링 가이드 | 추가 예시 |
| E2E 테스트 전략 | Playwright 실제 예시 |

---

## 7. 제안: 신규 규칙 파일 구조

### 추천 신규 파일들

#### 7.1 `rules/api-layer-rules.md`

내용:
```
- API 함수 네이밍 규칙 (상세)
- 파라미터 구성 (SearchVO)
- 응답 타입 처리
- 에러 처리 (apiClient → 호출부)
- 파일 업로드 (FormData)
- 페이지네이션
- React Query 캐시 무효화
```

#### 7.2 `rules/forms-rules.md`

내용:
```
- react-hook-form + Zod 패턴
- FormField 컴포넌트 사용법
- 검증 스키마 구조
- 상호작용 필드 (조건부, 종속)
- 폼 상태 관리
- 다중 탭 폼
- 파일/날짜 필드
```

#### 7.3 `rules/component-structure-rules.md`

내용:
```
- 페이지 레이아웃 표준
- 목록 페이지 구조 (Header + Tabs + Table + Pagination)
- 상세 페이지 구조 (InfoPanel + Tabs)
- 모바일 반응형 패턴
- 컴포넌트 파일 조직
```

#### 7.4 `rules/auth-rules.md` (또는 security.md 확장)

내용:
```
- 쿠키 저장 및 httpOnly 옵션
- 서버/클라이언트 컴포넌트에서 인증 확인
- 미들웨어 토큰 검증
- 401 vs 403 구분
- pageInfoId 임시 처리 (알려진 이슈)
```

### 권장 파일 구조 (최종)

```
.claude/
├── CLAUDE.md (메인, 핵심만 - 지금보다 간결)
└── rules/
    ├── coding-style.md (기존, 일부 수정)
    ├── git-workflow.md (기존, 유지)
    ├── testing.md (기존, 예시 추가)
    ├── performance.md (기존, 중복 제거)
    ├── security.md (기존, auth-rules 내용 추가)
    ├── api-layer-rules.md (신규)
    ├── forms-rules.md (신규)
    ├── component-structure-rules.md (신규)
    └── api-blocking-issues.md (docs/csp-was-pageinfoid-issue.md 이관)
```

---

## 8. 요약 및 권장사항

### 8.1 핵심 발견사항

1. **규칙과 코드 괴리**:
   - URL 상태 관리 (nuqs vs useState 실제 혼재)
   - API 패턴 (불완전한 문서화)
   - staleTime 설정 (성능 규칙과 구현 미동기)

2. **누락된 문서화**:
   - API 레이어 표준화 가이드
   - 폼 구현 표준 (react-hook-form 패턴)
   - 파일 업로드 처리
   - 검증 스키마 구조

3. **모듈별 CLAUDE.md**:
   - 30개 파일 중 실제 내용은 0개 (claude-mem 메타만)
   - 혼란 초래, 정리 필요

4. **Priority 있는 이슈**:
   - pageInfoId (알려진 이슈이지만 규칙에 미포함)
   - 에러 처리 패턴 (ApiError 클래스 미문서화)

### 8.2 즉시 실행 항목 (Phase 10 시작 전)

1. **CLAUDE.md 수정** (2시간)
   - URL 상태 관리 규칙 명확화
   - API 패턴 상세화
   - 인증 섹션 확장

2. **신규 규칙 파일 작성** (4시간)
   - `api-layer-rules.md` (고우선)
   - `forms-rules.md` (고우선)

3. **기존 규칙 수정** (2시간)
   - `coding-style.md`: 에러 처리, 검증 추가
   - `security.md`: auth-rules 내용 통합
   - `performance.md`: 중복 제거, React Query staleTime 추가

4. **모듈별 CLAUDE.md 정리** (1시간)
   - 실제 내용 없는 파일들 삭제 결정

**총 예상 작업시간**: 8-10시간

---

## 부록: 구체적 파일 변경 사항

### A.1 CLAUDE.md 수정 항목

**라인 27 (URL 상태 관리)**
```
현재: 신규 모듈은 `nuqs` 사용. 기존 모듈은 `useState` 사용중.

변경:
URL 상태 관리:
- 단순 필터링 (1-2개): useState 사용
- 복잡한 다중 필터/탭: nuqs 사용 (useQueryState + parsers)
- 참고: 신규 모듈 권장은 nuqs지만 복잡도 판단 후 선택
```

**라인 81-85 (API 패턴)**
```
추가:
### 응답 타입 처리
- 인증 필요 API: /api/{module}/...
- 공개 API: /open/{module}/...
- 위젯 API: /widget/{module}/...

### 함수 네이밍
- get{Module}List / get{Module}View / get{Module}StateCount
- create{Module} / update{Module} / copy{Module}
- issue{Module} / approve{Module} / cancel{Module}
- {action}Multi{Module}

### SearchVO 파라미터
- WorkOrderVO: 기간, 필터(5개), 상태, 유형, 분류, 담당, 검색, 정렬, 페이지네이션
- 모든 필드는 optional (?)
- 기본값은 API 요청 시에만 설정
```

**라인 87-92 (훅 패턴)**
```
추가:
### 캐시 무효화 (invalidateQueries)
- 목록 수정: invalidate lists() - 모든 페이지 캐시 무효화
- 상세 수정: invalidate detail(id) - 해당 ID만

### staleTime 설정
- 목록: 30초 (변경 빈도 낮음)
- 상세: 60초 (안정적)
- 대시보드: 5분 (거의 변경 없음)
```

### A.2 신규 파일: `rules/api-layer-rules.md` 초안

```markdown
# API 레이어 규칙

적용 대상: `src/lib/api/**/*.ts`

## API 함수 네이밍

### 조회 (Query)
- `get{Module}List()` - 목록 조회
- `get{Module}View()` - 상세 조회
- `get{Module}StateCount()` - 통계 조회

### 생성/수정 (Mutation)
- `create{Module}()` - 생성
- `update{Module}()` - 수정
- `copy{Module}()` - 복사

### 상태 변경
- `issue{Module}()` - 발행/시작
- `approve{Module}()` - 승인
- `reject{Module}()` / `denyWorkOrder()`- 반려
- `cancel{Module}()` - 취소
- `complete{Module}()` - 완료

### 다중 작업
- `{action}Multi{Module}()` - 예: `approveMultiWorkOrder()`

## 파라미터 구조

### SearchVO (검색 조건)
모든 필드는 optional으로 정의:
```typescript
export interface SearchWorkOrderVO {
  // 기간
  startDate?: string;  // YYYY-MM-DD
  endDate?: string;

  // 계층 필터
  companyId?: number;
  regionId?: number;
  buildingId?: number;
  buildingFloorId?: number;

  // 상태/유형 (단일 또는 배열)
  state?: WorkOrderState;
  states?: WorkOrderState[];

  // 검색
  keyword?: string;
  searchType?: 'title' | 'description';

  // 정렬
  sort?: 'createdAt' | 'dueDate' | 'state';
  direction?: 'ASC' | 'DESC';
}
```

### VO (생성/수정)
필수 필드만 required, 나머지는 optional:
```typescript
export interface WorkOrderVO {
  title: string;  // 필수
  description?: string;
  startDate: Date;  // 필수
  dueDate?: Date;
}
```

## 응답 타입 처리

### API 응답 구조
csp-was는 모든 응답을 래핑함:
```typescript
interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}
```

apiClient가 자동으로 unwrap하므로 함수 반환은 T만:
```typescript
export async function getWorkOrderList(
  params: SearchWorkOrderVO
): Promise<WorkOrderListDTO[]> {
  return apiClient.get(`/api/workorder/list?...`);
}
```

## 파일 업로드 처리

FormData 생성 및 전달:
```typescript
export async function uploadFacilityImage(
  id: number,
  file: File
): Promise<void> {
  const formData = new FormData();
  formData.append('id', String(id));
  formData.append('image', file);

  // apiClient가 자동으로 multipart/form-data 처리
  return apiClient.post(`/api/facility/upload`, { body: formData });
}
```

## 에러 처리

### apiClient 내부 처리
- 401: 토큰 만료 여부 확인 (isTokenExpired)
  - 만료됨: 로그아웃 + /login 리다이렉트
  - 유효함: 권한 부족 (무시, csp-was pageInfoId 미구현)
- 4xx/5xx: ApiError 발생

### 호출부에서의 처리
```typescript
try {
  const data = await getWorkOrderList(params);
} catch (error) {
  const { message, code } = extractApiError(error);
  toast.error(message);
}
```

## 페이지네이션

SearchVO에 포함:
```typescript
params.page = 0;  // 0-indexed
params.size = 20;  // 한 페이지 항목 수
```

## React Query 연동

### 캐시 키 구조
```typescript
export const workOrderKeys = {
  all: ['workOrders'] as const,
  lists: () => [...workOrderKeys.all, 'list'] as const,
  list: (params) => [...workOrderKeys.lists(), params] as const,
  details: () => [...workOrderKeys.all, 'detail'] as const,
  detail: (id, type) => [...workOrderKeys.details(), id, type] as const,
};
```

### 무효화 전략
```typescript
// 목록 수정 후
queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });

// 상세 수정 후
queryClient.invalidateQueries({ queryKey: workOrderKeys.detail(id) });

// staleTime 설정
useQuery({
  queryKey: workOrderKeys.list(params),
  queryFn: () => getWorkOrderList(params),
  staleTime: 30000,  // 30초
})
```
```

---

**문서 완성도 평가**: 이 감사 보고서를 기반으로 6-8시간의 문서 작업으로 프로젝트 규칙의 완성도를 70% → 95%로 상향할 수 있습니다.
