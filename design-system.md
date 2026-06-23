# ApartmentHub — Design System & UI Guidelines

> Tài liệu này là nguồn sự thật duy nhất (single source of truth) cho toàn bộ phong cách giao diện của dự án. Mọi thành viên và AI được yêu cầu tuân thủ nghiêm ngặt các quy ước dưới đây để đảm bảo trải nghiệm nhất quán, hiện đại và chuyên nghiệp trên tất cả các trang.

---

## 1. Triết lý thiết kế

ApartmentHub hướng đến phong cách **"Luxury Minimal"** — sang trọng nhưng không rườm rà. Giao diện phản ánh chất lượng của một tòa chung cư cao cấp: sạch sẽ, có trật tự, từng chi tiết đều có mục đích. Người dùng (cư dân, ban quản lý, kế toán) cần thấy **tin tưởng và thoải mái** khi sử dụng hàng ngày.

**Ba nguyên tắc cốt lõi:**
- **Clarity first** — Thông tin quan trọng luôn được ưu tiên hiển thị, không bị chôn vùi trong decoration.
- **Motion with purpose** — Mọi animation phục vụ người dùng (feedback, hướng dẫn sự chú ý), không phải trình diễn.
- **Depth through glass** — Dùng hiệu ứng glassmorphism có chọn lọc để tạo cảm giác chiều sâu, không lạm dụng.

---

## 2. Màu sắc (Color Tokens)

### Palette chính

| Token | Hex | Tên | Dùng cho |
|---|---|---|---|
| `--color-primary` | `#1E3A5F` | Navy Deep | Brand chính, CTA primary, active states |
| `--color-primary-light` | `#2C5C88` | Navy Mid | Hover states, icon accent, links |
| `--color-primary-pale` | `#EBF2FA` | Navy Pale | Background tinted, badge fill |
| `--color-surface` | `#F4F7FB` | Fog White | Page background, sidebar |
| `--color-surface-card` | `#FFFFFF` | Pure White | Card background |
| `--color-border` | `#E2E8F0` | Slate 100 | Dividers, input borders, card borders |
| `--color-text-primary` | `#0F1923` | Ink | Tiêu đề, label chính |
| `--color-text-secondary` | `#4A5568` | Slate | Body text, mô tả |
| `--color-text-muted` | `#94A3B8` | Muted | Placeholder, caption, timestamp |

### Palette trạng thái

| Token | Hex | Dùng cho |
|---|---|---|
| `--color-success` | `#16A34A` | Đã thanh toán, Đã duyệt, Hoàn thành |
| `--color-success-bg` | `#F0FDF4` | Background badge success |
| `--color-warning` | `#D97706` | Chờ duyệt, Sắp đến hạn |
| `--color-warning-bg` | `#FFFBEB` | Background badge warning |
| `--color-error` | `#DC2626` | Từ chối, Quá hạn, Lỗi |
| `--color-error-bg` | `#FEF2F2` | Background badge error |
| `--color-info` | `#0284C7` | Thông báo, Đang xử lý |
| `--color-info-bg` | `#F0F9FF` | Background badge info |

### Glassmorphism tokens (dùng cho overlay cards, modals)

```css
--glass-bg: rgba(255, 255, 255, 0.65);
--glass-bg-dark: rgba(30, 58, 95, 0.15);
--glass-border: rgba(255, 255, 255, 0.3);
--glass-shadow: 0 8px 32px rgba(15, 25, 35, 0.08);
--glass-blur: blur(16px);
--glass-blur-heavy: blur(24px);
```

---

## 3. Typography

### Font stack

```css
/* Display — tiêu đề lớn, hero */
font-family: 'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif;

/* Body — nội dung, label, button */
font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;

/* Mono — mã số, số liệu, code */
font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
```

> Import qua Google Fonts: `Plus Jakarta Sans` (600, 700) + `Inter` (400, 500, 600) + `JetBrains Mono` (400, 500)

### Type scale

| Role | Class / Size | Weight | Line-height | Dùng cho |
|---|---|---|---|---|
| `display-2xl` | 48–72px | 700 | 1.05 | Hero heading (Landing page) |
| `display-xl` | 36–48px | 700 | 1.1 | Page title lớn |
| `display-lg` | 28–32px | 600 | 1.15 | Section heading |
| `heading-md` | 20–24px | 600 | 1.25 | Card title, modal title |
| `heading-sm` | 16–18px | 600 | 1.3 | Sub-section, sidebar group label |
| `body-lg` | 16px | 400 | 1.6 | Body text chính |
| `body-md` | 14px | 400 | 1.5 | Label, mô tả, form hint |
| `body-sm` | 12px | 400 | 1.4 | Caption, timestamp, badge text |
| `mono-md` | 14px | 500 | 1.4 | Số hóa đơn, mã giao dịch, số liệu |

