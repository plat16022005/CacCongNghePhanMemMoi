import { useState, useEffect } from 'react';
import { Home, Layers, Grid, Users, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function Apartment() {
  const [apartment, setApartment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApartment();
  }, []);

  const fetchApartment = async () => {
    try {
      const res = await fetch('/api/resident/apartment');
      const json = await res.json();
      if (!json.error) {
        setApartment(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Đang tải...</div>;

  if (!apartment) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-[var(--radius-lg)] border">
        <Home className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700">Bạn chưa có căn hộ</h2>
        <p className="text-gray-500">Vui lòng liên hệ Ban quản lý để được cấp phát phòng.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">Thông tin căn hộ</h1>
        <p className="text-[var(--color-text-secondary)]">Chi tiết hợp đồng và thông tin cơ bản</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-dashed">
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-light)]/10 text-[var(--color-primary)] flex items-center justify-center">
              <Home className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold font-mono text-[var(--color-primary)]">Phòng {apartment.roomNumber}</h2>
              <p className="text-[var(--color-text-muted)] font-medium uppercase tracking-wider text-sm mt-1">Block {apartment.block || 'A'}</p>
            </div>
            <div className="ml-auto">
              <span className="px-3 py-1 bg-[var(--color-success-bg)] text-[var(--color-success)] text-xs font-bold rounded-full">
                Đang sử dụng
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div className="flex gap-3 items-start">
              <Grid className="w-5 h-5 text-[var(--color-text-muted)] mt-0.5" />
              <div>
                <p className="text-xs text-[var(--color-text-muted)] uppercase font-bold tracking-wider">Diện tích</p>
                <p className="font-bold text-lg">{apartment.area} m²</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <Layers className="w-5 h-5 text-[var(--color-text-muted)] mt-0.5" />
              <div>
                <p className="text-xs text-[var(--color-text-muted)] uppercase font-bold tracking-wider">Tầng</p>
                <p className="font-bold text-lg">{apartment.floor}</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <Home className="w-5 h-5 text-[var(--color-text-muted)] mt-0.5" />
              <div>
                <p className="text-xs text-[var(--color-text-muted)] uppercase font-bold tracking-wider">Phòng ngủ</p>
                <p className="font-bold text-lg">{apartment.bedroomCount}</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <Users className="w-5 h-5 text-[var(--color-text-muted)] mt-0.5" />
              <div>
                <p className="text-xs text-[var(--color-text-muted)] uppercase font-bold tracking-wider">Số người tối đa</p>
                <p className="font-bold text-lg">{apartment.maxOccupants}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-6">
          <h3 className="text-lg font-bold text-[var(--color-primary)] mb-6 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" /> Hợp đồng & Chi phí
          </h3>
          
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Ngày bắt đầu thuê</span>
              </div>
              <span className="font-bold">{apartment.ownerSince ? new Date(apartment.ownerSince).toLocaleDateString('vi-VN') : '---'}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Tiền thuê hàng tháng</span>
              <span className="font-bold text-[var(--color-info)] font-mono">{Number(apartment.rentalPrice).toLocaleString()} đ</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Tiền cọc</span>
              <span className="font-bold font-mono">{Number(apartment.depositAmount).toLocaleString()} đ</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
