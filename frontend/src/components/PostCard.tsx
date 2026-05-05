import Link from 'next/link';
import { Heart, MessageCircle } from 'lucide-react';

interface PostCardProps {
  post: {
    id: number;
    title: string;
    content: string;
    category: string;
    likes_count: number;
    comments_count: number;
    image?: string | null;
    author_username: string;
    created_at: string;
  };
}

export default function PostCard({ post }: PostCardProps) {
  // Generate a random gradient if no image is present to make it look stunning
  const gradients = [
    'from-pink-300 to-rose-200',
    'from-fuchsia-300 to-purple-200',
    'from-rose-300 to-pink-200',
    'from-pink-400 to-fuchsia-300',
    'from-purple-300 to-pink-300'
  ];
  const bgGradient = gradients[post.id % gradients.length];

  return (
    <Link href={`/post/${post.id}`} className="group block mb-6 break-inside-avoid">
      <div className="glass-card rounded-3xl overflow-hidden relative">
        
        {/* Media or Gradient Fallback */}
        <div className="relative w-full overflow-hidden">
          {post.image ? (
            <img 
              src={post.image.startsWith('http') ? post.image : `http://127.0.0.1:8000${post.image}`} 
              alt={post.title} 
              className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className={`w-full h-56 bg-gradient-to-br ${bgGradient} transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100`}></div>
          )}
          
          <div className="absolute top-4 right-4">
            <span className="px-4 py-1.5 text-xs font-semibold bg-white/40 backdrop-blur-md text-text rounded-full border border-white/50 shadow-sm">
              {post.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-playfair text-2xl font-bold text-text mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <p className="text-text/70 text-sm line-clamp-3 mb-6 font-light leading-relaxed">
            {post.content}
          </p>

          <div className="flex items-center justify-between pt-5 border-t border-primary/10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-cta flex items-center justify-center text-xs font-bold text-white shadow-sm">
                {(post.author_username || '?').charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-text/80">
                @{post.author_username || 'Unknown'}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-text/60">
              <div className="flex items-center space-x-1.5 group-hover:text-primary transition-colors">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">{post.likes_count}</span>
              </div>
              <div className="flex items-center space-x-1.5 group-hover:text-cta transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{post.comments_count}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
