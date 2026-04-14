import React from 'react';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Simple decorative elements */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-blue-300 rounded-full opacity-40"></div>
      <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-blue-300 rounded-full opacity-30"></div>
      <div className="absolute bottom-20 left-20 w-2 h-2 bg-blue-300 rounded-full opacity-25"></div>
      <div className="absolute bottom-10 right-16 w-1.5 h-1.5 bg-blue-300 rounded-full opacity-35"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Header with Back Button */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2.5 bg-white border-2 border-blue-200 rounded-lg text-blue-600 font-semibold hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-md"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            History
          </h1>
        </div>
        
        {/* Filter Bar */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full text-sm font-semibold whitespace-nowrap shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
            All
          </button>
          <button className="px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 rounded-full text-sm font-semibold whitespace-nowrap hover:bg-gray-50 transition-all">
            Sent
          </button>
          <button className="px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 rounded-full text-sm font-semibold whitespace-nowrap hover:bg-gray-50 transition-all">
            Received
          </button>
          <button className="px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 rounded-full text-sm font-semibold whitespace-nowrap hover:bg-gray-50 transition-all">
            Failed
          </button>
        </div>

        {/* History List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-12 text-center">
            <p className="text-gray-700 font-semibold text-lg">No Transactions Yet</p>
            <p className="text-gray-500 text-sm mt-2">Your transaction history will appear here</p>
            <button className="mt-6 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              Send Money Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
