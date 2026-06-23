import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  // OTP State
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    if (password !== confirmPassword) {
      return setError('Mật khẩu xác nhận không khớp');
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword })
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setError(data.errors.map((e: any) => e.msg).join(', '));
        } else {
          setError(data.message || 'Đăng ký thất bại');
        }
        setLoading(false);
        return;
      }

      setSuccessMsg(data.message);
      setRegisteredEmail(email);
      setTimeout(() => {
        setShowOtp(true);
      }, 1000);
    } catch (err) {
      setError('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) return setError('Vui lòng nhập đủ 6 số OTP');
    
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registeredEmail, otp: otpCode })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
      } else {
        setShowOtp(false);
        setSuccessMsg('Kích hoạt thành công! Đang chuyển hướng...');
        setTimeout(() => navigate('/login'), 2000);
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

    if (value !== '' && index < 5) {
      const nextInput = document.getElementById(`otp-reg-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row-reverse bg-[var(--color-surface)]">
      {/* Right side: Form (Reversed layout) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16 lg:p-24 relative z-10">
        <Link to="/" className="absolute top-8 right-8 md:right-12 flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
          <span className="text-sm font-medium">Trang chủ</span>
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-[420px] w-full mx-auto"
        >
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-3 tracking-tight" style={{ fontFamily: 'var(--font-helvetica)' }}>
              Khởi tạo tài khoản
            </h1>
            <p className="text-[var(--color-text-secondary)]">
              Tham gia ApartmentHub để quản lý căn hộ thông minh hơn.
            </p>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Họ và tên</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-[var(--color-text-muted)]" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] focus:outline-none focus:border-[var(--color-primary-light)] focus:ring-2 focus:ring-[var(--color-primary-pale)] transition-all"
                  placeholder="Ví dụ: Nguyễn Văn A"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Địa chỉ Email</label>
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
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Mật khẩu</label>
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
                  placeholder="Tối thiểu 6 ký tự"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Xác nhận mật khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-[var(--color-text-muted)]" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[var(--color-border)] rounded-[var(--radius-sm)] focus:outline-none focus:border-[var(--color-primary-light)] focus:ring-2 focus:ring-[var(--color-primary-pale)] transition-all"
                  placeholder="Nhập lại mật khẩu"
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
              {successMsg && !showOtp && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-[var(--color-success)] bg-[var(--color-success-bg)] p-3 rounded-[var(--radius-sm)] text-sm font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading || showOtp}
              type="submit"
              className="w-full mt-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white font-semibold py-3 rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] transition-all flex justify-center"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                "Đăng ký ngay"
              )}
            </motion.button>
          </form>

          <p className="mt-8 text-center md:text-left text-sm text-[var(--color-text-secondary)]">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-semibold text-[var(--color-primary)] hover:underline">
              Đăng nhập
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Left side: Visual (Reversed) */}
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
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 max-w-md p-10"
        >
          <div className="w-12 h-12 bg-white/20 rounded-[var(--radius-md)] flex items-center justify-center mb-6">
            <span className="text-2xl text-white">🏢</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Xây dựng cộng đồng thông minh</h2>
          <p className="text-white/80 text-base leading-relaxed mb-8">
            Nền tảng ApartmentHub kết nối cư dân, ban quản lý và dịch vụ, tạo nên một môi trường sống hiện đại, minh bạch và an toàn tuyệt đối.
          </p>
          <div className="flex gap-4">
            <div className="w-12 h-1 bg-white rounded-full"></div>
            <div className="w-4 h-1 bg-white/30 rounded-full"></div>
            <div className="w-4 h-1 bg-white/30 rounded-full"></div>
          </div>
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
              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-2">Nhập mã OTP</h2>
              <p className="text-[var(--color-text-secondary)] text-sm mb-6">
                Chúng tôi đã gửi 6 chữ số tới <strong>{registeredEmail}</strong>
              </p>

              <div className="flex justify-center gap-2 mb-8">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-reg-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-11 h-12 text-center text-xl font-bold text-[var(--color-primary)] border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-pale)]"
                  />
                ))}
              </div>

              {error && <p className="text-[var(--color-error)] text-sm font-medium mb-4">{error}</p>}
              {successMsg && <p className="text-[var(--color-success)] text-sm font-medium mb-4">{successMsg}</p>}

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-[var(--color-primary)] text-white font-semibold py-3 rounded-[var(--radius-md)] shadow-sm hover:bg-[var(--color-primary-light)] transition-colors flex justify-center"
              >
                {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : "Xác thực tài khoản"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
