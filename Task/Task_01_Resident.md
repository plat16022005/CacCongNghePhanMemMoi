# Task 01 — Resident (Cư dân)

## Mục tiêu
Triển khai toàn bộ chức năng dành cho role **Resident** trong hệ thống ApartmentHub.
Resident là người sống/sở hữu/thuê căn hộ trong chung cư, đăng nhập qua hệ thống chung và được redirect vào `/dashboard` sau khi xác thực.

## Kiến trúc áp dụng
- Backend: **Express.js**, MVC + Layered Architecture (Route → Controller → Service → Repository → Model)
- Auth: **JWT** (access token trong header `Authorization: Bearer <token>`)
- DB: **MySQL** với Sequelize ORM
- Frontend: **React + Vite** (SPA), gọi API qua `axios`
- Middleware xác thực: `authenticate` (kiểm tra JWT) + `authorize('resident')` (kiểm tra role)

---

## Cấu trúc file cần tạo / chỉnh sửa

### Backend
```
src/
├── models/
│   ├── Resident.js          # (nếu chưa có) thông tin cư dân, liên kết User
│   ├── Apartment.js         # thông tin căn hộ
│   ├── Invoice.js           # hóa đơn
│   ├── Guest.js             # đăng ký khách
│   ├── ParkingSlot.js       # đăng ký gửi xe
│   ├── MaintenanceRequest.js
│   ├── Notification.js
│   ├── Feedback.js
│   ├── Amenity.js           # tiện ích (hồ bơi, sân thể thao)
│   ├── AmenityBooking.js    # đặt tiện ích
│   └── Survey.js            # khảo sát / bình chọn
│
├── repositories/
│   ├── resident.repository.js
│   ├── apartment.repository.js
│   ├── invoice.repository.js
│   ├── guest.repository.js
│   ├── parking.repository.js
│   ├── maintenance.repository.js
│   ├── notification.repository.js
│   ├── feedback.repository.js
│   ├── amenity.repository.js
│   └── survey.repository.js
│
├── services/
│   ├── resident.service.js
│   ├── invoice.service.js
│   ├── guest.service.js
│   ├── parking.service.js
│   ├── maintenance.service.js
│   ├── notification.service.js
│   ├── feedback.service.js
│   ├── amenity.service.js
│   └── survey.service.js
│
├── controllers/
│   └── resident.controller.js
│
├── validations/
│   └── resident.validation.js
│
└── route/
    └── resident.routes.js
```

### Frontend
```
frontend/src/
├── pages/resident/
│   ├── Dashboard.tsx
│   ├── Profile.tsx
│   ├── Apartment.tsx
│   ├── Invoices.tsx
│   ├── Guests.tsx
│   ├── Parking.tsx
│   ├── Maintenance.tsx
│   ├── Notifications.tsx
│   ├── Feedbacks.tsx
│   ├── Amenities.tsx
│   └── Surveys.tsx
│
└── components/resident/
    ├── InvoiceCard.tsx
    ├── GuestForm.tsx
    ├── ParkingForm.tsx
    ├── MaintenanceForm.tsx
    └── NotificationItem.tsx
```

---

## Chi tiết từng API

### 1. Hồ sơ cá nhân

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/resident/profile` | Lấy thông tin hồ sơ cá nhân |
| PATCH | `/api/resident/profile` | Cập nhật tên, số điện thoại, avatar |
| PATCH | `/api/resident/profile/password` | Đổi mật khẩu |

**GET `/api/resident/profile`** — Response:
```json
{
  "id": 1,
  "fullName": "Nguyễn Văn A",
  "email": "a@email.com",
  "phone": "0901234567",
  "avatar": "https://...",
  "apartmentCode": "A101",
  "createdAt": "2024-01-01"
}
```

**PATCH `/api/resident/profile`** — Body:
```json
{ "fullName": "string", "phone": "string", "avatar": "string (URL)" }
```

---

### 2. Thông tin căn hộ

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/resident/apartment` | Xem thông tin căn hộ đang sở hữu/thuê |

**Response:**
```json
{
  "code": "A101",
  "floor": 1,
  "block": "A",
  "area": 65.5,
  "bedrooms": 2,
  "status": "occupied",
  "ownerSince": "2023-06-01"
}
```

