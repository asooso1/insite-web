# Design System Remediation Roadmap

**Purpose:** Actionable steps for fixing identified UX issues (20 findings from design system audit)
**Target Audience:** Designer, executor, product manager
**Timeline:** Phased approach, can be parallelized

---

## Phase 1: Critical Issues (Weeks 1-2)

### P1.1: Centralize Status Badge Styling (F1, F13)

**Problem:** Status badge colors hardcoded; no alignment with backend state enums
**Impact:** Users misread work order status, leading to missed work
**Owner:** Designer + Executor

#### Designer Tasks
```
1. Map all backend status states (WorkOrderState, FacilityState, etc.) to visual styles
2. Create status color palette with light/dark mode variants
3. Verify WCAG AA contrast for all combinations
   - Test: bg-primary text-primary-foreground in both modes
   - Use tools: WebAIM Contrast Checker, Polypane

Expected output: Design spec document
```

#### Executor Tasks
```
1. Generate StatusBadgeVariants from backend enum (don't hardcode)
2. Create utility function: statusToVariant(backendState) -> variant string
3. Update status-badge.tsx to use the mapping
4. Add Storybook stories for all status variants

Code pattern:
// Before: hardcoded in status-badge.tsx
const statusBadgeVariants = cva(..., {
  variants: {
    status: {
      WRITE: "bg-slate-100...",
      ISSUE: "bg-sky-100...",
      // 20+ hardcoded variants
    }
  }
})

// After: generated from enum
import { WorkOrderState } from "@/lib/types/work-order"
const statusToVariant = (state: WorkOrderState): string => {
  const map: Record<WorkOrderState, string> = {
    [WorkOrderState.WRITE]: "write",
    [WorkOrderState.ISSUE]: "issue",
    // ...
  }
  return map[state] ?? "pending"
}

Status variants: { write: "...", issue: "...", }
```

---

### P1.2: Unify Loading State Pattern (F3, F2)

**Problem:** Skeleton loaders have inconsistent heights; empty states handled differently
**Impact:** Users confused about page loading; unclear if page is broken
**Owner:** Designer + Executor

#### Designer Tasks
```
1. Define loading skeleton specification:
   - Single-line skeleton: h-4, w-20 (for labels, short text)
   - Content skeleton: h-5, w-full (for body text, descriptions)
   - Block skeleton: h-10, w-full (for cards, panels)
   - Table row skeleton: h-12, full width (for table cells)

2. Create visual spec showing:
   - Skeleton placement (match final content height exactly)
   - Animation timing (200ms load, hold, 300ms fade out)
   - Light/dark mode variants

Expected output: Storybook component with all skeleton sizes
```

#### Executor Tasks
```
1. Create centralized LoadingState compound component:

  <LoadingState type="table" rows={5} />
  <LoadingState type="card" count={3} />
  <LoadingState type="panel" height="sm" />

2. Replace hardcoded skeletons across components:
   - data-table.tsx: DataTableSkeleton
   - kpi-card.tsx: KPICard loading prop
   - info-panel.tsx: InfoPanel loading prop

3. Example refactor (DataTableSkeleton):

  // Before:
  <TableCell>
    <Skeleton className="h-5 w-full" />
  </TableCell>

  // After:
  <TableCell>
    <LoadingState.Cell />
  </TableCell>
```

#### Product Manager Decision Required
```
Q: Should empty states show a skeleton while loading?
A: Document decision: [Yes] or [No]
   If Yes: Design skeleton + empty state sequence
   If No: Show skeleton OR empty state, not both
```

---

### P1.3: Standardize Form Error Handling (F4, F19)

**Problem:** Form field errors not visually aligned; placeholder contrast uncertain
**Impact:** Users miss error messages, submit invalid forms
**Owner:** Designer + Executor

#### Designer Tasks
```
1. Specify form field error state:
   - Error border: --destructive color
   - Error text: text-destructive, text-sm, below input
   - Error icon (optional): AlertCircle icon next to label
   - Required indicator: red asterisk (*)

2. Test placeholder contrast:
   - Measure actual computed contrast ratio for placeholder text
   - If <3:1: adjust muted-foreground CSS variable

3. Create form field component spec showing:
   - Default state
   - Focused state (ring)
   - Error state (border + text)
   - Disabled state
   - With/without required indicator

Expected output: Interactive Storybook form field component
```

