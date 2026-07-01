# Phân tích chức năng Giao diện Xem nhà dành cho người dùng chưa đăng nhập (Public Rentals Page)

Dựa trên mã nguồn hiện tại của trang `Rentals.tsx` (`frontend/src/pages/public/Rentals.tsx`), dưới đây là danh sách các chức năng và luồng hoạt động hiện có dành cho người dùng khách (Guest) khi vào xem danh sách căn hộ trống mà không cần đăng nhập:

## 1. Trạng thái tải dữ liệu (Loading State)
- Khi người dùng truy cập trang, hệ thống sẽ tự động gọi API `GET /api/public/apartments` để lấy danh sách các căn hộ đang trống (có trạng thái `available`).
- Trong thời gian chờ phản hồi từ server, giao diện hiển thị biểu tượng tải xoay vòng (Spinner) ở giữa màn hình.

## 2. Trạng thái Không có dữ liệu (Empty State)
- Nếu API trả về mảng rỗng (không có căn hộ nào trống), hệ thống sẽ hiển thị một khối thông báo giao diện thân thiện với nội dung: **"Hiện chưa có căn hộ trống"** kèm lời khuyên "Vui lòng quay lại sau hoặc liên hệ ban quản lý để được hỗ trợ."

## 3. Hiển thị danh sách Căn hộ (Apartments Grid)
- Danh sách các căn hộ trống được hiển thị dưới dạng dạng lưới Card (Grid) responsive (1 cột trên mobile, 2 cột trên tablet, 3 cột trên PC).
- Sử dụng hiệu ứng animation mượt mà (Fade-in và trượt lên) bằng thư viện `framer-motion` cho từng thẻ căn hộ.

## 4. Chi tiết hiển thị trên mỗi Thẻ Căn hộ (Apartment Card)
Mỗi căn hộ sẽ cung cấp cho người xem các thông tin quan trọng nhất để ra quyết định:
- **Hình ảnh minh họa:** Hiển thị ảnh đầu tiên của căn hộ (nếu có), hoặc dùng ảnh mặc định (Placeholder) nếu căn hộ chưa có ảnh. 
- **Nhãn trạng thái:** Góc phải ảnh có nhãn "Sẵn sàng bàn giao" (màu xanh).
- **Thông tin định danh:** Số phòng (VD: Căn hộ 101), Tên Block, Tầng.
- **Giá thuê:** Hiển thị giá thuê mỗi tháng, định dạng phân cách hàng nghìn (VD: 5,000,000đ / tháng) nổi bật.
- **Thông số kỹ thuật:**
  - Diện tích (m²).
  - Số lượng Phòng ngủ (PN).
  - Số lượng Phòng tắm (WC).
- **Mô tả chi tiết:** Mô tả ngắn gọn về căn hộ (nếu trống sẽ dùng mô tả mặc định về thiết kế hiện đại, tiện ích cao cấp).

## 5. Tương tác Đặt lịch xem nhà (Call-to-Action)
- Dưới cùng của mỗi thẻ có nút bấm **"Đặt lịch xem phòng"** (Biểu tượng điện thoại).
- **Trạng thái hiện tại:** Nút bấm này đang được thiết lập để hiển thị một `alert()` thông báo yêu cầu người dùng gọi điện trực tiếp đến Hotline (0123.456.789) của Ban quản lý, chưa có form nhập liệu trực tuyến để tự động tạo lịch hẹn trên hệ thống.

---

### Đề xuất Cải tiến (Nâng cấp tương lai)
1. **Tính năng Lọc & Tìm kiếm:** Cho phép khách lọc theo Mức giá, Số phòng ngủ, hoặc Block.
2. **Form Đặt lịch tự động:** Thay thế `alert()` bằng một Modal Form để khách điền tên, SĐT và chọn ngày/giờ muốn xem. Dữ liệu này sẽ đổ về Dashboard của Manager để liên hệ lại.
3. **Chi tiết căn hộ (Detail Page):** Bấm vào thẻ để chuyển sang trang xem ảnh 360, thư viện ảnh (gallery), chi tiết nội thất đi kèm.
