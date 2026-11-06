import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Phone, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Password strength calculation
  const getStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };
  const strengthScore = getStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return;
    setLoading(true);
    const res = await register(fullName, email, password, phone);
    setLoading(false);
    if (res.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-20 px-4 flex items-center justify-center relative overflow-hidden">
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-accent-cyan/15 rounded-full blur-[120px] pointer-events-none" />

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
            Create Client Profile
          </h1>
          <p className="text-xs text-secondary">
            Join the inner circle for bespoke concierge curation and priority drops.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 rounded-3xl glass-card space-y-4">
          <div className="space-y-1.5 text-xs">
            <label className="text-secondary font-medium">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-secondary/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Elena Rostova"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-white placeholder-secondary/50 focus:outline-none focus:border-accent-purple text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="text-secondary font-medium">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-secondary/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="elena@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-white placeholder-secondary/50 focus:outline-none focus:border-accent-purple text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="text-secondary font-medium">Telephone (Optional)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-secondary/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="+91-98765-43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-white placeholder-secondary/50 focus:outline-none focus:border-accent-purple text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="text-secondary font-medium">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-secondary/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-white placeholder-secondary/50 focus:outline-none focus:border-accent-purple text-xs sm:text-sm"
              />
            </div>

            {/* Password Strength Meter */}
            {password && (
              <div className="space-y-1 pt-1.5">
                <div className="flex gap-1 h-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`flex-1 rounded-full transition-all ${
                        step <= strengthScore
                          ? strengthScore >= 3
                            ? 'bg-emerald-400'
                            : 'bg-amber-400'
                          : 'bg-border'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-secondary">
                  {strengthScore <= 1 ? 'Weak' : strengthScore <= 3 ? 'Moderate' : 'Strong Cipher'}
                </p>
              </div>
            )}
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
                <span>Initialize Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-xs text-secondary pt-2">
            Already registered?{' '}
            <Link to="/login" className="text-white hover:text-accent-cyan font-semibold">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
