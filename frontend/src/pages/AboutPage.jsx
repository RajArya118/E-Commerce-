import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, Cpu, Sparkles, ArrowRight, Compass } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* Hero Narrative */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-accent-cyan font-heading">
          The NOVA Manifesto
        </span>
        <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-tight">
          Beyond Shopping. <br />
          <span className="text-gradient">Experience Innovation.</span>
        </h1>
        <p className="text-sm sm:text-base text-secondary font-light leading-relaxed">
          NOVA STORE was founded on an uncompromising principle: technology should transcend consumer utility to become an enduring work of architectural art.
        </p>
      </div>

      {/* Philosophy Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl glass-card space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-accent-purple/20 text-accent-purple flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-xl text-white">Aerospace Metallurgy</h3>
          <p className="text-xs sm:text-sm text-secondary font-light leading-relaxed">
            We forge exclusively with Grade 5 Damascus titanium, cryogenic beryllium diaphragms, and graphene micro-threads. Zero plastic compromise.
          </p>
        </div>

        <div className="p-8 rounded-3xl glass-card space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-accent-cyan/20 text-accent-cyan flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-xl text-white">Grounded Neural Intelligence</h3>
          <p className="text-xs sm:text-sm text-secondary font-light leading-relaxed">
            Our autonomous shopping concierge leverages LLM architectures strictly grounded in live inventory telemetry, ensuring 100% truthful curation.
          </p>
        </div>

        <div className="p-8 rounded-3xl glass-card space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-accent-purple/20 text-accent-purple flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-xl text-white">Zero-Trust Cryptography</h3>
          <p className="text-xs sm:text-sm text-secondary font-light leading-relaxed">
            Every transaction is verified server-side with HMAC-SHA256 signature chains, backed by Razorpay enterprise payment gateways.
          </p>
        </div>
      </div>

      {/* Creative Design References Callout */}
      <div className="p-8 sm:p-12 rounded-3xl glass-card border border-border space-y-4 text-center max-w-4xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-accent-cyan font-heading">
          Aesthetic Lineage
        </span>
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white">
          Inspired by SeaCat & ICON Cinematic Visuals
        </h2>
        <p className="text-xs sm:text-sm text-secondary leading-relaxed font-light max-w-2xl mx-auto">
          Drawing from the visual luxury of SeaCat by Rossinavi and the fluid scroll-driven storytelling of ICON x Khaby Lame, NOVA STORE synthesizes obsidian glassmorphism, 60 FPS inertia, and holographic Three.js canvases.
        </p>
        <div className="pt-4">
          <Link
            to="/shop"
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-black font-semibold text-xs inline-flex items-center gap-2 shadow-neon-purple/40"
          >
            <span>Explore the Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
