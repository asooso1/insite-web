# Storybook 설정 가이드

insite-web 프로젝트의 디자인 시스템 문서화 및 컴포넌트 라이브러리입니다.

## 실행 방법

### 개발 모드
```bash
npm run storybook
```

브라우저에서 `http://localhost:6006` 을 열어 Storybook을 확인합니다.

### 빌드 (정적 생성)
```bash
npm run storybook:build
```

`storybook-static/` 디렉토리에 정적 HTML이 생성됩니다.

## 파일 구조

```
.storybook/
├── main.ts          # Storybook 설정 (프레임워크, 애드온, 경로)
├── preview.ts       # Preview 설정 (globals.css, 테마, viewport)
└── README.md        # 이 파일

src/stories/
├── design-system/
│   ├── Colors.stories.tsx       # 색상 토큰
│   ├── Typography.stories.tsx   # 타이포그래피 스케일
│   ├── Elevation.stories.tsx    # 그림자 & Z-index
│   └── Icons.stories.tsx        # 아이콘 갤러리

src/components/ui/
├── button.stories.tsx           # Button 컴포넌트
├── input.stories.tsx            # Input 컴포넌트
├── badge.stories.tsx            # Badge 컴포넌트
├── card.stories.tsx             # Card 컴포넌트
├── checkbox.stories.tsx         # Checkbox 컴포넌트
└── skeleton.stories.tsx         # Skeleton 컴포넌트

src/components/common/
└── page-header.stories.tsx      # PageHeader 컴포넌트

src/components/data-display/
├── status-badge.stories.tsx     # StatusBadge 컴포넌트
├── empty-state.stories.tsx      # EmptyState 컴포넌트
├── kpi-card.stories.tsx         # KPICard 컴포넌트
└── info-panel.stories.tsx       # InfoPanel 컴포넌트
```

## 주요 특징

### 1. 디자인 시스템 문서화
- **Colors**: 라이트/다크 테마의 모든 CSS 색상 변수, 그라데이션
- **Typography**: 디스플레이부터 라벨까지 전체 타이포그래피 스케일
- **Elevation**: 6단계 그림자 시스템, Z-index 레이어 정의
- **Icons**: lucide-react 아이콘 갤러리 (40+ 아이콘)

### 2. UI 컴포넌트 카탈로그
- **shadcn/ui**: Button, Input, Badge, Card, Checkbox, Skeleton
- **커스텀 컴포넌트**: PageHeader, StatusBadge, EmptyState, KPICard, InfoPanel
- 각 컴포넌트마다 variants, states, real-world examples 포함

### 3. 다크모드 지원
- `.storybook/preview.ts`의 `withThemeByClassName` 데코레이터
- 우상단 "Appearance" 컨트롤로 라이트/다크 모드 전환
- 모든 컴포넌트가 양쪽 테마에서 검증됨

### 4. 반응형 뷰포트
- Mobile, Tablet, Desktop 사전 설정
- 각 컴포넌트를 다양한 화면 크기에서 테스트 가능

### 5. 접근성 (a11y)
- `@storybook/addon-a11y` 통합
- 색상 대비율, ARIA 라벨 검증
- "Accessibility" 탭에서 이슈 확인

## 스토리 작성 규칙

### 기본 템플릿
```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { MyComponent } from "./my-component";

const meta = {
  title: "Components/Category/ComponentName",
  component: MyComponent,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    prop1: "value1",
  },
};

// 추가 변형
export const Variant1: Story = {
  args: {
    prop1: "different-value",
  },
};

// 복잡한 예시는 render 함수 사용
export const Complex: Story = {
  render: () => <MyComponent {...complexProps} />,
};
```

### 제목 규칙
- `Components/` - UI 컴포넌트
- `Components/UI/` - shadcn/ui 컴포넌트
- `Components/Common/` - 공통 컴포넌트
- `Components/DataDisplay/` - 데이터 표시 컴포넌트
- `Design System/` - 디자인 토큰 및 가이드

### 필수 요소
1. `Meta` 설정 (title, component)
2. `tags: ["autodocs"]` - 자동 문서 생성
3. 최소 Default 스토리
4. 실제 사용 예시 포함

## 커스터마이징

### globals.css 반영
- `.storybook/preview.ts`의 `import "../src/app/globals.css"` 확인
- Pretendard 폰트, CSS 변수, 유틸리티 클래스 자동 로드

### 새 애드온 추가
```typescript
// .storybook/main.ts
addons: [
  "@storybook/addon-essentials",
  "@storybook/addon-interactions",
  "@storybook/addon-a11y",
  "@storybook/addon-themes",
  // 여기에 새 애드온 추가
],
```

### 스토리 경로 수정
```typescript
// .storybook/main.ts
stories: ["../src/**/*.stories.@(ts|tsx)"],
// 특정 디렉토리만: ["../src/components/**/*.stories.tsx"]
```

## 자주 하는 실수

### 1. TypeScript 타입 에러
```typescript
// ❌ as unknown as ComponentProps 패턴 금지
const meta = { ... } as unknown as Meta;

// ✅ satisfies 키워드 사용
const meta = { ... } satisfies Meta<typeof Component>;
```

### 2. 스토리 인자 타입
```typescript
// ❌ 각 스토리마다 새 타입 정의
export const Story1 = { ... } as Story;
export const Story2 = { ... } as Story;

// ✅ 한 번 정의하고 재사용
type Story = StoryObj<typeof meta>;
export const Story1: Story = { ... };
export const Story2: Story = { ... };
```

### 3. 렌더링 함수에서의 상태 관리
```typescript
// ❌ 함수형 컴포넌트 내부에서 호출 (메모리 누수)
export const MyStory = () => {
  const [state, setState] = useState();
  return <Component />;
};

// ✅ render 함수에서 반환
export const MyStory: Story = {
  render: () => {
    const [state, setState] = useState();
    return <Component />;
  },
};
```

## 배포

### CI/CD 통합
```yaml
# GitHub Actions 예시
- name: Build Storybook
  run: npm run storybook:build

- name: Deploy to static hosting
  uses: your-deploy-action
  with:
    directory: storybook-static
```

### 정적 호스팅
- Netlify, Vercel, GitHub Pages 등에 `storybook-static/` 배포
- CI/CD 파이프라인에서 자동 배포 가능

## 문제 해결

### 포트 충돌
```bash
npm run storybook -- --port 6007
```

### 캐시 문제
```bash
rm -rf node_modules/.cache
npm run storybook
```

### 모듈 찾을 수 없음
```bash
npm install
npm run storybook
```

### 빌드 실패
```bash
npm run storybook:build --debug
```

## 참고 자료

- [Storybook 공식 문서](https://storybook.js.org/)
- [Next.js + Storybook](https://storybook.js.org/docs/react/builders/nextjs)
- [Control 컴포넌트](https://storybook.js.org/docs/react/essentials/controls)
- [스토리 작성 Best Practices](https://storybook.js.org/docs/react/writing-stories/best-practices)

---

**마지막 업데이트**: 2026-03-16
**Storybook 버전**: 8.x
**Next.js 버전**: 16.1.6
**React 버전**: 19.2.3
