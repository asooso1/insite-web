# 메뉴 백오피스 관리 시스템 구현 계획

**작성일:** 2026-03-11
**상태:** 📋 계획 검토 대기
**우선순위:** High (Phase 10 사전 준비)

---

## 1. 목표 및 범위

### 목표
- csp-was FAQ API를 활용한 메뉴별 콘텐츠 관리 UI 구축
- 메뉴-페이지 연결 상태 가시화 및 매핑 현황 파악
- YouTube 영상 및 PDF 매뉴얼 관리 기능 제공

### 범위 (허용)
- 메뉴 트리 조회 및 시각화 (읽기)
- PageInfo 기반 컨텐츠(YouTube/PDF) 추가/삭제
- 메뉴 캐시 초기화 트리거
- URL 매핑 현황 분석 UI

### 범위 (불허 - csp-was 변경 금지)
- 메뉴 CRUD (생성/수정/삭제)
- 메뉴 구조 변경
- 권한/역할 변경

---

## 2. 아키텍처 결정사항 (3가지 선택)

### 2.1 UI 배치 위치

| 선택지 | 장점 | 단점 | 권장 |
|--------|------|------|------|
| **A: Settings 탭 추가** | 기존 설정 페이지와 통합, 빠른 구현 | 탭이 8개로 증가 (UX 저하), 설정과 무관 | ✅ 권장 |
| **B: /admin/menus 신규 섹션** | 향후 확장성, 명확한 분리 | 새 라우트/레이아웃 필요, 초기 복잡도 증가 | 차선 |

**결정: 설정 페이지의 8번째 탭 "메뉴 관리"로 통합**
- 기존 `SETTING_TABS` 배열에 `{ value: "menu", label: "메뉴 관리", icon: GripVertical }`추가
- 향후 admin 섹션이 필요하면 별도로 이전 가능
- 스크롤 가능한 탭 메뉴로 UX 문제 완화

### 2.2 URL 매핑 전략

| 선택지 | 장점 | 단점 | 권장 |
|--------|------|------|------|
| **A: 정적 매핑 유지** | 변경 불필요, 기존 코드 사용 | 매핑 오류 시 UI에서 발견 불가 | 차선 |
| **B: csp-was 추가 API** | 중앙 집중식 관리 | csp-was 변경 필요 (금지) | ❌ 불가 |
| **C: Prisma 로컬 DB** | 유연한 편집/분석, 독립적 관리 | DB 스키마 추가, 동기화 필요 | ✅ 권장 |

**결정: Prisma + 로컬 매핑 테이블 (단, Phase 0 차단사항이므로 Phase 1에서 정적 매핑 활용)**

초기 구현(Phase 1):
```typescript
// menu-url-mapper.ts의 정적 매핑 재활용
// UI에서 연결 상태만 시각화
```

향후 개선(Phase 1.5):
```typescript
// Prisma 스키마 추가
model MenuPageMapping {
  id          Int     @id @default(autoincrement())
  menuId      Int
  menuName    String
  oldUrl      String  // csp-web URL
  newUrl      String  // insite-web URL
  status      String  // "connected" | "missing" | "pending"
  lastUpdated DateTime

  @@unique([menuId])
}
```

### 2.3 메뉴 트리 렌더링 방식

```
┌─ 서비스그룹 (depth=1)
│  ├─ 모듈 (depth=2)
│  │  ├─ 기능 (depth=3)
│  │  └─ [YouTube 🎬] [PDF 📄]
│  └─ 모듈 (depth=2)
└─ 서비스그룹 (depth=1)
```

**구현 방식:**
- Accordion 또는 TreeView 컴포넌트 (shadcn/ui에서 선택)
- 각 노드 우측에 상태 배지 표시:
  - 🟢 연결됨 (insite-web 페이지 존재)
  - 🟡 부분연결 (자식 메뉴는 연결되었으나 해당 메뉴는 미연결)
  - 🔴 미연결 (insite-web에 대응 페이지 없음)
- 메뉴 깊이에 따른 indentation

---

## 3. 필수 구현 파일 목록

### 3.1 타입 정의 (`src/lib/types/menu.ts` 확장)

```typescript
// PageInfo 관련 DTO 추가
interface PageInfoDTO {
  id: number;
  name: string;
  pageId: string;           // 기획서 화면 ID
  url: string;              // insite-web URL
  use: boolean;
  rowId: boolean;           // URL 파라미터 여부
  videoId?: string;
  pageFunctionDTOs: PageFunctionDTO[];
}

interface PageFunctionDTO {
  id: number;
  name: string;
  code: string;
  apiUrl: string;
  method: string;
  use: boolean;
}

// 메뉴 연결 상태
type MenuConnectionStatus = "connected" | "partial" | "missing";

interface MenuWithStatus extends MenuDTO {
  status: MenuConnectionStatus;
  pageInfo?: PageInfoDTO;
  connectedChildren?: number;  // 연결된 자식 메뉴 수
}

// YouTube/PDF 관리 VO
interface AddMenuVideoVO {
  videoId: string;
}

interface MenuPdfUploadVO {
  file: File;
}
```

