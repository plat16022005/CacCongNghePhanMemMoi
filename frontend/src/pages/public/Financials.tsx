import { motion } from 'motion/react'
import Navbar from '../../components/Navbar'

export default function Financials() {
  return (
    <div className="w-full min-h-screen bg-[#f0f4f8] flex flex-col items-center">
      <div className="w-full max-w-[1536px] bg-white md:m-5 md:rounded-[3rem] overflow-hidden flex flex-col flex-1 shadow-sm relative">
        <Navbar />
        
        <div className="flex-1 flex flex-col items-center py-20 px-6 max-w-5xl mx-auto text-center z-10">
          <motion.h1 
            className="text-4xl md:text-5xl font-normal text-[#3a4a6b] mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Tài chính Rõ ràng & Minh bạch
          </motion.h1>
          
          <motion.p 
            className="text-lg text-[#3a4a6b]/80 leading-relaxed max-w-2xl mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            ApartmentHub tự động hóa toàn bộ quy trình gửi hóa đơn, nhắc nợ và đối soát tài chính hàng tháng. Không còn sai sót thủ công, không còn hóa đơn giấy thất lạc.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full text-left">
            <div className="bg-[#f8fafd] p-8 rounded-[2rem] border border-[#e1e8f0]">
              <h3 className="text-2xl font-medium text-[#3a4a6b] mb-3">Thông báo hóa đơn tức thì</h3>
              <p className="text-[#3a4a6b]/70 mb-4">Ngày 1 hàng tháng, toàn bộ cư dân nhận được thông báo chi tiết hóa đơn: Điện, Nước, Phí quản lý, Phí gửi xe ngay trên ứng dụng di động hoặc web.</p>
            </div>
            
            <div className="bg-[#f8fafd] p-8 rounded-[2rem] border border-[#e1e8f0]">
              <h3 className="text-2xl font-medium text-[#3a4a6b] mb-3">Lịch sử thanh toán</h3>
              <p className="text-[#3a4a6b]/70 mb-4">Lưu lại toàn bộ lịch sử biên lai, số tiền đã đóng, công nợ dư. Cư dân có thể xem lại bất kỳ lúc nào để dễ dàng đối chiếu.</p>
            </div>

            <div className="bg-[#f8fafd] p-8 rounded-[2rem] border border-[#e1e8f0]">
              <h3 className="text-2xl font-medium text-[#3a4a6b] mb-3">Nhắc nợ tự động</h3>
              <p className="text-[#3a4a6b]/70 mb-4">Hệ thống sẽ gửi thông báo tự động (Notification) để nhắc nhở những căn hộ sắp tới hạn hoặc quá hạn thanh toán, giúp tránh phí phạt muộn.</p>
            </div>

            <div className="bg-[#f8fafd] p-8 rounded-[2rem] border border-[#e1e8f0]">
              <h3 className="text-2xl font-medium text-[#3a4a6b] mb-3">Báo cáo đa chiều cho Ban Quản lý</h3>
              <p className="text-[#3a4a6b]/70 mb-4">Biểu đồ tổng quan doanh thu, thống kê các khoản thu chưa đóng, hỗ trợ kế toán đối soát dễ dàng và minh bạch mọi sổ sách.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
