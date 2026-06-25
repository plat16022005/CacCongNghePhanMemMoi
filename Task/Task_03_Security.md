# Task 03 — Security (Bảo vệ)

## Mục tiêu
Triển khai toàn bộ chức năng dành cho role **Security** trong hệ thống ApartmentHub.
Bảo vệ kiểm soát người và phương tiện ra vào chung cư, chủ yếu làm việc qua giao diện mobile-friendly hoặc tablet tại chốt bảo vệ.

## Kiến trúc áp dụng
- Backend: Express.js, MVC + Layered Architecture
- Auth: JWT + middleware `authorize('security')`
- DB: Mongodb
- Lưu ý: Frontend của Security nên có UI đơn giản, font lớn, thao tác 1-2 bước (dùng trên tablet)

---

## Cấu trúc file cần tạo / chỉnh sửa

### Backend
```
src/
├── repositories/
│   └── security.repository.js
│
├── services/
│   ├── security.checkin.service.js
│   ├── security.vehicle.service.js
│   └── security.incident.service.js
│
├── controllers/
│   └── security.controller.js
│
├── validations/
│   └── security.validation.js
│
└── route/
    └── security.routes.js
```

### Frontend
```
frontend/src/
├── pages/security/
│   ├── Dashboard.tsx
│   ├── CheckIn.tsx        # Quét QR hoặc nhập thủ công
│   ├── Vehicles.tsx       # Kiểm tra xe
│   ├── Incidents.tsx      # Ghi nhận sự cố
│   └── GuestList.tsx      # Xem danh sách khách đã đăng ký hôm nay
│
└── components/security/
    ├── QrScanner.tsx
    ├── VehicleCard.tsx
    └── IncidentForm.tsx
```

---

## Chi tiết từng API

### 1. Dashboard bảo vệ

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/security/dashboard` | Số liệu ca trực hôm nay |

**Response:**
```json
{
  "date": "2024-06-20",
  "shift": "morning",
  "guestsToday": 12,
  "guestsCheckedIn": 7,
  "guestsCheckedOut": 3,
  "pendingVehicleRegistrations": 2,
  "openIncidents": 1
}
```

---

### 2. Xác nhận khách vào / ra (Check-in / Check-out)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/security/checkin/qr` | Quét QR code → xác nhận khách vào |
| POST | `/api/security/checkin/manual` | Nhập tay thông tin khách |
| POST | `/api/security/checkout/:guestId` | Xác nhận khách ra |
| GET | `/api/security/guests/today` | Danh sách khách đăng ký hôm nay |
| GET | `/api/security/guests/checkedin` | Danh sách khách đang trong tòa nhà |

**POST `/api/security/checkin/qr`** — Body:
```json
{ "qrData": "string (base64 hoặc token từ QR)" }
```

**Response (khi QR hợp lệ):**
```json
{
  "valid": true,
  "guestName": "Trần Thị B",
  "guestPhone": "0909...",
  "visitApartment": "A101",
  "residentName": "Nguyễn Văn A",
  "purpose": "Thăm gia đình",
  "checkinTime": "2024-06-20T14:05:00Z",
  "message": "Khách hợp lệ, đã ghi nhận vào"
}
```

**Response (khi QR không hợp lệ / đã check-in rồi):**
```json
{
  "valid": false,
  "reason": "QR_ALREADY_USED",
  "message": "Mã QR này đã được sử dụng lúc 13:45"
}
```
`reason` enum: `QR_EXPIRED` | `QR_ALREADY_USED` | `QR_NOT_FOUND` | `GUEST_REJECTED` | `DATE_MISMATCH`

**POST `/api/security/checkin/manual`** — Body:
```json
{
  "guestName": "string",
  "guestPhone": "string",
  "guestIdCard": "string",
  "visitApartmentCode": "A101",
  "purpose": "string",
  "note": "string"
}
```
→ Tạo bản ghi check-in với `type = 'manual'`, không cần có đăng ký trước.

**GET `/api/security/guests/today`** — Query: `?status=all|pending|checked_in|checked_out`

**Response:**
```json
{
  "data": [
    {
      "id": 5,
      "guestName": "Trần Thị B",
      "visitApartment": "A101",
      "scheduledTime": "14:00",
      "status": "checked_in",
      "checkinTime": "14:05",
      "checkoutTime": null
    }
  ]
}
```

