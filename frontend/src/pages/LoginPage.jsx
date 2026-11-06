import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-20 px-4 flex items-center justify-center relative overflow-hidden">
      {/* Ambient Halos */}
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-accent-purple/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10 animate-fadeIn">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-purple to-accent-cyan p-[1.5px]">
              <div className="w-full h-full bg-secondary-bg rounded-[6px] flex items-center justify-center font-heading font-extrabold text-sm text-white">
                N
              </div>
            </div>
            <span className="font-heading font-bold text-lg text-white">NOVA STORE</span>
          </Link>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
            Access Your Terminal
          </h1>
          <p className="text-xs text-secondary">
            Zero-trust authenticated access to your luxury consignments.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 rounded-3xl glass-card space-y-4">
          <div className="space-y-1.5 text-xs">
            <label className="text-secondary font-medium">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-secondary/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-white placeholder-secondary/50 focus:outline-none focus:border-accent-purple text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <label className="text-secondary font-medium">Password</label>
              <Link to="/forgot-password" className="text-accent-cyan hover:underline text-[11px]">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-secondary/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-white placeholder-secondary/50 focus:outline-none focus:border-accent-purple text-xs sm:text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-black font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-40 shadow-neon-purple/30 transition-all pt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Terminal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-xs text-secondary pt-2">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-white hover:text-accent-cyan font-semibold">
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
