'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import PostCard from '@/components/PostCard';
import { Sparkles } from 'lucide-react';

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

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts/');
        const data = Array.isArray(response.data) ? response.data : response.data.results || [];
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      
      {/* Editorial Hero Section */}
      <div className="py-20 md:py-32 text-center flex flex-col items-center justify-center relative">
        <div className="absolute top-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10 mix-blend-multiply"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-cta/20 rounded-full blur-[100px] -z-10 mix-blend-multiply"></div>
        
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-panel text-sm font-medium text-primary mb-8 animate-fade-in-up">
          <Sparkles className="w-4 h-4" />
          <span>Curated for Creativity</span>
        </div>
        
        <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-black text-text tracking-tight mb-6 leading-[1.1]">
          The Art of <br />
          <span className="text-gradient">Expression.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-text/70 max-w-2xl mx-auto font-light leading-relaxed">
          Explore an editorial collection of the latest creative projects, digital art, and aesthetic thoughts from students across the campus.
        </p>
      </div>

      {/* Bento Grid / Gallery */}
      <div className="mb-12 flex justify-between items-end border-b border-primary/10 pb-6">
        <h2 className="font-playfair text-3xl font-bold text-text">Latest Works</h2>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-32 glass-panel rounded-3xl">
          <p className="text-xl text-text/60 font-light">No projects found yet. Be the first to share your creativity!</p>
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
