import React from 'react';
import { useUser } from '../context/UserContext';

const Dashboard = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Hello, {user?.firstName}
            </h1>
            <p className="text-gray-600 text-sm">Welcome back</p>
          </div>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.firstName?.[0] || 'U'}
          </div>
        </div>

        {/* Balance Card - Placeholder */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-lg p-6 mb-6 shadow-lg">
          <p className="text-sm opacity-90">Balance</p>
          <h2 className="text-4xl font-bold mt-2">₹ ****</h2>
          <p className="text-sm mt-4 opacity-75">{user?.vpa}</p>
        </div>

        {/* Quick Actions - Placeholder */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="bg-white p-4 rounded-lg shadow text-center hover:shadow-md transition">
            <div className="text-2xl mb-2">📤</div>
            <p className="text-sm font-medium">Send Money</p>
          </button>
          <button className="bg-white p-4 rounded-lg shadow text-center hover:shadow-md transition">
            <div className="text-2xl mb-2">📥</div>
            <p className="text-sm font-medium">Request</p>
          </button>
          <button className="bg-white p-4 rounded-lg shadow text-center hover:shadow-md transition">
            <div className="text-2xl mb-2">📱</div>
            <p className="text-sm font-medium">Scan QR</p>
          </button>
          <button className="bg-white p-4 rounded-lg shadow text-center hover:shadow-md transition">
            <div className="text-2xl mb-2">🏦</div>
            <p className="text-sm font-medium">To Bank</p>
          </button>
        </div>

        {/* Recent Activity - Placeholder */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <p className="text-gray-500 text-sm text-center py-4">No recent transactions</p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto">
        <div className="flex justify-around items-center">
          <button className="flex-1 py-3 text-center text-blue-600 font-medium border-b-2 border-blue-600">
            Home
          </button>
          <button className="flex-1 py-3 text-center text-gray-600 font-medium hover:text-blue-600">
            History
          </button>
          <button className="flex-1 py-3 text-center text-gray-600 font-medium hover:text-blue-600">
            Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
