/**
 * 자재 Mock 데이터
 */

import type { MaterialDTO } from "@/lib/types/material";
import { MaterialType, MaterialState } from "@/lib/types/material";

const materialNames = [
  "형광등 32W", "LED 투광기 100W", "차단기 20A", "전선 HFIX 2.5SQ",
  "에어필터 G4", "냉매 R-410A", "냉각수 처리제", "윤활유 ISO VG 46",
  "소화기 3.3kg", "스프링클러 헤드 K-80", "배전반 부품 세트", "접지동선 16SQ",
  "PVC 파이프 50mm", "게이트밸브 DN50", "볼밸브 DN25", "압력계 0-10kg",
  "안전화 (작업용)", "안전모 (ABS)", "작업용 장갑", "절연 테이프",
  "실리콘 실런트 300ml", "볼트 M10x30", "너트 M10", "와셔 M10",
  "연결 커플링 50mm", "체크밸브 DN40", "온도계 0-100℃", "드라이버 세트",
  "멀티미터 디지털", "배관 보온재 50A",
];

const units = ["개", "m", "kg", "L", "세트", "박스", "롤"];
const standards = [
  "KS C IEC 60228", "KS B 6382", "KS A 0001", "ISO 9001",
  "JIS G 3459", "ASME B16.5", "규격품", "표준형",
];

const buildingFloors = [
  { id: 101, name: "B2층", buildingId: 1, orderNum: 1 },
  { id: 102, name: "B1층", buildingId: 1, orderNum: 2 },
  { id: 103, name: "1층", buildingId: 1, orderNum: 3 },
];

const buildingFloorZones = [
  { id: 201, name: "자재창고 A", buildingFloorId: 101 },
  { id: 202, name: "자재창고 B", buildingFloorId: 102 },
  { id: 203, name: "공구실", buildingFloorId: 103 },
];

const userGroups = [
  { id: 1, name: "강남파이낸스센터 시설팀", buildingId: 1 },
  { id: 2, name: "서울스퀘어 시설팀", buildingId: 2 },
  { id: 3, name: "삼성타워 시설팀", buildingId: 3 },
];

const typeList: MaterialType[] = [
  MaterialType.SUPPLIES,
  MaterialType.SUPPLIES,
  MaterialType.PARTS,
  MaterialType.PARTS,
  MaterialType.TOOL,
  MaterialType.RAW,
  MaterialType.STORED,
  MaterialType.FUEL,
  MaterialType.GOODS,
  MaterialType.PRODUCT,
];

const typeNames: Record<MaterialType, string> = {
  RAW: "원자재",
  PARTS: "부분품",
  SUPPLIES: "소모품",
  TOOL: "공구",
  FUEL: "연료",
  STORED: "저장품",
  PROCESS: "공정품",
  HALF_FINISHED: "반제품",
  PRODUCT: "상품",
  GOODS: "제품",
};

const stateList: MaterialState[] = [
  MaterialState.OPERATING,
  MaterialState.OPERATING,
  MaterialState.OPERATING,
  MaterialState.PREPARE,
  MaterialState.DISCARD,
];

const stateNames: Record<MaterialState, string> = {
  PREPARE: "준비",
  OPERATING: "운영",
  DISCARD: "폐기",
};

const stateStyles: Record<MaterialState, string> = {
  PREPARE: "pending",
  OPERATING: "completed",
  DISCARD: "cancelled",
};

const buildings = ["강남파이낸스센터", "서울스퀘어", "삼성타워"];
const baseAreas = ["강남권역", "중구권역", "송파권역"];
const companyNames = ["HDC랩스", "삼성물산", "롯데자산개발"];

function makeDateOffset(daysAgo: number): string {
  const d = new Date("2026-02-23");
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length] as T;
}

export const mockMaterials: MaterialDTO[] = Array.from({ length: 30 }, (_, i) => {
  const type = pick(typeList, i);
  const state = pick(stateList, i);
  const floor = pick(buildingFloors, i);
  const zone = pick(buildingFloorZones, i);
  const userGroup = pick(userGroups, i);
  const stockCnt = 10 + (i % 5) * 20;
  const suitableStock = 20 + (i % 3) * 10;

  return {
    id: i + 1,
    name: materialNames[i] ?? `자재-${i + 1}`,
    privateCode: `MAT-${String(i + 1).padStart(4, "0")}`,
    type,
    typeName: typeNames[type],
    standard: pick(standards, i),
    unit: pick(units, i),
    state,
    stateName: stateNames[state],
    stateStyle: stateStyles[state],
    suitableStock,
    connectWorkOrder: i % 4 === 0,
    connectWorkOrderName: i % 4 === 0 ? `WO-${String(i + 1).padStart(4, "0")}` : "",
    description: `${materialNames[i]} 재고 관리 자재`,
    stockCnt,
    writerId: 1,
    writerName: "김철수",
    writerUserId: "kim.cs",
    writeDate: makeDateOffset(180 + i * 3),
    lastModifierId: 2,
    lastModifierName: "이영희",
    lastModifierUserId: "lee.yh",
    lastModifyDate: makeDateOffset(30 + i),
    buildingFloorId: floor.id,
    buildingFloors: [floor],
    buildingFloorZoneId: zone.id,
    buildingFloorZoneDTO: zone,
    buildingFloorZones: [zone],
    userGroupId: userGroup.id,
    buildingUserGroupDTO: userGroup,
    userGroups: [userGroup],
    materialFileDTOs: [],
    materialInOutDTOs:
      i % 3 === 0
        ? [
            {
              date: makeDateOffset(30),
              type: "IN",
              method: "구매",
              unitPrice: `${(500 + i * 100) * 100}`,
              cnt: 50,
              stockCnt: stockCnt,
              reason: "정기 입고",
              etc: "",
              writerName: "김철수",
              writeDate: makeDateOffset(30),
            },
          ]
        : [],
    companyName: pick(companyNames, i),
    baseAreaName: pick(baseAreas, i),
    buildingName: pick(buildings, i),
    estimateUseCnt: `${5 + (i % 10)}개/월`,
  } satisfies MaterialDTO;
});
