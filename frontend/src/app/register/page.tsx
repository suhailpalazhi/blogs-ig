'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import Link from 'next/link';
import { Sparkles, ImagePlus } from 'lucide-react';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    bio: '',
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (avatar) {
      data.append('avatar', avatar);
    }

    try {
      await authApi.post('/v1/users/register/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      router.push('/login');
    } catch (err: unknown) {
      const maybeAxiosErr = err as { response?: { data?: Record<string, unknown> } };
      const errorMsg = maybeAxiosErr.response?.data
        ? Object.values(maybeAxiosErr.response.data).flat().join(' ')
        : 'Registration failed. Please try again.';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] py-16 px-4 relative">
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] -z-10 mix-blend-multiply"></div>
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-cta/10 rounded-full blur-[150px] -z-10 mix-blend-multiply"></div>
      
      <div className="w-full max-w-2xl p-10 md:p-14 glass-panel rounded-[3rem] shadow-[0_20px_60px_rgba(236,72,153,0.1)] relative overflow-hidden">
        
        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-cta mb-6 shadow-lg transform hover:scale-105 transition-transform">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-playfair text-4xl md:text-5xl font-black text-text">Join the Community</h2>
          <p className="text-text/60 mt-4 text-lg font-light">Create an account to start sharing your beautiful work.</p>
        </div>

        {error && (
           <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-medium text-center relative z-10">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          
          <div className="flex justify-center mb-10">
            <div className="relative group cursor-pointer w-32 h-32">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="w-full h-full rounded-full border-4 border-white shadow-md overflow-hidden bg-white/60 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-primary/40 flex flex-col items-center">
                    <ImagePlus className="w-8 h-8 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Upload</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-text/80 uppercase tracking-wider mb-2">Username *</label>
              <input
                type="text"
                name="username"
                required
                className="w-full px-5 py-4 bg-white/60 border border-white/80 rounded-2xl text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all shadow-sm placeholder-text/30 font-medium"
                value={formData.username}
                onChange={handleTextChange}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-text/80 uppercase tracking-wider mb-2">Email *</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-5 py-4 bg-white/60 border border-white/80 rounded-2xl text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all shadow-sm placeholder-text/30 font-medium"
                value={formData.email}
                onChange={handleTextChange}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-text/80 uppercase tracking-wider mb-2">First Name</label>
              <input
                type="text"
                name="first_name"
                className="w-full px-5 py-4 bg-white/60 border border-white/80 rounded-2xl text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all shadow-sm placeholder-text/30 font-medium"
                value={formData.first_name}
                onChange={handleTextChange}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-text/80 uppercase tracking-wider mb-2">Last Name</label>
              <input
                type="text"
                name="last_name"
                className="w-full px-5 py-4 bg-white/60 border border-white/80 rounded-2xl text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all shadow-sm placeholder-text/30 font-medium"
                value={formData.last_name}
                onChange={handleTextChange}
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-text/80 uppercase tracking-wider mb-2">Password *</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-5 py-4 bg-white/60 border border-white/80 rounded-2xl text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all shadow-sm placeholder-text/30 font-medium"
              value={formData.password}
              onChange={handleTextChange}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-text/80 uppercase tracking-wider mb-2">Bio</label>
            <textarea
              name="bio"
              rows={3}
              className="w-full px-5 py-4 bg-white/60 border border-white/80 rounded-2xl text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all shadow-sm placeholder-text/30 font-medium resize-none"
              placeholder="Tell us a little bit about yourself..."
              value={formData.bio}
              onChange={handleTextChange}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !formData.username || !formData.email || !formData.password}
            className="w-full py-5 px-4 bg-gradient-to-r from-primary to-cta text-white font-bold text-lg rounded-2xl hover:shadow-[0_8px_20px_rgba(236,72,153,0.3)] transition-all focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-primary disabled:opacity-50 flex justify-center items-center mt-10 hover:-translate-y-0.5"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="mt-10 text-center text-text/60 relative z-10">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-primary hover:text-cta transition-colors">
            Log in instead
          </Link>
        </p>
      </div>
    </div>
  );
}
