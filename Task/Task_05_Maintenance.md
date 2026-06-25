# Task 05 — Maintenance (Kỹ thuật / Bảo trì)

## Mục tiêu
Triển khai toàn bộ chức năng dành cho role **Maintenance** trong hệ thống ApartmentHub.
Nhân viên bảo trì nhận yêu cầu sửa chữa từ cư dân (hoặc từ Manager phân công), cập nhật tiến độ và quản lý lịch bảo trì định kỳ tòa nhà.

## Kiến trúc áp dụng
- Backend: Express.js, MVC + Layered Architecture
- Auth: JWT + middleware `authorize('maintenance')`
- DB: Mongodb
- Lưu ý: Frontend cần mobile-friendly (nhân viên thường thao tác bằng điện thoại tại hiện trường)

---

## Cấu trúc file cần tạo / chỉnh sửa

### Backend
```
src/
├── repositories/
│   └── maintenance.repository.js
│
├── services/
│   ├── maintenance.task.service.js
│   └── maintenance.schedule.service.js
│
├── controllers/
│   └── maintenance.controller.js
│
├── validations/
│   └── maintenance.validation.js
│
└── route/
    └── maintenance.routes.js
```

### Frontend
```
frontend/src/
├── pages/maintenance/
│   ├── Dashboard.tsx
│   ├── Tasks.tsx          # Danh sách yêu cầu được phân công
│   ├── TaskDetail.tsx     # Chi tiết + cập nhật tiến độ
│   └── Schedule.tsx       # Lịch bảo trì định kỳ
│
└── components/maintenance/
    ├── TaskCard.tsx
    ├── StatusUpdateForm.tsx
    └── ScheduleCalendar.tsx
```

---

## Chi tiết từng API

### 1. Dashboard nhân viên bảo trì

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/maintenance/dashboard` | Tổng quan công việc của nhân viên đăng nhập |

**Response:**
```json
{
  "myTasks": {
    "pending": 3,
    "inProgress": 2,
    "completedToday": 1
  },
  "emergencyTasks": 1,
  "scheduledToday": 2
}
```

---

### 2. Yêu cầu sửa chữa (Tasks)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/maintenance/tasks` | Danh sách yêu cầu được phân công cho mình |
| GET | `/api/maintenance/tasks/all` | Tất cả yêu cầu trong hệ thống (để Manager phân công) |
| GET | `/api/maintenance/tasks/:id` | Chi tiết 1 yêu cầu |
| PATCH | `/api/maintenance/tasks/:id/accept` | Nhận yêu cầu |
| PATCH | `/api/maintenance/tasks/:id/progress` | Cập nhật tiến độ |
| PATCH | `/api/maintenance/tasks/:id/complete` | Đánh dấu hoàn thành |
| PATCH | `/api/maintenance/tasks/:id/assign` | Phân công cho nhân viên khác (Manager only) |

**GET `/api/maintenance/tasks`** — Query: `?status=pending&urgency=high&category=plumbing`

**Response:**
```json
{
  "data": [
    {
      "id": 3,
      "title": "Vòi nước bị rò rỉ",
      "category": "plumbing",
      "urgency": "high",
      "status": "pending",
      "apartmentCode": "A101",
      "residentName": "Nguyễn Văn A",
      "description": "Vòi nước phòng tắm chính bị rò khoảng 30 phút qua",
      "imageUrls": ["https://..."],
      "createdAt": "2024-06-20T09:00:00Z",
      "assignedTo": "Trần Kỹ Thuật"
    }
  ]
}
```

**PATCH `/api/maintenance/tasks/:id/progress`** — Body:
```json
{
  "status": "in_progress",
  "note": "Đã đến hiện trường, đang kiểm tra",
  "imageUrls": ["https://... (ảnh tiến độ)"]
}
```
`status` enum: `pending` | `assigned` | `in_progress` | `waiting_parts` | `completed` | `cancelled`

**PATCH `/api/maintenance/tasks/:id/complete`** — Body:
```json
{
  "completionNote": "Đã thay vòi nước mới, vệ sinh sạch sẽ",
  "imageUrls": ["https://... (ảnh sau khi sửa)"],
  "materialsUsed": [
    { "name": "Vòi nước Inax", "quantity": 1, "cost": 250000 }
  ]
}
```
→ Sau khi complete: tự động gửi notification cho resident `maintenance_update`.

**PATCH `/api/maintenance/tasks/:id/assign`** — (Chỉ Manager gọi được, nhưng đặt trong route maintenance để gọn)
```json
{ "assignedTo": 7 }
```
`assignedTo`: userId của nhân viên bảo trì.

---

