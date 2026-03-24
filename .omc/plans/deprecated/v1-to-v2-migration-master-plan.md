# insite-web v1→v2 마이그레이션 마스터 플랜

> **작성일:** 2026-03-05
> **상태:** 검토 대기
> **목표:** v1(csp-web) 모든 기능을 v2(insite-web)에 완전 이관. 이 플랜은 추후 변동 없음.

---

## 1. 불변 원칙 (절대 변경 금지)

### 1-1. 아키텍처 제약
| 항목 | 규칙 |
|------|------|
| **백엔드** | csp-was 변경 금지 (CORS 1줄만 허용) |
| **v1 참조** | csp-web 읽기 전용 (수정 금지) |
| **API** | csp-was REST API 그대로 사용, 엔드포인트 변경 없음 |
| **토큰** | httpOnly 쿠키만 사용, localStorage 저장 금지 |

### 1-2. 코드 규칙
| 항목 | 규칙 |
|------|------|
| **언어** | 문서/주석/커밋/UI텍스트 → 한국어, 변수명/함수명 → 영어 camelCase |
| **타입** | `any` 금지, 모든 public 함수 반환 타입 명시 |
| **스타일** | `!important` 금지, 인라인 스타일 금지 |
| **파일 크기** | 함수 50줄 이하, 파일 800줄 이하 |
| **커밋** | `<type>: <한국어 설명>` 형식 고정 |

### 1-3. 구현 패턴 (모든 신규 모듈 동일하게 적용)
```
1. lib/types/{module}.ts
   - Enum: const assertion + Label Record + Style Record
   - DTO: 백엔드 응답 인터페이스
   - VO: 생성/수정 요청
   - SearchVO: 검색 파라미터

2. lib/api/{module}.ts
   - 개별 export 함수: get{Module}List, get{Module}, add{Module}, update{Module}, delete{Module}
   - JSON body → apiClient.post/put
   - 파일 포함 → apiClient.postForm/putForm
   - URL/HTTP method는 반드시 csp-was 컨트롤러 확인 후 구현

3. lib/hooks/use-{module}.ts
   - Keys Factory: all > lists > list(params) > details > detail(id)
   - useQuery: queryKey + queryFn
   - useMutation: mutationFn + onSuccess invalidateQueries

4. app/(modules)/{module}/
   - page.tsx (목록: DataTable + 필터 + 페이지네이션)
   - [id]/page.tsx (상세: InfoPanel + 탭)
   - [id]/edit/page.tsx (수정)
   - new/page.tsx (등록)
   - _components/{module}-form.tsx
```

---

## 2. 현재 구현 완료 현황 (v2 기준)

### ✅ 완료 모듈 (14개)
| 모듈 | v2 경로 | v1 HTML 수 |
|------|---------|-----------|
| 대시보드 | `app/(modules)/` 루트 | - |
| 작업지시 | `app/(modules)/work-orders/` | 38 |
| 시설관리 | `app/(modules)/facilities/` | 14 |
| 사용자관리 | `app/(modules)/users/` | 11 |
| 고객관리 | `app/(modules)/clients/` | 6 |
| 자재관리 | `app/(modules)/materials/` | 5 |
| 게시판 | `app/(modules)/boards/` | 8 |
| 설정(부분) | `app/(modules)/settings/` | 10/12 (mainDashboard 미구현) |
| 자격증 | `app/(modules)/licenses/` | 7 |
| 순찰/점검 | `app/(modules)/patrols/` | 10 |
| 보고서 | `app/(modules)/reports/` | 14 |
| 현장작업 | `app/(modules)/fieldwork/` | 26 |
| 분석 | `app/(modules)/analysis/` | 18 |
| 마이페이지 | `app/(modules)/mypage/` | 5 |

