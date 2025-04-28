'use client';
import { useState } from 'react';
import { register as registerAPI } from '../../api/apis';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function Register() {
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

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerAPI({ email, password });
      if (res.status === 201) {
        alert('Registered successfully!');
        window.location.href = '/login';
      } else {
        setError(res.data.msg || 'Registration failed.');
      }
    } catch (err) {
      setError('Something went wrong.');
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

      {/* Light transparent overlay */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>

      {/* Form Section */}
      <div className="relative z-20 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 sm:p-10 w-[90%] max-w-md shadow-lg"
        >
          <div className="flex flex-col items-center mb-6">
            <div className="text-green-700 text-5xl mb-2">🥦</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-green-900">Create Account</h2>
          </div>

          {error && (
            <p className="text-red-600 text-center mb-4 text-sm">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-green-400 bg-white focus:ring-2 focus:ring-green-500 outline-none placeholder:text-gray-500 text-gray-800"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-green-400 bg-white focus:ring-2 focus:ring-green-500 outline-none placeholder:text-gray-500 text-gray-800"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-2.5 rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Register'}
            </button>
          </form>

          <p className="text-center text-sm text-green-900 mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-green-700 font-medium hover:underline">
              Login
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
