'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User, Menu, Plus } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-4 z-50 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
      <div className="glass-panel rounded-full px-6 py-3 flex justify-between items-center relative">
        <div className="flex-shrink-0 flex items-center">
          <Link href="/" className="font-playfair text-2xl font-bold text-gradient transition-transform hover:scale-105 tracking-tight">
            Campus Creatives
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-sm font-medium text-text/80 hover:text-primary transition-colors">
            Gallery
          </Link>
          
          {!loading && user ? (
            <div className="flex items-center space-x-6">
              <Link href="/create" className="flex items-center space-x-1 text-sm font-medium bg-white/50 text-text px-4 py-2 rounded-full border border-white/60 hover:bg-white/80 hover:text-primary hover:shadow-sm transition-all">
                <Plus className="w-4 h-4" />
                <span>Create</span>
              </Link>
              <div className="flex items-center space-x-4 border-l border-primary/10 pl-6">
                <Link href={`/profile/${user.username}`} className="text-sm text-text/70 hover:text-primary transition-colors">
                  Welcome, <span className="font-semibold text-text">{user.first_name || user.username}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-sm font-medium text-text/60 hover:text-primary transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
                <Link href={`/profile/${user.username}`} className="w-10 h-10 rounded-full flex items-center justify-center text-primary font-bold overflow-hidden border-2 border-white shadow-sm hover:scale-105 transition-transform bg-white/50">
                  {user.avatar ? (
                    <img src={`http://127.0.0.1:8000${user.avatar}`} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </Link>
              </div>
            </div>
          ) : !loading ? (
            <div className="flex items-center space-x-4 border-l border-primary/10 pl-6">
              <Link href="/login" className="text-sm font-medium text-text/80 hover:text-primary transition-colors">
                Log in
              </Link>
              <Link href="/register" className="text-sm font-medium bg-primary text-white px-5 py-2 rounded-full hover:bg-primary/90 shadow-[0_4px_14px_rgba(236,72,153,0.3)] hover:shadow-[0_6px_20px_rgba(236,72,153,0.4)] transition-all transform hover:-translate-y-0.5">
                Sign up
              </Link>
            </div>
          ) : null}
        </div>

        <div className="flex items-center md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-text hover:text-primary focus:outline-none">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-4 right-4 mt-2 origin-top transition-all duration-300 ${menuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}>
        <div className="glass-panel rounded-2xl p-4 space-y-4 shadow-xl">
           <Link href="/" className="block text-base font-medium text-text/80 hover:text-primary transition-colors px-2 py-1">
              Gallery
            </Link>
            {!loading && user ? (
              <>
                <Link href="/create" className="block text-base font-medium text-primary hover:text-primary/80 transition-colors px-2 py-1" onClick={() => setMenuOpen(false)}>
                  + Create Post
                </Link>
                <Link href={`/profile/${user.username}`} className="block text-base font-medium text-text/80 hover:text-primary transition-colors px-2 py-1" onClick={() => setMenuOpen(false)}>
                  My Profile
                </Link>
                <div className="text-sm text-text/60 py-2 border-t border-primary/10 px-2 mt-2">
                  Signed in as {user.username}
                </div>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="flex items-center space-x-2 text-base font-medium text-red-500 hover:text-red-600 transition-colors w-full text-left px-2 py-1"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : !loading ? (
              <div className="flex flex-col space-y-3 pt-2 border-t border-primary/10">
                <Link href="/login" onClick={() => setMenuOpen(false)} className="block text-base font-medium text-text/80 hover:text-primary transition-colors px-2 py-1">
                  Log in
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="block text-base text-center font-medium bg-primary text-white py-2 rounded-xl transition-colors">
                  Sign up
                </Link>
              </div>
            ) : null}
        </div>
      </div>
    </nav>
  );
}
