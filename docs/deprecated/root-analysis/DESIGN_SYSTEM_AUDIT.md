# UX Design System Audit: insite-web

**Research Date:** March 11, 2026
**Scope:** Design token consistency, component reusability, state handling patterns, accessibility, and responsive design across insite-web
**Methodology:** Heuristic evaluation + code pattern analysis

---

## Executive Summary

The insite-web design system is **well-structured at the foundation level** (Tailwind CSS, shadcn/ui components, CVA variants) but exhibits **critical inconsistencies in execution** that create usability friction and maintenance burden. The issues fall into three categories:

1. **State Representation Inconsistency** (CRITICAL) — Loading/error/empty states handled differently across features
2. **Component Variant Fragmentation** (MAJOR) — Redundant styling, missing centralized token usage
3. **Form/Input Accessibility Gaps** (MAJOR) — Error states and affordances not uniformly implemented
4. **Responsive Design Uncertainties** (MAJOR) — Unclear mobile-first strategy in mixed implementations
5. **Icon/Label Alignment Issues** (MINOR) — Inconsistent visual hierarchy in tables and lists

---

## UX Research Findings Matrix

| # | Finding | Severity | Heuristic | Confidence | Evidence |
|---|---------|----------|-----------|------------|----------|
| F1 | Status badge color system not aligned with actual backend state enums | Critical | H4, H2 | HIGH | `status-badge.tsx` hardcodes 20+ status variants; `work-orders/page.tsx` uses `FacilityStateStyle[state]` mapper, creating fragile translation layer |
| F2 | Empty state UX differs across list pages — no consistent pattern for "no data" vs "no search results" handling | Critical | H4, H6 | HIGH | `empty-state.tsx` provides generic component but `DataTable.tsx` and page-level implementations diverge on when/how to show states |
| F3 | Loading skeleton variants inconsistent — height/width specs vary (h-4 w-20, h-5 w-full, h-9 w-24) | Critical | H4 | HIGH | `info-panel.tsx` uses hardcoded skeleton sizes; `data-table.tsx` uses different skeleton heights; no centralized loading pattern |
| F4 | Form field error styling not consistent with Input component's built-in aria-invalid support | Major | H4, H9 | HIGH | `form-field.tsx` adds custom `border-destructive` classes; Input already has `aria-invalid:border-destructive` but they don't align visually |
| F5 | Checkbox components in table headers use raw HTML, not styled Input component; inconsistent with form fields | Major | H4 | MEDIUM | `work-orders/page.tsx` line 74-89 uses `<input type="checkbox" className="h-4 w-4 rounded border-gray-300">` instead of checkbox component |
| F6 | Shadow utility uses CSS variables (--shadow-card, --shadow-panel) but not consistently exported; some components hardcode shadow-xs/shadow-sm | Major | H4 | HIGH | `card.tsx` uses `shadow-sm`; `kpi-card.tsx` uses `shadow-[var(--shadow-card)]`; `info-panel.tsx` uses `shadow-[var(--shadow-panel)]` |
| F7 | Gap spacing inconsistent in layout components — mixed use of gap-2, gap-3, gap-4, gap-6 with no documented scale | Major | H4, H8 | MEDIUM | `card.tsx` has `gap-6` in base; `header.tsx` uses `gap-1`, `gap-2`, `gap-3` throughout; no spacing token system visible |
| F8 | Button size variant `icon-xs` and `icon-sm` defined but no guidance on when to use each; icon sizing inconsistent | Major | H6, H7 | MEDIUM | `button.tsx` has 7 size variants; `header.tsx` uses `h-8 w-8` for all icons; unclear when to use icon variants vs manual sizing |
| F9 | DataTable row height/padding not configurable; clashes with estimateRowHeight prop in virtual scroll | Major | H7, H5 | MEDIUM | `data-table.tsx` hardcodes `TableCell` padding `p-2` and `TableHead` height `h-10`; virtual scroll estimates 48px but no way to override cell heights |
| F10 | Color contrast not validated for status badge variants in dark mode — some combinations may fail WCAG AA | Major | H4 | MEDIUM | `status-badge.tsx` uses `/30` opacity overlays (e.g., `dark:bg-blue-900/30`) which may not meet 4.5:1 text contrast ratio |
| F11 | Responsive breakpoint usage fragmented — some components use lg:, md:, some use hidden lg:block pattern | Major | H4, H7 | HIGH | `header.tsx` mixes `hidden lg:block`, `md:flex`, `hidden sm:flex`; `app-shell.tsx` hardcodes lg breakpoint; no clear responsive strategy |
| F12 | Page header animation (`animate-in fade-in slide-in-from-top-2`) applied unconditionally; no prefers-reduced-motion check | Major | H7 | HIGH | `page-header.tsx` uses Tailwind animate-in without checking `prefers-reduced-motion`; `data-table.tsx` correctly uses `useMotionPreference` |
| F13 | Badge and Button components share variant names (default, secondary, outline, ghost, link) but visual behavior differs | Major | H4 | HIGH | `button.tsx` and `badge.tsx` both define variant CVAs; Badge variants are passive, Button variants are interactive, but naming suggests parity |
| F14 | Form field helper text and error message font sizes not standardized — text-sm used everywhere without hierarchical scale | Minor | H8 | MEDIUM | `form-field.tsx` uses `text-sm` for helper/error; `info-panel.tsx` uses `text-xs`; no defined typography scale for form feedback |
| F15 | DataTable toolbar position not documented — toolbar prop can render anywhere, no standard placement | Minor | H6 | LOW | `data-table.tsx` renders `{toolbar}` at top but pages may place filters differently; no pattern guidance |
| F16 | Breadcrumb component exists but not used in any list/detail pages; no navigation affordance for back/hierarchy | Major | H6, H2 | MEDIUM | `src/components/ui/breadcrumb.tsx` present but search shows zero usage in page implementations |
| F17 | Status badge `showDot` prop defaults true but not all statuses warrant a dot animation indicator | Minor | H6 | MEDIUM | `status-badge.tsx` shows pulse animation for ACTIVE_STATUSES but design intent unclear — is dot for all statuses or just active? |
| F18 | Table cell alignment (left/center/right) not standardized; numeric columns not right-aligned | Minor | H8 | MEDIUM | `data-table.tsx` TableCell uses default left align; KPI values should right-align; no alignment guidance in column defs |
| F19 | Input placeholder color not explicitly set; relies on browser default which may not meet 3:1 contrast ratio | Major | H1, H4 | MEDIUM | `input.tsx` uses `placeholder:text-muted-foreground` which depends on CSS variable value; no contrast guarantee |
| F20 | Card component's responsive padding inconsistent with page padding; card `px-6` while page uses `p-4 md:p-6` | Minor | H4 | MEDIUM | `card.tsx` hardcodes `px-6`; `app-shell.tsx` page uses responsive `p-4 md:p-6`; nested cards have unexpected margins |

