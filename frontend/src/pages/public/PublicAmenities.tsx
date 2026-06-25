import { motion } from 'motion/react'
import Navbar from '../../components/Navbar'

export default function PublicAmenities() {
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
            Hệ thống Tiện ích Cao cấp
          </motion.h1>
          
          <motion.p 
            className="text-lg text-[#3a4a6b]/80 leading-relaxed max-w-2xl mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Cư dân có thể dễ dàng xem và đặt chỗ các tiện ích nội khu trực tuyến ngay trên ứng dụng, hoàn toàn miễn phí hoặc phí siêu ưu đãi.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
            <div className="bg-[#f0f4f8] rounded-[2rem] overflow-hidden">
              <div className="h-40 bg-[url('https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center"></div>
              <div className="p-6">
                <h3 className="text-xl font-medium text-[#3a4a6b] mb-2">Hồ bơi vô cực</h3>
                <p className="text-sm text-[#3a4a6b]/70">Tầng thượng Block A. View toàn cảnh thành phố cực chill. Miễn phí cho cư dân.</p>
              </div>
            </div>

            <div className="bg-[#f0f4f8] rounded-[2rem] overflow-hidden">
              <div className="h-40 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center"></div>
              <div className="p-6">
                <h3 className="text-xl font-medium text-[#3a4a6b] mb-2">Phòng Gym Hiện đại</h3>
                <p className="text-sm text-[#3a4a6b]/70">Trang thiết bị chuẩn quốc tế, máy chạy bộ, khu tạ tự do. Mở cửa từ 5h sáng đến 11h đêm.</p>
              </div>
            </div>

            <div className="bg-[#f0f4f8] rounded-[2rem] overflow-hidden">
              <div className="h-40 bg-[url('https://images.unsplash.com/photo-1519337265831-281ec6cc8514?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center"></div>
              <div className="p-6">
                <h3 className="text-xl font-medium text-[#3a4a6b] mb-2">Khu BBQ Ngoài trời</h3>
                <p className="text-sm text-[#3a4a6b]/70">Không gian xanh mát, lý tưởng cho gia đình tụ tập cuối tuần. Vui lòng đặt lịch trước.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
