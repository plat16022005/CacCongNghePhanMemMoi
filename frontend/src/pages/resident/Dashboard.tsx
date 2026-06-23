import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Home, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [myRoom, setMyRoom] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  
  const [stats, setStats] = useState({
    roomNumber: '--',
    price: '--',
    pendingBills: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 1. Lấy đơn đăng ký
      const appsRes = await fetch('/api/applications/my-applications');
      const appsData = appsRes.ok ? await appsRes.json() : { data: [] };
      const myApps = appsData.data || [];
      setApplications(myApps);

      // 2. Lấy phòng hiện tại
      const roomRes = await fetch('/api/rooms/my-room');
      const roomData = roomRes.ok ? await roomRes.json() : { data: null };
      
      if (roomData.data && roomData.data.roomNumber) {
        setMyRoom(roomData.data);
        
        // 3. Lấy hóa đơn nếu đã có phòng
        const invRes = await fetch('/api/rooms/my-invoices');
        const invData = invRes.ok ? await invRes.json() : { data: [] };
        const myInvoices = invData.data || [];
        setInvoices(myInvoices);
        
        const pendingCount = myInvoices.filter((i: any) => i.status !== 'paid').length;
        
        setStats({
          roomNumber: roomData.data.roomNumber,
          price: Number(roomData.data.rentalPrice).toLocaleString() + ' đ',
          pendingBills: pendingCount
        });
      } else {
        // Nếu chưa có phòng, lấy phòng trống
        const availRes = await fetch('/api/rooms/available');
        const availData = availRes.ok ? await availRes.json() : { data: [] };
        setAvailableRooms(availData.data || []);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRentRoom = async (roomId: string, roomNumber: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn gửi yêu cầu thuê Phòng ${roomNumber}?`)) return;
    
    try {
      const res = await fetch(`/api/rooms/${roomId}/rent`, { method: 'POST' });
      if (res.ok) {
        alert('Gửi yêu cầu thành công! Vui lòng chờ Ban Quản lý duyệt.');
        fetchDashboardData();
      } else {
        const data = await res.json();
        alert(data.message || 'Có lỗi xảy ra.');
      }
    } catch {
      alert('Lỗi kết nối máy chủ.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-32 bg-white rounded-[var(--radius-xl)]"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-white rounded-[var(--radius-xl)]"></div>
          <div className="h-32 bg-white rounded-[var(--radius-xl)]"></div>
          <div className="h-32 bg-white rounded-[var(--radius-xl)]"></div>
        </div>
      </div>
    );
  }

  const hasPendingApp = applications.some(app => app.status === 'pending');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] font-['Plus_Jakarta_Sans'] tracking-tight">
          {myRoom ? 'Tổng quan căn hộ' : 'Chào mừng đến với ApartmentHub'}
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          {myRoom 
            ? 'Theo dõi thông tin phòng và lịch sử thanh toán của bạn một cách rõ ràng.' 
            : 'Bạn chưa có phòng. Hãy xem danh sách phòng trống bên dưới hoặc kiểm tra đơn đăng ký.'}
        </p>
      </div>

      {/* TH 1: ĐÃ CÓ PHÒNG */}
      {myRoom ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border-l-4 border-[var(--color-primary)] border-t border-r border-b border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-sm)]">
              <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Căn hộ hiện tại</p>
              <p className="text-3xl font-bold text-[var(--color-primary)]">{stats.roomNumber}</p>
            </div>
            <div className="bg-white border-l-4 border-[var(--color-info)] border-t border-r border-b border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-sm)]">
              <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Giá thuê</p>
              <p className="text-3xl font-bold text-[var(--color-info)] font-mono">{stats.price}</p>
            </div>
            <div className="bg-white border-l-4 border-[var(--color-warning)] border-t border-r border-b border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-sm)]">
              <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Hóa đơn chờ thanh toán</p>
              <p className="text-3xl font-bold text-[var(--color-warning)]">{stats.pendingBills}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-sm)]">
              <h3 className="text-lg font-bold text-[var(--color-primary)] flex items-center gap-2 mb-6">
                <Home className="w-5 h-5" /> Thông tin phòng
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between border-b border-dashed border-[var(--color-border)] pb-2">
                  <span className="text-[var(--color-text-secondary)] font-medium text-sm">Diện tích</span>
                  <span className="text-[var(--color-text-primary)] font-bold text-sm">{myRoom.area} m²</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-[var(--color-border)] pb-2">
                  <span className="text-[var(--color-text-secondary)] font-medium text-sm">Tầng</span>
                  <span className="text-[var(--color-text-primary)] font-bold text-sm">{myRoom.floor}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-[var(--color-border)] pb-2">
                  <span className="text-[var(--color-text-secondary)] font-medium text-sm">Phòng ngủ</span>
                  <span className="text-[var(--color-text-primary)] font-bold text-sm">{myRoom.bedroomCount}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-[var(--color-text-secondary)] font-medium text-sm">Số người tối đa</span>
                  <span className="text-[var(--color-text-primary)] font-bold text-sm">{myRoom.maxOccupants}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] overflow-hidden">
              <div className="p-6 border-b border-[var(--color-border)]">
                <h3 className="text-lg font-bold text-[var(--color-primary)] flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Hóa đơn gần đây
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[var(--color-surface)]">
                    <tr>
                      <th className="p-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Kỳ thu</th>
                      <th className="p-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Tổng tiền</th>
                      <th className="p-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="p-6 text-center text-[var(--color-text-muted)] text-sm">
                          Chưa có hóa đơn nào.
                        </td>
                      </tr>
                    ) : (
                      invoices.slice(0, 5).map((inv, idx) => (
                        <tr key={idx} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors">
                          <td className="p-4 text-sm font-semibold text-[var(--color-text-primary)]">{inv.month}</td>
                          <td className="p-4 text-sm font-bold font-mono text-[var(--color-text-primary)]">{Number(inv.totalBill).toLocaleString()} đ</td>
                          <td className="p-4">
                            {inv.status === 'paid' ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-success-bg)] text-[var(--color-success)] text-xs font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Đã thanh toán
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-error-bg)] text-[var(--color-error)] text-xs font-bold">
                                <AlertCircle className="w-3.5 h-3.5" /> Chưa thanh toán
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* TH 2: CHƯA CÓ PHÒNG */
        <div className="flex flex-col gap-8">
          {applications.length > 0 && (
            <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] p-6">
              <h3 className="text-lg font-bold text-[var(--color-primary)] mb-4">Đơn thuê phòng của bạn</h3>
              <div className="flex flex-col gap-3">
                {applications.map((app) => (
                  <div key={app._id} className="flex items-center justify-between p-4 bg-[var(--color-surface)] rounded-[var(--radius-md)] border border-[var(--color-border)]">
                    <div>
                      <p className="font-bold text-[var(--color-text-primary)]">Phòng {app.roomId?.roomNumber || 'N/A'}</p>
                      <p className="text-sm text-[var(--color-text-secondary)] mt-1">Ngày gửi: {new Date(app.createdAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <div>
                      {app.status === 'pending' && <span className="px-3 py-1.5 bg-[var(--color-warning-bg)] text-[var(--color-warning)] text-xs font-bold rounded-full flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> Đang chờ duyệt</span>}
                      {app.status === 'approved' && <span className="px-3 py-1.5 bg-[var(--color-info-bg)] text-[var(--color-info)] text-xs font-bold rounded-full">Đã duyệt - Chờ cọc</span>}
                      {app.status === 'rejected' && <span className="px-3 py-1.5 bg-[var(--color-error-bg)] text-[var(--color-error)] text-xs font-bold rounded-full">Đã từ chối</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!hasPendingApp && (
            <div>
              <h3 className="text-xl font-bold text-[var(--color-primary)] mb-6">Danh sách phòng trống</h3>
              {availableRooms.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)]">
                  <p className="text-[var(--color-text-muted)]">Hiện tại không có phòng nào trống.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {availableRooms.map(room => (
                    <motion.div 
                      key={room.id}
                      whileHover={{ y: -4, boxShadow: 'var(--shadow-md)' }}
                      className="bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden transition-all shadow-[var(--shadow-sm)]"
                    >
                      <div className="h-2 w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-info)]"></div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-xl font-bold text-[var(--color-primary)]">Phòng {room.roomNumber}</h4>
                            <p className="text-sm text-[var(--color-text-muted)] mt-1">Tầng {room.floor} • {room.area} m²</p>
                          </div>
                          <span className="px-2.5 py-1 bg-[var(--color-success-bg)] text-[var(--color-success)] text-[11px] font-bold rounded-full uppercase tracking-wider">
                            Trống
                          </span>
                        </div>
                        <p className="text-2xl font-bold font-mono text-[var(--color-info)] mb-6">
                          {Number(room.rentalPrice).toLocaleString()} đ<span className="text-sm font-normal text-[var(--color-text-muted)]">/tháng</span>
                        </p>
                        
                        <div className="flex gap-3">
                          <button 
                            onClick={() => handleRentRoom(room.id, room.roomNumber)}
                            className="flex-1 bg-[var(--color-primary)] text-white py-2.5 rounded-[var(--radius-md)] text-sm font-semibold hover:bg-[var(--color-primary-light)] transition-colors"
                          >
                            Thuê phòng
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