#### Executor Tasks
```
1. Align Input component aria-invalid styling with FormField:

  // input.tsx: Already has
  aria-invalid:border-destructive
  aria-invalid:ring-destructive/20

  // form-field.tsx: Verify it matches
  className={cn(
    error && "border-destructive focus-visible:ring-destructive/50",
    className
  )}

  Result: Same visual treatment

2. Add placeholder contrast test:
   - Write test that computes contrast ratio
   - Assert: contrast >= 3:1

3. Update FormField to show error icon (optional):
   <span className="text-destructive">
    <AlertCircle className="h-4 w-4" />
  </span>
```

---

## Phase 2: Major Issues (Weeks 2-3)

### P2.1: Fix Table/Checkbox Accessibility (F5)

**Problem:** Table header checkbox uses raw HTML `<input>`, not styled component
**Impact:** Inconsistent focus states, keyboard navigation broken
**Owner:** Executor

#### Tasks
```
1. Replace raw HTML checkbox with Checkbox component:

  // Before:
  <input
    type="checkbox"
    checked={table.getIsAllPageRowsSelected()}
    onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
    className="h-4 w-4 rounded border-gray-300"
  />

  // After:
  <Checkbox
    checked={table.getIsAllPageRowsSelected()}
    onCheckedChange={(checked) =>
      table.toggleAllPageRowsSelected(checked as boolean)
    }
    aria-label="전체 선택"
  />

2. Apply same fix to row-level checkboxes (same pattern)

3. Test: Tab through table, verify checkbox focus is visible
```

---

### P2.2: Consolidate Shadow System (F6)

**Problem:** Shadows use mix of Tailwind (shadow-xs) and CSS variables (--shadow-card)
**Impact:** Hard to maintain; changes require updating multiple sources
**Owner:** Executor

#### Tasks
```
1. Choose single source of truth:
   Option A: Use only Tailwind utilities (shadow-sm, shadow-md, shadow-lg)
   Option B: Use only CSS variables (--shadow-card, --shadow-hover)
   Recommendation: Option B (allows runtime dark mode adjustments)

2. If Option B:
   - Add to globals.css (or existing CSS variable file):

   :root {
     --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
     --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1);
     --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
     --shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.1);
     --shadow-card-hover: 0 10px 15px -3px rgb(0 0 0 / 0.1);
     --shadow-panel: 0 2px 8px 0 rgb(0 0 0 / 0.08);
   }

   3. Update components:
   - card.tsx: shadow-sm → shadow-[var(--shadow-sm)]
   - kpi-card.tsx: keep shadow-[var(--shadow-card)]
   - info-panel.tsx: keep shadow-[var(--shadow-panel)]

   Result: Consistent naming, maintainable in one place
```

---

### P2.3: Define Spacing Scale (F7)

**Problem:** No documented spacing system; components use arbitrary values
**Impact:** New components lack guidance; visual rhythm inconsistent
**Owner:** Designer + Executor

#### Designer Tasks
```
1. Document spacing scale based on 4px baseline:

   XS: 2px (gap-0.5) — for very tight spacing
   S: 4px (gap-1) — between tightly related elements
   SM: 8px (gap-2) — default section padding
   MD: 12px (gap-3) — between sections
   LG: 16px (gap-4) — between major sections
   XL: 20px (gap-5) — page margins
   XXL: 24px (gap-6) — large gaps
   XXXL: 32px (gap-8) — very large gaps

2. Specify usage patterns:
   - Header + content: gap-3 or gap-4
   - Form fields: gap-2 or gap-3
   - Card sections: gap-2 internally, gap-4 between cards
   - Page section: gap-6

Expected output: Design spec document with spacing matrix
```

#### Executor Tasks
```
1. Create Tailwind spacing scale (if not already done):
   tailwind.config.ts:

   spacing: {
     0: '0',
     1: '4px',
     2: '8px',
     3: '12px',
     4: '16px',
     ...
   }

   (Tailwind's default is already close to this)

2. Add spacing scale documentation to storybook:
   - Visual guide showing each gap-X value
   - Recommended use cases
   - Do's and don'ts (e.g., "don't use gap-8 inside a card")
```

