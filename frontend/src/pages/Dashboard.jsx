import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Dashboard = () => {
  const { user, setActiveAccount, addAccount } = useUser();
  const location = useLocation();
  const [creatingType, setCreatingType] = useState('');
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [accountError, setAccountError] = useState('');
  const [accountSuccess, setAccountSuccess] = useState('');

  const accounts = Array.isArray(user?.accounts)
    ? user.accounts
    : [];

  const activeAccountId = String(user?.activeAccountId || accounts[0]?.id || '');
  const activeAccount =
    accounts.find((account) => String(account.id) === activeAccountId) ||
    accounts[0] ||
    null;

  const accountPayloadByType = useMemo(
    () => ({
      personal: {
        account_type: 'personal',
        account_name: 'Personal Account',
      },
      business: {
        account_type: 'business',
        account_name: 'Business Account',
      },
    }),
    []
  );

  const handleAccountChange = (e) => {
    setActiveAccount(e.target.value);
  };

  const createAccount = async (type) => {
    setAccountError('');
    setAccountSuccess('');
    setCreatingType(type);
    setCreatingAccount(true);

    try {
      const accountTemplate = accountPayloadByType[type];
      const response = await fetch('http://localhost:8000/api/accounts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.id,
          ...accountTemplate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to create account');
      }

      const data = await response.json();
      const newAccount = {
        id: data.account_id || data.id || data.vpa,
        name: data.account_name || accountTemplate.account_name,
        vpa: data.vpa,
      };

      if (!newAccount.vpa) {
        throw new Error('API did not return a VPA for the new account');
      }

      addAccount(newAccount);
      setAccountSuccess(`${newAccount.name} created: ${newAccount.vpa}`);
    } catch (err) {
      setAccountError(err.message || 'Account creation failed.');
    } finally {
      setCreatingType('');
      setCreatingAccount(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center relative overflow-hidden">
      {/* Simple decorative elements */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-blue-300 rounded-full opacity-40"></div>
      <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-blue-300 rounded-full opacity-30"></div>
      <div className="absolute bottom-20 left-20 w-2 h-2 bg-blue-300 rounded-full opacity-25"></div>
      <div className="absolute bottom-10 right-16 w-1.5 h-1.5 bg-blue-300 rounded-full opacity-35"></div>

      <div className="max-w-md w-full p-4 relative z-10">
        {/* Top Navigation */}
        <div className="bg-white rounded-lg p-2 shadow mb-4 mt-2">
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/dashboard"
              className={`py-2 text-center rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Home
            </Link>
            <Link
              to="/history"
              className={`py-2 text-center rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/history'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              History
            </Link>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Hello, {user?.firstName}
            </h1>
            <p className="text-gray-600 text-sm mt-1">Welcome back to your account</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
            {user?.firstName?.[0] || 'U'}
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white rounded-2xl p-6 mb-6 shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex justify-between items-start mb-12">
            <div>
              <p className="text-sm opacity-80 font-medium">Available Balance</p>
              <h2 className="text-5xl font-bold mt-3">₹ ****</h2>
            </div>
          </div>

          {accounts.length > 1 ? (
            <div className="mt-6">
              <label className="block text-xs uppercase tracking-wide opacity-70 mb-2 font-semibold">
                Select Account
              </label>
              <select
                value={activeAccountId}
                onChange={handleAccountChange}
                className="w-full bg-blue-700/50 border border-blue-400/30 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
              >
                {accounts.map((account, index) => (
                  <option key={account.id || account.vpa || index} value={account.id || account.vpa}>
                    {account.name || `Account ${index + 1}`} - {account.vpa}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-blue-700/30 rounded-lg px-4 py-3 border border-blue-400/20">
              <span className="text-xs uppercase tracking-wide opacity-70 font-semibold">VPA</span>
              <span className="font-semibold">{activeAccount?.vpa || 'No VPA found'}</span>
            </div>
          )}

          {accounts.length > 1 && (
            <p className="text-xs mt-3 opacity-70 font-medium">Active: {activeAccount?.vpa || 'N/A'}</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <Link
            to="/transfer"
            className="block bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 text-center group"
          >
            <p className="text-sm font-semibold text-gray-800">Send Money</p>
            <p className="text-xs text-gray-500 mt-1">Transfer funds instantly</p>
          </Link>
        </div>

        {/* Create Accounts */}
        <div className="bg-white rounded-2xl p-5 shadow-lg mb-6">
          <h3 className="font-bold text-gray-800 mb-4 text-lg">Create New Account</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => createAccount('personal')}
              disabled={creatingAccount}
              className="px-3 py-3 rounded-lg border-2 border-blue-200 text-sm font-semibold text-blue-600 hover:bg-blue-50 disabled:opacity-50 transition-all duration-300"
            >
              {creatingType === 'personal' && creatingAccount ? 'Creating...' : 'Personal'}
            </button>
            <button
              type="button"
              onClick={() => createAccount('business')}
              disabled={creatingAccount}
              className="px-3 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 text-sm font-semibold text-white hover:shadow-lg disabled:opacity-50 transition-all duration-300"
            >
              {creatingType === 'business' && creatingAccount ? 'Creating...' : 'Business'}
            </button>
          </div>
          {accountError && (
            <p className="text-sm text-red-600 mt-3 px-3 py-2 bg-red-50 rounded-lg">{accountError}</p>
          )}
          {accountSuccess && (
            <p className="text-sm text-green-600 mt-3 px-3 py-2 bg-green-50 rounded-lg">{accountSuccess}</p>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <h3 className="font-bold text-gray-800 mb-4 text-lg">Recent Activity</h3>
          <div className="space-y-3">
            <p className="text-gray-500 text-sm text-center py-8">No recent transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