---

### 3. Hóa đơn & Thanh toán

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/resident/invoices` | Danh sách hóa đơn (filter: status, month) |
| GET | `/api/resident/invoices/:id` | Chi tiết 1 hóa đơn |
| POST | `/api/resident/invoices/:id/pay` | Khởi tạo thanh toán (trả về payment URL) |
| POST | `/api/resident/invoices/payment/callback` | Callback từ cổng thanh toán |

**GET `/api/resident/invoices`** — Query params: `?status=unpaid&month=2024-06`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "type": "electricity",
      "amount": 350000,
      "dueDate": "2024-06-30",
      "status": "unpaid",
      "period": "2024-06"
    }
  ],
  "total": 1
}
```

**POST `/api/resident/invoices/:id/pay`** — Response:
```json
{ "paymentUrl": "https://payment-gateway.vn/pay?token=..." }
```

---

### 4. Đăng ký khách

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/resident/guests` | Lịch sử đăng ký khách |
| POST | `/api/resident/guests` | Tạo đăng ký khách mới |
| DELETE | `/api/resident/guests/:id` | Hủy lịch khách (chỉ khi status=pending) |

**POST `/api/resident/guests`** — Body:
```json
{
  "guestName": "string",
  "guestPhone": "string",
  "guestIdCard": "string",
  "visitDate": "2024-06-20",
  "visitTime": "14:00",
  "purpose": "string",
  "numberOfGuests": 2
}
```

**Response sau khi tạo:**
```json
{
  "id": 5,
  "qrCode": "base64string_or_url",
  "status": "pending",
  "message": "Đăng ký thành công, chờ bảo vệ xác nhận"
}
```

---

### 5. Đăng ký gửi xe

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/resident/parking` | Danh sách xe đã đăng ký |
| POST | `/api/resident/parking` | Đăng ký xe mới |
| DELETE | `/api/resident/parking/:id` | Hủy đăng ký thẻ xe |

**POST `/api/resident/parking`** — Body:
```json
{
  "licensePlate": "51A-12345",
  "vehicleType": "motorbike",
  "vehicleColor": "string",
  "brand": "string"
}
```
`vehicleType` enum: `motorbike` | `car` | `bicycle`

---

### 6. Báo cáo bảo trì / Sự cố

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/resident/maintenance` | Danh sách yêu cầu bảo trì đã gửi |
| POST | `/api/resident/maintenance` | Gửi yêu cầu bảo trì mới |
| GET | `/api/resident/maintenance/:id` | Xem tiến độ 1 yêu cầu |

**POST `/api/resident/maintenance`** — Body:
```json
{
  "category": "plumbing",
  "title": "string",
  "description": "string",
  "imageUrls": ["https://..."],
  "urgency": "normal"
}
```
`category` enum: `plumbing` | `electrical` | `elevator` | `common_area` | `other`
`urgency` enum: `low` | `normal` | `high` | `emergency`

**Response GET danh sách:**
```json
{
  "data": [
    {
      "id": 3,
      "title": "Vòi nước bị rò rỉ",
      "category": "plumbing",
      "status": "in_progress",
      "assignedTo": "Nguyễn Kỹ Thuật",
      "createdAt": "2024-06-10",
      "updatedAt": "2024-06-11"
    }
  ]
}
```

---

### 7. Thông báo

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/resident/notifications` | Danh sách thông báo (mới nhất trước) |
| PATCH | `/api/resident/notifications/:id/read` | Đánh dấu 1 thông báo đã đọc |
| PATCH | `/api/resident/notifications/read-all` | Đánh dấu tất cả đã đọc |

**Response GET:**
```json
{
  "unreadCount": 3,
  "data": [
    {
      "id": 1,
      "title": "Nhắc nhở hóa đơn tháng 6",
      "content": "string",
      "type": "invoice_reminder",
      "isRead": false,
      "createdAt": "2024-06-15"
    }
  ]
}
```
`type` enum: `invoice_reminder` | `maintenance_update` | `announcement` | `guest_approved` | `survey`

---

