# 메뉴 백오피스 관리 시스템 구현 계획 (v2)

**작성일**: 2026-03-11
**상태**: 검토 완료 (Architect + Critic 피드백 반영)
**예상 기간**: 10-14일 (3 Phase)

---

## 1. 컨텍스트 및 핵심 수정사항

### 1.1 Architect/Critic 검토 피드백

| 항목 | 피드백 | 수정 사항 |
|------|--------|----------|
| **Settings 탭 오버플로우** | 7탭 → 8탭으로 증가 시 가로 스크롤 발생 | 스크롤 가능한 탭 목록 또는 별도 서브페이지 구성 |
| **범위 명확화** | 메뉴 조회/편집/FAQ 콘텐츠 혼재 | 3개 기능 분리: (A) 메뉴 트리 뷰, (B) URL 매핑, (C) FAQ 콘텐츠 |
| **권한 가드 누락** | 관리자 전용 접근 제어 없음 | `userRoles` ADMIN 체크 추가 |
| **저장 방식 불명확** | JSON vs DB 선택 불명 | JSON 파일 + Next.js Route Handler (MVP) |
| **스케일 가능성** | 향후 매핑 이력/버전 관리 고려 | 메뉴-URL 매핑 구조 확장 가능하게 설계 |

### 1.2 Settings 페이지 구조 재편

**현재 상태 (7탭):**
```
기본 코드 | 설비 분류 | 표준 설비 | 미화 분류 | 미화 대상 | 미화 도구 | 미화 계수
```

**권장안 - 옵션 B: 별도 서브페이지 (확장성 우선)**

```
Settings 메인 페이지 (현재 7탭 유지)
├── 기본 코드 탭
├── [설비 관련]
│   ├── 설비 분류 탭
│   └── 표준 설비 탭
├── [미화 관련]
│   ├── 미화 분류 탭
│   ├── 미화 대상 탭
│   ├── 미화 도구 탭
│   └── 미화 계수 탭
│
└── 좌측 사이드바 또는 우측 "고급 관리" 링크
    └── /settings/menu-management 서브페이지
        └── [메뉴 트리 + URL 매핑 + FAQ 콘텐츠 관리]
```

**이유:**
- Settings 메인은 시스템 코드/설비 관리에 집중 (현재 구조 유지)
- 메뉴 백오피스는 별도 도메인 (네비게이션 관리, 사용자 경험 최적화)
- 탭 오버플로우 해결 + 향후 관리 기능 추가 시 유연성 확보
- 권한 체크를 `/settings/menu-management` 경로에 집중

---

## 2. 기능 요구사항 (세분화)

### 2.1 Phase 1: 기초 인프라 + 메뉴 트리 뷰 (4-6일)

**목표**: csp-was 메뉴 API 조회 및 연결 상태 시각화

#### 2.1.1 백엔드 API 확인 (기존)
- `GET /api/faq/menus` - 전체 메뉴 트리 조회 ✅
- 응답 DTO: `MenuDTO { id, parentId, name, url, description, ... }`

#### 2.1.2 신규 파일 생성

**Type 정의:**
- `src/lib/types/menu.ts` (신규)
  ```typescript
  export interface MenuDTO {
    id: number;
    parentId?: number;
    name: string;
    url: string;
    description?: string;
    iconUrl?: string;
    sortOrder?: number;
  }

  export interface MenuTreeNode extends MenuDTO {
    children: MenuTreeNode[];
    connectionStatus: 'connected' | 'unmapped' | 'not_implemented';
    mappedUrl?: string; // insite-web URL (override된 경우)
  }

  export interface MenuMapping {
    menuId: number;
    originalUrl: string;
    mappedUrl: string;
    createdAt: string;
    updatedAt: string;
  }
  ```

**API 클라이언트:**
- `src/lib/api/menu.ts` (신규)
  ```typescript
  export async function getMenuTree(): Promise<MenuTreeNode[]>
  export async function getMappings(): Promise<MenuMapping[]>
  export async function saveMappings(mappings: MenuMapping[]): Promise<void>
  ```

