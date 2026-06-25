import { useState } from 'react';
import { ScanLine, UserPlus, CheckCircle2, XCircle } from 'lucide-react';

export default function CheckIn() {
  const [tab, setTab] = useState<'qr' | 'manual'>('qr');
  const [qrData, setQrData] = useState('');
  const [qrResult, setQrResult] = useState<any>(null);
  const [form, setForm] = useState({ guestName: '', guestPhone: '', guestIdCard: '', visitApartmentCode: '', purpose: '', note: '' });

  const handleQRSubmit = async (e: any) => {
    e.preventDefault();
    setQrResult(null);
    try {
      const res = await fetch('/api/security/checkin/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrData })
      });
      const data = await res.json();
      setQrResult(data);
    } catch (err) { alert('Lỗi kết nối'); }
  };

  const handleManualSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/security/checkin/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (!json.error) {
        alert('Ghi nhận thành công!');
        setForm({ guestName: '', guestPhone: '', guestIdCard: '', visitApartmentCode: '', purpose: '', note: '' });
      } else {
        alert('Có lỗi xảy ra: ' + json.message);
      }
    } catch (err) { alert('Lỗi kết nối'); }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="flex bg-white rounded-2xl shadow-sm border border-slate-200 p-2 text-xl font-bold">
        <button 
          onClick={() => setTab('qr')} 
          className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-3 transition-colors ${tab === 'qr' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <ScanLine className="w-7 h-7" /> Quét QR Code
        </button>
        <button 
          onClick={() => setTab('manual')} 
          className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-3 transition-colors ${tab === 'manual' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <UserPlus className="w-7 h-7" /> Nhập thủ công
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 min-h-[500px]">
        {tab === 'qr' ? (
          <div className="flex flex-col items-center max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Giả lập Quét QR</h2>
            <form onSubmit={handleQRSubmit} className="w-full flex flex-col gap-4">
              <input 
                type="text" 
                autoFocus
                placeholder="Nhập mã QR Data (VD: Mã ID khách)" 
                value={qrData}
                onChange={e => setQrData(e.target.value)}
                className="w-full text-center text-2xl font-mono p-4 border-2 border-dashed border-slate-300 rounded-2xl focus:border-orange-500 focus:outline-none"
              />
              <button type="submit" className="w-full py-4 bg-orange-500 text-white rounded-2xl text-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/30">
                Xác thực mã QR
              </button>
            </form>

            {qrResult && (
              <div className={`mt-8 w-full p-6 rounded-2xl border-2 ${qrResult.valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-4 mb-4">
                  {qrResult.valid ? <CheckCircle2 className="w-12 h-12 text-green-600"/> : <XCircle className="w-12 h-12 text-red-600"/>}
                  <h3 className={`text-2xl font-bold ${qrResult.valid ? 'text-green-700' : 'text-red-700'}`}>
                    {qrResult.valid ? 'Hợp lệ - Cho phép vào' : 'Không hợp lệ'}
                  </h3>
                </div>
                
                <p className="text-lg font-medium text-slate-700 mb-4 bg-white/50 p-3 rounded-lg">{qrResult.message}</p>
                
                {qrResult.valid && (
                  <div className="flex flex-col gap-2 text-lg text-slate-600 bg-white p-4 rounded-xl">
                    <p><strong className="text-slate-800">Khách:</strong> {qrResult.guestName} ({qrResult.guestPhone})</p>
                    <p><strong className="text-slate-800">Thăm phòng:</strong> {qrResult.visitApartment}</p>
                    <p><strong className="text-slate-800">Chủ hộ:</strong> {qrResult.residentName}</p>
                    <p><strong className="text-slate-800">Mục đích:</strong> {qrResult.purpose}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Nhập thông tin khách vãng lai</h2>
            <form onSubmit={handleManualSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
              <div><label className="block font-bold text-slate-700 mb-2">Tên khách</label><input required value={form.guestName} onChange={e=>setForm({...form, guestName: e.target.value})} className="w-full border-2 border-slate-200 p-4 rounded-xl focus:border-orange-500" /></div>
              <div><label className="block font-bold text-slate-700 mb-2">Số điện thoại</label><input required value={form.guestPhone} onChange={e=>setForm({...form, guestPhone: e.target.value})} className="w-full border-2 border-slate-200 p-4 rounded-xl focus:border-orange-500" /></div>
              <div><label className="block font-bold text-slate-700 mb-2">CCCD / CMND</label><input value={form.guestIdCard} onChange={e=>setForm({...form, guestIdCard: e.target.value})} className="w-full border-2 border-slate-200 p-4 rounded-xl focus:border-orange-500" /></div>
              <div><label className="block font-bold text-slate-700 mb-2">Mã phòng thăm</label><input required value={form.visitApartmentCode} onChange={e=>setForm({...form, visitApartmentCode: e.target.value})} className="w-full border-2 border-slate-200 p-4 rounded-xl focus:border-orange-500" /></div>
              <div className="md:col-span-2"><label className="block font-bold text-slate-700 mb-2">Mục đích</label><input value={form.purpose} onChange={e=>setForm({...form, purpose: e.target.value})} placeholder="VD: Giao hàng, Thăm người thân..." className="w-full border-2 border-slate-200 p-4 rounded-xl focus:border-orange-500" /></div>
              <div className="md:col-span-2"><label className="block font-bold text-slate-700 mb-2">Ghi chú của bảo vệ</label><textarea rows={3} value={form.note} onChange={e=>setForm({...form, note: e.target.value})} className="w-full border-2 border-slate-200 p-4 rounded-xl focus:border-orange-500" /></div>
              <div className="md:col-span-2 pt-4">
                <button type="submit" className="w-full py-4 bg-slate-800 text-white rounded-xl text-xl font-bold hover:bg-slate-900 transition shadow-lg">Ghi nhận Check-in</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
