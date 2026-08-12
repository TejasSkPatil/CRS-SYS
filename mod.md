# CRM/ERP Project — Modification Log

The requested directory and file structures have been completely generated and successfully verified!

---

## 📋 Modification History

| Date | Category | What was done | Files modified/created |
|------|----------|---------------|------------------------|
| **2026-08-11** | Backend Setup | Initialized packages and configured environment validation rules. | `backend/package.json`, `backend/src/config/env.config.ts` |
| **2026-08-11** | Common & Guards | Added `@Roles` and `@GetUser` decorators with custom `RolesGuard` and `JwtAuthGuard`. | `backend/src/common/decorators/roles.decorator.ts`, `backend/src/common/decorators/get-user.decorator.ts`, `backend/src/common/guards/jwt-auth.guard.ts`, `backend/src/common/guards/roles.guard.ts` |
| **2026-08-11** | Auth Module | Added JWT signing service, bcrypt credential validation, and JWT strategies. | `backend/src/auth/auth.module.ts`, `backend/src/auth/auth.service.ts`, `backend/src/auth/auth.controller.ts`, `backend/src/auth/strategies/jwt.strategy.ts`, `backend/src/auth/dto/login.dto.ts` |
| **2026-08-11** | Database Seeding | Integrated `SeedService` in root AppModule. Seeds users, clients, products on boot if empty. | `backend/src/common/seed.service.ts`, `backend/src/app.module.ts` |
| **2026-08-11** | CRM Customers | Built CRUD controllers and services filtering client visibility based on user roles. | `backend/src/customers/customers.module.ts`, `backend/src/customers/customers.service.ts`, `backend/src/customers/customers.controller.ts`, `backend/src/customers/entities/customer.entity.ts`, `backend/src/customers/dto/create-customer.dto.ts` |
| **2026-08-11** | Product Catalog | Added product entity models, inventory controllers, and schema maps. | `backend/src/products/products.module.ts`, `backend/src/products/products.service.ts`, `backend/src/products/products.controller.ts`, `backend/src/products/entities/product.entity.ts`, `backend/src/products/dto/create-product.dto.ts` |
| **2026-08-11** | Stock Ledger | Atomically log and commit IN/OUT manual stock adjustments inside DB transactions. | `backend/src/stock-movements/stock-movements.module.ts`, `backend/src/stock-movements/stock-movements.service.ts`, `backend/src/stock-movements/stock-movements.controller.ts`, `backend/src/stock-movements/entities/stock-movement.entity.ts`, `backend/src/stock-movements/dto/create-stock-movement.dto.ts` |
| **2026-08-11** | Challan Flow | Embedded delivery dispatching, client invoicing, and automatic cancellations. | `backend/src/challans/challans.module.ts`, `backend/src/challans/challans.service.ts`, `backend/src/challans/challans.controller.ts`, `backend/src/challans/entities/challan.entity.ts`, `backend/src/challans/entities/challan-item.entity.ts`, `backend/src/challans/dto/create-challan.dto.ts` |
| **2026-08-11** | Root Configs | Configured validation pipes, prefix `/api`, and enabled CORS in application entry. | `backend/src/main.ts` |
| **2026-08-11** | Frontend Scaffolding| Scaffolded Vite React-TS project and installed dependencies (lucide, router, axios). | `frontend/*`, `frontend/package.json` |
| **2026-08-11** | UI Styles | Custom styled dark-mode layout with glassmorphic cards and glowing accents. | `frontend/src/index.css`, `frontend/src/App.css` |
| **2026-08-11** | Client & Auth context| Created Axios instance attaching authorization header and React context role helpers. | `frontend/src/api/client.ts`, `frontend/src/auth/auth-context.tsx` |
| **2026-08-11** | Layout & Routes | Created sidebar layout with navigation links based on user roles and route protection. | `frontend/src/components/layout.tsx`, `frontend/src/App.tsx` |
| **2026-08-11** | UI Pages | Implemented Dashboard overview, login page with demo shortcuts, client CRM list, product inventory card grids, stock audit list, and delivery challan state manager. | `frontend/src/pages/login.tsx`, `frontend/src/pages/dashboard.tsx`, `frontend/src/pages/customers.tsx`, `frontend/src/pages/products.tsx`, `frontend/src/pages/stock-movements.tsx`, `frontend/src/pages/challans.tsx` |
| **2026-08-11** | API & Instructions | Formatted Postman collection for fast testing and README describing state machine. | `postman_collection.json`, `README.md` |
| **2026-08-11** | Customer Fields | Added mobile, gstNumber, customerType (Retail/Wholesale/Distributor), status (Lead/Active/Inactive), followUpDate, notes fields to customer entity and DTO. | `backend/src/customers/entities/customer.entity.ts`, `backend/src/customers/dto/create-customer.dto.ts` |
| **2026-08-11** | Product Fields | Added category, minimumStock alert, location/warehouse fields to product entity and DTO. | `backend/src/products/entities/product.entity.ts`, `backend/src/products/dto/create-product.dto.ts` |
| **2026-08-11** | Challan Confirm | Added `confirmed` status; new `PUT /api/challans/:id/confirm` endpoint that deducts stock when sales confirms a draft challan. Cancel reversal also handles confirmed state. | `backend/src/challans/entities/challan.entity.ts`, `backend/src/challans/challans.service.ts`, `backend/src/challans/challans.controller.ts` |
| **2026-08-11** | Seed Data Update | Updated seed service with full customer fields (mobile, GST, type, status, followUpDate, notes) and product fields (category, minimumStock, location). | `backend/src/common/seed.service.ts` |
| **2026-08-11** | Customers UI Overhaul | Full rewrite of Customers page: search bar (name/company/email/phone/GST), status filter (Lead/Active/Inactive), type filter (Retail/Wholesale/Distributor), customer detail view with contact info, CRM notes editor, follow-up date scheduler. Add/Edit drawer includes all new fields. | `frontend/src/pages/customers.tsx` |
| **2026-08-11** | Products UI Overhaul | Full rewrite of Products page: search bar (name/SKU/category/location), category filter dropdown, low-stock alert banner, minimum stock badge with alert icon, location/warehouse display. Add/Edit drawer includes category, minimumStock, location fields. | `frontend/src/pages/products.tsx` |
| **2026-08-11** | Challans UI Update | Added Confirm button (sales can confirm a draft), updated action logic for confirmed state in both list view and detail modal. | `frontend/src/pages/challans.tsx` |
| **2026-08-11** | CSS Additions | Added `.spinner` animation, `.badge-confirmed` for challan confirmed status. | `frontend/src/index.css` |
| **2026-08-11** | GitHub Actions CI/CD | Created `.github/workflows/ci.yml` — runs backend lint+build+test and frontend type-check+build on every push/PR. Docker job builds and pushes backend image to Docker Hub on `main` merges. Also added `backend/Dockerfile` (multi-stage build) and `backend/.dockerignore`. | `.github/workflows/ci.yml`, `backend/Dockerfile`, `backend/.dockerignore` |
| **2026-08-11** | PDF Invoice Export | Added "Download PDF" button in challan detail modal. `exportChallanPDF()` utility generates a premium dark-themed A4 invoice (branded header, billing info, itemized table, totals, notes) using `jspdf` and saves as `<ChallanNumber>.pdf`. | `frontend/src/utils/exportPDF.ts`, `frontend/src/pages/challans.tsx` |





