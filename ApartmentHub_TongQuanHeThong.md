# Tổng Quan Hệ Thống ApartmentHub (Comprehensive Documentation)

Tài liệu này mô tả toàn diện tất cả các module, chức năng, và logic nghiệp vụ (business logic) đang hiện hữu trong dự án quản lý chung cư **ApartmentHub**.

---

## 1. Kiến Trúc & Công Nghệ (Tech Stack)
- **Mô hình**: Client-Server (RESTful API).
- **Frontend**: React.js (Vite), Tailwind CSS, Framer Motion, React Router v7, Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Cơ sở dữ liệu**: MongoDB (Mongoose ODM).
- **Bảo mật & Tối ưu**: JWT Authentication, bcryptjs (mã hóa mật khẩu), express-validator, express-rate-limit.
- **Background Jobs**: `node-cron` xử lý hóa đơn tự động và cập nhật trạng thái.

---

## 2. Phân Quyền Người Dùng (Roles)
Hệ thống được chia thành 7 nhóm vai trò với các luồng nghiệp vụ riêng biệt:
1. **Guest** (Khách vãng lai chưa đăng nhập)
2. **Resident** (Cư dân)
3. **Manager** (Ban quản lý - Vận hành)
4. **Admin** (Quản trị hệ thống)
5. **Accountant** (Kế toán)
6. **Security** (Bảo vệ)
7. **Maintenance** (Kỹ thuật viên)

---

## 3. Chi Tiết Chức Năng & Logic Nghiệp Vụ Theo Vai Trò

### 3.1. Guest (Khách vãng lai)
Nhóm người dùng truy cập trang chủ (Landing Page) để tìm hiểu dự án và tìm thuê căn hộ.
- **Tính năng Public**:
  - Xem thông tin giới thiệu, tiện ích, chính sách tài chính của dự án.
  - **Căn hộ cho thuê (Public Rentals)**: 
    - Xem danh sách phòng trống (trạng thái `available`, `vacant`).
    - Lọc thời gian thực theo Giá, Diện tích, Tòa nhà (Block), Số phòng ngủ. Tìm kiếm theo tên phòng. Sắp xếp kết quả.
    - Phân trang (Pagination) và "Load more".
    - Lưu danh sách căn hộ yêu thích (Wishlist) qua LocalStorage.
  - **Chi tiết căn hộ**:
    - Xem hình ảnh (Gallery Lightbox), thông tin mô tả, đặc quyền.
    - Đề xuất các căn hộ tương tự (cùng block hoặc tầm giá).
  - **Đặt lịch xem nhà**: 
    - Khách điền Form (Tên, SĐT, Ngày, Khung giờ).
    - **Logic**: SĐT phải đúng định dạng VN, Ngày đặt không nằm trong quá khứ.
    - **Rate Limit**: Giới hạn tối đa 3 yêu cầu / 1 giờ / 1 IP để chống spam.

### 3.2. Resident (Cư dân)
Nhóm người dùng đã thuê nhà và được cấp tài khoản, quản lý mọi sinh hoạt qua Dashboard Cư dân.
- **Hồ sơ & Căn hộ**:
  - Quản lý thông tin cá nhân.
  - Xem chi tiết căn hộ đang thuê (Thông tin phòng, hợp đồng, danh sách thành viên).
  - **Logic giới hạn**: Một phòng không được chứa quá 10 thành viên.
- **Khách đến thăm (Guests)**:
  - Khai báo khách thăm để bảo vệ check-in.
  - **Logic**: Chặn đăng ký giờ đến trong quá khứ (cùng ngày). Chặn đăng ký trùng lặp người và thời gian. Tên khách không chứa ký tự đặc biệt/số. Bắt buộc có CCCD.
  - **Auto-approve**: Nếu mục đích khai báo là "Thăm gia đình", hệ thống tự động duyệt, không cần Manager duyệt.
- **Đăng ký gửi xe (Parking)**:
  - Đăng ký phương tiện mới (Ô tô, Xe máy).
  - **Logic**: Biển số xe phải là duy nhất trên toàn hệ thống. Có thể chỉnh sửa thông tin xe khi đang ở trạng thái chờ duyệt (Pending).
- **Hóa đơn & Thanh toán (Invoices)**:
  - Xem danh sách hóa đơn hàng tháng (Tiền điện, nước, dịch vụ, tiền phòng).
  - **Logic**: Tiền khởi tạo hóa đơn không được phép là số âm. Tích hợp thanh toán mô phỏng (VNPay/Credit).
- **Báo cáo sự cố (Maintenance)**:
  - Gửi yêu cầu sửa chữa (Điện, nước, cơ sở vật chất).
  - **Logic**: Tiêu đề và mô tả không được rỗng hoặc chỉ chứa khoảng trắng. Mô tả tối đa 5000 ký tự tránh tràn database.
