/**
 * 작업지시 Mock 데이터
 */

import type { WorkOrderListDTO } from "@/lib/types/work-order";
import { WorkOrderState, WorkOrderType, WorkOrderActionType } from "@/lib/types/work-order";

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length] as T;
}

const buildings = [
  { id: 1, name: "강남파이낸스센터", address: "서울 강남구 테헤란로 152", companyId: 1, companyName: "HDC랩스" },
  { id: 2, name: "서울스퀘어", address: "서울 중구 한강대로 416", companyId: 1, companyName: "HDC랩스" },
  { id: 3, name: "삼성타워", address: "서울 강남구 삼성로 212", companyId: 2, companyName: "삼성물산" },
  { id: 4, name: "파르나스타워", address: "서울 강남구 테헤란로 521", companyId: 2, companyName: "삼성물산" },
  { id: 5, name: "롯데월드타워", address: "서울 송파구 올림픽로 300", companyId: 3, companyName: "롯데자산개발" },
];

const writers = [
  { id: 1, name: "김철수", userId: "kim.cs", company: "HDC랩스", role: "시설팀장" },
  { id: 2, name: "이영희", userId: "lee.yh", company: "HDC랩스", role: "현장관리자" },
  { id: 3, name: "박민준", userId: "park.mj", company: "삼성물산", role: "설비기사" },
  { id: 4, name: "최수정", userId: "choi.sj", company: "삼성물산", role: "전기기사" },
  { id: 5, name: "정대호", userId: "jung.dh", company: "롯데자산개발", role: "현장관리자" },
];

const firstClasses = [
  { id: 1, name: "전기설비" },
  { id: 2, name: "기계설비" },
  { id: 3, name: "소방설비" },
  { id: 4, name: "건축" },
];

const secondClasses = [
  { id: 101, name: "배전반점검", category: "정기점검" },
  { id: 102, name: "조명교체", category: "유지보수" },
  { id: 201, name: "공조기청소", category: "정기점검" },
  { id: 202, name: "냉각수교체", category: "유지보수" },
  { id: 301, name: "스프링클러점검", category: "법정점검" },
  { id: 302, name: "화재감지기교체", category: "유지보수" },
  { id: 401, name: "외벽점검", category: "정기점검" },
];

const workNames = [
  "B1층 배전반 정기점검",
  "옥상 공조기 필터 청소",
  "지하 1층 소화전 점검",
  "로비 조명 LED 교체",
  "냉각탑 순환수 수질 검사",
  "비상발전기 부하시험",
  "승강기 안전점검",
  "옥상 방수층 균열 확인",
  "주차장 환기팬 점검",
  "변압기 절연저항 측정",
  "화재감지기 작동 시험",
  "급수펌프 압력 점검",
  "CCTV 카메라 렌즈 교체",
  "보안등 점등 상태 점검",
  "전력량계 검침 및 확인",
  "냉동기 냉매 보충",
  "스프링클러 헤드 점검",
  "자동문 작동 상태 확인",
  "UPS 배터리 용량 점검",
  "옥내소화전 방수 시험",
];

const descriptions = [
  "연간 정기점검 계획에 따른 작업 수행",
  "노후 장비 교체 및 기능 개선",
  "법정 의무 점검 수행",
  "민원 발생에 따른 긴급 조치",
  "예방 정비 차원에서의 사전 점검",
];

type StatedEntry = {
  state: WorkOrderState;
  count: number;
};

const stateDistribution: StatedEntry[] = [
  { state: WorkOrderState.WRITE, count: 8 },
  { state: WorkOrderState.ISSUE, count: 10 },
  { state: WorkOrderState.PROCESSING, count: 15 },
  { state: WorkOrderState.REQ_COMPLETE, count: 8 },
  { state: WorkOrderState.COMPLETE, count: 7 },
  { state: WorkOrderState.CANCEL, count: 2 },
];

const stateNames: Record<WorkOrderState, string> = {
  WRITE: "작성",
  ISSUE: "발행",
  PROCESSING: "처리중",
  REQ_COMPLETE: "완료요청",
  COMPLETE: "완료",
  CANCEL: "취소",
};

const typesList = [WorkOrderType.GENERAL, WorkOrderType.GENERAL, WorkOrderType.TBM, WorkOrderType.ALARM];
const typeNames: Record<WorkOrderType, string> = {
  GENERAL: "일반",
  TBM: "정기",
  ALARM: "긴급",
};

function makeDateOffset(daysAgo: number, variation: number = 0): string {
  const d = new Date("2026-02-23");
  d.setDate(d.getDate() - daysAgo + variation);
  return d.toISOString().slice(0, 10);
}

function makeActionDate(type: WorkOrderActionType, id: number, idx: number): import("@/lib/types/work-order").WorkOrderActionDateDTO {
  const actor = pick(writers, idx);
  return {
    id,
    type,
    workOrderActionDate: makeDateOffset(50 - idx, 0),
    actorAccountId: actor.id,
    actorAccountName: actor.name,
    actorAccountCompanyName: actor.company,
    actorAccountRoleName: actor.role,
  };
}