### 3.2 API 클라이언트 (`src/lib/api/menu.ts` 확장)

```typescript
// 기존
export async function getMenuTree(buildingId: string): Promise<MenuDTO[]>

// 추가 구현 (csp-was FAQ API 연동)
export async function getAllMenus(): Promise<MenuDTO[]>
export async function getMenuPageInfo(pageInfoId: number): Promise<PageInfoDTO>
export async function addMenuVideo(pageInfoId: number, vo: AddMenuVideoVO): Promise<void>
export async function addMenuPdf(pageInfoId: number, formData: FormData): Promise<void>
export async function deleteMenuPdf(pageInfoId: number): Promise<void>
export async function evictMenuCache(): Promise<void>  // POST /api/admin/caches/evict
```

### 3.3 React Query 훅 (`src/lib/hooks/use-menu.ts` 신규)

```typescript
// Keys Factory
const menuKeys = {
  all: ["menus"],
  lists: () => [...menuKeys.all, "list"],
  list: () => [...menuKeys.lists()],
  details: () => [...menuKeys.all, "detail"],
  detail: (menuId: number) => [...menuKeys.details(), menuId],
  pageInfo: (pageInfoId: number) => ["pageInfo", pageInfoId],
};

// 훅들
export function useAllMenus()
export function useMenuWithStatus()  // 메뉴 + 연결 상태
export function useMenuPageInfo(pageInfoId: number)
export function useAddMenuVideo(pageInfoId: number)
export function useAddMenuPdf(pageInfoId: number)
export function useDeleteMenuPdf(pageInfoId: number)
export function useEvictMenuCache()
```

### 3.4 페이지 컴포넌트

#### `src/app/(modules)/settings/_components/menu-management-tab.tsx` (신규)
```
메인 탭 컴포넌트
├── MenuTreeSection
│   ├── MenuTreeNode (재귀 렌더링)
│   ├── StatusBadge (연결 상태)
│   └── ContentActionsMenu (YouTube/PDF)
├── MenuCacheSection
│   └── EvictCacheButton
└── MenuStatisticsSection
    └── 분석 통계 표시
```

#### `src/app/(modules)/settings/_components/menu-tree-node.tsx` (신규)
```
개별 메뉴 노드 (깊이별 indentation)
├── ExpandButton (자식 있을 경우)
├── MenuName + Code
├── StatusBadge
├── ContentActions
└── Children (재귀)
```

#### `src/app/(modules)/settings/_components/menu-content-modal.tsx` (신규)
```
메뉴별 YouTube/PDF 관리 모달
├── YouTube 영상 입력 (videoId)
├── PDF 파일 업로드
├── PDF 목록 + 삭제 버튼
└── 저장 / 취소
```

### 3.5 유틸리티 함수 (`src/lib/utils/menu-status-mapper.ts` 신규)

```typescript
// menu-url-mapper.ts의 mapMenuUrl() 결과를 기반으로 연결 상태 판별
function getMenuConnectionStatus(
  menu: MenuDTO,
  implementedPages: Set<string>
): MenuConnectionStatus

// 메뉴 트리의 연결 상태 요약
function getMenuTreeStats(menus: MenuDTO[]): {
  total: number;
  connected: number;
  partial: number;
  missing: number;
}
```

---

## 4. 단계별 구현 순서 및 의존성

### Phase 1: 기초 (3~5일)
```
1.1 타입 확장
    → MenuDTO, PageInfoDTO, MenuConnectionStatus 정의
    → tests: TypeScript 컴파일 성공

1.2 API 클라이언트 확장
    → getAllMenus(), getMenuPageInfo() 구현
    → tests: API 응답 매핑 확인

1.3 React Query 훅
    → useAllMenus(), useMenuPageInfo() 구현
    → tests: 캐시 키 구조 확인, staleTime 설정

1.4 URL 매핑 유틸
    → getMenuConnectionStatus() 구현
    → tests: 정적 매핑 기반 상태 판별 확인

의존성: None (독립적)
Blockers: None
```

### Phase 2: UI 컴포넌트 (4~6일)
```
2.1 MenuTreeNode 컴포넌트
    → 재귀 렌더링, indentation, 상태 배지
    → tests: 트리 구조 렌더링, 깊이별 UI

2.2 MenuTreeSection
    → 트리 관리 (expand/collapse), 검색 필터
    → tests: 필터링, 상태 토글

2.3 MenuCacheSection
    → 캐시 초기화 버튼 + 로딩 상태
    → tests: API 호출, 에러 처리

2.4 MenuStatisticsSection (선택사항)
    → 연결/미연결 통계, 차트
    → tests: 데이터 집계

의존성: Phase 1 완료
Blockers: 트리 깊이 제한 명확화 필요
```

