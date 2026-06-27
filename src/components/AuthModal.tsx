import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, LogIn, UserPlus } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ غير متوقع');
      }

      if (isLogin) {
        localStorage.setItem('khatfa_token', data.token);
        localStorage.setItem('khatfa_email', email);
        onSuccess();
        onClose();
      } else {
        setIsLogin(true); // switch to login after successful register
        alert('تم التسجيل بنجاح! قم بتسجيل الدخول الآن.');
        setPassword('');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md bg-[#0b0b0b] rounded-3xl border border-[#2a2a2a] shadow-2xl p-6 overflow-hidden"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-full text-[#a8a8a8] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-8 pt-4">
            <h2 className="text-2xl font-black text-white mb-2">
              {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
            </h2>
            <p className="text-[#a8a8a8] text-sm">
              {isLogin ? 'مرحباً بعودتك! سجل دخولك للمتابعة.' : 'انضم إلينا اليوم للوصول لمنتجاتنا المميزة.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-xl mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6a6a6a]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="البريد الإلكتروني"
                  className="w-full bg-[#111111] border border-[#2a2a2a] rounded-xl pl-4 pr-12 py-3 text-white placeholder:text-[#6a6a6a] focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6a6a6a]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="كلمة المرور"
                  className="w-full bg-[#111111] border border-[#2a2a2a] rounded-xl pl-4 pr-12 py-3 text-white placeholder:text-[#6a6a6a] focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : isLogin ? (
                <>
                  <LogIn className="w-5 h-5" />
                  تسجيل الدخول
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  إنشاء حساب
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#a8a8a8] hover:text-white text-sm transition-colors"
            >
              {isLogin ? 'ليس لديك حساب؟ قم بإنشاء حساب جديد' : 'لديك حساب بالفعل؟ سجل الدخول'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
