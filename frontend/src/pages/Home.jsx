import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { Search, RotateCcw, AlertCircle } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [seeding, setSeeding] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error loading products');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const response = await fetch(`${API_URL}/products/seed`, {
        method: 'POST',
      });
      if (response.ok) {
        await fetchProducts();
      } else {
        alert('Failed to seed products');
      }
    } catch (err) {
      console.error(err);
      alert('Error seeding database: ' + err.message);
    } finally {
      setSeeding(false);
    }
  };

  // Get unique categories
  const categories = [...new Set(products.map((p) => p.category))];

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === '' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-indigo-600 rounded-3xl text-white p-8 md:p-12 mb-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-300 via-red-500 to-indigo-900 pointer-events-none"></div>
        <div className="max-w-xl relative z-10">
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
            Discover Tech & Wearables of Tomorrow
          </h1>
          <p className="text-primary-100 text-sm md:text-base mb-6 font-medium">
            Explore our handcrafted catalog of premium electronics, mechanical items, and modern smartwear designed for modern productivity.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setCategory('')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              category === ''
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                category === cat
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product List */}
      {loading ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 p-8 shadow-sm max-w-lg mx-auto">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-slate-800 font-bold text-lg mb-2">Failed to Connect to Server</h3>
          <p className="text-slate-500 text-sm mb-6">
            Make sure your database is running and backend server is started at port 5000.
          </p>
          <button
            onClick={fetchProducts}
            className="inline-flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retry Connection</span>
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 p-8 shadow-sm max-w-lg mx-auto">
          <h3 className="text-slate-800 font-bold text-lg mb-2">No Products in Database</h3>
          <p className="text-slate-500 text-sm mb-6">
            The catalog is currently empty. Click the button below to seed the database with 5 sample products.
          </p>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-medium transition-colors shadow-sm disabled:bg-primary-300"
          >
            {seeding ? 'Seeding Database...' : 'Seed Sample Products'}
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 font-medium">No products match your search/filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
