# csp-was API 스펙 문서

> Spring Boot REST API 백엔드 | 마이그레이션 대상 및 미구현 엔드포인트 목록

## 목차


### 마이그레이션 완료 (insite-web)

### 미구현 / 추가 검토 필요
- AccountAuditController
- AccountController
- AdminController
- AiChatController
- AnalysisController
- AppController
- AssignmentController
- BemsInvoiceBillController
- BoardController
- BuildingAccountBulkController
- BuildingAccountController
- BuildingFloorController
- BuildingUserGroupController
- ClientController
- CommonController
- ControlController
- DailyWorkAccountController
- DashBoardController
- DutyAdjustmentController
- DutyController
- ExcelDownloadController
- ExternalController
- FacilityController
- FacilityHistoryController
- FaqController
- FileController
- GuestWorkOrderController
- InvoiceController
- LicenseController
- MaterialController
- MyPageController
- NfcRoundController
- NfcRoundTbmController
- NlpWorkOrderController
- OpenController
- OrganizationController
- OwnTaskController
- PatrolController
- PersonalWorkOrderController
- PrivacyController
- PublicApiController
- QnaController
- QrHashController
- ReportController
- ResidentCompanyController
- ServiceController
- ServiceInfoController
- SettingController
- SiteController
- SopController
- SuggestionController
- TagController
- TaskDelegationController
- TemplateController
- TemplateFileController
- TokenController
- UserController
- VocReportController
- WidgetController
- WorkLocationPoiController
- WorkOrderController
- WorkOrderItemController

---

## 마이그레이션 완료 (insite-web)

---

## 미구현 / 추가 검토 필요

### AccountAuditController
**File:** `AccountAuditController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `` | getAccountAudit |

### AccountController
**File:** `AccountController.java`

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

### AdminController
**File:** `AdminController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| POST | `/evict` | evictMenuCache |

### AiChatController
**File:** `AiChatController.java`

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

### AnalysisController
**File:** `AnalysisController.java`

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

### AppController
**File:** `AppController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/open/app/rms` | widget9 |

### AssignmentController
**File:** `AssignmentController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/unassigned` | getUnassignedTasks |
| GET | `/assigned` | getAssignedTasks |
| POST | `` | assignTask |
| DELETE | `` | deleteAssignment |

### BemsInvoiceBillController
**File:** `BemsInvoiceBillController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `` | getInvoiceBills |
| GET | `/level-data-check` | checkLevelData |
| GET | `/{id}` | getInvoiceBillById |
| POST | `` | createInvoiceBill |
| PUT | `` | updateInvoiceBill |
| DELETE | `/{id}` | deleteInvoiceBill |
| GET | `/trgt-yy-list` | getTrgtYyList |

### BoardController
**File:** `BoardController.java`

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

### BuildingAccountBulkController
**File:** `BuildingAccountBulkController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| POST | `/bulk-upload` | bulkUploadBuildingAccountsAsync |
| GET | `/bulk-upload-status/{jobId}` | getJobStatus |
| GET | `/bulk-upload-jobs` | getOngoingJobs |
| DELETE | `/bulk-upload-job/{jobId}` | deleteJob |
| GET | `/template` | downloadTemplate |
| GET | `/download-failures/{jobId}` | downloadFailures |

### BuildingAccountController
**File:** `BuildingAccountController.java`

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

### BuildingFloorController
**File:** `BuildingFloorController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/site/buildingFloor/{buildingId}` | getSiteBuildingFloorList |
| POST | `/api/site/buildingFloor` | postSiteBuildingFloor |
| PUT | `/api/site/buildingFloor` | editSiteBuildingFloor |
| DELETE | `/api/site/buildingFloor/{buildingFloorId}` | deleteSiteBuildingFloor |
| GET | `/api/site/buildingFloorZone/{buildingFloor}` | getSiteBuildingFloorZoneList |
| POST | `/api/site/buildingFloorZone` | postSiteBuildingFloorZone |
| DELETE | `/api/site/buildingFloorZone/{buildingFloorZoneId}` | deleteSiteBuildingFloorZone |

### BuildingUserGroupController
**File:** `BuildingUserGroupController.java`

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

### ClientController
**File:** `ClientController.java`

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

### CommonController
**File:** `CommonController.java`

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

