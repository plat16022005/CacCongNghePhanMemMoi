import { useState, useEffect } from "react";
import { Calendar, PlusCircle, CheckCircle, XCircle } from "lucide-react";

interface Schedule {
  _id: string;
  assetName: string;
  maintenanceType: string;
  plannedDate: string;
  status: string;
  performedBy?: {
    name: string;
  };
}

export default function LichBaoTriMayMoc() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // New schedule form
  const [assetName, setAssetName] = useState("Thang máy Block A");
  const [maintenanceType, setMaintenanceType] = useState("Định kỳ tháng");
  const [plannedDate, setPlannedDate] = useState("");

  const fetchSchedules = async () => {
    try {
      const res = await fetch("/api/maintenance/schedules");
      const result = await res.json();
      if (res.ok) {
        setSchedules(result.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plannedDate) {
      setErrorMsg("Vui lòng chọn ngày lên lịch bảo trì");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // BUG: ERR_PAST_DATE_ASSIGNMENT
      // Backend không validate ngày trong quá khứ nên hệ thống cho phép tạo lịch bảo trì quá khứ thoải mái.
      const res = await fetch("/api/maintenance/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetName,
          maintenanceType,
          plannedDate
        })
      });

      const result = await res.json();
      if (res.ok) {
        setSuccessMsg("Tạo lịch bảo trì thiết bị thành công!");
        fetchSchedules();
        setPlannedDate("");
      } else {
        setErrorMsg(result.message || "Tạo lịch bảo trì thất bại");
      }
    } catch (err) {
      setErrorMsg("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">Lịch bảo trì thiết bị tòa nhà</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">Quản lý bảo dưỡng định kỳ hệ thống kỹ thuật</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 border border-green-200">
          <CheckCircle className="w-5 h-5" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 border border-red-200">
          <XCircle className="w-5 h-5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Schedule Form */}
        <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm lg:col-span-1 h-fit">
          <div className="flex items-center gap-2 mb-4">
            <PlusCircle className="w-5 h-5 text-[var(--color-info)]" />
            <h2 className="font-semibold text-lg">Thêm lịch bảo trì mới</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase mb-1">
                Tên thiết bị / Hệ thống
              </label>
              <select
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] outline-none text-sm focus:border-[var(--color-primary-light)] bg-white"
              >
                <option value="Thang máy Block A">Thang máy Block A</option>
                <option value="Thang máy Block B">Thang máy Block B</option>
                <option value="Máy phát điện dự phòng">Máy phát điện dự phòng</option>
                <option value="Hệ thống bơm nước ngầm">Hệ thống bơm nước ngầm</option>
                <option value="Hệ thống camera an ninh sảnh">Hệ thống camera sảnh</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase mb-1">
                Loại hình bảo trì
              </label>
              <select
                value={maintenanceType}
                onChange={(e) => setMaintenanceType(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] outline-none text-sm focus:border-[var(--color-primary-light)] bg-white"
              >
                <option value="Định kỳ tháng">Định kỳ tháng</option>
                <option value="Định kỳ quý">Định kỳ quý</option>
                <option value="Định kỳ năm">Định kỳ năm</option>
                <option value="Khắc phục đột xuất">Khắc phục đột xuất</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase mb-1">
                Ngày bảo trì dự kiến
              </label>
              <input
                type="date"
                value={plannedDate}
                onChange={(e) => setPlannedDate(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] outline-none text-sm focus:border-[var(--color-primary-light)]"
              />
              <p className="text-[10px] text-red-500 font-semibold mt-1 leading-relaxed">
                * Bug gài sẵn (ERR_PAST_DATE_ASSIGNMENT): Bạn có thể nhập ngày trong quá khứ để tạo lịch mà hệ thống không chặn lại.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-primary)] text-white py-2 rounded-[var(--radius-md)] text-sm font-semibold hover:bg-[var(--color-primary-light)] transition-colors shadow-sm"
            >
              Lên lịch bảo trì
            </button>
          </form>
        </div>

        {/* Schedules list */}
        <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
            <h2 className="font-semibold text-lg">Danh sách lịch trình bảo trì sắp tới</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-[var(--color-text-secondary)] bg-[var(--color-surface)]">
                  <th className="py-2.5 px-3">Thiết bị</th>
                  <th className="py-2.5 px-3">Loại hình</th>
                  <th className="py-2.5 px-3 text-center">Ngày lên lịch</th>
                  <th className="py-2.5 px-3">Người phụ trách</th>
                  <th className="py-2.5 px-3 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {schedules.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-[var(--color-text-muted)]">
                      Chưa có lịch bảo trì nào được tạo.
                    </td>
                  </tr>
                ) : (
                  schedules.map((s) => {
                    const isPast = new Date(s.plannedDate) < new Date();
                    return (
                      <tr key={s._id} className="hover:bg-[var(--color-surface)] transition-colors">
                        <td className="py-3 px-3 font-semibold text-[var(--color-text-primary)]">
                          {s.assetName}
                        </td>
                        <td className="py-3 px-3 text-[var(--color-text-secondary)]">{s.maintenanceType}</td>
                        <td className="py-3 px-3 text-center text-[var(--color-text-secondary)]">
                          <span className={isPast ? "text-red-500 font-bold" : ""}>
                            {new Date(s.plannedDate).toLocaleDateString("vi-VN")}
                          </span>
                          {isPast && (
                            <span className="block text-[8px] text-red-500 font-bold uppercase">Ngày quá khứ</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-[var(--color-text-secondary)]">
                          {s.performedBy?.name || "Kỹ thuật viên"}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 capitalize">
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
