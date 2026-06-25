# Kịch Bản Kiểm Thử Giao Diện & Luồng Hoạt Động (ApartmentHub)

Tài liệu này cung cấp các kịch bản (Test Cases) để bạn có thể kiểm tra thủ công (Manual Testing) toàn bộ 6 phân hệ (Roles) của hệ thống ApartmentHub, đảm bảo dữ liệu chạy xuyên suốt qua các phòng ban.

---

## 1. Môi Trường & Dữ Liệu Khởi Tạo
- **Link truy cập:** `http://localhost:5173/login` (hoặc port của server backend nếu đã build lên EJS).
- **Tài khoản dùng chung mật khẩu:** `123456`
- **Danh sách tài khoản test:**
  - `admin@abc.com` (Quản trị hệ thống)
  - `manager@abc.com` (Ban quản lý)
  - `security@abc.com` (Bảo vệ)
  - `accountant@abc.com` (Kế toán)
  - `maintenance@abc.com` (Kỹ thuật bảo trì)
  - `resident@abc.com` (Cư dân - đang sở hữu phòng A101)

---

## 2. Kịch Bản 1: Luồng Quản Trị Hệ Thống (Admin)
**Mục tiêu:** Kiểm tra khả năng thiết lập cấu hình chung và quản lý quyền người dùng.

1. **Đăng nhập:** `admin@abc.com` -> Hệ thống chuyển hướng vào `/admin`.
2. **Kiểm tra Dashboard:** Xem thống kê tổng số user, tòa nhà, phân bố Role.
3. **Quản lý Tòa nhà (Buildings):**
   - Truy cập menu **Tòa nhà / Block**.
   - Bấm thêm Block C, điền thông tin và lưu lại.
   - Kiểm tra xem Block C đã hiển thị trong danh sách chưa.
4. **Quản lý Người Dùng (Users):**
   - Truy cập **Người dùng**. Tìm kiếm tài khoản `resident@abc.com`.
   - Đổi Role hoặc thử Khóa (Block) một tài khoản bất kỳ (VD: tạo tài khoản test mới để khóa).
5. **Thiết lập Hệ thống (System Config):**
   - Vào **Cấu hình**. Thử đổi Phí quản lý (maintenance_fee) hoặc Tên tòa nhà. Bấm Lưu.
6. **Nhật ký Hoạt động (Activity Logs):**
   - Vào **Nhật ký**. Xác nhận các thao tác bạn vừa làm (sửa cấu hình, thêm tòa nhà) đã được hệ thống lưu lại kèm địa chỉ IP và thời gian.

---

## 3. Kịch Bản 2: Luồng Vận Hành Của Ban Quản Lý (Manager)
**Mục tiêu:** Kiểm tra luồng thêm cư dân mới, quản lý căn hộ và duyệt yêu cầu.

1. **Đăng nhập:** `manager@abc.com` -> Hệ thống chuyển hướng vào `/manager`.
2. **Quản lý Cư Dân & Căn Hộ:**
   - Vào **Căn hộ**. Xem danh sách căn hộ A101 (đã thuê), A102 (trống), B201.
   - Bấm vào A102, thực hiện gán cho một User mới (có thể tạo nhanh nếu hệ thống yêu cầu).
3. **Quản lý Tiện Ích (Amenities):**
   - Vào **Tiện ích**. Thêm một tiện ích mới (Ví dụ: "Hồ bơi vô cực" giá 50.000 VNĐ).
   - Kiểm tra danh sách Booking (hiện tại sẽ trống).
4. **Phản Ánh (Feedbacks):**
   - Vào **Phản ánh**. Nếu có phản ánh, thử thay đổi trạng thái sang "Đang xử lý" hoặc "Đã giải quyết" và phản hồi lại cho cư dân.
5. **Báo cáo:**
   - Vào **Báo cáo**. Xuất file báo cáo danh sách cư dân (PDF/Excel) hoặc xem biểu đồ thống kê mức độ hài lòng.

---

## 4. Kịch Bản 3: Luồng Kiểm Soát Ra Vào (Security)
**Mục tiêu:** Kiểm tra hệ thống check-in phương tiện và khách ra vào của bảo vệ.

1. **Đăng nhập:** `security@abc.com` -> Hệ thống chuyển hướng vào `/security`.
2. **Kiểm soát Phương tiện (Vehicles):**
   - Vào **Phương tiện**. Nhập biển số bất kỳ (Ví dụ: `51A-12345`).
   - Nếu hệ thống báo "Không tìm thấy", nhấn "Cho vào" (sẽ ghi nhận là xe khách).
   - Nếu tìm thấy biển số đã đăng ký, nhấn "Cho vào" hoặc "Cho ra".
3. **Đăng ký Khách Vãng Lai (Check-in):**
   - Vào **Check-in**. Nhập tên khách "Nguyễn Văn Test", Căn hộ ghé thăm "A101", Số CMND/CCCD.
   - Chụp ảnh (nếu máy có camera) và nhấn Xác nhận.
