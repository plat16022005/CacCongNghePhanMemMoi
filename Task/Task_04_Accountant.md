# Task 04 — Accountant (Kế toán)

## Mục tiêu
Triển khai toàn bộ chức năng dành cho role **Accountant** trong hệ thống ApartmentHub.
Kế toán quản lý toàn bộ vòng đời tài chính: tạo hóa đơn, xác nhận thanh toán, theo dõi công nợ và xuất báo cáo tài chính.

## Kiến trúc áp dụng
- Backend: Express.js, MVC + Layered Architecture
- Auth: JWT + middleware `authorize('accountant')`
- DB: Mongodb
- Lưu ý: Accountant và Manager đều thấy dữ liệu tài chính, nhưng chỉ Accountant mới được tạo/sửa hóa đơn

---

## Cấu trúc file cần tạo / chỉnh sửa

### Backend
```
src/
├── repositories/
│   └── accountant.repository.js
│
├── services/
│   ├── accountant.invoice.service.js
│   ├── accountant.payment.service.js
│   └── accountant.report.service.js
│
├── controllers/
│   └── accountant.controller.js
│
├── validations/
│   └── accountant.validation.js
│
└── route/
    └── accountant.routes.js
```

### Frontend
```
frontend/src/
├── pages/accountant/
│   ├── Dashboard.tsx
│   ├── Invoices.tsx
│   ├── InvoiceCreate.tsx
│   ├── InvoiceBulkCreate.tsx
│   ├── Payments.tsx
│   ├── Debts.tsx
│   └── Reports.tsx
│
└── components/accountant/
    ├── InvoiceForm.tsx
    ├── BulkInvoiceTable.tsx
    ├── PaymentConfirmModal.tsx
    └── DebtTable.tsx
```

---

## Chi tiết từng API

### 1. Dashboard kế toán

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/accountant/dashboard` | Số liệu tài chính tổng quan |

**Response:**
```json
{
  "currentMonth": "2024-06",
  "totalBilled": 120000000,
  "totalCollected": 95000000,
  "totalOverdue": 25000000,
  "overdueCount": 18,
  "invoicesCreatedThisMonth": 156,
  "pendingConfirmation": 7
}
```

---

### 2. Quản lý hóa đơn

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/accountant/invoices` | Danh sách hóa đơn (filter đầy đủ) |
| GET | `/api/accountant/invoices/:id` | Chi tiết hóa đơn |
| POST | `/api/accountant/invoices` | Tạo 1 hóa đơn |
| POST | `/api/accountant/invoices/bulk` | Tạo hóa đơn hàng loạt (theo tháng) |
| PATCH | `/api/accountant/invoices/:id` | Chỉnh sửa hóa đơn (chỉ khi chưa thanh toán) |
| DELETE | `/api/accountant/invoices/:id` | Xóa hóa đơn (chỉ khi status=draft) |

**GET `/api/accountant/invoices`** — Query params:
`?status=unpaid&type=electricity&month=2024-06&apartmentId=5&page=1&limit=20`

`status` enum: `draft` | `unpaid` | `paid` | `overdue` | `cancelled`
`type` enum: `electricity` | `water` | `management` | `parking` | `amenity` | `other`

**POST `/api/accountant/invoices`** — Body:
```json
{
  "apartmentId": 5,
  "type": "electricity",
  "period": "2024-06",
  "amount": 350000,
  "dueDate": "2024-06-30",
  "details": {
    "previousReading": 1200,
    "currentReading": 1435,
    "unitPrice": 1500,
    "units": 235
  },
  "note": "string (optional)"
}
```

**POST `/api/accountant/invoices/bulk`** — Tạo hóa đơn hàng loạt:
```json
{
  "period": "2024-06",
  "type": "management",
  "dueDate": "2024-06-30",
  "pricePerSqm": 8000,
  "targetApartments": "all"
}
```
`targetApartments`: `"all"` hoặc mảng `[apartmentId, ...]`
→ Hệ thống tự tính `amount = area * pricePerSqm` cho từng căn hộ.
→ Response: `{ "created": 108, "skipped": 2, "errors": [] }`

---

### 3. Xác nhận thanh toán

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/accountant/payments` | Danh sách giao dịch thanh toán |
| PATCH | `/api/accountant/payments/:invoiceId/confirm` | Xác nhận thanh toán thủ công (tiền mặt) |
| PATCH | `/api/accountant/payments/:invoiceId/cancel` | Hủy xác nhận / hoàn tiền |

**PATCH confirm** — Body:
```json
{
  "paymentMethod": "cash",
  "amount": 350000,
  "note": "Cư dân nộp tiền mặt tại văn phòng"
}
```
`paymentMethod` enum: `cash` | `bank_transfer` | `online`
→ Cập nhật `invoice.status = 'paid'`, tạo `PaymentRecord`, gửi notification cho resident.

**GET `/api/accountant/payments`** — Response:
```json
{
  "data": [
    {
      "id": 1,
      "invoiceId": 15,
      "apartmentCode": "A101",
      "residentName": "Nguyễn Văn A",
      "amount": 350000,
      "method": "online",
      "paidAt": "2024-06-18T10:30:00Z",
      "confirmedBy": "auto"
    }
  ]
}
```

---

### 4. Quản lý công nợ

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/accountant/debts` | Danh sách căn hộ đang nợ |
| GET | `/api/accountant/debts/:apartmentId` | Chi tiết nợ của 1 căn hộ |
| POST | `/api/accountant/debts/remind` | Gửi nhắc nợ cho 1 hoặc nhiều căn hộ |

