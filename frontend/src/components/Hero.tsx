import { motion } from 'motion/react'
import Navbar from './Navbar'
import BottomLeftCard from './BottomLeftCard'
import BottomRightCorner from './BottomRightCorner'
import HeroBadge from './HeroBadge'

export default function Hero() {
  return (
    <div className="w-full h-screen flex items-center justify-center p-3 md:p-5 bg-[#f0f4f8]">
      <section className="relative w-full max-w-[1536px] h-full rounded-[1.5rem] md:rounded-[3rem] overflow-hidden flex flex-col items-center bg-white/10 group">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-[65%] lg:object-center z-0"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260428_193507_4286c423-2fd9-4efd-92bd-91a939453fc1.mp4" type="video/mp4" />
        </video>

        <div className="relative z-10 w-full h-full flex flex-col items-center">
          <Navbar />
          
          <div className="w-full flex flex-col items-center pt-8 px-6 text-center max-w-4xl">
            <HeroBadge />
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[80px] font-normal text-[#3a4a6b] mb-2 tracking-tight leading-[1.05]"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Quản lý chung cư thông minh
            </motion.h1>
            <motion.p
              className="text-sm sm:text-base md:text-lg text-[#3a4a6b] opacity-80 leading-relaxed max-w-xl font-normal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Quản lý cư dân, hóa đơn, tiện ích và an ninh — tất cả trên một nền tảng duy nhất.
            </motion.p>

            <motion.div 
              className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center gap-2 bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 text-[#3a4a6b] shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
                <span className="text-sm font-medium">ApartmentHub Premium Tower</span>
              </div>
              <div className="flex items-center gap-2 bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 text-[#3a4a6b] shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span className="text-sm font-medium">123 Tôn Dật Tiên, Quận 7, TP.HCM</span>
              </div>
              <div className="flex items-center gap-2 bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 text-[#3a4a6b] shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                <span className="text-sm font-medium">Quy mô: 2 Block, 20 Tầng, 200 Căn</span>
              </div>
            </motion.div>
          </div>

          <BottomLeftCard />
          <BottomRightCorner />
        </div>
      </section>
    </div>
  )
}
