/**
 * 공지사항 Mock 데이터
 */

import type { NoticeListDTO, NoticeDTO } from "@/lib/types/board";

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length] as T;
}

function makeDateOffset(daysAgo: number): string {
  const d = new Date("2026-02-23");
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function makeDateTimeOffset(daysAgo: number): string {
  const d = new Date("2026-02-23");
  d.setDate(d.getDate() - daysAgo);
  d.setHours(9 + (daysAgo % 8), (daysAgo * 7) % 60, 0, 0);
  return d.toISOString();
}

const titles = [
  "[필독] 2026년 소방시설 법정점검 일정 안내",
  "강남파이낸스센터 엘리베이터 정기점검 예정 공지",
  "서울스퀘어 냉각탑 청소 작업 완료 보고",
  "2026년 1분기 에너지 사용량 현황 보고",
  "비상발전기 정기 부하시험 결과 안내",
  "삼성타워 옥상 방수 공사 안내",
  "파르나스타워 냉방설비 정비 작업 일정",
  "롯데월드타워 변압기 절연저항 측정 결과",
  "[공지] 2026년 하절기 에너지 절감 방안",
  "전기설비 정기점검 및 절연저항 측정 결과 공유",
  "소화설비 자체점검 계획서 제출 안내",
  "2026년 안전관리계획 수립 안내",
  "시설 관리 시스템 업데이트 안내",
  "동절기 동파 예방 점검 실시 안내",
  "건물 에너지 효율 1등급 인증 취득 보고",
  "[긴급] 강남파이낸스센터 수도관 동파 긴급 보수",
  "2025년 연간 시설관리 실적 보고",
  "승강기 법정검사 일정 안내",
  "환경부 실내공기질 측정 결과 공유",
  "시설 안전점검의 날 운영 계획 안내",
];

const writers = [
  { id: 1, name: "김철수", userId: "kim.cs", company: "HDC랩스", role: "시설팀장" },
  { id: 2, name: "이영희", userId: "lee.yh", company: "HDC랩스", role: "현장관리자" },
  { id: 3, name: "박민준", userId: "park.mj", company: "삼성물산", role: "설비기사" },
  { id: 4, name: "최수정", userId: "choi.sj", company: "삼성물산", role: "전기기사" },
  { id: 5, name: "정대호", userId: "jung.dh", company: "롯데자산개발", role: "현장관리자" },
];

const companies = [
  { id: 1, name: "HDC랩스" },
  { id: 2, name: "삼성물산" },
  { id: 3, name: "롯데자산개발" },
];

const buildingNames = [
  "강남파이낸스센터",
  "서울스퀘어",
  "삼성타워",
  "파르나스타워",
  "롯데월드타워",
];

const wideAreaNames = ["서울", "서울", "서울", "서울", "서울"];
const baseAreaNames = ["강남권역", "중구권역", "송파권역"];
const publishStates = ["PUBLISHED", "PUBLISHED", "PUBLISHED", "SCHEDULED", "EXPIRED"];
const noticeTypes = ["NORMAL", "NORMAL", "NORMAL", "NOTICE"];

const targetGroupSets: string[][] = [
  ["ISSUER_ADMIN", "SITE_MANAGER"],
  ["SITE_MANAGER"],
  ["ISSUER_ADMIN", "SITE_MANAGER", "TENANT"],
];

const contents = [
  "관계 법령에 따라 소방시설 정기점검을 실시할 예정입니다. 점검 기간 중 협조 부탁드립니다.",
  "연간 유지보수 계획에 따른 정기 점검을 실시합니다. 해당 기간 이용에 불편을 드려 죄송합니다.",
  "작업이 성공적으로 완료되었습니다. 시설 운영 상태를 지속적으로 모니터링하겠습니다.",
  "에너지 사용 현황을 공유드립니다. 절감 목표 대비 94.2% 달성하였습니다.",
  "법정 의무 점검 결과를 공유드립니다. 이상 없음을 확인하였습니다.",
];

export const mockNotices: NoticeListDTO[] = Array.from({ length: 20 }, (_, i) => {
  const writer = pick(writers, i);
  const company = pick(companies, i);
  const buildingName = pick(buildingNames, i);
  const buildingId = (i % buildingNames.length) + 1;
  const publishState = pick(publishStates, i);
  const noticeType = pick(noticeTypes, i);
  const targetGroups: string[] = pick(targetGroupSets, i);
  const isMajor = i % 5 === 0;
  const writeDate = makeDateOffset(90 - i * 4);
  const writeDateTime = makeDateTimeOffset(90 - i * 4);
  const title = titles[i] ?? `공지사항 ${i + 1}`;
  const content = pick(contents, i);
  const baseAreaName = pick(baseAreaNames, i);
  const wideAreaName = pick(wideAreaNames, i);

  const noticeDTO: NoticeDTO = {
    id: i + 1,
    allCompany: i % 4 === 0,
    noticeCompanyId: company.id,
    noticeCompanyName: company.name,
    noticeWideAreaId: 1,
    noticeWideAreaName: wideAreaName,
    noticeBaseAreaId: 1 + (i % 3),
    noticeBaseAreaName: baseAreaName,
    noticeBuildingId: buildingId,
    noticeBuildingName: buildingName,
    postTermStart: makeDateOffset(90 - i * 4),
    postTermEnd: makeDateOffset(-(30 + i * 2)),
    noticeType,
    alert: i % 7 === 0,
    title,
    contents: content,
    viewCnt: 10 + i * 13,
    isMajor,
    targetGroups,
    writerId: writer.id,
    writerName: writer.name,
    writerUserId: writer.userId,
    writerCompanyName: writer.company,
    writerRoleName: writer.role,
    writeDate,
    writeDateTime,
    lastModifierId: writer.id,
    lastModifierName: writer.name,
    lastModifierUserId: writer.userId,
    lastModifierCompanyName: writer.company,
    lastModifierRoleName: writer.role,
    lastModifyDate: writeDate,
    lastModifyDateTime: writeDateTime,
    publishState,
    noticeFileDTOs: [],
    commentEnabled: i % 3 !== 0,
    noticeCommentDTOs: [],
  };

  return {
    noticeDTO,
    noticeCompanyId: company.id,
    noticeCompanyName: company.name,
    noticeBuildingId: buildingId,
    noticeBuildingName: buildingName,
    isMajor,
    targetGroups,
    buildingIds: [buildingId],
  } satisfies NoticeListDTO;
});
