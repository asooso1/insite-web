# csp-was API 감사 문서

> 작성일: 2026-02-06
> 상태: 🔄 진행중

## 목적

csp-was REST API 백엔드의 전체 엔드포인트를 분석하고, Next.js 마이그레이션에 필요한 타입 정의 및 매핑 문서를 작성합니다.

---

## 1. OpenAPI 스펙 추출

### 1.1 추출 방법

```bash
# csp-was 실행 후 OpenAPI 스펙 다운로드
curl http://localhost:8080/v3/api-docs/v1-definition > openapi/spec.json
```

### 1.2 스펙 파일 위치

- 원본: `http://localhost:8080/v3/api-docs/v1-definition`
- 저장: `insite-web/openapi/spec.json`

### 1.3 추출 상태

| 항목 | 상태 | 비고 |
|------|------|------|
| OpenAPI 스펙 추출 | ⏳ 대기 | csp-was 실행 필요 |
| 스펙 파일 저장 | ⏳ 대기 | |
| 스펙 유효성 검증 | ⏳ 대기 | |

---

## 2. REST 컨트롤러 카탈로그

### 2.1 컨트롤러 목록 (72개)

> csp-was 소스 분석 후 작성 예정

| 번호 | 컨트롤러 | 경로 | 엔드포인트 수 | 설명 |
|------|----------|------|--------------|------|
| 1 | AuthController | /api/auth | - | 인증 |
| 2 | WorkOrderController | /api/work-orders | - | 작업 관리 |
| 3 | FacilityController | /api/facilities | - | 시설 관리 |
| 4 | BuildingController | /api/buildings | - | 빌딩 관리 |
| 5 | UserController | /api/users | - | 사용자 관리 |
| 6 | DashboardController | /api/dashboards | - | 대시보드 |
| 7 | WidgetController | /api/widgets | 44 | 위젯 데이터 |
| 8 | SensorController | /api/sensors | - | 센서 |
| 9 | BemsController | /api/bems | - | BEMS |
| 10 | BecmController | /api/becm | - | BECM |
| ... | ... | ... | ... | ... |

### 2.2 분석 작업

- [ ] csp-was 소스 코드에서 모든 @RestController 클래스 식별
- [ ] 각 컨트롤러의 @RequestMapping 경로 수집
- [ ] 각 메서드의 HTTP 메서드 및 경로 수집
- [ ] 요청/응답 DTO 클래스 식별

---

## 3. csp-web 템플릿 → API 매핑

### 3.1 매핑 목적

583개 Thymeleaf 템플릿이 호출하는 csp-was API를 식별하여,
Next.js 페이지 구현 시 필요한 API 호출 목록을 파악합니다.

### 3.2 매핑 테이블 (예시)

| 템플릿 | csp-was API | HTTP | 용도 |
|--------|-------------|------|------|
| work-order/list.html | /api/work-orders | GET | 작업 목록 조회 |
| work-order/detail.html | /api/work-orders/{id} | GET | 작업 상세 조회 |
| work-order/form.html | /api/work-orders | POST | 작업 생성 |
| work-order/form.html | /api/work-orders/{id} | PUT | 작업 수정 |
| ... | ... | ... | ... |

### 3.3 분석 작업

- [ ] csp-web 템플릿 목록 추출
- [ ] 각 템플릿에서 ajax.js 호출 패턴 분석
- [ ] API 엔드포인트와 매핑

---

## 4. TypeScript 타입 정의

### 4.1 핵심 DTO 목록

> Java DTO 클래스 분석 후 작성 예정

| Java DTO | TypeScript 타입 | 용도 |
|----------|----------------|------|
| WorkOrderDTO | WorkOrder | 작업 |
| WorkOrderCreateRequest | CreateWorkOrderInput | 작업 생성 요청 |
| WorkOrderUpdateRequest | UpdateWorkOrderInput | 작업 수정 요청 |
| FacilityDTO | Facility | 시설 |
| BuildingDTO | Building | 빌딩 |
| UserDTO | User | 사용자 |
| AuthVO | AuthUser | 인증 사용자 |
| ... | ... | ... |

### 4.2 공통 응답 구조

```typescript
// csp-was 공통 응답 구조
interface ApiResponse<T> {
  code: string;      // E00200, E00400, E00401 등
  message: string;   // 응답 메시지
  data: T;           // 실제 데이터
}

// 페이지네이션 응답
interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;     // 현재 페이지 (0-based)
  first: boolean;
  last: boolean;
}
```

### 4.3 에러 코드 매핑

| 코드 | HTTP | 의미 | 처리 방식 |
|------|------|------|----------|
| E00200 | 200 | 성공 | 정상 처리 |
| E00400 | 400 | Bad Request | 토스트 에러 |
| E00401 | 401 | 인증 실패 | 토큰 갱신 시도 |
| E00403 | 403 | 권한 없음 | 권한 없음 UI |
| E00404 | 404 | 데이터 없음 | 빈 상태 UI |
| E00412 | 412 | 사용자 정보 없음 | 자동 로그아웃 |
| E00422 | 422 | 유효성 검사 실패 | 필드별 에러 |
| E00500 | 500 | 서버 오류 | Sentry 보고 |
| E01003 | 404 | 조회 데이터 없음 | 빈 목록 |

---

## 5. Java Enum → TypeScript 매핑

### 5.1 매핑 테이블

| Java Enum | TypeScript | 값 목록 |
|-----------|------------|--------|
| WorkOrderStatus | WorkOrderStatus | PENDING, IN_PROGRESS, COMPLETED, CANCELLED |
| WorkOrderItemType | WorkOrderItemType | INSPECTION, REPAIR, MAINTENANCE |
| Priority | Priority | LOW, MEDIUM, HIGH, URGENT |
| UserRole | UserRole | ROLE_SYSTEM_ADMIN, ROLE_LABS_SYSTEM_ADMIN, ... |
| AccountType | AccountType | LABS, FIELD, CLIENT |
| ... | ... | ... |

### 5.2 TypeScript Enum 정의 패턴

```typescript
// 권장 패턴: as const 객체
export const WorkOrderStatus = {
  PENDING: { value: 'PENDING', label: '대기' },
  IN_PROGRESS: { value: 'IN_PROGRESS', label: '진행중' },
  COMPLETED: { value: 'COMPLETED', label: '완료' },
  CANCELLED: { value: 'CANCELLED', label: '취소' },
} as const;

export type WorkOrderStatusKey = keyof typeof WorkOrderStatus;
export type WorkOrderStatusValue = typeof WorkOrderStatus[WorkOrderStatusKey]['value'];
```

---

## 6. 다음 단계

1. csp-was 실행하여 OpenAPI 스펙 추출
2. 컨트롤러별 상세 엔드포인트 분석
3. Hey API로 타입 자동 생성 테스트
4. 수동 타입 보강 필요 여부 판단

---

## 참고

- csp-was 위치: `/Volumes/jinseok-SSD-1tb/00_insite/csp-was/`
- SpringDoc 버전: 1.6.6
- OpenAPI 스펙: v3
