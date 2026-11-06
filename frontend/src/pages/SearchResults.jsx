import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../services/api';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function executeSearch() {
      if (!query.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await productsAPI.getProducts({ search: query, limit: 20 });
        if (res.data?.data) {
          setProducts(res.data.data.products);
        }
      } catch (err) {
        console.error('Search query failed', err);
      } finally {
        setLoading(false);
      }
    }
    executeSearch();
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setSearchParams({ q: searchInput.trim() });
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Search Header */}
      <div className="border-b border-border/60 pb-8 space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-accent-cyan font-heading">
          Catalog Search Query
        </span>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
          Results for <span className="text-gradient">"{query}"</span>
        </h1>
        <p className="text-xs text-secondary">Found {products.length} matching verified artifacts</p>

        {/* Refined Search Bar */}
        <form onSubmit={handleSubmit} className="relative max-w-xl pt-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products by title, spec, or tag..."
            className="w-full px-4 py-3 bg-card border border-border rounded-xl text-xs sm:text-sm text-white placeholder-secondary/50 focus:outline-none focus:border-accent-purple pr-12"
          />
          <button
            type="submit"
            className="absolute right-2 top-3 bottom-2 px-3 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-lg flex items-center justify-center transition-all"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="py-24 flex items-center justify-center text-xs text-secondary gap-3">
          <div className="w-6 h-6 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
          <span>Searching neural catalog...</span>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center glass-card p-10 rounded-3xl space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto text-secondary">
            <Search className="w-7 h-7 opacity-40" />
          </div>
          <h3 className="font-heading font-bold text-lg text-white">No Direct Matches</h3>
          <p className="text-xs text-secondary leading-relaxed font-light">
            We couldn't find artifacts matching "{query}". Try checking your spelling or searching for a broader term like 'headphones', 'watch', or 'drone'.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="px-6 py-2.5 rounded-xl bg-accent-purple text-white text-xs font-semibold inline-flex items-center gap-2 shadow-neon-purple/30"
            >
              <span>Explore Complete Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