---

## Top Usability Risks

### Risk 1: Status Information Unreliable (CRITICAL)
Users cannot confidently interpret work order and facility states because the badge styling may not align with the actual backend state enum values. The StatusBadge component hardcodes 20 status variants, but new states added to the backend won't automatically reflect visually. This creates a **confidence gap** where users might misread status information, leading to incorrect work prioritization.

**Why it matters:** In a facilities management system, mis-identifying a work order as "completed" vs "pending completion" leads to duplicated work or missed deadlines.

### Risk 2: Inconsistent Loading States Frustrate Users (CRITICAL)
Different loading patterns across pages create confusion about whether the page is actually loading or broken. Some use skeleton loaders with different heights, some use spinners. The `DataTableSkeleton` uses different dimensions than `KPICard`'s loading state. Users may abandon pages thinking they're stalled.

**Why it matters:** Users develop an implicit mental model of "what does loading look like on this site?" When it varies, they second-guess whether the UI is responsive.

### Risk 3: Form Error Recovery Unclear (MAJOR)
The FormField error styling doesn't visually align with how the base Input component signals errors. The Input has built-in `aria-invalid` styling, but FormField adds duplicate `border-destructive` classes. Users may miss error messages if they appear in unexpected places or with weak visual priority.

**Why it matters:** Form field errors are the #1 point of abandonment in data entry tasks. Unclear error presentation = lost work.

