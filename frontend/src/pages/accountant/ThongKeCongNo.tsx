import { useState, useEffect } from "react";
import { DollarSign, RefreshCw } from "lucide-react";

interface Debt {
  invoiceId: string;
  roomNumber: string;
  tenantName: string;
  month: string;
  amount: number;
  dueDate: string;
  lateDays: number;
  penalty: number;
  totalWithPenalty: number;
}

export default function ThongKeCongNo() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchDebts = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/accountant/debts");
      const result = await res.json();
      if (res.ok) {
        setDebts(result.data || []);
      } else {
        setErrorMsg(result.message || "Không thể tải báo cáo công nợ");
      }
    } catch (err) {
      setErrorMsg("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-primary)] flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-red-500" />
            <span>Theo dõi công nợ cư dân</span>
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">Thống kê phạt trễ hạn nộp tiền phòng của các căn hộ</p>
        </div>
        <button
          onClick={fetchDebts}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] text-xs font-semibold hover:bg-[var(--color-surface)]"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Làm mới</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Info notice about seeded bug */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-xs leading-relaxed">
        <strong>Phát hiện Bug (ERR_NEGATIVE_LATE_DAYS):</strong> Đối với các hóa đơn chưa tới hạn thanh toán (ví dụ: hôm nay ngày 23 nhưng ngày 30 mới hết hạn), hệ thống tính `lateDays` ra số âm ($-7$ ngày) và cộng phạt âm (`penalty = -%`), làm giảm tổng hóa đơn một cách sai lệch!
      </div>

      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-text-secondary)] bg-[var(--color-surface)] font-bold">
                <th className="py-3 px-4">Căn hộ</th>
                <th className="py-3 px-4">Tên khách thuê</th>
                <th className="py-3 px-4 text-center">Hạn nộp tiền</th>
                <th className="py-3 px-4 text-center">Số ngày trễ</th>
                <th className="py-3 px-4 text-right">Phí gốc</th>
                <th className="py-3 px-4 text-right">Tiền phạt (2%/ngày)</th>
                <th className="py-3 px-4 text-right">Tổng phải thu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {debts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-[var(--color-text-muted)]">
                    Không có công nợ căn hộ nào chưa thanh toán.
                  </td>
                </tr>
              ) : (
                debts.map((d, index) => (
                  <tr key={index} className="hover:bg-[var(--color-surface)] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[var(--color-text-primary)]">
                      Phòng {d.roomNumber} ({d.month})
                    </td>
                    <td className="py-3.5 px-4 text-[var(--color-text-secondary)]">{d.tenantName}</td>
                    <td className="py-3.5 px-4 text-center text-[var(--color-text-secondary)]">{d.dueDate}</td>
                    <td className="py-3.5 px-4 text-center font-bold">
                      <span className={d.lateDays > 0 ? "text-red-600" : "text-green-600"}>
                        {d.lateDays} ngày
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">{d.amount.toLocaleString()} đ</td>
                    <td className={`py-3.5 px-4 text-right font-semibold ${d.penalty < 0 ? "text-red-500 font-bold" : d.penalty > 0 ? "text-orange-600" : ""}`}>
                      {d.penalty.toLocaleString()} đ
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[var(--color-primary)]">
                      {d.totalWithPenalty.toLocaleString()} đ
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
