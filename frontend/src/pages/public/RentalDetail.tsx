import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, Bath, Bed, Maximize, MapPin, ArrowLeft, PhoneCall, Check, Heart, ShieldCheck, Zap } from 'lucide-react';
import Navbar from '../../components/Navbar';
import ViewingRequestModal from '../../components/public/ViewingRequestModal';
import ImageGalleryLightbox from '../../components/public/ImageGalleryLightbox';
import SimilarApartments from '../../components/public/SimilarApartments';
import type { Apartment } from '../../hooks/useApartments';
import { useWishlist } from '../../hooks/useWishlist';

export default function RentalDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  
  const { isWishlisted, toggleWishlist } = useWishlist();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/public/apartments/${id}`)
      .then(res => res.json())
      .then(result => {
        if (result.data) {
          setApartment(result.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#f0f4f8] flex flex-col items-center">
        <div className="w-full max-w-[1536px] bg-white md:m-5 md:rounded-[3rem] overflow-hidden flex flex-col flex-1 shadow-sm relative">
          <Navbar />
          <div className="flex-1 flex justify-center items-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="w-full min-h-screen bg-[#f0f4f8] flex flex-col items-center">
        <div className="w-full max-w-[1536px] bg-white md:m-5 md:rounded-[3rem] overflow-hidden flex flex-col flex-1 shadow-sm relative">
          <Navbar />
          <div className="flex-1 flex flex-col justify-center items-center text-center p-6">
            <Home className="w-20 h-20 text-[#3a4a6b]/20 mb-6" />
            <h2 className="text-3xl font-bold text-[#3a4a6b] mb-4">Không tìm thấy căn hộ</h2>
            <button 
              onClick={() => navigate('/rentals')}
              className="px-6 py-3 bg-[#3a4a6b] text-white rounded-xl hover:bg-[#2a3651] transition"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    );
  }

  const images = apartment.images?.length > 0 
    ? apartment.images 
    : ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"];
  
  const wishlisted = isWishlisted(apartment._id);

  return (
    <div className="w-full min-h-screen bg-[#f0f4f8] flex flex-col items-center">
      <div className="w-full max-w-[1536px] bg-white md:m-5 md:rounded-[3rem] overflow-hidden flex flex-col flex-1 shadow-sm relative pb-20">
        <Navbar />

        <div className="max-w-7xl mx-auto w-full px-6 py-8">
          {/* Breadcrumb & Navigation */}
          <button 
            onClick={() => navigate('/rentals')}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-6 font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Header Info */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">Đang trống</span>
                    <span className="text-slate-500 flex items-center gap-1 text-sm"><MapPin className="w-4 h-4" /> Tòa {apartment.block}</span>
                  </div>
                  <h1 className="text-4xl font-bold text-[#3a4a6b] mb-4">Căn hộ {apartment.roomNumber}</h1>
                </div>
                <button 
                  onClick={() => toggleWishlist(apartment._id)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
                  title="Lưu tin"
                >
                  <Heart className={`w-6 h-6 ${wishlisted ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                </button>
              </div>

              {/* Main Image */}
              <div 
                className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden relative group cursor-pointer"
                onClick={() => setIsGalleryOpen(true)}
              >
                <img 
                  src={images[0]} 
                  alt="Main apartment view" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                <div className="absolute bottom-4 right-4 bg-black/60 text-white backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium">
                  Xem tất cả {images.length} ảnh
                </div>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center justify-center text-center border border-slate-100">
                  <Maximize className="w-8 h-8 text-blue-500 mb-2" />
                  <span className="text-slate-500 text-sm mb-1">Diện tích</span>
                  <span className="font-bold text-xl text-slate-800">{apartment.area} m²</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center justify-center text-center border border-slate-100">
                  <Bed className="w-8 h-8 text-blue-500 mb-2" />
                  <span className="text-slate-500 text-sm mb-1">Phòng ngủ</span>
                  <span className="font-bold text-xl text-slate-800">{apartment.bedroomCount}</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center justify-center text-center border border-slate-100">
                  <Bath className="w-8 h-8 text-blue-500 mb-2" />
                  <span className="text-slate-500 text-sm mb-1">Phòng tắm</span>
                  <span className="font-bold text-xl text-slate-800">{apartment.bathroomCount}</span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-2xl font-bold text-[#3a4a6b] mb-6">Thông tin mô tả</h3>
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {apartment.description || 'Căn hộ nằm trong dự án cao cấp ApartmentHub, sở hữu thiết kế thông minh giúp tối ưu hóa không gian sống và đón trọn ánh sáng tự nhiên. Khách thuê sẽ được tận hưởng hệ sinh thái tiện ích nội khu chuẩn 5 sao.'}
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-2xl font-bold text-[#3a4a6b] mb-6">Đặc quyền cư dân</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500"/> Miễn phí sử dụng Hồ bơi</div>
                  <div className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500"/> Khu vực BBQ ngoài trời</div>
                  <div className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500"/> Hệ thống Gym & Yoga</div>
                  <div className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500"/> An ninh đa lớp 24/7</div>
                  <div className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500"/> Khu vui chơi trẻ em</div>
                  <div className="flex items-center gap-3"><Check className="w-5 h-5 text-green-500"/> Quản lý qua Ứng dụng</div>
                </div>
              </div>

            </div>

            {/* Right Column - Booking Card (Sticky) */}
            <div className="lg:col-span-1">
              <div className="sticky top-10 bg-white border border-slate-200 rounded-[2rem] p-8 shadow-xl shadow-slate-200/50">
                <div className="text-slate-500 font-medium mb-2 uppercase tracking-wider text-sm">Giá thuê mỗi tháng</div>
                <div className="text-4xl font-bold text-[#e65c00] mb-6">
                  {apartment.rentalPrice?.toLocaleString()}đ
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-slate-600">
                    <ShieldCheck className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Hợp đồng minh bạch, pháp lý rõ ràng trực tiếp từ Chủ đầu tư</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-600">
                    <Zap className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Hỗ trợ kỹ thuật 24/7 khi có sự cố</span>
                  </li>
                </ul>

                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-4 bg-[#3a4a6b] text-white rounded-2xl font-bold text-lg flex justify-center items-center gap-3 hover:bg-[#2a3651] transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <PhoneCall className="w-6 h-6" /> Đặt lịch xem phòng
                </button>

                <p className="text-center text-sm text-slate-500 mt-4">Không thu phí khi đi xem nhà</p>
              </div>
            </div>
          </div>

          <SimilarApartments 
            currentApartmentId={apartment._id} 
            onBookViewing={() => setIsModalOpen(true)} 
          />
        </div>
      </div>

      <ViewingRequestModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        apartmentId={apartment._id}
        roomNumber={apartment.roomNumber}
      />

      <ImageGalleryLightbox 
        images={images}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
    </div>
  );
}
