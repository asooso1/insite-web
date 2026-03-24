# csp-was 백엔드 API 스펙

> **목적:** AI 에이전트가 insite-web 모듈 구현 시 올바른 API 엔드포인트를 빠르게 찾기 위한 참조 문서
> **대상 시스템:** csp-was (Spring Boot REST API)
> **호출 클라이언트:** insite-web (Next.js 15) — `apiClient` 경유
> **최종 업데이트:** 2026-03-24
> **총 컨트롤러:** 62 | **총 엔드포인트:** 681+

---

## 이 문서 사용법

### AI 에이전트용 의사결정 트리

```
1. 구현할 모듈의 도메인 파악
   └→ 아래 "도메인별 API 맵" 목차에서 해당 섹션으로 이동

2. 해당 도메인 섹션에서 컨트롤러 확인
   └→ 각 컨트롤러의 Base URL, 엔드포인트 테이블 확인

3. 엔드포인트 선택 후 구현
   └→ API 공통 규칙 (인증, buildingId 주입, body 형식) 적용
   └→ insite-web 기존 API 파일 패턴 참조: src/lib/api/{module}.ts
```

### 도메인 빠른 색인

| # | 도메인 | 컨트롤러 수 | 주요 키워드 |
|---|--------|------------|-----------|
| 1 | [인증/계정](#1-인증계정-도메인) | 4 | 로그인, 토큰, 비밀번호, 마이페이지 |
| 2 | [작업관리(FMS)](#2-작업관리fms-도메인) | 8 | 작업지시, SOP, 템플릿, 민원, 개인작업, NLP |
| 3 | [시설/빌딩](#3-시설빌딩-도메인) | 5 | 시설, 빌딩, 층/구역, 관제점, 시설이력 |
| 4 | [사용자/조직](#4-사용자조직-도메인) | 6 | 사용자, 역할, 조직, 사용자그룹, 빌딩계정, 업무위임 |
| 5 | [게시판/커뮤니케이션](#5-게시판커뮤니케이션-도메인) | 4 | 공지, 자료실, QnA, FAQ |
| 6 | [보고서/분석](#6-보고서분석-도메인) | 3 | 월간/주간/일일 보고서, FMS/RMS/EMS 트렌드, VOC |
| 7 | [BEMS/에너지](#7-bems에너지-도메인) | 2 | 설비, 에너지, 알람, 제어, 분석, 청구서 |
| 8 | [BECM/설비성능](#8-becm설비성능-도메인) | 0 (v1 전용) | 설비분류, 냉매, 성능진단, 프로젝트 |
| 9 | [현장작업](#9-현장작업-도메인) | 7 | 근태, 근무, 순찰, 청소, 입주사, 인보이스, 개인업무 |
| 10 | [센서/제어/태그](#10-센서제어태그-도메인) | 5 | NFC 순회, TBM, 태그, QR, 제어 |
| 11 | [인프라/공통](#11-인프라공통-도메인) | 8 | 파일, 공통코드, 위젯, 설정, 검색, 대시보드 |
| 12 | [외부/공개](#12-외부공개-도메인) | 4 | 공개API, 게스트, 앱, 외부연동 |

---

## 통계 요약

| 항목 | 수치 |
|------|------|
| 총 컨트롤러 | 62 |
| 총 엔드포인트 | 681+ |
| insite-web 구현 완료 모듈 | ~25개 API 파일 |
| 미구현 도메인 | BEMS, BECM (Phase 미정) |

---

## API 공통 규칙

### 인증

| 경로 패턴 | 인증 | 비고 |
|-----------|------|------|
| `/api/*` | Bearer 토큰 필수 | `apiClient`가 자동 주입 |
| `/open/*` | 인증 불필요 | 공개 엔드포인트 |

### buildingId 주입

`apiClient` (`src/lib/api/client.ts`)가 자동으로 현재 선택된 빌딩 ID를 쿼리 파라미터로 주입한다.

- 예외 경로: `/api/auth/*`, `/api/buildings/*`, `/api/services/*`, 외부 URL
- `buildingId=0` → 파라미터 생략 (전체 빌딩 모드)
- 수동으로 buildingId를 추가하지 말 것

### Request Body 형식

| HTTP 메서드 | 기본 형식 | 비고 |
|------------|----------|------|
| GET | 쿼리스트링 | `URLSearchParams` 사용 |
| POST/PUT | JSON body | `apiClient.post/put` |
| POST/PUT (파일 포함) | FormData | `apiClient.postForm/putForm` |
| DELETE | 경로 파라미터 | `/api/xxx/{id}` |

### 엔드포인트 테이블 범례

- `(+N개)` = 원본 컨트롤러에 추가 엔드포인트 N개 존재 (컨트롤러 소스 확인 필요)
- Base URL이 명시된 경우, Path 열의 값은 Base URL에 이어붙임

---

## 도메인별 API 맵

---

### 1. 인증/계정 도메인

> **insite-web 구현 상태:** 구현 완료 — `src/lib/api/client.ts`, `src/app/api/auth/`
> 로그인/로그아웃/토큰 갱신/마이페이지 모두 구현됨

#### AccountController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/account/{id}` | getAccount |
| PUT | `/account/{id}` | editAccount |
| DELETE | `/account/{id}` | deleteAccount |
| POST | `/account` | createAccount |
| POST | `/api/account/login` | authorize |
| PUT | `/api/account/changePassword` | changePassword |
| GET | `/api/account/findId` | findId |
| PUT | `/api/account/token` | changeToken |
| PATCH | `/api/account/privacy` | agreePrivacy |
| PUT | `/open/account/viewAllBuildings` | toggleViewAllBuildings |

#### TokenController

| HTTP | Path | 메서드명 |
|------|------|--------|
| POST | `/token` | getGuestToken |

#### MyPageController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/mypage/myServiceChargeList` | getMyServiceChargeList |
| GET | `/api/mypage/myServiceChargeView` | getMyServiceChargeView |
| GET | `/api/mypage/myInfoView` | getMyInfoView |
| PUT | `/api/mypage/myInfoEdit` | editUser |

#### AccountAuditController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `` | getAccountAudit |

---

### 2. 작업관리(FMS) 도메인

> **insite-web 구현 상태:** 핵심 구현 완료
> 구현 완료: 작업지시(`work-order.ts`), SOP(`sop.ts`), 민원(`complain.ts`), 개인작업(`personal-work-order.ts`), TBM(`tbm.ts`), 현장작업지시(`field-work-order.ts`)
> 미구현: NLP 자동 작업지시, 작업배정(Assignment)

#### WorkOrderController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/workOrder/index` | index |
| GET | `/api/workOrder/workOrderList` | getWorkOrder |
| GET | `/open/workOrder/workOrderStatePerCount` | getWorkOrderStatePerCount |
| PUT | `/api/workOrder/updateMultiApprove` | updateMultiApprove |
| PUT | `/api/workOrder/updateMultiCancel` | updateMultiCancel |
| POST | `/api/workOrder/addOrderAndItems` | addOrderAndItems |
| POST | `/api/workOrder/addOrder` | orderAdd |
| POST | `/api/workOrder/addOrderIncident` | orderAddIncident |
| PUT | `/api/workOrder/addOrder` | imsiOrderAdd |
| POST | `/api/workOrder/addOrderItem/{addType}` | addOrderItem |
| PUT | `/api/workOrder/updateOrderItem` | orderItemUpdate |
| DELETE | `/api/workOrder/deleteOrderItem/{workOrderItemId}` | orderItemDelete |
| GET | `/api/workOrder/orderView/{type}/{id}` | getWorkOrder |
| GET | `/api/workOrder/orderView/{id}` | getWorkOrderAndTbm |
| GET | `/api/workOrder/getOrderItemList/{workOrderId}` | getOrderItemListDTOs |
| GET | `/api/workOrder/getOrderItemListDTO/{workOrderItemId}` | getOrderItemListDTO |
| GET | `/api/workOrder/modal/workOrderItemSearch` | workOrderItemSearch |
| PUT | `/api/workOrder/updateWorkOrderItemEstimateUseCnt` | updateEstimateUseCnt |
| DELETE | `/api/workOrder/deleteOrderItemMaterial/{workOrderItemId}/{materialId}` | orderItemMaterialDelete |
| DELETE | `/api/workOrder/deleteOrderItemSop/{workOrderItemId}/{sopId}` | orderItemSopDelete |
| ... | ... | (+30개) |

#### WorkOrderItemController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/tbm-targets/{tbmTargetId}/items` | getWorkOrderItemsByTbmTarget |

#### SopController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/workOrder/commonSopList` | getCommonSopList |
| POST | `/api/workOrder/commonSopAdd` | addSopCommon |
| GET | `/api/workOrder/commonSopView/{id}` | getSopCommon |
| PUT | `/api/workOrder/commonSopEdit` | updateSopCommon |
| GET | `/api/workOrder/sopList` | getSopList |
| POST | `/api/workOrder/sopAdd` | addSop |
| GET | `/api/workOrder/sopView/{id}` | getSop |
| GET | `/api/workOrder/sopView/{sopType}/{id}` | getSop |
| GET | `/api/workOrder/sopWorkOrderList` | getSopWorkOrderList |
| PUT | `/api/workOrder/sopEdit` | updateSop |

#### TemplateController

| HTTP | Path | 메서드명 |
|------|------|--------|
| POST | `` | createWorkOrderTemplate |
| GET | `/{id}` | getWorkOrderTemplate |
| GET | `` | getWorkOrderTemplates |
| PUT | `` | updateWorkOrderTemplate |
| DELETE | `/{id}` | deleteWorkOrderTemplate |

#### TemplateFileController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/template/{id}` | getTemplateFile |
| GET | `/template/download/{id}` | getTemplateFileDownload |
| DELETE | `/template/{id}` | deleteTemplateFile |

#### PersonalWorkOrderController

| HTTP | Path | 메서드명 |
|------|------|--------|
| POST | `type=create` | createPersonalWorkOrder |
| POST | `type=confirm` | confirmPersonalWorkOrder |
| POST | `type=update` | updatePersonalWorkOrder |
| GET | `/{id}` | findById |
| GET | `` | findPersonalWorkOrders |

#### AssignmentController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/unassigned` | getUnassignedTasks |
| GET | `/assigned` | getAssignedTasks |
| POST | `` | assignTask |
| DELETE | `` | deleteAssignment |

#### NlpWorkOrderController

| HTTP | Path | 메서드명 |
|------|------|--------|
| POST | `/api/nlp/async-work-order` | asyncNlpWorkOrder |

---

### 3. 시설/빌딩 도메인

> **insite-web 구현 상태:** 핵심 구현 완료
> 구현 완료: 시설(`facility.ts`), 빌딩(`building.ts`), 빌딩 층/구역(빌딩 내)
> 참고: 관제점(ControlPoint) 관련 엔드포인트는 FacilityController에 포함

#### FacilityController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/facility/index` | index |
| GET | `/api/facility/facilityList/{buildingId}` | getFacilityList |
| GET | `/api/facility/facilityList` | getFacilityList |
| GET | `/api/facility/facilityControlPointList/{controlPointId}` | facilityControlPointList |
| GET | `/api/facility/facilityListExcelDownload` | getFacilityListExelDownload |
| GET | `/api/facility/facilityView/{id}` | getFacility |
| GET | `/api/facility/workOrderList` | getFacilityWorkOrderList |
| GET | `/api/facility/facilityNos/{buildingId}` | getFacilityNos |
| POST | `/api/facility/addFacility` | addFacility |
| PUT | `/api/facility/updateFacility` | updateFacility |
| POST | `/api/facility/uploadFacilityExcel` | uploadFacilityExcel |
| GET | `/api/facility/controlPointList` | getControlPointListDTOs |
| GET | `/api/facility/controlPointView/{controlPointId}` | getControlPointListDTO |
| GET | `/api/facility/controlPointList/{buildingId}` | getControlPointListDTOByBuildingId |
| GET | `/api/facility/controlPointListAtOrderView/{buildingId}` | getControlPointListDTOAtOrderViewByBuildingId |
| POST | `/api/facility/addControlPoint` | addControlPoint |
| PUT | `/api/facility/updateControlPoint` | updateControlPoint |
| POST | `/api/facility/addControlPointBatch/{buildingId}` | addControlPointBatch |
| GET | `/api/facility/getFacilityTreeForControlPoint` | getFacilityTreeForControlPoint |
| GET | `/api/facility/getControlPointListForMapping/{buildingId}/{facilityId}` | getControlPointListForMapping |
| ... | ... | (+4개) |

#### FacilityHistoryController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/{id}` | getFacilityHistory |
| POST | `` | createFacilityHistory |
| PUT | `` | updateFacilityHistory |
| POST | `/work-orders` | updateWorkOrderFacility |
| GET | `/work-orders` | searchCcWorkOrders |
| DELETE | `/work-orders/{id}` | deleteWorkOrderFacility |

#### SiteController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/site/buildingList` | getSiteBuildingList |
| GET | `/api/site/buildingDTOList` | getSiteBuildingDTOList |
| GET | `/api/site/buildingListExcelDownload` | getSiteBuildingListExcelDownload |
| GET | `/api/site/buildingView/{id}` | getSiteBuildingView |
| POST | `/api/site/buildingAdd` | postSiteBuildingAdd |
| POST | `/api/site/buildingEdit` | siteBuildingEdit |
| PUT | `/api/site/buildingEdit` | siteBuildingEditNearByRange |
| DELETE | `/api/site/buildingDelete/{id}` | deleteSiteBuilding |
| POST | `/api/site/building/upload-files` | uploadOrganFiles |

#### BuildingFloorController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/site/buildingFloor/{buildingId}` | getSiteBuildingFloorList |
| POST | `/api/site/buildingFloor` | postSiteBuildingFloor |
| PUT | `/api/site/buildingFloor` | editSiteBuildingFloor |
| DELETE | `/api/site/buildingFloor/{buildingFloorId}` | deleteSiteBuildingFloor |
| GET | `/api/site/buildingFloorZone/{buildingFloor}` | getSiteBuildingFloorZoneList |
| POST | `/api/site/buildingFloorZone` | postSiteBuildingFloorZone |
| DELETE | `/api/site/buildingFloorZone/{buildingFloorZoneId}` | deleteSiteBuildingFloorZone |

#### WorkLocationPoiController

**Base URL:** `/api/poi`

| HTTP | Path | 메서드명 |
|------|------|--------|
| POST | `` | createPoi |
| PUT | `/{id}` | updatePoi |
| DELETE | `/{id}` | deletePoi |
| GET | `/{id}` | getPoi |
| GET | `/building/{buildingId}` | getPoiByBuilding |
| GET | `/building/{buildingId}/type/{poiType}` | getPoiByBuildingAndType |
| PUT | `/{id}/status` | togglePoiStatus |
| GET | `/types` | getPoiTypes |
| GET | `/project/{projectId}` | getPoiByProject |

---

### 4. 사용자/조직 도메인

> **insite-web 구현 상태:** 핵심 구현 완료
> 구현 완료: 사용자(`user.ts`), 역할(`role.ts`), 빌딩계정(빌딩 설정 내), 사용자그룹(빌딩 설정 내)
> 미구현: 조직(OrganizationController), 빌딩계정 일괄업로드(Bulk)

#### UserController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/user/userList` | getUserList |
| GET | `/api/user/userRoleList` | getUserRoleList |
| GET | `/api/user/userView` | getUser |
| POST | `/api/user/userAdd` | saveUser |
| PUT | `/api/user/userEdit` | editUser |
| PUT | `/api/user/userEdit/password` | resetUserPassword |
| DELETE | `/api/user/userEdit` | userDelete |
| GET | `/api/user/userListExcelDownload` | userListExelDownload |
| GET | `/api/user/userAdd/isUserId` | isUserId |
| GET | `/open/user/roleList` | getRoleList |
| GET | `/open/user/roleList/v2` | getRoleListV2 |
| GET | `/api/user/roleDTOList` | getRoleDTOList |
| GET | `/open/user/userRoleList` | getUserRoleList |
| GET | `/api/user/userAdd/role-list` | getUserAddRoleList |
| GET | `/api/user/allMenuAuths/{roleId}` | allMenuAuths |
| GET | `/api/user/roleMenuAuths/{roleId}` | getRoleMenuAuths |
| PUT | `/api/user/updateRoleState` | updateRoleState |
| PUT | `/api/user/roleAuthEdit` | updateRoleAuth |
| POST | `/api/user/erp-sync` | syncErpUser |

#### OrganizationController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `` | getOrganizationList |
| GET | `/{id}` | getOrganization |
| POST | `` | createOrganization |
| PUT | `` | updateOrganization |
| DELETE | `/{id}` | deleteOrganization |

#### BuildingUserGroupController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/site/userGroupList` | getSiteUserGroupList |
| GET | `/api/site/userGroupView/{id}` | getSiteUserGroupView |
| GET | `/api/site/buildingUserGroup/{id}` | getSiteBuildingUserGroup |
| GET | `/api/site/buildingUserGroupView` | getSiteBuildingUserGroupView |
| POST | `/api/site/buildingUserGroup` | postSiteBuildingUserGroup |
| PUT | `/api/site/buildingUserGroup` | putSiteBuildingUserGroup |
| DELETE | `/api/site/buildingUserGroup/{id}` | deleteSiteBuildingUserGroup |
| GET | `/api/site/buildingUserGroups/{buildingId}` | getSiteBuildingUserGroups |
| GET | `/api/site/buildingUserGroup/{buildingId}/unassigned` | getUnassignedAccounts |

#### BuildingAccountController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/site/configUserList` | getSiteConfigUserList |
| POST | `/api/site/buildingAccount` | postSiteBuildingAccount |
| PUT | `/api/site/buildingAccount` | putSiteBuildingAccount |
| DELETE | `/api/site/buildingAccount/{buildingAccountId}` | deleteSiteBuildingAccount |
| GET | `/api/site/buildingAccount/{buildingId}` | getBuildingAccountList |
| POST | `/api/site/buildingAccount/v2` | postSiteBuildingAccountWithUser |
| PUT | `/api/site/buildingAccount/v2` | putSiteBuildingAccountWithUser |
| GET | `/api/site/buildingAccount/buildings` | getSiteConfigUserListV2 |
| GET | `/api/site/admins` | getSiteAdmins |

#### BuildingAccountBulkController

| HTTP | Path | 메서드명 |
|------|------|--------|
| POST | `/bulk-upload` | bulkUploadBuildingAccountsAsync |
| GET | `/bulk-upload-status/{jobId}` | getJobStatus |
| GET | `/bulk-upload-jobs` | getOngoingJobs |
| DELETE | `/bulk-upload-job/{jobId}` | deleteJob |
| GET | `/template` | downloadTemplate |
| GET | `/download-failures/{jobId}` | downloadFailures |

#### TaskDelegationController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/tasks/charge` | getTasksWithRetiredWorker |
| GET | `/tasks/approve` | getTasksWithRetiredWorkerApprove |
| GET | `/accounts/charge` | getBuildingUserGroupAccounts |
| GET | `/accounts/approve` | getBuildingUserGroupApproveAccounts |
| POST | `/retire` | retireAndDelegate |
| POST | `/unassign-building` | unassignAndDelegate |

---

### 5. 게시판/커뮤니케이션 도메인

> **insite-web 구현 상태:** 구현 완료
> 구현 완료: 게시판(`board.ts`), QnA(`qna.ts`), FAQ(`faq.ts`)

#### BoardController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/board/noticeList` | getNoticeList |
| POST | `/api/board/addNotice` | addNotice |
| GET | `/api/board/noticeView/{id}` | getNotice |
| PUT | `/api/board/editNotice` | updateNotice |
| DELETE | `/api/board/deleteNotice/{id}` | deleteNotice |
| POST | `/api/board/addComment/{noticeId}` | addNotice |
| PATCH | `/api/board/editComment/{commentId}` | updateComment |
| DELETE | `/api/board/deleteComment/{commentId}` | deleteComment |
| GET | `/api/board/dataList` | getDataList |
| POST | `/api/board/addData` | addReferenceData |
| GET | `/api/board/dataView/{id}` | getReferenceData |
| PUT | `/api/board/editData` | updateReferenceData |
| DELETE | `/api/board/deleteData/{id}` | deleteData |

#### QnaController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/qna/questionList/{accountId}` | getQuestionList |
| GET | `/api/qna/questionList` | getQuestionList |
| POST | `/api/qna/addQuestion` | addQuestion |
| POST | `/api/qna/editQuestion` | updateQuestion |
| DELETE | `/api/qna/deleteQuestion/{id}` | deleteQuestion |
| GET | `/open/file/question/{questionId}/file/{fileId}` | getQuestionFile |
| DELETE | `/api/qna/deleteQuestionFile/{fileId}` | deleteQuestionFiles |
| GET | `/api/qna/{questionId}` | getQna |
| POST | `/api/qna/addAnswer` | addAnswer |
| POST | `/api/qna/editAnswer` | updateAnswer |
| DELETE | `/api/qna/deleteAnswer/{id}` | deleteAnswer |
| GET | `/open/file/answer/{answerId}/file/{fileId}` | getAnswerFile |
| DELETE | `/api/qna/deleteAnswerFile/{fileId}` | deleteAnswerFiles |

#### FaqController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/faq/getMenuPage/{id}` | getMenuPage |
| GET | `/open/file/faq/pdf/{id}` | getMenuPdf |
| POST | `/api/faq/addMenuVideo/{id}` | addMenuVideo |
| POST | `/api/faq/addMenuPdf/{id}` | uploadMenuPdf |
| DELETE | `/api/faq/deleteMenuPdf/{id}` | deleteMenuPdf |
| GET | `/api/faq/menus` | getAllMenus |
| GET | `/api/faq/faqList` | getFaqList |
| GET | `/api/faq/getFaq/{id}` | getFaq |
| POST | `/api/faq/addFaq` | addFaq |
| POST | `/api/faq/editFaq` | updateFaq |
| DELETE | `/api/faq/deleteFaq/{id}` | deleteFaq |
| GET | `/open/file/faq/{faqId}/file/{fileId}` | getFaqFile |
| DELETE | `/api/faq/deleteFaqFile/{fileId}` | deleteFaqFiles |

#### PrivacyController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `api/privacy/policyView` | getPrivacy |
| POST | `api/privacy/policyEdit` | editPrivacy |
| DELETE | `api/privacy/policyEdit` | privacyDelete |

---

### 6. 보고서/분석 도메인

> **insite-web 구현 상태:** 핵심 구현 완료
> 구현 완료: 보고서(`report.ts`), 분석(`analysis.ts`)
> 미구현: VOC 보고서 다운로드

#### ReportController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/report/reportMonthList` | getReportMonthList |
| GET | `/api/report/reportWeekList` | getReportWeekList |
| GET | `/api/report/workLogList` | getWorkLogList |
| GET | `/api/report/reportMonthInfo/{reportMonthlyId}/{reportPageType}` | findReportMonthInfo |
| GET | `/api/report/reportWeekInfo/{weeklyReportId}/{reportPageType}` | findReportWeekInfo |
| GET | `/api/report/reportWorkLogInfo/{dailyReportId}/{reportPageType}` | findReportWorkLogInfo |
| GET | `/api/reportMonthTab/building/{buildingId}/{reportYearMonth}/{reportTabType}` | findReportMonthTabAdd |
| GET | `/api/reportWeekTab/building/{buildingId}/{reportDateFrom}/{reportDateTo}/{reportTabType}` | findReportWeekTabAdd |
| GET | `/api/reportWorkLogTab/building/{buildingId}/{reportDate}/{reportTabType}` | findReportWorkLogTabAdd |
| GET | `/api/reportMonthTab/json/{monthlyReportId}/{reportTabType}` | findMonthlyReportTab |
| GET | `/api/reportWeekTab/json/{weeklyReportId}/{reportTabType}` | findWeeklylyReportTab |
| GET | `/api/reportWorkLogTab/json/{dailyReportId}/{reportTabType}` | findWorkLogReportTab |
| POST | `/api/report/reportMonth` | addMonthlyReport |
| POST | `/api/report/reportWeek` | addWeeklylyReport |
| POST | `/api/report/workLog` | addWorkLogReport |
| PUT | `/api/report/reportMonth` | saveMonthlyReport |
| PUT | `/api/report/reportWeek` | saveWeeklylyReport |
| PUT | `/api/report/workLog` | saveWorkLogReport |
| DELETE | `/api/report/reportMonth/{reportId}` | deleteMonthlyReport |
| DELETE | `/api/report/reportWeek/{reportId}` | deleteWeeklylyReport |
| ... | ... | (+4개) |

#### AnalysisController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/analysis/fmsTeam` | fmsTeam |
| GET | `/api/analysis/fmsLabor` | fmsLabor |
| GET | `/api/analysis/fmsItemHistory` | fmsItemHistory |
| GET | `/api/analysis/rms` | rms |
| GET | `/api/analysis/trendControlPoint/{controlPointId}` | fmsTrend |
| GET | `/api/analysis/fmsTrendList` | fmsTrendList |
| GET | `/api/analysis/trendAnalysisFMS` | trendAnalysisFMS |
| GET | `/api/analysis/trendFMS` | trendFMS |
| POST | `/api/analysis/saveTrendFMS` | saveTrendFMS |
| POST | `/api/analysis/deleteTrendFMS` | deleteTrendFMS |
| GET | `/api/analysis/rmsTrendList` | rmsTrendList |
| GET | `/api/analysis/trendAnalysisRMS` | trendAnalysisRMS |
| GET | `/api/analysis/trendRMS` | trendRMS |
| POST | `/api/analysis/saveTrendRMS` | saveTrendRMS |
| POST | `/api/analysis/deleteTrendRMS` | deleteTrendRMS |
| GET | `/api/analysis/emsTrendList` | emsTrendList |
| GET | `/api/analysis/trendAnalysisEMS` | trendAnalysisEMS |
| GET | `/api/analysis/trendEMS` | trendEMS |
| POST | `/api/analysis/saveTrendEMS` | saveTrendEMS |
| POST | `/api/analysis/deleteTrendEMS` | deleteTrendEMS |
| ... | ... | (+12개) |

#### VocReportController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/download` | downloadVocReport |
| GET | `/exists` | checkReportExists |
| GET | `/available-months` | getAvailableYearMonths |

---

### 7. BEMS/에너지 도메인

> **insite-web 구현 상태:** 미구현 (Phase 미정)
> 별도 v1 API (`/api/v1/` 접두사) — BEMS(건물에너지관리시스템)용 엔드포인트
> 62개 컨트롤러 목록에 포함되지 않은 v1 전용 API 다수 존재

#### BemsInvoiceBillController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `` | getInvoiceBills |
| GET | `/level-data-check` | checkLevelData |
| GET | `/{id}` | getInvoiceBillById |
| POST | `` | createInvoiceBill |
| PUT | `` | updateInvoiceBill |
| DELETE | `/{id}` | deleteInvoiceBill |
| GET | `/trgt-yy-list` | getTrgtYyList |

#### BEMS v1 API (컨트롤러 미상 — v1 엔드포인트 일괄)

| HTTP | Path | 비고 |
|------|------|------|
| GET | `/api/bems/` | BEMS 목록 |
| GET | `/api/bems/eqpVirtPrmtList` | 설비 가상 파라미터 목록 |
| GET | `/api/v1/eqp/NodeTreeList` | 장비 노드 트리 |
| GET | `/api/v1/eqp/nodePrmtTreeList` | 노드 파라미터 트리 |
| GET | `/api/v1/eqp/eqpVirtPrmtList` | 설비 가상 파라미터 목록 |
| GET | `/api/v1/eqp/eqpVirtPrmtPopList` | 설비 가상 파라미터 팝업 목록 |
| GET | `/api/v1/eqp/eqpFmlaList` | 설비 공식 목록 |
| GET | `/api/v1/eqp/eqpChrtSetupList` | 설비 차트 설정 목록 |
| GET | `/api/v1/engy/dataList` | 에너지 데이터 목록 |
| GET | `/api/v1/engy/engyUseDataList` | 에너지 사용 데이터 목록 |
| GET | `/api/v1/engy/prdtDataList` | 생산 데이터 목록 |
| GET | `/api/v1/engy/engyPrmtDataLineList` | 에너지 파라미터 데이터 라인 |
| GET | `/api/v1/engy/alamEqpStatusList` | 알람 설비 상태 목록 |
| GET | `/api/v1/engy/alamHistList` | 알람 이력 목록 |
| GET | `/api/v1/cnt/autoCntList` | 자동 제어 목록 |
| GET | `/api/v1/cnt/ctrlOsvtList` | 제어 관찰 목록 |
| GET | `/api/v1/cnt/alamPrmtList` | 알람 파라미터 목록 |
| GET | `/api/v1/anls/anlsEqpAirCprsList` | 분석 설비 공기압축기 |
| GET | `/api/v1/anls/anlsEqpHeatList` | 분석 설비 열 목록 |
| GET | `/api/v1/anls/anlsEqpTherList` | 분석 설비 온도 목록 |
| GET | `/api/v1/anls/anlsEqpWaterList` | 분석 설비 물 목록 |
| GET | `/api/v1/anls/anlsBaselineModlList` | 분석 기준선 모델 목록 |
| GET | `/api/v1/anls/anlsHeatStorSystemList` | 분석 축열 시스템 목록 |
| GET | `/api/v1/anls/anlsOperSchdMgmtList` | 분석 운영 스케줄 관리 |
| GET | `/api/v1/anls/anlsPrpitToPlanList` | 분석 실적-계획 목록 |
| GET | `/api/v1/anls/baseLineMethdMgmtList` | 기준선 방법 관리 목록 |
| GET | `/api/v1/anls/engyFloorList` | 에너지 층 목록 |
| GET | `/api/v1/anls/engyWellRateList` | 에너지 우물 비율 목록 |
| GET | `/api/v1/anls/planDataMgmtList` | 계획 데이터 관리 목록 |
| GET | `/api/v1/engycost/engyCostPlanList` | 에너지 비용 계획 목록 |
| GET | `/api/v1/goal/baseLineEsmMgmtList` | 목표 기준선 ESM 관리 |
| GET | `/api/v1/invoice/billList` | 청구서 목록 |
| GET | `/api/v1/rept/reptDataList` | 보고서 데이터 목록 |
| GET | `/api/v1/std/stdCdGrpList` | 표준 코드 그룹 목록 |
| GET | `/api/v1/std/stdEqpList` | 표준 설비 목록 |
| GET | `/api/v1/std/eqpList` | 설비 목록 |
| GET | `/api/v1/demo/demoList` | 데모 목록 |

---

### 8. BECM/설비성능 도메인

> **insite-web 구현 상태:** 미구현 (Phase 미정)
> 별도 v1 API — BECM(건물설비성능진단)용 엔드포인트
> 컨트롤러 소스 미확인 (v1 모듈 별도 패키지)

#### BECM v1 API (컨트롤러 미상 — v1 엔드포인트 일괄)

| HTTP | Path | 비고 |
|------|------|------|
| GET | `/api/v1/std/eqpCatMngList` | 설비 분류 관리 목록 |
| GET | `/api/v1/std/eqpMngList` | 설비 관리 목록 |
| GET | `/api/v1/std/mtrlMngList` | 재료 관리 목록 |
| GET | `/api/v1/std/rfgrMngList` | 냉매 관리 목록 |
| GET | `/api/v1/std/steamDataMngList` | 증기 데이터 관리 목록 |
| GET | `/api/v1/engy/eqpNodeList` | 설비 노드 목록 |
| GET | `/api/v1/engy/eqpEditList` | 설비 편집 목록 |
| GET | `/api/v1/engy/engyEffDriveList` | 에너지 효율 드라이브 목록 |
| GET | `/api/v1/pfmc/getPfmcList` | 성능 관리 목록 |
| GET | `/api/v1/svc/projList` | 프로젝트 목록 |
| GET | `/api/v1/svc/savnMethList` | 절감 방법 목록 |
| GET | `/api/v1/svc/econRvewList` | 경제성 검토 목록 |
| GET | `/api/v1/svc/ipvmProjList` | IPVM 프로젝트 목록 |
| GET | `/api/v1/serv/servTechList` | 서비스 기술 목록 |
| GET | `/api/v1/anls/billList` | 청구서 목록 |
| GET | `/api/v1/anls/billUpdtList` | 청구서 업데이트 목록 |
| GET | `/api/eqp/eqpVirtPrmtPopList` | 설비 가상 파라미터 팝업 목록 |

---

### 9. 현장작업 도메인

> **insite-web 구현 상태:** 핵심 구현 완료
> 구현 완료: 근태(`service-attendance.ts`, `field-attendance.ts`), 근무(`duty.ts`), 입주사(`rental.ts`), 인보이스(`invoice.ts`), 개인업무(`personal-work-order.ts`), 청소(`cleaning.ts`)
> 미구현: 일일근무자(DailyWorkAccount), 근무조정(DutyAdjustment), 엑셀다운로드(ExcelDownload), 개인업무(OwnTask)

#### ServiceController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/service/rmsList` | rmsList |
| GET | `/api/service/checkNewAlarm/{checkInterval}/{lastId}` | checkNewAlarm |
| GET | `/api/service/cleaningBimView/{id}` | findCleanInfo |
| GET | `/api/service/cleanInfoList` | findCleanInfoList |
| GET | `/open/service/cleanCategory` | findCleanCategory |
| POST | `/api/service/cleaningBimAdd` | saveCleaningData |
| PUT | `/api/service/cleaningBimEdit` | editCleaningData |
| DELETE | `/api/service/cleaningBimDel/{cleanInfoId}` | deleteCleaningData |
| GET | `/api/service/cleaningCompareSite/{cleanInfoIds}` | cleaningCompareSite |
| GET | `/api/clean/modeling/{cleanInfoId}` | getCleanModeling |
| GET | `/api/service/attendanceDay` | getAttendanceDay |
| GET | `/api/service/attendanceDayAdmin` | getAttendanceDayAdmin |
| GET | `/api/service/attendanceDayAdminExcelDownload` | getAttendanceDayAdminExcel |
| POST | `/api/service/setLogInOutManual` | setLogInOutManual |
| GET | `/api/service/getReason/{inputReasonType}/{buildingAccountAttendanceId}` | getReason |
| GET | `/api/service/attendanceUser` | getAttendanceUser |
| GET | `/api/service/getMonthSchedule` | getMonthSchedule |
| GET | `/api/service/workCalendar` | getWorkCalendar |
| GET | `/api/service/getSchedule` | getSchedule |
| PUT | `/api/service/updateSchedule/{updateType}` | updateSchedule |
| ... | ... | (+6개) |

#### DutyController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `` | findDuties |
| POST | `` | register |
| PUT | `` | updateDutyType |
| GET | `/duplicated` | checkDuplicate |
| GET | `/accounts` | findAccountDuties |
| GET | `/accounts` | findDailyAccountDuties |
| POST | `/accounts` | assignDuties |
| POST | `/accounts/v2` | assignDutiesV2 |
| PUT | `/accounts` | updateAssignedDuty |
| DELETE | `/accounts` | deleteDutyAccounts |
| DELETE | `/accounts/bulk` | deleteDutyAccountsBulk |
| POST | `/check-in` | startTodayDuty |
| POST | `/check-out` | endTodayDuty |
| PATCH | `type=reason` | updateReason |
| GET | `/anomalies` | listForSite |
| GET | `/anomalies/{accountDutyId}` | getAnomalyDetail |

#### DutyAdjustmentController

| HTTP | Path | 메서드명 |
|------|------|--------|
| POST | `` | createAdjustment |
| GET | `/{id}` | findAdjustment |
| PATCH | `` | updateAdjustment |
| DELETE | `/{id}` | deleteAdjustment |
| POST | `{id}/approve` | approveAdjustment |
| POST | `/reject` | rejectAdjustment |
| POST | `/supplement` | requestSupplement |
| GET | `` | listForHq |

#### DailyWorkAccountController

| HTTP | Path | 메서드명 |
|------|------|--------|
| POST | `` | createDailyWorkAccount |
| GET | `` | findBuildingDailyWorkAccounts |
| PATCH | `` | updateDailyWorkAccount |
| GET | `/duplicated` | checkDuplicate |
| GET | `/duty` | findDailyWorkAccountDuties |

#### OwnTaskController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `type=own` | findOwnTasks |
| GET | `type=confirm` | findConfirmTasks |
| POST | `/confirm` | confirmTasks |

#### ResidentCompanyController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/site/rentalList` | getResidentCompanys |
| POST | `/api/site/rentalAdd` | postResidentCompany |
| GET | `/api/site/rentalView/{id}` | getResidentCompanyView |
| PUT | `/api/site/rentalEdit` | putResidentCompany |
| DELETE | `/api/site/rentalEdit/{id}` | deleteResidentCompany |
| GET | `/api/site/buildingFloor/{buildingId}/available` | findAvailableFloorOptions |
| GET | `/api/site/room/{floorId}/available` | findAvailableRoomOptions |

#### InvoiceController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/invoice/index` | index |
| GET | `/api/invoice/serviceChargeList` | getServiceCharges |
| POST | `/api/invoice/serviceChargeAdd` | postServiceCharge |
| GET | `/api/invoice/serviceChargeView/{id}` | getServiceChargeView |
| PUT | `/api/invoice/serviceChargeEdit` | putServiceCharge |
| DELETE | `/api/invoice/serviceChargeEdit/{id}` | deleteServiceCharge |

---

### 10. 센서/제어/태그 도메인

> **insite-web 구현 상태:** 구현 완료
> 구현 완료: NFC 순회(`nfc-round.ts`), 태그(`tag.ts`), 제어(`control.ts`)
> 미구현: QR 해시(QrHashController)

#### NfcRoundController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/forms` | getNfcRoundForms |
| GET | `/issues` | getNfcRoundIssues |
| GET | `/{id}` | getNfcRoundDetail |
| PUT | `` | updateNfcRound |
| GET | `/categories` | getNfcRoundCategories |
| GET | `/categories/items` | getNfcRoundCategoryItems |
| GET | `/not-possible/{nfcRoundId}` | getNotPossibleResults |
| POST | `/work-orders` | createWorkOrders |

#### NfcRoundTbmController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/{id}` | getNfcRoundTbm |
| POST | `` | createNfcRoundTbm |
| PUT | `` | updateNfcRoundTbm |
| GET | `/execute-plans` | getNfcRoundTbmExecutePlans |

#### TagController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/tag/tagList` | getResidentCompanys |
| POST | `/api/tag/tagCreateNFCQR` | postQrNfc |
| PUT | `/api/tag/tagView` | putQrNfc |
| GET | `/api/tag/tagView/{id}` | getQrNfcView |
| DELETE | `/api/tag/tagView/{id}` | deleteQrNfc |
| GET | `/api/tag/downloadQr/floor/{buildingId}` | downloadBuildingQrZip |
| GET | `/api/tag/downloadQr/zone/{buildingFloorId}` | downloadBuildingFloorQrZip |
| GET | `/api/tag/downloadQr/facility` | downloadFacilityQrZip |
| GET | `/api/tag/downloadQr/floor/single/{buildingFloorId}` | downloadBuildingFloorSingleQr |
| GET | `/api/tag/downloadQr/zone/single/{buildingFloorZoneId}` | downloadBuildingFloorZoneSingleQr |
| GET | `/api/tag/downloadQr/facility/single` | downloadBuildingFloorZoneSingleQr |

#### ControlController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/control/controlList` | getControl |
| GET | `/api/control/controlView/{id}` | getControlInfo |
| POST | `/api/control/controlAdd` | addControl |
| PUT | `/api/control/controlEdit` | editControl |
| PUT | `/api/control/sendRequest` | sendRequest |
| PUT | `/api/control/cancelRequest` | cancelRequest |
| DELETE | `/api/control/deleteRequest/{id}` | deleteRequest |

#### QrHashController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/expand/{hashKey}` | expandQrData |

---

### 11. 인프라/공통 도메인

> **insite-web 구현 상태:** 핵심 구현 완료
> 구현 완료: 메뉴(`menu.ts`), 대시보드/위젯(`dashboard.ts`), 설정(`setting.ts`), 알림(`notification.ts`), 고객사(`company.ts`), 클라이언트(`client.ts`)
> 미구현: AiChat, 관리자 캐시(AdminController), Suggestion/검색

#### CommonController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/common/client` | get |
| GET | `/api/common/menuList` | getMenuList |
| GET | `/api/common/siteUserList` | siteUserList |
| GET | `/api/common/siteAdminList/{buildingId}` | siteAdminList |
| GET | `/api/common/siteLabsAdminList` | siteLabsAdminList |
| GET | `/api/common/clientToSite` | clientSiteList |
| GET | `/api/common/userToSite` | userSiteList |
| GET | `/api/common/facilityMasterList` | facilityMasterList |
| GET | `/api/common/materialList` | materialList |
| GET | `/api/common/complainList` | complainList |
| GET | `/api/common/siteFacility` | siteFacilityList |
| GET | `/api/common/controlPoint` | controlPointList |
| GET | `/api/common/licenseList` | licenseList |
| GET | `/open/common/searchCommonList` | searchCommonList |

#### FileController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/open/file/clientLogo/{id}` | getClientLogo |
| GET | `/open/file/clientLogo/download/{id}` | getClientLogoDownload |
| DELETE | `/open/file/clientLogo/{id}` | deleteClientLogo |
| GET | `/open/file/license/{id}` | getLicense |
| DELETE | `/open/file/license/{id}` | deleteLicenseFile |
| GET | `/open/file/facilityMaster/image/{id}` | getFacilityMasterImage |
| GET | `/open/file/facilityMaster/download/{id}` | getFacilityMasterDownload |
| DELETE | `/open/file/facilityMaster/{id}` | deleteFacilityMasterImage |
| GET | `/open/file/building/image/{id}` | getBuildingImage |
| GET | `/open/file/building/download/{id}` | getBuildingDownload |
| DELETE | `/open/file/building/{id}` | deleteBuilding |
| GET | `/open/file/cleanInfoScs/download/{id}` | getCleanInfoScsDownload |
| DELETE | `/open/file/buildingBim/{id}` | deleteBuildingBim |
| GET | `/open/file/buildingFloor/filename/{id}` | getBuildingFloorFile |
| GET | `/open/file/buildingFloor/image/{id}` | getBuildingFloorImage |
| GET | `/open/file/buildingFloor/pdf/{id}` | getBuildingFloorPdf |
| POST | `/open/file/buildingFloor` | addBuildingFloorFile |
| DELETE | `/open/file/buildingFloor/{id}` | deleteBuildingFloor |
| GET | `/open/file/buildingFloorZone/filename/{id}` | getBuildingFloorZoneFile |
| GET | `/open/file/buildingFloorZone/image/{id}` | getBuildingFloorZoneImage |
| ... | ... | (+43개) |

#### WidgetController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/widget/wideAreaGeoJson` | wideAreaGeoJson |
| GET | `/widget/widget1/buildings` | widget1Buildings |
| GET | `/widget/widget2` | widget1 |
| GET | `/widget/widget3/{state}` | widget3 |
| GET | `/widget/widget4` | widget4 |
| GET | `/widget/widget5` | widget5 |
| GET | `/widget/widget6` | widget6 |
| GET | `/widget/widget7` | widget7 |
| GET | `/widget/widget8/{noticeType}` | widget8 |
| GET | `/widget/widget9` | widget9 |
| GET | `/widget/checkNewAlarm/{checkInterval}/{lastId}` | checkNewAlarm |
| GET | `/widget/widget10` | widget10 |
| GET | `/widget/widget11` | widget11 |
| GET | `/widget/widget12/chart1` | widget12Chart1 |
| GET | `/widget/widget12/chart2` | widget12Chart2 |
| GET | `/widget/widget13/{depth}/{state}/{parentId}` | widget13 |
| GET | `/widget/widget14/{depth}/{parentId}` | widget14 |
| GET | `/widget/widget15` | widget15 |
| GET | `/widget/widget16` | widget16 |
| GET | `/widget/widget17/{depth}/{parentId}` | widget17 |
| ... | ... | (+24개) |

#### SettingController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/setting/configGroupList` | configGroupList |
| GET | `/api/setting/config/{configId}` | config |
| GET | `/api/setting/facilityCategoryTreeList` | facilityCategoryTreeList |
| GET | `/api/setting/facilityCategoryTreeList/first` | facilityCategoryTreeListFirst |
| GET | `/api/setting/facilityCategoryTreeList/second` | facilityCategoryTreeListSecond |
| GET | `/api/setting/facilityCategoryTreeList/third` | facilityCategoryTreeListThird |
| GET | `/api/setting/getFacilityCategory/{id}` | getFacilityCategory |
| POST | `/api/setting/addFacilityCategory` | addFacilityCategory |
| PUT | `/api/setting/updateFacilityCategory` | updateFacilityCategory |
| PUT | `/api/setting/config` | editConfig |
| GET | `/api/setting/facilityList` | settingFacilityList |
| GET | `/api/setting/facilityView` | settingFacilityView |
| POST | `/api/setting/facilityAdd` | settingFacilityAdd |
| PUT | `/api/setting/facilityEdit` | settingFacilityEdit |
| POST | `/api/setting/facilityCopy/{id}` | settingFacilityCopy |
| GET | `/api/setting/cleaningCategoryTreeList` | cleaningCategoryTreeList |
| POST | `/api/setting/cleaningCategoryAdd` | addCleaningCategory |
| PUT | `/api/setting/cleaningCategoryEdit` | updateCleaningCategory |
| GET | `/api/setting/cleaningCoefficientList` | cleaningCoefficientList |
| POST | `/api/setting/cleaningCoefficientAdd` | addCleaningCoefficient |
| ... | ... | (+9개) |

#### DashBoardController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/dashBoard/widgetList` | widgetList |

#### ClientController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/client/clientView/{id}` | clientView |
| GET | `/api/client/clientList` | getClientList |
| GET | `/api/client/clientListExelDownload` | clientListExelDownload |
| GET | `/api/client/clientAdd/isBusinessNo` | businessNoDuplicate |
| POST | `/api/client/clientAdd` | saveClient |
| PUT | `/api/client/clientEdit` | editClient |
| DELETE | `/api/client/clientDelete` | deleteClient |
| POST | `/api/client/clientBaseArea` | saveBaseArea |
| PUT | `/api/client/clientBaseArea` | editBaseAreaState |

#### AdminController

| HTTP | Path | 메서드명 |
|------|------|--------|
| POST | `/evict` | evictMenuCache |

#### AiChatController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/sessions` | getSessions |
| GET | `/sessions/{sid}` | getSessionDetail |
| PATCH | `/sessions/{sid}` | updateSessionTitle |
| DELETE | `/sessions/{sid}` | deleteSession |
| POST | `/ask` | askQuestion |
| GET | `/model` | getModelInfo |
| POST | `/switch_model` | switchModel |
| POST | `/rebuild` | rebuildIndex |
| GET | `/stats` | getStats |
| GET | `/page_image` | getPageImage |

#### SuggestionController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/elasticsearch/autocomplete` | autocomplete |
| POST | `/open/reindex` | reindexAll |

#### ExcelDownloadController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/duty` | streamNdjson |

---

### 12. 외부/공개 도메인

> **insite-web 구현 상태:** 부분 구현
> 구현 완료: 고객사/빌딩 공개 조회(`company.ts`)
> 참고: OpenController는 인증 없이 접근 가능한 공통 데이터 조회 API 모음

#### OpenController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/open/companyList/{companyId}/{companyName}` | companyListWithName |
| GET | `/open/companyList` | companyList |
| GET | `/open/companyList/{companyId}` | companyList |
| GET | `/open/baseArea/baseAreaList/{companyId}` | getBaseAreaUsing |
| GET | `/open/baseArea/baseAreaList/{companyId}` | getBaseAreaAll |
| GET | `/open/building/buildingListByBaseArea/{companyId}/{baseAreaId}` | getBuildingListByCompanyIdAndBaseAreaId |
| GET | `/open/building/buildingListByWideArea/{companyId}/{wideAreaId}` | getBuildingListByCompanyIdAndWideAreaId |
| GET | `/open/building/buildingList/{companyId}` | getBuildingList |
| GET | `/open/building/building/{buildingId}` | getBuilding |
| GET | `/open/building/buildingFloorList/{buildingId}` | getBuildingFloorList |
| GET | `/open/building/buildingFloorZoneList/{buildingFloorId}` | getBuildingFloorZoneList |
| GET | `/open/wideArea/wideAreaList` | getWideAreaList |
| GET | `/open/common/wideAreaGeoJson` | wideAreaGeoJson |
| GET | `/open/common/regionGroup` | regionGroup |
| GET | `/open/setting/facilityCategoryList/{parentId}` | getFacilityCategoryList |
| GET | `/open/facilityCategory/firstFacilityCategoryList` | getFirstFacilityCategoryList |
| GET | `/open/facilityCategory/secondFacilityCategoryList/{parentId}` | getSecondFacilityCategoryList |
| GET | `/open/facilityCategory/thirdFacilityCategoryList/{parentId}` | getThirdFacilityCategoryList |
| GET | `/open/facilityCategory/checkCodeDuplicate/{mode}/{facilityCateogyrId}/{categoryCode}` | checkCodeDuplicate |
| GET | `/open/facilityMaster/facilityMasterDTOsForUpload` | getFacilityMasterDTOsForUpload |
| ... | ... | (+28개) |

#### PublicApiController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/guest/work-orders` | getPublicWorkOrder |
| GET | `/api/guest/work-orders/{buildingId}` | getPublicWorkOrder |
| GET | `/api/guest/facilityList` | getPublicFacility |
| GET | `/api/guest/facilityList/{buildingId}` | getPublicFacility |
| GET | `/api/guest/buildingInfoList` | getPublicBuilding |
| GET | `/api/guest/buildingInfoList/{buildingId}` | getPublicBuilding |

#### GuestWorkOrderController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/complainList/{buildingId}` | getComplainList |
| GET | `/viewComplain/{id}` | getComplainView |
| POST | `/addComplain` | addComplain |
| POST | `/complain/{id}/validate` | validatePassword |

#### AppController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/open/app/rms` | widget9 |

#### ExternalController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/external/reqCarInfo` | reqCarInfo |

#### ServiceInfoController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `` | getAllServices |
| GET | `/menus` | getMenuTree |

---

## 추가 모듈 (도메인 분류 외 독립 컨트롤러)

아래 모듈은 insite-web에서 API 파일이 존재하나, 위 62개 컨트롤러 목록에서 별도 섹션으로 분류되지 않은 항목이다. 해당 API 함수의 실제 엔드포인트는 `src/lib/api/{module}.ts` 파일 참조.

| insite-web API 파일 | 주요 사용 컨트롤러 | 비고 |
|---------------------|------------------|------|
| `license.ts` | LicenseController | 자격증/면허 관리 |
| `material.ts` | MaterialController | 자재 관리 |
| `patrol.ts` | PatrolController | 순찰 관리 |

### LicenseController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/license/modal/licenseViewer` | getLicenseViewer |
| GET | `/api/license/licenseView` | getLicenseView |
| GET | `/api/license/licenseEdit` | getLicenseEdit |
| GET | `/api/license/licenseList` | getLicenseList |
| GET | `/api/license/licenseListExcelDownload` | getLicenseListExcelDownload |
| GET | `/api/license/licenseUserList` | getLicenseUserList |
| GET | `/api/license/licenseAdd/licenseNo` | licenseNoDuplicate |
| POST | `/api/license/licenseAdd` | saveUser |
| PUT | `/api/license/licenseStateEdit` | licenseStateEdit |
| PUT | `/api/license/licenseEdit` | licenseEdit |

### MaterialController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/material/materialList` | getMaterialList |
| GET | `/api/material/materialView/{id}` | getMaterial |
| GET | `/api/material/existMaterial/{buildingFloorZoneId}/{name}` | existMaterial |
| POST | `/api/material/materialAdd` | addMaterial |
| POST | `/api/material/materialEdit` | editMaterial |
| DELETE | `/api/material/materialDelete/{id}` | deleteMaterial |
| POST | `/api/material/materialStock` | addMaterialStock |

### PatrolController

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/patrol/patrolList` | patrolList |
| GET | `/api/patrol/modal/patrolTeamList` | patrolTeamList |
| GET | `/api/patrol/getPatrolTeam/{teamId}` | getPatrolTeamAccount |
| POST | `/api/patrol/postPatrolPlan` | postPatrolPlan |
| GET | `/api/patrol/patrolPlan/{patrolPlanId}` | patrolPlan |
| PUT | `/api/patrol/putPatrolPlan` | putPatrolPlan |
| DELETE | `/api/patrol/deletePatrolPlanBuilding/{patrolPlanBuildingId}` | deletePatrolPlanBuilding |
| DELETE | `/api/patrol/deletePatrolPlanAccount/{patrolPlanId}/{accountId}` | deletePatrolPlanAccount |
| PUT | `/api/patrol/completePatrol/{patrolPlanBuildingId}` | completePatrol |
| GET | `/api/patrol/patrolTeamList` | patrolTeamList |
| POST | `/api/patrol/postPatrolTeam` | postPatrolTeam |
| PUT | `/api/patrol/putPatrolTeam` | putPatrolTeam |
| DELETE | `/api/patrol/deletePatrolTeamBuilding/{patrolTeamId}/{buildingId}` | deletePatrolTeamBuilding |
| DELETE | `/api/patrol/deletePatrolTeamAccount/{patrolTeamId}/{accountId}` | deletePatrolTeamAccount |
