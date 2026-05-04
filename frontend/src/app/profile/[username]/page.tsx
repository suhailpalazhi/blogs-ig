'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import PostCard from '@/components/PostCard';
import { useAuth } from '@/context/AuthContext';
import { User as UserIcon, MapPin, Link as LinkIcon, CalendarDays } from 'lucide-react';

interface UserProfile {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  bio: string;
  avatar: string | null;
}

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  likes_count: number;
  comments_count: number;
  image?: string | null;
  author_username: string;
  created_at: string;
}

export default function ProfilePage() {
  const params = useParams();
  const username = params?.username as string;
  const { user: currentUser } = useAuth();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!username) return;

    const fetchProfileAndPosts = async () => {
      try {
        const [profileRes, postsRes] = await Promise.all([
          api.get(`/users/${username}/`),
          api.get(`/posts/?author__username=${username}`)
        ]);
        
        setProfile(profileRes.data);
        const postsData = Array.isArray(postsRes.data) ? postsRes.data : postsRes.data.results || [];
        setPosts(postsData);
      } catch (err: any) {
        console.error('Failed to fetch profile', err);
        setError('User not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="font-playfair text-3xl text-text font-bold mb-4">{error || 'User not found'}</h2>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.username === profile.username;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Profile Header */}
      <div className="glass-panel rounded-[3rem] p-10 md:p-16 mb-16 relative overflow-hidden">
        {/* Soft decorative blur */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-gradient-to-l from-primary/10 to-cta/10 blur-[100px] -z-10 rounded-full mix-blend-multiply"></div>

        <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-12 relative z-10">
          <div className="flex-shrink-0 w-40 h-40 md:w-56 md:h-56 rounded-full bg-gradient-to-tr from-primary to-cta p-1.5 shadow-[0_12px_40px_rgba(236,72,153,0.3)]">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white">
               {profile.avatar ? (
                  <img src={`http://127.0.0.1:8000${profile.avatar}`} alt={profile.username} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-20 h-20 text-primary/30" />
                )}
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left pt-4">
            <h1 className="font-playfair text-4xl md:text-6xl font-black text-text mb-2 tracking-tight">
              {profile.first_name || profile.last_name ? `${profile.first_name} ${profile.last_name}` : profile.username}
            </h1>
            <p className="text-2xl text-primary font-medium mb-6">@{profile.username}</p>
            
            <div className="text-text/80 max-w-3xl text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-light">
              {profile.bio || "This user hasn't added a bio yet. They prefer their art to speak for itself."}
            </div>
            
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="mb-10 border-b border-primary/10 pb-6">
        <h2 className="font-playfair text-3xl font-bold text-text">Portfolio <span className="text-primary/50 text-2xl font-normal ml-2">({posts.length})</span></h2>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-24 glass-panel rounded-3xl">
          <p className="text-xl text-text/50 font-light italic">This creative hasn't published any works yet.</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