### ControlController
**File:** `ControlController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/control/controlList` | getControl |
| GET | `/api/control/controlView/{id}` | getControlInfo |
| POST | `/api/control/controlAdd` | addControl |
| PUT | `/api/control/controlEdit` | editControl |
| PUT | `/api/control/sendRequest` | sendRequest |
| PUT | `/api/control/cancelRequest` | cancelRequest |
| DELETE | `/api/control/deleteRequest/{id}` | deleteRequest |

### DailyWorkAccountController
**File:** `DailyWorkAccountController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| POST | `` | createDailyWorkAccount |
| GET | `` | findBuildingDailyWorkAccounts |
| PATCH | `` | updateDailyWorkAccount |
| GET | `/duplicated` | checkDuplicate |
| GET | `/duty` | findDailyWorkAccountDuties |

### DashBoardController
**File:** `DashBoardController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/dashBoard/widgetList` | widgetList |

### DutyAdjustmentController
**File:** `DutyAdjustmentController.java`

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

### DutyController
**File:** `DutyController.java`

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

### ExcelDownloadController
**File:** `ExcelDownloadController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/duty` | streamNdjson |

### ExternalController
**File:** `ExternalController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/external/reqCarInfo` | reqCarInfo |

### FacilityController
**File:** `FacilityController.java`

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

### FacilityHistoryController
**File:** `FacilityHistoryController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/{id}` | getFacilityHistory |
| POST | `` | createFacilityHistory |
| PUT | `` | updateFacilityHistory |
| POST | `/work-orders` | updateWorkOrderFacility |
| GET | `/work-orders` | searchCcWorkOrders |
| DELETE | `/work-orders/{id}` | deleteWorkOrderFacility |

### FaqController
**File:** `FaqController.java`

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

### FileController
**File:** `FileController.java`

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

### GuestWorkOrderController
**File:** `GuestWorkOrderController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/complainList/{buildingId}` | getComplainList |
| GET | `/viewComplain/{id}` | getComplainView |
| POST | `/addComplain` | addComplain |
| POST | `/complain/{id}/validate` | validatePassword |

### InvoiceController
**File:** `InvoiceController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/invoice/index` | index |
| GET | `/api/invoice/serviceChargeList` | getServiceCharges |
| POST | `/api/invoice/serviceChargeAdd` | postServiceCharge |
| GET | `/api/invoice/serviceChargeView/{id}` | getServiceChargeView |
| PUT | `/api/invoice/serviceChargeEdit` | putServiceCharge |
| DELETE | `/api/invoice/serviceChargeEdit/{id}` | deleteServiceCharge |

### LicenseController
**File:** `LicenseController.java`

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
**File:** `MaterialController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/material/materialList` | getMaterialList |
| GET | `/api/material/materialView/{id}` | getMaterial |
| GET | `/api/material/existMaterial/{buildingFloorZoneId}/{name}` | existMaterial |
| POST | `/api/material/materialAdd` | addMaterial |
| POST | `/api/material/materialEdit` | editMaterial |
| DELETE | `/api/material/materialDelete/{id}` | deleteMaterial |
| POST | `/api/material/materialStock` | addMaterialStock |

### MyPageController
**File:** `MyPageController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/mypage/myServiceChargeList` | getMyServiceChargeList |
| GET | `/api/mypage/myServiceChargeView` | getMyServiceChargeView |
| GET | `/api/mypage/myInfoView` | getMyInfoView |
| PUT | `/api/mypage/myInfoEdit` | editUser |

### NfcRoundController
**File:** `NfcRoundController.java`

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

### NfcRoundTbmController
**File:** `NfcRoundTbmController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/{id}` | getNfcRoundTbm |
| POST | `` | createNfcRoundTbm |
| PUT | `` | updateNfcRoundTbm |
| GET | `/execute-plans` | getNfcRoundTbmExecutePlans |

### NlpWorkOrderController
**File:** `NlpWorkOrderController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| POST | `/api/nlp/async-work-order` | asyncNlpWorkOrder |

### OpenController
**File:** `OpenController.java`

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

### OrganizationController
**File:** `OrganizationController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `` | getOrganizationList |
| GET | `/{id}` | getOrganization |
| POST | `` | createOrganization |
| PUT | `` | updateOrganization |
| DELETE | `/{id}` | deleteOrganization |

### OwnTaskController
**File:** `OwnTaskController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `type=own` | findOwnTasks |
| GET | `type=confirm` | findConfirmTasks |
| POST | `/confirm` | confirmTasks |

### PatrolController
**File:** `PatrolController.java`

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

