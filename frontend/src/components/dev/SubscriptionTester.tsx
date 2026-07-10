import React, { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const SubscriptionTester = () => {
  const [loading, setLoading] = useState(false);

  const activateSubscription = async (planId: string, subscriptionType: string = 'monthly') => {
    setLoading(true);
    try {
      const response = await api.post('/subscriptions/dev-activate', {
        planId,
        subscriptionType
      });
      
      toast.success(`${response.data.subscription.planName} activated successfully!`);
      console.log('Subscription activated:', response.data);
      
      // Refresh the page to update subscription status
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to activate subscription');
      console.error('Subscription activation error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 shadow-lg z-50">
      <h3 className="text-sm font-bold text-yellow-800 mb-2">🚧 Dev Tools</h3>
      <div className="space-y-2">
        <button
          onClick={() => activateSubscription('ignition')}
          disabled={loading}
          className="block w-full text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Activate Ignition Plan
        </button>
        <button
          onClick={() => activateSubscription('momentum')}
          disabled={loading}
          className="block w-full text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Activate Momentum Plan
        </button>
        <button
          onClick={() => activateSubscription('victory')}
          disabled={loading}
          className="block w-full text-xs bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Activate Victory Plan
        </button>
        <button
          onClick={() => {
            // Reset to free plan by cancelling subscription
            api.post('/subscriptions/cancel').then(() => {
              toast.success('Reset to Free Plan');
              setTimeout(() => window.location.reload(), 1000);
            }).catch(() => {
              toast.error('Failed to reset plan');
            });
          }}
          disabled={loading}
          className="block w-full text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
        >
          Reset to Free Plan
        </button>
      </div>
    </div>
  );
};

export default SubscriptionTester;