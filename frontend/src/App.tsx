import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Hero from './components/Hero'
import Login from './pages/Login'
import Register from './pages/Register'
import DashboardLayout from './components/layout/DashboardLayout'
import ResidentDashboard from './pages/resident/Dashboard'

// Guard Pages
import DashboardBaoVe from './pages/guard/DashboardBaoVe'
import QuetQRKhach from './pages/guard/QuetQRKhach'
import DanhSachKhach from './pages/guard/DanhSachKhach'
import KiemTraXeGui from './pages/guard/KiemTraXeGui'
import BaoCaoSuCo from './pages/guard/BaoCaoSuCo'

// Accountant Pages
import DashboardKeToan from './pages/accountant/DashboardKeToan'
import QuanLyHoaDon from './pages/accountant/QuanLyHoaDon'
import TaoHoaDon from './pages/accountant/TaoHoaDon'
import ThongKeCongNo from './pages/accountant/ThongKeCongNo'

// Maintenance Pages
import DashboardKyThuat from './pages/maintenance/DashboardKyThuat'
import YeuCauSuaChua from './pages/maintenance/YeuCauSuaChua'
import LichBaoTriMayMoc from './pages/maintenance/LichBaoTriMayMoc'

function DashboardIndex() {
  const role = (window as any).USER_DATA?.role || 'user';
  if (role === 'guard') return <DashboardBaoVe />;
  if (role === 'accountant') return <DashboardKeToan />;
  if (role === 'maintenance') return <DashboardKyThuat />;
  return <ResidentDashboard />;
}

function App() {
  return (
    <Router>
      <main className="min-h-screen bg-[var(--color-surface)]">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Dashboard Routes with Role-based Views */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardIndex />} />
            
            {/* Guard Sub-routes */}
            <Route path="guests-scan" element={<QuetQRKhach />} />
            <Route path="guests-list" element={<DanhSachKhach />} />
            <Route path="vehicles" element={<KiemTraXeGui />} />
            <Route path="incidents" element={<BaoCaoSuCo />} />

            {/* Accountant Sub-routes */}
            <Route path="invoices-manage" element={<QuanLyHoaDon />} />
            <Route path="invoices-create" element={<TaoHoaDon />} />
            <Route path="debts" element={<ThongKeCongNo />} />

            {/* Maintenance Sub-routes */}
            <Route path="requests" element={<YeuCauSuaChua />} />
            <Route path="schedules" element={<LichBaoTriMayMoc />} />
          </Route>
        </Routes>
      </main>
    </Router>
  )
}

export default App