**GET `/api/accountant/debts`** — Query: `?minAmount=100000&overdueOnly=true`

**Response:**
```json
{
  "data": [
    {
      "apartmentCode": "B205",
      "residentName": "Lê Văn C",
      "totalDebt": 1200000,
      "invoiceCount": 3,
      "oldestDueDate": "2024-04-30"
    }
  ],
  "summary": {
    "totalApartments": 18,
    "totalDebt": 25000000
  }
}
```

**POST remind** — Body:
```json
{
  "apartmentIds": [3, 7, 12],
  "message": "string (optional, để trống dùng template mặc định)"
}
```

---

### 5. Theo dõi phí dịch vụ

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/accountant/service-fees` | Danh sách phí dịch vụ hiện tại |
| POST | `/api/accountant/service-fees` | Thêm loại phí mới |
| PATCH | `/api/accountant/service-fees/:id` | Cập nhật đơn giá |

**POST/PATCH body:**
```json
{
  "name": "Phí quản lý",
  "type": "management",
  "unit": "per_sqm",
  "price": 8000,
  "effectiveFrom": "2024-07-01"
}
```
`unit` enum: `per_sqm` | `per_unit` | `fixed` | `per_vehicle`

---

### 6. Xuất báo cáo tài chính

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/accountant/reports/monthly` | Báo cáo thu chi tháng |
| GET | `/api/accountant/reports/annual` | Báo cáo năm |
| GET | `/api/accountant/reports/export` | Xuất file Excel (.xlsx) |

**GET monthly** — Query: `?month=2024-06`

**Response:**
```json
{
  "period": "2024-06",
  "byType": [
    { "type": "electricity", "billed": 42000000, "collected": 38000000, "rate": 90.5 },
    { "type": "management", "billed": 35000000, "collected": 35000000, "rate": 100 }
  ],
  "total": { "billed": 120000000, "collected": 95000000, "outstanding": 25000000 }
}
```

**GET export** — Query: `?from=2024-01-01&to=2024-06-30&format=xlsx`
→ Trả về file download (`Content-Disposition: attachment; filename=BaoCao_TC_2024.xlsx`)
→ Dùng thư viện `exceljs` để tạo file.

---

## Business rules quan trọng

1. **Chỉ Accountant** mới có thể tạo, sửa, xóa hóa đơn. Manager chỉ đọc.
2. **Bulk invoice**: không tạo trùng (check `apartmentId + type + period` unique). Nếu đã tồn tại → skip, không báo lỗi.
3. **Sửa hóa đơn**: chỉ cho phép khi `status ∈ {draft, unpaid}`. Hóa đơn đã `paid` không được sửa.
4. **Xóa hóa đơn**: chỉ xóa được khi `status = 'draft'`.
5. **Overdue tự động**: mỗi ngày midnight, job (cron) tự chuyển hóa đơn `unpaid` có `dueDate < today` sang `overdue`.
6. **Thanh toán online**: callback từ cổng thanh toán (Task 01) tự động confirm, kế toán không cần làm gì. Kế toán chỉ confirm thủ công cho tiền mặt/chuyển khoản.
7. **Export Excel**: bảo mật — chỉ Accountant và Manager được tải.

---

## Middleware chain

```js
router.use(authenticate);
router.use(authorize('accountant'));
```

---

## Cron job cần tạo

```js
// src/jobs/invoice.job.js
// Chạy mỗi ngày lúc 00:05
// Cập nhật tất cả invoice có status='unpaid' và dueDate < TODAY sang status='overdue'
// Sau đó tạo notification invoice_reminder cho các resident tương ứng
```

---

## Ghi chú cho agent

- Khi tạo bulk invoice: dùng `bulkCreate` với `ignoreDuplicates: true` (Sequelize option).
- Export Excel: dùng `exceljs`, tạo workbook với 3 sheet: Tổng hợp, Chi tiết theo căn hộ, Chi tiết theo loại phí.
- Tất cả số tiền lưu dạng integer (VND, không dùng decimal), hiển thị frontend dùng `toLocaleString('vi-VN')`.
- `PaymentRecord` model cần có: `invoiceId`, `amount`, `method`, `paidAt`, `confirmedBy` (userId của kế toán hoặc `'auto'` nếu online), `note`.