### ⚠️ 설정 모듈 세부 현황
| 기능 | v1 파일 | v2 상태 |
|------|---------|---------|
| 기본코드 관리 | baseCodeList.html | ✅ settings/page.tsx |
| 청소 분류 | cleaningCategoryList.html | ✅ cleaning-category-tab |
| 청소 대상 | cleaningTargetList.html | ✅ cleaning-target-tab |
| 청소 도구 | cleaningUtilList.html | ✅ cleaning-util-tab |
| 청소 계수 | cleaningConstantList.html | ✅ cleaning-coefficient-tab |
| 설비 분류 | facilityCategoryList.html | ✅ (Phase 4) |
| 표준 설비 | facilityList/Add/Edit/View | ✅ facility-masters/ |
| **대시보드 위젯 설정** | **mainDashboardList.html** | ❌ 미구현 |
| **대시보드 위젯 편집** | **mainDashboardEdit.html** | ❌ 미구현 |

---

## 3. 남은 구현 목록 (전부 구현 대상, 예외 없음)

### Phase A: 설정 완성
| 기능 | v1 파일 | 작업 내용 |
|------|---------|---------|
| 대시보드 위젯 설정 | mainDashboardList.html | 위젯 목록/편집 페이지 |

### Phase B: FMS 보조 모듈
v1에 있고 v2에 없는 상대적으로 단순한 모듈들 (우선순위 순)

| 순서 | 모듈 | v1 경로 | v1 HTML 수 | 주요 기능 |
|------|------|---------|-----------|---------|
| B-1 | 서비스관리 | `service/` | 22 | 업무달력, 근태, 청소BIM, 승인, 업무배정 |
| B-2 | 사이트/장소 | `site/` | 19 | 현장/지역/빌딩/층/구역 관리 |
| B-3 | 센서관리 | `sensor/` | 10 | 센서 목록/상세/등록 |
| B-4 | NFC관리 | `nfc/` | 8 | NFC 태그 등록/관리 |
| B-5 | 지원/문의 | `support/` | 7 | 문의 접수/답변 |
| B-6 | 청구서 | `invoice/` | 6 | 청구서 생성/조회 |
| B-7 | 계정관리 | `account/` | 6 | 계정 고급설정 |
| B-8 | 태그관리 | `tag/` | 5 | 태그 CRUD |
| B-9 | 개인업무 | `personal/` | 5 | 개인 업무 목록 |
| B-10 | 제어시스템 | `control/` | 4 | 설비 제어 명령 |
| B-11 | 작업추적 | `task/` | 2 | 태스크 관리 |
| B-12 | 개인정보 | `privacy/` | 3 | 개인정보 동의/처리 |

### Phase C: BECM (보일러/냉동 설비 관리)
v1 `becm/` 디렉토리 (7개 서브모듈)

| 서브모듈 | v1 경로 | 주요 기능 |
|---------|---------|---------|
| 대시보드 | `becm/dash/` | 설비 현황 대시보드 |
| 성능모니터링 | `becm/pfmc/` | 냉각기/보일러 성능 |
| 에너지분석 | `becm/engy/` | 설비별 에너지 분석 |
| 표준/기준 | `becm/std/` | 기준값 관리 |
| 서비스 | `becm/svc/` | 유지보수 서비스 |
| 리포트 | `becm/rept/` | 설비 리포트 |
| 분석 | `becm/anls/` | 신뢰성/성능 분석 |

### Phase D: BEMS (빌딩 에너지 관리 시스템)
v1 `bems/` 디렉토리 (11개 서브모듈)

| 서브모듈 | v1 경로 | 주요 기능 |
|---------|---------|---------|
| 대시보드 | `bems/dash/` | 에너지 현황 대시보드 |
| 에너지분석 | `bems/engy/` | 에너지 사용/추세 |
| 에너지비용 | `bems/engyCost/` | 비용 분석/시뮬레이션 |
| 설비분석 | `bems/eqp/` | 기기별 에너지 |
| 기준관리 | `bems/std/` | 기준선/벤치마크 |
| 설비제어 | `bems/ecm/` | 에너지 절감 제어 |
| 개수/계측 | `bems/cnt/` | 계측기 데이터 |
| 리포트 | `bems/rept/` | 에너지 리포트 |
| 분석 | `bems/anls/` | 통합 분석 |
| 공통 | `bems/common/` | 공통 컴포넌트 |
| 데모 | `bems/demo/` | 데모 페이지 |

---

## 4. 실행 순서 및 완료 기준

