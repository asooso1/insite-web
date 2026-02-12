# Phase 4 구현 계획 - 추가 CRUD 모듈

> 최종 업데이트: 2026-02-12
>
> **세션 시작 시 이 파일을 읽고 바로 구현을 시작하세요.**

---

## 현재 상태

- ✅ 시설(Facility) 모듈 완료
- ⏳ 사용자 관리 모듈 - 대기
- ⏳ 클라이언트/계약 모듈 - 대기

---

## 1. 사용자 관리 모듈

### 1.1 파일 구조

```
src/
├── lib/
│   ├── types/user.ts          # 타입 정의
│   ├── api/user.ts            # API 클라이언트
│   └── hooks/use-users.ts     # React Query 훅
└── app/(modules)/users/
    ├── page.tsx               # 목록
    ├── [id]/page.tsx          # 상세
    ├── [id]/edit/page.tsx     # 수정
    ├── new/page.tsx           # 등록
    ├── roles/page.tsx         # 역할 목록
    └── _components/
        └── user-form.tsx      # 공통 폼
```

### 1.2 API 엔드포인트

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/api/user/userList` | 목록 (페이징) |
| GET | `/api/user/userView?id={id}` | 상세 |
| POST | `/api/user/userAdd` | 등록 |
| PUT | `/api/user/userEdit` | 수정 |
| DELETE | `/api/user/userEdit?id={id}` | 삭제 |
| GET | `/api/user/userAdd/isUserId?userId={userId}` | 아이디 중복 확인 |
| PUT | `/api/user/userEdit/password` | 비밀번호 초기화 |
| GET | `/open/user/roleList` | 역할 목록 |

### 1.3 타입 정의 (user.ts)

```typescript
// Enum
export const AccountState = {
  HIRED: "HIRED",      // 재직중
  LEAVE: "LEAVE",      // 휴직
  RETIRED: "RETIRED",  // 퇴사
  TEMPORAL: "TEMPORAL", // 임시
  DEL: "DEL",          // 삭제
} as const;

export const AccountType = {
  LABS: "LABS",      // 본사인력
  FIELD: "FIELD",    // 현장인력
  DAILY: "DAILY",    // 일용직
  CLIENT: "CLIENT",  // 고객사
  GUEST: "GUEST",    // 민원인
} as const;

// DTO
export interface AccountDTO {
  id: number;
  userId: string;
  name: string;
  companyId: number;
  companyName: string;
  type: AccountType;
  typeName: string;
  department: string;
  position: string;
  officePhone: string;
  mobile: string;
  email: string;
  birthDate: string | null;
  gender: "M" | "F";
  hiredDate: string | null;
  retiredDate: string | null;
  state: AccountState;
  stateName: string;
  note: string;
  roles: RoleDTO[];
  buildingCnt: number;
  writeDate: string;
  writerName: string;
}

export interface RoleDTO {
  id: number;
  code: string;
  name: string;
  state: "USE" | "STOP";
  type: AccountType;
  typeString: string;
}

// Search VO
export interface SearchUserVO {
  companyId?: number;
  buildingId?: number;
  state?: AccountState;
  roleId?: number;
  searchCode?: "name" | "userId" | "mobile";
  searchKeyword?: string;
  startDate?: string;
  endDate?: string;
  dateType?: "writeDate" | "hiredDate" | "retiredDate";
}

// Create/Update VO
export interface UserVO {
  id?: number;
  userId: string;
  name: string;
  companyId: number;
  mobile: string;
  birthDate: string;
  gender: "M" | "F";
  state: AccountState;
  hiredDate?: string;
  retiredDate?: string;
  roleId: number;
  department?: string;
  officePhone?: string;
  email?: string;
  zipCode?: string;
  address?: string;
  addressDetail?: string;
  note?: string;
}
```

### 1.4 주요 기능

- 사용자 목록: 상태 탭 필터, 검색, 페이지네이션
- 사용자 상세: 기본 정보, 담당 건물, 자격증, 이력
- 사용자 등록: 아이디 중복 확인, 폼 검증
- 사용자 수정: 권한에 따른 필드 제한
- 비밀번호 초기화 (관리자)

---

## 2. 클라이언트/계약 모듈

### 2.1 파일 구조

```
src/
├── lib/
│   ├── types/client.ts        # 타입 정의
│   ├── api/client.ts          # API 클라이언트
│   └── hooks/use-clients.ts   # React Query 훅
└── app/(modules)/clients/
    ├── page.tsx               # 목록
    ├── [id]/page.tsx          # 상세
    ├── [id]/edit/page.tsx     # 수정
    ├── new/page.tsx           # 등록
    └── _components/
        └── client-form.tsx    # 공통 폼
```

### 2.2 API 엔드포인트

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/api/client/clientList` | 목록 (페이징) |
| GET | `/api/client/clientView/{id}` | 상세 |
| POST | `/api/client/clientAdd` | 등록 (FormData) |
| PUT | `/api/client/clientEdit` | 수정 (FormData) |
| DELETE | `/api/client/clientDelete?id={id}` | 삭제 |
| GET | `/api/client/clientAdd/isBusinessNo?businessNo={no}` | 사업자번호 중복 |
| POST | `/api/client/clientBaseArea` | 거점 등록 |
| PUT | `/api/client/clientBaseArea` | 거점 상태 변경 |

### 2.3 타입 정의 (client.ts)

