import React, { useState } from 'react';
import { X, Lock, Mail, ShieldCheck, KeyRound } from 'lucide-react';
import { Session } from '../types';
import { soundService } from '../services/sound';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (session: Session) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('explorer@bugquest.dev');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundService.playTap();
    setError(null);

    // Validation
    if (!email.includes('@') || !email.includes('.')) {
      setError('รูปแบบอีเมลไม่ถูกต้อง');
      return;
    }
    if (password.length < 4) {
      setError('รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร');
      return;
    }

    setLoading(true);

    // Mock API authentication (matches mock-server/server.js)
    setTimeout(() => {
      setLoading(false);
      if (email === 'explorer@bugquest.dev' && password === '1234') {
        const mockSession: Session = {
          token: `bq_sec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
          user: {
            id: 'user-demo-1',
            name: 'ดร. นที นักกีฏวิทยา',
            email: 'explorer@bugquest.dev'
          }
        };
        onLoginSuccess(mockSession);
        onClose();
      } else {
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง (ใช้บัญชีเดโม: explorer@bugquest.dev / 1234)');
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[1100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-stone-950/80 px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-100">เข้าสู่ระบบนักสำรวจ</h3>
              <p className="text-[11px] text-stone-400">หัวข้อ 8: Authentication & Mobile Security</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-stone-200 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">บัญชีทดสอบสำหรับการนำเสนอ (Demo Credentials):</p>
              <p className="font-mono text-[11px] mt-0.5 text-emerald-200">
                Email: <strong>explorer@bugquest.dev</strong> | Pass: <strong>1234</strong>
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              อีเมลนักสำรวจ
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="explorer@bugquest.dev"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              รหัสผ่าน
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-300">
              {error}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  <span>กำลังตรวจสอบความปลอดภัย...</span>
                </>
              ) : (
                <span>เข้าสู่ระบบและเริ่มสำรวจ</span>
              )}
            </button>
          </div>

          <div className="pt-2 border-t border-stone-800/70 text-[11px] text-stone-400 leading-relaxed">
            🔒 <strong>Mobile Security Spec:</strong> โทเคนจะถูกจัดเก็บใน SecureStore (ไม่ใช่ AsyncStorage แบบ Plaintext) และหมดอายุอัตโนมัติเมื่อครบ 24 ชม.
          </div>
        </form>
      </div>
    </div>
  );
};