### Phase 3: 콘텐츠 관리 (3~4일)
```
3.1 MenuContentModal 컴포넌트
    → YouTube ID 입력, PDF 업로드/삭제
    → tests: 폼 검증, 파일 업로드

3.2 API 클라이언트 확장 (쓰기)
    → addMenuVideo(), addMenuPdf(), deleteMenuPdf()
    → tests: FormData 처리, 에러 응답

3.3 훅 확장 (mutation)
    → useAddMenuVideo(), useAddMenuPdf(), useDeleteMenuPdf()
    → tests: 캐시 무효화, optimistic updates

의존성: Phase 1, 2 완료
Blockers: csp-was PDF 업로드 엔드포인트 명확화
```

### Phase 4: 통합 및 최적화 (2~3일)
```
4.1 설정 페이지 통합
    → SETTING_TABS 배열에 "메뉴 관리" 탭 추가
    → page.tsx에 <MenuManagementTab /> 추가

4.2 에러 처리 및 로깅
    → handleApiError() 활용
    → 401/403/500 별 처리

4.3 성능 최적화
    → staleTime 설정, 캐시 전략
    → 대규모 메뉴 트리(1000+) 가상 스크롤 검토

4.4 문서화
    → 각 컴포넌트 주석, Storybook (선택)
    → CLAUDE.md 업데이트

의존성: Phase 1, 2, 3 완료
Blockers: 성능 테스트 필요
```

---

## 5. 새 파일 목록 (총 10~12개)

### 타입
- `src/lib/types/menu.ts` (확장)

### API
- `src/lib/api/menu.ts` (확장)

### 훅
- `src/lib/hooks/use-menu.ts` (신규)

### 유틸
- `src/lib/utils/menu-status-mapper.ts` (신규)

### 컴포넌트
- `src/app/(modules)/settings/_components/menu-management-tab.tsx`
- `src/app/(modules)/settings/_components/menu-tree-section.tsx`
- `src/app/(modules)/settings/_components/menu-tree-node.tsx`
- `src/app/(modules)/settings/_components/menu-statistics-section.tsx` (선택)
- `src/app/(modules)/settings/_components/menu-content-modal.tsx`
- `src/app/(modules)/settings/_components/menu-cache-section.tsx`

### 페이지
- `src/app/(modules)/settings/page.tsx` (수정 - 탭 추가)

### 테스트
- `src/lib/hooks/use-menu.test.ts`
- `src/lib/utils/menu-status-mapper.test.ts`

---

## 6. 기술적 고려사항

### 6.1 메뉴 트리 크기 관리
- **예상 메뉴 수:** 50~200개 노드 (깊이 3)
- **렌더링 최적화:**
  - 초기 depth=1 만 전개, depth=2/3은 lazy expand
  - 가상 스크롤 (react-window) 불필요 (작은 규모)
  - Memoization: React.memo(MenuTreeNode)

### 6.2 API 응답 시간
- `GET /api/faq/menus` → 50~200ms (전체 트리)
- `GET /api/faq/getMenuPage/{id}` → 30~50ms (개별 페이지)
- React Query staleTime: 5분 (메뉴는 자주 변경 안 함)

### 6.3 YouTube/PDF 관리
- **YouTube:** videoId 저장만 (URL은 프론트에서 생성)
  ```
  https://www.youtube.com/embed/{videoId}
  ```
- **PDF:** csp-was의 `/api/faq/getMenuPdf/{pageInfoId}` 사용
  - 파일명: `{pageInfoId}_{timestamp}.pdf` 또는 백엔드 관리
  - 미리보기: PDFViewer 컴포넌트 (선택사항)

### 6.4 권한 확인
- 이 기능은 **관리자(admin) 전용**
- 현재 권한 시스템 확인 필수:
  - `src/lib/stores/auth-store.ts`의 userRoles 확인
  - 필요시 role-based 라우팅 추가

### 6.5 캐시 초기화
- `POST /api/admin/caches/evict` 호출 후:
  - React Query 메뉴 캐시 무효화
  - toast.success("메뉴 캐시가 초기화되었습니다.")

---

## 7. 위험 요소 및 완화 전략

### 기술적 위험