**React Query 훅:**
- `src/lib/hooks/use-menu.ts` (신규)
  ```typescript
  export function useMenuTree() // queryKey: menuKeys.tree()
  export function useMenuMappings() // queryKey: menuKeys.mappings()
  export function useSaveMappings() // mutation
  ```

**URL 매핑 유틸:**
- `src/lib/utils/menu-status-mapper.ts` (신규)
  ```typescript
  export function getMenuConnectionStatus(
    originalUrl: string,
    mappedUrl?: string,
    insiteWebUrls?: Set<string>
  ): 'connected' | 'unmapped' | 'not_implemented'
  ```

#### 2.1.3 메인 페이지 + 컴포넌트

**메인 페이지:**
- `src/app/(modules)/settings/menu-management/page.tsx` (신규)
  ```typescript
  // 우상단 "캐시 초기화" 버튼
  // 3개 탭: 메뉴 트리 | URL 매핑 | FAQ 콘텐츠
  // 권한 가드: useAuthStore에서 userRoles 확인 (ADMIN만)
  ```

**컴포넌트:**
- `src/app/(modules)/settings/_components/menu-management-tab.tsx` (신규)
  - 메뉴 트리 뷰어 + 로딩/에러 상태

- `src/app/(modules)/settings/_components/menu-tree-node.tsx` (신규)
  - 노드 렌더링 (expand/collapse, 상태 배지)
  - 상태 배지: 연결됨(green), 미연결(gray), 미구현(yellow)

**레이아웃:**
- `src/app/(modules)/settings/menu-management/layout.tsx` (신규)
  - 권한 가드: ADMIN 역할 체크
  - 권한 없으면 `/settings` 리다이렉트

#### 2.1.4 저장소 준비

**JSON 데이터 저장소:**
- `public/menu-mappings.json` (신규)
  ```json
  {
    "version": "1.0",
    "lastUpdated": "2026-03-11T12:00:00Z",
    "mappings": [
      {
        "menuId": 1,
        "originalUrl": "/workorder",
        "mappedUrl": "/work-orders",
        "createdAt": "2026-03-11T12:00:00Z",
        "updatedAt": "2026-03-11T12:00:00Z"
      }
    ]
  }
  ```

**Next.js Route Handler:**
- `src/app/api/settings/menu-mapping/route.ts` (신규)
  ```typescript
  // GET: 메인 맵핑 조회
  // POST: 새 매핑 저장 (권한 체크 + 파일 쓰기)
  // PUT: 기존 매핑 업데이트
  // DELETE: 매핑 삭제
  ```

#### 2.1.5 수락 기준 (Phase 1)
- [ ] 메뉴 트리 조회 성공 (csp-was API 호출)
- [ ] 메뉴 노드 expand/collapse 동작
- [ ] 연결 상태 배지 표시 (3가지 상태)
- [ ] 권한 가드 동작 확인 (비관리자 접근 차단)
- [ ] 로딩/에러 상태 처리됨
- [ ] 캐시 초기화 버튼 클릭 → `POST /api/admin/caches/evict` 호출

---

### 2.2 Phase 2: URL 매핑 편집 + 저장 API (3-4일)

**목표**: 사용자가 UI에서 메뉴-URL 직접 매핑, JSON 파일에 저장

#### 2.2.1 편집 UI 컴포넌트

- `src/app/(modules)/settings/_components/menu-url-mapping-editor.tsx` (신규)
  ```typescript
  // 메뉴 트리 + 우측 패널 (URL 편집 폼)
  // 구조:
  // ┌─────────────────────┬──────────────────────┐
  // │  메뉴 트리 (좌)     │  URL 매핑 폼 (우)    │
  // │  - 메뉴 선택        │  - 원본 URL (ro)     │
  // │  - 상태 배지        │  - 대상 URL (edit)   │
  // │                     │  - 저장 버튼         │
  // └─────────────────────┴──────────────────────┘

  // 기능:
  // 1. 메뉴 노드 선택 → 우측 폼에 원본/대상 URL 표시
  // 2. 대상 URL 입력 (자동완성: insite-web 라우트 목록)
  // 3. 저장 → PATCH /api/settings/menu-mapping/{menuId}
  // 4. 실시간 유효성 검사 (URL format check)
  ```

#### 2.2.2 자동완성 데이터 준비

