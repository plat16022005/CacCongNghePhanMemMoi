import { motion } from 'motion/react'
import Navbar from '../../components/Navbar'

export default function Features() {
  return (
    <div className="w-full min-h-screen bg-[#f0f4f8] flex flex-col items-center">
      <div className="w-full max-w-[1536px] bg-white md:m-5 md:rounded-[3rem] overflow-hidden flex flex-col flex-1 shadow-sm relative">
        <Navbar />
        
        <div className="flex-1 flex flex-col items-center py-20 px-6 max-w-6xl mx-auto text-center z-10">
          <motion.h1 
            className="text-4xl md:text-5xl font-normal text-[#3a4a6b] mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Quản lý Cư dân Thông minh
          </motion.h1>
          
          <motion.p 
            className="text-lg text-[#3a4a6b]/80 leading-relaxed max-w-2xl mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Nền tảng của chúng tôi cung cấp quyền kiểm soát tối đa cho cư dân với mọi hoạt động trong chung cư chỉ qua một cú nhấp chuột.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full text-left">
            <div className="bg-[#f8fafd] p-8 rounded-[2rem] border border-[#e1e8f0]">
              <h3 className="text-2xl font-medium text-[#3a4a6b] mb-3">Đăng ký khách tới thăm & Xe cộ</h3>
              <p className="text-[#3a4a6b]/70 mb-4">Cư dân có thể báo trước thông tin khách và xe cộ. Bảo vệ sẽ nhận được danh sách real-time, giảm tải thủ tục tại sảnh.</p>
              <ul className="list-disc pl-5 text-[#3a4a6b]/60 space-y-2">
                <li>Check-in tự động</li>
                <li>Lịch sử ra vào rõ ràng</li>
              </ul>
            </div>
            
            <div className="bg-[#f8fafd] p-8 rounded-[2rem] border border-[#e1e8f0]">
              <h3 className="text-2xl font-medium text-[#3a4a6b] mb-3">Báo cáo Sự cố & Góp ý</h3>
              <p className="text-[#3a4a6b]/70 mb-4">Mọi vấn đề từ rỉ nước, cháy bóng đèn cho đến các góp ý dịch vụ đều được gửi thẳng đến kỹ thuật viên và ban quản lý.</p>
              <ul className="list-disc pl-5 text-[#3a4a6b]/60 space-y-2">
                <li>Theo dõi tiến độ xử lý trực tiếp</li>
                <li>Đánh giá chất lượng sau khi hoàn thành</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