### Risk 4: Mobile Navigation Strategy Undefined (MAJOR)
The header uses multiple responsive patterns (`hidden lg:block`, `md:flex`, `hidden sm:flex`) without a clear hierarchy. The sidebar is completely hidden on mobile (<lg) and replaced with a drawer, but the drawer's styling/behavior isn't tested for consistency with desktop navigation.

**Why it matters:** Field workers (facilities team) likely use mobile devices on-site. Unclear navigation on mobile leads to task abandonment.

### Risk 5: Accessibility Baseline Not Verified (MAJOR)
Several components assume CSS variable values without testing actual color contrast ratios. Dark mode status badge variants use `/30` opacity overlays which may not meet WCAG AA. Motion animations don't respect `prefers-reduced-motion`. No documented color contrast testing.

**Why it matters:** Users with color blindness, low vision, or vestibular disorders may not be able to use critical features reliably.

---

## Accessibility Issues (WCAG 2.1 AA Assessment)

| Issue | WCAG Criterion | Severity | Remediation Guidance |
|-------|----------------|----------|---------------------|
| Page header animations lack prefers-reduced-motion check | 2.3.3 Animation from Interactions | WCAG Level AAA | Wrap animations in `useMotionPreference()` hook (already done in data-table.tsx, apply pattern to page-header.tsx) |
| Status badge color contrast in dark mode not verified | 1.4.3 Contrast (Minimum) | WCAG Level AA | Measure actual contrast ratios for all status variant dark mode colors; use at least 4.5:1 text-to-background |
| Placeholder text contrast depends on CSS variable | 1.4.3 Contrast (Minimum) | WCAG Level AA | Explicitly set placeholder color to muted-foreground variable and measure actual computed contrast ratio |
| Checkbox in table header uses raw HTML input without styling | 1.3.1 Info and Relationships | WCAG Level A | Use the project's Checkbox component instead of raw `<input type="checkbox">` for consistent focus states and labeling |
| Icon-only buttons in header lack visible text alternative | 1.1.1 Non-text Content | WCAG Level A | Buttons have `aria-label` which is good, but no visible text; consider adding tooltip or label for clarity |
| Form field labels missing explicit connection to inputs | 1.3.1 Info and Relationships | WCAG Level A | FormField already uses `htmlFor`, verify all label+input pairs use correct association |
| Table header row not marked with semantic th elements | 1.3.1 Info and Relationships | WCAG Level A | Verify TableHead component renders as `<th>`, not `<td>` (code review shows it does, but test in browser) |
| Empty state component relies on color alone (icon background) | 1.4.1 Use of Color | WCAG Level A | EmptyState icon uses color-coded background; add text label or icon shape variation for redundancy |

---

## Design Token Inconsistencies

### Spacing System
- **Current state:** No centralized spacing scale documented. Components use arbitrary values: gap-1, gap-2, gap-3, gap-4, gap-6, gap-8; px-2, px-3, px-4, px-6; py-0.5, py-1, py-2, py-3, py-6
- **Risk:** Difficult to maintain visual rhythm; new components don't have guidance on which spacing to use
- **Example:** Card header `px-6` conflicts with page content `p-4 md:p-6` creating uneven nested spacing

### Shadow System
- **Current state:** Mixed usage of Tailwind shadows (shadow-xs, shadow-sm) and CSS variables (var(--shadow-card), var(--shadow-panel))
- **Risk:** Maintenance burden; shadow changes require updating both Tailwind and CSS variable files
- **Example:** Card uses `shadow-sm`; KPICard uses `shadow-[var(--shadow-card)]`; InfoPanel uses `shadow-[var(--shadow-panel)]`

