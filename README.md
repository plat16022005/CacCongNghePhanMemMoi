# ApartmentHub - Hệ Thống Quản Lý Chung Cư Cao Cấp

ApartmentHub là một hệ thống quản lý chung cư toàn diện (MERN Stack) giúp ban quản lý và cư dân tương tác dễ dàng, minh bạch và hiệu quả. Hệ thống được thiết kế với giao diện Luxury Minimalist (tối giản, sang trọng) mang lại trải nghiệm người dùng hiện đại và chuyên nghiệp.

## 🌟 Các chức năng chính

Hệ thống cung cấp trải nghiệm chuyên biệt cho nhiều vai trò khác nhau:

- **Quản lý (Manager):** 
  - Xem Dashboard thống kê doanh thu, số lượng phòng trống.
  - Duyệt yêu cầu thẻ xe, yêu cầu khách đến thăm, lịch đặt tiện ích.
  - Quản lý danh sách cư dân, danh sách căn hộ.
- **Cư dân (Resident):**
  - Xem và thanh toán hóa đơn hàng tháng.
  - Đăng ký thẻ xe, đăng ký khách viếng thăm.
  - Báo cáo sửa chữa, khiếu nại, phản hồi.
  - Đặt lịch sử dụng tiện ích (gym, bơi, BBQ, sân tennis...).
- **Khách vãng lai (Public):**
  - Xem danh sách các căn hộ đang trống để cho thuê/bán.
  - Tìm kiếm, lọc và xem chi tiết căn hộ.
  - Đặt lịch hẹn xem phòng với ban quản lý.
- **Kế toán, Kỹ thuật, Bảo vệ:**
  - Hỗ trợ các quy trình chuyên sâu như bảo trì, an ninh tòa nhà và báo cáo tài chính.

## 🛠 Công nghệ sử dụng

- **Frontend:** React, TypeScript, Vite, TailwindCSS, Recharts, Lucide Icons.
- **Backend:** Node.js, Express.js, Babel (ES6+).
- **Database:** MongoDB (Mongoose).
- **Bảo mật:** JWT (Access Token & Refresh Token) lưu trong HttpOnly Cookies, bcryptjs.
- **Tiện ích:** Multer & Cloudinary (Upload ảnh), Nodemailer (Gửi Email).

## 🚀 Hướng dẫn chạy dự án (Local)

Dự án này bao gồm cả Backend và Frontend chạy song song.

### 1. Cài đặt biến môi trường
Tạo file `.env` ở thư mục gốc và cấu hình các biến sau:
```env
PORT=6969
MONGODB_URI=mongodb://127.0.0.1:27017/apartment_hub
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

### 2. Cài đặt thư viện
**Backend:**
```bash
npm install
```
**Frontend:**
```bash
cd frontend
npm install
cd ..
```

### 3. Khởi động hệ thống
Bạn cần 2 cửa sổ Terminal để chạy Backend và Frontend.

**Terminal 1 (Backend):**
```bash
npm start
```
*Backend sẽ chạy tại http://localhost:6969*

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
*Vite sẽ khởi chạy Frontend tại http://localhost:5173 và tự động proxy API sang Backend.*

## 📋 Tài khoản Demo

Hệ thống đã được nạp dữ liệu mẫu để bạn có thể test mọi chức năng. 
**Mật khẩu chung cho tất cả tài khoản:** `123456`

- **Manager:** `manager@abc.com`
- **Resident:** `resident@abc.com`
- **Accountant:** `accountant@abc.com`
- **Admin:** `admin@abc.com`
- **Maintenance:** `maintenance@abc.com`
