import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [formData, setFormData] = useState({
    vpa: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vpa: formData.vpa,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();

      const accounts = Array.isArray(data.accounts) && data.accounts.length > 0
        ? data.accounts
        : [{
            id: 'primary',
            name: 'Primary Account',
            vpa: data.vpa,
          }];
      
      login({
        id: data.user_id,
        firstName: data.first_name,
        email: data.email,
        accounts,
        activeAccountId: accounts[0]?.id || null,
      }, 'user');

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Simple decorative elements */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-blue-300 rounded-full opacity-40"></div>
      <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-blue-300 rounded-full opacity-30"></div>
      <div className="absolute bottom-20 left-20 w-2 h-2 bg-blue-300 rounded-full opacity-25"></div>
      <div className="absolute bottom-10 right-16 w-1.5 h-1.5 bg-blue-300 rounded-full opacity-35"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-xl bg-opacity-95">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">UPI</h1>
            <p className="text-gray-600 text-sm mt-2 font-medium">Secure P2P Fund Transfer</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm animate-pulse">
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* VPA or Mobile Number Input */}
            <div>
              <label htmlFor="vpa" className="block text-sm font-semibold text-gray-800 mb-2">
                VPA or Mobile Number
              </label>
              <input
                type="text"
                id="vpa"
                name="vpa"
                value={formData.vpa}
                onChange={handleChange}
                placeholder="mobilenumber@yourbank"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
                Password/PIN
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your PIN"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                required
              />
            </div>

            {/* Forgot PIN Link */}
            <div className="text-right">
              <Link to="#" className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                Forgot PIN?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              )}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-500 font-medium">NEW USER?</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Sign Up Link */}
          <Link
            to="/register"
            className="w-full block text-center bg-gradient-to-r from-gray-100 to-gray-50 text-blue-600 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 border-2 border-gray-200"
          >
            Create New Account
          </Link>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Your data is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