- **Đặt tiện ích (Amenities Booking)**:
  - Đăng ký sử dụng BBQ, Gym, Hồ bơi, Sân Tennis.
  - **Logic thời gian**: Không được đặt quá 4 tiếng/lần. Không đặt ngoài giờ hoạt động của tiện ích.
  - **Logic sức chứa (Collision Check)**: Hệ thống tính tổng số người đang book tại cùng 1 khung giờ, nếu vượt quá `capacity` của tiện ích sẽ từ chối.
  - **Logic hủy**: Chặn hủy lịch nếu tiện ích bắt đầu trong vòng chưa tới 1 tiếng.
- **Tương tác khác**: Xem thông báo chung, gửi Góp ý/Khiếu nại (Feedbacks), thực hiện Khảo sát (Surveys) từ BQL.

### 3.3. Manager (Ban Quản Lý)
Vận hành, phê duyệt và giám sát các hoạt động của tòa nhà hàng ngày.
- **Dashboard**: Thống kê số liệu cư dân, căn hộ trống, doanh thu, yêu cầu xử lý.
- **Quản lý Căn hộ & Cư dân**:
  - Xem, chỉnh sửa thông tin cư dân, cấp tài khoản.
  - Thay đổi trạng thái căn hộ (`occupied`, `maintenance`, `available`).
- **Phê duyệt**:
  - Duyệt / Từ chối khai báo khách thăm.
  - Duyệt / Từ chối thẻ xe.
  - Duyệt lịch đặt tiện ích của cư dân.
  - **Viewing Requests**: Duyệt và phân công nhân viên dẫn khách ngoài đi xem căn hộ trống.
- **Giao tiếp cư dân**:
  - Tạo và phát đi Thông báo chung (Announcements).
  - Tiếp nhận và trả lời các Góp ý (Feedbacks).
- **Quản lý Hóa đơn**:
  - Khởi tạo hóa đơn hàng loạt (Sử dụng `insertMany` để tối ưu hiệu suất với dữ liệu lớn ~5000 hóa đơn).
  - Xem nợ quá hạn và gửi Email nhắc nhở nợ tự động tới từng phòng.

### 3.4. Admin (Quản Trị Hệ Thống)
Kiểm soát phần lõi và hạ tầng dữ liệu.
- Quản lý tất cả Users và phân quyền tài khoản (Manager, Security, Accountant...).
- Định nghĩa Tòa nhà (Buildings), Block, sơ đồ tầng.
- Cài đặt hệ thống (System Config: quy định thời gian, số lượng tối đa).
- Giám sát Activity Logs (Nhật ký thao tác của nhân viên để truy vết).

### 3.5. Accountant (Kế Toán)
Quản lý dòng tiền của toàn bộ dự án.
- Dashboard thu chi tài chính.
- Quản lý Hóa đơn (Invoices) và các Giao dịch thanh toán (Payments).
- Kiểm soát công nợ (Debts), tính lãi trễ hạn.
- Cấu hình biểu phí Dịch vụ (Service Fees). Báo cáo tài chính (Reports).

### 3.6. Security (Bảo Vệ)
Kiểm soát an ninh vòng ngoài.
- Dashboard giám sát camera/hoạt động.
- Check-in/Check-out khách ra vào (Quét mã hoặc nhập tên).
- Kiểm tra danh sách khách đã được khai báo (Guest List).
- Quản lý xe ra vào bãi (Vehicles).
- Báo cáo sự cố an ninh khẩn cấp (Incidents).

### 3.7. Maintenance (Kỹ Thuật Viên)
Thực thi các công việc sửa chữa.
- Tiếp nhận các yêu cầu sự cố (Tasks) từ Cư dân/Manager.
- Cập nhật trạng thái sửa chữa (Đang xử lý, Đã hoàn thành).
- Xem lịch trực (Schedule).

---

## 4. Tóm Tắt Các Kỹ Thuật Validation Cốt Lõi Đang Áp Dụng
Tất cả dữ liệu từ Client gửi lên đều được xác thực chặt chẽ qua Middleware `express-validator`:
1. Chống XSS, SQL/NoSQL Injection bằng cách sanitize input.
2. Kiểm tra khoảng trắng (whitespace-only bypass).
3. Đảm bảo dữ liệu số (amount, price, area) luôn >= 0.
4. Kiểm tra logic ngày tháng (không đặt lịch trong quá khứ).
5. Chuẩn hóa định dạng chuỗi (SĐT Việt Nam, max length, chặn ký tự đặc biệt khi không cần thiết).

Hệ thống hoạt động với nguyên tắc "Fail-fast" - trả về mã lỗi `400 Bad Request` kèm theo thông điệp tiếng Việt cụ thể ngay từ tầng Route trước khi tiến vào xử lý Logic Controller. Tối ưu hiệu năng Database cho các truy vấn tính toán sức chứa tiện ích và tạo hóa đơn hàng loạt.