### 3. Lịch sử cập nhật của 1 yêu cầu

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/maintenance/tasks/:id/history` | Timeline cập nhật trạng thái |

**Response:**
```json
{
  "taskId": 3,
  "history": [
    { "status": "pending", "note": "Cư dân gửi yêu cầu", "updatedBy": "Nguyễn Văn A", "at": "09:00" },
    { "status": "assigned", "note": "Phân công cho Trần KT", "updatedBy": "Manager", "at": "09:15" },
    { "status": "in_progress", "note": "Đang xử lý tại hiện trường", "updatedBy": "Trần KT", "at": "10:30" }
  ]
}
```
→ Cần model `MaintenanceHistory` (taskId, status, note, updatedBy, createdAt).

---

### 4. Lịch bảo trì định kỳ

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/maintenance/schedule` | Danh sách lịch bảo trì (tháng, năm) |
| POST | `/api/maintenance/schedule` | Tạo lịch bảo trì định kỳ |
| PATCH | `/api/maintenance/schedule/:id` | Cập nhật lịch |
| PATCH | `/api/maintenance/schedule/:id/done` | Đánh dấu đã thực hiện |
| DELETE | `/api/maintenance/schedule/:id` | Xóa lịch |

**GET `/api/maintenance/schedule`** — Query: `?month=2024-06`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Bảo dưỡng thang máy Block A",
      "category": "elevator",
      "scheduledDate": "2024-06-25",
      "scheduledTime": "08:00",
      "estimatedDuration": 120,
      "assignedTo": "Trần Kỹ Thuật",
      "status": "scheduled",
      "recurrence": "monthly"
    }
  ]
}
```

**POST body:**
```json
{
  "title": "string",
  "category": "elevator",
  "scheduledDate": "2024-06-25",
  "scheduledTime": "08:00",
  "estimatedDuration": 120,
  "assignedTo": 7,
  "recurrence": "monthly",
  "note": "string"
}
```
`category` enum: `elevator` | `generator` | `water_pump` | `fire_system` | `common_area` | `other`
`recurrence` enum: `once` | `weekly` | `monthly` | `quarterly` | `annually`

---

### 5. Thống kê cá nhân nhân viên

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/maintenance/stats` | Thống kê hiệu suất cá nhân |

**Response:**
```json
{
  "thisMonth": {
    "completed": 18,
    "avgCompletionTime": "4.2 giờ",
    "byCategory": [
      { "category": "plumbing", "count": 8 },
      { "category": "electrical", "count": 6 }
    ]
  }
}
```

---

## Business rules quan trọng

1. **Nhân viên chỉ thấy task được phân công cho mình** qua `GET /tasks`. Muốn xem tất cả dùng `/tasks/all` (cần thêm quyền manager hoặc mở cho cả maintenance).
2. **Urgency emergency**: task có `urgency = 'emergency'` phải xuất hiện đầu danh sách, đánh dấu màu đỏ frontend.
3. **Không thể complete** khi status còn `pending` (phải accept → in_progress → complete).
4. **Lịch bảo trì recurrence**: khi đánh dấu `done` một lịch `recurrence != 'once'`, tự động tạo lịch kế tiếp (cộng thêm 1 tuần/tháng/quý/năm).
5. **Notification**: khi task được phân công (assign), gửi notification cho nhân viên được gán. Khi complete, gửi cho resident.
6. **Ảnh tiến độ**: dùng `multer`, lưu vào `src/public/uploads/maintenance-progress/`.

---

## Model cần tạo thêm

```js
// MaintenanceHistory
{
  id, taskId, status, note, imageUrls (JSON array),
  updatedBy (userId), createdAt
}

// MaintenanceSchedule
{
  id, title, category, scheduledDate, scheduledTime,
  estimatedDuration (minutes), assignedTo (userId),
  recurrence, status ('scheduled'|'done'|'cancelled'),
  completedAt, note, createdAt, updatedAt
}
```

---

## Middleware chain

```js
router.use(authenticate);
router.use(authorize('maintenance'));
// Riêng endpoint /assign cần authorize(['maintenance', 'manager'])
```

---

## Ghi chú cho agent

- `GET /tasks/all` cần authorize cho cả `maintenance` và `manager` (dùng `authorize(['maintenance', 'manager'])`).
- `PATCH /:id/assign` chỉ cho `manager`.
- Timeline history: mỗi lần gọi `progress` hay `complete`, insert 1 row vào `MaintenanceHistory`.
- Sort task: `urgency` (emergency → high → normal → low), sau đó `createdAt ASC`.
- Frontend `TaskCard.tsx`: hiển thị urgency badge (màu đỏ/cam/xanh/xám), category icon, thời gian tạo dạng "3 giờ trước".