4. **Quản lý Khách & Sự cố:**
   - Vào danh sách Khách, bấm Check-out cho "Nguyễn Văn Test".
   - Vào **Sự cố**. Thêm một biên bản sự cố (VD: "Cư dân làm ồn lúc 12h đêm").

---

## 5. Kịch Bản 4: Luồng Kế Toán & Thu Phí (Accountant)
**Mục tiêu:** Phát hành hóa đơn hàng tháng và ghi nhận thanh toán.

1. **Đăng nhập:** `accountant@abc.com` -> Hệ thống chuyển hướng vào `/accountant`.
2. **Quản lý Hóa Đơn (Invoices):**
   - Vào **Hóa đơn**. Nhấn nút "Tạo hóa đơn tháng này".
   - Kiểm tra xem hệ thống có tự động sinh hóa đơn cho phòng A101 (tiền phòng + phí dịch vụ) không.
3. **Ghi nhận Thanh Toán (Payments):**
   - Giả lập cư dân A101 đem tiền mặt xuống đóng: Tìm hóa đơn của phòng A101 (đang trạng thái Pending/Chưa thanh toán).
   - Bấm "Ghi nhận thanh toán", chọn phương thức "Tiền mặt".
   - Xem hóa đơn chuyển sang trạng thái "Đã thanh toán" (Paid).
4. **Quản lý Công Nợ:**
   - Vào **Công nợ / Nhắc nhở**. Bấm gửi Email nhắc nợ cho các phòng chưa đóng tiền.

---

## 6. Kịch Bản 5: Luồng Kỹ Thuật Bảo Trì (Maintenance)
**Mục tiêu:** Tiếp nhận và xử lý yêu cầu sửa chữa từ cư dân hoặc ban quản lý.

1. **Đăng nhập:** `maintenance@abc.com` -> Hệ thống chuyển hướng vào `/maintenance`.
2. **Tiếp nhận Công Việc:**
   - Vào **Công việc**. Xem các yêu cầu bảo trì đang mở.
   - Bấm vào một yêu cầu, chuyển trạng thái sang "Đang xử lý".
3. **Hoàn thành Công Việc:**
   - Sau khi xử lý xong, cập nhật trạng thái thành "Đã hoàn thành". Ghi chú: "Đã thay bóng đèn mới".
4. **Lịch Bảo Trì Định Kỳ:**
   - Vào **Lịch bảo trì**. Thêm một lịch bảo trì định kỳ (VD: "Bảo trì thang máy Block A vào ngày 15 hàng tháng").

---

## 7. Kịch Bản 6: Luồng Cư Dân (Resident) - Test Tích Hợp
**Mục tiêu:** Cư dân là người tạo ra data (Booking, Phản ánh, Báo lỗi) cho các phòng ban trên xử lý.

1. **Đăng nhập:** `resident@abc.com` -> Hệ thống chuyển hướng vào `/dashboard`.
2. **Giao diện Trang chủ:** Kiểm tra xem số tiền nợ, thông báo mới nhất có hiển thị đúng không.
3. **Gửi Phản Ánh / Yêu Cầu Sửa Chữa:**
   - Vào **Phản ánh**. Tạo mới: "Hành lang tầng 1 có mùi hôi".
   - Vào **Bảo trì**. Gửi yêu cầu: "Điều hòa phòng khách không mát". 
   -> *(Bạn có thể mở Tab ẩn danh đăng nhập Manager và Maintenance để xem 2 yêu cầu này có nhảy vào hệ thống của họ không).*
4. **Đặt Tiện Ích:**
   - Vào **Tiện ích**. Đặt sân Tennis hoặc Hồ bơi cho ngày mai.
   - Quay lại tài khoản Manager xem lịch đặt chỗ có xuất hiện không.
5. **Thanh toán Hóa đơn:**
   - Vào **Hóa đơn**. Kiểm tra hóa đơn mà Kế toán đã tạo ở Kịch bản 4.
   - Thử bấm thanh toán (nếu tích hợp VNPay/Momo sẽ hiện ra, hoặc test hiển thị giao diện chuyển khoản).
6. **Đăng ký xe & Khách:**
   - Đăng ký biển số xe mới.
   - Đăng ký danh sách người thân đến chơi cuối tuần (để Bảo vệ biết).

---

## 8. Checklist Hoàn Thiện Sau Kiểm Thử
- [ ] Giao diện có tương thích di động (Responsive) khi thu nhỏ màn hình không?
- [ ] Khi chuyển Tab/Click menu có bị reload lại cả trang không? (Phải mượt mà theo kiểu SPA).
- [ ] Đăng xuất và đăng nhập lại bằng role khác có bị dính Cache giao diện không?
- [ ] Dữ liệu nhập vào có hiển thị đúng tiếng Việt có dấu không?

*Chúc bạn có những trải nghiệm mượt mà với ApartmentHub!*
