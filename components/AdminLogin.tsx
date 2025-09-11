'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { loginUser, setUserSession } from '../lib/supabase';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await loginUser(username, password);
      
      if (error) {
        setError(error);
      } else if (data) {
        // Set user session in localStorage
        setUserSession(data);
        onLoginSuccess();
      }
    } catch (err) {
      setError('Terjadi kesalahan saat login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-slate-100 flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-900 to-blue-800 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-br from-green-600 to-green-500 rounded-full blur-3xl transform translate-x-1/3"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-900 via-blue-800 to-green-600 rounded-full blur-3xl transform translate-y-1/3"></div>
      </div>

      <div className="w-full max-w-md mx-auto p-6 relative z-10">
        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden">
          {/* Header */}
          <div className="text-center py-8 px-6 bg-gradient-to-r from-blue-900 to-green-600">
            <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-lg rounded-2xl mb-4">
              <Image
                src="/logo.svg"
                alt="JSR Logo"
                width={80}
                height={40}
                className="h-8 w-auto"
                priority
              />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-blue-100">Masuk untuk mengakses dashboard admin</p>
          </div>

          {/* Login Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                  ❌ {error}
                </div>
              )}

              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Masukkan username"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Masukkan password"
                  required
                  disabled={loading}
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading || !username || !password}
                className="w-full bg-gradient-to-r from-blue-900 to-green-600 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-800 hover:to-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Memproses...
                  </>
                ) : (
                  'Masuk'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-slate-600 hover:text-blue-900 transition-colors text-sm"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
