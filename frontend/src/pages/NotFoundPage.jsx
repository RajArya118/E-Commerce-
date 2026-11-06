import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, Home, Sparkles } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-4 flex items-center justify-center relative overflow-hidden text-center">
      {/* Ambient Void Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-purple/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md mx-auto space-y-6 relative z-10 glass-card p-10 rounded-3xl border border-border animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-card border border-border text-accent-cyan flex items-center justify-center mx-auto shadow-neon-cyan/20">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-accent-purple font-heading">
            Coordinates Uncharted
          </span>
          <h1 className="font-heading font-extrabold text-6xl sm:text-7xl text-gradient">
            404
          </h1>
          <h2 className="font-heading font-bold text-lg text-white">Quantum Void Detected</h2>
          <p className="text-xs text-secondary leading-relaxed font-light">
            The requested subspace sector does not contain active hardware artifacts. Return to calibrated coordinates.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-black font-semibold text-xs flex items-center justify-center gap-2 shadow-neon-purple/30 hover:scale-105 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Station</span>
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-card hover:bg-white/10 text-white border border-border text-xs font-semibold flex items-center justify-center gap-2"
          >
            <span>Explore Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
