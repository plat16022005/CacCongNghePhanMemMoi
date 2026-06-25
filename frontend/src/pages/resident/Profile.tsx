import { useState, useEffect } from 'react';
import { User, Phone, Mail, Camera, Save } from 'lucide-react';
import { motion } from 'motion/react';

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/resident/profile');
      const json = await res.json();
      if (!json.error && json.data) {
        setProfile(json.data);
        setFormData({
          name: json.data.name || json.data.firstName || '',
          phoneNumber: json.data.phoneNumber || ''
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/resident/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      if (!json.error) {
        alert('Cập nhật hồ sơ thành công!');
        fetchProfile();
      } else {
        alert(json.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      alert('Lỗi kết nối');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Đang tải...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">Hồ sơ cá nhân</h1>
        <p className="text-[var(--color-text-secondary)]">Quản lý thông tin cá nhân của bạn</p>
      </div>

      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-6 md:p-8 max-w-3xl">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 rounded-full bg-[var(--color-surface)] border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
              {profile?.image ? (
                <img src={profile.image} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-[var(--color-text-muted)]" />
              )}
              <button className="absolute bottom-0 w-full bg-black/50 py-2 flex justify-center hover:bg-black/70 transition">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <span className="px-3 py-1 bg-[var(--color-info-bg)] text-[var(--color-info)] text-xs font-bold rounded-full">
              Căn hộ: {profile?.apartmentCode || 'Chưa có'}
            </span>
          </div>

          <div className="flex-1 w-full flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-1">Họ và Tên</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-1">Số điện thoại</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                <input 
                  type="text" 
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-1">Email (Không thể đổi)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                <input 
                  type="email" 
                  value={profile?.email || ''}
                  disabled
                  className="w-full pl-10 pr-4 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] bg-gray-50 text-gray-500"
                />
              </div>
            </div>

            <button 
              onClick={handleSave}
              disabled={saving}
              className="mt-4 flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white py-2.5 px-6 rounded-[var(--radius-md)] font-bold hover:bg-[var(--color-primary-light)] transition disabled:opacity-70 w-fit"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
