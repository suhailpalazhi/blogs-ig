'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authApi.post('/token/', { username, password });
      login(response.data.access, response.data.refresh);
      router.push('/');
    } catch {
      setError('Invalid username or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 mix-blend-multiply"></div>
      
      <div className="w-full max-w-md p-10 md:p-12 glass-panel rounded-[3rem] shadow-[0_20px_60px_rgba(236,72,153,0.1)] relative overflow-hidden">
        
        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-cta mb-6 shadow-lg transform hover:scale-105 transition-transform">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-playfair text-4xl font-black text-text">Welcome Back</h2>
          <p className="text-text/60 mt-3 text-lg font-light">Enter your details to access your account.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-medium text-center relative z-10">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-bold text-text/80 uppercase tracking-wider mb-2">Username</label>
            <input
              type="text"
              required
              className="w-full px-6 py-4 bg-white/60 border border-white/80 rounded-2xl text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all shadow-sm placeholder-text/30 font-medium text-lg"
              placeholder="e.g. alice_art"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-text/80 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full px-6 py-4 bg-white/60 border border-white/80 rounded-2xl text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all shadow-sm placeholder-text/30 font-medium text-lg"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <Link href="/forgot-password" className="text-sm font-medium text-primary hover:text-cta transition-colors">
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-4 bg-gradient-to-r from-primary to-cta text-white font-bold text-lg rounded-2xl hover:shadow-[0_8px_20px_rgba(236,72,153,0.3)] transition-all focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-primary disabled:opacity-50 flex justify-center items-center mt-8 hover:-translate-y-0.5"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="mt-10 text-center text-text/60 relative z-10">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-bold text-primary hover:text-cta transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
