import { ChevronRight, ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'

import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-6 px-6 md:px-10 w-full relative z-10">
      <div className="flex-1 hidden md:block">
        <Link to="/" className="font-semibold text-xl text-[#3a4a6b] tracking-tight">ApartmentHub</Link>
      </div>

      <ul className="hidden md:flex items-center gap-8 text-[rgb(45,45,45)] font-medium text-sm">
        <Link to="/about" className="cursor-pointer hover:text-[#3a4a6b] hover:opacity-100 opacity-80 transition-all flex items-center gap-1 group">
          Tổng quan
        </Link>
        <Link to="/features" className="cursor-pointer hover:text-[#3a4a6b] hover:opacity-100 opacity-80 transition-all flex items-center gap-1 group">
          Quản lý Cư dân
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link to="/amenities" className="cursor-pointer hover:text-[#3a4a6b] hover:opacity-100 opacity-80 transition-all flex items-center gap-1 group">
          Hệ thống Tiện ích
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link to="/rentals" className="cursor-pointer hover:text-[#e65c00] hover:opacity-100 opacity-90 transition-all flex items-center gap-1 group text-[#e65c00] font-bold">
          Thuê Căn Hộ
        </Link>
        <Link to="/financials" className="cursor-pointer hover:text-[#3a4a6b] hover:opacity-100 opacity-80 transition-all flex items-center gap-1 group">
          Tài chính & Minh bạch
        </Link>
      </ul>

      <div className="md:hidden">
        <span className="font-regular tracking-tighter text-xl text-[rgba(30,50,90,0.9)]">ApartmentHub</span>
      </div>

      <div className="flex-1 flex justify-end">
        <motion.button
          onClick={() => {
            if ((window as any).USER_DATA) {
              window.location.href = '/dashboard';
            } else {
              window.location.href = '/login';
            }
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center bg-[rgba(30,50,90,0.8)] text-white rounded-full pl-2 pr-4 md:pr-6 py-1.5 md:py-2 gap-2 md:gap-3 hover:bg-[rgba(30,50,90,1)] transition-colors group"
        >
          <div className="bg-white/20 p-1 md:p-1.5 rounded-full flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <span className="text-xs md:text-sm font-normal">
            { (window as any).USER_DATA ? "Hồ sơ của tôi" : "Đăng nhập ngay" }
          </span>
        </motion.button>
      </div>
    </nav>
  )
}