- `src/lib/utils/insite-routes.ts` (신규)
  ```typescript
  // insite-web의 모든 라우트 목록 (정적 + 동적)
  export const INSITE_ROUTES = [
    '/dashboard',
    '/work-orders',
    '/work-orders/:id',
    '/work-orders/:id/edit',
    '/facilities',
    '/facilities/:id',
    // ... etc
  ];
  ```

#### 2.2.3 Route Handler 확장

- `src/app/api/settings/menu-mapping/route.ts`
  ```typescript
  // GET /api/settings/menu-mapping
  // → 전체 매핑 조회

  // POST /api/settings/menu-mapping
  // → 새 매핑 추가 (body: { menuId, mappedUrl })

  // PATCH /api/settings/menu-mapping/{menuId}
  // → 특정 메뉴 매핑 업데이트

  // DELETE /api/settings/menu-mapping/{menuId}
  // → 매핑 삭제 (원본 url_mapper.ts로 복귀)
  ```

**구현 세부:**
```typescript
// 권한 체크 + JWT 검증
const user = await getSessionUser(req);
if (!user?.roles.includes('ADMIN')) {
  return NextResponse.json(
    { error: '관리자만 접근 가능합니다.' },
    { status: 403 }
  );
}

// JSON 파일 I/O
const mappingsPath = path.join(process.cwd(), 'public/menu-mappings.json');
const mappings = await fs.promises.readFile(mappingsPath, 'utf-8').then(JSON.parse);

// 새 매핑 추가
mappings.mappings.push({
  menuId: req.body.menuId,
  originalUrl: menu.url,
  mappedUrl: req.body.mappedUrl,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

await fs.promises.writeFile(mappingsPath, JSON.stringify(mappings, null, 2));
```

#### 2.2.4 메뉴-URL 매핑 편집 탭

- `src/app/(modules)/settings/_components/menu-url-mapping-editor.tsx`
  - 트리 선택 + 폼 입력 + 저장 mutation

#### 2.2.5 수락 기준 (Phase 2)
- [ ] 메뉴 노드 선택 → 폼 업데이트
- [ ] 대상 URL 입력 필드 (자동완성 포함)
- [ ] 저장 버튼 클릭 → API 호출 성공
- [ ] JSON 파일 업데이트 확인
- [ ] 저장 후 캐시 자동 무효화 (React Query)
- [ ] 오류 처리 (유효하지 않은 URL 거부)
- [ ] 매핑 삭제 기능 (AlertDialog 확인 후)

---

### 2.3 Phase 3: FAQ 콘텐츠 관리 (선택적, 3-4일)

**목표**: YouTube 영상/PDF 업로드 및 메뉴 매핑 관리

#### 2.3.1 FAQ 콘텐츠 탭

- `src/app/(modules)/settings/_components/menu-content-modal.tsx` (신규)
  ```typescript
  // Modal 구조:
  // ┌────────────────────────────────┐
  // │  [메뉴명] - FAQ 콘텐츠 관리    │
  // ├────────────────────────────────┤
  // │ YouTube 영상                   │
  // │ ├─ [영상 추가 버튼]            │
  // │ └─ [기존 영상 목록 + 삭제]     │
  // │                                │
  // │ PDF 문서                       │
  // │ ├─ [파일 업로드]               │
  // │ └─ [기존 파일 목록 + 삭제]     │
  // └────────────────────────────────┘

  // 기능:
  // 1. YouTube URL 입력 → pageInfoId 저장 (csp-was API)
  // 2. PDF 파일 선택 → 업로드 (FormData)
  // 3. 기존 콘텐츠 삭제 (AlertDialog)
  ```

#### 2.3.2 API 연동

- csp-was 기존 API 사용:
  - `POST /api/faq/addMenuVideo/{pageInfoId}` - YouTube 추가
  - `POST /api/faq/addMenuPdf/{pageInfoId}` - PDF 업로드
  - `DELETE /api/faq/deleteMenuPdf/{pageInfoId}` - PDF 삭제