Core Modules Required
1. Authentication and Roles
Create login functionality with role-based access.
Required roles:
•
•
•
•
Admin
Sales
Warehouse
Accounts
Simple JWT-based authentication is acceptable.
2. Customer CRM Module
Create a customer management section.
Each customer should have:
•
Customer name
Mobile number
Email
Business name
GST number, optional
Customer type: Retail, Wholesale, Distributor
Address
Status: Lead, Active, Inactive
Follow-up date
Notes
Required features:
•
•
•
•
•
Add customer
Edit customer
Search customer
View customer detail page
Add follow-up notes
2
3. Product and Inventory Module
Create a product and stock management section.
Each product should have:
•
•
•
•
•
•
•
Product name
SKU/code
Category
Unit price
Current stock
Minimum stock alert quantity
Location/warehouse
Required features:
•
•
Add product
Edit product
Stock movement log should track:
•
•
•
•
•
•
Product
Quantity changed
Movement type: IN or OUT
Reason
Created by
Timestamp
4. Sales Challan Module
Create a sales challan flow.
A sales user should be able to:
•
•
•
•
•
Select customer
Add multiple products
Add quantity for each product
Generate challan number automatically
Save challan as Draft or Confirmed
Important business logic:
•
•
•
•
If challan is confirmed, stock should be reduced.
Stock should not go negative.
If stock is insufficient, API should return a proper error.
Challan should store product snapshot data, not only product ID.
3
Challan fields:
•
•
•
•
•
•
•
Challan number
Customer
Products
Total quantity
Status: Draft, Confirmed, Cancelled
Created by
Created date
API Expectations
Backend should include clean REST APIs.
Examples:
•
•
POST /auth/login
GET /customers
APIs should include:
•
•
•
•
•
Input validation
Proper HTTP status codes
Error messages
Pagination where needed
Search/filter where needed
Frontend Expectations
Create a clean admin-style UI.

API Expectations
Backend should include clean REST APIs.
Examples:
•
•
POST /auth/login
GET /customers
APIs should include:
•
•
•
•
•
Input validation
Proper HTTP status codes
Error messages
Pagination where needed
Search/filter where needed

Bonus Points
Bonus features are not mandatory but will be appreciated:
•
•
•
•
Docker setup
GitHub Actions deployment
Export invoice as PDF


