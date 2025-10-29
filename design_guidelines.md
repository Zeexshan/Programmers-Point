# Programmers Point PWA - Design Guidelines

## Core Principles

**Hybrid Approach:** Educational platforms (Coursera/Udemy) for IA + SaaS dashboards (Linear/Notion) for data + gaming UI for interactivity

1. **Touch-First:** 48px minimum for all interactive elements (tablet optimized)
2. **Progressive Disclosure:** Complex info revealed through user actions
3. **Data Hierarchy:** Job market data/placement stats prominently featured
4. **Playful Professionalism:** Educational content + gamified exploration

---

## Typography

**Fonts:** Inter (UI), Poppins (headings)

```
Hero: 3rem (48px) bold, -0.02em tracking
Sections: 2rem (32px) semibold
Cards: 1.25rem (20px) semibold
Body: 1rem (16px) regular, 1.6 line-height
Meta: 0.875rem (14px) medium
Buttons: 1rem (16px) semibold, uppercase, 0.05em tracking
```

**Tablet:** Base 18px, headings scale proportionally

---

## Layout

**Spacing:** Tailwind units: 2, 4, 6, 8, 12, 16, 20, 24

- Container: 1280px max (max-w-7xl)
- Sections: py-16 md:py-24, px-4 md:px-8
- Cards: gap-6 mobile, gap-8 tablet+
- Section margins: mb-12

**Breakpoints:** Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)

---

## Components

### Navigation
- Sticky, 72px height (h-18), logo left (140px), CTA right
- Mobile: hamburger menu, shadow-md on scroll

### Hero Section
- Two-column (stacked mobile), 85vh height
- Left: Heading + subheading + dual CTAs
- Right: Institute photo/tech workspace, rounded-2xl
- Background: Subtle gradient from logo colors

### Stats Bar
- 4-column grid (2x2 mobile), glassmorphism cards
- Large numbers (3rem): "500+ Placements", "15+ Years", "50+ Companies", "95% Success"

### Course Explorer
- **Heading:** "Explore Your Career Path" + "Drag and combine technologies"
- **Categories:** 3-column (Frontend, Backend, Database)
- **Pills:** rounded-full, px-6 py-3, tech icon left, hover: translateY(-2px) + shadow-lg
- **Drop Zone:** 400px min-height, dashed border, pulsing when active
- **Results:** Stack name, package range, vacancies, company chips, particle animation on drop, close button
- **Drag:** cursor-grab/grabbing, shadow-2xl clone, scale-105 on valid drop, vibrate(200) on success

### Technology Cards
```
Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
Structure:
  - Logo (48x48) top-left
  - Name (1.5rem semibold)
  - Metrics (2-col grid):
    💼 Vacancies | 💰 Package
    🏢 Top Hiring | ⭐ GitHub Stars
  - Updated date (bottom-right, small)
Styling: rounded-xl, p-6, hover lift
```

### Placement Showcase
- **Grid:** 4/3/2 columns (desktop/tablet/mobile)
- **Company Cards:** Logo (80x80), name, placement count, avg package
- **Student Modal:** Full-screen overlay
  ```
  Grid: 3/2/1 columns
  Card: Photo (120x120 rounded-full), name, package (large),
        role, masked phone (+91-XXXXX-X7890), course, rounds,
        testimonial (2 lines + "Read More")
  Click: Expanded view
  ```

### Inquiry Form
- Centered (max-w-2xl), 2-col tablet for short fields
- **Fields:** Name, Father's Name, Phone (+91 prefix, 10 digits), Email, DOB (DD/MM/YYYY picker), Course (dropdown), College, Branch
- **Inputs:** h-14 (56px), rounded-lg, border-2, floating labels, red border + message on error
- **Submit:** Full-width mobile, auto-width centered tablet+, 56px height
- **Success:** Checkmark + "Thank you!" + "Submit Another" button

### Admin Panel
- **Sidebar:** 240px desktop/tablet, collapsible mobile
- **Sections:** Dashboard, Inquiries, Placements, Companies, Data Import, Settings, Logout
- **Tables:** Sticky header, 60px rows, action icons (40x40), pagination, search bar (h-12)
- **Import:** Google Sheets URL + progress + summary

### Footer
- **Layout:** 4/2/1 columns (desktop/tablet/mobile)
- **Columns:** Logo + socials (40x40) | Quick Links | Contact | Newsletter
- **Bottom:** Copyright centered, Privacy/Terms links

---

## Animations

### Micro-interactions
```css
Card Hover: translateY(-4px) + shadow-xl
Button Active: scale-95
Success: scale-in + fade-in (500ms ease-out)
Section Reveal: translateY(20px) → 0 on scroll
Card Stagger: 50ms delay between each
```

### Loading
- Skeleton screens (not spinners)

---

## Images

| Type | Location | Description | Treatment |
|------|----------|-------------|-----------|
| Hero | Right 50% | Students at computers/graduates | rounded-2xl, shadow |
| Students | Placement cards | Professional headshots, 1:1 | rounded-full, border |
| Logos | Company cards | Official logos (TCS, Infosys, etc.) | Fixed size, grayscale non-hover |
| Icons | Explorer/cards | Brand icons (React, Java, etc.) | 24x24 or 48x48, brand colors |

---

## Accessibility

- **Focus:** 3px solid outline, 2px offset
- **ARIA:** Labels on icon-only buttons
- **Keyboard:** Tab flow, Enter/Space trigger, Escape closes
- **Touch:** 48x48px minimum, 8px spacing
- **Contrast:** WCAG AA (4.5:1 body, 3:1 large)
- **Forms:** Real-time errors with aria-describedby

---

## PWA Elements

- **Install Prompt:** Bottom sheet after 2 views: "Install for offline access" + Install/Dismiss
- **Offline Toast:** "You're offline. Some features limited."
- **Loading:** Skeleton for job data/placements
- **Icon:** 512x512 maskable, centered logo on solid background

---

## Color System

Use logo colors for:
- Primary CTA buttons
- Active states
- Gradient overlays
- Focus indicators
- Success states

**Implementation:** Define CSS variables from logo, ensure WCAG contrast compliance