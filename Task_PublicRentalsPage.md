# TASK.MD — Nâng cấp Chức năng "Xem nhà không đăng nhập" (Public Rentals Page)

**Module:** Public Rentals
**Stack:** Express.js + JWT + MySQL/Sequelize (Backend) | React + Vite + Tailwind CSS (Frontend)
**File liên quan hiện có:** `frontend/src/pages/public/Rentals.tsx`
**Đối tượng sử dụng:** Guest (chưa đăng nhập)
**Design System:** Luxury Minimal — bảng màu navy-blue, glassmorphism cho các thành phần nổi (modal, card hover)

---

## 0. MỤC TIÊU

Nâng cấp trang xem căn hộ trống công khai từ mức "hiển thị danh sách tĩnh" lên chuẩn sản phẩm thực tế (kiểu Airbnb/Batdongsan): có lọc/tìm kiếm, trang chi tiết, form đặt lịch xem nhà thật (thay `alert()`), tối ưu UX/hiệu năng và SEO.

Không phá vỡ chức năng hiện có: giữ nguyên API `GET /api/public/apartments`, chỉ mở rộng thêm.

---

## 1. BACKEND TASKS

### 1.1. Database — Bảng mới `viewing_requests`

```sql
CREATE TABLE viewing_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  apartment_id INT NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(15) NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time_slot ENUM('morning', 'afternoon', 'evening') NOT NULL,
  note TEXT NULL,
  status ENUM('pending', 'contacted', 'scheduled', 'cancelled') DEFAULT 'pending',
  handled_by INT NULL,        -- FK -> users.id (Manager xử lý)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (apartment_id) REFERENCES apartments(id),
  FOREIGN KEY (handled_by) REFERENCES users(id)
);
```

Tạo Sequelize model `ViewingRequest.js` tương ứng, kèm association:
- `ViewingRequest.belongsTo(Apartment)`
- `Apartment.hasMany(ViewingRequest)`

### 1.2. API Endpoints mới

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| GET | `/api/public/apartments` | Không | (Đã có) — **cần mở rộng** query param filter |
| GET | `/api/public/apartments/:id` | Không | Chi tiết 1 căn hộ (cho Detail Page) |
| GET | `/api/public/apartments/:id/similar` | Không | Danh sách căn hộ tương tự (cùng Block hoặc giá gần) |
| POST | `/api/public/viewing-requests` | Không | Tạo yêu cầu đặt lịch xem nhà |
| GET | `/api/manager/viewing-requests` | JWT (role: manager) | Manager xem danh sách yêu cầu đặt lịch |
| PATCH | `/api/manager/viewing-requests/:id` | JWT (role: manager) | Cập nhật trạng thái (contacted/scheduled/cancelled) |

### 1.3. Mở rộng `GET /api/public/apartments` — Filter & Sort & Pagination

Query params hỗ trợ:
```
?minPrice=3000000&maxPrice=8000000
&bedrooms=2
&bathrooms=1
&block=A
&minArea=30&maxArea=60
&sortBy=price_asc | price_desc | area_desc | newest
&page=1&limit=12
&search=101
```

Response format chuẩn hoá (kèm meta phân trang):
```json
{
  "data": [ /* danh sách apartment */ ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 12,
    "totalPages": 4
  }
}
```

**Validation (middleware `express-validator`):**
- `minPrice`, `maxPrice`, `minArea`, `maxArea`: số nguyên dương, `min <= max`
- `bedrooms`, `bathrooms`: số nguyên 0-10
- `page`, `limit`: số nguyên dương, `limit` tối đa 50

### 1.4. API tạo Viewing Request

**POST `/api/public/viewing-requests`**

Request body:
```json
{
  "apartmentId": 12,
  "fullName": "Nguyễn Văn A",
  "phoneNumber": "0912345678",
  "preferredDate": "2026-07-10",
  "preferredTimeSlot": "afternoon",
  "note": "Tôi muốn xem vào buổi chiều thứ 7"
}
```

Validation:
- `phoneNumber`: regex số Việt Nam `^(0|\+84)(3|5|7|8|9)[0-9]{8}$`
- `preferredDate`: không được là ngày trong quá khứ
- `apartmentId`: phải tồn tại và đang ở trạng thái `available`
- Rate limit: tối đa 3 request/IP/giờ (dùng `express-rate-limit`) để tránh spam

Response:
```json
{ "success": true, "message": "Đã ghi nhận yêu cầu đặt lịch xem nhà" }
```

Sau khi tạo thành công: (optional, nếu có cấu hình email service) gửi email/SMS xác nhận cho khách + notify Manager.

### 1.5. Rate limiting & Spam protection
- Áp dụng `express-rate-limit` cho endpoint `POST /viewing-requests`
- Cân nhắc thêm honeypot field ẩn trong form để chặn bot (không bắt buộc CAPTCHA ở bản đầu)

---

## 2. FRONTEND TASKS

### 2.1. Cấu trúc thư mục đề xuất

```
frontend/src/pages/public/
  ├── Rentals.tsx                  (trang danh sách — sửa lại)
  ├── RentalDetail.tsx              (MỚI — trang chi tiết)
frontend/src/components/public/
  ├── FilterBar.tsx                 (MỚI)
  ├── ApartmentCard.tsx             (tách ra từ Rentals.tsx)
  ├── ApartmentCardSkeleton.tsx     (MỚI)
  ├── ViewingRequestModal.tsx       (MỚI — form đặt lịch)
  ├── ImageGalleryLightbox.tsx      (MỚI)
  ├── SimilarApartments.tsx         (MỚI)
frontend/src/hooks/
  ├── useApartments.ts              (MỚI — fetch + filter + pagination logic)
  ├── useWishlist.ts                (MỚI — localStorage wishlist)
frontend/src/routes/
  └── (thêm route "/rentals/:id")
```

