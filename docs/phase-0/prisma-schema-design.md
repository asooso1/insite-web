# Prisma 스키마 설계 문서

> 작성일: 2026-02-06
> 상태: 🔄 진행중

## 목적

csp-web이 직접 관리하던 PostgreSQL DB 테이블(메뉴, 권한, 대시보드 설정)에
Next.js API Routes + Prisma로 직접 접근하기 위한 스키마를 설계합니다.

> **핵심 원칙:** csp-was 변경 없이 동일 DB에 Prisma로 직접 접근

---

## 1. 대상 테이블

### 1.1 메뉴 시스템 (6개 테이블)

| 테이블 | 설명 | 주요 컬럼 |
|--------|------|----------|
| menu | 메뉴 마스터 | id, depth, sortNo, parentId, name, url, icon, isUse, isShow |
| role_menu | 역할별 메뉴 접근 | role_id, menu_id, hasRight |
| product_menu | 제품별 메뉴 활성화 | product_id, menu_id |
| page_info | 화면 정보 | menu_id, pageId, url, entryPageId, isRowId, videoId |
| page_function | 화면별 기능 | page_info_id, code, apiUrl, name |
| role_page_default_function | 역할별 기능 권한 | role_id, page_function_id, isDisplay, isChecked |

### 1.2 대시보드 시스템 (3개 테이블)

| 테이블 | 설명 | 주요 컬럼 |
|--------|------|----------|
| dashboard | 대시보드 마스터 | id, name, type, buildingId |
| dashboard_widget | 위젯 배치 | dashboard_id, widget_id, x, y, w, h, order |
| widget | 위젯 마스터 | id, name, type, dataSource, config |

### 1.3 기타

| 테이블 | 설명 | 용도 |
|--------|------|------|
| role | 역할 마스터 | 권한 체크에 필요 |
| product | 제품 마스터 | 라이선스 필터링에 필요 |

---

## 2. Prisma 스키마 초안

### 2.1 introspection 방법

```bash
# 1. Prisma 초기화
npx prisma init

# 2. .env에 DATABASE_URL 설정
# DATABASE_URL="postgresql://user:password@host:5432/database"

# 3. 기존 스키마 introspection
npx prisma db pull

# 4. Prisma Client 생성
npx prisma generate
```

### 2.2 예상 스키마 (schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== 메뉴 시스템 ====================

model Menu {
  id       Int     @id @default(autoincrement())
  depth    Int
  sortNo   Int     @map("sort_no")
  parentId Int?    @map("parent_id")
  name     String
  url      String?
  icon     String?
  isUse    Boolean @default(true) @map("is_use")
  isShow   Boolean @default(true) @map("is_show")

  parent   Menu?   @relation("MenuHierarchy", fields: [parentId], references: [id])
  children Menu[]  @relation("MenuHierarchy")

  roleMenus    RoleMenu[]
  productMenus ProductMenu[]
  pageInfos    PageInfo[]

  @@map("menu")
}

model RoleMenu {
  id       Int     @id @default(autoincrement())
  roleId   Int     @map("role_id")
  menuId   Int     @map("menu_id")
  hasRight Boolean @default(true) @map("has_right")

  role Role @relation(fields: [roleId], references: [id])
  menu Menu @relation(fields: [menuId], references: [id])

  @@map("role_menu")
}

model ProductMenu {
  id        Int @id @default(autoincrement())
  productId Int @map("product_id")
  menuId    Int @map("menu_id")

  product Product @relation(fields: [productId], references: [id])
  menu    Menu    @relation(fields: [menuId], references: [id])

  @@map("product_menu")
}

model PageInfo {
  id          Int     @id @default(autoincrement())
  menuId      Int     @map("menu_id")
  pageId      String  @map("page_id")
  url         String?
  entryPageId String? @map("entry_page_id")
  isRowId     Boolean @default(false) @map("is_row_id")
  videoId     String? @map("video_id")

  menu          Menu           @relation(fields: [menuId], references: [id])
  pageFunctions PageFunction[]

  @@map("page_info")
}

model PageFunction {
  id         Int    @id @default(autoincrement())
  pageInfoId Int    @map("page_info_id")
  code       String
  apiUrl     String @map("api_url")
  name       String

  pageInfo                  PageInfo                   @relation(fields: [pageInfoId], references: [id])
  rolePageDefaultFunctions RolePageDefaultFunction[]

  @@map("page_function")
}

