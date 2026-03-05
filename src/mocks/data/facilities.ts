/**
 * 시설 Mock 데이터
 */

import type {
  FacilityListDTO,
  FacilityDTO,
  FacilityMasterDTO,
  FacilityCategoryDTO,
  BuildingFloorZoneDTO,
  BuildingFloorDTO,
  BuildingDTO,
} from "@/lib/types/facility";
import { FacilityState } from "@/lib/types/facility";

const buildings: BuildingDTO[] = [
  { id: 1, name: "강남파이낸스센터", address: "서울 강남구 테헤란로 152", companyId: 1, companyName: "HDC랩스" },
  { id: 2, name: "서울스퀘어", address: "서울 중구 한강대로 416", companyId: 1, companyName: "HDC랩스" },
  { id: 3, name: "삼성타워", address: "서울 강남구 삼성로 212", companyId: 2, companyName: "삼성물산" },
  { id: 4, name: "파르나스타워", address: "서울 강남구 테헤란로 521", companyId: 2, companyName: "삼성물산" },
  { id: 5, name: "롯데월드타워", address: "서울 송파구 올림픽로 300", companyId: 3, companyName: "롯데자산개발" },
];

const firstCategories: FacilityCategoryDTO[] = [
  { id: 1, name: "전기설비", parentId: 0, depth: 1 },
  { id: 2, name: "기계설비", parentId: 0, depth: 1 },
  { id: 3, name: "소방설비", parentId: 0, depth: 1 },
  { id: 4, name: "건축", parentId: 0, depth: 1 },
];

const secondCategories: FacilityCategoryDTO[] = [
  { id: 10, name: "수변전설비", parentId: 1, depth: 2, firstFacilityCategoryId: 1, firstFacilityCategoryName: "전기설비" },
  { id: 11, name: "조명설비", parentId: 1, depth: 2, firstFacilityCategoryId: 1, firstFacilityCategoryName: "전기설비" },
  { id: 20, name: "공조설비", parentId: 2, depth: 2, firstFacilityCategoryId: 2, firstFacilityCategoryName: "기계설비" },
  { id: 21, name: "급배수설비", parentId: 2, depth: 2, firstFacilityCategoryId: 2, firstFacilityCategoryName: "기계설비" },
  { id: 30, name: "스프링클러", parentId: 3, depth: 2, firstFacilityCategoryId: 3, firstFacilityCategoryName: "소방설비" },
];

const thirdCategories: FacilityCategoryDTO[] = [
  { id: 100, name: "배전반", parentId: 10, depth: 3, firstFacilityCategoryId: 1, firstFacilityCategoryName: "전기설비", secondFacilityCategoryId: 10, secondFacilityCategoryName: "수변전설비" },
  { id: 101, name: "변압기", parentId: 10, depth: 3, firstFacilityCategoryId: 1, firstFacilityCategoryName: "전기설비", secondFacilityCategoryId: 10, secondFacilityCategoryName: "수변전설비" },
  { id: 110, name: "LED조명", parentId: 11, depth: 3, firstFacilityCategoryId: 1, firstFacilityCategoryName: "전기설비", secondFacilityCategoryId: 11, secondFacilityCategoryName: "조명설비" },
  { id: 200, name: "공조기", parentId: 20, depth: 3, firstFacilityCategoryId: 2, firstFacilityCategoryName: "기계설비", secondFacilityCategoryId: 20, secondFacilityCategoryName: "공조설비" },
  { id: 201, name: "냉각탑", parentId: 20, depth: 3, firstFacilityCategoryId: 2, firstFacilityCategoryName: "기계설비", secondFacilityCategoryId: 20, secondFacilityCategoryName: "공조설비" },
  { id: 210, name: "급수펌프", parentId: 21, depth: 3, firstFacilityCategoryId: 2, firstFacilityCategoryName: "기계설비", secondFacilityCategoryId: 21, secondFacilityCategoryName: "급배수설비" },
  { id: 300, name: "스프링클러헤드", parentId: 30, depth: 3, firstFacilityCategoryId: 3, firstFacilityCategoryName: "소방설비", secondFacilityCategoryId: 30, secondFacilityCategoryName: "스프링클러" },
];

