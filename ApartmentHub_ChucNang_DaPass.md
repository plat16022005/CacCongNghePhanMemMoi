# TỔNG HỢP CHỨC NĂNG ĐÃ PASS TEST CASE - DỰ ÁN APARTMENTHUB

> Tài liệu này tổng hợp các **chức năng đã được kiểm thử và Pass** trong quá trình testing, dùng làm đầu vào để đối chiếu, rà soát và hoàn thiện code cho các chức năng tương ứng.

- Tổng số test case: **75**
- Số test case **Pass**: **61**
- Số test case **Fail** (chưa đạt, không liệt kê trong tài liệu này): **14**

## Tổng quan theo module

| Module | Chức năng | Người phụ trách | Số TC Pass / Tổng |
|---|---|---|---|
| UC01 | Đăng ký & Quản lý Khách thăm (Visitor Registration) | Tài | 9/13 |
| UC02 | Đăng ký & Quản lý Xe (Vehicle Registration) | Tài | 9/13 |
| UC03 | Quản lý Hóa đơn & Thanh toán (Billing & Payment) | Lưu | 11/13 |
| UC04 | Báo cáo & Xử lý Sự cố (Incident Reporting) | Lưu | 10/12 |
| UC05 | Quản lý Cư dân (Resident Management) | Tuấn | 12/12 |
| UC06 | Đặt & Quản lý Tiện ích (Amenity Booking) | Tuấn | 10/12 |

---

## UC01 - Đăng ký & Quản lý Khách thăm (Visitor Registration) (Tài)

**9/13 test case đã Pass — các chức năng/luồng nghiệp vụ sau đã được xác nhận hoạt động đúng theo test case, cần rà soát code để đảm bảo khớp:**

| Test Case ID | Kỹ thuật | Mô tả | Kịch bản kiểm tra (Scenario) |
|---|---|---|---|
| UC01_ECP_Tai_01 | Equivalence Class Partitioning | Tên khách hợp lệ/không hợp lệ | Kiểm tra validation trường Họ tên khi đăng ký khách thăm |
| UC01_BVA_Tai_03 | Boundary Value Analysis | Biên số lượng khách (Max) | Kiểm tra giới hạn số lượng khách đăng ký trong một lần |
| UC01_DT_Tai_05 | Decision Table | Thiếu trường bắt buộc (CCCD) | Kiểm tra hệ thống block khi thiếu trường CCCD bắt buộc |
| UC01_DT_Tai_06 | Decision Table | Quyền duyệt tự động/Thủ công | Kiểm tra luồng duyệt tự động/thủ công theo loại khách |
| UC01_ST_Tai_09 | State Transition | Hủy khi chờ duyệt | Kiểm tra hủy đăng ký khách khi đang ở trạng thái chờ duyệt |
| UC01_ST_Tai_10 | State Transition | Hủy khi đã duyệt | Kiểm tra không thể hủy khách đã được duyệt |
| UC01_DA_Tai_11 | Domain Analysis | Ngày hôm nay + Giờ quá khứ | Kiểm tra hệ thống từ chối khi chọn giờ đến trong quá khứ của ngày hôm nay |
| UC01_DA_Tai_12 | Domain Analysis | Đăng ký trùng lặp cùng 1 người cùng 1 giờ | Kiểm tra hệ thống báo lỗi khi đăng ký trùng khách trong cùng khung giờ |
| UC01_UC_Tai_14 | Use Case / E2E | Luồng Khách Check-in | Kiểm tra luồng Bảo vệ check-in khách đã được duyệt |

## UC02 - Đăng ký & Quản lý Xe (Vehicle Registration) (Tài)

**9/13 test case đã Pass — các chức năng/luồng nghiệp vụ sau đã được xác nhận hoạt động đúng theo test case, cần rà soát code để đảm bảo khớp:**

