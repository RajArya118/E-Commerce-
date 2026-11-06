import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  SlidersHorizontal,
  Search,
  Grid,
  List,
  ChevronDown,
  X,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productsAPI, categoriesAPI } from '../services/api';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters state from URL or defaults
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('q') || '';
  const sortParam = searchParams.get('sort_by') || 'popular';
  const minPriceParam = searchParams.get('min_price') || '';
  const maxPriceParam = searchParams.get('max_price') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [sortBy, setSortBy] = useState(sortParam);
  const [priceRange, setPriceRange] = useState({ min: minPriceParam, max: maxPriceParam });
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    categoriesAPI.getCategories().then((res) => {
      if (res.data?.data) setCategories(res.data.data);
    });
  }, []);

  const loadCatalog = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        sort_by: sortBy,
      };
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      if (priceRange.min) params.min_price = priceRange.min;
      if (priceRange.max) params.max_price = priceRange.max;

      const res = await productsAPI.getProducts(params);
      if (res.data?.data) {
        setProducts(res.data.data.products);
        setTotal(res.data.data.total);
        setTotalPages(res.data.data.total_pages);
      }
    } catch (err) {
      console.error('Failed to load shop catalog', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, [page, selectedCategory, sortBy, priceRange.min, priceRange.max]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadCatalog();
  };

  const handleCategoryClick = (slug) => {
    setSelectedCategory(slug === selectedCategory ? '' : slug);
    setPage(1);
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setSortBy('popular');
    setPriceRange({ min: '', max: '' });
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/60 pb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-accent-cyan font-heading">
            Official Catalog
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight mt-1">
            Luxury Hardware & Wearables
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-2 max-w-xl font-light">
            Showing {total} verified technological artifacts across six specialized domains.
          </p>
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
          className="sm:hidden px-4 py-2.5 rounded-xl bg-card border border-border text-white text-xs font-semibold flex items-center justify-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4 text-accent-cyan" />
          <span>Filters & Sort</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filter Sidebar */}
        <aside
          className={`lg:col-span-3 space-y-6 ${
            isFilterDrawerOpen ? 'block' : 'hidden lg:block'
          } p-6 rounded-2xl glass-card border border-border`}
        >
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-accent-purple" /> Filter Catalog
            </h3>
            <button
              onClick={resetFilters}
              className="text-[11px] text-secondary hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Search Box */}
          <div>
            <label className="text-xs font-semibold text-secondary block mb-2">Keyword Search</label>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs text-white placeholder-secondary/50 focus:outline-none focus:border-accent-purple"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-white"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Categories Filter */}
          <div>
            <label className="text-xs font-semibold text-secondary block mb-2.5">Domain Categories</label>
            <div className="space-y-1.5">
              <button
                onClick={() => handleCategoryClick('')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                  !selectedCategory
                    ? 'bg-accent-purple/20 text-white border border-accent-purple/40 font-semibold'
                    : 'text-secondary hover:text-white hover:bg-card/80'
                }`}
              >
                <span>All Disciplines</span>
                <span className="text-[10px] text-secondary/60">({total})</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                    selectedCategory === cat.slug
                      ? 'bg-accent-purple/20 text-white border border-accent-purple/40 font-semibold'
                      : 'text-secondary hover:text-white hover:bg-card/80'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sort By Filter */}
          <div>
            <label className="text-xs font-semibold text-secondary block mb-2">Sort Ordering</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-xs text-white focus:outline-none focus:border-accent-purple"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated (5.0★)</option>
              <option value="newest">Recently Discovered</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="text-xs font-semibold text-secondary block mb-2">Price Bracket (₹)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                className="px-3 py-2 bg-background border border-border rounded-xl text-xs text-white placeholder-secondary/50 focus:outline-none focus:border-accent-purple"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                className="px-3 py-2 bg-background border border-border rounded-xl text-xs text-white placeholder-secondary/50 focus:outline-none focus:border-accent-purple"
              />
            </div>
            <button
              onClick={() => {
                setPage(1);
                loadCatalog();
              }}
              className="w-full mt-2.5 py-2 bg-card hover:bg-white/10 text-white border border-border rounded-xl text-xs font-semibold transition-all"
            >
              Filter by Price
            </button>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-9 space-y-8">
          {/* Active Filter Pills */}
          {(selectedCategory || searchQuery || priceRange.min || priceRange.max) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-secondary/60">Active:</span>
              {selectedCategory && (
                <span className="px-3 py-1 rounded-full bg-accent-purple/20 border border-accent-purple/40 text-accent-purple text-xs flex items-center gap-1.5 font-medium">
                  {selectedCategory}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-white"
                    onClick={() => setSelectedCategory('')}
                  />
                </span>
              )}
              {searchQuery && (
                <span className="px-3 py-1 rounded-full bg-accent-cyan/20 border border-accent-cyan/40 text-accent-cyan text-xs flex items-center gap-1.5 font-medium">
                  "{searchQuery}"
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-white"
                    onClick={() => setSearchQuery('')}
                  />
                </span>
              )}
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3 text-secondary text-xs">
              <div className="w-6 h-6 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
              <span>Calibrating catalog feed...</span>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center glass-card p-12 rounded-3xl space-y-4">
              <h3 className="font-heading font-bold text-lg text-white">No Artifacts Found</h3>
              <p className="text-xs text-secondary max-w-sm mx-auto">
                No products match your current filter parameters. Try clearing your filters or adjusting your price thresholds.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-xl bg-accent-purple text-white text-xs font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-8 border-t border-border flex items-center justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-xl bg-card border border-border text-xs text-secondary hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-xs font-semibold transition-all ${
                    page === i + 1
                      ? 'bg-accent-purple text-white shadow-neon-purple/40'
                      : 'bg-card border border-border text-secondary hover:text-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 rounded-xl bg-card border border-border text-xs text-secondary hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
