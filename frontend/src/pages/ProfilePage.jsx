import React, { useState } from 'react';
import { User, Phone, MapPin, Plus, Shield, Check, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';

export default function ProfilePage() {
  const { user, updateProfile, addAddress } = useAuth();
  const { showToast } = useUI();

  // Profile fields
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Address Modal/Form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressData, setAddressData] = useState({
    label: 'Home Penthouse',
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    is_default: true,
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    await updateProfile({ full_name: fullName, phone });
    setSavingProfile(false);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!addressData.street || !addressData.city || !addressData.postal_code) {
      showToast('Please fill out required address fields', 'error');
      return;
    }
    const res = await addAddress(addressData);
    if (res.success) {
      setShowAddressForm(false);
      setAddressData({
        label: 'Office',
        full_name: user?.full_name || '',
        phone: user?.phone || '',
        street: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India',
        is_default: false,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      <div className="border-b border-border/60 pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-accent-cyan font-heading">
          Identity & Vault
        </span>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mt-1">
          Client Credentials & Addresses
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Personal Details */}
        <div className="p-6 rounded-3xl glass-card space-y-5">
          <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
            <User className="w-5 h-5 text-accent-purple" /> Personal Information
          </h3>

          <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-secondary font-medium">Email Address (Immutable)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 bg-background/50 border border-border/60 rounded-xl text-secondary/60 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-secondary font-medium">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-accent-purple"
              />
            </div>

            <div className="space-y-1">
              <label className="text-secondary font-medium">Contact Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-accent-purple"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-2.5 rounded-xl bg-accent-purple hover:bg-accent-purple/90 text-white font-semibold text-xs transition-all shadow-neon-purple/30"
            >
              {savingProfile ? 'Saving...' : 'Commit Changes'}
            </button>
          </form>
        </div>

        {/* Address Book */}
        <div className="p-6 rounded-3xl glass-card space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent-cyan" /> Registered Addresses
            </h3>
            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="text-xs text-accent-cyan hover:underline flex items-center gap-1 font-medium"
            >
              <Plus className="w-3.5 h-3.5" /> Add Location
            </button>
          </div>

          {/* New Address Form Toggle */}
          {showAddressForm && (
            <form onSubmit={handleAddressSubmit} className="p-4 rounded-2xl bg-card border border-border space-y-3 text-xs animate-fadeIn">
              <p className="font-semibold text-white">Add Delivery Destination</p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Label (e.g. Headquarters)"
                  value={addressData.label}
                  onChange={(e) => setAddressData({ ...addressData, label: e.target.value })}
                  className="px-3 py-2 bg-background border border-border rounded-xl text-white"
                />
                <input
                  type="text"
                  placeholder="Street"
                  required
                  value={addressData.street}
                  onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                  className="px-3 py-2 bg-background border border-border rounded-xl text-white"
                />
                <input
                  type="text"
                  placeholder="City"
                  required
                  value={addressData.city}
                  onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                  className="px-3 py-2 bg-background border border-border rounded-xl text-white"
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  required
                  value={addressData.postal_code}
                  onChange={(e) => setAddressData({ ...addressData, postal_code: e.target.value })}
                  className="px-3 py-2 bg-background border border-border rounded-xl text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-accent-cyan text-black font-semibold text-xs"
              >
                Save Destination
              </button>
            </form>
          )}

          {/* List Saved Addresses */}
          <div className="space-y-3">
            {user?.addresses && user.addresses.length > 0 ? (
              user.addresses.map((a, i) => (
                <div key={i} className="p-4 rounded-2xl bg-card border border-border space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-semibold text-white">{a.label || 'Primary'}</span>
                    {a.is_default && (
                      <span className="text-[10px] text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded-full border border-accent-cyan/20">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-secondary">{a.street}</p>
                  <p className="text-secondary">{a.city}, {a.state} - {a.postal_code}, {a.country}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-secondary text-center py-6">No saved addresses on file.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
