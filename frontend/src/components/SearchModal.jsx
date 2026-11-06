import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { productsAPI } from '../services/api';
import { useUI } from '../context/UIContext';

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen } = useUI();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await productsAPI.getProducts({ search: query, limit: 6 });
        if (res.data && res.data.data) {
          setResults(res.data.data.products);
        }
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isSearchOpen) return null;

  const handleSelect = (slug) => {
    setIsSearchOpen(false);
    navigate(`/product/${slug}`);
  };

  const handleFullSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsSearchOpen(false)}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      <div className="relative w-full max-w-2xl bg-secondary-bg border border-border rounded-2xl shadow-2xl overflow-hidden z-10 glass-panel animate-fadeIn">
        {/* Search Input Bar */}
        <form onSubmit={handleFullSearch} className="flex items-center px-4 py-3.5 border-b border-border">
          <Search className="w-5 h-5 text-accent-cyan mr-3" />
          <input
            type="text"
            autoFocus
            placeholder="Search extraordinary hardware, audio, wearables..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white placeholder-secondary/50 text-sm focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-secondary hover:text-white mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-secondary bg-card border border-border rounded-md">
            ESC
          </kbd>
        </form>

        {/* Quick Tags */}
        <div className="px-4 py-2.5 bg-card/40 border-b border-border flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-secondary/60 text-[11px] font-medium shrink-0">Popular:</span>
          {['Spatial Audio', 'Damascus Chronograph', '4K Drone', 'Tech Jacket', 'Levitating Orb'].map(
            (tag, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setQuery(tag)}
                className="px-2.5 py-1 rounded-lg bg-background hover:bg-accent-purple/20 border border-border text-[11px] text-secondary hover:text-white transition-all shrink-0"
              >
                {tag}
              </button>
            )
          )}
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="py-10 text-center text-secondary text-xs flex items-center justify-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
              Searching live catalog...
            </div>
          ) : results.length > 0 ? (
            results.map((p) => (
              <div
                key={p.id}
                onClick={() => handleSelect(p.slug)}
                className="p-3 rounded-xl bg-card/60 hover:bg-card border border-border hover:border-accent-purple/50 flex items-center justify-between cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80'}
                    alt={p.name}
                    className="w-11 h-11 rounded-lg object-cover bg-background shrink-0"
                  />
                  <div>
                    <h4 className="font-heading font-semibold text-xs sm:text-sm text-white group-hover:text-accent-cyan transition-colors">
                      {p.name}
                    </h4>
                    <p className="text-[11px] text-secondary line-clamp-1">{p.short_description || p.brand}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <span className="font-heading font-bold text-xs sm:text-sm text-gradient">
                    ₹{(p.discount_price || p.price).toLocaleString('en-IN')}
                  </span>
                  <ArrowRight className="w-4 h-4 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))
          ) : query ? (
            <div className="py-12 text-center text-secondary text-xs">
              <p>No luxury hardware matched "{query}".</p>
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false);
                  navigate('/shop');
                }}
                className="mt-3 text-accent-cyan underline text-xs font-medium"
              >
                Explore complete catalog
              </button>
            </div>
          ) : (
            <div className="py-8 text-center text-secondary/60 text-xs">
              Type to search items across all 6 luxury categories.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
