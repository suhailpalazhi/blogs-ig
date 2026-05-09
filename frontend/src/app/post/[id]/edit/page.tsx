'use client';

import { useParams } from 'next/navigation';
import PostEditor from '@/components/PostEditor';

export default function EditPostPage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  return <PostEditor mode="edit" postId={id} />;
}