#### 2.3.3 수락 기준 (Phase 3)
- [ ] YouTube URL 입력 필드 (URL validation)
- [ ] 저장 → `POST /api/faq/addMenuVideo/{pageInfoId}` 성공
- [ ] PDF 파일 선택 → `POST /api/faq/addMenuPdf/{pageInfoId}` 성공
- [ ] 파일 사이즈 제한 (10MB 이하)
- [ ] 삭제 → AlertDialog 확인 후 API 호출
- [ ] 로딩/에러 토스트 메시지

---

## 3. 신규 파일 목록 (구체적 경로)

### 3.1 타입 및 유틸

```
src/lib/types/
├── menu.ts                              (신규)
└── (기존: setting.ts 참조 불필요)

src/lib/api/
├── menu.ts                              (신규)

src/lib/hooks/
├── use-menu.ts                          (신규)

src/lib/utils/
├── menu-status-mapper.ts                (신규)
└── insite-routes.ts                     (신규)
```

### 3.2 페이지 및 레이아웃

```
src/app/(modules)/settings/
├── menu-management/
│   ├── layout.tsx                       (신규, 권한 가드)
│   └── page.tsx                         (신규, 메인)
│
└── _components/
    ├── menu-management-tab.tsx          (신규)
    ├── menu-tree-node.tsx               (신규)
    ├── menu-url-mapping-editor.tsx      (신규)
    ├── menu-content-modal.tsx           (신규, FAQ)
    └── menu-cache-section.tsx           (신규)

src/app/(modules)/settings/page.tsx      (수정: 링크 추가)
```

### 3.3 API Route Handler

```
src/app/api/
├── settings/
│   └── menu-mapping/
│       └── route.ts                     (신규, GET/POST/PATCH/DELETE)
└── (기존 경로 참조)
```

### 3.4 데이터 저장소

```
public/
├── menu-mappings.json                   (신규, 초기 빈 파일)
└── (기존 정적 파일)
```

---

## 4. 단계별 구현 순서 및 의존성

```
Phase 1 (4-6일) - 기초 인프라
├─ src/lib/types/menu.ts ────────────┐
├─ src/lib/api/menu.ts ───────────────┤ (병렬 가능)
├─ src/lib/hooks/use-menu.ts ────────┤
├─ src/lib/utils/menu-status-mapper.ts┘
│
├─ src/app/(modules)/settings/
│  ├─ menu-management/layout.tsx  (권한 가드 필수)
│  ├─ menu-management/page.tsx    (위의 모든 파일 필요)
│  └─ _components/
│     ├─ menu-tree-node.tsx
│     └─ menu-management-tab.tsx
│
└─ public/menu-mappings.json

Phase 2 (3-4일) - URL 매핑 편집
├─ src/lib/utils/insite-routes.ts ────┐
├─ src/app/api/settings/
│  └─ menu-mapping/route.ts ──────────┤ (Phase 1 필수)
│
└─ src/app/(modules)/settings/
   └─ _components/
      └─ menu-url-mapping-editor.tsx

Phase 3 (3-4일) - FAQ 콘텐츠 관리 (선택적)
└─ src/app/(modules)/settings/
   └─ _components/
      ├─ menu-content-modal.tsx
      └─ menu-cache-section.tsx
```

---

## 5. 기술 스택 및 패턴

### 5.1 상태 관리

| 계층 | 도구 | 용도 |
|------|------|------|
| 서버 | React Query | 메뉴 트리, 매핑 데이터 캐싱 |
| 클라이언트 | useState | 폼 입력, expand/collapse 상태 |
| 전역 | Zustand (기존) | 인증 정보만 (새 상태 추가 불필요) |

**React Query 설정:**
```typescript
// Phase 1
export const menuKeys = {
  all: ['menu'] as const,
  tree: () => [...menuKeys.all, 'tree'] as const,
  mappings: () => [...menuKeys.all, 'mappings'] as const,
};

// staleTime 설정
useQuery({
  queryKey: menuKeys.tree(),
  queryFn: getMenuTree,
  staleTime: 5 * 60 * 1000, // 5분 (메뉴는 자주 변경 안 됨)
});

useQuery({
  queryKey: menuKeys.mappings(),
  queryFn: getMenuMappings,
  staleTime: 5 * 60 * 1000,
});
```

### 5.2 에러 처리