| 위험 | 영향 | 가능성 | 완화 전략 |
|------|------|--------|----------|
| csp-was FAQ API 응답 지연 (5초+) | UI 응답성 저하 | 중 | Request timeout 설정 (10초), 스켈레톤 로딩 |
| 메뉴 트리 깊이 > 3 (예: 4단계) | 복잡도 증가 | 낮 | 재귀 렌더링은 무한 깊이 지원, 테스트로 확인 |
| PageInfoId 불일치 (메뉴와 페이지 매핑 오류) | 404 에러 | 중 | fallback: 페이지 없음 상태 표시, 관리자 로그 |
| PDF 파일 크기 제한 | 업로드 실패 | 낮 | csp-was 설정 확인, 에러 메시지 명확화 |
| URL 매핑 outdated (new 기능 추가 시) | 미연결 메뉴 증가 | 중 | menu-url-mapper.ts 정기 검토 프로세스 문서화 |

### 비즈니스 위험

| 위험 | 영향 | 완화 전략 |
|------|------|----------|
| 메뉴 구조 변경 (csp-was에서) | 매핑 오류 누적 | 정기 감사 스크립트 (별도 작업) |
| 관리자 권한 오남용 | 캐시 무조건 초기화 | 감시 로깅, 감시 알림 (Phase 2 대기) |
| FAQ 컨텐츠와 실제 기능 불일치 | 사용자 혼동 | 정기 검수 프로세스 (비기술 이슈) |

---

## 8. 수락 기준 (Acceptance Criteria)

### Step 1: 타입 + API + 훅 (Phase 1)
- ✅ TypeScript 컴파일 성공 (no `any`, strict mode)
- ✅ `getAllMenus()` API 호출 성공 및 응답 매핑 확인
- ✅ `useAllMenus()` 훅 로컬 테스트 통과
- ✅ `getMenuConnectionStatus()` 10개 메뉴 사례 검증

### Step 2: UI 컴포넌트 (Phase 2)
- ✅ MenuTreeNode 재귀 렌더링 깊이 3 확인
- ✅ Status 배지 (connected/partial/missing) 올바른 표시
- ✅ 메뉴 확장/축소 토글 정상 작동
- ✅ Skeleton 로딩 상태 표시 (2초 이상 걸릴 경우)
- ✅ 빈 메뉴 상태 EmptyState 표시

### Step 3: 콘텐츠 관리 (Phase 3)
- ✅ YouTube 영상 ID 입력 및 저장 성공
- ✅ PDF 파일 업로드 및 다운로드 성공
- ✅ PDF 삭제 후 목록 갱신 확인
- ✅ 에러 발생 시 toast.error() 표시

### Step 4: 통합 (Phase 4)
- ✅ 설정 페이지에서 "메뉴 관리" 탭 클릭 시 컴포넌트 로드
- ✅ 캐시 초기화 버튼 클릭 후 API 호출 + React Query 무효화
- ✅ 404/500 에러 처리 및 로그 확인
- ✅ npm run build 성공, 타입 에러 0건

---

## 9. 참고 자료 및 API 문서

### csp-was API 엔드포인트
```bash
# 메뉴 조회
GET /api/faq/menus                      # 전체 메뉴 목록
GET /api/services/menus?buildingId={id} # 빌딩별 메뉴 (권한 필터)
GET /api/common/menuList?keyword={kw}   # 검색

# PageInfo 조회
GET /api/faq/getMenuPage/{pageInfoId}   # 페이지 정보 + PageFunction

# 콘텐츠 관리
POST /api/faq/addMenuVideo/{pageInfoId}
  body: { videoId: "..." }

POST /api/faq/addMenuPdf/{pageInfoId}
  body: FormData (multipart/form-data)

DELETE /api/faq/deleteMenuPdf/{pageInfoId}

# 관리
POST /api/admin/caches/evict
  body: { cacheNames: ["menu"] } (선택사항)
```

### 참고 코드
- `src/lib/types/menu.ts` - MenuDTO 구조
- `src/lib/api/menu.ts` - getMenuTree() 구현 패턴
- `src/lib/utils/menu-url-mapper.ts` - 정적 매핑 테이블
- `src/app/(modules)/settings/page.tsx` - 탭 통합 패턴
- `src/app/(modules)/settings/_components/cleaning-category-tab.tsx` - 유사 기능 참고

---

## 10. 다음 단계

### 즉시 (계획 확정 후)
1. 사용자 아키텍처 선택 확인
   - UI 배치: A(Settings 탭) vs B(별도 섹션)
   - URL 매핑: A(정적) vs C(Prisma)
2. csp-was PageInfoId 이슈 확인 (docs/csp-was-pageinfoid-issue.md)
3. 관리자 권한 시스템 확인

### Phase 1 시작 전
1. `/api/faq/menus` 실제 응답 구조 확인
2. PageInfoDTO 필드 명확화
3. YouTube/PDF API 상세 스펙 확인

### 최종 체크
- npm audit 취약점 해결
- 보안 규칙 사전 검토 (rules/security.md)
- 코드 리뷰 체크리스트 준비

---

## 변경 사항 이력

| 날짜 | 내용 | 상태 |
|------|------|------|
| 2026-03-11 | 초안 작성 | ✏️ |