const masters: FacilityMasterDTO[] = [
  { id: 1, name: "배전반 마스터", makingCompany: "LS산전", modelName: "MCC-3000", capacity: "3000kVA", electricityConsumption: "5kW", fuelType: "ELECTRIC", fuelTypeName: "전기" },
  { id: 2, name: "공조기 마스터", makingCompany: "LG전자", modelName: "PRHR048", capacity: "48RT", electricityConsumption: "15kW", fuelType: "ELECTRIC", fuelTypeName: "전기" },
  { id: 3, name: "냉각탑 마스터", makingCompany: "삼성기전", modelName: "CT-500", capacity: "500RT", electricityConsumption: "22kW", fuelType: "WATER", fuelTypeName: "수냉식" },
  { id: 4, name: "급수펌프 마스터", makingCompany: "왈로", modelName: "MHI-803", capacity: "80m³/h", electricityConsumption: "7.5kW", fuelType: "ELECTRIC", fuelTypeName: "전기" },
  { id: 5, name: "LED조명 마스터", makingCompany: "서울반도체", modelName: "SL-200D", capacity: "200W", electricityConsumption: "0.2kW", fuelType: "ELECTRIC", fuelTypeName: "전기" },
];

const chargers = [
  { id: 1, name: "김철수", userId: "kim.cs" },
  { id: 2, name: "이영희", userId: "lee.yh" },
  { id: 3, name: "박민준", userId: "park.mj" },
  { id: 4, name: "최수정", userId: "choi.sj" },
];

const sellCompanies = ["LS산전", "현대전기", "효성중공업", "ABB코리아", "지멘스코리아"];

const allStates: FacilityState[] = [
  FacilityState.BEFORE_CONSTRUCT,
  FacilityState.ONGOING_CONSTRUCT,
  FacilityState.END_CONSTRUCT,
  FacilityState.BEFORE_OPERATING,
  FacilityState.ONGOING_OPERATING,
  FacilityState.END_OPERATING,
  FacilityState.DISCARD,
  FacilityState.NOW_CHECK,
];

const stateNames: Record<FacilityState, string> = {
  BEFORE_CONSTRUCT: "시공전",
  ONGOING_CONSTRUCT: "시공중",
  END_CONSTRUCT: "시공완료",
  BEFORE_OPERATING: "운영전",
  ONGOING_OPERATING: "운영중",
  END_OPERATING: "운영완료",
  DISCARD: "폐기",
  NOW_CHECK: "점검중",
};

function makeDateOffset(daysAgo: number): string {
  const d = new Date("2026-02-23");
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length] as T;
}

const facilityNames = [
  "B1 배전반 #1", "B1 배전반 #2", "옥상 공조기 A", "옥상 공조기 B",
  "냉각탑 #1", "냉각탑 #2", "급수펌프 #1", "급수펌프 #2",
  "로비 LED조명", "주차장 조명", "변압기 #1", "변압기 #2",
  "스프링클러 1구역", "스프링클러 2구역", "화재수신반",
  "비상발전기", "UPS #1", "UPS #2", "분전반 1층", "분전반 2층",
  "분전반 3층", "분전반 4층", "분전반 5층", "환기팬 B1",
  "환기팬 B2", "에어컨 임원실", "에어컨 회의실", "냉온수기",
  "자동문 정면", "자동문 후면",
];

const floors: BuildingFloorDTO[] = [
  { id: 101, name: "B2층", buildingId: 1, orderNum: 1 },
  { id: 102, name: "B1층", buildingId: 1, orderNum: 2 },
  { id: 103, name: "1층", buildingId: 1, orderNum: 3 },
  { id: 104, name: "옥상", buildingId: 1, orderNum: 4 },
];

