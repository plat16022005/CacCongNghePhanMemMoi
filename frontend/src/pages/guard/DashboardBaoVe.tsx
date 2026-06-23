import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Car, AlertTriangle, ShieldCheck, QrCode } from "lucide-react";

export default function DashboardBaoVe() {
  const [stats, setStats] = useState({
    totalGuests: 0,
    arrivedGuests: 0,
    leftGuests: 0,
    incidentsCount: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch("/api/guard/guests");
        const result = await res.json();
        if (res.ok) {
          const list = result.data || [];
          setStats({
            totalGuests: list.length,
            arrivedGuests: list.filter((g: any) => g.status === "arrived").length,
            leftGuests: list.filter((g: any) => g.status === "left").length,
            incidentsCount: 1 // Giả lập sự cố
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">Xin chào, Bảo vệ!</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Giám sát và kiểm soát hoạt động an ninh tòa nhà hôm nay.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)] uppercase font-semibold">Khách đăng ký</p>
            <h3 className="text-xl font-bold">{stats.totalGuests} người</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-full">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)] uppercase font-semibold">Khách đang ở trong</p>
            <h3 className="text-xl font-bold">{stats.arrivedGuests} người</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-gray-50 text-gray-600 rounded-full">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)] uppercase font-semibold">Khách đã ra về</p>
            <h3 className="text-xl font-bold">{stats.leftGuests} người</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-full">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)] uppercase font-semibold">Sự cố ghi nhận</p>
            <h3 className="text-xl font-bold">{stats.incidentsCount} vụ</h3>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-[var(--color-primary)] mb-4">Lối tắt tác nghiệp nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/dashboard/guests-scan"
            className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm hover:border-[var(--color-primary-light)] hover:shadow-md transition-all flex flex-col justify-between h-40"
          >
            <QrCode className="w-8 h-8 text-[var(--color-info)]" />
            <div>
              <h3 className="font-bold text-base text-[var(--color-text-primary)]">Quét QR Khách vào/ra</h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Xác minh vé QR của khách ghé thăm căn hộ</p>
            </div>
          </Link>

          <Link
            to="/dashboard/vehicles"
            className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm hover:border-[var(--color-primary-light)] hover:shadow-md transition-all flex flex-col justify-between h-40"
          >
            <Car className="w-8 h-8 text-[var(--color-success)]" />
            <div>
              <h3 className="font-bold text-base text-[var(--color-text-primary)]">Kiểm tra gửi xe</h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Tra cứu biển số xe đăng ký vé tháng của cư dân</p>
            </div>
          </Link>

          <Link
            to="/dashboard/incidents"
            className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm hover:border-[var(--color-primary-light)] hover:shadow-md transition-all flex flex-col justify-between h-40"
          >
            <AlertTriangle className="w-8 h-8 text-[var(--color-warning)]" />
            <div>
              <h3 className="font-bold text-base text-[var(--color-text-primary)]">Ghi nhận sự cố</h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Tạo báo cáo biên bản sự cố an ninh, hỏa hoạn</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
