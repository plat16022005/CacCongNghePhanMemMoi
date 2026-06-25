import { motion } from 'motion/react'
import Navbar from '../../components/Navbar'

export default function About() {
  return (
    <div className="w-full min-h-screen bg-[#f0f4f8] flex flex-col items-center">
      <div className="w-full max-w-[1536px] bg-white md:m-5 md:rounded-[3rem] overflow-hidden flex flex-col flex-1 shadow-sm relative">
        <Navbar />
        
        <div className="flex-1 flex flex-col items-center py-20 px-6 max-w-5xl mx-auto text-center z-10">
          <motion.h1 
            className="text-4xl md:text-6xl font-normal text-[#3a4a6b] mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Tổng quan về ApartmentHub
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-[#3a4a6b]/80 leading-relaxed max-w-3xl mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Được xây dựng với triết lý <strong>"Lấy trải nghiệm cư dân làm trung tâm"</strong>, 
            ApartmentHub Premium Tower không chỉ là một nơi để ở mà còn là một cộng đồng 
            văn minh, an toàn và cực kỳ minh bạch. Hệ thống quản lý của chúng tôi kết nối ban quản lý và cư dân một cách mượt mà nhất.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left">
            <div className="bg-[#f0f4f8] p-8 rounded-3xl">
              <h3 className="text-2xl font-medium text-[#3a4a6b] mb-4">Vị trí đắc địa</h3>
              <p className="text-[#3a4a6b]/70">Tọa lạc tại trung tâm Quận 7, TP.HCM, kết nối dễ dàng tới các khu vực trọng điểm của thành phố, mang lại sự thuận tiện tuyệt đối cho cư dân.</p>
            </div>
            <div className="bg-[#f0f4f8] p-8 rounded-3xl">
              <h3 className="text-2xl font-medium text-[#3a4a6b] mb-4">Môi trường sống xanh</h3>
              <p className="text-[#3a4a6b]/70">Hơn 60% diện tích dự án dành cho cây xanh và các tiện ích công cộng ngoài trời, tạo ra không gian sống thoáng đãng, trong lành.</p>
            </div>
            <div className="bg-[#f0f4f8] p-8 rounded-3xl">
              <h3 className="text-2xl font-medium text-[#3a4a6b] mb-4">An ninh 24/7</h3>
              <p className="text-[#3a4a6b]/70">Hệ thống camera giám sát và đội ngũ bảo vệ chuyên nghiệp túc trực 24/7. Kiểm soát khách ra vào hoàn toàn thông minh qua mã QR.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
