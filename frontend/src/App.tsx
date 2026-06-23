import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Hero from './components/Hero'
import Login from './pages/Login'
import Register from './pages/Register'
import DashboardLayout from './components/layout/DashboardLayout'
import ResidentDashboard from './pages/resident/Dashboard'

function App() {
  return (
    <Router>
      <main className="min-h-screen bg-[var(--color-surface)]">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Dashboard Routes for Residents */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<ResidentDashboard />} />
            {/* Other nested routes will go here in Phase 2 */}
          </Route>
        </Routes>
      </main>
    </Router>
  )
}

export default App
