import React from 'react';
import { Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      <div className="border-b border-border/60 pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-accent-cyan font-heading flex items-center gap-2">
          <Shield className="w-4 h-4" /> Legal Disclosures
        </span>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mt-1">
          Privacy Policy & Cryptographic Data Rights
        </h1>
        <p className="text-xs text-secondary mt-1">Last revised: November 2026</p>
      </div>

      <div className="p-8 rounded-3xl glass-card space-y-6 text-xs sm:text-sm text-secondary font-light leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-white">1. Zero-Knowledge Information Architecture</h2>
          <p>
            NOVA STORE enforces end-to-end encryption across all client communications and financial settlements. We never sell, rent, or trade your personal or acquisition data to third-party marketing brokers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-white">2. Payment Integrity with Razorpay</h2>
          <p>
            We do not store your complete card details, CVV numbers, or banking credentials on our database servers. All payment transactions are tokenized and settled via Razorpay's PCI-DSS Level 1 compliant gateway with HMAC-SHA256 signature verification.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-white">3. Grounded AI Concierge Confidentiality</h2>
          <p>
            Interactions with the NOVA AI Shopping Assistant are anonymized and processed solely to parse catalog queries and recommendations. No personally identifiable telemetry is fed into public foundational training models.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-white">4. Your Global Rights (GDPR & CCPA)</h2>
          <p>
            Clients possess the absolute right to request an export of their stored profile, addresses, and order history, or request full ledger erasure by submitting a formal notice to <span className="text-accent-cyan">privacy@novastore.com</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
