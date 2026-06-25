# Task 02 — Manager (Ban quản lý)

## Mục tiêu
Triển khai toàn bộ chức năng dành cho role **Manager** trong hệ thống ApartmentHub.
Manager là Ban quản lý chung cư, có quyền xem và xử lý toàn bộ hoạt động vận hành: cư dân, căn hộ, hóa đơn, thông báo, phản ánh, tiện ích, thống kê.

## Kiến trúc áp dụng
- Backend: Express.js, MVC + Layered Architecture
- Auth: JWT + middleware `authorize('manager')`
- DB: Mongodb

---

## Cấu trúc file cần tạo / chỉnh sửa

### Backend
```
src/
├── models/
│   └── (dùng lại các model từ Task 01: Resident, Apartment, Invoice, Guest, ParkingSlot, MaintenanceRequest, Notification, Feedback, Amenity, AmenityBooking, Survey)
│
├── repositories/
│   └── manager.repository.js   # các query đặc thù của manager
│
├── services/
│   ├── manager.resident.service.js
│   ├── manager.apartment.service.js
│   ├── manager.invoice.service.js
│   ├── manager.guest.service.js
│   ├── manager.notification.service.js
│   ├── manager.feedback.service.js
│   ├── manager.amenity.service.js
│   └── manager.report.service.js
│
├── controllers/
│   └── manager.controller.js
│
├── validations/
│   └── manager.validation.js
│
└── route/
    └── manager.routes.js
```

### Frontend
```
frontend/src/
├── pages/manager/
│   ├── Dashboard.tsx
│   ├── Residents.tsx
│   ├── ResidentDetail.tsx
│   ├── Apartments.tsx
│   ├── Guests.tsx
│   ├── Announcements.tsx
│   ├── Feedbacks.tsx
│   ├── Amenities.tsx
│   └── Reports.tsx
│
└── components/manager/
    ├── StatCard.tsx
    ├── ResidentTable.tsx
    ├── GuestApprovalCard.tsx
    ├── FeedbackItem.tsx
    └── RevenueChart.tsx
```

---

## Chi tiết từng API

### 1. Dashboard tổng quan

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/manager/dashboard` | Số liệu tổng quan toàn chung cư |

**Response:**
```json
{
  "totalApartments": 120,
  "occupiedApartments": 108,
  "totalResidents": 312,
  "pendingGuests": 5,
  "unpaidInvoices": 23,
  "openMaintenanceRequests": 8,
  "unreadFeedbacks": 4,
  "revenueThisMonth": 85000000
}
```

---

### 2. Quản lý cư dân

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/manager/residents` | Danh sách cư dân (search, filter, phân trang) |
| GET | `/api/manager/residents/:id` | Chi tiết 1 cư dân |
| POST | `/api/manager/residents` | Thêm cư dân mới (tạo tài khoản + gán căn hộ) |
| PATCH | `/api/manager/residents/:id` | Cập nhật thông tin cư dân |
| PATCH | `/api/manager/residents/:id/status` | Kích hoạt / khóa tài khoản |

**GET `/api/manager/residents`** — Query params:
`?search=Nguyễn&block=A&status=active&page=1&limit=20`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "fullName": "Nguyễn Văn A",
      "email": "a@email.com",
      "phone": "0901234567",
      "apartmentCode": "A101",
      "status": "active",
      "joinedAt": "2023-06-01"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 108 }
}
```

**POST `/api/manager/residents`** — Body:
```json
{
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "apartmentId": 5,
  "role": "resident",
  "moveInDate": "2024-07-01"
}
```
→ Hệ thống tự sinh mật khẩu tạm và gửi email cho cư dân.

---

### 3. Quản lý căn hộ

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/manager/apartments` | Danh sách căn hộ (filter block, floor, status) |
| GET | `/api/manager/apartments/:id` | Chi tiết căn hộ + lịch sử cư dân |
| PATCH | `/api/manager/apartments/:id` | Cập nhật thông tin căn hộ |
| PATCH | `/api/manager/apartments/:id/status` | Đổi trạng thái căn hộ |

**GET `/api/manager/apartments`** — Query: `?block=A&floor=3&status=vacant`

`status` enum: `occupied` | `vacant` | `under_maintenance`

---

### 4. Duyệt đăng ký khách

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/manager/guests` | Danh sách yêu cầu khách (filter status, date) |
| PATCH | `/api/manager/guests/:id/approve` | Phê duyệt đăng ký khách |
| PATCH | `/api/manager/guests/:id/reject` | Từ chối đăng ký khách |

**PATCH approve/reject** — Body:
```json
{ "note": "string (optional)" }
```
→ Sau khi approve: tạo notification cho resident tương ứng.
→ Sau khi reject: tạo notification cho resident kèm lý do.

---

### 5. Quản lý hóa đơn (phối hợp với Kế toán)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/manager/invoices` | Danh sách hóa đơn toàn chung cư |
| GET | `/api/manager/invoices/overdue` | Danh sách hóa đơn quá hạn |
| POST | `/api/manager/invoices/remind` | Gửi nhắc nhở hàng loạt cho các căn hộ nợ |