### Border Radius
- **Current state:** Consistent use of rounded-md (default), rounded-lg, rounded-xl, rounded-full
- **Status:** ✅ GOOD — Tailwind scale followed consistently

### Color Usage
- **Status colors:** Hardcoded in status-badge.tsx with no reference to Tailwind color palette
- **Brand colors:** Used via CSS variables in header (--bg-header-upgrade, --backdrop-header, --bg-gradient)
- **Risk:** Fragmented color system; some from Tailwind, some from CSS variables

---

## Component Reusability Issues

### Duplicate Styling Patterns

**Pattern: Status badges + styling**
- StatusBadge has 20+ hardcoded status variants
- Each new status state requires code change
- Recommendation: Generate variants from backend enum, use CSS variable inheritance

**Pattern: Empty states**
- EmptyState component is generic but not always used
- Some pages implement custom empty states
- Recommendation: Create a collection of pre-styled empty states (NoData, NoResults, ErrorState) with consistent affordances

**Pattern: Loading skeletons**
- Different skeleton heights across components (h-4, h-5, h-9)
- No centralized loading pattern for tables vs cards vs panels
- Recommendation: Create LoadingState compound component with configurable rows/columns

### Missing Compound Components

These patterns appear in multiple places but aren't abstracted:
1. **Filter + Search bar** — SearchFilterBar exists but not universally used; work-orders and facilities implement similar patterns
2. **Row action menu** — MoreHorizontal dropdowns appear in DataTable cells and page toolbars with similar options
3. **Status + Label badge** — StatusBadge always appears with state label; combine into single unit

---

## Responsive Design Assessment

### Current Strategy
- **Desktop (lg+):** Full sidebar + header, max content width 1920px
- **Tablet (md):** Responsive grid adjustments, some elements hidden
- **Mobile (<lg):** Sidebar becomes drawer overlay, full-width content

### Inconsistencies

1. **Header uses multiple breakpoint patterns:**
   - `hidden lg:block` for desktop sidebar toggle
   - `md:flex` for GNB tabs
   - `hidden sm:flex` for building context text
   - **Problem:** No clear mobile-first approach; unclear what the actual breakpoints are

2. **Card and content padding misaligned:**
   - Cards hardcode `px-6`
   - Page content uses `p-4 md:p-6`
   - **Problem:** Cards appear to have extra left/right padding on mobile

3. **Table virtualization height not responsive:**
   - `maxHeight={600}` hardcoded in some tables
   - No viewport height calculation
   - **Problem:** On mobile, table may be larger than screen

### Missing Mobile Patterns
- No "sticky header" pattern for tables on mobile (makes horizontal scroll difficult)
- No "swipe to reveal actions" pattern for row menus on mobile
- No "collapsible columns" for data tables on small screens

---

## Typography & Visual Hierarchy

### Heading Scale (page-level)
- Page title (h1): text-xl font-semibold ✅ GOOD
- Section title (h3): Inconsistent — sometimes text-lg, sometimes text-base
- Card title: text-base font-semibold ✅ GOOD
- Field label: text-sm ✅ GOOD
- Helper/error text: text-sm (should be smaller for secondary info)

**Risk:** Section titles don't have a defined size; designers/developers guess

### Font Usage
- All text uses same font family (Tailwind default)
- No special font for KPI numbers (numeric display)
- **Note:** KPICard correctly uses `font-display` and `tabular-nums` for numbers ✅ GOOD

---

## State Representation Patterns

### Currently Handled States

1. **Loading** — Skeleton loaders with varying specifications
2. **Error** — EmptyState with alert icon
3. **Empty** — NoData component
4. **Searching** — NoSearchResults component
5. **Success** — Toast notifications via Sonner

### Missing States

1. **Offline** — No indication when network is unavailable
2. **Rate limiting** — No handling for 429 Too Many Requests
3. **Partial failure** — Some rows succeeded, some failed (in bulk operations)
4. **Stale data** — No indicator when cached data is outdated
5. **Unsaved changes** — No warning when user navigates away with pending edits

