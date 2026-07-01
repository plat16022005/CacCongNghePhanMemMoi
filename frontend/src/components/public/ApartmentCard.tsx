import { motion } from 'motion/react';
import { Home, Bath, Bed, Maximize, MapPin, PhoneCall, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Apartment } from '../../hooks/useApartments';
import { useWishlist } from '../../hooks/useWishlist';

interface ApartmentCardProps {
  apartment: Apartment;
  index: number;
  onBookViewing?: (apartmentId: string) => void;
}

export default function ApartmentCard({ apartment, index, onBookViewing }: ApartmentCardProps) {
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(apartment._id);

  const handleCardClick = () => {
    navigate(`/rentals/${apartment._id}`);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(apartment._id);
  };

  const handleBookClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBookViewing) {
      onBookViewing(apartment._id);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={handleCardClick}
      className="bg-white rounded-[2rem] border border-[#e1e8f0] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col cursor-pointer group"
    >
      <div className="h-48 bg-slate-100 relative overflow-hidden">
        <img 
          src={apartment.images?.length > 0 ? apartment.images[0] : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
          alt={`Phòng ${apartment.roomNumber}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10 shadow-sm">
          Sẵn sàng bàn giao
        </div>
        <button 
          onClick={handleWishlistClick}
          className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-red-500 transition-colors z-10 shadow-sm"
        >
          <Heart className={`w-5 h-5 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-[#3a4a6b] mb-1 group-hover:text-blue-600 transition-colors">Căn hộ {apartment.roomNumber}</h3>
            <p className="text-sm text-[#3a4a6b]/60 flex items-center gap-1">
              <MapPin className="w-4 h-4" /> Block {apartment.block} • Tầng {apartment.floor}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-[#e65c00]">{apartment.rentalPrice?.toLocaleString()}đ</p>
            <p className="text-xs text-[#3a4a6b]/50 uppercase tracking-wide">/ tháng</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6 border-y border-slate-100 py-4">
          <div className="flex flex-col items-center text-center">
            <Maximize className="w-5 h-5 text-[#3a4a6b]/60 mb-1" />
            <span className="text-sm font-medium text-[#3a4a6b]">{apartment.area} m²</span>
          </div>
          <div className="flex flex-col items-center text-center border-x border-slate-100">
            <Bed className="w-5 h-5 text-[#3a4a6b]/60 mb-1" />
            <span className="text-sm font-medium text-[#3a4a6b]">{apartment.bedroomCount} PN</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Bath className="w-5 h-5 text-[#3a4a6b]/60 mb-1" />
            <span className="text-sm font-medium text-[#3a4a6b]">{apartment.bathroomCount} WC</span>
          </div>
        </div>

        <p className="text-sm text-[#3a4a6b]/80 mb-6 line-clamp-2 flex-1">
          {apartment.description || 'Căn hộ thiết kế hiện đại, ngập tràn ánh sáng tự nhiên. Tận hưởng toàn bộ tiện ích nội khu cao cấp tại ApartmentHub.'}
        </p>

        <button 
          onClick={handleBookClick}
          className="w-full py-3 bg-[#3a4a6b] text-white rounded-xl font-medium flex justify-center items-center gap-2 hover:bg-[#2a3651] transition"
        >
          <PhoneCall className="w-5 h-5" /> Đặt lịch xem phòng
        </button>
      </div>
    </motion.div>
  );
}