```typescript
// 공용 핸들러 사용 (기존 패턴)
try {
  await saveMappings(newMappings);
  toast.success("메뉴 매핑이 저장되었습니다.");
  queryClient.invalidateQueries({ queryKey: menuKeys.mappings() });
} catch (error) {
  handleApiError(error);
}
```

### 5.3 권한 체크

```typescript
// src/app/(modules)/settings/menu-management/layout.tsx
'use client';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation';

export default function MenuManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  if (!user?.userRoles?.includes('ADMIN')) {
    router.replace('/settings');
    return null;
  }

  return <>{children}</>;
}
```

---

## 6. 위험 요소 및 완화 전략

### 6.1 주요 위험

| 위험 | 심각도 | 완화 전략 |
|------|--------|----------|
| JSON 파일 동시 쓰기 충돌 | 중 | 락 파일 또는 Prisma 마이그레이션 고려 (Phase 3) |
| 메뉴 트리 데이터 크기 (1000+ 노드) | 낮 | React 가상화 (react-window) 선택적 도입 |
| 권한 체크 우회 | 높음 | 미들웨어 + Route Handler 이중 검증 |
| URL 매핑 유효성 검증 | 중 | URL 형식 검사 + insite-routes.ts 화이트리스트 |
| 캐시 초기화 실패 | 낮 | 실패 시 토스트 (재시도 버튼 포함) |

### 6.2 확장성 고려

**향후 개선사항 (MVP 범위 외):**
- [ ] 메뉴-URL 매핑 이력 (Prisma + DB 저장)
- [ ] 매핑 버전 관리 (롤백 기능)
- [ ] 일괄 CSV 업로드
- [ ] 메뉴 권한 세분화 (사용자별 메뉴 노출)

---

## 7. 검증 및 테스트 계획

### 7.1 Unit 테스트 (필수)

```typescript
// src/lib/utils/__tests__/menu-status-mapper.test.ts
describe('getMenuConnectionStatus', () => {
  it('should return "connected" for valid mapped URL', () => {
    const status = getMenuConnectionStatus(
      '/workorder',
      '/work-orders',
      new Set(['/work-orders'])
    );
    expect(status).toBe('connected');
  });

  it('should return "unmapped" when no mapping exists', () => {
    const status = getMenuConnectionStatus('/unknown');
    expect(status).toBe('unmapped');
  });
});
```

### 7.2 통합 테스트 (필수, Phase 2)

```typescript
// src/app/api/settings/menu-mapping/__tests__/route.test.ts
describe('POST /api/settings/menu-mapping', () => {
  it('should save mapping to JSON file', async () => {
    const res = await fetch('/api/settings/menu-mapping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        menuId: 1,
        mappedUrl: '/work-orders',
      }),
    });
    expect(res.status).toBe(200);
    // JSON 파일 내용 검증
  });

  it('should reject non-ADMIN users', async () => {
    // 권한 없는 요청 테스트
  });
});
```

### 7.3 E2E 테스트 (선택적, Phase 3)

```typescript
// e2e/menu-management.spec.ts (Playwright)
test('메뉴 URL 매핑 워크플로우', async ({ page }) => {
  await page.goto('/settings/menu-management');

  // 1. 메뉴 노드 선택
  await page.click('[data-menu-node="1"]');

  // 2. URL 입력
  await page.fill('[data-field="mapped-url"]', '/work-orders');

  // 3. 저장 클릭
  await page.click('[data-action="save"]');

  // 4. 성공 토스트 확인
  await page.waitForSelector('text=저장되었습니다');

  // 5. JSON 파일 검증
  const mappings = await readFile('public/menu-mappings.json');
  expect(mappings).toContain('/work-orders');
});
```

---

## 8. 수락 기준 (전체)

### Phase 1 (메뉴 트리 뷰)
- [ ] csp-was `/api/faq/menus` 호출 성공
- [ ] 메뉴 트리 렌더링 (depth 3+ 지원)
- [ ] expand/collapse 토글 동작
- [ ] 3가지 연결 상태 배지 표시
- [ ] 권한 가드: 비관리자 접근 차단
- [ ] 로딩 상태 (Skeleton) 표시
- [ ] 에러 상태 (EmptyState) 처리
- [ ] 캐시 초기화 버튼 동작
- [ ] 모든 타입스크립트 타입 정의됨 (any 금지)
- [ ] Zod 스키마 검증 (응답 DTO)

