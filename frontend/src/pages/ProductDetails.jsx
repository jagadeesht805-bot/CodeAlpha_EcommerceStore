import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Check, AlertTriangle, Minus, Plus } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const API_URL = 'http://localhost:5000/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/products/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error loading product details');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto my-16 text-center bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-slate-800 font-bold text-lg mb-2">Product Not Found</h3>
        <p className="text-slate-500 text-sm mb-6">{error || 'The requested product does not exist.'}</p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.countInStock <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-slate-500 hover:text-primary-600 font-medium mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Products</span>
      </Link>

      {/* Product Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-sm">
        {/* Product Image */}
        <div className="aspect-video md:aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Meta & Purchase Panel */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="text-primary-600 text-sm font-semibold tracking-wider uppercase mb-2 block">
              {product.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
              {product.name}
            </h1>
            <p className="text-3xl font-black text-slate-950 mb-6">${product.price.toFixed(2)}</p>

            <div className="mb-6">
              <h3 className="text-slate-800 font-semibold mb-2">Description</h3>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                {product.description}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            {/* Stock status badge */}
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-slate-500 text-sm">Status:</span>
              <span
                className={`text-sm font-bold px-3 py-1 rounded-full ${
                  isOutOfStock
                    ? 'bg-red-50 text-red-600'
                    : 'bg-green-50 text-green-600'
                }`}
              >
                {isOutOfStock ? 'Out of Stock' : `In Stock (${product.countInStock} available)`}
              </span>
            </div>

            {!isOutOfStock && (
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-slate-500 text-sm">Quantity:</span>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    disabled={qty <= 1}
                    className="p-1.5 hover:bg-white text-slate-500 disabled:opacity-30 rounded-lg transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 font-semibold text-slate-800 w-12 text-center">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                    disabled={qty >= product.countInStock}
                    className="p-1.5 hover:bg-white text-slate-500 disabled:opacity-30 rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || added}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-bold transition-all shadow-sm ${
                  isOutOfStock
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                    : added
                    ? 'bg-green-600 text-white'
                    : 'bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.99] hover:shadow-md'
                }`}
              >
                {added ? (
                  <>
                    <Check className="h-5 w-5" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