const zones: BuildingFloorZoneDTO[] = [
  { id: 201, name: "A구역", buildingFloorId: 101 },
  { id: 202, name: "B구역", buildingFloorId: 101 },
  { id: 203, name: "기계실", buildingFloorId: 102 },
  { id: 204, name: "전기실", buildingFloorId: 102 },
];

export const mockFacilities: FacilityListDTO[] = Array.from({ length: 30 }, (_, i) => {
  const building = pick(buildings, i);
  const master = pick(masters, i);
  const thirdCat = pick(thirdCategories, i);
  const secondCatId = thirdCat.secondFacilityCategoryId ?? 10;
  const firstCatId = thirdCat.firstFacilityCategoryId ?? 1;
  const secondCat: FacilityCategoryDTO = secondCategories.find((c) => c.id === secondCatId) ?? secondCategories[0] as FacilityCategoryDTO;
  const firstCat: FacilityCategoryDTO = firstCategories.find((c) => c.id === firstCatId) ?? firstCategories[0] as FacilityCategoryDTO;
  const state = pick(allStates, i);
  const charger = pick(chargers, i);
  const floor = pick(floors, i);
  const zone = pick(zones, i);
  const facilityName = facilityNames[i] ?? `시설-${i + 1}`;
  const sellCompany = pick(sellCompanies, i);

  const facilityDTO: FacilityDTO = {
    id: i + 1,
    name: facilityName,
    facilityNo: `FAC-${String(i + 1).padStart(4, "0")}`,
    use: "공용설비",
    buildingFloorZoneId: zone.id,
    buildingFloorZoneName: zone.name,
    buildingFloorId: floor.id,
    buildingFloorName: floor.name,
    facilityMasterId: master.id,
    state,
    stateName: stateNames[state],
    makeDate: makeDateOffset(365 * 3 + i * 10),
    sellCompany,
    sellCompanyPhone: `02-${String(1000 + i).slice(0, 4)}-${String(2000 + i).slice(0, 4)}`,
    cop: `${(2.5 + i * 0.1).toFixed(1)}`,
    snNo: `SN-${String(100000 + i)}`,
    installDate: makeDateOffset(365 * 2 + i * 7),
    startRunDate: makeDateOffset(365 * 2 + i * 5),
    chargerId: charger.id,
    chargerName: charger.name,
    chargerUserId: charger.userId,
    buildingUserGroupId: 10 + (i % 5),
    buildingUserGroupName: `${building.name} 시설팀`,
    purchaseUnitPrice: `${(500 + i * 50) * 10000}`,
    guaranteeExpireDate: makeDateOffset(-(365 * 2)),
    persistPeriod: 10,
    writerId: 1,
    writerName: "김철수",
    writerUserId: "kim.cs",
    writeDate: makeDateOffset(365 * 2 + i),
    lastModifierId: 2,
    lastModifierName: "이영희",
    lastModifierUserId: "lee.yh",
    lastModifyDate: makeDateOffset(30 + i),
    facilityQrNfcDTOs: [],
    facilityFileDTOs: [],
    facilityControlPointDTOs: [],
  };

  return {
    facilityDTO,
    facilityMasterDTO: master,
    facilityCategoryDTO: thirdCat,
    secondFacilityCategory: secondCat,
    firstFacilityCategory: firstCat,
    buildingFloorZoneDTO: zone,
    buildingFloorDTO: floor,
    buildingDTO: building,
    orderByBuildingName: building.name,
    orderByFirstCategoryName: firstCat.name,
    orderBySecondCategoryName: secondCat.name,
    orderByThirdCategoryName: thirdCat.name,
    orderByFacilityName: facilityName,
    hasHistory: i % 3 === 0,
    facilityIdBefore: i > 0 ? i : 0,
    facilityIdNext: i < 29 ? i + 2 : 0,
  } satisfies FacilityListDTO;
});
