# insite-web 개발 가이드

> **Spring Boot + Vue.js → Next.js 15 마이그레이션**
> csp-was(REST API)는 그대로 유지, csp-was 변경은 CORS 1줄만 허용

---

## 🚀 현재 상태

```
Phase 4: 추가 CRUD 모듈 (진행중 67%)
├── ✅ 시설(Facility) 모듈 완료
├── ✅ 사용자 관리 모듈 완료
└── ⏳ 클라이언트/계약 모듈 ← 진행중
```

**다음 태스크:** 클라이언트/계약 모듈 구현
- 참조: `.claude/context/phase-4-plan.md` (상세 타입, API 명세)
- 패턴: `src/lib/{types,api,hooks}/user.ts` 참조

---

## 📋 필수 규칙

### 언어
- **문서/주석/커밋: 한국어 필수**
- 변수명/함수명: 영어 camelCase
- UI 텍스트/에러: 한국어

### 용어 (변경 금지)
| 영문 | 한글 |
|------|------|
| Work Order | 작업 |
| Facility | 시설 |
| Building | 빌딩 |
| Dashboard | 대시보드 |
| Widget | 위젯 |

### 코드
```typescript
// ✅ 올바른 패턴
interface UserDTO { id: number; name: string; }
const [page] = useQueryState('page', parseAsInteger.withDefault(0));

// ❌ 금지
any 타입 / !important / 인라인 스타일 / localStorage 토큰 저장
```

### 커밋
```bash
# 형식: <type>: <한글 설명>
feat: 사용자 목록 페이지 구현
fix: 토큰 갱신 로직 수정
```

---

## 🏗️ 구현 패턴 (Phase 3~4 검증됨)

### 1. 타입 정의 (`lib/types/{module}.ts`)
```typescript
// Enum - const assertion + 레이블/스타일 매핑
export const UserState = {
  HIRED: 'HIRED',
  LEAVE: 'LEAVE',
  RETIRED: 'RETIRED',
} as const;
export type UserState = typeof UserState[keyof typeof UserState];

export const UserStateLabel: Record<UserState, string> = {
  HIRED: '재직중',
  LEAVE: '휴직',
  RETIRED: '퇴사',
};

// DTO - 백엔드 응답 매핑
export interface UserDTO {
  id: number;
  userId: string;
  name: string;
  state: UserState;
  // ...
}

// VO - 생성/수정 요청
export interface UserVO {
  userId: string;
  name: string;
  // required 필드만 필수, 나머지 optional
}

// Search VO - 검색 파라미터
export interface SearchUserVO {
  companyId?: number;
  state?: UserState;
  keyword?: string;
  page?: number;
  size?: number;
}
```

### 2. API 클라이언트 (`lib/api/{module}.ts`)
```typescript
import { apiClient } from './client';

export const userApi = {
  list: (params: SearchUserVO) =>
    apiClient.get<PageResponse<UserDTO>>('/api/user/userList', { params }),

  view: (id: number) =>
    apiClient.get<UserDTO>(`/api/user/userView`, { params: { id } }),

  add: (data: UserVO) =>
    apiClient.post<void>('/api/user/userAdd', data),

  edit: (data: UserVO & { id: number }) =>
    apiClient.put<void>('/api/user/userEdit', data),

  delete: (id: number) =>
    apiClient.delete<void>(`/api/user/userEdit`, { params: { id } }),
};
```

### 3. React Query 훅 (`lib/hooks/use-{module}.ts`)
```typescript
// Query Keys Factory
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: SearchUserVO) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

// Query Hook
export function useUserList(params: SearchUserVO) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userApi.list(params),
  });
}

// Mutation Hook
export function useAddUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
```

### 4. 페이지 구조 (`app/(modules)/{module}/`)
```
users/
├── page.tsx                 # 목록 (DataTable + 필터 + 페이지네이션)
├── [id]/page.tsx            # 상세 (InfoPanel + 탭)
├── [id]/edit/page.tsx       # 수정 (폼)
├── new/page.tsx             # 등록 (폼)
└── _components/
    ├── user-form.tsx        # 공통 폼 컴포넌트
    └── user-columns.tsx     # DataTable 컬럼 정의
```

---

## 📁 디렉토리 구조

```
insite-web/
├── .claude/
│   ├── CLAUDE.md              # 이 파일 (핵심 가이드)
│   └── context/
│       └── phase-4-plan.md    # 현재 Phase 상세 계획
├── src/
│   ├── app/(modules)/         # 기능 모듈 페이지
│   ├── components/
│   │   ├── ui/                # shadcn/ui
│   │   ├── forms/             # 폼 컴포넌트
│   │   └── data-display/      # 테이블, 차트 등
│   └── lib/
│       ├── types/             # TypeScript 타입
│       ├── api/               # API 클라이언트
│       └── hooks/             # React Query 훅
└── docs/
    └── task-progress.md       # 전체 진행 현황
```

---

## 🔧 빠른 명령어

```bash
# 개발
npm run dev

# 빌드 (커밋 전 필수)
npm run build

# 린트
npm run lint
```

---

## 📚 참조

### 백엔드 (csp-was)
- 컨트롤러: `/Volumes/jinseok-SSD-1tb/00_insite/csp-was/src/main/java/hdclabs/cspwas/controller/`
- 엔티티/VO: `/Volumes/jinseok-SSD-1tb/00_insite/csp-was/src/main/java/hdclabs/cspwas/model/`

### 기존 프론트엔드 (csp-web)
- 템플릿: `/Volumes/jinseok-SSD-1tb/00_insite/csp-web/src/main/resources/templates/`

### 검증된 구현 예시
- 타입: `src/lib/types/facility.ts`
- API: `src/lib/api/facility.ts`
- 훅: `src/lib/hooks/use-facilities.ts`
- 페이지: `src/app/(modules)/facilities/`
