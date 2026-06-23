import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Wrench, Calendar, ClipboardList, AlertTriangle } from "lucide-react";

export default function DashboardKyThuat() {
  const [stats, setStats] = useState({
    pendingRequests: 0,
    activeTasks: 0,
    assetsCount: 0,
    schedulesCount: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Tải danh sách yêu cầu để lấy thống kê cơ bản
        const res = await fetch("/api/maintenance/requests");
        const result = await res.json();
        if (res.ok) {
          const list = result.data || [];
          setStats({
            pendingRequests: list.filter((r: any) => r.status === "pending").length,
            activeTasks: list.filter((r: any) => r.status === "in_progress").length,
            assetsCount: 4,
            schedulesCount: 2
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
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">Xin chào, Kỹ thuật viên!</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">Quản lý các yêu cầu sửa chữa căn hộ và bảo trì máy móc cơ điện.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-full">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)] uppercase font-semibold">Yêu cầu chờ xử lý</p>
            <h3 className="text-xl font-bold text-red-600">{stats.pendingRequests} yêu cầu</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-full">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)] uppercase font-semibold">Công việc đang sửa</p>
            <h3 className="text-xl font-bold text-yellow-600">{stats.activeTasks} công việc</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)] uppercase font-semibold font-bold">Danh mục thiết bị</p>
            <h3 className="text-xl font-bold">{stats.assetsCount} hệ thống</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-full">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)] uppercase font-semibold">Lịch bảo trì sắp tới</p>
            <h3 className="text-xl font-bold text-green-600">{stats.schedulesCount} lịch bảo trì</h3>
          </div>
        </div>
      </div>

      {/* Quick shortcuts */}
      <div>
        <h2 className="text-lg font-bold text-[var(--color-primary)] mb-4 font-bold">Hạng mục thao tác</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/dashboard/requests"
            className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm hover:border-[var(--color-primary-light)] hover:shadow-md transition-all flex flex-col justify-between h-40"
          >
            <Wrench className="w-8 h-8 text-[var(--color-info)]" />
            <div>
              <h3 className="font-bold text-base text-[var(--color-text-primary)]">Nhận & Sửa chữa sự cố</h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Xem phản ánh từ cư dân (chập điện, rò nước, hỏng cửa) và cập nhật báo cáo vật tư
              </p>
            </div>
          </Link>

          <Link
            to="/dashboard/schedules"
            className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm hover:border-[var(--color-primary-light)] hover:shadow-md transition-all flex flex-col justify-between h-40"
          >
            <Calendar className="w-8 h-8 text-[var(--color-success)]" />
            <div>
              <h3 className="font-bold text-base text-[var(--color-text-primary)]">Lịch bảo trì máy móc</h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Quản lý bảo trì định kỳ cho thang máy, máy phát điện dự phòng, máy bơm nước
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