---

### P2.4: Motion Accessibility (F12)

**Problem:** Animations don't respect prefers-reduced-motion
**Impact:** Users with vestibular disorders experience discomfort
**Owner:** Executor

#### Tasks
```
1. Audit animation usage:
   - page-header.tsx: animate-in fade-in slide-in-from-top-2 ❌
   - data-table.tsx: uses useMotionPreference ✅
   - kpi-card.tsx: uses motion.div ❌ (no prefers check)

2. Fix pattern (apply to all animated components):

   import { useMotionPreference } from "@/lib/hooks/use-motion-preference"

   export function PageHeader(...) {
     const prefersReducedMotion = useMotionPreference()

     return (
       <div
         className={cn(
           prefersReducedMotion ? "" : "animate-in fade-in slide-in-from-top-2"
         )}
       >
         {/* ... */}
       </div>
     )
   }

3. Test: Set macOS > System Preferences > Accessibility > Display > Reduce motion
   Then verify no animations play
```

---

## Phase 3: Medium Issues (Weeks 3-4)

### P3.1: Responsive Design Consistency (F11)

**Problem:** Breakpoint usage mixed (lg:, md:, hidden lg:block pattern)
**Impact:** Unclear mobile-first strategy; layout inconsistent across components
**Owner:** Designer + Executor

#### Designer Tasks
```
1. Define responsive breakpoint strategy:

   Mobile First Approach (RECOMMENDED):
   - Base: mobile (320px)
   - sm: 640px (large phones)
   - md: 768px (tablets)
   - lg: 1024px (small desktop)
   - xl: 1280px (desktop)
   - 2xl: 1536px (large desktop)

2. Document mobile-specific patterns:
   - Navigation: Drawer overlay (full screen)
   - Tables: Horizontal scroll + sticky first column
   - Forms: Full width inputs
   - Cards: Single column on mobile

3. Specify when to hide/show elements:
   - Header GNB tabs: hidden sm: md:flex (show on tablet+)
   - Sidebar: hidden lg:block (show on desktop+)
   - Mobile drawer: flex lg:hidden (show on mobile/tablet)

Expected output: Responsive design spec with breakpoint chart
```

#### Executor Tasks
```
1. Standardize header breakpoints:

  // Before: mixed patterns
  hidden lg:block (sidebar)
  md:flex (GNB)
  hidden sm:flex (building context)

  // After: consistent mobile-first
  - Base: Mobile view (drawer, no tabs, minimal)
  - md:flex (add tablet view)
  - lg:hidden (hide drawer)
  - lg:block (show sidebar)

2. Update app-shell.tsx:
   - Remove hardcoded lg breakpoint check
   - Use Tailwind breakpoint utilities instead

3. Document in storybook:
   - Show layout at each breakpoint
   - Test: resize browser, verify layout changes smoothly
```

---

### P3.2: Breadcrumb Implementation (F16)

**Problem:** Breadcrumb component exists but unused; detail pages have no hierarchy affordance
**Impact:** Users can't see their position in navigation hierarchy
**Owner:** Designer + Executor

#### Designer Tasks
```
1. Define breadcrumb pattern:
   - Show on detail/edit pages only
   - Format: Home > Section > Item
   - Example: Dashboard > Work Orders > WO-001 > Edit

2. Specify visual treatment:
   - Separator: / or >
   - Text color: muted-foreground for separators
   - Last item: not clickable (current page)
   - Hover: underline on clickable items

Expected output: Breadcrumb component spec
```

#### Executor Tasks
```
1. Add breadcrumb to detail page layouts:

  // facility/[id]/page.tsx
  <PageHeader
    title="시설 상세"
    breadcrumbs={[
      { label: "홈", href: "/" },
      { label: "시설", href: "/facilities" },
      { label: facilityName, href: "#" }
    ]}
  />

2. Update PageHeader component to accept breadcrumbs prop:
   <Breadcrumb items={breadcrumbs} />

3. Test: Verify breadcrumbs appear on all detail pages
```