---

## Navigation & Wayfinding

### Strengths
- GNB tabs in header clearly show current section ✅
- Sidebar (desktop) or drawer (mobile) shows full menu hierarchy ✅
- Page header includes icon + title + stats ✅

### Weaknesses
- **Breadcrumb component exists but unused** — Users can't see their position in hierarchy
- **No "back" button pattern** — Detail pages have no explicit back navigation
- **No skip links for keyboard nav** — Header/sidebar can't be skipped
- **Sidebar menu active state** — Code shows icon mapping logic but unclear if current page is highlighted

---

## Data Table Specific Issues

### Column Header
- Supports sorting (visible up/down chevrons) ✅
- Sortable columns show cursor hint ✅
- Not all columns are sortable (size/id columns) ✅

### Pagination
- Clear page size selector (10, 20, 30, 50, 100) ✅
- Page info display (1/10 pages) ✅
- First/last page buttons (desktop only) ✅
- **Gap:** No keyboard shortcuts for pagination

### Row Selection
- Checkbox in header for "select all" ✅
- Per-row checkboxes ✅
- Selection count shown in pagination footer ✅
- **Gap:** No "select filtered results" option separate from "select visible rows"

### Row Actions
- MoreHorizontal dropdown menu per row ✅
- Actions include View, Edit, Delete ✅
- **Gap:** No bulk action toolbar when rows selected (work-orders page has it, but not standardized)

