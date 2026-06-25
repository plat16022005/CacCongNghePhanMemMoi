# Task 06 — Admin (Quản trị hệ thống)

## Mục tiêu
Triển khai toàn bộ chức năng dành cho role **Admin** trong hệ thống ApartmentHub.
Admin có quyền cao nhất: quản lý tài khoản toàn hệ thống, phân quyền, quản lý tòa nhà/block, cấu hình hệ thống và xem log hoạt động.

## Kiến trúc áp dụng
- Backend: Express.js, MVC + Layered Architecture
- Auth: JWT + middleware `authorize('admin')`
- DB: Mongodb
- Lưu ý: Admin dashboard cần thể hiện toàn bộ hệ thống từ góc nhìn kỹ thuật, không chỉ vận hành

---

## Cấu trúc file cần tạo / chỉnh sửa

### Backend
```
src/
├── models/
│   ├── Building.js         # Tòa nhà / Block
│   ├── SystemConfig.js     # Cấu hình hệ thống (key-value)
│   └── ActivityLog.js      # Log hoạt động người dùng
│
├── repositories/
│   └── admin.repository.js
│
├── services/
│   ├── admin.user.service.js
│   ├── admin.building.service.js
│   ├── admin.config.service.js
│   └── admin.log.service.js
│
├── controllers/
│   └── admin.controller.js
│
├── validations/
│   └── admin.validation.js
│
└── route/
    └── admin.routes.js
```

### Frontend
```
frontend/src/
├── pages/admin/
│   ├── Dashboard.tsx
│   ├── Users.tsx
│   ├── UserCreate.tsx
│   ├── UserDetail.tsx
│   ├── Buildings.tsx
│   ├── SystemConfig.tsx
│   └── ActivityLogs.tsx
│
└── components/admin/
    ├── UserTable.tsx
    ├── RoleBadge.tsx
    ├── ConfigEditor.tsx
    └── LogTable.tsx
```

---

## Chi tiết từng API

### 1. Dashboard Admin

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/admin/dashboard` | Tổng quan toàn hệ thống |

**Response:**
```json
{
  "users": {
    "total": 450,
    "byRole": {
      "resident": 420,
      "manager": 3,
      "security": 8,
      "accountant": 2,
      "maintenance": 12,
      "admin": 2
    },
    "activeToday": 87
  },
  "system": {
    "buildings": 2,
    "totalApartments": 240,
    "dbSizeMB": 125,
    "uptime": "15 ngày 4 giờ"
  },
  "recentErrors": 0
}
```

---

### 2. Quản lý tài khoản

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/admin/users` | Danh sách tất cả tài khoản (search, filter role, status) |
| GET | `/api/admin/users/:id` | Chi tiết 1 tài khoản |
| POST | `/api/admin/users` | Tạo tài khoản mới (mọi role) |
| PATCH | `/api/admin/users/:id` | Cập nhật thông tin |
| PATCH | `/api/admin/users/:id/role` | Thay đổi role |
| PATCH | `/api/admin/users/:id/status` | Kích hoạt / khóa / xóa tài khoản |
| POST | `/api/admin/users/:id/reset-password` | Reset mật khẩu → gửi email |

**GET `/api/admin/users`** — Query: `?role=manager&status=active&search=Nguyễn&page=1&limit=20`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "fullName": "Nguyễn Văn A",
      "email": "a@email.com",
      "role": "resident",
      "status": "active",
      "lastLogin": "2024-06-20T08:00:00Z",
      "createdAt": "2023-06-01"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 450 }
}
```

**POST `/api/admin/users`** — Body:
```json
{
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "role": "security",
  "password": "string (optional, nếu không có thì auto-generate)"
}
```

**PATCH `/api/admin/users/:id/role`** — Body:
```json
{ "role": "manager" }
```
→ Ghi log vào `ActivityLog`.
→ Không cho phép hạ cấp hoặc thay đổi role của chính mình.

**PATCH `/api/admin/users/:id/status`** — Body:
```json
{ "status": "inactive", "reason": "string (optional)" }
```
`status` enum: `active` | `inactive` | `deleted`

---

### 3. Quản lý tòa nhà / Block

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/admin/buildings` | Danh sách tòa nhà |
| POST | `/api/admin/buildings` | Thêm tòa nhà mới |
| PATCH | `/api/admin/buildings/:id` | Cập nhật thông tin tòa nhà |
| DELETE | `/api/admin/buildings/:id` | Xóa tòa nhà (chỉ khi không có căn hộ) |
| GET | `/api/admin/buildings/:id/blocks` | Danh sách block của tòa nhà |
| POST | `/api/admin/buildings/:id/blocks` | Thêm block |

**POST `/api/admin/buildings`** — Body:
```json
{
  "name": "ApartmentHub Tower",
  "address": "123 Đường ABC, Quận 7, TP.HCM",
  "totalFloors": 25,
  "blocks": ["A", "B", "C"],
  "yearBuilt": 2018
}
```

