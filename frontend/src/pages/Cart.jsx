import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, updateQty, removeFromCart, cartTotal } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      // Send to login, which will redirect to checkout after successful sign in
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 text-center bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <ShoppingBag className="h-16 w-16 text-slate-300 mx-auto mb-4 animate-bounce" />
        <h3 className="text-slate-800 font-bold text-lg mb-2">Your Cart is Empty</h3>
        <p className="text-slate-500 text-sm mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
        >
          <span>Start Shopping</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8 tracking-tight">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm"
            >
              {/* Product Thumbnail & Title */}
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl bg-slate-50 border border-slate-100"
                />
                <div>
                  <Link
                    to={`/product/${item._id}`}
                    className="text-slate-800 font-bold hover:text-primary-600 transition-colors line-clamp-1 text-sm sm:text-base"
                  >
                    {item.name}
                  </Link>
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full inline-block mt-1">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Price & Quantity & Remove */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                {/* Quantity Editor */}
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1">
                  <button
                    onClick={() => updateQty(item._id, item.qty - 1)}
                    disabled={item.qty <= 1}
                    className="p-1 hover:bg-white text-slate-500 disabled:opacity-30 rounded-lg transition-colors"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="px-3 font-semibold text-slate-800 text-sm w-8 text-center">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item._id, item.qty + 1)}
                    disabled={item.qty >= item.countInStock}
                    className="p-1 hover:bg-white text-slate-500 disabled:opacity-30 rounded-lg transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right min-w-[70px]">
                  <span className="text-slate-900 font-bold text-sm sm:text-base">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4">
            Order Summary
          </h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-slate-500 text-sm">
              <span>Items Total</span>
              <span className="font-semibold text-slate-800">
                {cartItems.reduce((acc, item) => acc + item.qty, 0)}
              </span>
            </div>
            <div className="flex justify-between text-slate-500 text-sm">
              <span>Shipping</span>
              <span className="font-semibold text-green-600">Free</span>
            </div>
            <div className="flex justify-between text-slate-950 font-black text-lg border-t border-slate-50 pt-3">
              <span>Total Price</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-sm hover:shadow-md active:scale-[0.99] flex items-center justify-center space-x-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
