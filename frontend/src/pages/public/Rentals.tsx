import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Home, Bath, Bed, Maximize, MapPin, PhoneCall } from 'lucide-react'
import Navbar from '../../components/Navbar'

export default function Rentals() {
  const [apartments, setApartments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/public/apartments')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setApartments(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="w-full min-h-screen bg-[#f0f4f8] flex flex-col items-center">
      <div className="w-full max-w-[1536px] bg-white md:m-5 md:rounded-[3rem] overflow-hidden flex flex-col flex-1 shadow-sm relative">
        <Navbar />
        
        <div className="flex-1 flex flex-col py-20 px-6 max-w-6xl mx-auto w-full z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-normal text-[#3a4a6b] mb-6 tracking-tight">
              Căn Hộ Đang Cho Thuê
            </h1>
            <p className="text-lg text-[#3a4a6b]/80 max-w-2xl mx-auto">
              Trở thành cư dân của ApartmentHub ngay hôm nay. Khám phá các căn hộ đang trống với đầy đủ tiện nghi cao cấp.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a4a6b]"></div>
            </div>
          ) : apartments.length === 0 ? (
            <div className="text-center py-20 bg-[#f8fafd] rounded-[2rem] border border-[#e1e8f0]">
              <Home className="w-16 h-16 text-[#3a4a6b]/30 mx-auto mb-4" />
              <h3 className="text-2xl font-medium text-[#3a4a6b] mb-2">Hiện chưa có căn hộ trống</h3>
              <p className="text-[#3a4a6b]/70">Vui lòng quay lại sau hoặc liên hệ ban quản lý để được hỗ trợ.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {apartments.map((apt, idx) => (
                <motion.div 
                  key={apt._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white rounded-[2rem] border border-[#e1e8f0] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="h-48 bg-slate-100 relative">
                    {/* Placeholder for Room Image. If apt.images exists, use it. */}
                    <img 
                      src={apt.images?.length > 0 ? apt.images[0] : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                      alt={`Phòng ${apt.roomNumber}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Sẵn sàng bàn giao
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-[#3a4a6b] mb-1">Căn hộ {apt.roomNumber}</h3>
                        <p className="text-sm text-[#3a4a6b]/60 flex items-center gap-1">
                          <MapPin className="w-4 h-4" /> Block {apt.block} • Tầng {apt.floor}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-[#e65c00]">{apt.rentalPrice?.toLocaleString()}đ</p>
                        <p className="text-xs text-[#3a4a6b]/50 uppercase tracking-wide">/ tháng</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6 border-y border-slate-100 py-4">
                      <div className="flex flex-col items-center text-center">
                        <Maximize className="w-5 h-5 text-[#3a4a6b]/60 mb-1" />
                        <span className="text-sm font-medium text-[#3a4a6b]">{apt.area} m²</span>
                      </div>
                      <div className="flex flex-col items-center text-center border-x border-slate-100">
                        <Bed className="w-5 h-5 text-[#3a4a6b]/60 mb-1" />
                        <span className="text-sm font-medium text-[#3a4a6b]">{apt.bedroomCount} PN</span>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <Bath className="w-5 h-5 text-[#3a4a6b]/60 mb-1" />
                        <span className="text-sm font-medium text-[#3a4a6b]">{apt.bathroomCount} WC</span>
                      </div>
                    </div>

                    <p className="text-sm text-[#3a4a6b]/80 mb-6 line-clamp-2 flex-1">
                      {apt.description || 'Căn hộ thiết kế hiện đại, ngập tràn ánh sáng tự nhiên. Tận hưởng toàn bộ tiện ích nội khu cao cấp tại ApartmentHub.'}
                    </p>

                    <button 
                      onClick={() => alert('Vui lòng liên hệ Hotline: 0123.456.789 để đặt lịch xem phòng trực tiếp.')}
                      className="w-full py-3 bg-[#3a4a6b] text-white rounded-xl font-medium flex justify-center items-center gap-2 hover:bg-[#2a3651] transition"
                    >
                      <PhoneCall className="w-5 h-5" /> Đặt lịch xem phòng
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