### Phase A: 설정 완성 (1-2일)
**완료 기준:**
- [ ] 대시보드 위젯 설정 목록 페이지 (`settings/dashboard-widgets/page.tsx`)
- [ ] 대시보드 위젯 편집 페이지 (`settings/dashboard-widgets/[id]/edit/page.tsx`)
- [ ] csp-was mainDashboard 컨트롤러 API 연동 확인
- [ ] `npm run build` 통과

### Phase B: FMS 보조 모듈 (3-4주)
**완료 기준 (각 서브모듈별):**
- [ ] v1 해당 HTML 파일 전부 분석 완료
- [ ] csp-was 컨트롤러 API 매핑 완료
- [ ] types/api/hooks 구현 (패턴 일치)
- [ ] 목록/상세/등록/수정 페이지 구현
- [ ] `npm run build` 통과
- [ ] 사이드바 메뉴에 추가됨

**B 단계 순서 고정:** B-1 → B-2 → ... → B-12 (순서 변경 없음)

### Phase C: BECM (3-4주)
**완료 기준:**
- [ ] becm/ 하위 7개 서브모듈 전부 v1 분석 완료
- [ ] 각 서브모듈별 types/api/hooks/pages 구현
- [ ] 실시간 데이터 폴링 구현 (React Query refetchInterval)
- [ ] 차트/그래프 컴포넌트 구현 (Recharts 기반)
- [ ] `npm run build` 통과
- [ ] 사이드바 BECM 섹션 추가

### Phase D: BEMS (6-8주)
**완료 기준:**
- [ ] bems/ 하위 11개 서브모듈 전부 v1 분석 완료
- [ ] 각 서브모듈별 types/api/hooks/pages 구현
- [ ] 실시간 모니터링 (React Query refetchInterval 또는 SSE)
- [ ] 에너지 차트 (Line/Area/Bar - Recharts)
- [ ] 비용 시뮬레이션 계산 로직 구현
- [ ] `npm run build` 통과
- [ ] 사이드바 BEMS 섹션 추가

---

## 5. 각 Phase 진입 전 체크리스트

모든 Phase 시작 전 반드시 확인:
1. csp-web 해당 모듈 HTML 파일 전수 분석
2. csp-was 해당 컨트롤러 Java 파일 API 매핑 문서 작성
3. 기존 유사 모듈 참조 (work-orders, facilities 패턴)
4. `npm run build` 이전 Phase 빌드 통과 확인

---

## 6. 완전 완료 기준 (v2 마이그레이션 종료 조건)

모든 아래 항목이 체크될 때 마이그레이션 완료:
- [ ] Phase A 완료
- [ ] Phase B 완료 (12개 서브모듈)
- [ ] Phase C 완료 (BECM 7개 서브모듈)
- [ ] Phase D 완료 (BEMS 11개 서브모듈)
- [ ] v1(csp-web)의 모든 비즈니스 HTML 파일에 대응하는 v2 페이지 존재
- [ ] `npm run build` 최종 통과
- [ ] 사이드바 메뉴 v1과 동일한 계층 구조 완성

---

## 7. 범위 외 (구현하지 않는 것)

| 항목 | 이유 |
|------|------|
| SheetJS 엑셀 기능 | 복잡도 대비 가치 낮음, 별도 결정 필요 |
| BIM 3D 시각화 | 라이선스/비용 문제 (Three.js/IFC.js vs HOOPS), 별도 결정 필요 |
| Hey API (OpenAPI 자동 생성) | csp-was OpenAPI 스펙 없음 |
| Prisma | 불필요 (csp-was가 DB 담당) |
| 모바일 앱(/m/) 추가 | 기존 모바일 기능 유지, 신규 모듈은 데스크톱 우선 |

---

## 참조 문서
- `docs/task-progress.md` - 전체 Phase 진행 현황
- `V1_DETAILED_MODULE_MAP.md` - v1 모듈별 상세 매핑
- `.claude/CLAUDE.md` - 개발 규칙
- `.claude/rules/` - 코딩/테스트/보안/성능 규칙
- `src/app/(modules)/facilities/` - 표준 구현 패턴 참조
- `/Volumes/jinseok-SSD-1tb/00_insite/csp-was/src/main/java/hdclabs/cspwas/controller/` - API 확인