| Test Case ID | Kỹ thuật | Mô tả | Kịch bản kiểm tra (Scenario) |
|---|---|---|---|
| UC02_ECP_Tai_01 | Equivalence Class Partitioning | Loại xe hợp lệ (Xe máy/Ô tô/Xe đạp) | Kiểm tra đăng ký xe với loại xe hợp lệ |
| UC02_BVA_Tai_03 | Boundary Value Analysis | Biên số lượng xe (Chiếc thứ 3 vượt giới hạn) | Kiểm tra giới hạn tối đa số lượng xe đăng ký |
| UC02_DT_Tai_05 | Decision Table | Thiếu Hãng xe | Kiểm tra validation khi bỏ trống trường Hãng xe |
| UC02_DT_Tai_06 | Decision Table | Thay đổi màu xe (Đen → Đỏ) | Kiểm tra chức năng chỉnh sửa thông tin màu xe |
| UC02_PW_Tai_07 | Pairwise | Loại xe + Thương hiệu (Ô tô + Toyota) | Kiểm tra tổ hợp Loại xe Ô tô và Thương hiệu Toyota |
| UC02_ST_Tai_09 | State Transition | Hủy yêu cầu xe đang Chờ duyệt | Kiểm tra hủy yêu cầu đăng ký xe khi đang chờ duyệt |
| UC02_DA_Tai_11 | Domain Analysis | Trùng biển số | Kiểm tra hệ thống báo lỗi khi nhập biển số trùng |
| UC02_UC_Tai_13 | Use Case / E2E | Luồng Gửi xe E2E (Đăng ký → Duyệt → Tính tiền) | Kiểm tra luồng E2E từ đăng ký xe đến tính phí tháng |
| UC02_UC_Tai_14 | Use Case / E2E | Thu hồi thẻ xe | Kiểm tra luồng thu hồi thẻ xe và ngưng tính phí |

## UC03 - Quản lý Hóa đơn & Thanh toán (Billing & Payment) (Lưu)

**11/13 test case đã Pass — các chức năng/luồng nghiệp vụ sau đã được xác nhận hoạt động đúng theo test case, cần rà soát code để đảm bảo khớp:**

| Test Case ID | Kỹ thuật | Mô tả | Kịch bản kiểm tra (Scenario) |
|---|---|---|---|
| UC03_ECP_Luu_01 | Equivalence Class Partitioning | Định dạng số tiền hợp lệ | Kiểm tra nhập và hiển thị số tiền hợp lệ trong hóa đơn |
| UC03_ECP_Luu_02 | Equivalence Class Partitioning | Số tiền âm không hợp lệ | Kiểm tra hệ thống từ chối số tiền âm trong hóa đơn |
| UC03_BVA_Luu_03 | Boundary Value Analysis | Khối lượng hóa đơn lớn (5000 căn) | Kiểm tra hệ thống xử lý phát hành hóa đơn hàng loạt không bị treo |
| UC03_DT_Luu_05 | Decision Table | Tính phí trễ hạn (Quá hạn 1 ngày) | Kiểm tra hệ thống tự động cộng phí phạt trễ hạn |
| UC03_DT_Luu_06 | Decision Table | Giảm trừ Voucher | Kiểm tra chức năng áp dụng voucher giảm giá trong hóa đơn |
| UC03_PW_Luu_07 | Pairwise | Lọc Loại phí + Tháng (Phí QL + Tháng 6) | Kiểm tra chức năng lọc hóa đơn theo Loại phí và Tháng |
| UC03_PW_Luu_08 | Pairwise | Lọc Phương thức TT (Chuyển khoản + Đã TT) | Kiểm tra lọc hóa đơn theo phương thức thanh toán và trạng thái |
| UC03_ST_Luu_09 | State Transition | Thanh toán Bill (Unpaid → Paid) | Kiểm tra chuyển trạng thái hóa đơn từ Unpaid sang Paid |
| UC03_ST_Luu_10 | State Transition | Hoàn tiền Bill (Paid → Hoàn) | Kiểm tra chức năng hoàn tiền hóa đơn đã thu |
| UC03_UC_Luu_13 | Use Case / E2E | Luồng E2E Thanh toán (Tạo → Thu → Xác nhận) | Kiểm tra luồng E2E hoàn chỉnh thanh toán hóa đơn |
| UC03_UC_Luu_14 | Use Case / E2E | Cắt điện nước do nợ (Nợ quá 3 tháng) | Kiểm tra tự động đưa vào Blacklist cư dân nợ quá 3 tháng |

## UC04 - Báo cáo & Xử lý Sự cố (Incident Reporting) (Lưu)

