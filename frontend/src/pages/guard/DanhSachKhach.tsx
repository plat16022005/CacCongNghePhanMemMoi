import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

interface Guest {
  _id: string;
  guestName: string;
  cccd: string;
  phone: string;
  visitDate: string;
  leaveDate: string;
  reason: string;
  status: string;
  residentId?: {
    name: string;
    phoneNumber: string;
  };
  createdAt: string;
}

export default function DanhSachKhach() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/guard/guests");
      const result = await res.json();
      if (res.ok) {
        setGuests(result.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">Lịch sử khách đăng ký ra vào</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">Xem thông tin chi tiết và lịch sử đăng ký khách</p>
        </div>
        <button
          onClick={fetchGuests}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] text-xs font-semibold hover:bg-[var(--color-surface)]"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Làm mới</span>
        </button>
      </div>

      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-text-secondary)] bg-[var(--color-surface)]">
                <th className="py-3 px-4">Ngày đăng ký</th>
                <th className="py-3 px-4">Tên khách</th>
                <th className="py-3 px-4">CCCD & Số điện thoại</th>
                <th className="py-3 px-4">Cư dân tiếp đón</th>
                <th className="py-3 px-4">Thời gian thăm dự kiến</th>
                <th className="py-3 px-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {guests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-[var(--color-text-muted)]">
                    Chưa có dữ liệu khách nào.
                  </td>
                </tr>
              ) : (
                guests.map((g) => (
                  <tr key={g._id} className="hover:bg-[var(--color-surface)] transition-colors">
                    <td className="py-3.5 px-4 text-[var(--color-text-secondary)]">
                      {new Date(g.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[var(--color-text-primary)]">
                      {g.guestName}
                    </td>
                    <td className="py-3.5 px-4 text-[var(--color-text-secondary)]">
                      <div>CCCD: {g.cccd}</div>
                      <div className="text-[10px] text-[var(--color-text-muted)]">SĐT: {g.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[var(--color-text-secondary)]">
                      {g.residentId?.name || "N/A"}
                    </td>
                    <td className="py-3.5 px-4 text-[var(--color-text-secondary)]">
                      <div>Vào: {new Date(g.visitDate).toLocaleDateString("vi-VN")}</div>
                      <div>Ra: {new Date(g.leaveDate).toLocaleDateString("vi-VN")}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        g.status === "arrived" ? "bg-green-100 text-green-700" :
                        g.status === "left" ? "bg-gray-100 text-gray-600" :
                        g.status === "approved" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {g.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
