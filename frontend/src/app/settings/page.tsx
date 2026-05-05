'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Settings, Shield, Trash2, User as UserIcon } from 'lucide-react';

export default function SettingsPage() {
  const { user: currentUser, logout, fetchUser } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // General Form State
  const [generalData, setGeneralData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    bio: '',
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    // Fetch latest user data
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/me/');
        setGeneralData({
          username: res.data.username || '',
          email: res.data.email || '',
          first_name: res.data.first_name || '',
          last_name: res.data.last_name || '',
          bio: res.data.bio || '',
        });
      } catch (err) {
        console.error("Failed to fetch profile data for settings", err);
      }
    };
    fetchProfile();
  }, [currentUser, router]);

  if (!currentUser) return null;

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      await api.patch('/users/me/', generalData);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      fetchUser(); // Refresh global user context
    } catch (err: any) {
      setMessage({ 
        text: err.response?.data ? Object.values(err.response.data).flat().join(' ') : 'Failed to update profile.', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ text: 'Passwords do not match.', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      await api.post('/users/change-password/', { new_password: passwordData.new_password });
      setMessage({ text: 'Password changed successfully! You may need to log in again.', type: 'success' });
      setPasswordData({ new_password: '', confirm_password: '' });
    } catch (err: any) {
      setMessage({ text: 'Failed to change password.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (window.confirm("Are you ABSOLUTELY sure you want to permanently delete your account and all your artwork? This action CANNOT be undone.")) {
      setIsLoading(true);
      try {
        await api.delete('/users/me/');
        logout();
        router.push('/');
      } catch (err) {
        setMessage({ text: 'Failed to delete account.', type: 'error' });
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6 text-primary">
          <Settings className="w-10 h-10" />
        </div>
        <h1 className="font-playfair text-4xl md:text-5xl font-black text-text mb-4">Account Settings</h1>
        <p className="text-xl text-text/60 font-light">Manage your creative identity and security.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-2">
          <button
            onClick={() => { setActiveTab('general'); setMessage({text:'', type:''}); }}
            className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all ${activeTab === 'general' ? 'bg-primary text-white font-bold shadow-lg' : 'hover:bg-white/60 text-text/70'}`}
          >
            <UserIcon className="w-5 h-5" />
            <span>General</span>
          </button>
          <button
            onClick={() => { setActiveTab('security'); setMessage({text:'', type:''}); }}
            className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all ${activeTab === 'security' ? 'bg-primary text-white font-bold shadow-lg' : 'hover:bg-white/60 text-text/70'}`}
          >
            <Shield className="w-5 h-5" />
            <span>Security</span>
          </button>
          <button
            onClick={() => { setActiveTab('danger'); setMessage({text:'', type:''}); }}
            className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all ${activeTab === 'danger' ? 'bg-red-500 text-white font-bold shadow-lg' : 'hover:bg-red-50 text-red-500'}`}
          >
            <Trash2 className="w-5 h-5" />
            <span>Danger Zone</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-panel rounded-[3rem] p-8 md:p-12 shadow-sm relative overflow-hidden">
          {message.text && (
            <div className={`mb-8 p-4 border rounded-2xl text-sm font-medium text-center ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600'}`}>
              {message.text}
            </div>
          )}

          {activeTab === 'general' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="font-playfair text-3xl font-bold text-text mb-8">General Information</h2>
              <form onSubmit={handleGeneralSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-text/80 uppercase tracking-wider mb-2">Username</label>
                    <input
                      type="text"
                      required
                      value={generalData.username}
                      onChange={(e) => setGeneralData({...generalData, username: e.target.value})}
                      className="w-full px-5 py-4 bg-white/60 border border-white/80 rounded-2xl text-text focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text/80 uppercase tracking-wider mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={generalData.email}
                      onChange={(e) => setGeneralData({...generalData, email: e.target.value})}
                      className="w-full px-5 py-4 bg-white/60 border border-white/80 rounded-2xl text-text focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text/80 uppercase tracking-wider mb-2">First Name</label>
                    <input
                      type="text"
                      value={generalData.first_name}
                      onChange={(e) => setGeneralData({...generalData, first_name: e.target.value})}
                      className="w-full px-5 py-4 bg-white/60 border border-white/80 rounded-2xl text-text focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text/80 uppercase tracking-wider mb-2">Last Name</label>
                    <input
                      type="text"
                      value={generalData.last_name}
                      onChange={(e) => setGeneralData({...generalData, last_name: e.target.value})}
                      className="w-full px-5 py-4 bg-white/60 border border-white/80 rounded-2xl text-text focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-text/80 uppercase tracking-wider mb-2">Bio</label>
                  <textarea
                    rows={4}
                    value={generalData.bio}
                    onChange={(e) => setGeneralData({...generalData, bio: e.target.value})}
                    className="w-full px-5 py-4 bg-white/60 border border-white/80 rounded-2xl text-text focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-primary to-cta text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="font-playfair text-3xl font-bold text-text mb-8">Security</h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-text/80 uppercase tracking-wider mb-2">New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                    className="w-full px-5 py-4 bg-white/60 border border-white/80 rounded-2xl text-text focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text/80 uppercase tracking-wider mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                    className="w-full px-5 py-4 bg-white/60 border border-white/80 rounded-2xl text-text focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !passwordData.new_password || !passwordData.confirm_password}
                  className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-lg hover:bg-gray-800 transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="font-playfair text-3xl font-bold text-red-500 mb-4">Danger Zone</h2>
              <p className="text-text/70 mb-8">
                Permanently delete your account and all of your artwork. This action is irreversible and all your data will be wiped from our servers immediately.
              </p>
              
              <div className="p-6 bg-red-50 border border-red-200 rounded-3xl">
                <h3 className="font-bold text-red-700 mb-2">Delete Profile</h3>
                <p className="text-sm text-red-600/80 mb-6">You will lose access to your account and all your posts.</p>
                <button
                  onClick={handleDeleteProfile}
                  disabled={isLoading}
                  className="w-full py-4 bg-red-500 text-white font-bold rounded-2xl shadow-lg hover:bg-red-600 transition-all disabled:opacity-50 flex justify-center items-center space-x-2"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Yes, Delete My Account</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
