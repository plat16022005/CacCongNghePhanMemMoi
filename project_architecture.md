# Tài liệu Kiến trúc Dự án Quản lý Phòng trọ (Node.js/Express)

Tài liệu này cung cấp cái nhìn tổng quan về cấu trúc thư mục, chức năng của từng file và luồng hoạt động của dự án. File này được tạo ra để hỗ trợ các AI khác hoặc lập trình viên mới nắm bắt nhanh chóng cấu trúc nhằm lên kế hoạch phát triển chức năng chuẩn.

## Tổng quan Kiến trúc

Dự án sử dụng mô hình MVC (Model-View-Controller) kết hợp với các Service và Repository để phân tách logic nghiệp vụ và logic truy xuất dữ liệu (dựa trên kiến trúc Layered Architecture).

## Cấu trúc Thư mục và Chức năng

### 1. Entry Point
- `src/server.js`: File khởi chạy ứng dụng. Thiết lập server Express, kết nối database, cấu hình middleware (CORS, body-parser, cookie-parser), view engine và mount các routes chính.

### 2. Cấu hình (`src/config/`)
- `config.json` / `configdb.js`: Cấu hình kết nối cơ sở dữ liệu (MySQL/Sequelize hoặc MongoDB/Mongoose tùy project). File `configdb.js` đang thiết lập ORM Sequelize để kết nối database.
- `mailer.js`: Cấu hình dịch vụ gửi email (thường sử dụng Nodemailer).
- `viewEngine.js`: Cấu hình template engine (EJS) và thư mục chứa các file static (`public`).

### 3. Định tuyến (`src/route/`)
Chứa các file định nghĩa API endpoints, kết nối các HTTP request tới Controller tương ứng.
- `auth.routes.js`: Định tuyến cho đăng nhập, đăng ký, quên mật khẩu, verify email.
- `user.routes.js`: Định tuyến quản lý thông tin người dùng.
- `room.routes.js`: Định tuyến quản lý phòng trọ (thêm, sửa, xóa, lấy danh sách).
- `application.routes.js`: Định tuyến quản lý các đơn đăng ký thuê phòng.
- `web.js`: Các định tuyến phục vụ render giao diện EJS (nếu có).

### 4. Controllers (`src/controllers/` & `src/controller/`)
Tiếp nhận request từ routes, gọi các Service để xử lý nghiệp vụ và trả về response cho client.
- `auth.controller.js`: Xử lý logic liên quan đến xác thực (Authentication).
- `user.controller.js`: Xử lý logic quản lý user.
- `room.controller.js`: Xử lý logic nghiệp vụ cho phòng trọ.
- `application.controller.js`: Xử lý đăng ký thuê phòng, duyệt đơn.
- `homeController.js` (trong `src/controller/`): Controller cho các trang giao diện cơ bản (trang chủ).

### 5. Services (`src/services/`)
Chứa logic nghiệp vụ lõi (Business Logic). Tách biệt với Controller để tái sử dụng và dễ test.
- `auth.service.js`: Logic mã hóa mật khẩu, tạo token (JWT), kiểm tra email, tạo user mới.
- `user.service.js`: Logic liên quan đến truy xuất, cập nhật thông tin user.
- `CRUDService.js`: Dịch vụ tạo sẵn để xử lý các tác vụ thêm/sửa/xóa cơ bản.

### 6. Repositories (`src/repositories/`)
Tầng tương tác trực tiếp với Database, tách biệt logic truy vấn khỏi Service.
- `user.repository.js`: Các hàm tương tác với bảng User trong Database.

### 7. Models (`src/models/`)
Định nghĩa cấu trúc dữ liệu (Schema) của ứng dụng.
- `index.js`: Khởi tạo và thiết lập các Model.
- `user.js`: Schema của người dùng (Admin, Chủ trọ, Người thuê).
- `room.js`: Schema phòng trọ (thông tin phòng, giá, trạng thái, hình ảnh).
- `roomInvoice.js`: Schema hóa đơn phòng trọ.
- `rentalApplication.js`: Schema đơn đăng ký thuê phòng.

### 8. Middlewares (`src/middlewares/`)
Các hàm chạy trung gian trước khi vào Controller.
- `auth.middleware.js`: Xác thực token JWT, phân quyền (Role-based access).
- `rateLimiter.middleware.js`: Chống spam request, giới hạn số lần gọi API.
- `upload.middleware.js`: Xử lý upload file/hình ảnh (sử dụng Multer và Cloudinary).
- `validate.middleware.js`: Bắt các lỗi validation và định dạng lỗi trả về cho client.

### 9. Validations (`src/validations/`)
Xác thực dữ liệu đầu vào (Input validation) bằng các thư viện như `express-validator`.
- `login.validation.js`: Kiểm tra dữ liệu đăng nhập.
- `register.validation.js`: Kiểm tra dữ liệu đăng ký (độ dài mật khẩu, định dạng email).
- `user.validation.js`: Kiểm tra dữ liệu khi cập nhật thông tin user.

### 10. Utils, Views, Public (`src/utils/`, `src/views/`, `src/public/`)
- `utils/`: Chứa các hàm tiện ích dùng chung.
- `views/`: Chứa các file giao diện EJS dùng cho Server-side Rendering.
- `public/`: Chứa CSS, JS tĩnh, Hình ảnh phục vụ cho các trang EJS.

## Luồng Hoạt Động (Flow) cơ bản
1. **Client** gửi Request (ví dụ: `POST /api/auth/login`).
2. **Router** (`auth.routes.js`) nhận request, có thể đi qua **Validation** (`login.validation.js`) để kiểm tra dữ liệu hoặc **Middleware** (`rateLimiter`).
3. Nếu dữ liệu hợp lệ, request chuyển đến **Controller** (`auth.controller.js`).
4. **Controller** gọi **Service** (`auth.service.js`) để xử lý nghiệp vụ xác thực.
5. **Service** gọi **Repository/Model** (`user.repository.js` hoặc `user.js`) để lấy dữ liệu từ cơ sở dữ liệu.
6. Kết quả từ Database trả về Service, Service trả về Controller.
7. **Controller** format kết quả và trả về Response (JSON) cho **Client**.
