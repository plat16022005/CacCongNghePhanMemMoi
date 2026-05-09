# CacCongNghePhanMemMoi
# CRUD Express + Mongoose + MongoDB

Project mẫu triển khai CRUD sử dụng Node.js, Express, Mongoose và MongoDB.

## Mô tả
- Ứng dụng minh họa cách tạo, đọc, cập nhật, xóa (CRUD) người dùng bằng Express và Mongoose.
- Cấu trúc dự án rõ ràng để bạn dễ hiểu và mở rộng.

## Yêu cầu
- Node.js >= 14
- MongoDB server

## Cài đặt
1. Clone repository hoặc tải source về máy.
2. Cài dependencies:

```bash
npm install
```

3. Đảm bảo MongoDB đang chạy ở `mongodb://localhost:27017` hoặc chỉnh sửa file `src/config/configdb.js` theo cấu hình của bạn.

## Cấu trúc chính
- src/ - mã nguồn chính
  - server.js - entry ứng dụng
  - config/ - cấu hình (configdb.js)
  - controller/ - controller xử lý request
  - models/ - định nghĩa model Mongoose
  - route/ - định nghĩa route
  - services/ - logic CRUD chung
  - views/ - template EJS

## Chạy ứng dụng

```bash
# chạy dự án qua nodemon và babel-node
npm start
```

Sau khi chạy, mở trình duyệt tới http://localhost:6969.

## Thêm thông tin
- Routes chính nằm trong src/route/web.js.
- Model user: src/models/user.js.
- Service CRUD: src/services/CRUDService.js.