@[mod.md](file;file:///Applications/Agents/CRM/mod.md) here the space between product and sku that will maek the invoice better looking 

@solve [{
	"resource": "/Applications/Agents/CRM/backend/src/challans/entities/challan.entity.ts",
	"owner": "typescript",
	"code": "2307",
	"severity": 8,
	"message": "Cannot find module './challan-item.entity' or its corresponding type declarations.",
	"source": "ts",
	"startLineNumber": 13,
	"startColumn": 29,
	"endLineNumber": 13,
	"endColumn": 52,
	"origin": "extHost1"
},{
	"resource": "/Applications/Agents/CRM/backend/src/challans/entities/challan.entity.ts",
	"owner": "typescript",
	"code": "18046",
	"severity": 8,
	"message": "'item' is of type 'unknown'.",
	"source": "ts",
	"startLineNumber": 54,
	"startColumn": 43,
	"endLineNumber": 54,
	"endColumn": 47,
	"origin": "extHost1"
}]

[{
	"resource": "/Applications/Agents/CRM/frontend/src/pages/customers.tsx",
	"owner": "typescript",
	"code": "6133",
	"severity": 4,
	"message": "'Tag' is declared but its value is never read.",
	"source": "ts",
	"startLineNumber": 19,
	"startColumn": 3,
	"endLineNumber": 19,
	"endColumn": 6,
	"tags": [
		1
	],
	"origin": "extHost1"
}]

@solve
if it is file name error then change it and solve the error
[Fixing Terminal Problems and Errors](conversation;2d6d7f0d-49a9-4239-9500-f317f53b3c7e) 
[{
	"resource": "/Applications/Agents/CRM/frontend/src/index.css",
	"owner": "_generated_diagnostic_collection_name_#3",
	"code": "vendorPrefix",
	"severity": 4,
	"message": "Also define the standard property 'background-clip' for compatibility",
	"source": "css",
	"startLineNumber": 119,
	"startColumn": 3,
	"endLineNumber": 119,
	"endColumn": 26,
	"origin": "extHost1"
},{
	"resource": "/Applications/Agents/CRM/frontend/src/index.css",
	"owner": "_generated_diagnostic_collection_name_#3",
	"code": "vendorPrefix",
	"severity": 4,
	"message": "Also define the standard property 'background-clip' for compatibility",
	"source": "css",
	"startLineNumber": 250,
	"startColumn": 3,
	"endLineNumber": 250,
	"endColumn": 26,
	"origin": "extHost1"
},{
	"resource": "/Applications/Agents/CRM/frontend/src/index.css",
	"owner": "_generated_diagnostic_collection_name_#3",
	"code": "vendorPrefix",
	"severity": 4,
	"message": "Also define the standard property 'background-clip' for compatibility",
	"source": "css",
	"startLineNumber": 628,
	"startColumn": 3,
	"endLineNumber": 628,
	"endColumn": 26,
	"origin": "extHost1"
}]

---

## 🎨 EXISTING FRONTEND DESIGN AUDIT (Baseline for New Design)

> This section documents every design aspect of the current frontend so that
> a new design can be planned on top of this foundation.

---

### 1. Technology Stack (Frontend)
| Item | Detail |
|------|--------|
| Framework | React 19 + TypeScript (Vite 8 bundler) |
| Routing | react-router-dom v7 |
| Icons | lucide-react |
| HTTP client | axios (custom `apiClient` wrapper) |
| PDF export | jspdf + html2canvas |
| Linter | oxlint |
| Styling approach | Single global CSS file (`src/index.css`) — no CSS modules, no Tailwind |

---

### 2. Typography
| Token | Value |
|-------|-------|
| Display font | `'Outfit'` — used for all headings (h1–h6) |
| Body font | `'Plus Jakarta Sans'` — used for all body text |
| Font source | Google Fonts (imported via `@import url(...)` at top of index.css) |
| Heading weight | 600, letter-spacing -0.02em |
| Body smoothing | `-webkit-font-smoothing: antialiased` |
| Label style | 13px, 600 weight, uppercase, letter-spacing 0.05em |
| Badge/utility text | 11px, 700 weight, uppercase |

---

### 3. Color Palette (CSS Custom Properties)
All colors live in `:root` of `index.css`.

#### Backgrounds
| Variable | Value | Usage |
|----------|-------|-------|
| `--bg-main` | `#060913` | Page body background (near-black navy) |
| `--bg-card` | `rgba(13,20,38,0.45)` | Glassmorphic card background |
| `--bg-sidebar` | `rgba(8,12,24,0.95)` | Sidebar panel |
| `--bg-input` | `rgba(17,24,47,0.8)` | Form inputs / selects / textareas |

#### Borders
| Variable | Value |
|----------|-------|
| `--border-color` | `rgba(255,255,255,0.07)` — very subtle white border |
| `--border-focus` | `rgba(14,165,233,0.5)` — sky-blue glow on focus |

#### Text
| Variable | Value |
|----------|-------|
| `--text-primary` | `#f8fafc` — near white |
| `--text-secondary` | `#94a3b8` — slate-400 |
| `--text-muted` | `#64748b` — slate-500 |

#### Accent / Semantic Colors
| Variable | Hex | Semantic |
|----------|-----|----------|
| `--color-primary` | `#0ea5e9` | Sky Blue — primary brand, CTA buttons, active nav |
| `--color-accent` | `#06b6d4` | Cyan — gradient pair with primary |
| `--color-success` | `#10b981` | Emerald — delivered/active status |
| `--color-warning` | `#f59e0b` | Amber — draft/pending status |
| `--color-danger` | `#ef4444` | Rose — cancelled/error/logout |
| `--color-info` | `#8b5cf6` | Violet — invoiced status / info cards |

Each color has a `*-glow` rgba counterpart (15% opacity) for glow backgrounds on badges/cards.

#### Body Gradient
Body has a **fixed radial gradient** with:
- Top-left: `rgba(14,165,233,0.1)` — subtle sky-blue orb
- Bottom-right: `rgba(139,92,246,0.1)` — subtle violet orb

---

### 4. Spacing & Border Radius
| Variable | Value |
|----------|-------|
| `--radius-sm` | `8px` |
| `--radius-md` | `12px` |
| `--radius-lg` | `20px` |
| Card padding | `24px` |
| Main content padding | `40px` |
| Sidebar padding | `24px` (logo area), `24px 16px` (nav menu) |
| Page header bottom margin | `32px`, bottom border `1px solid var(--border-color)` |

---

### 5. Shadow System
| Variable | Value |
|----------|-------|
| `--shadow-sm` | `0 2px 8px rgba(0,0,0,0.5)` |
| `--shadow-md` | `0 8px 30px rgba(0,0,0,0.7)` |
| `--shadow-lg` | `0 12px 40px rgba(0,0,0,0.8)` |

---

### 6. Layout Architecture

```
┌─────────────────────────────────────────────────────────┐
│  .sidebar (280px fixed, left, full height, blur 20px)   │
│  ┌─────────────────────────────────────────────────┐    │
│  │  .sidebar-logo  [logo-icon Ω] [logo-text]       │    │
│  ├─────────────────────────────────────────────────┤    │
│  │  .sidebar-menu (flex col, scrollable)            │    │
│  │    .menu-item  [icon] [label]   (NavLink)        │    │
│  │    .menu-item.active → sky-blue glow             │    │
│  ├─────────────────────────────────────────────────┤    │
│  │  .sidebar-footer                                 │    │
│  │    .user-profile-badge  [avatar] [name/role]     │    │
│  │    .logout-btn  (red border, danger color)       │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  .main-content (margin-left: 280px, padding: 40px)      │
│  ┌─────────────────────────────────────────────────┐    │
│  │  .page-header  [.page-title] [action buttons]   │    │
│  │  .grid.grid-cols-4 → metric cards               │    │
│  │  .grid.grid-cols-2 → content cards              │    │
│  │  .table-container → .table                      │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

### 7. Glassmorphism Card System
- **`.card`**: `background: rgba(13,20,38,0.45)`, `backdrop-filter: blur(16px)`, 1px subtle border
- **Accent top-bar**: 4px tall `::before` pseudo-element at top of card, colored by variant:
  - `.card-primary` → sky-blue bar
  - `.card-success` → emerald bar
  - `.card-warning` → amber bar
  - `.card-danger` → rose bar
  - `.card-info` → violet bar
- **Hover**: `translateY(-2px)`, slightly brighter border

---

### 8. Navigation (Sidebar)
- **5 nav items** (role-gated):
  1. Dashboard — all roles
  2. Customers (CRM) — admin, sales, accounts
  3. Inventory — all roles
  4. Stock Movements — admin, warehouse
  5. Sales Challans — all roles
- **Active state**: sky-blue background glow, `border-color: rgba(14,165,233,0.15)`, text becomes `--color-primary`
- **Logo**: Text symbol `Ω`, gradient icon box (primary→accent), brand name `AETHER ERP`
- **User badge**: Circular avatar (initials), name + role label, Sign Out button (red danger style)

---

### 9. Button System
| Class | Style |
|-------|-------|
| `.btn-primary` | Gradient `#0ea5e9 → #06b6d4`, white text, cyan glow shadow |
| `.btn-secondary` | Semi-transparent white bg, subtle border |
| `.btn-danger` | Solid `#ef4444`, rose glow shadow |
| `.btn-success` | Solid `#10b981`, emerald glow shadow |
| `.btn-sm` | Reduced padding `6px 12px`, font-size 12px |
| Hover behavior | `translateY(-1px)` + stronger shadow on primary |

---

### 10. Form & Input System
- Background: `rgba(17,24,47,0.8)` — dark navy
- Border: `rgba(255,255,255,0.07)` — barely visible
- Focus: border becomes `--color-primary`, 3px sky-blue glow ring
- Label: 13px, 600 weight, `--text-secondary`
- `.form-row`: 2-column grid layout for side-by-side fields
- Icons are used as left-adornments inside inputs (e.g., login page: `UserIcon`, `KeyRound`)

---

### 11. Table System
- Container: glasscard + `overflow:hidden` + `backdrop-filter: blur(16px)`
- `<th>`: 12px uppercase, 700 weight, `--text-secondary`, bg `rgba(255,255,255,0.02)`
- `<td>`: 14px, 18px/24px padding, bottom-border hairline
- Row hover: extremely subtle white overlay `rgba(255,255,255,0.01)`

---

### 12. Badge / Status System
All badges are pill-shaped (`border-radius: 9999px`), with a colored dot `::before` pseudo-element.

| Class | Color | Used For |
|-------|-------|----------|
| `.badge-draft` | Amber | Challan Draft, Customer Lead |
| `.badge-delivered` | Emerald | Delivered, Customer Active, Stock IN |
| `.badge-invoiced` | Violet | Challan Invoiced |
| `.badge-cancelled` | Rose | Cancelled, Customer Inactive, Stock OUT |
| `.badge-confirmed` | Emerald | Challan Confirmed |

Customer status also maps existing badges:
- Lead → `badge-draft` (amber)
- Active → `badge-delivered` (green)
- Inactive → `badge-cancelled` (red)

---

### 13. Slide Drawer (Modal)
- **Backdrop**: `rgba(0,0,0,0.6)` + `backdrop-filter: blur(4px)`, covers full viewport
- **Drawer panel**: 480px wide, slides in from right (`slideIn` keyframe, `cubic-bezier(0.16,1,0.3,1)`)
- Background: `#090e1e` (dark navy solid, no transparency)
- Padding: `40px`, gap: `32px` between sections
- Header: title (22px 700) + close (X) button

---

### 14. Auth / Login Page
- **Layout**: Centered card on full-height page
- **Card**: `max-width: 420px`, `border-radius: var(--radius-lg)` (20px), `backdrop-filter: blur(24px)`
- **Logo icon**: `Ω` symbol, 48×48px, gradient background, 12px radius
- **Title**: gradient text (white → slate), `font-size: 24px`
- **Demo shortcut grid**: 2-column grid of role shortcut buttons
  - Roles: `admin`, `sales`, `warehouse`, `accounts`
  - Click pre-fills the login form credentials

---

### 15. Pages — Summary of UI Patterns

#### Dashboard (`/`)
- Page title: "Operational Dashboard"
- **4 metric cards** (grid-cols-4): Clients, Products, Invoiced Value, Accounts Receivable
- **2 content cards** (grid-cols-2):
  - "Delivery & Invoicing Lifecycle" — 3 status rows (Draft, Delivered, Completed)
  - "Recent Sales Challans" — last 5 challans with badge + amount

#### Customers (`/customers`)
- **List view** with search bar (name/company/email/phone/GST) + 2 filter dropdowns (Status, Type)
- **Detail view** — clicking a row shows full profile, contact info, CRM notes editor, follow-up date
- **Add/Edit drawer** — all fields including mobile, GST, type, status, follow-up, balance, assigned sales
- Inline status icons per row (Clock=Lead, CheckCircle=Active, AlertCircle=Inactive)
- Type color-coded pills: Retail=blue, Wholesale=violet, Distributor=amber

#### Inventory / Products (`/products`)
- **Card grid** (not table) — each product shown as a glassmorphic card
- Search bar + category filter dropdown
- **Low-stock alert banner** at top if any product is below `minimumStock`
- Product card shows: name, SKU, category, price, stock qty with color indicator, location/warehouse badge
- **Stock Adjustment drawer** — IN/OUT quantity, reference field

#### Stock Movements (`/stock-movements`)
- Pure **table view** — Date/Time, Product (name + SKU), Direction badge, Qty, Reference, Processed By
- No create/edit — read-only audit log
- IN = emerald badge, OUT = rose badge; qty color-coded accordingly

#### Sales Challans (`/challans`)
- **Table list** with challan number, customer, amount, status badge, date, action buttons
- **Detail modal/drawer** — full challan view with items table, customer info, notes, PDF export button
- **Create drawer** — select customer, add line items (product + qty), notes
- Status flow: draft → confirmed → delivered → invoiced / cancelled
- **PDF Export**: dark-themed A4 invoice generated client-side via jspdf

---

### 16. Animations & Micro-interactions
| Element | Animation |
|---------|-----------|
| Card hover | `translateY(-2px)`, transition `0.3s cubic-bezier(0.16,1,0.3,1)` |
| Button hover | `translateY(-1px)`, stronger glow shadow |
| Drawer open | `slideIn` from right, `0.3s cubic-bezier(0.16,1,0.3,1)` |
| Nav item hover | bg + text color shift, `0.2s ease` |
| Input focus | border glow ring, `0.2s ease` |
| Logout button hover | Red background fill, `0.2s ease` |
| Spinner (loading) | `spin` keyframe, `0.7s linear infinite` |
| Scrollbar | Custom dark track, `rgba(255,255,255,0.1)` thumb |

---

### 17. Responsive / Layout Notes
- Layout is **not responsive** — fixed 280px sidebar, `margin-left: 280px` main content
- No media queries present — desktop-only design
- Grids use `auto-fit minmax()` so cards reflow, but sidebar is always visible
- Scrollbar is custom-styled (webkit only)

---

### 18. Identified Design Gaps / Limitations (for new design to address)
1. No responsive/mobile layout — sidebar always fixed
2. No top navigation bar / breadcrumbs
3. Inline `style={{}}` used heavily in JSX (not design-system driven)
4. No dark/light theme toggle
5. No notification/toast system (errors shown via `alert-banner` only)
6. Dashboard has no charts or data visualization
7. No skeleton loaders — only plain text "Loading…" states
8. Products page is card-grid while other pages are table — inconsistent pattern
9. No pagination — all data loaded at once
10. No global search across modules
11. Drawer width fixed at 480px — could be wider for complex forms
12. Currency hardcoded to USD — should be INR for Indian ERP context
13. Brand name "AETHER ERP" does not match project context (CRM/ERP)

---

> ✅ This audit is complete. Share your new design plan here on the next lines and it will be implemented.



# Aether CRM — black & white sharp-edge redesign
 
This plan retextures the existing glassmorphic navy/sky-blue interface into a
monochrome, hard-edged "instrument panel" look. It changes **only** color,
shape, border, shadow, and motion tokens — every layout, grid, sidebar
width, drawer position, and component placement documented in the audit
stays exactly where it is.
 
Work is split into six phases, each independently shippable and reviewable.
Each phase has its own scope, its own files touched, and its own prompt to
hand to your coding agent (Claude Code / Antigravity). Run them in order —
later phases assume earlier ones landed.
 
---
 
## Phase 1 — Foundation tokens
 
**Goal:** swap the color, border, and text variables in `:root`. This alone
recolors the entire app, since every component already reads from these
variables.
 
**Files touched:** `src/index.css` (`:root` block only).
 
### Backgrounds
| Variable | Old | New |
|---|---|---|
| `--bg-main` | `#060913` | `#0A0A0A` |
| `--bg-card` | `rgba(13,20,38,0.45)` blur(16px) | `#141414` solid |
| `--bg-sidebar` | `rgba(8,12,24,0.95)` | `#000000` |
| `--bg-input` | `rgba(17,24,47,0.8)` | `#161616` |
 
### Borders
| Variable | Old | New |
|---|---|---|
| `--border-color` | `rgba(255,255,255,0.07)` | `rgba(255,255,255,0.14)` |
| `--border-focus` | `rgba(14,165,233,0.5)` sky glow | `#FFFFFF` solid |
 
### Text
| Variable | Old | New |
|---|---|---|
| `--text-primary` | `#f8fafc` | `#FFFFFF` |
| `--text-secondary` | `#94a3b8` | `#A3A3A3` |
| `--text-muted` | `#64748b` | `#6B6B6B` |
 
### Accent / semantic
White replaces sky-blue as the only interactive accent. Danger red and
success green are kept — they carry real operational meaning (cancelled vs.
delivered stock). Warning and info collapse to grayscale, distinguished by
icon + label instead of hue.
 
| Variable | Old | New |
|---|---|---|
| `--color-primary` | `#0ea5e9` | `#FFFFFF` |
| `--color-accent` | `#06b6d4` | `#D4D4D4` |
| `--color-success` | `#10b981` | `#22C55E` |
| `--color-warning` | `#f59e0b` | `#A3A3A3` |
| `--color-danger` | `#ef4444` | `#EF4444` |
| `--color-info` | `#8b5cf6` | `#A3A3A3` |
 
Remove every `*-glow` rgba token — nothing in later phases should reference
them.
 
### Phase 1 prompt
 
> Update only the `:root` variable block in `src/index.css`. Do not touch
> any component file, any class definition outside `:root`, or any layout
> CSS. Change these variables to the following values:
>
> `--bg-main: #0A0A0A`, `--bg-card: #141414`, `--bg-sidebar: #000000`,
> `--bg-input: #161616`, `--border-color: rgba(255,255,255,0.14)`,
> `--border-focus: #FFFFFF`, `--text-primary: #FFFFFF`,
> `--text-secondary: #A3A3A3`, `--text-muted: #6B6B6B`,
> `--color-primary: #FFFFFF`, `--color-accent: #D4D4D4`,
> `--color-success: #22C55E`, `--color-warning: #A3A3A3`,
> `--color-danger: #EF4444`, `--color-info: #A3A3A3`.
>
> Delete every `*-glow` rgba variable (`--color-primary-glow` and siblings)
> and search the codebase for any place that still references them — leave
> those references in place but flag them in your output so I know what
> phase 2 needs to fix. Do not remove `backdrop-filter: blur()` yet, do not
> change border-radius, do not touch shadows — those are later phases. Show
> me the full diff of `:root` before finishing.
 
---
 
## Phase 2 — Shape: radius, glassmorphism removal, badges
 
**Goal:** flatten every rounded surface to hard corners and remove the
glass blur effect, since phase 1 only changed color, not shape.
 
**Files touched:** `src/index.css` (`--radius-*` variables, `.card`,
`.badge-*` rules, any `backdrop-filter` declarations).
 
| Variable | Old | New |
|---|---|---|
| `--radius-sm` | `8px` | `0px` |
| `--radius-md` | `12px` | `0px` |
| `--radius-lg` | `20px` | `0px` |
 
- Remove `backdrop-filter: blur(...)` from `.card`, `.sidebar`,
  `.table-container`, and the drawer panel — they now rely on solid
  `--bg-card` / `--bg-sidebar` from phase 1 instead of translucency.
- Convert badges from pill (`border-radius: 9999px`) to a rectangular tag
  with a small solid square dot before the label, replacing the colored
  `::before` dot.
- Card accent top-bars (the 4px `::before` bar) stay in place and keep
  their position — only `.card-primary`/`.card-accent`/`.card-info` shift
  to white/gray fills; `.card-danger` and `.card-success` keep their color.
### Phase 2 prompt
 
> Building on the phase 1 token changes already in `src/index.css`, make
> these shape changes without touching layout, positioning, or any
> component's JSX:
>
> Set `--radius-sm`, `--radius-md`, and `--radius-lg` all to `0px`.
>
> Remove `backdrop-filter: blur(...)` from every rule that has it — `.card`,
> `.sidebar`, `.table-container`, and the slide-drawer panel should now be
> fully opaque, relying on the solid background colors already in place.
>
> Change `.badge-*` rules from `border-radius: 9999px` (pill) to `0px`
> (rectangle). Replace the colored `::before` dot with a small solid square
> dot, same size, same position, using the badge's existing semantic color
> variable.
>
> For the card accent top-bar (`::before`, 4px tall): change
> `.card-primary`, `.card-accent`, and `.card-info` variants to use
> `--color-primary` (now white) or `--text-secondary` (gray) as their fill.
> Leave `.card-danger` and `.card-success` exactly as they are — they should
> still show red and green.
>
> Do not change shadows yet, do not add typography changes, do not touch
> hover/focus states — those are later phases. Show me the diff before
> finishing.
 
---
 
## Phase 3 — Shadows: hard offset instead of soft blur
 
**Goal:** replace the soft, blurred drop shadows with hard, un-blurred
offset shadows so the flat black/white palette still reads as tactile
rather than dead.
 
**Files touched:** `src/index.css` (`--shadow-*` variables only).
 
| Variable | Old | New |
|---|---|---|
| `--shadow-sm` | `0 2px 8px rgba(0,0,0,0.5)` | `2px 2px 0 rgba(255,255,255,0.08)` |
| `--shadow-md` | `0 8px 30px rgba(0,0,0,0.7)` | `4px 4px 0 rgba(255,255,255,0.10)` |
| `--shadow-lg` | `0 12px 40px rgba(0,0,0,0.8)` | `6px 6px 0 rgba(255,255,255,0.12)` |
 
### Phase 3 prompt
 
> Update only the `--shadow-sm`, `--shadow-md`, and `--shadow-lg` variables
> in `src/index.css`. Replace the current soft blurred shadows with hard,
> zero-blur offset shadows:
>
> `--shadow-sm: 2px 2px 0 rgba(255,255,255,0.08)`
> `--shadow-md: 4px 4px 0 rgba(255,255,255,0.10)`
> `--shadow-lg: 6px 6px 0 rgba(255,255,255,0.12)`
>
> Don't change which elements use which shadow variable, don't add new
> shadow usage, don't touch hover states yet — that's phase 5. Show me the
> diff before finishing.
 
---
 
## Phase 4 — Body background: grid instead of gradient orbs
 
**Goal:** remove the two colored radial gradient orbs on `body` and replace
with a low-opacity monochrome grid, keeping the same "instrument panel"
motif without any hue.
 
**Files touched:** `src/index.css` (`body` background rule only).
 
### Phase 4 prompt
 
> In `src/index.css`, find the `body` rule that currently sets a fixed
> radial gradient background (the sky-blue top-left orb and violet
> bottom-right orb). Replace it with a fixed, low-opacity grid pattern:
> `rgba(255,255,255,0.03)` lines, 1px thick, 32px spacing, both horizontal
> and vertical (a `linear-gradient` repeating pattern works well here).
> Keep `--bg-main` as the base color underneath it. Don't change anything
> else in the file. Show me the diff before finishing.
 
---
 
## Phase 5 — Typography: mono for data
 
**Goal:** give numbers, metrics, and badges their own monospace face so the
dashboard reads as data instrumentation rather than a re-colored version of
the same UI. This is the one optional phase — skip it if you want a purely
color/shape change.
 
**Files touched:** `index.html` or `src/index.css` (font import),
`src/index.css` (new `--font-mono` variable + apply to specific selectors).
 
| Role | Old | New |
|---|---|---|
| Headings | Outfit | Outfit *(unchanged)* |
| Body | Plus Jakarta Sans | Plus Jakarta Sans *(unchanged)* |
| Numbers / metrics / table figures / badges | Plus Jakarta Sans | IBM Plex Mono |
 
### Phase 5 prompt
 
> Add IBM Plex Mono via Google Fonts (same `@import` pattern already used
> for Outfit and Plus Jakarta Sans in `src/index.css`). Add a new
> `--font-mono: 'IBM Plex Mono', monospace` variable to `:root`.
>
> Apply `font-family: var(--font-mono)` to: the numeric value inside each
> dashboard metric card, all numeric table columns (amounts, quantities,
> counts — not text columns like customer name), badge label text, and the
> sidebar user-role label. Do not change Outfit or Plus Jakarta Sans usage
> anywhere else. Do not change font sizes or weights unless the mono face
> renders visibly smaller at the current size, in which case bump by 1px
> only. Show me the diff before finishing.
 
---
 
## Phase 6 — Interaction states
 
**Goal:** update hover, focus, and active states to match the flat/hard
aesthetic instead of the old glow-based feedback. This is the only phase
that changes behavior (transitions), not just static appearance.
 
**Files touched:** `src/index.css` (`.card:hover`, `.btn-*:hover`,
`.menu-item.active`/`.menu-item:hover`, input `:focus`, `.table tr:hover`).
 
| Element | Old | New |
|---|---|---|
| Card hover | `translateY(-2px)` + brighter border | `translateY(-2px)`, shadow steps `sm`→`md` |
| Button hover | `translateY(-1px)` + glow | invert bg white↔black, keep `translateY(-1px)` |
| Nav item active/hover | bg glow + color shift | solid 3px white left-border + `rgba(255,255,255,0.06)` bg |
| Input focus | color glow ring | solid 2px white ring, no blur |
| Table row hover | `rgba(255,255,255,0.01)` | `rgba(255,255,255,0.04)` + 2px white left-border tick |
 
### Phase 6 prompt
 
> Update these interaction states in `src/index.css`. Keep every existing
> transition timing and easing curve — only change what property animates
> to, not how fast or with what curve:
>
> `.card:hover` — keep `transform: translateY(-2px)`, but change
> `box-shadow` to step from `var(--shadow-sm)` to `var(--shadow-md)` on
> hover instead of brightening the border color.
>
> `.btn-primary:hover` and `.btn-secondary:hover` — remove the glow
> box-shadow, instead invert background and text color (white bg/black
> text ↔ black bg/white text depending on current state), keep
> `transform: translateY(-1px)`.
>
> `.menu-item.active` and `.menu-item:hover` — remove the background glow,
> add `border-left: 3px solid #FFFFFF` and `background:
> rgba(255,255,255,0.06)`.
>
> Input `:focus` — replace the glow ring with `box-shadow: 0 0 0 2px
> #FFFFFF`, no blur radius.
>
> `.table tr:hover` — change background to `rgba(255,255,255,0.04)` and add
> `border-left: 2px solid #FFFFFF`.
>
> Don't touch the drawer's slide-in animation — that stays as-is. Show me
> the diff before finishing.
 
---
 
## Phase 7 — Cleanup pass
 
**Goal:** find and fix any place in component files that hardcodes the old
hex values directly (inline `style={{}}` blocks) instead of referencing the
CSS variables, so nothing reverts to the old palette after phases 1–6.
 
**Files touched:** any `.tsx` file with inline styles referencing colors.
 
nop
 
> Search the entire `src/` directory for inline `style={{}}` props or
> styled-jsx blocks that hardcode any of these old hex/rgba values directly
> instead of referencing the CSS variable: `#060913`, `#0ea5e9`, `#06b6d4`,
> `#10b981`, `#f59e0b`, `#8b5cf6`, `rgba(13,20,38`, `rgba(8,12,24`,
> `rgba(17,24,47`, `rgba(14,165,233`, `rgba(139,92,246`, `8px`, `12px`,
> `20px` (only where used as a border-radius on a card/button/input/badge).
> For each match, replace the hardcoded value with the corresponding CSS
> variable (`var(--bg-main)`, `var(--color-primary)`, `var(--radius-sm)`,
> etc.) so it now inherits the phase 1–6 changes automatically. List every
> file you changed and show me the diff for each before finishing. Do not
> change any layout, positioning, or JSX structure — value substitution
> only.
 
---
 
## Non-goals (apply to all phases)
 
- No DOM restructuring, no component repositioning, no grid/flex layout
  changes.
- No new pages, no new nav items, no responsive/mobile pass.
- No conversion of the Products page to a table (stays a card grid).
- Currency formatting and the "AETHER ERP" name are unchanged.
 



 PHASE 1 — Validation Architecture
PHASE 1 — SET UP VALIDATION ARCHITECTURE ONLY

Implement the validation foundation for the CRM backend using NestJS + TypeScript.

IMPORTANT:
- This phase is ONLY about validation.
- Do not implement authentication, customers, products, stock, challans, frontend, Docker, or other business modules yet.
- Use NestJS ValidationPipe globally.
- Use class-validator and class-transformer.
- Validation must happen on the backend.
- Never rely only on frontend validation.
- Enable:
  - whitelist: true
  - forbidNonWhitelisted: true
  - transform: true
- Return clean, meaningful validation errors.
- Keep validation reusable and maintainable.

Do not modify unrelated functionality.
PHASE 2 — Common String Validation
PHASE 2 — COMMON STRING VALIDATION

Implement reusable validation rules for string fields.

Rules:
- Required fields must reject null, undefined, and empty strings.
- Trim leading/trailing whitespace.
- Reject strings containing only spaces.
- Define reasonable minimum and maximum lengths.
- Reject unexpected extra fields where DTO validation applies.
- Do not silently accept invalid data.
- Validation errors must clearly identify the field and the reason.

Do not implement customer/product/challan business logic yet.
Only create reusable/common validation behavior.
PHASE 3 — Person/Customer Name Validation
PHASE 3 — NAME VALIDATION

Implement validation for all person/customer names.

Rules:
- Name is required.
- Minimum 2 characters.
- Maximum 100 characters.
- Allow alphabetic characters and spaces.
- Do not allow numbers.
- Do not allow special characters.
- Do not allow empty or whitespace-only names.
- Trim leading/trailing spaces.

Examples:
VALID:
Rahul Patil
Tejas Patil

INVALID:
Rahul123
Rahul@Patil
12345
"   "

Use backend DTO validation.
Return a clear validation message when invalid.
PHASE 4 — Indian Mobile Number Validation
PHASE 4 — MOBILE NUMBER VALIDATION

Implement strict Indian mobile number validation.

Rules:
- Required.
- Must start with +91.
- Must contain exactly 10 digits after +91.
- Total format must be +91XXXXXXXXXX.
- After +91, first digit must be 6, 7, 8, or 9.
- No spaces.
- No hyphens.
- No alphabetic characters.
- No extra digits.

Valid:
+919876543210
+916987654321

Invalid:
9876543210
+91987654321
+9198765432100
+915876543210
+91 9876543210
+91-9876543210

Use backend validation and return a clear error message.
PHASE 5 — Email Validation
PHASE 5 — EMAIL VALIDATION

Implement strict email validation.

Rules:
- Email is required where the field is mandatory.
- Must contain @.
- Must contain a valid domain.
- Must contain a valid domain extension.
- No spaces.
- Reject malformed emails.
- Convert email to lowercase before storing if appropriate.

Valid:
bslohkande6@gmail.com
tejas.patil@gmail.com

Invalid:
bslohkande6gmail.com
bslohkande6@
@gmail.com
bslohkande6@gmail
bslohkande6 @gmail.com

Use class-validator email validation or a reliable email validator.
PHASE 6 — GSTIN Validation
PHASE 6 — GSTIN VALIDATION

Implement Indian GSTIN validation.

IMPORTANT:
GSTIN is 15 characters, NOT 16 digits.

Rules:
- GSTIN is OPTIONAL.
- If GSTIN is not provided, validation should pass.
- If provided, it must contain exactly 15 characters.
- GSTIN must follow the standard Indian GSTIN alphanumeric structure.
- Convert GSTIN to uppercase before validation/storage if appropriate.
- Reject spaces and invalid characters.
- Reject GSTINs with incorrect length.
- Reject purely numeric GST values.
- Reject values longer or shorter than 15 characters.

Example format:
27ABCDE1234F1Z5

Do not make GSTIN mandatory because the case study specifies it as optional.
PHASE 7 — Customer Enum & Address Validation
PHASE 7 — CUSTOMER FIELD VALIDATION

Implement validation for customer-specific fields.

Customer Type:
Only:
- Retail
- Wholesale
- Distributor

Reject any other value.

Customer Status:
Only:
- Lead
- Active
- Inactive

Reject any other value.

Address:
- Required where specified.
- Must not be empty or whitespace-only.
- Apply reasonable maximum length.
- Reject unexpected invalid input.

PIN code:
- Must contain exactly 6 digits.
- No letters.
- No spaces.
- No special characters.

Valid:
411001
422001

Invalid:
41101
4110012
ABC123
41A001

Do not implement state/Maharashtra validation.
PHASE 8 — Date Validation
PHASE 8 — DATE VALIDATION

Implement backend date validation for follow-up dates.

Rules:
- Date must be a valid date.
- Reject malformed dates.
- Reject impossible dates.
- Follow-up date MUST NOT be before the current date.
- Today is valid.
- Future dates are valid.
- Yesterday and older dates are invalid.

Example if today is 2026-08-11:

VALID:
2026-08-11
2026-08-12
2026-09-01

INVALID:
2026-08-10
2026-08-01

IMPORTANT:
- Validation must be performed on the backend.
- Do not rely only on HTML min/date picker restrictions.
- Use consistent date/time handling.
- Avoid timezone-related bugs.
PHASE 9 — Product & Numeric Validation
PHASE 9 — PRODUCT VALIDATION

Implement validation for product fields.

Product name:
- Required.
- Must not be empty.
- Trim whitespace.
- Reasonable minimum/maximum length.

SKU/code:
- Required.
- Must not be empty.
- Reasonable length restriction.
- Must contain only allowed characters.
- Must be unique at the database/business-validation level.

Unit price:
- Must be numeric.
- MUST be >= 0.
- Zero is allowed.
- Negative values are forbidden.
- Reject NaN, Infinity, null, malformed numeric values.

Current stock:
- Must be numeric/integer according to the database design.
- MUST be >= 0.
- 0 IS VALID.
- Positive values are valid.
- NEGATIVE VALUES ARE NEVER VALID.

Minimum stock alert quantity:
- Must be numeric/integer according to the database design.
- MUST be >= 0.
- 0 IS VALID.
- Negative values are invalid.

Examples:
0      → VALID
1      → VALID
100    → VALID
-1     → INVALID

Do not allow negative stock anywhere in the application.
PHASE 10 — Stock Movement Validation
PHASE 10 — STOCK MOVEMENT VALIDATION

Implement validation for stock movement data.

Movement type:
ONLY:
- IN
- OUT

Reject every other value.

Quantity changed:
- Required.
- Must be numeric/integer according to the schema.
- Must be greater than 0.
- Zero is NOT valid for a stock movement.
- Negative values are NOT valid.

Examples:
IN + 10 → VALID
OUT + 5 → VALID
IN + 0 → INVALID
OUT + 0 → INVALID
IN - 10 → INVALID
OUT - 5 → INVALID

Additional business rule:
- Product current stock must NEVER become negative.
- For OUT movement:
  requested quantity MUST NOT exceed available stock.
- If available stock is 0, OUT movement must fail.
- Return a clear business validation error.

Do not allow any operation to produce negative current_stock.
PHASE 11 — Sales Challan Validation
PHASE 11 — SALES CHALLAN VALIDATION

Implement validation for sales challan input.

Customer:
- Required.
- Must reference a valid existing customer.

Products:
- At least one product is required.
- Multiple products must be supported.
- Every product must reference a valid existing product.

Quantity:
- Required.
- Must be an integer.
- Must be greater than 0.
- Zero is invalid.
- Negative values are invalid.

Status:
Only:
- Draft
- Confirmed
- Cancelled

Challan number:
- Must be automatically generated.
- User must not manually control the generated challan number.

Business validation:
- Draft challan does not reduce stock.
- Confirming a challan checks stock availability.
- Confirmed challan must NEVER cause stock to become negative.
- If requested quantity is greater than available stock, reject confirmation.
- Return a clear error identifying the product with insufficient stock.
- Do not partially deduct stock if any item fails validation.
- Product snapshot data must be validated and stored for challan items.

Do not implement PDF generation in this phase.
Only validation.
PHASE 12 — Final Validation & Error Handling Audit
PHASE 12 — COMPLETE VALIDATION AUDIT

Perform a complete validation audit of the CRM backend.

Do NOT add unrelated features.

Verify that validation exists for:

1. Required fields
2. Names
3. Mobile numbers
4. Email addresses
5. GSTIN
6. Customer type
7. Customer status
8. Address
9. PIN code
10. Follow-up dates
11. Product name
12. SKU
13. Unit price
14. Current stock
15. Minimum stock quantity
16. Stock movement type
17. Stock movement quantity
18. Challan customer
19. Challan products
20. Challan quantities
21. Challan status
22. Stock availability
23. Negative stock prevention

CRITICAL NUMERIC RULE:

All stock-related current quantities must be >= 0.

0 = VALID
Positive number = VALID
Negative number = INVALID

Stock movement quantity itself must be > 0.

0 = INVALID
Positive integer = VALID
Negative number = INVALID

CRITICAL DATE RULE:

Follow-up date:
Today = VALID
Future = VALID
Past = INVALID

CRITICAL GSTIN RULE:

GSTIN:
Optional
If provided = exactly 15 characters and valid Indian GSTIN format.
Do NOT treat GSTIN as 16 digits.

CRITICAL MOBILE RULE:

Mobile:
+91 + exactly 10 digits
First digit after +91 must be 6-9.

CRITICAL BUSINESS RULE:

Never allow any API, service, stock movement, challan confirmation, update, or other operation to make current stock negative.

Test both valid and invalid cases.

Make sure validation errors use appropriate HTTP status codes and clear error messages.

Do not break existing functionality.
Do not recreate the project.
Do not rewrite unrelated files.
Only correct or improve validation where necessary.



# Aether CRM — Agriculture Green light redesign

Alternative direction to the black & white sharp plan: light background,
soft rounded corners, subtle shadows, agriculture-green brand color. Same
rule as before — this changes color/shape/shadow tokens only. No layout,
grid, sidebar width, drawer position, or component placement changes.

This is the opposite visual direction from the BW sharp plan (light vs.
dark, soft vs. hard, colorful vs. monochrome). Use one or the other against
`:root` — don't run both phase sets on the same file.

Target tokens (as supplied):

```css
:root {
    --bg-main: #F7F9F7;
    --bg-card: #FFFFFF;
    --bg-sidebar: #FFFFFF;
    --bg-input: #FFFFFF;
    --color-primary: #16A34A;
    --color-primary-dark: #15803D;
    --color-primary-light: #DCFCE7;
    --color-secondary: #166534;
    --color-accent: #22C55E;
    --color-success: #16A34A;
    --color-warning: #F59E0B;
    --color-danger: #DC2626;
    --color-info: #2563EB;
    --text-primary: #172033;
    --text-secondary: #64748B;
    --text-muted: #94A3B8;
    --border-color: #E2E8F0;
    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 16px;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
    --shadow-lg: 0 10px 30px rgba(0,0,0,0.10);
}
```

---

## Phase 1 — Foundation tokens

**Goal:** swap backgrounds, brand colors, text colors, and border color in
`:root`. This alone recolors the whole app since every component already
reads from these variables.

**Files touched:** `src/index.css` (`:root` block only).

| Variable | Old (navy/glass) | New (agri green) |
|---|---|---|
| `--bg-main` | `#060913` | `#F7F9F7` |
| `--bg-card` | `rgba(13,20,38,0.45)` blur(16px) | `#FFFFFF` solid |
| `--bg-sidebar` | `rgba(8,12,24,0.95)` | `#FFFFFF` |
| `--bg-input` | `rgba(17,24,47,0.8)` | `#FFFFFF` |
| `--color-primary` | `#0ea5e9` | `#16A34A` |
| `--color-secondary` *(new)* | — | `#166534` |
| `--color-accent` | `#06b6d4` | `#22C55E` |
| `--color-success` | `#10b981` | `#16A34A` |
| `--color-warning` | `#f59e0b` | `#F59E0B` |
| `--color-danger` | `#ef4444` | `#DC2626` |
| `--color-info` | `#8b5cf6` | `#2563EB` |
| `--text-primary` | `#f8fafc` | `#172033` |
| `--text-secondary` | `#94a3b8` | `#64748B` |
| `--text-muted` | `#64748b` | `#94A3B8` |
| `--border-color` | `rgba(255,255,255,0.07)` | `#E2E8F0` |
| `--border-focus` | `rgba(14,165,233,0.5)` | `#16A34A` (solid, no glow blur) |

Also add two new variables not in the old palette:
`--color-primary-dark: #15803D` (button hover/pressed states) and
`--color-primary-light: #DCFCE7` (badge/chip fills, low-emphasis
backgrounds).

Delete every `*-glow` rgba variable — this theme uses `--color-primary-light`
for soft emphasis instead of glow shadows.

### Phase 1 prompt

> Update only the `:root` variable block in `src/index.css`. Do not touch
> any component file or layout CSS. Set:
>
> `--bg-main: #F7F9F7`, `--bg-card: #FFFFFF`, `--bg-sidebar: #FFFFFF`,
> `--bg-input: #FFFFFF`, `--color-primary: #16A34A`,
> `--color-primary-dark: #15803D`, `--color-primary-light: #DCFCE7`,
> `--color-secondary: #166534`, `--color-accent: #22C55E`,
> `--color-success: #16A34A`, `--color-warning: #F59E0B`,
> `--color-danger: #DC2626`, `--color-info: #2563EB`,
> `--text-primary: #172033`, `--text-secondary: #64748B`,
> `--text-muted: #94A3B8`, `--border-color: #E2E8F0`,
> `--border-focus: #16A34A`.
>
> Delete every `*-glow` rgba variable and flag (don't fix yet) any place
> still referencing them — that's a later phase. Don't touch radius,
> shadow, or `backdrop-filter` yet. Show me the diff of `:root` before
> finishing.

---

## Phase 2 — Shape: radius and glassmorphism removal

**Goal:** move from the current mix (8/12/20px) to the slightly smaller,
softer radius scale below, and drop the glass blur in favor of solid white
cards with a hairline border — light themes read as "clean," not
"floating," when the card is opaque.

**Files touched:** `src/index.css` (`--radius-*`, `.card`, `.badge-*`,
`backdrop-filter` declarations).

| Variable | Old | New |
|---|---|---|
| `--radius-sm` | `8px` | `6px` |
| `--radius-md` | `12px` | `10px` |
| `--radius-lg` | `20px` | `16px` |

- Remove `backdrop-filter: blur(...)` from `.card`, `.sidebar`,
  `.table-container`, and the drawer panel — now solid `--bg-card` /
  `--bg-sidebar` (white) with a `1px solid var(--border-color)` edge.
- Badges keep their pill shape (`border-radius: 9999px` — this theme isn't
  going sharp, so pills stay) but switch fill from solid saturated color to
  `--color-primary-light` background with `--color-primary-dark` text, for
  a softer "chip" look. Danger/warning/info badges get the equivalent
  light-tint treatment (10–15% tint of their color as background, full
  color as text).
- Card accent top-bars stay in place and position; recolor to the matching
  semantic variable (primary bar now green instead of blue).

### Phase 2 prompt

> Building on phase 1, make these shape changes without touching layout or
> JSX structure:
>
> Set `--radius-sm: 6px`, `--radius-md: 10px`, `--radius-lg: 16px`.
>
> Remove `backdrop-filter: blur(...)` from every rule that has it. Add
> `border: 1px solid var(--border-color)` to `.card`, `.sidebar`,
> `.table-container`, and the drawer panel if not already present, since
> they're now solid white instead of translucent.
>
> Keep badge pill shape (`border-radius: 9999px`), but change each
> `.badge-*` fill to a light tint background with the full-saturation color
> as text instead of solid color with white text — e.g. success badge
> becomes `background: var(--color-primary-light); color:
> var(--color-primary-dark)`. Apply the equivalent tint pattern to warning,
> danger, and info badges (10–15% tint of their own color as background).
>
> Recolor card accent top-bars to match the new semantic variables. Don't
> touch shadows or typography yet. Show me the diff before finishing.

---

## Phase 3 — Shadows: soft and subtle

**Goal:** replace the current heavy, high-opacity black shadows with the
lighter, lower-opacity values below — appropriate for a white card on a
near-white background, where a strong shadow looks like a smudge rather
than depth.

**Files touched:** `src/index.css` (`--shadow-*` only).

| Variable | Old | New |
|---|---|---|
| `--shadow-sm` | `0 2px 8px rgba(0,0,0,0.5)` | `0 1px 3px rgba(0,0,0,0.08)` |
| `--shadow-md` | `0 8px 30px rgba(0,0,0,0.7)` | `0 4px 12px rgba(0,0,0,0.08)` |
| `--shadow-lg` | `0 12px 40px rgba(0,0,0,0.8)` | `0 10px 30px rgba(0,0,0,0.10)` |

### Phase 3 prompt

> Update only `--shadow-sm`, `--shadow-md`, and `--shadow-lg` in
> `src/index.css` to:
>
> `--shadow-sm: 0 1px 3px rgba(0,0,0,0.08)`
> `--shadow-md: 0 4px 12px rgba(0,0,0,0.08)`
> `--shadow-lg: 0 10px 30px rgba(0,0,0,0.10)`
>
> Don't change which elements use which shadow variable, don't touch hover
> states yet. Show me the diff before finishing.

---

## Phase 4 — Body background

**Goal:** the current radial-gradient orb background was designed for a
dark canvas; on `#F7F9F7` it would just look like a stain. Replace it with
a flat, single-color background — clean is correct here, no texture
needed.

**Files touched:** `src/index.css` (`body` rule only).

### Phase 4 prompt

> In `src/index.css`, find the `body` rule with the fixed radial-gradient
> background (sky-blue and violet orbs). Replace it entirely with
> `background: var(--bg-main)` — flat, no gradient, no pattern. Don't
> change anything else in the file. Show me the diff before finishing.

---

## Phase 5 — Typography (optional)

**Goal:** the existing Outfit (headings) / Plus Jakarta Sans (body)
pairing already suits a clean, friendly light theme — no change is
required. The only optional addition is a mono face for numeric data,
which improves scanability of amounts/quantities regardless of theme.

**Files touched:** `src/index.css` (font import + new variable), only if
you choose to do this.

### Phase 5 prompt (optional — only run if you want mono numerals)

> Add IBM Plex Mono via Google Fonts, same `@import` pattern as the
> existing fonts. Add `--font-mono: 'IBM Plex Mono', monospace` to `:root`.
> Apply it to dashboard metric card values and numeric table columns only
> (amounts, quantities, counts — not name/text columns). Don't change
> Outfit or Plus Jakarta Sans usage anywhere else. Show me the diff before
> finishing.

---

## Phase 6 — Interaction states

**Goal:** soft, subtle motion to match the soft/subtle shadow language —
lift and tint, not invert.

**Files touched:** `src/index.css` (`.card:hover`, `.btn-*:hover`,
`.menu-item.active`/`.menu-item:hover`, input `:focus`, `.table tr:hover`).

| Element | Old | New |
|---|---|---|
| Card hover | `translateY(-2px)` + brighter border (dark theme) | `translateY(-2px)`, shadow steps `sm`→`md`, border stays `--border-color` |
| Button hover (primary) | glow shadow | `background: var(--color-primary-dark)`, no glow |
| Nav item active/hover | bg glow + color shift | `background: var(--color-primary-light)`, text/icon `var(--color-primary-dark)`, no left-border needed — this theme reads fine with a filled tint |
| Input focus | color glow ring | `box-shadow: 0 0 0 3px var(--color-primary-light)`, border becomes `var(--color-primary)` |
| Table row hover | `rgba(255,255,255,0.01)` | `background: #F7F9F7` (i.e. `var(--bg-main)`, giving a very subtle contrast against the white table) |

### Phase 6 prompt

> Update these interaction states in `src/index.css`, keeping existing
> transition timing:
>
> `.card:hover` — keep `translateY(-2px)`, step `box-shadow` from
> `var(--shadow-sm)` to `var(--shadow-md)`.
>
> `.btn-primary:hover` — remove glow shadow, change `background` to
> `var(--color-primary-dark)`. `.btn-secondary:hover` — light tint
> background using `var(--color-primary-light)`.
>
> `.menu-item.active` and `.menu-item:hover` — remove glow, set
> `background: var(--color-primary-light)` and `color:
> var(--color-primary-dark)` for text/icon.
>
> Input `:focus` — `box-shadow: 0 0 0 3px var(--color-primary-light)`,
> `border-color: var(--color-primary)`.
>
> `.table tr:hover` — `background: var(--bg-main)`.
>
> Don't touch the drawer's slide-in animation. Show me the diff before
> finishing.

---

## Phase 7 — Cleanup pass

**Goal:** catch any component file that hardcodes the old navy/blue hex
values in inline `style={{}}` instead of referencing CSS variables.

**Files touched:** any `.tsx` file with inline color styles.

### Phase 7 prompt

> Search `src/` for inline `style={{}}` props hardcoding any of these old
> values: `#060913`, `#0ea5e9`, `#06b6d4`, `#10b981`, `#f59e0b`,
> `#8b5cf6`, `rgba(13,20,38`, `rgba(8,12,24`, `rgba(17,24,47`,
> `rgba(14,165,233`, `rgba(139,92,246`, `8px`, `12px`, `20px` (only where
> used as border-radius on a card/button/input/badge). Replace each with
> the matching CSS variable (`var(--bg-main)`, `var(--color-primary)`,
> `var(--radius-sm)`, etc.). List every changed file and show the diff for
> each. Value substitution only — no layout or JSX changes.

---

## Non-goals (all phases)

- No DOM restructuring, no component repositioning, no grid/flex changes.
- No new pages, no new nav items, no responsive/mobile pass.
- No conversion of the Products page to a table.
- Currency formatting and the "AETHER ERP" name are unchhanged.
 at @challans page replace this button of in actions should be View	👁 / fa-eye	View
Confirm	✓ / fa-check	Confirm
Cancel	✕ / fa-xmark	Cancel
remocve name from that buttion only symbols 


her all is workiing but onluy p-roblem is Register New Client

Register New Client

ADMIN AND SAKLES NOT ADDINF THE CUSTOMER

http://localhost:5173/customers

Failed to save customer cant regriustrer also upsdat the cli9net on ADMIN AND SAKLES
here i can add the customer and also cant add the details of the customer on sales am admin
there in phone no add only  phoen an mobiel number not the needed +91 and also country code beacause all are indian (only 10 digits  will but it that box not will any digitly DIGIT on)and also 
GST must be 15 digitt dont need to check this format if only cehck 15 digits rather than hard checking 
http://localhost:5173/challans here for disptach of challan  on ADMIN AND SAKLES user can add the details and confirm and cancel also THIS   ":->" For dispatch   rather than  button use syllabus

revoke the quick Quick Demo Login revoke the changes and logins credentials to the Quick Demo Login directly login 
 revoke the login page changes as do i like it was whern the projecxt is build
 like that (click on what u want to login then u direclty credentialy apperd in username and password textbox or if i want i can type aslo on quick demo ever role has its own crenditial)