### Quy tắc typography

- Tiêu đề trang dùng `Plus Jakarta Sans`, nội dung dùng `Inter`.
- **Không dùng font-weight < 400** trong UI (trừ placeholder).
- Số tiền, chỉ số dùng `JetBrains Mono` để dễ đọc và align cột.
- `tracking-tight` (`letter-spacing: -0.02em`) cho display headings, `tracking-normal` cho body.

---

## 4. Spacing & Layout

### Spacing scale (theo bội số 4px)

```
4px   → xs   (gap nhỏ nội tuyến)
8px   → sm   (gap icon-text, padding badge)
12px  → md   (gap giữa elements trong 1 group)
16px  → lg   (padding card, gap list items)
20px  → xl   (margin giữa sections nhỏ)
24px  → 2xl  (padding section, gap cards trong grid)
32px  → 3xl  (margin giữa sections)
48px  → 4xl  (padding container lớn)
64px  → 5xl  (vertical section spacing)
```

### Grid layout

```
/* Trang dashboard (có sidebar) */
Sidebar width:    240px (collapsed: 72px)
Content area:     fluid, max-width 1280px
Content padding:  24px (mobile: 16px)

/* Grid cards */
Desktop:   3–4 cột, gap 24px
Tablet:    2 cột, gap 16px
Mobile:    1 cột, gap 12px
```

### Border radius scale

```css
--radius-sm:   6px    /* badge, tag, input */
--radius-md:   10px   /* button, small card */
--radius-lg:   16px   /* card, dropdown */
--radius-xl:   24px   /* modal, large card */
--radius-2xl:  32px   /* panel, hero container */
--radius-full: 9999px /* pill button, avatar */
```

---

## 5. Elevation & Shadow

Dùng shadow để tạo hierachy — không dùng border + shadow cùng lúc trên cùng 1 element.

```css
/* Flat (no elevation) */
--shadow-none: none;

/* Card thường */
--shadow-sm: 0 1px 3px rgba(15,25,35,0.06), 0 1px 2px rgba(15,25,35,0.04);

/* Card hover / dropdown */
--shadow-md: 0 4px 16px rgba(15,25,35,0.08), 0 2px 6px rgba(15,25,35,0.05);

/* Modal / Floating panel */
--shadow-lg: 0 12px 40px rgba(15,25,35,0.12), 0 4px 12px rgba(15,25,35,0.06);

/* Toast / Alert overlay */
--shadow-xl: 0 20px 60px rgba(15,25,35,0.15);

/* Glassmorphism card */
--shadow-glass: 0 8px 32px rgba(15,25,35,0.08), inset 0 1px 0 rgba(255,255,255,0.5);
```

---

## 6. Components

### 6.1 Button

```
Variants:   primary | secondary | ghost | danger | link
Sizes:      sm (h-32px) | md (h-40px) | lg (h-48px)
```

**Quy tắc:**
- Button primary: `bg-[#1E3A5F]`, text white, hover `bg-[#2C5C88]`, active scale 0.98
- Button secondary: `bg-white`, border `#E2E8F0`, text `#1E3A5F`, hover `bg-[#EBF2FA]`
- Button ghost: transparent, hover `bg-[#EBF2FA]`
- Button danger: `bg-[#DC2626]`, hover `bg-[#B91C1C]`
- Tất cả buttons: `border-radius: var(--radius-md)`, `font-weight: 500`, `transition: all 150ms ease`
- Icon button (icon-only): ratio 1:1, `border-radius: var(--radius-sm)`
- Loading state: spinner replace icon/text, không disable layout

**Animation:**
```css
button { transition: background 150ms ease, transform 100ms ease, box-shadow 150ms ease; }
button:hover { box-shadow: var(--shadow-md); }
button:active { transform: scale(0.98); }
```

### 6.2 Input / Form

```
Trạng thái: default | focus | error | disabled | readonly
```

```css
/* Default */
border: 1px solid var(--color-border);
border-radius: var(--radius-sm);
padding: 10px 14px;
font-size: 14px;
background: white;
transition: border-color 150ms, box-shadow 150ms;

/* Focus */
border-color: #2C5C88;
box-shadow: 0 0 0 3px rgba(44,92,136,0.12);
outline: none;

/* Error */
border-color: var(--color-error);
box-shadow: 0 0 0 3px rgba(220,38,38,0.1);

/* Disabled */
background: #F8FAFC;
color: var(--color-text-muted);
cursor: not-allowed;
```

