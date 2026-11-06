import React from 'react';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      <div className="border-b border-border/60 pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-accent-cyan font-heading flex items-center gap-2">
          <FileText className="w-4 h-4" /> Operational Charter
        </span>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mt-1">
          Terms of Engagement & White Glove Warranty
        </h1>
        <p className="text-xs text-secondary mt-1">Effective November 2026</p>
      </div>

      <div className="p-8 rounded-3xl glass-card space-y-6 text-xs sm:text-sm text-secondary font-light leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-white">1. Scope of Engagement</h2>
          <p>
            By accessing the NOVA STORE platform or placing orders through our verified checkout, you consent to these Terms of Engagement. All technological hardware items are offered subject to real-time inventory allocation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-white">2. Two-Year White Glove Warranty</h2>
          <p>
            Every physical hardware artifact purchased through NOVA STORE includes a complimentary 24-month manufacturer warranty against acoustic, mechanical, or structural material defects. Cryogenic inspection and repair are provided at no additional charge.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-white">3. Thirty-Day Unconditional Return Policy</h2>
          <p>
            If your acquisition fails to meet your aesthetic expectations, return authorization may be requested within 30 days of confirmed delivery, provided items are returned in original packaging with all accompanying telemetry certificates.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-white">4. Governing Law</h2>
          <p>
            These conditions are governed by international commercial arbitration standards and the laws of the Republic of India.
          </p>
        </section>
      </div>
    </div>
  );
}
