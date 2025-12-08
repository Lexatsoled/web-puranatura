import React, { useEffect, useRef } from 'react';
import { BlogPost } from '../../types/blog';
import { XIcon } from '../icons';

interface BlogPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: BlogPost | null;
}

const BlogPostModal: React.FC<BlogPostModalProps> = ({
  isOpen,
  onClose,
  post,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !post) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-64 object-cover rounded-t-lg"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            aria-label="Cerrar"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span>
              {post.date ? new Date(post.date).toLocaleDateString() : ''}
            </span>
            <span>•</span>
            <span>{post.author || 'PuraNatura'}</span>
            <span>•</span>
            <span>{post.readTime || 5} min de lectura</span>
          </div>

          <h2 className="text-3xl font-bold font-display text-green-900 mb-6">
            {post.title}
          </h2>

          <div
            className="prose prose-green max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogPostModal;
