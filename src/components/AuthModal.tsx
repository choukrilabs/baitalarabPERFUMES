import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { X, Mail, Lock, User, Phone, LogIn, UserPlus, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialTab = 'login' }) => {
  const { loginWithGoogle, loginWithEmail, registerWithEmail, resetPassword } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgot'>(initialTab);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('مرحباً بك! تم تسجيل الدخول بنجاح عبر جوجل');
      onClose();
      resetForm();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('تم إغلاق نافذة تسجيل الدخول.');
      } else {
        setErrorMsg('فشل تسجيل الدخول عبر جوجل، يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    try {
      await loginWithEmail(email, password);
      toast.success('مرحباً بك مجدداً! تم تسجيل الدخول بنجاح');
      onClose();
      resetForm();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMsg('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } else if (err.code === 'auth/too-many-requests') {
        setErrorMsg('تم حظر المحاولات مؤقتاً لكثرة المحاولات الخاطئة. يرجى الانتظار قليلاً.');
      } else {
        setErrorMsg('حدث خطأ أثناء تسجيل الدخول: ' + (err.message || 'يرجى التأكد من البيانات'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!name || !email || !password) {
      setErrorMsg('يرجى ملء جميع الحقول الإلزامية');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('كلمة المرور يجب أن لا تقل عن 6 أحرف');
      return;
    }

    setLoading(true);
    try {
      await registerWithEmail(email, password, name, phone);
      toast.success(`أهلاً بك يا ${name}! تم إنشاء حسابك بنجاح`);
      onClose();
      resetForm();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('هذا البريد الإلكتروني مسجل مسبقاً، يمكنك تسجيل الدخول');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMsg('البريد الإلكتروني غير صالح');
      } else {
        setErrorMsg('تعذر إنشاء الحساب: ' + (err.message || ''));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!email) {
      setErrorMsg('يرجى إدخال بريدك الإلكتروني');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setSuccessMsg('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني بنجاح!');
      toast.info('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setErrorMsg('لم يتم العثور على حساب مرتبط بهذا البريد الإلكتروني');
      } else {
        setErrorMsg('حدث خطأ أثناء إرسال الرابط، يرجى المحاولة لاحقاً');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-200"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header with Pattern */}
        <div className="bg-[#1A1A1A] p-6 text-white text-center relative overflow-hidden">
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="absolute top-4 left-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-full gold-gradient p-0.5 mx-auto mb-3 shadow-lg flex items-center justify-center">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#1A1A1A] flex items-center justify-center">
              <User className="w-6 h-6 text-[#8C7342]" />
            </div>
          </div>

          <h3 className="font-display font-bold text-xl text-white">
            {activeTab === 'login' && 'تسجيل الدخول'}
            {activeTab === 'signup' && 'إنشاء حساب جديد'}
            {activeTab === 'forgot' && 'استعادة كلمة المرور'}
          </h3>
          <p className="text-xs text-[#8C7342] mt-1 font-medium">
            متجر عطور بيت العرب | حي الحبوس
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-3 text-center transition-all ${
              activeTab === 'login'
                ? 'bg-white text-[#8C7342] border-b-2 border-[#8C7342]'
                : 'text-gray-500 hover:text-[#1A1A1A]'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-3 text-center transition-all ${
              activeTab === 'signup'
                ? 'bg-white text-[#8C7342] border-b-2 border-[#8C7342]'
                : 'text-gray-500 hover:text-[#1A1A1A]'
            }`}
          >
            حساب جديد
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 space-y-4">
          {/* Error / Success feedback */}
          {errorMsg && (
            <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-green-50 text-green-700 p-3 rounded-xl text-xs flex items-center gap-2 border border-green-200">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google Login Button */}
          {activeTab !== 'forgot' && (
            <>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white hover:bg-gray-50 text-[#1A1A1A] border border-gray-300 py-2.5 px-4 rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-3 transition-all hover:border-gray-400 disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>المتابعة باستخدام حساب Google</span>
              </button>

              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-[11px] text-gray-400 font-medium">أو عبر البريد الإلكتروني</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
            </>
          )}

          {/* Tab 1: Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleEmailLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#8C7342] focus:bg-white rounded-xl pr-10 pl-3 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#8C7342]"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700">كلمة المرور</label>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('forgot');
                      setErrorMsg('');
                    }}
                    className="text-[11px] text-[#8C7342] hover:underline"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#8C7342] focus:bg-white rounded-xl pr-10 pl-3 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#8C7342]"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1A1A1A] hover:bg-[#8C7342] text-white py-3 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50 mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'جاري التحقق...' : 'تسجيل الدخول'}</span>
              </button>
            </form>
          )}

          {/* Tab 2: Signup Form */}
          {activeTab === 'signup' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: يوسف الإدريسي"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#8C7342] focus:bg-white rounded-xl pr-10 pl-3 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#8C7342]"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  رقم الهاتف (للتوصيل)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="06 XX XX XX XX"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#8C7342] focus:bg-white rounded-xl pr-10 pl-3 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#8C7342]"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#8C7342] focus:bg-white rounded-xl pr-10 pl-3 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#8C7342]"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  كلمة المرور (6 أحرف على الأقل) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#8C7342] focus:bg-white rounded-xl pr-10 pl-3 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#8C7342]"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1A1A1A] hover:bg-[#8C7342] text-white py-3 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50 mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}</span>
              </button>
            </form>
          )}

          {/* Tab 3: Forgot Password Form */}
          {activeTab === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-3">
              <p className="text-xs text-gray-500 leading-relaxed">
                أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطاً لإعادة تعيين كلمة المرور الخاصة بك.
              </p>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#8C7342] focus:bg-white rounded-xl pr-10 pl-3 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#8C7342]"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1A1A1A] hover:bg-[#8C7342] text-white py-3 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50 mt-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>{loading ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="w-full text-center text-xs text-gray-500 hover:text-[#1A1A1A] pt-2 underline"
              >
                العودة إلى تسجيل الدخول
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
