# Danawa Auto Sales Radar - Design Guidelines

## Design Approach

**Selected Approach:** Design System (Material Design 3 inspired)
**Rationale:** This is a utility-focused, data-dense dashboard where efficiency and information hierarchy are paramount. The application prioritizes quick data scanning and comparison over emotional engagement.

---

## Core Design Principles

1. **Data First:** Clear numerical hierarchy with supporting context
2. **Scanning Efficiency:** Information organized for rapid comparison
3. **Contextual Clarity:** Each metric's meaning immediately apparent
4. **Professional Restraint:** Minimize decoration, maximize utility

---

## Typography System

**Primary Font:** Inter (via Google Fonts CDN)
- **Headers (H1):** 32px, Bold (700) - Page title only
- **Headers (H2):** 24px, Semibold (600) - Section titles
- **Model Names:** 18px, Semibold (600)
- **Primary Metrics:** 28px, Bold (700) - Sales numbers
- **Secondary Metrics:** 16px, Medium (500) - Change indicators
- **Body/Labels:** 14px, Regular (400)
- **Small Text:** 12px, Regular (400) - Metadata, timestamps

---

## Layout System

**Spacing Units:** Use Tailwind spacing primitives consistently: 2, 4, 6, 8, 12, 16, 24
- Card padding: `p-6`
- Section gaps: `gap-8`
- Container margins: `mx-8` on desktop, `mx-4` on mobile
- Vertical rhythm: `space-y-8` for sections, `space-y-4` within components

**Grid Structure:**
- Desktop (lg): 3-column grid for model cards (`grid-cols-3`)
- Tablet (md): 2-column grid (`grid-cols-2`)
- Mobile: Single column (`grid-cols-1`)
- Max container width: `max-w-7xl mx-auto`

---

## Component Library

### 1. Dashboard Header
- Fixed top bar with subtle shadow
- Left: Logo/Title + Month selector dropdown
- Right: Domestic/Import toggle switch + Data refresh timestamp
- Height: 64px
- Sticky positioning for scroll persistence

### 2. Filter Bar
- Horizontal layout below header
- Minimum sales slider with live value display
- "Exclude new entries" checkbox with clear label
- Results count indicator (e.g., "Showing 18 of 47 models")
- Background slightly distinct from main content area

### 3. Rising Model Cards
**Card Structure (each card contains):**
- Rank badge (circular, top-left corner, 32px diameter)
- Model name (primary, bold)
- Manufacturer name (subtle, above model)
- Large sales number with "units" label
- Change metrics row:
  - Absolute change with up arrow (▲ +1,234 units)
  - Percentage change (+45.6%)
  - Rank movement (↑ 5 positions)
- "View on Danawa" button (full width, bottom)
- Visual separator between metrics using subtle dividers

**Card Styling:**
- Rounded corners: `rounded-lg`
- Padding: `p-6`
- Shadow: `shadow-md` default, `shadow-lg` on hover
- Border: 1px subtle border for definition
- Hover: Slight lift effect (`translate-y-[-4px]` transition)

### 4. Metric Display Pattern
- **Positive changes:** Green accent for increase indicators
- **Negative/neutral:** Grey tones
- **New entries:** Distinctive badge ("신규" or "NEW")
- Use consistent icon set (Heroicons) for arrows/indicators

### 5. Empty States
- Center-aligned message when filters produce no results
- Illustration placeholder or simple icon
- Suggestion text: "Try adjusting filters"

### 6. Loading States
- Skeleton screens matching card layout
- Pulsing animation for loading indicators

---

## Navigation & Interaction

**Primary Actions:**
- Month selector: Dropdown with last 12 months, keyboard navigable
- Toggle switch: Clear labels, immediate state feedback
- Filter controls: Real-time updates (debounced for slider)

**Secondary Actions:**
- "View on Danawa" buttons: Opens in new tab, external link icon
- Card clicks: Optional expansion for additional details

---

## Data Visualization

**Rank Badges:** 
- Top 3: Larger size (40px), distinct treatment
- 4-10: Standard size (32px)
- 11+: Compact size (28px)

**Trend Indicators:**
- Use directional arrows (▲▼) consistently
- Size proportional to significance when space allows
- Always pair numbers with symbols for clarity

---

## Responsive Behavior

**Desktop (1024px+):**
- 3-column card grid
- All filters in single horizontal bar
- Full metric labels visible

**Tablet (768px-1023px):**
- 2-column card grid
- Filters may wrap to second row
- Slightly reduced padding

**Mobile (<768px):**
- Single column cards
- Stacked filter controls
- Condensed metric display (abbreviations acceptable)
- Sticky header collapses to minimal height

---

## Performance Considerations

- Lazy load cards below fold
- Optimize for fast initial paint (critical CSS inline)
- Minimize use of custom fonts (only Inter needed)
- Icons via Heroicons CDN (one library only)

---

## Accessibility Standards

- Semantic HTML structure (proper heading hierarchy)
- ARIA labels for icon-only buttons
- Keyboard navigation for all controls
- Focus indicators visible and clear
- Color not sole indicator of meaning (use icons + text)
- Contrast ratio: minimum 4.5:1 for all text

---

## Images

**No hero image required.** This is a dashboard interface - lead immediately with functional controls and data cards. 

If branding is needed, use a simple logo/wordmark in the header (max 120px wide).