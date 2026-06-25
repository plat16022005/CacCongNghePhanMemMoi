import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Hero from './components/Hero'
import Login from './pages/Login'
import Register from './pages/Register'

// Public Pages
import About from './pages/public/About'
import Features from './pages/public/Features'
import PublicAmenities from './pages/public/PublicAmenities'
import Financials from './pages/public/Financials'

import DashboardLayout from './components/layout/DashboardLayout'
import ResidentDashboard from './pages/resident/Dashboard'
import Profile from './pages/resident/Profile'
import Apartment from './pages/resident/Apartment'
import Invoices from './pages/resident/Invoices'
import Guests from './pages/resident/Guests'
import Parking from './pages/resident/Parking'
import Maintenance from './pages/resident/Maintenance'
import Notifications from './pages/resident/Notifications'
import Feedbacks from './pages/resident/Feedbacks'
import Amenities from './pages/resident/Amenities'
import Surveys from './pages/resident/Surveys'

import ManagerLayout from './components/layout/ManagerLayout'
import ManagerDashboard from './pages/manager/Dashboard'
import Residents from './pages/manager/Residents'
import Apartments from './pages/manager/Apartments'
import ManagerGuests from './pages/manager/Guests'
import Announcements from './pages/manager/Announcements'
import ManagerFeedbacks from './pages/manager/Feedbacks'
import ManagerAmenities from './pages/manager/Amenities'
import Reports from './pages/manager/Reports'

import SecurityLayout from './components/layout/SecurityLayout'
import SecurityDashboard from './pages/security/Dashboard'
import CheckIn from './pages/security/CheckIn'
import Vehicles from './pages/security/Vehicles'
import Incidents from './pages/security/Incidents'
import GuestList from './pages/security/GuestList'

import AccountantLayout from './components/layout/AccountantLayout'
import AccountantDashboard from './pages/accountant/Dashboard'
import AccountantInvoices from './pages/accountant/Invoices'
import AccountantPayments from './pages/accountant/Payments'
import AccountantDebts from './pages/accountant/Debts'
import ServiceFees from './pages/accountant/ServiceFees'
import AccountantReports from './pages/accountant/Reports'

import MaintenanceLayout from './components/layout/MaintenanceLayout'
import MaintenanceDashboard from './pages/maintenance/Dashboard'
import MaintenanceTasks from './pages/maintenance/Tasks'
import MaintenanceTaskDetail from './pages/maintenance/TaskDetail'
import MaintenanceSchedule from './pages/maintenance/Schedule'

// Admin Pages
import AdminLayout from './components/layout/AdminLayout'
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminUserDetail from './pages/admin/UserDetail'
import AdminBuildings from './pages/admin/Buildings'
import AdminConfig from './pages/admin/SystemConfig'
import AdminLogs from './pages/admin/ActivityLogs'

function App() {
  return (
    <Router>
      <main className="min-h-screen bg-[var(--color-surface)]">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Public Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/amenities" element={<PublicAmenities />} />
          <Route path="/financials" element={<Financials />} />
          
          {/* Dashboard Routes for Residents */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<ResidentDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="apartment" element={<Apartment />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="guests" element={<Guests />} />
            <Route path="parking" element={<Parking />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="feedbacks" element={<Feedbacks />} />
            <Route path="amenities" element={<Amenities />} />
            <Route path="surveys" element={<Surveys />} />
          </Route>

          {/* Manager Routes */}
          <Route path="/manager" element={<ManagerLayout />}>
            <Route index element={<ManagerDashboard />} />
            <Route path="residents" element={<Residents />} />
            <Route path="apartments" element={<Apartments />} />
            <Route path="guests" element={<ManagerGuests />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="feedbacks" element={<ManagerFeedbacks />} />
            <Route path="amenities" element={<ManagerAmenities />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          {/* Security Routes */}
          <Route path="/security" element={<SecurityLayout />}>
            <Route index element={<SecurityDashboard />} />
            <Route path="checkin" element={<CheckIn />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="guests" element={<GuestList />} />
            <Route path="incidents" element={<Incidents />} />
          </Route>

          {/* Maintenance Routes */}
          <Route path="/maintenance" element={<MaintenanceLayout />}>
            <Route index element={<MaintenanceDashboard />} />
            <Route path="tasks" element={<MaintenanceTasks />} />
            <Route path="tasks/:id" element={<MaintenanceTaskDetail />} />
            <Route path="schedule" element={<MaintenanceSchedule />} />
          </Route>

          {/* Accountant Routes */}
          <Route path="/accountant" element={<AccountantLayout />}>
            <Route index element={<AccountantDashboard />} />
            <Route path="invoices" element={<AccountantInvoices />} />
            <Route path="payments" element={<AccountantPayments />} />
            <Route path="debts" element={<AccountantDebts />} />
            <Route path="service-fees" element={<ServiceFees />} />
            <Route path="reports" element={<AccountantReports />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/:id" element={<AdminUserDetail />} />
            <Route path="buildings" element={<AdminBuildings />} />
            <Route path="config" element={<AdminConfig />} />
            <Route path="logs" element={<AdminLogs />} />
          </Route>
        </Routes>
      </main>
    </Router>
  )
}

export default App
