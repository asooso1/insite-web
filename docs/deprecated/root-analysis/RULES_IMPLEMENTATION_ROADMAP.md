# insite-web 규칙 개선 로드맵

> **작성일**: 2026-03-11
> **대상**: Phase 10 (BEMS) 시작 전 문서 정비
> **목표**: 규칙-코드 동기화, 신규 개발자 온보딩 시간 단축

---

## 요약: 현재 상태

| 항목 | 완성도 | 주요 문제 |
|------|--------|---------|
| CLAUDE.md | 70% | 인증은 상세, 구현 패턴은 불완전 |
| 스타일 규칙 | 75% | 실제 코드와 일부 불일치 |
| API 패턴 | 50% | 20개 파일 존재하지만 미문서화 |
| 폼 구현 | 40% | 20개 폼 존재하지만 규칙 없음 |
| 테스트 | 60% | 기본 가이드만, 실제 예시 없음 |
| 모듈별 docs | 0% | 30개 파일 모두 빈 파일 (claude-mem만) |

**병목**: API/폼 표준화 문서 부재로 신입 개발자 효율 저하

---

## 1단계: 즉시 실행 (3월 11-15일)

### 1.1 CLAUDE.md 수정 (1시간)

**변경 사항**:

#### 라인 27 (URL 상태 관리)
```diff
- **URL 상태:** 신규 모듈은 `nuqs` 사용 (`useQueryState` + parsers). 기존 모듈은 `useState` 사용중.
+ **URL 상태:**
+   - 단순 필터 (1-2개): useState
+   - 복잡한 다중 필터: nuqs (useQueryState + parsers)
+   - 신규 모듈 권장: nuqs (단, 복잡도 평가 후 선택)
```

#### 라인 81-85 (API 패턴 추가 상세화)
```diff
  ### 2. API (`lib/api/{module}.ts`)
  개별 export 함수 패턴 (`get{Module}List`, `add{Module}` 등)
  - URL 패턴/HTTP method는 모듈마다 상이 → **csp-was 컨트롤러 확인 필수**
  - JSON body: `apiClient.post/put` | 파일 포함: `apiClient.postForm/putForm`
  - 참조: `src/lib/api/facility.ts` (FormData), `src/lib/api/user.ts` (JSON)

+ **함수 네이밍**:
+   - 조회: `get{Module}List`, `get{Module}View`, `get{Module}StateCount`
+   - 생성/수정: `create{Module}`, `update{Module}`, `copy{Module}`
+   - 상태: `issue{Module}`, `approve{Module}`, `cancel{Module}`
+   - 다중: `{action}Multi{Module}` (예: `approveMultiWorkOrder`)
+
+ **응답 타입**:
+   - 인증: `/api/{module}/...`
+   - 공개: `/open/{module}/...`
+   - 위젯: `/widget/{module}/...`
+
+ **파일 업로드**:
+   ```typescript
+   const formData = new FormData();
+   formData.append('field', value);
+   apiClient.post('/api/upload', { body: formData });
+   ```
```

#### 라인 87-92 (React Query 강화)
```diff
  ### 3. 훅 (`lib/hooks/use-{module}.ts`)
  ```
  Keys Factory: all > lists > list(params) > details > detail(id)
  useQuery: queryKey + queryFn 조합
  useMutation: mutationFn + onSuccess invalidateQueries
  ```

+ **캐시 무효화 규칙**:
+   - 목록 수정: `invalidateQueries({ queryKey: moduleKeys.lists() })`
+   - 상세 수정: `invalidateQueries({ queryKey: moduleKeys.detail(id) })`
+
+ **staleTime 설정**:
+   - 목록 페이지: 30초 (변경 빈도 낮음)
+   - 상세 페이지: 60초 (안정적)
+   - 대시보드: 5분 (거의 변경 없음)
```

**파일**: `.claude/CLAUDE.md`

---

### 1.2 coding-style.md 추가 (30분)

**추가 섹션**:

```markdown
## 검증 스키마

- 모든 폼 입력에 Zod 스키마 정의
- 파일 위치: `src/lib/validations/{module}.ts`
- 예:
  ```typescript
  export const workOrderSchema = z.object({
    title: z.string().min(1, "제목 필수"),
    startDate: z.date(),
  });
  export type WorkOrderFormData = z.infer<typeof workOrderSchema>;
  ```

## 에러 처리 표준

1. **API 요청 에러** (apiClient 내부 처리):
   - 401 (만료): 자동 로그아웃
   - 401 (권한 부족): 무시 (csp-was pageInfoId 미구현)
   - 4xx/5xx: ApiError 예외

2. **호출부 처리**:
   ```typescript
   try {
     const data = await getWorkOrderList(params);
   } catch (error) {
     const { message } = extractApiError(error);
     toast.error(message);
   }
   ```
```

