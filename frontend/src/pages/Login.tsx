import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // OTP State
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.status === 403 && data.message.includes('chưa được kích hoạt')) {
        setUnverifiedEmail(email);
        setShowOtp(true);
        await fetch('/api/auth/resend-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError(data.message || 'Đăng nhập thất bại');
        setLoading(false);
        return;
      }

      // Đăng nhập thành công, có thể dùng window.location để backend handle reload, 
      // hoặc navigate React Router tuỳ thiết kế. Do backend quản lý session cookie và ejs,
      // nên ta gọi window.location để EJS reload dashboard.
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Lỗi kết nối máy chủ');
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) return setError('Vui lòng nhập đủ 6 số');
    
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: unverifiedEmail, otp: otpCode })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
      } else {
        setShowOtp(false);
        alert('Kích hoạt thành công. Vui lòng đăng nhập lại.');
      }
    } catch {
      setError('Lỗi kết nối mạng');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value !== '' && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[var(--color-surface)]">
      {/* Left side: Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16 lg:p-24 relative z-10">
        <Link to="/" className="absolute top-8 left-8 md:left-12 flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Trang chủ</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-[420px] w-full mx-auto"
        >
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-3 tracking-tight" style={{ fontFamily: 'var(--font-helvetica)' }}>
              Chào mừng trở lại
            </h1>
            <p className="text-[var(--color-text-secondary)]">
              Đăng nhập để quản lý căn hộ và dịch vụ của bạn.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-[var(--color-text-muted)]" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] focus:outline-none focus:border-[var(--color-primary-light)] focus:ring-2 focus:ring-[var(--color-primary-pale)] transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-[var(--color-text-primary)]">Mật khẩu</label>
                <Link to="#" className="text-sm font-medium text-[var(--color-primary-light)] hover:text-[var(--color-primary)] transition-colors">Quên mật khẩu?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-[var(--color-text-muted)]" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] focus:outline-none focus:border-[var(--color-primary-light)] focus:ring-2 focus:ring-[var(--color-primary-pale)] transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-[var(--color-error)] bg-[var(--color-error-bg)] p-3 rounded-[var(--radius-sm)] text-sm font-medium"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full mt-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white font-semibold py-3 rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] transition-all flex justify-center"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                "Đăng nhập"
              )}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--color-text-secondary)]">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-semibold text-[var(--color-primary)] hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right side: Abstract visual */}
      <div className="hidden md:flex w-1/2 relative bg-[var(--color-primary)] overflow-hidden items-center justify-center">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260428_193507_4286c423-2fd9-4efd-92bd-91a939453fc1.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)] to-transparent z-0 opacity-80"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 max-w-sm glass-card bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[var(--radius-xl)] shadow-[var(--shadow-glass)]"
        >
          <div className="w-12 h-12 bg-white/20 rounded-[var(--radius-md)] flex items-center justify-center mb-6">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Tiện ích tối đa</h3>
          <p className="text-white/80 text-sm leading-relaxed">
            Mọi thao tác quản lý, đóng phí, phản ánh đều diễn ra trong chớp mắt. Chúng tôi tối ưu hóa mọi luồng tương tác để bạn có thêm thời gian thư giãn.
          </p>
        </motion.div>
      </div>

      {/* OTP Modal */}
      <AnimatePresence>
        {showOtp && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-text-primary)]/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] p-8 max-w-[400px] w-full text-center relative"
            >
              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-2">Xác thực tài khoản</h2>
              <p className="text-[var(--color-text-secondary)] text-sm mb-6">
                Mã OTP 6 số đã được gửi tới <strong>{unverifiedEmail}</strong>
              </p>

              <div className="flex justify-center gap-2 mb-8">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-11 h-12 text-center text-xl font-bold text-[var(--color-primary)] border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-pale)]"
                  />
                ))}
              </div>

              {error && <p className="text-[var(--color-error)] text-sm font-medium mb-4">{error}</p>}

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-[var(--color-primary)] text-white font-semibold py-3 rounded-[var(--radius-md)] shadow-sm hover:bg-[var(--color-primary-light)] transition-colors mb-4 flex justify-center"
              >
                {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : "Xác thực"}
              </button>

              <button 
                onClick={() => setShowOtp(false)}
                className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              >
                Hủy bỏ
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
