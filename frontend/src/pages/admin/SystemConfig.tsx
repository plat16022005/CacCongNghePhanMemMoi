import { useState, useEffect } from 'react';
import { Settings, Save } from 'lucide-react';

export default function AdminConfig() {
  const [config, setConfig] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchConfig(); }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/admin/config');
      const json = await res.json();
      setConfig(json);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if(res.ok) alert('Đã lưu cấu hình thành công!');
      else alert('Có lỗi xảy ra');
    } catch (err) { alert('Lỗi'); }
  };

  const handleChange = (namespace: string, key: string, value: any) => {
    setConfig({
      ...config,
      [namespace]: {
        ...config[namespace],
        [key]: value
      }
    });
  };

  if (loading) return <div className="p-8">Đang tải...</div>;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Cấu hình Hệ thống</h1>
          <p className="text-slate-500">Thiết lập các tham số vận hành chung</p>
        </div>
        <button onClick={handleSave} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30">
          <Save className="w-5 h-5" /> Lưu Thay Đổi
        </button>
      </div>

      <div className="flex flex-col gap-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        
        {/* App Section */}
        <section>
          <h2 className="text-xl font-bold text-indigo-600 border-b border-indigo-100 pb-2 mb-4 flex items-center gap-2"><Settings className="w-5 h-5"/> Thông tin chung (App)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Tên Ứng dụng</label>
              <input type="text" value={config.app?.name || ''} onChange={e=>handleChange('app', 'name', e.target.value)} className="w-full border p-2 rounded-lg focus:border-indigo-500 bg-slate-50" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Email Hỗ trợ</label>
              <input type="email" value={config.app?.supportEmail || ''} onChange={e=>handleChange('app', 'supportEmail', e.target.value)} className="w-full border p-2 rounded-lg focus:border-indigo-500 bg-slate-50" />
            </div>
          </div>
        </section>

        {/* Invoice Section */}
        <section>
          <h2 className="text-xl font-bold text-indigo-600 border-b border-indigo-100 pb-2 mb-4">Kế Toán (Hóa Đơn)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Hạn nộp (Ngày)</label>
              <input type="number" value={config.invoice?.dueDays || 0} onChange={e=>handleChange('invoice', 'dueDays', Number(e.target.value))} className="w-full border p-2 rounded-lg focus:border-indigo-500 bg-slate-50" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Phí phạt trễ (%)</label>
              <input type="number" step="0.1" value={config.invoice?.lateFeePercent || 0} onChange={e=>handleChange('invoice', 'lateFeePercent', Number(e.target.value))} className="w-full border p-2 rounded-lg focus:border-indigo-500 bg-slate-50" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Nhắc nợ trước (Ngày)</label>
              <input type="number" value={config.invoice?.reminderDaysBefore || 0} onChange={e=>handleChange('invoice', 'reminderDaysBefore', Number(e.target.value))} className="w-full border p-2 rounded-lg focus:border-indigo-500 bg-slate-50" />
            </div>
          </div>
        </section>

        {/* Guest Section */}
        <section>
          <h2 className="text-xl font-bold text-indigo-600 border-b border-indigo-100 pb-2 mb-4">Khách thăm & Bảo vệ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Số khách tối đa / lượt đăng ký</label>
              <input type="number" value={config.guest?.maxGuestsPerVisit || 0} onChange={e=>handleChange('guest', 'maxGuestsPerVisit', Number(e.target.value))} className="w-full border p-2 rounded-lg focus:border-indigo-500 bg-slate-50" />
            </div>
            <div className="flex items-center gap-3 mt-6">
              <input type="checkbox" checked={config.guest?.requireApproval || false} onChange={e=>handleChange('guest', 'requireApproval', e.target.checked)} className="w-5 h-5 accent-indigo-600" id="reqApp" />
              <label htmlFor="reqApp" className="font-bold text-slate-600">Yêu cầu BQL duyệt khách thăm</label>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