**파일**: `.claude/rules/coding-style.md`

---

### 1.3 security.md 업데이트 (30분)

**추가 섹션**:

```markdown
## 알려진 제약 사항

### pageInfoId 권한 체계 미구현 (차단됨)
- **상태**: csp-was에서 미구현
- **영향**: `/api/site/**`, `/api/workorder/**` 등 일부 엔드포인트
- **임시 처리**:
  - 토큰 만료 vs 권한 부족 구분 (`isTokenExpired()`)
  - 401 반환 시 유효한 토큰이면 무시
- **해결**: csp-was JwtFilter 1줄 수정 필요
- **참조**: `src/lib/api/client.ts` 의 `handleAuthExpired()`

### 적용 예외
- 로그인: 토큰 없이 접근 가능
- 공개 API: `/open/**` (JWT 불필요)
- 빌딩/회사 전환: 새 토큰 발급 (`PUT /api/account/token`)
```

**파일**: `.claude/rules/security.md`

---

## 2단계: 신규 규칙 파일 (3월 16-18일)

### 2.1 api-layer-rules.md 작성 (2시간)

**위치**: `.claude/rules/api-layer-rules.md`

**내용 구조**:
```
1. API 함수 네이밍 규칙
   - 조회, 생성/수정, 상태 변경, 다중 작업

2. 파라미터 구성
   - SearchVO (검색 조건)
   - VO (생성/수정)
   - 형식 규칙

3. 응답 타입 처리
   - ApiResponse 래핑 (apiClient에서 자동 unwrap)
   - 단일 vs 배열 응답

4. 파일 업로드
   - FormData 생성 및 전달
   - Content-Type 자동 처리

5. 에러 처리
   - apiClient 처리 범위
   - 호출부 책임

6. 페이지네이션
   - page (0-indexed), size 파라미터

7. React Query 연동
   - 키 구조, 무효화 전략
   - staleTime 설정값
```

**예시**: `src/lib/api/work-order.ts` 패턴 활용

---

### 2.2 forms-rules.md 작성 (2시간)

**위치**: `.claude/rules/forms-rules.md`

**내용 구조**:
```
1. 기본 구조
   - react-hook-form + Zod (필수)
   - FormField 컴포넌트 사용

2. 검증 스키마
   - 파일 위치, 네이밍
   - 필드 규칙 (required, min/max, pattern)

3. FormField 패턴
   - 텍스트 입력
   - 선택 (Select, CascadingSelect)
   - 날짜/시간
   - 파일 업로드

4. 상호작용 필드
   - 조건부 표시 (watch)
   - 종속 선택 (값 변경 시 다른 필드 초기화)

5. 폼 상태
   - 로딩 (isSubmitting, isPending)
   - 에러 표시
   - 성공 메시지

6. 다중 탭 폼
   - 탭 간 데이터 유지
   - 유효성 검증

7. 폼 구성 예시
   - work-order-form.tsx
   - facility-form.tsx
```

**예시**: `src/components/forms/login-form.tsx` 및 `work-order-form.tsx` 분석

---

### 2.3 component-structure-rules.md 작성 (1.5시간)

**위치**: `.claude/rules/component-structure-rules.md`

**내용**:
```
1. 페이지 레이아웃 표준

   목록 페이지:
   ├── PageHeader (제목 + 버튼)
   ├── Tabs (상태 필터링)
   ├── SearchFilterBar (검색/필터)
   ├── DataTable (목록)
   └── Pagination

   상세 페이지:
   ├── PageHeader (제목 + 뒤로가기)
   ├── Tabs (여러 정보 섹션)
   ├── InfoPanel (읽기 전용 정보)
   └── ActionButtons (상태 변경)

   등록/수정 페이지:
   ├── PageHeader (제목)
   └── {Module}Form

2. 컴포넌트 파일 조직
   - 페이지: app/(modules)/{module}/
   - 폼: app/(modules)/{module}/_components/
   - 공용: components/{category}/

3. 모바일 반응형
   - MobileShell + MobileHeader + MobileBottomNav
   - lg 이상: 데스크톱 레이아웃
   - lg 미만: 모바일 레이아웃 + 드로어

4. 색상/상태 표시
   - StatusBadge 컴포넌트
   - WorkOrderStateStyle 매핑 사용
```

---

## 3단계: 기존 파일 정리 (3월 19-20일)

### 3.1 testing.md 확장 (1시간)

**추가 사항**:
```markdown
## 테스트 구현 예시

### API 함수 테스트
- MSW 핸들러 설정
- setupServer 사용
- 성공/실패 시나리오

### React Query 훅 테스트
- QueryClient 초기화
- 캐시 무효화 검증

### 컴포넌트 테스트
- render + screen
- fireEvent/userEvent
- 폼 제출 시뮬레이션
```

---

### 3.2 performance.md 정리 (30분)

**제거 항목**:
- 모델 선택 가이드 (OMC 문서 중복)
- 빌드 실패 시 에이전트 참조 (OMC 문서 중복)

**유지/강화**:
- Next.js 15 최적화 (기존)
- React Query staleTime (CLAUDE.md로 이관 후 참조)
- 번들 크기 분석 (실제 구현 예시 추가)

---

### 3.3 모듈별 CLAUDE.md 정리 (30분)

**액션**: 다음 파일들 삭제
```
src/app/(modules)/*/CLAUDE.md
src/lib/types/CLAUDE.md
src/lib/api/CLAUDE.md
src/lib/hooks/CLAUDE.md
src/components/*/CLAUDE.md
```

**이유**:
- 실제 내용 없음 (claude-mem 메타만)
- 혼란 초래
- 주 CLAUDE.md + 신규 규칙 파일에서 충분히 커버

**예외**: 필요 시 특정 모듈에만 유지

---

## 최종 파일 구조

```
.claude/
├── CLAUDE.md (수정됨, 더 간결)
├── rules/
│   ├── coding-style.md (수정)
│   ├── git-workflow.md (유지)
│   ├── testing.md (확장)
│   ├── performance.md (정리)
│   ├── security.md (강화)
│   ├── api-layer-rules.md (신규)
│   ├── forms-rules.md (신규)
│   └── component-structure-rules.md (신규)
└── context/
    └── (Phase별 상세 계획 - 기존 유지)

docs/
├── task-progress.md (유지)
├── v1-api-reference.md (유지, 향후 갱신)
├── backend-changes.md (유지)
└── (csp-was-pageinfoid-issue.md 삭제 - security.md로 통합됨)
```

---

## 예상 효과

### 정성적 효과
- **신입 개발자 온보딩**: 8시간 → 3시간
- **API 구현 시간**: 1.5시간 → 0.5시간
- **폼 구현 시간**: 2시간 → 1시간
- **코드 리뷰 피드백 감소**: 30% (규칙 명확화)

### 정량적 효과
- **규칙-코드 동기화**: 70% → 95%
- **API 레이어 패턴 일관성**: 50% → 100%
- **폼 구현 패턴 일관성**: 40% → 100%
- **새로운 개발자의 규칙 위반 감소**: 예상 60% 감소

---

## 실행 체크리스트

### 주차 1 (3월 11-15)

- [ ] CLAUDE.md 수정 (URL 상태, API 패턴, React Query)
- [ ] coding-style.md 추가 (검증, 에러 처리)
- [ ] security.md 강화 (pageInfoId 이슈)
- [ ] 리뷰 및 커밋

**커밋**: `docs: 규칙 문서 일관성 개선 및 심화 가이드 추가`

### 주차 2 (3월 16-20)

- [ ] api-layer-rules.md 작성
- [ ] forms-rules.md 작성
- [ ] component-structure-rules.md 작성
- [ ] testing.md 확장
- [ ] performance.md 정리
- [ ] 모듈별 CLAUDE.md 정리
- [ ] 리뷰 및 커밋

**커밋**: `docs: 신규 규칙 파일 추가 및 기존 파일 정리`

---

## 다음 단계

### Phase 10 (BEMS) 시작 시
- 신규 개발자에게 업데이트된 규칙 문서 제공
- 첫 PR 때 규칙 체크리스트 적용
- 월 1회 규칙 리뷰 회의

### 3개월 후
- 실제 구현 사례로 규칙 검증
- 필요 시 규칙 수정
- 신규 패턴 발견 시 즉시 문서화

---

**문서 준비 담당**: Writer
**예상 소요 시간**: 8-10시간 (3주 단계별)
**우선순위**: Phase 10 시작 전 필수 완료
