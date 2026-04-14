import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    password: '',
  });
  const [vpa, setVpa] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Auto-generate VPA based on mobile number
  useEffect(() => {
    if (formData.mobileNumber.length === 10) {
      const generatedVpa = `${formData.mobileNumber}@yourbank`;
      setVpa(generatedVpa);
    } else {
      setVpa('');
    }
  }, [formData.mobileNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.fullName || !formData.mobileNumber || !formData.email || !formData.password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (formData.mobileNumber.length !== 10 || !/^\d{10}$/.test(formData.mobileNumber)) {
      setError('Mobile number must be 10 digits');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.fullName,
          mobile_number: formData.mobileNumber,
          email: formData.email,
          password: formData.password,
          vpa: vpa,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      const data = await response.json();

      const accounts = Array.isArray(data.accounts) && data.accounts.length > 0
        ? data.accounts
        : [{
            id: 'primary',
            name: 'Primary Account',
            vpa: data.vpa || vpa,
          }];

      login({
        id: data.user_id,
        firstName: formData.fullName,
        email: formData.email,
        accounts,
        activeAccountId: accounts[0]?.id || null,
      }, 'user');

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
            <p className="text-gray-600 text-sm mt-2 font-medium">Create Your Account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm animate-pulse">
              <span>{error}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Full Name Input */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-800 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                required
              />
            </div>

            {/* Mobile Number Input */}
            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-semibold text-gray-800 mb-2">
                Mobile Number
              </label>
              <input
                type="text"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                maxLength="10"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                required
              />
            </div>

            {/* VPA Display */}
            {vpa && (
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Your VPA
                </label>
                <div className="w-full px-4 py-3 border-2 border-green-200 bg-green-50 rounded-lg text-gray-800 font-semibold text-sm">
                  {vpa}
                </div>
                <p className="text-xs text-gray-500 mt-1">Auto-generated based on your mobile number</p>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                required
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 mt-6"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              )}
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-500 font-medium">EXISTING USER?</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            className="w-full block text-center bg-gradient-to-r from-gray-100 to-gray-50 text-blue-600 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 border-2 border-gray-200"
          >
            Sign In Instead
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

export default Register;
