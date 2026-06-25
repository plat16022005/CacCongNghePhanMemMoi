import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { motion } from 'motion/react';

export default function Invoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await fetch('/api/resident/invoices');
      const json = await res.json();
      if (!json.error) {
        setInvoices(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (id: string) => {
    try {
      const res = await fetch(`/api/resident/invoices/${id}/pay`, { method: 'POST' });
      const json = await res.json();
      if (!json.error) {
        alert('Đã chuyển hướng đến cổng thanh toán (Demo)');
        // Simulate successful payment callback
        await fetch('/api/resident/invoices/payment/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ invoiceId: id })
        });
        fetchInvoices(); // Refresh
      } else {
        alert(json.message);
      }
    } catch (err) {
      alert('Lỗi khi thanh toán');
    }
  };

  if (loading) return <div className="p-6">Đang tải...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">Hóa đơn & Thanh toán</h1>
        <p className="text-[var(--color-text-secondary)]">Quản lý hóa đơn dịch vụ hàng tháng</p>
      </div>

      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
              <tr>
                <th className="p-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Kỳ thu (Tháng)</th>
                <th className="p-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Loại phí</th>
                <th className="p-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Tổng tiền</th>
                <th className="p-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Hạn chót</th>
                <th className="p-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Trạng thái</th>
                <th className="p-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">Chưa có hóa đơn nào</td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv._id} className="border-b border-[var(--color-border)] hover:bg-gray-50 transition">
                    <td className="p-4 font-semibold">{inv.period || inv.month}</td>
                    <td className="p-4">
                      <span className="flex items-center gap-1.5 text-sm">
                        <FileText className="w-4 h-4 text-gray-400" />
                        {inv.type === 'monthly' ? 'Tổng hợp tháng' : inv.type}
                      </span>
                    </td>
                    <td className="p-4 font-bold font-mono text-[var(--color-info)]">{Number(inv.totalBill).toLocaleString()} đ</td>
                    <td className="p-4 text-sm">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('vi-VN') : '---'}</td>
                    <td className="p-4">
                      {inv.status === 'paid' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--color-success-bg)] text-[var(--color-success)] text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Đã thanh toán
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--color-warning-bg)] text-[var(--color-warning)] text-xs font-bold">
                          <AlertCircle className="w-3.5 h-3.5" /> Chưa thanh toán
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {inv.status !== 'paid' && (
                        <button
                          onClick={() => handlePay(inv._id)}
                          className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-bold rounded-lg shadow-md hover:bg-[var(--color-primary-light)] transition flex items-center gap-2 ml-auto"
                        >
                          <CreditCard className="w-4 h-4" /> Thanh toán
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
