import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, User, Phone, CheckCircle } from 'lucide-react';

interface ViewingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  apartmentId: string;
  roomNumber: string;
}

export default function ViewingRequestModal({ isOpen, onClose, apartmentId, roomNumber }: ViewingRequestModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    preferredDate: '',
    preferredTimeSlot: '',
    note: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/public/viewing-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, roomId: apartmentId })
      });
      const data = await res.json();
      
      if (!res.ok) {
        if (data.errors && data.errors.length > 0) {
          throw new Error(data.errors[0].msg);
        }
        throw new Error(data.message || 'Có lỗi xảy ra');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({ fullName: '', phoneNumber: '', preferredDate: '', preferredTimeSlot: '', note: '' });
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // allow booking from tomorrow
    return today.toISOString().split('T')[0];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={!loading && !success ? onClose : undefined}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white/95 backdrop-blur-md rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/50"
          >
            {success ? (
              <div className="p-10 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Đăng ký thành công!</h3>
                <p className="text-slate-600">Chúng tôi đã nhận được yêu cầu xem phòng {roomNumber} của bạn. Ban quản lý sẽ liên hệ trong thời gian sớm nhất.</p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-[#3a4a6b]">Đặt lịch xem phòng</h3>
                    <p className="text-sm text-slate-500">Căn hộ {roomNumber}</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                    disabled={loading}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={e => setFormData({...formData, fullName: e.target.value})}
                          className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nguyễn Văn A"
                        />
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          type="tel"
                          required
                          value={formData.phoneNumber}
                          onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                          className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0912345678"
                        />
                      </div>
                    </div>

                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Ngày mong muốn *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          type="date"
                          required
                          min={getMinDate()}
                          value={formData.preferredDate}
                          onChange={e => setFormData({...formData, preferredDate: e.target.value})}
                          className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-700"
                        />
                      </div>
                    </div>

                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Khung giờ *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Clock className="h-5 w-5 text-slate-400" />
                        </div>
                        <select
                          required
                          value={formData.preferredTimeSlot}
                          onChange={e => setFormData({...formData, preferredTimeSlot: e.target.value})}
                          className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                          <option value="">Chọn giờ</option>
                          <option value="morning">Buổi sáng (8h-12h)</option>
                          <option value="afternoon">Buổi chiều (13h-17h)</option>
                          <option value="evening">Buổi tối (17h-20h)</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Ghi chú thêm</label>
                      <textarea
                        value={formData.note}
                        onChange={e => setFormData({...formData, note: e.target.value})}
                        rows={3}
                        className="block w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="Tôi muốn xem nhà sau 5h chiều..."
                      ></textarea>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={loading}
                      className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-3 bg-[#3a4a6b] text-white font-medium rounded-xl hover:bg-[#2a3651] transition-colors disabled:opacity-50 flex justify-center items-center"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        'Gửi yêu cầu'
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