model RolePageDefaultFunction {
  id             Int     @id @default(autoincrement())
  roleId         Int     @map("role_id")
  pageFunctionId Int     @map("page_function_id")
  isDisplay      Boolean @default(true) @map("is_display")
  isChecked      Boolean @default(false) @map("is_checked")

  role         Role         @relation(fields: [roleId], references: [id])
  pageFunction PageFunction @relation(fields: [pageFunctionId], references: [id])

  @@map("role_page_default_function")
}

// ==================== 대시보드 시스템 ====================

model Dashboard {
  id         Int    @id @default(autoincrement())
  name       String
  type       String
  buildingId Int?   @map("building_id")

  widgets DashboardWidget[]

  @@map("dashboard")
}

model DashboardWidget {
  id          Int @id @default(autoincrement())
  dashboardId Int @map("dashboard_id")
  widgetId    Int @map("widget_id")
  x           Int
  y           Int
  w           Int
  h           Int
  order       Int @default(0)

  dashboard Dashboard @relation(fields: [dashboardId], references: [id])
  widget    Widget    @relation(fields: [widgetId], references: [id])

  @@map("dashboard_widget")
}

model Widget {
  id         Int     @id @default(autoincrement())
  name       String
  type       String
  dataSource String? @map("data_source")
  config     Json?

  dashboardWidgets DashboardWidget[]

  @@map("widget")
}

// ==================== 참조 테이블 ====================

model Role {
  id   Int    @id @default(autoincrement())
  code String @unique
  name String

  roleMenus                RoleMenu[]
  rolePageDefaultFunctions RolePageDefaultFunction[]

  @@map("role")
}

model Product {
  id   Int    @id @default(autoincrement())
  code String @unique
  name String

  productMenus ProductMenu[]

  @@map("product")
}
```

---

## 3. Java 서비스 → TypeScript 포팅

### 3.1 MenuService.aside() 포팅 설계

**Java 원본 로직:**
1. CachingService에서 전체 메뉴/역할 데이터 캐시 조회
2. roleCode + buildingId 기반 필터링
3. RoleMenu 필터링 (역할별 메뉴 접근 권한)
4. ProductMenu 필터링 (빌딩→제품→메뉴 라이선스)
5. 3depth → 2depth → 1depth 역추적으로 트리 구성

**TypeScript 포팅:**

```typescript
// lib/services/menu-service.ts
import { prisma } from '@/lib/db/prisma';

interface MenuItem {
  id: number;
  name: string;
  url: string | null;
  icon: string | null;
  depth: number;
  children: MenuItem[];
}

export async function buildMenuTree(
  roleCode: string,
  buildingId: number
): Promise<MenuItem[]> {
  const isAdmin = ['ROLE_SYSTEM_ADMIN', 'ROLE_LABS_SYSTEM_ADMIN'].includes(roleCode);

  // 1. 전체 활성 메뉴 조회
  const allMenus = await prisma.menu.findMany({
    where: { isUse: true },
    orderBy: [{ depth: 'asc' }, { sortNo: 'asc' }],
  });

  // 2. RoleMenu 필터링
  let allowedMenuIds: Set<number>;
  if (isAdmin) {
    allowedMenuIds = new Set(allMenus.map(m => m.id));
  } else {
    const roleMenus = await prisma.roleMenu.findMany({
      where: {
        role: { code: roleCode },
        hasRight: true,
      },
      select: { menuId: true },
    });
    allowedMenuIds = new Set(roleMenus.map(rm => rm.menuId));
  }

  // 3. ProductMenu 필터링 (빌딩 → 제품 → 메뉴)
  if (!isAdmin && buildingId) {
    const productMenus = await prisma.productMenu.findMany({
      where: {
        product: {
          // 빌딩에 연결된 제품 조회 로직
        },
      },
      select: { menuId: true },
    });
    const productMenuIds = new Set(productMenus.map(pm => pm.menuId));
    // 교차 필터링
    allowedMenuIds = new Set(
      [...allowedMenuIds].filter(id => productMenuIds.has(id))
    );
  }

  // 4. 트리 구성
  const filteredMenus = allMenus.filter(m => allowedMenuIds.has(m.id));
  return buildTree(filteredMenus);
}