### 8. Đánh giá & Góp ý

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/resident/feedbacks` | Lịch sử đánh giá |
| POST | `/api/resident/feedbacks` | Gửi đánh giá mới |

**POST `/api/resident/feedbacks`** — Body:
```json
{
  "category": "security",
  "rating": 4,
  "content": "string"
}
```
`category` enum: `security` | `maintenance` | `amenity` | `management` | `other`
`rating`: 1–5

---

### 9. Đặt tiện ích

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/resident/amenities` | Danh sách tiện ích (hồ bơi, sân thể thao...) |
| GET | `/api/resident/amenities/:id/slots` | Xem lịch còn trống theo ngày |
| POST | `/api/resident/amenities/:id/book` | Đặt lịch |
| GET | `/api/resident/amenities/bookings` | Lịch sử đặt của cư dân |
| DELETE | `/api/resident/amenities/bookings/:id` | Hủy đặt lịch |

**POST book** — Body:
```json
{
  "date": "2024-06-22",
  "startTime": "08:00",
  "endTime": "10:00",
  "numberOfPeople": 3
}
```

---

### 10. Khảo sát / Bình chọn

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/resident/surveys` | Danh sách khảo sát đang mở |
| GET | `/api/resident/surveys/:id` | Chi tiết khảo sát và câu hỏi |
| POST | `/api/resident/surveys/:id/submit` | Nộp bài khảo sát |

**POST submit** — Body:
```json
{
  "answers": [
    { "questionId": 1, "value": "Rất hài lòng" },
    { "questionId": 2, "value": "4" }
  ]
}
```

---

## Business rules quan trọng

1. **Mỗi resident chỉ xem được dữ liệu của chính mình** — tất cả query phải filter theo `userId` từ JWT payload.
2. **Hủy đăng ký khách** chỉ được khi `status = 'pending'` và `visitDate` chưa qua.
3. **Số xe tối đa**: 2 xe/căn hộ (1 ô tô + 1 xe máy, hoặc 2 xe máy). Kiểm tra trong service trước khi tạo.
4. **Thanh toán**: sau khi callback thành công từ cổng thanh toán, cập nhật `invoice.status = 'paid'` và tạo 1 notification tự động.
5. **Maintenance emergency**: nếu `urgency = 'emergency'`, tự động tạo notification cho Manager.
6. **Amenity booking**: không cho phép đặt trùng slot đã có người đặt. Validate `startTime < endTime`.

---

## Middleware chain cho tất cả routes resident

```js
// resident.routes.js
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

router.use(authenticate);
router.use(authorize('resident'));
```

---

## Validation rules (resident.validation.js)

| Field | Rule |
|-------|------|
| `phone` | 10 số, bắt đầu bằng 0 |
| `visitDate` | phải là ngày trong tương lai |
| `licensePlate` | format `99A-99999` |
| `rating` | integer 1–5 |
| `urgency` | enum value hợp lệ |
| `startTime / endTime` | format `HH:mm`, startTime < endTime |

---

## Frontend — trang Dashboard (`/dashboard`)

Hiển thị widget tổng quan:
- Hóa đơn chưa thanh toán (số lượng + tổng tiền)
- Thông báo chưa đọc (badge số)
- Yêu cầu bảo trì đang xử lý
- Lịch đặt tiện ích sắp tới
- Shortcut buttons đến các trang con

Gọi các API song song bằng `Promise.all`:
```ts
const [invoices, notifications, maintenance, bookings] = await Promise.all([
  api.get('/resident/invoices?status=unpaid'),
  api.get('/resident/notifications?limit=5'),
  api.get('/resident/maintenance?status=in_progress'),
  api.get('/resident/amenities/bookings?upcoming=true'),
]);
```

---

## Ghi chú cho agent

- Dùng `Sequelize.Op` cho filter, không raw SQL.
- Tất cả response lỗi theo format: `{ "error": true, "message": "...", "code": "ERROR_CODE" }`.
- Tất cả response thành công: `{ "error": false, "data": {...} }`.
- Upload avatar: dùng `multer` + lưu vào `src/public/uploads/avatars/`.
- Upload ảnh bảo trì: tương tự, lưu vào `src/public/uploads/maintenance/`.
- QR code cho guest: dùng thư viện `qrcode` để generate, trả về base64.
