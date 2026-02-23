/**
 * 사용자 Mock 데이터
 */

import type { AccountDTO } from "@/lib/types/user";
import { AccountState, AccountType } from "@/lib/types/user";

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length] as T;
}

function makeDateOffset(daysAgo: number): string {
  const d = new Date("2026-02-23");
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

const namePool = [
  "김철수", "이영희", "박민준", "최수정", "정대호",
  "강지원", "윤서연", "임현우", "한미래", "조성민",
  "오다은", "서준호", "문소영", "류현진", "신동엽",
  "백지훈", "노은혜", "홍길동", "전민석", "안지영",
];

const companies = [
  { id: 1, name: "HDC랩스" },
  { id: 2, name: "삼성물산" },
  { id: 3, name: "롯데자산개발" },
  { id: 4, name: "현대건설" },
];

const departments = ["시설팀", "전기팀", "기계팀", "소방팀", "보안팀", "관리팀"];
const positions = ["팀장", "차장", "과장", "대리", "주임", "사원"];
const roles = [
  { id: 1, name: "시스템관리자" },
  { id: 2, name: "현장관리자" },
  { id: 3, name: "설비기사" },
  { id: 4, name: "전기기사" },
  { id: 5, name: "현장직원" },
];

const buildingAssignments = [
  { id: 1, buildingId: 1, buildingName: "강남파이낸스센터", companyName: "HDC랩스", jobType: "FACILITY", jobTypeName: "시설" },
  { id: 2, buildingId: 2, buildingName: "서울스퀘어", companyName: "HDC랩스", jobType: "FACILITY", jobTypeName: "시설" },
  { id: 3, buildingId: 3, buildingName: "삼성타워", companyName: "삼성물산", jobType: "ELECTRIC", jobTypeName: "전기" },
];

const stateList: AccountState[] = [
  AccountState.HIRED,
  AccountState.HIRED,
  AccountState.HIRED,
  AccountState.HIRED,
  AccountState.LEAVE,
  AccountState.RETIRED,
  AccountState.TEMPORAL,
];

const stateValueMap: Record<AccountState, string> = {
  HIRED: "재직중",
  LEAVE: "휴직",
  RETIRED: "퇴사",
  TEMPORAL: "임시",
  DEL: "삭제",
};

const typeList: AccountType[] = [
  AccountType.LABS,
  AccountType.FIELD,
  AccountType.FIELD,
  AccountType.DAILY,
  AccountType.CLIENT,
];

export const mockUsers: AccountDTO[] = Array.from({ length: 20 }, (_, i) => {
  const name = namePool[i] ?? `사용자-${i + 1}`;
  const company = pick(companies, i);
  const department = pick(departments, i);
  const position = pick(positions, i);
  const role = pick(roles, i);
  const state = pick(stateList, i);
  const type = pick(typeList, i);
  const gender = i % 3 === 0 ? "F" : "M";
  const building = pick(buildingAssignments, i);

  return {
    id: i + 1,
    userId: `user${String(i + 1).padStart(3, "0")}`,
    name,
    companyId: company.id,
    companyName: company.name,
    department,
    position,
    type,
    workerType: type === AccountType.DAILY ? "일반" : null,
    mobile: `010-${String(1000 + i * 7).slice(0, 4)}-${String(2000 + i * 13).slice(0, 4)}`,
    birthDate: `${1975 + (i % 20)}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
    gender,
    hiredDate: makeDateOffset(365 * (3 + (i % 5))),
    retiredDate: state === AccountState.RETIRED ? makeDateOffset(30) : null,
    state,
    stateValue: stateValueMap[state],
    note: i % 5 === 0 ? "특이사항 없음" : "",
    writeEmbedded: null,
    writeDate: makeDateOffset(365 * (3 + (i % 5))),
    buildingCnt: 1 + (i % 3),
    roleId: role.id,
    roleName: role.name,
    roleSite: i % 4 === 0,
    isAgreePrivacy: true,
    jobTypeValue: "FACILITY",
    isFromErp: i % 7 === 0,
    accountLicenseDTO:
      i % 4 === 0
        ? [
            {
              id: i * 10 + 1,
              licenseName: "전기기사",
              licenseNo: `EL-${String(10000 + i)}`,
              issueDate: makeDateOffset(365 * 2),
              expireDate: makeDateOffset(-(365 * 3)),
            },
          ]
        : [],
    buildingAccountDTO: [
      {
        id: i + 100,
        buildingId: building.buildingId,
        buildingName: building.buildingName,
        companyName: building.companyName,
        jobType: building.jobType,
        jobTypeName: building.jobTypeName,
      },
    ],
  } satisfies AccountDTO;
});