function buildTree(menus: Menu[]): MenuItem[] {
  const menuMap = new Map<number, MenuItem>();
  const roots: MenuItem[] = [];

  // 1차: 모든 메뉴를 Map에 저장
  menus.forEach(m => {
    menuMap.set(m.id, {
      id: m.id,
      name: m.name,
      url: m.url,
      icon: m.icon,
      depth: m.depth,
      children: [],
    });
  });

  // 2차: 부모-자식 관계 연결
  menus.forEach(m => {
    const item = menuMap.get(m.id)!;
    if (m.parentId && menuMap.has(m.parentId)) {
      menuMap.get(m.parentId)!.children.push(item);
    } else if (m.depth === 1) {
      roots.push(item);
    }
  });

  return roots;
}
```

### 3.2 권한 체크 로직 포팅 설계

**HttpInterceptor.postHandle() 원본:**
- 페이지 접근 시 pageFunctionAuth 계산
- 역할별 기능 권한 (isDisplay, isChecked) 조회

**TypeScript 포팅:**

```typescript
// lib/services/permission-service.ts
export async function getPagePermissions(
  roleCode: string,
  pageId: string
): Promise<PagePermissions> {
  const pageInfo = await prisma.pageInfo.findFirst({
    where: { pageId },
    include: {
      pageFunctions: {
        include: {
          rolePageDefaultFunctions: {
            where: {
              role: { code: roleCode },
            },
          },
        },
      },
    },
  });

  if (!pageInfo) {
    return { hasAccess: false, functions: {} };
  }

  const functions: Record<string, boolean> = {};
  pageInfo.pageFunctions.forEach(pf => {
    const rpdf = pf.rolePageDefaultFunctions[0];
    functions[pf.code] = rpdf?.isDisplay ?? false;
  });

  return {
    hasAccess: true,
    functions,
  };
}
```

### 3.3 DashboardService 포팅 설계

**getDashboardDTO() 원본:**
- 빌딩ID + 대시보드 타입으로 대시보드 조회
- 위젯 배치 정보 조회
- 사용자 개인화 설정 병합

**TypeScript 포팅:**

```typescript
// lib/services/dashboard-service.ts
export async function getDashboardConfig(
  buildingId: number,
  dashboardType: string,
  userId?: number
): Promise<DashboardConfig> {
  // 1. 기본 대시보드 조회
  const dashboard = await prisma.dashboard.findFirst({
    where: {
      buildingId,
      type: dashboardType,
    },
    include: {
      widgets: {
        include: {
          widget: true,
        },
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!dashboard) {
    return { widgets: [] };
  }

  // 2. 사용자 개인화 설정 조회 (있다면)
  // ...

  return {
    id: dashboard.id,
    name: dashboard.name,
    widgets: dashboard.widgets.map(dw => ({
      id: dw.widget.id,
      name: dw.widget.name,
      type: dw.widget.type,
      x: dw.x,
      y: dw.y,
      w: dw.w,
      h: dw.h,
    })),
  };
}
```

---

## 4. 검증 계획

### 4.1 스키마 검증

- [ ] `prisma db pull` 실행 후 스키마 비교
- [ ] 관계(relation) 정의 검증
- [ ] 컬럼 타입 매핑 검증

### 4.2 데이터 검증

- [ ] 메뉴 트리 구성 결과가 기존과 동일한지 검증
- [ ] 권한 체크 결과가 기존과 동일한지 검증
- [ ] 대시보드 설정 조회 결과가 기존과 동일한지 검증

### 4.3 성능 검증

- [ ] 쿼리 실행 시간 측정
- [ ] N+1 문제 확인
- [ ] 캐싱 전략 검토 (React Query staleTime)

---

## 5. 다음 단계

1. PostgreSQL 접속 정보 확보
2. `prisma db pull` 실행
3. 실제 스키마와 예상 스키마 비교/조정
4. TypeScript 서비스 함수 구현
5. 단위 테스트 작성

---

## 참고

- csp-web MenuService: `csp-web/src/main/java/.../service/MenuService.java`
- csp-web DashboardService: `csp-web/src/main/java/.../service/DashboardService.java`
- csp-web HttpInterceptor: `csp-web/src/main/java/.../interceptor/HttpInterceptor.java`