**10/12 test case đã Pass — các chức năng/luồng nghiệp vụ sau đã được xác nhận hoạt động đúng theo test case, cần rà soát code để đảm bảo khớp:**

| Test Case ID | Kỹ thuật | Mô tả | Kịch bản kiểm tra (Scenario) |
|---|---|---|---|
| UC04_ECP_Luu_02 | Equivalence Class Partitioning | Nội dung rỗng (Chỉ khoảng trắng) | Kiểm tra validation từ chối tiêu đề chỉ có khoảng trắng |
| UC04_BVA_Luu_03 | Boundary Value Analysis | Độ dài mô tả tối đa (5000 ký tự) | Kiểm tra UI không bị vỡ khi nhập mô tả rất dài |
| UC04_BVA_Luu_04 | Boundary Value Analysis | Ảnh đính kèm lớn (>10MB) | Kiểm tra hệ thống từ chối file ảnh vượt quá giới hạn |
| UC04_DT_Luu_05 | Decision Table | Báo sự cố Loại Điện | Kiểm tra gửi báo cáo sự cố điện thành công |
| UC04_PW_Luu_07 | Pairwise | Mức Khẩn cấp + Khu vực Tầng hầm | Kiểm tra sự cố khẩn cấp được hiển thị ưu tiên màu đỏ |
| UC04_PW_Luu_08 | Pairwise | Mức Bình thường + Khu vực Hành lang | Kiểm tra sự cố bình thường hiển thị màu xanh lục |
| UC04_ST_Luu_09 | State Transition | Chuyển trạng thái sự cố sang Đang xử lý | Kiểm tra Kỹ thuật viên tiếp nhận sự cố |
| UC04_DA_Luu_11 | Domain Analysis | Giao việc cho thợ đang bận | Kiểm tra cảnh báo khi giao việc cho nhân viên quá tải |
| UC04_DA_Luu_12 | Domain Analysis | Nghiệm thu lại (Cư dân chưa đồng ý) | Kiểm tra Cư dân có thể yêu cầu mở lại sự cố khi chưa hài lòng |
| UC04_UC_Luu_13 | Use Case / E2E | Đánh giá sao sau khi sự cố hoàn thành | Kiểm tra Cư dân đánh giá sao cho kỹ thuật viên sau khi sự cố xong |

## UC05 - Quản lý Cư dân (Resident Management) (Tuấn)

**12/12 test case đã Pass — các chức năng/luồng nghiệp vụ sau đã được xác nhận hoạt động đúng theo test case, cần rà soát code để đảm bảo khớp:**

| Test Case ID | Kỹ thuật | Mô tả | Kịch bản kiểm tra (Scenario) |
|---|---|---|---|
| UC05_ECP_Tuan_01 | Equivalence Class Partitioning | Email hợp lệ (test@gmail.com) | Kiểm tra validation email hợp lệ khi thêm cư dân |
| UC05_ECP_Tuan_02 | Equivalence Class Partitioning | Email sai định dạng (test.com) | Kiểm tra hệ thống từ chối email sai định dạng |
| UC05_BVA_Tuan_03 | Boundary Value Analysis | Giới hạn số người/phòng (Thêm người thứ 11) | Kiểm tra hệ thống từ chối khi thêm cư dân vượt giới hạn nhân khẩu |
| UC05_BVA_Tuan_04 | Boundary Value Analysis | Phân loại cư dân theo tuổi (Người già 80 tuổi) | Kiểm tra hệ thống phân loại đúng cư dân theo nhóm tuổi |
| UC05_DT_Tuan_05 | Decision Table | Quyền chủ hộ (Chủ hộ vs Thành viên) | Kiểm tra cấp quyền chủ hộ và xem hóa đơn |
| UC05_DT_Tuan_06 | Decision Table | Quên mật khẩu - Reset Password | Kiểm tra chức năng gửi link reset mật khẩu qua email |
| UC05_PW_Tuan_07 | Pairwise | Mối quan hệ + Giới tính (Vợ + Nữ) | Kiểm tra tổ hợp Mối quan hệ Vợ và Giới tính Nữ |
| UC05_ST_Tuan_10 | State Transition | Xóa cư dân khỏi hệ thống | Kiểm tra xóa cư dân và thu hồi quyền đăng nhập |
| UC05_DA_Tuan_11 | Domain Analysis | Debounce Search - Tìm kiếm nhanh | Kiểm tra tính năng debounce trong ô tìm kiếm cư dân |
| UC05_DA_Tuan_12 | Domain Analysis | Trùng Email khi tạo tài khoản mới | Kiểm tra hệ thống từ chối tạo tài khoản với email đã có |
| UC05_UC_Tuan_13 | Use Case / E2E | Luồng Onboarding cư dân mới | Kiểm tra luồng onboarding cư dân mới từ đầu đến khi đăng nhập |
| UC05_UC_Tuan_14 | Use Case / E2E | Gán cư dân vào Phòng B1-12 | Kiểm tra chức năng gán cư dân vào phòng |

