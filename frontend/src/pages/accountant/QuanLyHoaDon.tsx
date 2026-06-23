import { useState, useEffect } from "react";
import { Check, RefreshCw, Layers } from "lucide-react";

interface Invoice {
  _id: string;
  roomId: {
    _id: string;
    roomNumber: string;
  };
  tenantId: {
    name: string;
    email: string;
  };
  month: string;
  type: string;
  oldElec: number;
  newElec: number;
  oldWater: number;
  newWater: number;
  electricityFee: number;
  waterFee: number;
  serviceFee: number;
  vehicleFee: number;
  discount: number;
  totalBill: number;
  status: string;
  paymentDate?: string;
}

export default function QuanLyHoaDon() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [targetMonth, setTargetMonth] = useState("2026-06");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchInvoices = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/accountant/invoices");
      const data = await res.json();
      if (res.ok) {
        setInvoices(data.data || []);
      }
    } catch (err) {
      setErrorMsg("Không thể tải danh sách hóa đơn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Confirm payment
  const handleConfirm = async (id: string) => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      // BUG: ERR_CONFIRM_PAID_INVOICE_AGAIN
      // Frontend vẫn cho phép bấm nút confirm trên hóa đơn đã thanh toán
      const res = await fetch(`/api/accountant/invoices/${id}/confirm`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("Xác nhận thanh toán hóa đơn thành công!");
        fetchInvoices();
      } else {
        setErrorMsg(data.message || "Xác nhận thất bại");
      }
    } catch (err) {
      setErrorMsg("Lỗi kết nối server");
    }
  };

  // Auto generate monthly invoices
  const handleAutoGenerate = async () => {
    setSuccessMsg("");
    setErrorMsg("");
    setLoading(true);
    try {
      // BUG: ERR_DUPLICATE_MONTHLY_INVOICE
      // Backend không chặn tạo trùng lặp. Mỗi lần click sẽ sinh thêm hóa đơn nháp mới cho phòng.
      const res = await fetch("/api/accountant/invoices/auto-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month: targetMonth }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message || "Đã tự động tạo hóa đơn nháp thành công!");
        fetchInvoices();
      } else {
        setErrorMsg(data.message || "Không thể tự động tạo hóa đơn");
      }
    } catch (err) {
      setErrorMsg("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">Quản lý danh sách Hóa đơn</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Xem lịch sử, tạo tự động hóa đơn hàng tháng
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchInvoices}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] text-xs font-semibold hover:bg-[var(--color-surface)]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 text-sm">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Auto Generation Bar */}
      <div className="bg-white p-4 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[var(--color-info)]" />
          <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase">
            Tự động tạo hóa đơn tháng:
          </span>
        </div>
        <input
          type="month"
          value={targetMonth}
          onChange={(e) => setTargetMonth(e.target.value)}
          className="border border-[var(--color-border)] rounded px-2.5 py-1 text-sm outline-none bg-[var(--color-surface)]"
        />
        <button
          onClick={handleAutoGenerate}
          disabled={loading}
          className="px-4 py-1.5 bg-[var(--color-primary)] text-white text-xs font-semibold rounded hover:bg-[var(--color-primary-light)] transition-colors"
        >
          {loading ? "Đang tạo..." : "Tự động tạo cho cả chung cư"}
        </button>
        <div className="text-[10px] text-red-500 font-semibold flex-1 min-w-[200px]">
          * Bug gài sẵn (ERR_DUPLICATE_MONTHLY_INVOICE): Bạn có thể nhấn nút "Tự động tạo" 2 lần liên tiếp để tạo ra các hóa đơn trùng lặp.
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-text-secondary)] bg-[var(--color-surface)] font-bold">
                <th className="py-3 px-4">Tháng/Phòng</th>
                <th className="py-3 px-4">Cư dân thuê</th>
                <th className="py-3 px-4">Chi tiết điện nước (mới/cũ)</th>
                <th className="py-3 px-4 text-right">Tổng hóa đơn</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-center">Thao tác xác nhận</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-[var(--color-text-muted)]">
                    Chưa có hóa đơn nào được tạo.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-[var(--color-surface)] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[var(--color-text-primary)]">
                      <div>Phòng: {inv.roomId?.roomNumber || "N/A"}</div>
                      <div className="text-[10px] text-[var(--color-text-muted)] font-normal">
                        Kỳ hóa đơn: {inv.month}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{inv.tenantId?.name || "N/A"}</div>
                      <div className="text-[10px] text-[var(--color-text-muted)]">{inv.tenantId?.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[var(--color-text-secondary)]">
                      <div>Điện: {inv.newElec} - {inv.oldElec} kWh ({inv.electricityFee.toLocaleString()} đ)</div>
                      <div>Nước: {inv.newWater} - {inv.oldWater} m3 ({inv.waterFee.toLocaleString()} đ)</div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[var(--color-text-primary)]">
                      {inv.totalBill.toLocaleString()} đ
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status === "paid" ? "bg-green-100 text-green-700" :
                        inv.status === "pending" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                      }`}>
                        {inv.status === "paid" ? "Đã thanh toán" : inv.status === "pending" ? "Chờ duyệt" : "Chưa thanh toán"}
                      </span>
                      {inv.paymentDate && (
                        <div className="text-[9px] text-[var(--color-text-muted)] mt-1">
                          Ngày trả: {new Date(inv.paymentDate).toLocaleDateString("vi-VN")}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {/* BUG: ERR_CONFIRM_PAID_INVOICE_AGAIN: Cho phép bấm kể cả khi status đã là paid */}
                      <button
                        onClick={() => handleConfirm(inv._id)}
                        className="bg-green-600 text-white hover:bg-green-700 px-3 py-1 rounded text-[10px] font-bold transition-colors inline-flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Xác nhận thu</span>
                      </button>
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
