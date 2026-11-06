import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productsAPI, categoriesAPI } from '../services/api';

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategoryData() {
      try {
        setLoading(true);
        const [catsRes, prodsRes] = await Promise.all([
          categoriesAPI.getCategories(),
          productsAPI.getProducts({ category: slug, limit: 20 }),
        ]);

        if (catsRes.data?.data) {
          const list = catsRes.data.data;
          setAllCategories(list);
          const current = list.find((c) => c.slug === slug);
          setCategory(current || { name: slug.toUpperCase(), description: `Explore all products in ${slug}` });
        }

        if (prodsRes.data?.data) {
          setProducts(prodsRes.data.data.products);
        }
      } catch (err) {
        console.error('Failed to load category products', err);
      } finally {
        setLoading(false);
      }
    }
    loadCategoryData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  return (
    <div className="min-h-screen bg-background pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-secondary">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white capitalize">{category?.name || slug}</span>
      </div>

      {/* Hero Category Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-card p-8 sm:p-14 border border-border flex flex-col justify-end min-h-[260px]">
        {category?.image_url && (
          <img
            src={category.image_url}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.25]"
          />
        )}
        <div className="relative z-10 space-y-3 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-accent-cyan font-heading">
            Curated Domain
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            {category?.name || slug}
          </h1>
          <p className="text-sm text-secondary leading-relaxed font-light">
            {category?.description}
          </p>
        </div>
      </div>

      {/* Category Pills Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {allCategories.map((cat) => (
          <Link
            key={cat.id}
            to={`/category/${cat.slug}`}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              cat.slug === slug
                ? 'bg-accent-purple text-white shadow-neon-purple/40'
                : 'bg-card border border-border text-secondary hover:text-white'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="py-24 flex items-center justify-center text-xs text-secondary gap-3">
          <div className="w-6 h-6 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
          <span>Scanning inventory for {category?.name}...</span>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center glass-card p-8 rounded-3xl space-y-3">
          <h3 className="font-heading font-bold text-lg text-white">No items found in {category?.name}</h3>
          <p className="text-xs text-secondary">Our artisans are curating new drops for this category soon.</p>
          <Link to="/shop" className="inline-block px-6 py-2.5 rounded-xl bg-accent-purple text-white text-xs font-semibold">
            Browse All Products
          </Link>
        </div>
      )}
    </div>
  );
}
