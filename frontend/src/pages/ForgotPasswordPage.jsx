import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authAPI } from '../services/api';
import { useUI } from '../context/UIContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [dispatched, setDispatched] = useState(false);
  const { showToast } = useUI();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      setLoading(true);
      await authAPI.forgotPassword({ email });
      setDispatched(true);
      showToast('Recovery token generated and sent to email', 'success');
    } catch (err) {
      showToast('Failed to dispatch recovery instruction', 'error');
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
            Reset Account Cipher
          </h1>
          <p className="text-xs text-secondary">
            Enter the authorized account email to generate a cryptographic recovery link.
          </p>
        </div>

        {dispatched ? (
          <div className="p-8 rounded-3xl glass-card text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="font-heading font-bold text-lg text-white">Transmission Sent</h3>
            <p className="text-xs text-secondary leading-relaxed">
              We have dispatched cryptographic recovery instructions to <strong className="text-white">{email}</strong>. Please review your inbox.
            </p>
            <div className="pt-2">
              <Link
                to="/reset-password?token=sample_demo_token"
                className="px-6 py-2.5 rounded-xl bg-accent-purple text-white text-xs font-semibold inline-block"
              >
                Proceed to Reset Form
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 rounded-3xl glass-card space-y-4">
            <div className="space-y-1.5 text-xs">
              <label className="text-secondary font-medium">Registered Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-secondary/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="client@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  <span>Dispatch Recovery Instructions</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-xs text-secondary hover:text-white inline-flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