**POST remind** — Body:
```json
{ "month": "2024-06", "invoiceType": "all" }
```
→ Tạo notification loại `invoice_reminder` cho từng resident có hóa đơn chưa thanh toán.

---

### 6. Gửi thông báo

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/manager/announcements` | Lịch sử thông báo đã gửi |
| POST | `/api/manager/announcements` | Gửi thông báo mới |
| DELETE | `/api/manager/announcements/:id` | Xóa thông báo |

**POST `/api/manager/announcements`** — Body:
```json
{
  "title": "string",
  "content": "string",
  "targetRole": "all",
  "targetApartments": [],
  "type": "announcement"
}
```
`targetRole` enum: `all` | `resident` | `specific`
Nếu `targetRole = 'specific'`, `targetApartments` là mảng apartmentId.

---

### 7. Xử lý phản ánh / Góp ý

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/manager/feedbacks` | Danh sách phản ánh (filter: status, category) |
| GET | `/api/manager/feedbacks/:id` | Chi tiết 1 phản ánh |
| PATCH | `/api/manager/feedbacks/:id/respond` | Phản hồi phản ánh |
| PATCH | `/api/manager/feedbacks/:id/close` | Đánh dấu đã xử lý xong |

**PATCH respond** — Body:
```json
{ "response": "string", "status": "in_progress" }
```
`status` enum: `pending` | `in_progress` | `resolved` | `closed`

---

### 8. Quản lý tiện ích chung cư

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/manager/amenities` | Danh sách tiện ích |
| POST | `/api/manager/amenities` | Thêm tiện ích mới |
| PATCH | `/api/manager/amenities/:id` | Cập nhật tiện ích |
| PATCH | `/api/manager/amenities/:id/status` | Mở / đóng tiện ích |
| GET | `/api/manager/amenities/:id/bookings` | Danh sách đặt lịch của tiện ích |

**POST `/api/manager/amenities`** — Body:
```json
{
  "name": "Hồ bơi tầng 5",
  "type": "pool",
  "capacity": 20,
  "openTime": "06:00",
  "closeTime": "22:00",
  "slotDuration": 60,
  "maxBookingsPerResident": 2
}
```

---

### 9. Xét duyệt đăng ký gửi xe

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/manager/parking` | Danh sách đăng ký gửi xe (filter status) |
| PATCH | `/api/manager/parking/:id/approve` | Phê duyệt |
| PATCH | `/api/manager/parking/:id/reject` | Từ chối |

---

### 10. Thống kê & Báo cáo

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/manager/reports/revenue` | Doanh thu theo tháng/quý/năm |
| GET | `/api/manager/reports/occupancy` | Tỷ lệ lấp đầy căn hộ |
| GET | `/api/manager/reports/maintenance` | Thống kê yêu cầu bảo trì |
| GET | `/api/manager/reports/feedback` | Thống kê đánh giá trung bình theo danh mục |

**GET revenue** — Query: `?from=2024-01-01&to=2024-06-30&groupBy=month`

**Response:**
```json
{
  "data": [
    { "period": "2024-01", "total": 72000000, "paid": 68000000, "unpaid": 4000000 }
  ]
}
```

---

## Business rules quan trọng

1. **Manager thấy toàn bộ dữ liệu** — không filter theo userId, nhưng có thể filter theo block/building.
2. **Duyệt guest**: sau khi approve, QR code trở nên hợp lệ và bảo vệ có thể quét.
3. **Tạo resident mới**: hệ thống tự tạo User + Resident, set `role = 'resident'`, sinh password ngẫu nhiên 8 ký tự, gửi qua email (dùng `nodemailer`).
4. **Nhắc hóa đơn hàng loạt**: giới hạn gọi 1 lần/ngày/tháng, tránh spam.
5. **Khóa tài khoản**: `status = 'inactive'` → resident không thể đăng nhập, middleware auth phải kiểm tra.
6. **Xóa thông báo**: chỉ xóa được thông báo do chính manager đó tạo.

---

## Middleware chain

```js
// manager.routes.js
router.use(authenticate);
router.use(authorize('manager'));
```

---

## Frontend — Dashboard Manager (`/manager/dashboard`)

Layout gồm:
- Row 1: 4 StatCard (Tổng cư dân, Căn hộ trống, Hóa đơn chưa thanh toán, Phản ánh chưa xử lý)
- Row 2: Biểu đồ doanh thu 6 tháng gần nhất (dùng Recharts `BarChart`)
- Row 3: Bảng yêu cầu khách đang chờ duyệt (tối đa 5 hàng, link "Xem tất cả")
- Row 4: Bảng yêu cầu bảo trì đang mở (tối đa 5 hàng)

---

## Ghi chú cho agent

- Tất cả endpoint GET hỗ trợ `?page=&limit=` phân trang, mặc định `page=1, limit=20`.
- Sort mặc định: `createdAt DESC`.
- Khi gửi email tạo tài khoản, dùng template HTML đơn giản, tránh để lộ password trong log.
- Báo cáo doanh thu: join Invoice + Apartment + Resident, group by month.