## UC06 - Đặt & Quản lý Tiện ích (Amenity Booking) (Tuấn)

**10/12 test case đã Pass — các chức năng/luồng nghiệp vụ sau đã được xác nhận hoạt động đúng theo test case, cần rà soát code để đảm bảo khớp:**

| Test Case ID | Kỹ thuật | Mô tả | Kịch bản kiểm tra (Scenario) |
|---|---|---|---|
| UC06_ECP_Tuan_01 | Equivalence Class Partitioning | Giá tiền ngày thường (Thứ 2) | Kiểm tra hiển thị giá ngày thường khi đặt tiện ích vào ngày thường |
| UC06_BVA_Tuan_03 | Boundary Value Analysis | Biên giờ mở cửa (Đặt 05:00, mở 06:00) | Kiểm tra hệ thống từ chối đặt lịch trước giờ mở cửa |
| UC06_BVA_Tuan_04 | Boundary Value Analysis | Thời gian đặt tối đa (Đặt quá 4 tiếng: 08:00-14:00) | Kiểm tra hệ thống từ chối khi đặt tiện ích quá số giờ cho phép |
| UC06_DT_Tuan_05 | Decision Table | Trùng Slot BBQ (Bếp đã có người đặt) | Kiểm tra hệ thống từ chối đặt trùng slot tiện ích |
| UC06_DT_Tuan_06 | Decision Table | Hủy lịch đã đặt | Kiểm tra chức năng hủy lịch đặt tiện ích |
| UC06_PW_Tuan_07 | Pairwise | Tiện ích Hồ bơi + Số người 5 | Kiểm tra tính tổng tiền theo số lượng người đặt Hồ bơi |
| UC06_ST_Tuan_09 | State Transition | Hủy sát giờ (Trước 1 tiếng, không hoàn tiền) | Kiểm tra hủy lịch sát giờ không được hoàn tiền |
| UC06_DA_Tuan_11 | Domain Analysis | Giới hạn sức chứa Hồ bơi (50/50) | Kiểm tra hệ thống từ chối khi tiện ích đã đầy |
| UC06_DA_Tuan_12 | Domain Analysis | Xung đột giờ (Đặt 18-20 trong khi có 17-19) | Kiểm tra hệ thống phát hiện xung đột giờ khi đặt lịch giao thoa |
| UC06_UC_Tuan_13 | Use Case / E2E | E2E Đặt BBQ (Cư dân → Quản lý → Kế toán) | Kiểm tra luồng E2E đặt BBQ từ cư dân đến trừ tiền |

---

## Ghi chú cho Agent Code

- Các chức năng/luồng liệt kê ở trên đã **Pass** ở bước kiểm thử (test case), tức là **kết quả thực tế khớp với kết quả mong đợi** tại thời điểm test.
- Mục tiêu: rà soát lại code hiện tại của từng module, đối chiếu với cột **Kịch bản kiểm tra (Scenario)** để xác nhận:
  1. Logic nghiệp vụ đã được implement đầy đủ và đúng như mô tả.
  2. Không có regression làm hỏng lại các case đã Pass khi chỉnh sửa các phần liên quan.
  3. Các luồng E2E (kỹ thuật Use Case) cần được ưu tiên kiểm tra kỹ vì liên quan nhiều module/role.
- Các test case **Fail** (không liệt kê trong file này) là các chức năng còn lỗi, cần xử lý riêng theo báo cáo bug (Bug Report), không thuộc phạm vi rà soát của tài liệu này.
