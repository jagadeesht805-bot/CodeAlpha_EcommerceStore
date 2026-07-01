import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Calendar, MapPin, DollarSign, CheckCircle2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const OrderHistory = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_URL}/orders/myorders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to load order history');
        }
        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error loading orders');
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-16 text-center bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <p className="text-red-500 font-semibold mb-4">Error loading order history</p>
        <p className="text-slate-500 text-sm mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-medium"
        >
          Reload Page
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 text-center bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-slate-800 font-bold text-lg mb-2">No Orders Placed Yet</h3>
        <p className="text-slate-500 text-sm mb-6">You haven't placed any orders with AlphaCart yet.</p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
        >
          <span>Explore Products</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8 tracking-tight flex items-center space-x-3">
        <Package className="h-7 w-7 text-primary-600 animate-bounce" />
        <span>Your Order History</span>
      </h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            {/* Header info */}
            <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500 font-medium">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1.5 text-slate-400" />
                  <span>Placed: {new Date(order.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1 text-slate-400" />
                  <span className="font-bold text-slate-800">Total: ${order.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center text-green-600 font-semibold bg-green-50 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  <span>Status: Completed</span>
                </div>
              </div>
              <div className="text-slate-400 text-xs font-mono font-bold">
                Order ID: #{order._id.substring(12).toUpperCase()}
              </div>
            </div>

            {/* Content items */}
            <div className="px-6 py-5 divide-y divide-slate-100">
              <div className="pb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400" />
                  <span>Shipping Address</span>
                </h3>
                <p className="text-slate-600 text-sm">
                  {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                  {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </p>
              </div>

              <div className="pt-4 space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Items Ordered</h3>
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg border border-slate-100"
                      />
                      <div>
                        <p className="text-slate-800 font-bold text-sm line-clamp-1">{item.name}</p>
                        <p className="text-xs text-slate-400">Qty: {item.qty} @ ${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                    <span className="text-slate-900 font-bold text-sm">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
