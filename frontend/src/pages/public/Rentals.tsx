import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Home } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import FilterBar from '../../components/public/FilterBar';
import ApartmentCard from '../../components/public/ApartmentCard';
import ApartmentCardSkeleton from '../../components/public/ApartmentCardSkeleton';
import { useApartments } from '../../hooks/useApartments';

export default function Rentals() {
  const [searchParams] = useSearchParams();
  const { apartments, meta, loading, loadingMore, fetchApartments } = useApartments();

  useEffect(() => {
    const filters = Object.fromEntries(searchParams.entries());
    fetchApartments(filters, false);
  }, [searchParams, fetchApartments]);

  const handleLoadMore = () => {
    if (meta.page < meta.totalPages) {
      const filters = Object.fromEntries(searchParams.entries());
      filters.page = String(meta.page + 1);
      fetchApartments(filters, true);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f0f4f8] flex flex-col items-center">
      <div className="w-full max-w-[1536px] bg-white md:m-5 md:rounded-[3rem] overflow-hidden flex flex-col flex-1 shadow-sm relative">
        <Navbar />
        
        <div className="flex-1 flex flex-col py-10 px-6 max-w-7xl mx-auto w-full z-10">
          <motion.div 
            className="text-center mb-10"
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

          <FilterBar />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => <ApartmentCardSkeleton key={i} />)}
            </div>
          ) : apartments.length === 0 ? (
            <div className="text-center py-20 bg-[#f8fafd] rounded-[2rem] border border-[#e1e8f0]">
              <Home className="w-16 h-16 text-[#3a4a6b]/30 mx-auto mb-4" />
              <h3 className="text-2xl font-medium text-[#3a4a6b] mb-2">Không tìm thấy căn hộ phù hợp</h3>
              <p className="text-[#3a4a6b]/70">Vui lòng thử thay đổi bộ lọc hoặc quay lại sau.</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-[#3a4a6b] font-medium">
                Tìm thấy {meta.total} căn hộ phù hợp
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {apartments.map((apt, idx) => (
                  <ApartmentCard 
                    key={apt._id} 
                    apartment={apt} 
                    index={idx}
                  />
                ))}
                
                {loadingMore && [...Array(4)].map((_, i) => <ApartmentCardSkeleton key={`more-${i}`} />)}
              </div>

              {meta.page < meta.totalPages && !loadingMore && (
                <div className="mt-12 flex justify-center">
                  <button 
                    onClick={handleLoadMore}
                    className="px-8 py-3 bg-white border-2 border-[#3a4a6b] text-[#3a4a6b] rounded-xl font-medium hover:bg-[#3a4a6b] hover:text-white transition-colors"
                  >
                    Xem thêm
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
