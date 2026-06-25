import { useState, useEffect } from 'react';
import { Building2, Plus, Trash2, Edit } from 'lucide-react';

export default function AdminBuildings() {
  const [buildings, setBuildings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', totalFloors: 10, yearBuilt: new Date().getFullYear() });

  useEffect(() => { fetchBuildings(); }, []);

  const fetchBuildings = async () => {
    try {
      const res = await fetch('/api/admin/buildings');
      const json = await res.json();
      setBuildings(json.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleCreate = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/buildings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...form, blocks: []})
      });
      if(res.ok) {
        setShowModal(false);
        fetchBuildings();
      } else alert((await res.json()).message);
    } catch (err) { alert('Lỗi'); }
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm('Xóa tòa nhà này?')) return;
    try {
      const res = await fetch(`/api/admin/buildings/${id}`, { method: 'DELETE' });
      if(res.ok) fetchBuildings();
      else alert((await res.json()).message);
    } catch (err) { alert('Lỗi'); }
  };

  // Block Modal
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState('');
  const [blockForm, setBlockForm] = useState({ name: '', roomsPerFloor: 5 });

  const handleAddBlockClick = (buildingId: string) => {
    setSelectedBuildingId(buildingId);
    setBlockForm({ name: '', roomsPerFloor: 5 });
    setShowBlockModal(true);
  };

  const handleAddBlockSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/buildings/${selectedBuildingId}/blocks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blockForm)
      });
      if(res.ok) {
        setShowBlockModal(false);
        fetchBuildings();
      }
      else alert((await res.json()).message);
    } catch(err) { alert('Lỗi'); }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Cơ sở hạ tầng</h1>
          <p className="text-slate-500">Quản lý Master Data các Tòa nhà và Block</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30">
          <Plus className="w-5 h-5" /> Thêm Tòa Nhà
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {loading ? <div className="p-4">Đang tải...</div> : buildings.map(b => (
          <div key={b._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative group">
            <button onClick={() => handleDelete(b._id)} className="absolute top-4 right-4 p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4"/></button>
            
            <div className="p-6 border-b border-slate-100 flex gap-4 items-center">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{b.name}</h2>
                <p className="text-sm text-slate-500 line-clamp-1">{b.address}</p>
                <div className="flex gap-4 mt-2 text-xs font-bold text-slate-400">
                  <span>CAO: {b.totalFloors} TẦNG</span>
                  <span>XÂY NĂM: {b.yearBuilt}</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 flex-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-700">Các Block trực thuộc</h3>
                <button onClick={() => handleAddBlockClick(b._id)} className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:text-indigo-800"><Plus className="w-4 h-4"/> Thêm Block</button>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {b.blocks.map((block: any, i: number) => (
                  <div key={i} className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm">
                    <span className="font-bold text-indigo-700 text-lg">{block.name}</span>
                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full font-bold text-slate-500">{block.totalApartments} căn</span>
                  </div>
                ))}
                {b.blocks.length === 0 && <span className="text-slate-400 text-sm italic">Chưa có block nào</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-indigo-600">Thêm Tòa Nhà Mới</h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div><label className="text-sm font-bold text-slate-600">Tên Tòa Nhà</label><input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full border p-2 rounded focus:border-indigo-500" placeholder="VD: Khối C chung cư X" /></div>
              <div><label className="text-sm font-bold text-slate-600">Địa chỉ</label><input required value={form.address} onChange={e=>setForm({...form, address: e.target.value})} className="w-full border p-2 rounded focus:border-indigo-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-bold text-slate-600">Số tầng cao</label><input type="number" required value={form.totalFloors} onChange={e=>setForm({...form, totalFloors: Number(e.target.value)})} className="w-full border p-2 rounded focus:border-indigo-500" /></div>
                <div><label className="text-sm font-bold text-slate-600">Năm xây dựng</label><input type="number" required value={form.yearBuilt} onChange={e=>setForm({...form, yearBuilt: Number(e.target.value)})} className="w-full border p-2 rounded focus:border-indigo-500" /></div>
              </div>
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={()=>setShowModal(false)} className="flex-1 py-2 bg-slate-100 text-slate-600 rounded font-bold">Hủy</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700">Lưu dữ liệu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBlockModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-indigo-600">Thêm Block Mới</h2>
            <form onSubmit={handleAddBlockSubmit} className="flex flex-col gap-4">
              <div><label className="text-sm font-bold text-slate-600">Tên Block</label><input required value={blockForm.name} onChange={e=>setBlockForm({...blockForm, name: e.target.value})} className="w-full border p-2 rounded focus:border-indigo-500" placeholder="VD: Block C" /></div>
              <div><label className="text-sm font-bold text-slate-600">Số căn hộ mỗi tầng</label><input type="number" required min={1} value={blockForm.roomsPerFloor} onChange={e=>setBlockForm({...blockForm, roomsPerFloor: Number(e.target.value)})} className="w-full border p-2 rounded focus:border-indigo-500" /></div>
              <p className="text-xs text-slate-500 mt-[-10px]">Hệ thống sẽ tự động tạo danh sách phòng tương ứng với số tầng của tòa nhà.</p>
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={()=>setShowBlockModal(false)} className="flex-1 py-2 bg-slate-100 text-slate-600 rounded font-bold">Hủy</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700">Tạo Block & Các Căn Hộ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