---

### 4. Cấu hình hệ thống

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/admin/config` | Lấy toàn bộ cấu hình hệ thống |
| PATCH | `/api/admin/config` | Cập nhật cấu hình (batch update) |

**GET response:**
```json
{
  "app": {
    "name": "ApartmentHub",
    "logo": "https://...",
    "supportEmail": "support@apartmenthub.vn",
    "supportPhone": "1900-xxxx"
  },
  "invoice": {
    "dueDays": 15,
    "lateFeePercent": 2,
    "reminderDaysBefore": 3
  },
  "guest": {
    "maxGuestsPerVisit": 5,
    "advanceBookingDays": 7,
    "requireApproval": true
  },
  "parking": {
    "maxVehiclesPerApartment": 2,
    "requireApproval": true
  },
  "amenity": {
    "maxBookingsPerMonth": 8
  }
}
```

**PATCH body:** gửi partial object, chỉ cập nhật các key được gửi lên.
```json
{
  "invoice": { "dueDays": 20, "lateFeePercent": 3 }
}
```
→ Lưu vào bảng `SystemConfig` dạng `{ key: 'invoice.dueDays', value: '20' }`.
→ Ghi `ActivityLog`.

---

### 5. Log hoạt động

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/admin/logs` | Lịch sử hoạt động toàn hệ thống |
| GET | `/api/admin/logs/user/:userId` | Log của 1 user cụ thể |

**GET `/api/admin/logs`** — Query: `?action=role_change&userId=5&from=2024-06-01&to=2024-06-30&page=1&limit=50`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "userId": 1,
      "userName": "Admin Hệ Thống",
      "action": "role_change",
      "target": "User #5 (Nguyễn Văn A)",
      "detail": "resident → manager",
      "ipAddress": "192.168.1.1",
      "createdAt": "2024-06-20T10:00:00Z"
    }
  ]
}
```
`action` enum: `login` | `logout` | `role_change` | `status_change` | `config_update` | `password_reset` | `user_create` | `user_delete`

---

## Business rules quan trọng

1. **Admin không thể tự thay đổi role của chính mình** (tránh tự lock out).
2. **Admin không thể xóa tài khoản admin cuối cùng** — luôn phải có ít nhất 1 admin.
3. **Thay đổi role hay status**: bắt buộc ghi `ActivityLog` với đầy đủ thông tin.
4. **Config hệ thống**: khi update, invalidate cache nếu có. Các service khác đọc config qua `SystemConfig.get(key)` utility.
5. **Xóa tòa nhà**: cascade check — không cho xóa nếu còn căn hộ, còn cư dân đang ở.
6. **Soft delete**: tài khoản không bao giờ xóa hẳn khỏi DB, chỉ set `status = 'deleted'`.
7. **Log tự động**: middleware `logActivity` được gắn vào các endpoint nhạy cảm của admin, tự động ghi log sau mỗi request thành công.

---

## Middleware chain

```js
router.use(authenticate);
router.use(authorize('admin'));
```

**Middleware log tự động:**
```js
// middlewares/activity.logger.middleware.js
// Gắn vào sau handler của các route nhạy cảm:
// POST /users, PATCH /users/:id/role, PATCH /users/:id/status,
// PATCH /config, DELETE /buildings/:id
export const logActivity = (action) => async (req, res, next) => {
  res.on('finish', async () => {
    if (res.statusCode < 400) {
      await ActivityLog.create({
        userId: req.user.id,
        action,
        target: JSON.stringify(req.params),
        detail: JSON.stringify(req.body),
        ipAddress: req.ip,
      });
    }
  });
  next();
};
```

---

## Model cần tạo

```js
// Building
{ id, name, address, totalFloors, yearBuilt, status, createdAt, updatedAt }

// Block (thuộc Building)
{ id, buildingId, name, totalApartments, createdAt }

// SystemConfig
{ id, key (unique), value (TEXT), updatedBy (userId), updatedAt }

// ActivityLog
{ id, userId, action, target, detail (TEXT), ipAddress, createdAt }
```

---

## Ghi chú cho agent

- `SystemConfig` nên có util: `ConfigService.get('invoice.dueDays')` → parse từ DB, cache in-memory 5 phút.
- Trang Users frontend: cần filter dropdown cho role, search input debounce 300ms, pagination.
- Trang SystemConfig frontend: render form động từ response của `GET /config`, group theo namespace (app, invoice, guest...).
- `GET /admin/dashboard`: `activeToday` = đếm user có `lastLogin >= today 00:00`.
- Reset password: generate 12 ký tự ngẫu nhiên (chữ + số), hash bcrypt, lưu DB, gửi email plaintext password, yêu cầu đổi ngay sau login đầu tiên (`requirePasswordChange: true`).
