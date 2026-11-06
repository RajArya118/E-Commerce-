import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useUI } from '../context/UIContext';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const { showToast } = useUI();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill out all required fields', 'error');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
      showToast('Concierge inquiry dispatched successfully', 'success');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-accent-cyan font-heading">
          Direct Inquiries
        </span>
        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
          Client Concierge Desk
        </h1>
        <p className="text-sm text-secondary font-light">
          Our international hardware specialists and bespoke design curators are on call 24 hours a day.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl glass-card space-y-4">
            <h3 className="font-heading font-bold text-lg text-white">Global Headquarters</h3>
            <div className="space-y-4 text-xs text-secondary">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-heading">NOVA Quantum Hub</strong>
                  <span>100 Quantum Way, Innovation District, Bengaluru, Karnataka 560100, India</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent-purple shrink-0" />
                <span>concierge@novastore.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent-cyan shrink-0" />
                <span>+91-800-555-0199 / +1-415-555-0199</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl glass-card space-y-3 text-xs text-secondary">
            <h4 className="font-heading font-bold text-sm text-white">Bespoke Commissioning</h4>
            <p className="leading-relaxed">
              For custom Damascus finishes, bulk enterprise installations, or press inquiries, please mention your corporate charter in your brief.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 p-8 rounded-3xl glass-card border border-border">
          {sent ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="font-heading font-bold text-xl text-white">Inquiry Dispatched</h3>
              <p className="text-xs text-secondary max-w-sm mx-auto">
                Thank you for contacting NOVA Concierge. A dedicated specialist will reach out to <strong className="text-white">{email}</strong> within four hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-secondary font-medium">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Aether Vance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-accent-purple"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-secondary font-medium">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="client@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-accent-purple"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-secondary font-medium">Inquiry Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Hardware Specifications or Custom Finish Inquiry"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-accent-purple"
                />
              </div>

              <div className="space-y-1">
                <label className="text-secondary font-medium">Message Details *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Describe your inquiry..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-accent-purple resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-black font-semibold text-xs flex items-center justify-center gap-2 hover:opacity-95 shadow-neon-purple/40 transition-all"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit to Concierge</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
