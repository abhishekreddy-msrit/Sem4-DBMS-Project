import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { requestJson } from '../lib/api';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const { showError, showSuccess } = useToast();
  const [formData, setFormData] = useState({
    mobileNumber: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = name === 'mobileNumber' ? value.replace(/\D/g, '').slice(0, 10) : value;
    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      showError('Mobile number must be 10 digits');
      return;
    }

    setLoading(true);

    try {
      const data = await requestJson('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          identifier: formData.mobileNumber,
          password: formData.password,
        }),
      });

      const accounts = Array.isArray(data.accounts) && data.accounts.length > 0
        ? data.accounts
        : data.vpa
          ? [{
              id: 'primary',
              name: 'Primary Account',
              vpa: data.vpa,
            }]
          : [];
      
      login({
        id: data.user_id,
        displayName: data.mobile_number || formData.mobileNumber,
        mobileNumber: data.mobile_number || formData.mobileNumber,
        accounts,
        activeAccountId: data.active_account_id || accounts[0]?.id || null,
      }, 'user');

      showSuccess('Logged in successfully! Redirecting...');
      navigate('/dashboard');
    } catch {
      showError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell grid place-items-center">
      <div className="page-enter w-full max-w-xl">
        <section className="ui-panel p-6 text-left sm:p-8">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">Welcome back</p>
            <h2 className="ui-title mt-2 text-3xl">Sign in</h2>
            <p className="ui-subtle mt-2 text-sm">Use your mobile number to continue.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="mobileNumber" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Mobile Number
              </label>
              <div className="ui-dial-input">
                <span className="ui-dial-prefix">+91</span>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  className="ui-dial-field"
                  required
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-xs font-semibold text-cyan-700"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="ui-input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-brand mt-2 flex w-full items-center justify-center gap-2 px-4 py-3"
            >
              {loading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="my-6 h-px bg-slate-200" />

          <Link to="/register" className="btn-soft block w-full px-4 py-3 text-center text-sm">
            Create New Account
          </Link>

          <p className="ui-subtle mt-5 text-center text-xs">Encrypted sign-in and secure session management.</p>
        </section>
      </div>
    </div>
  );
};

export default Login;