### Phase 2 (URL 매핑 편집)
- [ ] 메뉴 노드 선택 → 폼 업데이트
- [ ] 원본 URL 읽기 전용 표시
- [ ] 대상 URL 입력 + 자동완성
- [ ] URL 형식 검증 (실시간)
- [ ] 저장 버튼 → API 호출
- [ ] JSON 파일 업데이트 확인
- [ ] 캐시 무효화 (React Query)
- [ ] 매핑 삭제 (AlertDialog)
- [ ] 토스트 피드백 (성공/실패)
- [ ] Route Handler 권한 체크
- [ ] 에러 로그 (console, 프로덕션 제외)

### Phase 3 (FAQ 콘텐츠, 선택적)
- [ ] YouTube URL 입력 필드
- [ ] PDF 파일 업로드 (파일 크기 제한)
- [ ] 기존 콘텐츠 목록 표시
- [ ] 삭제 기능 (AlertDialog)
- [ ] csp-was API 호출 성공
- [ ] 로딩/에러 상태 처리

---

## 9. 커밋 및 PR 전략

### Phase 1 커밋 (4-5개)
```
feat: 메뉴 관리 타입 및 API 클라이언트 추가
feat: 메뉴 트리 뷰어 컴포넌트 구현
feat: 메뉴 관리 페이지 및 권한 가드 구현
feat: 캐시 초기화 기능 추가
```

### Phase 2 커밋 (3-4개)
```
feat: URL 매핑 편집기 컴포넌트 구현
feat: 메뉴 매핑 저장 API Route Handler 추가
feat: 메뉴-URL 매핑 데이터 저장소 구성
```

### Phase 3 커밋 (2-3개)
```
feat: FAQ 콘텐츠 관리 모달 구현
feat: YouTube/PDF 업로드 기능 추가
```

---

## 10. 생략된 항목 (Scope 범위 외)

- 메뉴 순서 변경 (Drag & Drop)
- 메뉴 신규 생성 (csp-was와의 동기화 불가)
- 메뉴 그룹 권한 관리 (역할 기반 노출)
- 메뉴 소프트 삭제 (논리 삭제)
- 다국어 메뉴 (i18n)

---

## 11. 오픈 이슈 (검토 필요)

- [ ] JSON 파일 동시 쓰기 충돌 처리 방식 (MutexLock vs Prisma)
- [ ] URL 매핑 초기값: menu-url-mapper.ts의 기존 매핑을 public/menu-mappings.json에 씨드할지?
- [ ] Phase 3 (FAQ 콘텐츠)는 진행할지, 아니면 향후로 미룰지?
- [ ] 메뉴 트리가 매우 크면 (1000+ 노드) 가상화 도입 필요 여부?

---

## 12. 일정 및 리소스

| Phase | 기간 | 주요 업무 | 예상 코드량 |
|-------|------|----------|-----------|
| 1 | 4-6일 | 타입/API/컴포넌트 | ~800줄 |
| 2 | 3-4일 | 편집기/Route Handler | ~600줄 |
| 3 | 3-4일 | FAQ 모달 (선택) | ~400줄 |
| **합계** | **10-14일** | | **~1,800줄** |

**가정:**
- 개발자 1명 (풀타임)
- 병렬 처리 가능 (Phase 1 내 독립 파일들)
- 테스트 포함 (Unit + 통합)

---

## 13. 승인 및 다음 단계

**이 계획이 맞으면:**
1. 사용자 명시적 확인: "proceed" | "adjust [항목]" | "restart"
2. 확인 후 → `/oh-my-claudecode:start-work` 핸드오프
3. Executor가 Phase 1부터 순차 구현

**조정 필요 시:**
- 구체적 항목 명시 (예: "메뉴 URL 자동완성 형식 변경")
- Planner 재인터뷰 → 수정안 재생성

---

**최종 작성**: 2026-03-11 14:30
**검토 상태**: Architect/Critic 피드백 반영 완료
**준비 상태**: Executor 핸드오프 대기