- Label: `font-size: 14px`, `font-weight: 500`, `color: #0F1923`, margin-bottom 6px
- Helper text / error: `font-size: 12px`, margin-top 4px
- Error message màu `--color-error`

### 6.3 Card

Ba loại card được phép dùng:

**Card thường (Default Card)**
```css
background: white;
border: 1px solid var(--color-border);
border-radius: var(--radius-lg);
padding: 20px 24px;
box-shadow: var(--shadow-sm);
transition: box-shadow 200ms ease, transform 200ms ease;

/* Hover (chỉ áp dụng cho card có thể click) */
&:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
```

**Stat Card (hiển thị số liệu)**
```css
/* Thêm accent bar bên trái */
border-left: 3px solid var(--color-primary);
```

**Glass Card (dùng cho overlay, widget trên background ảnh/video)**
```css
background: var(--glass-bg);
backdrop-filter: var(--glass-blur);
-webkit-backdrop-filter: var(--glass-blur);
border: 1px solid var(--glass-border);
border-radius: var(--radius-xl);
box-shadow: var(--shadow-glass);
```

### 6.4 Badge / Status Tag

```css
/* Base */
display: inline-flex;
align-items: center;
gap: 4px;
padding: 3px 10px;
border-radius: var(--radius-full);
font-size: 12px;
font-weight: 500;
```

| Loại | Background | Text color | Dot color |
|---|---|---|---|
| success | `#F0FDF4` | `#16A34A` | `#16A34A` |
| warning | `#FFFBEB` | `#D97706` | `#D97706` |
| error | `#FEF2F2` | `#DC2626` | `#DC2626` |
| info | `#F0F9FF` | `#0284C7` | `#0284C7` |
| neutral | `#F1F5F9` | `#64748B` | `#94A3B8` |

Dot indicator: `width: 6px; height: 6px; border-radius: 50%;`

### 6.5 Modal / Dialog

```css
/* Overlay */
background: rgba(15, 25, 35, 0.5);
backdrop-filter: blur(4px);

/* Panel */
background: white;
border-radius: var(--radius-2xl);
box-shadow: var(--shadow-lg);
padding: 32px;
max-width: 560px;  /* default */
width: calc(100% - 32px);
```

Animation modal:
```css
/* Entry */
initial: { opacity: 0, scale: 0.96, y: 8 }
animate: { opacity: 1, scale: 1, y: 0 }
transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }

/* Exit */
exit: { opacity: 0, scale: 0.96, y: 4 }
transition: { duration: 0.15 }
```

### 6.6 Table

```css
/* Header row */
background: #F8FAFC;
font-size: 12px;
font-weight: 600;
color: var(--color-text-muted);
text-transform: uppercase;
letter-spacing: 0.05em;
padding: 10px 16px;

/* Data row */
border-bottom: 1px solid var(--color-border);
padding: 14px 16px;
font-size: 14px;
transition: background 100ms;

/* Row hover */
background: #F8FAFC;
```

- Cột số liệu / mã: dùng `font-family: mono`, căn phải
- Sticky header khi scroll dài
- Skeleton loader khi fetching data

### 6.7 Sidebar Navigation

```
Width desktop:    240px
Width collapsed:  72px
Background:       white
Border-right:     1px solid var(--color-border)
```

**Nav item:**
```css
/* Default */
padding: 10px 16px;
border-radius: var(--radius-md);
font-size: 14px;
font-weight: 500;
color: var(--color-text-secondary);
transition: background 150ms, color 150ms;

/* Hover */
background: var(--color-primary-pale);
color: var(--color-primary);

/* Active */
background: var(--color-primary-pale);
color: var(--color-primary);
font-weight: 600;
/* Accent bar */
border-left: 3px solid var(--color-primary);
```

### 6.8 Toast / Notification

Vị trí: `bottom-right`, stack từ dưới lên.

```css
min-width: 300px;
max-width: 420px;
padding: 14px 16px;
border-radius: var(--radius-lg);
box-shadow: var(--shadow-xl);
border-left: 4px solid [status-color];
background: white;
```

Animation:
```
Entry:  slide-in từ phải, fade in — duration 300ms
Exit:   slide-out sang phải, fade out — duration 200ms
Auto-dismiss: 4000ms (error: 6000ms, không auto-dismiss)
```

---

## 7. Animation & Motion

### Easing functions

```css
--ease-default:  cubic-bezier(0.16, 1, 0.3, 1)   /* spring-like, snappy */
--ease-in:       cubic-bezier(0.4, 0, 1, 1)
--ease-out:      cubic-bezier(0, 0, 0.2, 1)
--ease-linear:   linear
```

