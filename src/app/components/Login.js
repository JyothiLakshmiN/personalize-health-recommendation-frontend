'use client';
import { login as loginAPI } from '../../api/apis';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginAPI({ email, password });
      if (res.data.access_token) {
        setToken(res.data.access_token);
        localStorage.setItem('token', res.data.access_token);
        setError('');
        window.location.href = '/'; // Redirect on success
      } else {
        setError('Login failed. Check credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Fullscreen background */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/register-login.png')",
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10"></div>

      {/* Login Card */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-md rounded-2xl p-8 sm:p-10 w-[90%] max-w-md shadow-xl"
        >
          <h2 className="text-3xl font-bold text-center text-green-900 mb-6 tracking-tight">
            🌿 Welcome Back
          </h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="mt-1 w-full px-4 py-3 border border-green-300 bg-white rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none placeholder:text-gray-500 text-gray-800"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="mt-1 w-full px-4 py-3 border border-green-300 bg-white rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none placeholder:text-gray-500 text-gray-800"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-2.5 px-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Login'}
            </button>
          </form>

          <p className="text-sm text-center text-gray-700 mt-6">
            Don't have an account?{' '}
            <a href="/register" className="text-green-600 hover:underline font-medium">
              Register
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