---

### 3. Kiểm tra xe ra vào

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/security/vehicles` | Tra cứu xe theo biển số |
| POST | `/api/security/vehicles/log` | Ghi nhận xe ra / vào |
| GET | `/api/security/vehicles/pending` | Danh sách xe chờ duyệt thẻ |

**GET `/api/security/vehicles`** — Query: `?licensePlate=51A-12345`

**Response:**
```json
{
  "found": true,
  "licensePlate": "51A-12345",
  "vehicleType": "motorbike",
  "owner": "Nguyễn Văn A",
  "apartment": "A101",
  "registrationStatus": "approved",
  "cardNumber": "VE-0042"
}
```

**POST `/api/security/vehicles/log`** — Body:
```json
{
  "licensePlate": "string",
  "action": "entry",
  "note": "string (optional)"
}
```
`action` enum: `entry` | `exit`

---

### 4. Ghi nhận sự cố an ninh

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/security/incidents` | Danh sách sự cố (filter: date, status) |
| POST | `/api/security/incidents` | Tạo báo cáo sự cố mới |
| PATCH | `/api/security/incidents/:id/close` | Đóng sự cố |

**POST `/api/security/incidents`** — Body:
```json
{
  "title": "string",
  "description": "string",
  "location": "Tầng hầm B1",
  "severity": "medium",
  "imageUrls": ["https://..."],
  "involvedPeople": "string (optional)"
}
```
`severity` enum: `low` | `medium` | `high` | `critical`

→ Nếu `severity = 'critical'`: tự động tạo notification cho Manager.

**Response GET incidents:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Người lạ không có đăng ký",
      "severity": "medium",
      "status": "open",
      "reportedBy": "Nguyễn Bảo Vệ",
      "createdAt": "2024-06-20T16:30:00Z"
    }
  ]
}
```

---

### 5. Xem danh sách khách đã đăng ký (tra cứu nhanh)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/security/guests/lookup` | Tìm nhanh theo tên / SĐT / mã căn hộ |

**Query:** `?q=Trần&date=2024-06-20`

---

## Business rules quan trọng

1. **QR check-in**: mỗi QR chỉ dùng được 1 lần. Sau khi check-in, `guest.qrUsed = true`.
2. **QR hết hạn**: QR chỉ hợp lệ đúng ngày `visitDate`. Nếu quét sai ngày → `QR_EXPIRED` (trả lỗi rõ ràng, không crash).
3. **Check-in thủ công**: luôn được phép, bảo vệ phải ghi lý do trong `note`.
4. **Checkout**: ghi thời gian ra, cập nhật `guest.checkoutTime`. Không thể checkout người chưa check-in.
5. **Log xe**: mỗi lần xe vào/ra đều ghi bản ghi `VehicleLog` (licensePlate, action, timestamp, securityId).
6. **Sự cố critical**: khi tạo, ngay lập tức push notification đến tất cả Manager (không đợi background job).

---

## Middleware chain

```js
router.use(authenticate);
router.use(authorize('security'));
```

---

## Frontend — Lưu ý UI

- Trang **Check-in** (`/security/checkin`): nút to "QUÉT QR" ở giữa màn hình, fallback "Nhập thủ công" phía dưới. Sau khi quét → hiển thị kết quả rõ ràng với màu xanh (hợp lệ) / đỏ (không hợp lệ).
- Trang **Vehicles** (`/security/vehicles`): ô tìm kiếm biển số ở đầu trang, kết quả hiện ngay bên dưới.
- Component `QrScanner.tsx`: dùng thư viện `html5-qrcode` hoặc `react-qr-reader`.
- Font size tối thiểu 16px, button tối thiểu 48px height (thao tác trên tablet).

---

## Ghi chú cho agent

- Bảo vệ **không có quyền** sửa thông tin cư dân, căn hộ, hay hóa đơn.
- Bảo vệ **không thể** duyệt/từ chối đăng ký gửi xe — chỉ xem danh sách và tra cứu.
- QR decode: mã QR chứa `guestId` + `token` (hash), backend xác thực token trước khi check-in.
- Endpoint `/api/security/checkin/qr` cần xử lý đồng thời tránh race condition (2 bảo vệ quét cùng lúc 1 QR): dùng transaction hoặc row-level lock.