---

### P3.3: Color Contrast Audit & Fix (F10, F19)

**Problem:** Dark mode status badge colors may fail WCAG AA; placeholder contrast unverified
**Impact:** Users with vision deficiencies can't distinguish status information
**Owner:** Designer + Executor

#### Designer Tasks
```
1. Test actual contrast ratios using WebAIM or Polypane:
   - For each status badge variant
   - In both light and dark mode
   - Requirement: 4.5:1 for normal text, 3:1 for large text

2. Document findings:
   ❌ dark:bg-blue-900/30 text-blue-400 = ~3.2:1 FAIL
   ✅ dark:bg-blue-900 text-blue-300 = ~5.1:1 PASS

3. Create color palette with verified contrast
```

#### Executor Tasks
```
1. Update status-badge.tsx with verified colors:

  // Before (likely fails):
  inProgress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"

  // After (verified AA):
  inProgress: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"

2. Add CSS variable for placeholder with verified contrast:
  :root {
    --placeholder-contrast: #666; /* measured 4.2:1 on white */
  }

  input::placeholder {
    color: var(--placeholder-contrast);
  }

3. Create test script:
   - Screenshot all status variants in both modes
   - Run contrast check with axe-core
   - Assert: all >= 4.5:1
```

---

## Phase 4: Minor Issues (Week 4)

### P4.1: Button Icon Sizing Guidance (F8)

**Problem:** 7 button size variants defined; unclear when to use each
**Impact:** Inconsistent icon sizing; developer guesses
**Owner:** Designer + Executor

#### Designer Tasks
```
1. Document button size usage matrix:

   Size    | Height | SVG | Use Case
   --------|--------|-----|---------------------------------------------------
   default | 36px   | 16  | Primary actions, form buttons
   sm      | 32px   | 14  | Secondary actions, filters
   xs      | 24px   | 12  | Compact UI, table actions
   lg      | 40px   | 18  | Hero actions, CTA buttons
   icon    | 36px   | 16  | Standalone icon buttons (consistent with default)
   icon-sm | 32px   | 14  | Compact icon buttons (consistent with sm)
   icon-xs | 24px   | 12  | Minimal icon buttons (consistent with xs)

2. Spec: "If button has text, use size={...}
            If button is icon-only, use size='icon' or size='icon-sm'"

Expected output: Button size spec + examples
```

#### Executor Tasks
```
1. Add JSDoc to button.tsx clarifying size variants:

  /**
   * @param size
   *   - default: 36px height (standard button)
   *   - sm: 32px height (dense layouts, secondary actions)
   *   - xs: 24px height (very compact, inline actions)
   *   - icon: 36px (standalone icon, use instead of default+icon)
   *   - icon-sm: 32px (standalone icon, use instead of sm+icon)
   *   - icon-xs: 24px (standalone icon, use instead of xs+icon)
   */

2. Lint rule: If variant="icon" and children include text, warn
```

---

### P4.2: Typography Scale Documentation (F14)

**Problem:** No hierarchical typography scale for form feedback
**Impact:** Form errors blend with helper text; visual hierarchy unclear
**Owner:** Designer + Executor

#### Designer Tasks
```
1. Define typography scale for forms:

   Usage              | Font Size | Font Weight | Use Case
   -------------------|-----------|-------------|-------------------------
   Label              | 14px      | 500         | Input label, select label
   Helper text        | 12px      | 400         | Hints, supplementary info
   Error message      | 12px      | 500         | Validation errors
   Placeholder        | 14px      | 400         | Input placeholder
   Input text         | 14px      | 400         | User-entered text

2. Color spec:
   - Helper: text-muted-foreground
   - Error: text-destructive (bold for emphasis)

Expected output: Form typography spec with examples
```

#### Executor Tasks
```
Update form-field.tsx FieldWrapper:
- Label: text-sm font-medium ✅ (already correct)
- Helper: text-sm text-muted-foreground ✅ (already correct)
- Error: text-sm text-destructive font-medium (add font-medium for emphasis)
```

---

### P4.3: Table Column Alignment Convention (F18)

**Problem:** Numeric columns not right-aligned; no guidance on alignment
**Impact:** Harder to scan/compare numbers
**Owner:** Designer + Executor