let globalId = 1;

function buildWorkOrder(state: WorkOrderState, idx: number): WorkOrderListDTO {
  const building = pick(buildings, idx);
  const writer = pick(writers, idx);
  const firstClass = pick(firstClasses, idx);
  const secondClass = pick(secondClasses, idx);
  const type = pick(typesList, idx);
  const workName = pick(workNames, idx);
  const description = pick(descriptions, idx);
  const woId = globalId++;

  const workOrderDTO: WorkOrderListDTO["workOrderDTO"] = {
    id: woId,
    name: workName,
    firstClassId: firstClass.id,
    firstClassName: firstClass.name,
    secondClassId: secondClass.id,
    secondClassName: secondClass.name,
    secondClassCategoryName: secondClass.category,
    type,
    typeName: typeNames[type],
    tbmType: null,
    autoConfirm: false,
    movieLinkUrl: null,
    planStartDate: makeDateOffset(30 - idx),
    planEndDate: makeDateOffset(20 - idx),
    deadline: 7,
    reqCompleteDate: makeDateOffset(15 - idx),
    doneDate: state === WorkOrderState.COMPLETE ? makeDateOffset(10) : null,
    description,
    state,
    stateName: stateNames[state],
    stateStyle: "inProgress",
    buildingUserGroupId: 10 + (idx % 5),
    buildingUserGroupName: `${building.name} 시설팀`,
    sendPush: true,
    vocSendPush: false,
    autoIssued: false,
    writerId: writer.id,
    writerName: writer.name,
    writerCompanyName: writer.company,
    writerRoleName: writer.role,
    writerUserId: writer.userId,
    writeDate: makeDateOffset(60 - idx),
    lastModifierId: writer.id,
    lastModifierName: writer.name,
    lastModifierCompanyName: writer.company,
    lastModifierRoleName: writer.role,
    lastModifierUserId: writer.userId,
    lastModifyDate: makeDateOffset(40 - idx),
    buildingId: building.id,
    buildingName: building.name,
    buildingFloorId: 100 + (idx % 10),
    buildingFloorName: `${(idx % 20) + 1}층`,
    buildingFloorZoneId: 200 + (idx % 5),
    buildingFloorZoneName: `A구역`,
    facilityId: 300 + idx,
    facilityName: `시설-${idx + 1}`,
    templateId: 0,
    workOrderFileDTOs: [],
    workOrderResultDTOs: [],
    workOrderChargeAccountDTOs: [],
    workOrderCcAccountDTOs: [],
    workOrderApproveAccountDTOs: [],
    workOrderActionDateDTOs: [],
  };

  const writeDTO = makeActionDate(WorkOrderActionType.WRITE, woId * 10 + 1, idx);
  const issueDTO =
    state !== WorkOrderState.WRITE
      ? makeActionDate(WorkOrderActionType.ISSUE, woId * 10 + 2, idx)
      : null;
  const startDTO =
    ([WorkOrderState.PROCESSING, WorkOrderState.REQ_COMPLETE, WorkOrderState.COMPLETE] as WorkOrderState[]).includes(state)
      ? makeActionDate(WorkOrderActionType.START, woId * 10 + 3, idx)
      : null;
  const doneDTO =
    ([WorkOrderState.REQ_COMPLETE, WorkOrderState.COMPLETE] as WorkOrderState[]).includes(state)
      ? makeActionDate(WorkOrderActionType.DONE, woId * 10 + 4, idx)
      : null;
  const reqCompleteDTO =
    state === WorkOrderState.REQ_COMPLETE
      ? makeActionDate(WorkOrderActionType.REQ_COMPLETE, woId * 10 + 5, idx)
      : null;
  const approveDTO =
    state === WorkOrderState.COMPLETE
      ? makeActionDate(WorkOrderActionType.APPROVE, woId * 10 + 6, idx)
      : null;
  const cancelDTO =
    state === WorkOrderState.CANCEL
      ? makeActionDate(WorkOrderActionType.CANCEL, woId * 10 + 7, idx)
      : null;

  return {
    workOrderDTO,
    buildingDTO: building,
    workOrderWriteUserDateDTO: writeDTO,
    workOrderIssueUserDateDTO: issueDTO,
    workOrderViewUserDateDTO: null,
    workOrderStartUserDateDTO: startDTO,
    workOrderDoneUserDateDTO: doneDTO,
    workOrderReqCompleteUserDateDTO: reqCompleteDTO,
    workOrderApproveUserDateDTO: approveDTO,
    workOrderRejectUserDateDTO: null,
    workOrderCancelUserDateDTO: cancelDTO,
  };
}

const orders: WorkOrderListDTO[] = [];
let idx = 0;

for (const { state, count } of stateDistribution) {
  for (let i = 0; i < count; i++) {
    orders.push(buildWorkOrder(state, idx));
    idx++;
  }
}

export const mockWorkOrders: WorkOrderListDTO[] = orders satisfies WorkOrderListDTO[];