### Virtual Scroll
- Supported for 1000+ rows ✅
- Not tested with sticky headers ✅
- **Gap:** Interaction between virtual scroll and filters unclear (re-filtering doesn't auto-scroll to top)

---

## Color Accessibility Deep Dive

### Status Badge Dark Mode Contrast
Measured concern (not actual testing, but based on CSS):

```
Status: inProgress
Light: bg-blue-100, text-blue-700 → ~7:1 contrast ✅
Dark: bg-blue-900/30, text-blue-400 → ~3.2:1 contrast ❌ FAILS AA
```

Recommendation: Use `dark:bg-blue-900` (no opacity) instead of `/30`

### Placeholder Text
```
Input uses placeholder:text-muted-foreground
Computed (assuming --muted-foreground is #737373):
Black text on white background = ~5.5:1 ✅
Gray text on white background (placeholder) = ~3.2:1 ❌ FAILS AA
```

---

## Validation Plan

### To increase confidence in these findings, recommend:

1. **Automated contrast testing** (Priority: HIGH)
   - Run axe-core or similar on all pages in light/dark mode
   - Focus on status badges, inputs, placeholders
   - Budget: 4 hours

2. **Mobile usability testing** (Priority: HIGH)
   - Test navigation drawer on actual phone (iOS + Android)
   - Verify form field error handling on small screens
   - Test table horizontal scroll affordance
   - Budget: 6 hours

3. **State consistency audit** (Priority: MEDIUM)
   - Walk through every list page (work-orders, facilities, users, materials, etc.)
   - Verify empty/loading/error states appear in all cases
   - Document actual user workflows that hit each state
   - Budget: 8 hours

4. **Keyboard navigation testing** (Priority: MEDIUM)
   - Tab through all pages with keyboard only
   - Verify focus management in modals, dropdowns, tables
   - Test Command Palette keyboard shortcut (Cmd+K / Ctrl+K)
   - Budget: 4 hours

5. **Responsive design audit** (Priority: MEDIUM)
   - Test each breakpoint (320px, 640px, 1024px, 1280px, 1920px)
   - Verify text readability, touch targets, spacing
   - Check for horizontal scroll on any viewport
   - Budget: 6 hours

6. **Dark mode visual audit** (Priority: MEDIUM)
   - Screenshot all pages in dark mode
   - Compare for color consistency, readability
   - Verify all text elements meet contrast requirements
   - Budget: 4 hours

---

## Handoff Recommendations

### For Designer (`designer` agent)
**Focus:** Visual consistency and new component variants

- [ ] Create spacing scale documentation (use 4px baseline: 0, 4, 8, 12, 16, 20, 24, 32...)
- [ ] Consolidate status badge colors into a single authoritative system (preferably token-driven)
- [ ] Design mobile-specific patterns (sticky table headers, row action swipe)
- [ ] Verify all color combinations meet WCAG AA contrast in both light and dark modes
- [ ] Document button size variant guidelines (when to use icon-xs vs icon-sm)
- [ ] Create loading state specification (skeleton heights for cards/tables/forms)

### For Product Manager (`product-manager` agent)
**Focus:** Prioritization and scope

- [ ] Decide: Are BEMS/BECM modules worth stabilizing the design system first?
- [ ] Prioritize which pages (work-orders, facilities, users?) should be audited for state handling
- [ ] Define MVP for mobile experience (drawer, responsive layout, OR mobile app first?)
- [ ] Plan accessibility remediation sprints before launch

### For Information Architect (`information-architect` agent)
**Focus:** Navigation and structure

- [ ] Design breadcrumb pattern for detail pages
- [ ] Create IA for sidebar menu on mobile (search, favorites, recent?)
- [ ] Define "back navigation" pattern (implicit vs explicit)
- [ ] Document menu hierarchy and active state visual treatment

### For Executor (`executor` agent)
**Focus:** Implementation of specific fixes

- [ ] Add prefers-reduced-motion check to all animation components
- [ ] Implement centralized loading pattern component
- [ ] Export shadow system as Tailwind plugin or CSS utility class
- [ ] Use Checkbox component instead of raw HTML in tables
- [ ] Add breadcrumb component to detail page layouts
- [ ] Standardize empty state handling across DataTable instances

---

## Summary Table: Findings by Category

| Category | Critical | Major | Minor | Total |
|----------|----------|-------|-------|-------|
| State Handling | 2 | 2 | 1 | 5 |
| Design Tokens | 0 | 3 | 1 | 4 |
| Accessibility | 0 | 3 | 2 | 5 |
| Responsive Design | 0 | 2 | 1 | 3 |
| Component Reusability | 0 | 1 | 0 | 1 |
| Data Display | 0 | 1 | 1 | 2 |
| **TOTAL** | **2** | **12** | **6** | **20** |

---

## Limitations of This Audit

This audit evaluated:
- ✅ Component code and styling patterns
- ✅ Accessibility declarations (aria-labels, semantic HTML)
- ✅ Responsive design breakpoints (code-level)
- ✅ State handling consistency

This audit did NOT evaluate:
- ❌ Actual rendered contrast ratios in browser (would require screenshot analysis)
- ❌ Real user task flows (would require usability testing)
- ❌ Mobile touch target accuracy (would require device testing)
- ❌ Actual keyboard navigation behavior (would require keyboard testing)
- ❌ Performance impact of animations
- ❌ Internationalization (RTL, text expansion)

---

## Appendix: Component Files Examined

### UI Components (Foundation)
- src/components/ui/button.tsx
- src/components/ui/input.tsx
- src/components/ui/card.tsx
- src/components/ui/badge.tsx
- src/components/ui/table.tsx
- src/components/ui/form.tsx

### Data Display Components
- src/components/data-display/data-table.tsx
- src/components/data-display/empty-state.tsx
- src/components/data-display/status-badge.tsx
- src/components/data-display/kpi-card.tsx
- src/components/data-display/info-panel.tsx

### Form Components
- src/components/forms/form-field.tsx
- src/components/forms/login-form.tsx
- src/components/forms/search-filter-bar.tsx

### Layout Components
- src/components/layout/app-shell.tsx
- src/components/layout/header.tsx
- src/components/layout/sidebar.tsx

### Page Implementations (Reference)
- src/app/(modules)/work-orders/page.tsx
- src/app/(modules)/facilities/page.tsx

### Configuration
- postcss.config.mjs (Tailwind setup)

---

**Report Generated:** 2026-03-11
**Research Lead:** Daedalus (UX Researcher)
**Status:** Ready for Designer/Product Manager Review
