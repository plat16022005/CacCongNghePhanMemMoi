import { useState } from 'react';
import { Search, LogIn, LogOut, Info, XCircle } from 'lucide-react';

export default function Vehicles() {
  const [plate, setPlate] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleSearch = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/security/vehicles?licensePlate=${plate}`);
      const data = await res.json();
      setResult(data);
    } catch (err) { alert('Lỗi kết nối'); }
  };

  const logAction = async (action: 'entry' | 'exit') => {
    try {
      await fetch('/api/security/vehicles/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licensePlate: plate, action })
      });
      alert(`Đã ghi nhận xe ${action === 'entry' ? 'VÀO' : 'RA'}`);
      setPlate('');
      setResult(null);
    } catch (err) { alert('Lỗi'); }
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-800 mb-6 text-center">Kiểm Soát Phương Tiện</h1>
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="w-8 h-8 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              autoFocus
              required
              value={plate}
              onChange={e => setPlate(e.target.value.toUpperCase())}
              placeholder="Nhập biển số (VD: 51A-12345)" 
              className="w-full text-2xl font-mono uppercase pl-16 pr-6 py-5 border-2 border-slate-300 rounded-2xl focus:border-orange-500 focus:outline-none"
            />
          </div>
          <button type="submit" className="px-8 bg-slate-800 text-white rounded-2xl text-xl font-bold hover:bg-slate-900 transition">
            Tra cứu
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4">
          {result.found ? (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4 border-b pb-4">
                <Info className="w-10 h-10 text-indigo-600" />
                <div>
                  <h2 className="text-3xl font-mono font-bold text-slate-800 tracking-wider">{result.licensePlate}</h2>
                  <p className="text-lg text-slate-500 font-medium capitalize mt-1">{result.vehicleType} • {result.brand} {result.color}</p>
                </div>
                <div className={`ml-auto px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider ${result.registrationStatus === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {result.registrationStatus === 'approved' ? 'Hợp lệ' : 'Chưa cấp thẻ'}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 text-xl">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm font-bold text-slate-500 mb-1">Chủ phương tiện</p>
                  <p className="font-bold text-slate-800">{result.owner}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm font-bold text-slate-500 mb-1">Căn hộ</p>
                  <p className="font-bold text-indigo-600">{result.apartment}</p>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <button onClick={() => logAction('entry')} className="flex-1 py-5 bg-green-500 text-white rounded-2xl text-2xl font-bold hover:bg-green-600 transition shadow-lg shadow-green-500/30 flex items-center justify-center gap-3">
                  <LogIn className="w-8 h-8" /> CHO VÀO
                </button>
                <button onClick={() => logAction('exit')} className="flex-1 py-5 bg-slate-200 text-slate-700 rounded-2xl text-2xl font-bold hover:bg-slate-300 transition flex items-center justify-center gap-3">
                  <LogOut className="w-8 h-8" /> CHO RA
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-12 h-12" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-2">Không tìm thấy biển số</h3>
              <p className="text-xl text-slate-500 mb-8">Phương tiện này chưa đăng ký vé tháng tại chung cư. Ghi nhận là xe khách vãng lai.</p>
              
              <div className="flex gap-4 mb-8">
                <button onClick={() => logAction('entry')} className="flex-1 py-4 bg-green-500 text-white rounded-xl text-xl font-bold hover:bg-green-600 transition shadow-lg shadow-green-500/30 flex items-center justify-center gap-2">
                  <LogIn className="w-6 h-6" /> KHÁCH VÀO
                </button>
                <button onClick={() => logAction('exit')} className="flex-1 py-4 bg-slate-200 text-slate-700 rounded-xl text-xl font-bold hover:bg-slate-300 transition flex items-center justify-center gap-2">
                  <LogOut className="w-6 h-6" /> KHÁCH RA
                </button>
              </div>

              <button onClick={() => {setPlate(''); setResult(null)}} className="px-8 py-3 text-slate-500 font-bold hover:text-slate-700 underline">Tìm biển số khác</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