### PersonalWorkOrderController
**File:** `PersonalWorkOrderController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| POST | `type=create` | createPersonalWorkOrder |
| POST | `type=confirm` | confirmPersonalWorkOrder |
| POST | `type=update` | updatePersonalWorkOrder |
| GET | `/{id}` | findById |
| GET | `` | findPersonalWorkOrders |

### PrivacyController
**File:** `PrivacyController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `api/privacy/policyView` | getPrivacy |
| POST | `api/privacy/policyEdit` | editPrivacy |
| DELETE | `api/privacy/policyEdit` | privacyDelete |

### PublicApiController
**File:** `PublicApiController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/guest/work-orders` | getPublicWorkOrder |
| GET | `/api/guest/work-orders/{buildingId}` | getPublicWorkOrder |
| GET | `/api/guest/facilityList` | getPublicFacility |
| GET | `/api/guest/facilityList/{buildingId}` | getPublicFacility |
| GET | `/api/guest/buildingInfoList` | getPublicBuilding |
| GET | `/api/guest/buildingInfoList/{buildingId}` | getPublicBuilding |

### QnaController
**File:** `QnaController.java`

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

### QrHashController
**File:** `QrHashController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/expand/{hashKey}` | expandQrData |

### ReportController
**File:** `ReportController.java`

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

### ResidentCompanyController
**File:** `ResidentCompanyController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/site/rentalList` | getResidentCompanys |
| POST | `/api/site/rentalAdd` | postResidentCompany |
| GET | `/api/site/rentalView/{id}` | getResidentCompanyView |
| PUT | `/api/site/rentalEdit` | putResidentCompany |
| DELETE | `/api/site/rentalEdit/{id}` | deleteResidentCompany |
| GET | `/api/site/buildingFloor/{buildingId}/available` | findAvailableFloorOptions |
| GET | `/api/site/room/{floorId}/available` | findAvailableRoomOptions |

### ServiceController
**File:** `ServiceController.java`

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

### ServiceInfoController
**File:** `ServiceInfoController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `` | getAllServices |
| GET | `/menus` | getMenuTree |

### SettingController
**File:** `SettingController.java`

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

### SiteController
**File:** `SiteController.java`

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

### SopController
**File:** `SopController.java`

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

### SuggestionController
**File:** `SuggestionController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/api/elasticsearch/autocomplete` | autocomplete |
| POST | `/open/reindex` | reindexAll |

### TagController
**File:** `TagController.java`

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

### TaskDelegationController
**File:** `TaskDelegationController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/tasks/charge` | getTasksWithRetiredWorker |
| GET | `/tasks/approve` | getTasksWithRetiredWorkerApprove |
| GET | `/accounts/charge` | getBuildingUserGroupAccounts |
| GET | `/accounts/approve` | getBuildingUserGroupApproveAccounts |
| POST | `/retire` | retireAndDelegate |
| POST | `/unassign-building` | unassignAndDelegate |

### TemplateController
**File:** `TemplateController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| POST | `` | createWorkOrderTemplate |
| GET | `/{id}` | getWorkOrderTemplate |
| GET | `` | getWorkOrderTemplates |
| PUT | `` | updateWorkOrderTemplate |
| DELETE | `/{id}` | deleteWorkOrderTemplate |

### TemplateFileController
**File:** `TemplateFileController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/template/{id}` | getTemplateFile |
| GET | `/template/download/{id}` | getTemplateFileDownload |
| DELETE | `/template/{id}` | deleteTemplateFile |

### TokenController
**File:** `TokenController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| POST | `/token` | getGuestToken |

### UserController
**File:** `UserController.java`

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

### VocReportController
**File:** `VocReportController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/download` | downloadVocReport |
| GET | `/exists` | checkReportExists |
| GET | `/available-months` | getAvailableYearMonths |

### WidgetController
**File:** `WidgetController.java`

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

### WorkLocationPoiController
**Base URL:** `/api/poi`  
**File:** `WorkLocationPoiController.java`

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

### WorkOrderController
**File:** `WorkOrderController.java`

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

### WorkOrderItemController
**File:** `WorkOrderItemController.java`

| HTTP | Path | 메서드명 |
|------|------|--------|
| GET | `/tbm-targets/{tbmTargetId}/items` | getWorkOrderItemsByTbmTarget |

---

## 통계
- **총 컨트롤러:** 62
- **총 엔드포인트:** 681
- **마이그레이션 완료:** 0
- **미구현:** 62