### 2.2. Routing

```tsx
// App.tsx / router config
<Route path="/rentals" element={<Rentals />} />
<Route path="/rentals/:id" element={<RentalDetail />} />
```

### 2.3. `FilterBar.tsx`

- Sticky bar cố định top khi cuộn (kiểu Batdongsan)
- Các control: RangeSlider giá, Select số phòng ngủ/tắm, Select Block, Ô search
- State filter đồng bộ vào URL query params (dùng `useSearchParams`) để có thể share link filter
- Debounce input search 400ms trước khi gọi API (đúng pattern đã dùng ở module Resident Search trước đây)
- Badge hiển thị "X kết quả" cập nhật realtime

### 2.4. `Rentals.tsx` (sửa lại)

- Thay Spinner bằng `ApartmentCardSkeleton` (6-9 khung skeleton khi loading)
- Empty State giữ nguyên nhưng thêm gợi ý "Xoá bộ lọc" nếu đang có filter active
- Phân trang dạng nút "Xem thêm" (load more) HOẶC infinite scroll bằng `IntersectionObserver` — chọn load more cho đơn giản & rõ ràng UX
- Click vào Card → điều hướng `navigate(`/rentals/${apartment.id}`)`
- Icon trái tim (wishlist) góc trên trái mỗi Card, dùng `useWishlist` hook lưu localStorage

### 2.5. `RentalDetail.tsx`

- Gọi API `GET /api/public/apartments/:id`
- Layout 2 cột (desktop): trái là Gallery + mô tả chi tiết, phải là Card thông tin giá + nút CTA (sticky khi cuộn — kiểu Airbnb)
- Tích hợp `ImageGalleryLightbox` (dùng thư viện nhẹ, ví dụ tự build với overlay + arrow key navigation, tránh phụ thuộc nặng)
- Hiển thị: nội thất đi kèm, hướng nhà, ngày có thể dọn vào (nếu backend có field), chính sách đặt cọc
- Section `SimilarApartments` ở cuối trang (gọi API `/similar`)
- Nút "Đặt lịch xem phòng" mở `ViewingRequestModal`
- Nút Share (Zalo/Facebook/Copy link) dùng Web Share API, fallback copy link + toast

### 2.6. `ViewingRequestModal.tsx`

- Modal/Drawer style glassmorphism theo design system hiện tại
- Form fields: Họ tên (required), SĐT (required, validate regex VN), Ngày mong muốn (date picker, disable ngày quá khứ), Khung giờ (radio: Sáng/Chiều/Tối), Ghi chú (optional, textarea)
- Validate client-side bằng `react-hook-form` + `zod` (nếu project đã dùng lib này) hoặc validate thủ công đồng bộ style hiện có
- Submit → gọi `POST /api/public/viewing-requests`
- Thành công: đóng modal, hiện Toast "Đã gửi yêu cầu, chúng tôi sẽ liên hệ sớm nhất!" (thay thế hoàn toàn `alert()`)
- Thất bại: hiện lỗi inline dưới field tương ứng hoặc Toast lỗi chung

### 2.7. `useWishlist.ts`

```ts
// Lưu mảng apartment id vào localStorage key "wishlist_apartments"
// API: toggleWishlist(id), isWishlisted(id), wishlistIds
```

### 2.8. Skeleton Loading

- `ApartmentCardSkeleton.tsx`: khung xám pulse animation, giữ đúng layout/kích thước của `ApartmentCard` thật để tránh layout shift

---

## 3. DESIGN SYSTEM — ÁP DỤNG "LUXURY MINIMAL"

- Filter bar: nền trắng/navy nhạt, border mỏng, khi sticky thêm shadow nhẹ
- Modal đặt lịch: glassmorphism (backdrop-blur, nền trắng mờ 80-90% opacity, border 1px trắng mờ)
- Nút CTA chính: navy-blue solid, hover đậm hơn 10%
- Badge "Còn X căn cuối" (nếu làm mục Urgency): màu cam/đỏ nhẹ, không lấn át tông navy chủ đạo
- Skeleton: xám nhạt `bg-slate-200`, animate-pulse của Tailwind

---

## 4. THỨ TỰ TRIỂN KHAI ĐỀ XUẤT (SPRINT)

| Sprint | Nội dung |
|---|---|
| 1 | BE: bảng `viewing_requests` + API filter/pagination + API tạo request. FE: `ViewingRequestModal` + `FilterBar` |
| 2 | FE: `RentalDetail.tsx` + Gallery + BE: API detail + similar |
| 3 | Skeleton loading, load more, `useWishlist`, Share button |
| 4 | Dashboard Manager xem/xử lý viewing requests, SEO meta tags, analytics event tracking |

---

## 5. GHI CHÚ CHO AI CODING AGENT

- Không đổi shape response cũ của `GET /api/public/apartments` theo cách phá vỡ FE hiện tại — chỉ thêm field `meta` và cho phép query param optional (không truyền vẫn hoạt động như cũ).
- Tái sử dụng pattern validation, error handling, và cấu trúc response đã có trong các module khác của ApartmentHub (đồng bộ với Resident, Billing... đã build trước đó).
- Toàn bộ text hiển thị UI dùng tiếng Việt, giữ nguyên giọng văn thân thiện như bản gốc ("Hiện chưa có căn hộ trống"...).
- Ưu tiên component tái sử dụng được (Skeleton, Modal, Toast) nếu project đã có sẵn design system component tương tự — không tạo trùng lặp.