#### Designer Tasks
```
1. Define column alignment rules:

   Column Type        | Alignment | Example
   -------------------|-----------|---------------------------
   Text/names         | Left      | Facility name, user name
   Status/badges      | Left      | Status badge
   Numbers/amounts    | Right     | Quantity, price, ID
   Dates              | Center    | 2026-03-11
   Actions/buttons    | Right     | Edit, Delete, More menu

2. Exception: First column should always be left-aligned (scan starting point)

Expected output: Column alignment spec
```

#### Executor Tasks
```
1. Create utility for column alignment:

  interface ColumnDef {
    // existing...
    align?: 'left' | 'center' | 'right'
  }

  function TableCell({ align = 'left' }) {
    return <td className={cn("text-right" if align === "right")}>
  }

2. Update work-orders/page.tsx columns:
   - facilityDTO.id: right-aligned (numeric ID)
   - quantity: right-aligned (numeric)
   - status: left-aligned (text/badge)
```

---

## Implementation Checklist

### Phase 1 (Weeks 1-2)
- [ ] F1: Status badge styling centralized
- [ ] F1: WCAG AA contrast verified for all statuses
- [ ] F3: Loading skeleton component created
- [ ] F2: Empty state pattern unified across pages
- [ ] F4: Form error styling aligned
- [ ] F19: Input placeholder contrast verified

### Phase 2 (Weeks 2-3)
- [ ] F5: Table checkboxes use Checkbox component
- [ ] F6: Shadow system unified (single source of truth)
- [ ] F7: Spacing scale documented
- [ ] F12: Page header animation respects prefers-reduced-motion
- [ ] F12: All animations use useMotionPreference hook

### Phase 3 (Weeks 3-4)
- [ ] F11: Responsive design breakpoints standardized
- [ ] F11: Mobile-first Tailwind utilities documented
- [ ] F16: Breadcrumb component implemented on detail pages
- [ ] F10: Status badge dark mode colors updated
- [ ] F19: Placeholder color meets 3:1 contrast

### Phase 4 (Week 4)
- [ ] F8: Button size variant usage documented
- [ ] F14: Form typography scale documented
- [ ] F18: Column alignment convention defined
- [ ] Documentation added to Storybook for all components

---

## Testing Strategy

### Automated Testing
```bash
# Accessibility (WCAG AA)
npm run test:a11y

# Contrast ratio checking
npm run test:contrast

# Type checking
npm run type-check

# Visual regression (Storybook)
npm run test:visual
```

### Manual Testing Checklist
```
[ ] Light mode: All UI readable, sufficient contrast
[ ] Dark mode: All UI readable, sufficient contrast
[ ] Mobile (320px): No horizontal scroll, touch targets >= 44px
[ ] Tablet (768px): Layout adjusts correctly
[ ] Desktop (1024px+): Full layout visible
[ ] Keyboard only: Tab through entire page, all interactive elements reachable
[ ] Screen reader: Use NVDA/JAWS, test form labels, status messages
[ ] Mouse: Hover states visible, cursor clear (pointer/default)
[ ] With prefers-reduced-motion: No animations play
```

---

## Success Criteria

When remediation is complete:
- ✅ All 20 findings addressed or documented as out-of-scope
- ✅ Design system audit passes with 0 critical, ≤5 major findings
- ✅ All interactive components tested for keyboard + screen reader
- ✅ Light/dark mode contrast verified with axe-core
- ✅ Responsive design tested at 320px, 768px, 1024px, 1920px
- ✅ Storybook documentation complete for all components
- ✅ New components follow design system guidelines

---

## Reference Documents

- [DESIGN_SYSTEM_AUDIT.md](./DESIGN_SYSTEM_AUDIT.md) — Full audit findings
- [.claude/CLAUDE.md](./.claude/CLAUDE.md) — Project implementation guidelines
- [.claude/rules/coding-style.md](./.claude/rules/coding-style.md) — Code style standards
- Component source: `src/components/`

---

**Last Updated:** 2026-03-11
**Prepared by:** Daedalus (UX Researcher)
**Status:** Ready for Implementation Sprint Planning
