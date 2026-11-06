import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { authAPI } from '../services/api';
import { useUI } from '../context/UIContext';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || 'demo_token';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useUI();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      setLoading(true);
      await authAPI.resetPassword({ token, new_password: newPassword });
      showToast('Password updated successfully! Please sign in.', 'success');
      navigate('/login');
    } catch (err) {
      showToast('Password update failed. Token may be expired.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-20 px-4 flex items-center justify-center relative overflow-hidden">
      <div className="w-full max-w-md space-y-6 relative z-10 animate-fadeIn">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2 font-heading font-bold text-lg text-white">
            NOVA STORE
          </Link>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
            Establish New Password
          </h1>
          <p className="text-xs text-secondary">
            Provide a new secure encryption passphrase for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 rounded-3xl glass-card space-y-4">
          <div className="space-y-1.5 text-xs">
            <label className="text-secondary font-medium">New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-secondary/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-white placeholder-secondary/50 focus:outline-none focus:border-accent-purple text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="text-secondary font-medium">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-secondary/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                <span>Commit New Cipher</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