```typescript
// Enum
export const CompanyState = {
  USE: "USE",    // 사용중
  STOP: "STOP",  // 사용중지
  OUT: "OUT",    // 탈퇴
  DEL: "DEL",    // 삭제
} as const;

// DTO
export interface CompanyDTO {
  id: number;
  businessNo: string;
  name: string;
  phone: string;
  fax: string;
  officerName: string;
  officerPhone: string;
  officerMobile: string;
  officerEmail: string;
  state: CompanyState;
  stateName: string;
  note: string;
  zipCode: string;
  address: string;
  addressRoad: string;
  addressDetail: string;
  buildingCnt: number;
  buildingList: BuildingDTO[];
  contractDate: string | null;  // 최초 계약일
  serviceExpire: boolean;
  writeDate: string;
  writerName: string;
}

export interface ClientViewDTO extends CompanyDTO {
  buildingDTO: ClientViewBuildingDTO[];
  baseAreaList: BaseAreaDTO[];
  logoOriginFileName: string;
  companyLogoDTO: CompanyLogoDTO | null;
}

export interface ClientViewBuildingDTO {
  id: number;
  name: string;
  wideAreaName: string;
  baseAreaName: string;
  contractTermStart: string;
  contractTermEnd: string;
  facilityCount: number;
  controlPointCount: number;
  serviceExpire: boolean;
  buildingAccountList: BuildingAccountDTO[];
}

export interface BaseAreaDTO {
  id: number;
  name: string;
  state: "USE" | "STOP";
  companyId: number;
  buildingList: BuildingDTO[];
}

// Search VO
export interface SearchClientVO {
  companyId?: number;
  searchCode?: "companyName" | "businessNo";
  searchKeyword?: string;
  writeDateFrom?: string;
  writeDateTo?: string;
}

// Create/Update VO
export interface ClientVO {
  id?: number;
  businessNo: string;
  name: string;
  phone: string;
  fax?: string;
  officerName: string;
  officerPhone: string;
  officerMobile?: string;
  officerEmail?: string;
  state: CompanyState;
  note?: string;
  zipCode: string;
  address: string;
  addressRoad: string;
  addressDetail: string;
  weatherX?: string;
  weatherY?: string;
  files?: File[];  // 로고 파일
}
```

### 2.4 주요 기능

- 클라이언트 목록: 기간 필터, 검색, 페이지네이션
- 클라이언트 상세: 기본 정보, 등록 건물 목록, 거점 관리
- 클라이언트 등록: 사업자번호 중복 확인, 주소 검색 (Daum API)
- 클라이언트 수정: 로고 파일 업로드
- 거점 관리: 등록, 상태 변경

---

## 3. 구현 순서

### 3.1 사용자 관리 모듈 (먼저)

1. `src/lib/types/user.ts` - 타입 정의
2. `src/lib/api/user.ts` - API 클라이언트
3. `src/lib/hooks/use-users.ts` - React Query 훅
4. `src/app/(modules)/users/page.tsx` - 목록 페이지
5. `src/app/(modules)/users/[id]/page.tsx` - 상세 페이지
6. `src/app/(modules)/users/_components/user-form.tsx` - 폼 컴포넌트
7. `src/app/(modules)/users/new/page.tsx` - 등록 페이지
8. `src/app/(modules)/users/[id]/edit/page.tsx` - 수정 페이지

### 3.2 클라이언트 모듈 (이후)

1. `src/lib/types/client.ts` - 타입 정의
2. `src/lib/api/client.ts` - API 클라이언트
3. `src/lib/hooks/use-clients.ts` - React Query 훅
4. `src/app/(modules)/clients/page.tsx` - 목록 페이지
5. `src/app/(modules)/clients/[id]/page.tsx` - 상세 페이지
6. `src/app/(modules)/clients/_components/client-form.tsx` - 폼 컴포넌트
7. `src/app/(modules)/clients/new/page.tsx` - 등록 페이지
8. `src/app/(modules)/clients/[id]/edit/page.tsx` - 수정 페이지

---

## 4. 참조 파일

### csp-was (백엔드)
- `/Volumes/jinseok-SSD-1tb/00_insite/csp-was/src/main/java/hdclabs/cspwas/controller/UserController.java`
- `/Volumes/jinseok-SSD-1tb/00_insite/csp-was/src/main/java/hdclabs/cspwas/controller/ClientController.java`
- `/Volumes/jinseok-SSD-1tb/00_insite/csp-was/src/main/java/hdclabs/cspwas/model/entity/Account.java`
- `/Volumes/jinseok-SSD-1tb/00_insite/csp-was/src/main/java/hdclabs/cspwas/model/entity/Company.java`

### csp-web (프론트엔드 참조)
- `/Volumes/jinseok-SSD-1tb/00_insite/csp-web/src/main/resources/templates/user/`
- `/Volumes/jinseok-SSD-1tb/00_insite/csp-web/src/main/resources/templates/client/`

### insite-web 기존 구현 참조
- `/src/lib/types/facility.ts` - 타입 패턴
- `/src/lib/api/facility.ts` - API 패턴
- `/src/lib/hooks/use-facilities.ts` - Hook 패턴
- `/src/app/(modules)/facilities/` - 페이지 패턴

---

## 5. 빠른 시작 명령

```bash
# 개발 서버 실행
npm run dev

# 빌드 확인
npm run build
```

---

**다음 작업:** 사용자 관리 모듈부터 구현 시작