### Duration scale

```css
--duration-instant: 80ms    /* hover color change */
--duration-fast:    150ms   /* button press, tooltip */
--duration-normal:  250ms   /* dropdown, badge */
--duration-slow:    350ms   /* panel slide, card expand */
--duration-enter:   400ms   /* page element enter */
--duration-page:    600ms   /* page transition */
```

### Patterns animation tái sử dụng

**Fade-up (enter element):**
```css
initial: { opacity: 0, y: 16 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.4, ease: var(--ease-default) }
```

**Stagger list (danh sách items):**
```
Mỗi item delay thêm 60ms so với item trước
Tối đa 5 items stagger (sau đó không delay nữa)
```

**Scale-in (card / modal):**
```css
initial: { opacity: 0, scale: 0.96 }
animate: { opacity: 1, scale: 1 }
transition: { duration: 0.2, ease: var(--ease-default) }
```

**Hover lift (clickable card):**
```css
transition: transform 200ms ease, box-shadow 200ms ease;
hover: { transform: translateY(-2px); box-shadow: var(--shadow-md); }
```

**Number count-up (stat cards):**
Dùng khi stat card xuất hiện lần đầu — đếm từ 0 lên giá trị thực trong 800ms.

### Quy tắc motion

- **Không animate layout** (width, height thay đổi gây reflow) — dùng `transform` và `opacity`.
- **Respect `prefers-reduced-motion`** — tất cả animation phải tắt khi user bật reduced motion.
- **Không dùng animation vô hạn** trừ: loading spinner, pulse indicator trạng thái live.
- Page transition: fade-out 150ms → navigate → fade-in 250ms.

---

## 8. Iconography

Dùng **Lucide React** làm icon library duy nhất.

```
Size scale:
  xs:  14px  (inline trong text, badge)
  sm:  16px  (nav item, button icon)
  md:  20px  (card icon, action button)
  lg:  24px  (section icon, empty state)
  xl:  32px  (feature icon, large action)
  2xl: 48px  (illustration-level icon)
```

**Quy tắc:**
- Icon luôn đi kèm label (trừ icon button có tooltip).
- `stroke-width: 1.5` cho icon md trở lên, `stroke-width: 2` cho icon sm.
- Màu icon: inherit từ text color của container (không hardcode màu icon riêng lẻ).
- Icon trong button: luôn bên trái text (ngoại trừ "next arrow" → bên phải).

---

## 9. Cấu trúc trang Dashboard (Layout)

```
┌─────────────────────────────────────────────────────┐
│  TOPBAR  (fixed, height 64px)                       │
│  [Logo] [Breadcrumb]          [Search] [Bell] [Ava] │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ SIDEBAR  │   MAIN CONTENT                           │
│ (240px)  │   ┌──────────────────────────────────┐  │
│          │   │  Page Header (title + actions)   │  │
│ [Nav]    │   ├──────────────────────────────────┤  │
│          │   │                                  │  │
│          │   │  Content area                    │  │
│          │   │  (padding: 24px)                 │  │
│          │   │                                  │  │
│          │   └──────────────────────────────────┘  │
└──────────┴──────────────────────────────────────────┘
```

**Topbar:**
- Height: 64px, `background: white`, `border-bottom: 1px solid var(--color-border)`
- Left: Logo + tên trang (breadcrumb)
- Right: Search bar → Notification bell (badge) → Avatar + dropdown

**Sidebar:**
- Logo section: 64px (align với topbar)
- Nav groups: có group label uppercase muted
- Bottom: User info card + logout

**Page Header (mỗi trang):**
```
padding: 0 0 24px 0
[Page Title (display-lg)]     [Action buttons]
[Subtitle / breadcrumb]
```

---

## 10. Trạng thái đặc biệt

### Empty state

```
Icon lớn (48px, color: muted)
Title: "Chưa có dữ liệu" (heading-sm)
Description: hướng dẫn hành động tiếp theo (body-md, muted)
CTA button (nếu có hành động khả thi)

Căn giữa container, padding 48px vertical.
```

### Loading / Skeleton

- Dùng skeleton loader thay spinner cho content blocks (card, table rows, list).
- Skeleton: `background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)`, animation shimmer 1.5s.
- Spinner chỉ dùng cho: button loading, toàn trang loading khi redirect.

### Error state

- Inline error (form field): text đỏ bên dưới input.
- Page-level error: Alert component full-width, border-left màu error.
- Critical error (page crash): full-page error với nút "Thử lại".

