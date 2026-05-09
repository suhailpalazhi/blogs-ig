'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import imageCompression from 'browser-image-compression';
import { ImagePlus, Sparkles, X } from 'lucide-react';
import Link from 'next/link';

type Mode = 'create' | 'edit';

type PostEditorProps = {
  mode: Mode;
  postId?: string;
};

type FormState = {
  title: string;
  category: string;
  content: string;
};

export default function PostEditor({ mode, postId }: PostEditorProps) {
  const { user } = useAuth();
  const router = useRouter();
  const isMissingEditId = mode === 'edit' && !postId;

  const [formData, setFormData] = useState<FormState>({
    title: '',
    category: '',
    content: '',
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [clearImage, setClearImage] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isPrefilling, setIsPrefilling] = useState(mode === 'edit' && !!postId);
  const [error, setError] = useState('');

  const submitLabel = useMemo(() => {
    // User requested same interface/label as create.
    return 'Publish Masterpiece';
  }, []);

  useEffect(() => {
    if (mode !== 'edit') return;
    if (!postId) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await api.get(`/posts/${postId}/`);
        if (cancelled) return;

        // Client-side guard: author-only editing (backend enforces too).
        if (user?.username && res.data?.author_username && user.username !== res.data.author_username) {
          router.push(`/post/${postId}`);
          return;
        }

        setFormData({
          title: res.data?.title ?? '',
          category: res.data?.category ?? '',
          content: res.data?.content ?? '',
        });

        const img = res.data?.image;
        if (img) {
          setImagePreview(img.startsWith('http') ? img : `http://127.0.0.1:8000${img}`);
          setClearImage(false);
        } else {
          setImagePreview(null);
          setClearImage(false);
        }
      } catch (e: unknown) {
        if (cancelled) return;
        console.error('Failed to prefill post editor.', e);
        setError('Failed to load post. Please try again.');
      } finally {
        if (!cancelled) setIsPrefilling(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mode, postId, router, user?.username]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="text-center glass-panel p-16 rounded-[3rem] shadow-xl max-w-lg">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <Sparkles className="w-10 h-10" />
          </div>
          <h2 className="font-playfair text-4xl font-bold text-text mb-4">Inspiration Awaits</h2>
          <p className="text-text/60 mb-8 text-lg font-light">
            You must be logged in to share your beautiful creativity with the world.
          </p>
          <Link
            href="/login"
            className="inline-block px-10 py-4 bg-gradient-to-r from-primary to-cta text-white rounded-full font-bold shadow-lg hover:shadow-[0_12px_30px_rgba(236,72,153,0.3)] transition-all transform hover:-translate-y-1"
          >
            Log In Now
          </Link>
        </div>
      </div>
    );
  }

  if (isMissingEditId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="glass-panel rounded-[3rem] p-10 md:p-16 shadow-[0_20px_60px_rgba(236,72,153,0.08)]">
          <div className="p-5 bg-red-50/80 border border-red-200 rounded-2xl text-red-600 text-sm font-medium">
            Missing post id.
          </div>
        </div>
      </div>
    );
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      setIsLoading(true);
      try {
        const options = {
          maxSizeMB: 1.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        setImage(compressedFile);
        setClearImage(false);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(compressedFile);
      } catch (err) {
        console.error('Error compressing image:', err);
        setImage(file);
        setClearImage(false);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setImage(null);
    setImagePreview(null);
    if (mode === 'edit') setClearImage(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('content', formData.content);

    if (image) {
      data.append('image', image);
    } else if (mode === 'edit' && clearImage) {
      data.append('clear_image', 'true');
    }

    try {
      if (mode === 'create') {
        const response = await api.post('/posts/', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        router.push(`/post/${response.data.id}`);
      } else {
        if (!postId) throw new Error('Missing post id.');
        await api.patch(`/posts/${postId}/`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        router.push(`/post/${postId}`);
      }
    } catch (err: unknown) {
      const maybeAxiosErr = err as { response?: { data?: { detail?: string } } };
      const detail = maybeAxiosErr.response?.data?.detail;
      setError(detail || (mode === 'create' ? 'Failed to create post. Please try again.' : 'Failed to update post. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="glass-panel rounded-[3rem] p-10 md:p-16 shadow-[0_20px_60px_rgba(236,72,153,0.08)] relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10 mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cta/10 rounded-full blur-[80px] -z-10 mix-blend-multiply"></div>

        <div className="mb-12">
          <h1 className="font-playfair text-5xl font-black text-text mb-4">Share Your Vision</h1>
          <p className="text-xl text-text/60 font-light">Bring your latest masterpiece to the Campus Creatives gallery.</p>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-red-50/80 border border-red-200 rounded-2xl text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        {isPrefilling ? (
          <div className="flex justify-center items-center min-h-[40vh]">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload Area */}
            <div className="relative group">
              {!imagePreview && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
              )}
              <div
                className={`w-full h-72 md:h-96 rounded-[2rem] border-2 border-dashed ${
                  imagePreview ? 'border-transparent' : 'border-primary/20 hover:border-primary/50'
                } flex flex-col items-center justify-center bg-white/40 transition-all duration-300 overflow-hidden relative shadow-sm group-hover:shadow-md group-hover:bg-white/60`}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 z-20">
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="p-3 bg-red-500/90 hover:bg-red-600 text-white rounded-full shadow-lg transition-all transform hover:scale-110 flex items-center justify-center backdrop-blur-sm"
                        title="Remove image"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <ImagePlus className="w-10 h-10 text-primary/60" />
                    </div>
                    <span className="text-text/70 font-medium text-lg">Click to upload your artwork</span>
                    <span className="text-text/40 text-sm mt-2">JPEG, PNG, WebP (Optional)</span>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-text/80 uppercase tracking-wider">Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleTextChange}
                  className="w-full px-6 py-4 bg-white/60 border border-white/80 rounded-2xl text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all shadow-sm placeholder-text/30 font-medium text-lg"
                  placeholder="Name your creation"
                />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-bold text-text/80 uppercase tracking-wider">Category *</label>
                <input
                  type="text"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleTextChange}
                  className="w-full px-6 py-4 bg-white/60 border border-white/80 rounded-2xl text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all shadow-sm placeholder-text/30 font-medium text-lg"
                  placeholder="e.g. Fine Art, 3D Design"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-text/80 uppercase tracking-wider">The Story *</label>
              <textarea
                name="content"
                required
                rows={8}
                value={formData.content}
                onChange={handleTextChange}
                className="w-full px-6 py-5 bg-white/60 border border-white/80 rounded-2xl text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all shadow-sm placeholder-text/30 font-medium text-lg resize-none leading-relaxed"
                placeholder="Tell us about the inspiration behind this piece..."
              />
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-1/3 py-5 px-6 bg-white/60 border border-white text-text/80 font-bold rounded-2xl shadow-sm hover:bg-white hover:text-text hover:shadow-md transition-all focus:outline-none flex justify-center items-center text-xl hover:scale-[1.01]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.title || !formData.content || !formData.category}
                className="w-full sm:w-2/3 py-5 px-6 bg-gradient-to-r from-primary to-cta text-white font-bold rounded-2xl shadow-[0_8px_20px_rgba(236,72,153,0.3)] hover:shadow-[0_12px_30px_rgba(236,72,153,0.4)] transition-all focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center space-x-3 text-xl hover:scale-[1.01]"
              >
                {isLoading ? (
                  <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    <span>{submitLabel}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

