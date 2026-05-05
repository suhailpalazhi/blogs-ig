'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Heart, MessageCircle, Send, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Comment {
  id: number;
  user_username: string;
  content: string;
  created_at: string;
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
  has_liked?: boolean;
}

export default function PostDetail() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;

    const fetchPostAndComments = async () => {
      try {
        const [postRes, commentsRes] = await Promise.all([
          api.get(`/posts/${id}/`),
          api.get(`/interactions/comments/?post=${id}`)
        ]);
        setPost(postRes.data);
        
        const commentsData = Array.isArray(commentsRes.data) ? commentsRes.data : commentsRes.data.results || [];
        setComments(commentsData);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  const handleLike = async () => {
    if (!user || !post) return alert('Please log in to like this post.');
    
    const previousState = { ...post };
    const newlyLiked = !post.has_liked;
    
    setPost({
      ...post,
      has_liked: newlyLiked,
      likes_count: post.likes_count + (newlyLiked ? 1 : -1)
    });

    try {
      await api.post(`/posts/${id}/toggle_like/`);
    } catch (error) {
      setPost(previousState);
      console.error('Failed to toggle like', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('Please log in to comment.');
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.post('/interactions/comments/', {
        post: id,
        content: commentText
      });
      setComments([...comments, res.data]);
      setCommentText('');
      if (post) {
        setPost({ ...post, comments_count: post.comments_count + 1 });
      }
    } catch (error) {
      console.error('Failed to post comment', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this beautiful post? This action cannot be undone.')) return;
    setIsDeleting(true);
    try {
      await api.delete(`/posts/${id}/`);
      router.push('/');
    } catch (error) {
      console.error('Failed to delete post', error);
      alert('Failed to delete the post.');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-32">
        <h2 className="font-playfair text-3xl text-text font-bold mb-4">Post not found</h2>
        <Link href="/" className="text-primary font-medium hover:text-primary/80 transition-colors">Return to Gallery</Link>
      </div>
    );
  }

  const bgGradient = 'from-pink-100 to-fuchsia-100';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <Link href="/" className="inline-flex items-center space-x-2 text-text/60 hover:text-primary transition-colors font-medium">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Gallery</span>
        </Link>
        
        {user?.username === post.author_username && (
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center space-x-2 text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-full font-medium transition-colors disabled:opacity-50 border border-red-100"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span>Delete Post</span>
          </button>
        )}
      </div>

      <article className="glass-panel rounded-[2.5rem] overflow-hidden mb-16">
        {/* Media Header */}
        <div className="relative w-full min-h-[400px] max-h-[700px] bg-white/50 flex justify-center items-center">
          {post.image ? (
            <img 
              src={post.image.startsWith('http') ? post.image : `http://127.0.0.1:8000${post.image}`} 
              alt={post.title} 
              className="w-full h-full object-cover max-h-[700px]"
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient}`}></div>
          )}
          
          <div className="absolute top-6 left-6">
             <span className="px-5 py-2 text-sm font-semibold bg-white/60 backdrop-blur-md text-text rounded-full shadow-sm border border-white/80">
              {post.category}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 md:p-16">
          <h1 className="font-playfair text-4xl md:text-6xl font-black text-text tracking-tight mb-8 leading-[1.1]">
            {post.title}
          </h1>
          
          <div className="flex items-center space-x-4 mb-12 pb-12 border-b border-primary/10">
            <Link href={`/profile/${post.author_username}`}>
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-cta flex items-center justify-center text-xl font-bold text-white shadow-md hover:scale-105 transition-transform">
                {(post.author_username || '?').charAt(0).toUpperCase()}
              </div>
            </Link>
            <div>
              <Link href={`/profile/${post.author_username}`} className="font-bold text-lg text-text hover:text-primary transition-colors">
                @{post.author_username || 'Unknown'}
              </Link>
              <div className="text-sm text-text/50 font-medium">{new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none mb-16">
            <p className="text-xl text-text/80 leading-relaxed font-light whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          {/* Interaction Bar */}
          <div className="flex items-center space-x-8 py-8 border-t border-b border-primary/10 mb-16">
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-3 group ${post.has_liked ? 'text-primary' : 'text-text/40 hover:text-primary'} transition-colors`}
            >
              <div className={`p-3 rounded-full ${post.has_liked ? 'bg-primary/10' : 'bg-transparent group-hover:bg-primary/5'} transition-colors`}>
                <Heart className={`w-8 h-8 ${post.has_liked ? 'fill-current' : ''} transition-all duration-300`} />
              </div>
              <span className="text-2xl font-bold">{post.likes_count}</span>
            </button>
            <div className="flex items-center space-x-3 text-text/40">
              <div className="p-3 rounded-full bg-transparent">
                <MessageCircle className="w-8 h-8" />
              </div>
              <span className="text-2xl font-bold">{post.comments_count}</span>
            </div>
          </div>

          {/* Comments Section */}
          <div className="max-w-3xl mx-auto">
            <h3 className="font-playfair text-3xl font-bold text-text mb-8">Discussions</h3>
            
            {user ? (
              <form onSubmit={handleComment} className="mb-12 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-cta rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white/80 backdrop-blur-xl border border-white rounded-2xl">
                  <textarea
                    className="w-full bg-transparent p-6 text-text placeholder-text/40 focus:outline-none resize-none font-medium"
                    placeholder="Share your thoughts with the creator..."
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                  />
                  <div className="px-6 pb-4 flex justify-end border-t border-primary/10 pt-4">
                    <button
                      type="submit"
                      disabled={submitting || !commentText.trim()}
                      className="px-6 py-2.5 bg-gradient-to-r from-primary to-cta text-white font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none flex items-center space-x-2"
                    >
                      <span>Post</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="mb-12 p-8 glass-panel rounded-2xl text-center">
                <p className="text-text/60 mb-4 text-lg">Join the conversation to leave a comment.</p>
                <Link href="/login" className="inline-block px-8 py-3 bg-gradient-to-r from-primary to-cta text-white font-bold rounded-full hover:shadow-[0_8px_24px_rgba(236,72,153,0.3)] transition-all transform hover:-translate-y-1">
                  Log in to comment
                </Link>
              </div>
            )}

            <div className="space-y-6">
              {comments.length === 0 ? (
                <p className="text-text/40 italic text-center py-8 text-lg font-light">No comments yet. Start the conversation!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="glass-panel p-6 rounded-3xl flex space-x-5 transition-transform hover:-translate-y-1">
                    <Link href={`/profile/${comment.user_username}`}>
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-white flex items-center justify-center text-lg font-bold text-cta shadow-sm">
                        {(comment.user_username || '?').charAt(0).toUpperCase()}
                      </div>
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <Link href={`/profile/${comment.user_username}`} className="font-bold text-text hover:text-primary transition-colors">
                          @{comment.user_username || 'Unknown'}
                        </Link>
                        <span className="text-xs font-medium text-text/40">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-text/80 leading-relaxed font-light">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