---

## 11. Responsive Breakpoints

```css
/* Mobile first */
sm:   640px   /* Điện thoại ngang */
md:   768px   /* Tablet */
lg:   1024px  /* Laptop nhỏ */
xl:   1280px  /* Desktop */
2xl:  1536px  /* Màn hình lớn */
```

| Thành phần | Mobile | Tablet | Desktop |
|---|---|---|---|
| Sidebar | Bottom nav bar (icons only) | Collapsible overlay | Fixed 240px |
| Grid cards | 1 cột | 2 cột | 3–4 cột |
| Table | Card list view | Scroll horizontal | Full table |
| Modal | Full screen bottom sheet | Centered modal | Centered modal |
| Topbar | Logo + hamburger | Logo + icons | Full topbar |

---

## 12. CSS Variables — Khai báo đầy đủ

Dán vào file `src/index.css` hoặc `globals.css`:

```css
:root {
  /* Colors */
  --color-primary:          #1E3A5F;
  --color-primary-light:    #2C5C88;
  --color-primary-pale:     #EBF2FA;
  --color-surface:          #F4F7FB;
  --color-surface-card:     #FFFFFF;
  --color-border:           #E2E8F0;
  --color-text-primary:     #0F1923;
  --color-text-secondary:   #4A5568;
  --color-text-muted:       #94A3B8;

  /* Status */
  --color-success:          #16A34A;
  --color-success-bg:       #F0FDF4;
  --color-warning:          #D97706;
  --color-warning-bg:       #FFFBEB;
  --color-error:            #DC2626;
  --color-error-bg:         #FEF2F2;
  --color-info:             #0284C7;
  --color-info-bg:          #F0F9FF;

  /* Glass */
  --glass-bg:               rgba(255, 255, 255, 0.65);
  --glass-bg-dark:          rgba(30, 58, 95, 0.15);
  --glass-border:           rgba(255, 255, 255, 0.3);
  --glass-blur:             blur(16px);
  --glass-blur-heavy:       blur(24px);

  /* Radius */
  --radius-sm:              6px;
  --radius-md:              10px;
  --radius-lg:              16px;
  --radius-xl:              24px;
  --radius-2xl:             32px;
  --radius-full:            9999px;

  /* Shadow */
  --shadow-sm:   0 1px 3px rgba(15,25,35,0.06), 0 1px 2px rgba(15,25,35,0.04);
  --shadow-md:   0 4px 16px rgba(15,25,35,0.08), 0 2px 6px rgba(15,25,35,0.05);
  --shadow-lg:   0 12px 40px rgba(15,25,35,0.12), 0 4px 12px rgba(15,25,35,0.06);
  --shadow-xl:   0 20px 60px rgba(15,25,35,0.15);
  --shadow-glass: 0 8px 32px rgba(15,25,35,0.08), inset 0 1px 0 rgba(255,255,255,0.5);

  /* Easing */
  --ease-default: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out:     cubic-bezier(0, 0, 0.2, 1);

  /* Duration */
  --duration-fast:   150ms;
  --duration-normal: 250ms;
  --duration-slow:   350ms;
  --duration-enter:  400ms;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 13. Quy tắc bổ sung (Do's & Don'ts)

### ✅ Nên làm

- Dùng `gap` thay `margin` cho flex/grid layouts.
- Dùng `rem` cho font-size, `px` cho border và shadow, `%` hoặc `fr` cho layout.
- Ưu tiên Tailwind utility classes, chỉ viết CSS thuần khi không có utility tương đương.
- Mọi element tương tác phải có `:focus-visible` ring: `outline: 2px solid #2C5C88; outline-offset: 2px`.
- Dùng `role`, `aria-label` cho icon buttons và thành phần không có text label.

### ❌ Không làm

- Không dùng màu ngoài palette đã định nghĩa (nếu cần thêm, cập nhật tài liệu này trước).
- Không hardcode `color: #xxx` hoặc `font-size: xxpx` trực tiếp trong JSX — luôn dùng token.
- Không dùng `!important` trừ trường hợp override thư viện bên thứ ba.
- Không mix hai loại animation library (chỉ dùng `motion/react`).
- Không dùng `px` cho font-size (dùng `rem` để respect browser zoom).
- Không đặt `z-index` tùy tiện — xem bảng z-index dưới đây.

### Z-index hierarchy

```
1    → Sticky table header
10   → Dropdown menu, tooltip
20   → Sidebar overlay (mobile)
30   → Topbar
40   → Modal backdrop
50   → Modal panel
60   → Toast notification
100  → Dev tools overlay
```
