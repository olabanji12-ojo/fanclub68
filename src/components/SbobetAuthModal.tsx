import React, { useState } from 'react';
import { X, User, Lock, Phone, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Zap } from 'lucide-react';
import { useSbobetStore } from '../stores/sbobetStore';

export const SbobetAuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
    loginUser,
    registerUser,
    loginDemo,
    language
  } = useSbobetStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [referralCode, setReferralCode] = useState('FANCLUB68');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const isVi = language === 'vi';

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setPhoneNumber('');
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleSwitchTab = (tab: 'login' | 'register') => {
    resetForm();
    openAuthModal(tab);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!username.trim()) {
      setErrorMsg(isVi ? 'Vui lòng nhập tên đăng nhập hoặc số điện thoại!' : 'Please enter your username or phone number!');
      return;
    }

    if (!password) {
      setErrorMsg(isVi ? 'Vui lòng nhập mật khẩu của bạn!' : 'Please enter your password!');
      return;
    }

    setSuccessMsg(isVi ? 'Đăng nhập thành công! Đang vào sảnh cược...' : 'Login successful! Redirecting to lobby...');
    setTimeout(() => {
      loginUser(username);
    }, 700);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!username.trim() || username.trim().length < 4) {
      setErrorMsg(isVi ? 'Tên đăng nhập phải có ít nhất 4 ký tự!' : 'Username must be at least 4 characters!');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg(isVi ? 'Mật khẩu phải có ít nhất 6 ký tự!' : 'Password must be at least 6 characters!');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg(isVi ? 'Mật khẩu xác nhận không khớp!' : 'Passwords do not match!');
      return;
    }

    if (!phoneNumber.trim()) {
      setErrorMsg(isVi ? 'Vui lòng nhập số điện thoại để nhận mã OTP xác thực!' : 'Please enter phone number for SMS OTP!');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg(isVi ? 'Bạn cần xác nhận đủ 18 tuổi và đồng ý điều khoản!' : 'You must confirm you are 18+ and accept terms!');
      return;
    }

    setSuccessMsg(isVi ? 'Đăng ký thành công! Chào mừng bạn đến với Fanclub68 SBOBET!' : 'Registration successful! Welcome to Fanclub68 SBOBET!');
    setTimeout(() => {
      registerUser(username, phoneNumber);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 font-sans animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={closeAuthModal}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-gray-200">
        
        {/* SBOBET Header */}
        <div className="bg-[#0B4DA2] text-white px-4 py-3 flex items-center justify-between border-b border-[#0A3E82] shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-[#FFC800] text-sm font-black">3</span>
            <span className="text-lg font-black italic tracking-tighter">SBOBET</span>
            <span className="text-[10px] bg-white/20 text-white font-bold px-1.5 py-0.5 rounded ml-1 uppercase">
              Fanclub68
            </span>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dual Tab Switcher */}
        <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => handleSwitchTab('login')}
            className={`flex-1 py-3 text-center transition-all ${
              authModalTab === 'login'
                ? 'text-[#0B4DA2] bg-white border-b-2 border-[#0B4DA2] shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {isVi ? 'ĐĂNG NHẬP' : 'SIGN IN'}
          </button>

          <button
            type="button"
            onClick={() => handleSwitchTab('register')}
            className={`flex-1 py-3 text-center transition-all ${
              authModalTab === 'register'
                ? 'text-[#0B4DA2] bg-white border-b-2 border-[#0B4DA2] shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {isVi ? 'ĐĂNG KÝ TÀI KHOẢN' : 'REGISTER'}
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 max-h-[80vh] overflow-y-auto">
          
          {/* Error / Success Feedback */}
          {errorMsg && (
            <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. LOGIN FORM */}
          {authModalTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  {isVi ? 'Tên đăng nhập / Số điện thoại' : 'Username or Phone'}
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-gray-400 absolute left-3" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={isVi ? 'Nhập tên đăng nhập...' : 'Enter username...'}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#0B4DA2] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  {isVi ? 'Mật khẩu' : 'Password'}
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isVi ? 'Nhập mật khẩu...' : 'Enter password...'}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-9 pr-10 py-2 text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#0B4DA2] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-[11px] pt-0.5">
                <label className="flex items-center gap-1.5 text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-[#0B4DA2] focus:ring-0 w-3.5 h-3.5"
                  />
                  <span>{isVi ? 'Ghi nhớ đăng nhập' : 'Remember me'}</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert(isVi ? 'Vui lòng liên hệ hỗ trợ viên Telegram/CSKH để khôi phục mật khẩu!' : 'Please contact 24/7 CSKH support to reset password!')}
                  className="text-[#0B4DA2] hover:underline font-semibold"
                >
                  {isVi ? 'Quên mật khẩu?' : 'Forgot password?'}
                </button>
              </div>

              {/* Submit Login Button */}
              <button
                type="submit"
                className="w-full py-2.5 bg-[#1877F2] hover:bg-[#1366D6] text-white font-black text-xs uppercase rounded-lg shadow-md transition-all active:scale-98 flex items-center justify-center gap-1.5 mt-2"
              >
                <span>{isVi ? 'Đăng Nhập Ngay' : 'Sign In Now'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Instant Demo Login Shortcut */}
              <div className="pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setSuccessMsg(isVi ? 'Đăng nhập Demo thành công ($1,000.00 PLAY)!' : 'Logged in as Demo Trader ($1,000.00 PLAY)!');
                    setTimeout(loginDemo, 400);
                  }}
                  className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  <span>{isVi ? 'Đăng nhập nhanh Demo ($1,000.00 PLAY)' : 'Instant Demo Login ($1,000 PLAY)'}</span>
                </button>
              </div>
            </form>
          )}

          {/* 2. REGISTER FORM */}
          {authModalTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  {isVi ? 'Tên đăng nhập (4 - 14 ký tự)' : 'Username (4 - 14 chars)'}
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-gray-400 absolute left-3" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={isVi ? 'Ví dụ: nguyenvana88' : 'e.g. trader88'}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#0B4DA2] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  {isVi ? 'Số điện thoại nhận thưởng' : 'Phone Number'}
                </label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={isVi ? '0901234567' : '+84 901234567'}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#0B4DA2] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    {isVi ? 'Mật khẩu' : 'Password'}
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="******"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#0B4DA2]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    {isVi ? 'Xác nhận' : 'Confirm'}
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="******"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#0B4DA2]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  {isVi ? 'Mã đại lý giới thiệu (Ưu đãi nạp 100%)' : 'Referral / Agent Code'}
                </label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="w-full bg-blue-50/50 border border-blue-200 font-mono font-bold text-xs text-[#0B4DA2] rounded-lg px-3 py-1.5 focus:outline-none"
                />
              </div>

              {/* 18+ Agreement */}
              <label className="flex items-start gap-2 text-[11px] text-gray-600 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded text-[#0B4DA2] focus:ring-0 w-4 h-4 mt-0.5 shrink-0"
                />
                <span>
                  {isVi
                    ? 'Tôi cam kết đã đủ 18 tuổi, đồng ý tuân thủ Điều khoản & Quy chế phòng chống gian lận SBOBET.'
                    : 'I certify that I am 18+ and accept the SBOBET Anti-Fraud Terms of Service.'}
                </span>
              </label>

              {/* Register Action Button */}
              <button
                type="submit"
                className="w-full py-2.5 bg-[#FFC800] hover:bg-[#F0BB00] text-black font-black text-xs uppercase rounded-lg shadow-md transition-all active:scale-98 flex items-center justify-center gap-1.5 mt-2"
              >
                <span>{isVi ? 'Tạo Tài Khoản Ngay' : 'Register Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>

        {/* Footer Guarantee */}
        <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
          <span className="flex items-center gap-1 font-semibold text-blue-900">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>SBOBET 256-Bit SSL Encrypted</span>
          </span>
          <span>Fanclub68 Official</span>
        </div>

      </div>
    </div>
  );
};
