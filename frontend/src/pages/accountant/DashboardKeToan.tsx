import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DollarSign, FileText, PlusCircle, AlertCircle, TrendingUp } from "lucide-react";

export default function DashboardKeToan() {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    paidAmount: 0,
    debtAmount: 0,
    unpaidCount: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch("/api/accountant/invoices");
        const result = await res.json();
        if (res.ok) {
          const list = result.data || [];
          let paid = 0;
          let debt = 0;
          let unpaid = 0;

          list.forEach((inv: any) => {
            if (inv.status === "paid") {
              paid += inv.totalBill;
            } else {
              debt += inv.totalBill;
              unpaid++;
            }
          });

          setStats({
            totalInvoices: list.length,
            paidAmount: paid,
            debtAmount: debt,
            unpaidCount: unpaid
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
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">Xin chào, Kế toán!</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">Quản lý các nguồn thu chi, hóa đơn và công nợ tòa nhà.</p>
      </div>

      {/* Financial overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)] uppercase font-semibold">Hóa đơn phát hành</p>
            <h3 className="text-xl font-bold">{stats.totalInvoices} bản</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-full">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)] uppercase font-semibold">Doanh thu đã thu</p>
            <h3 className="text-xl font-bold">{stats.paidAmount.toLocaleString()} đ</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-full">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)] uppercase font-semibold">Công nợ chưa thu</p>
            <h3 className="text-xl font-bold text-red-600">{stats.debtAmount.toLocaleString()} đ</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-full">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)] uppercase font-semibold">Hóa đơn chưa đóng</p>
            <h3 className="text-xl font-bold text-yellow-600">{stats.unpaidCount} phòng</h3>
          </div>
        </div>
      </div>

      {/* Quick shortcuts */}
      <div>
        <h2 className="text-lg font-bold text-[var(--color-primary)] mb-4">Hoạt động quản lý tài chính</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/dashboard/invoices-manage"
            className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm hover:border-[var(--color-primary-light)] hover:shadow-md transition-all flex flex-col justify-between h-40"
          >
            <FileText className="w-8 h-8 text-[var(--color-info)]" />
            <div>
              <h3 className="font-bold text-base text-[var(--color-text-primary)]">Quản lý Hóa đơn</h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Duyệt danh sách hóa đơn dịch vụ, xác nhận chuyển khoản</p>
            </div>
          </Link>

          <Link
            to="/dashboard/invoices-create"
            className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm hover:border-[var(--color-primary-light)] hover:shadow-md transition-all flex flex-col justify-between h-40"
          >
            <PlusCircle className="w-8 h-8 text-[var(--color-primary-light)]" />
            <div>
              <h3 className="font-bold text-base text-[var(--color-text-primary)]">Tạo mới Hóa đơn</h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Lập hóa đơn tiền phòng, tiền điện nước hàng tháng</p>
            </div>
          </Link>

          <Link
            to="/dashboard/debts"
            className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm hover:border-[var(--color-primary-light)] hover:shadow-md transition-all flex flex-col justify-between h-40"
          >
            <DollarSign className="w-8 h-8 text-red-600" />
            <div>
              <h3 className="font-bold text-base text-[var(--color-text-primary)]">Theo dõi Công nợ</h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Báo cáo các khoản tiền phạt trễ hạn, thu hồi nợ</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
